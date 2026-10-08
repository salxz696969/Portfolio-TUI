import React from "react";
import { render } from "ink";
import App from "./App";

const enterAlt = "\x1b[?1049h";
const leaveAlt = "\x1b[?1049l";
const hideCursor = "\x1b[?25l";
const showCursor = "\x1b[?25h";
const disableMouse = "\x1b[?1000l\x1b[?1002l\x1b[?1003l\x1b[?1006l";

process.stdout.write(enterAlt + hideCursor + disableMouse);

const restore = () => process.stdout.write(showCursor + leaveAlt);
process.on("exit", restore);

// Incremental rendering rewrites only the lines that changed, which keeps
// animations cheap when the app is streamed to a browser over ttyd.
const { waitUntilExit } = render(<App />, {
  exitOnCtrlC: false,
  incrementalRendering: true,
  maxFps: 30,
});

waitUntilExit().then(() => process.exit(0));
