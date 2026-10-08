import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { StringDecoder } from "node:string_decoder";
import { useEffect } from "react";

/**
 * Mouse support. With SGR mouse tracking on, the terminal reports wheel and
 * clicks as `ESC [ < button ; x ; y M|m`. Without it, browsers running ttyd
 * turn the wheel into ↑/↓ key presses, which would move the menu instead of
 * scrolling. Ink doesn't parse mouse input, so stdin is filtered here: mouse
 * reports become events and everything else is passed on to Ink.
 */
export const enableMouse = "\x1b[?1000h\x1b[?1006h";
export const disableMouse = "\x1b[?1000l\x1b[?1002l\x1b[?1003l\x1b[?1006l";

export interface MouseEvent {
  type: "wheelUp" | "wheelDown" | "click";
  /** 0-based cell coordinates. */
  x: number;
  y: number;
}

const events = new EventEmitter();
const SGR_MOUSE = /\x1b\[<(\d+);(\d+);(\d+)([Mm])/g;

export function createFilteredStdin(src: NodeJS.ReadStream = process.stdin) {
  const out = new PassThrough() as PassThrough & {
    isTTY: boolean;
    setRawMode: (mode: boolean) => typeof out;
    ref: () => typeof out;
    unref: () => typeof out;
  };
  out.isTTY = Boolean(src.isTTY);
  out.setRawMode = (mode) => {
    src.setRawMode?.(mode);
    return out;
  };
  out.ref = () => (src.ref(), out);
  out.unref = () => (src.unref(), out);

  const decoder = new StringDecoder("utf8");
  src.on("data", (chunk: Buffer) => {
    const rest = decoder.write(chunk).replace(SGR_MOUSE, (_, b, x, y, kind) => {
      const button = Number(b);
      const pos = { x: Number(x) - 1, y: Number(y) - 1 };
      if (button === 64) events.emit("mouse", { type: "wheelUp", ...pos });
      else if (button === 65) events.emit("mouse", { type: "wheelDown", ...pos });
      else if (button === 0 && kind === "M") events.emit("mouse", { type: "click", ...pos });
      return "";
    });
    if (rest) out.write(rest);
  });
  return out;
}

export function useMouse(handler: (e: MouseEvent) => void, isActive = true) {
  useEffect(() => {
    if (!isActive) return;
    events.on("mouse", handler);
    return () => {
      events.off("mouse", handler);
    };
  }, [handler, isActive]);
}
