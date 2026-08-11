import React from "react";
import { render } from "ink";
import App from "./App";

const enterAlt = "\x1b[?1049h";
const leaveAlt = "\x1b[?1049l";
const hideCursor = "\x1b[?25l";
const showCursor = "\x1b[?25h";
const disableMouse = "\x1b[?1000l\x1b[?1002l\x1b[?1003l\x1b[?1006l";

process.stdout.write(enterAlt + hideCursor + disableMouse);

process.on("exit", () => {
  process.stdout.write(showCursor + leaveAlt);
});

const { waitUntilExit } = render(<App />, { exitOnCtrlC: false });

waitUntilExit().then(() => {
  process.stdout.write(showCursor + leaveAlt);
});
