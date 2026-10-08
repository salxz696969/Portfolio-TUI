import React from "react";
import { render } from "ink";
import App from "./App";
import { createFilteredStdin, disableMouse, enableMouse } from "./mouse";

const enterAlt = "\x1b[?1049h";
const leaveAlt = "\x1b[?1049l";
const hideCursor = "\x1b[?25l";
const showCursor = "\x1b[?25h";

process.stdout.write(enterAlt + hideCursor + enableMouse);

const restore = () => process.stdout.write(disableMouse + showCursor + leaveAlt);
process.on("exit", restore);

// Incremental rendering rewrites only the lines that changed, which keeps
// animations cheap when the app is streamed to a browser over ttyd.
const { waitUntilExit } = render(<App />, {
  stdin: createFilteredStdin() as unknown as NodeJS.ReadStream,
  exitOnCtrlC: false,
  incrementalRendering: true,
  maxFps: 30,
});

waitUntilExit().then(() => process.exit(0));
