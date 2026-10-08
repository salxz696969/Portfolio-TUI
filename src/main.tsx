import React from "react";
import { render } from "ink";
import App from "./App";
import { createFilteredStdin, disableMouse, enableMouse } from "./mouse";
import { attachImages } from "./images";

const enterAlt = "\x1b[?1049h";
const leaveAlt = "\x1b[?1049l";
const hideCursor = "\x1b[?25l";
const showCursor = "\x1b[?25h";

process.stdout.write(enterAlt + hideCursor + enableMouse);

const restore = () => process.stdout.write(disableMouse + showCursor + leaveAlt);
process.on("exit", restore);

attachImages(process.stdout);

// Incremental rendering rewrites only the lines that changed, which keeps
// animations cheap when the app is streamed to a browser over ttyd.
const { waitUntilExit } = render(<App />, {
  stdin: createFilteredStdin() as unknown as NodeJS.ReadStream,
  exitOnCtrlC: false,
  incrementalRendering: true,
  // Ink throttles both rendering and writing, which halves this in practice:
  // 120 gives ~60 fps (one frame per 16 ms) for smooth text streaming.
  maxFps: 120,
});

waitUntilExit().then(() => process.exit(0));
