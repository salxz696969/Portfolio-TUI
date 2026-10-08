import { span, type Line } from "../lines";

/** Highlighted hint shown under clickable links. */
export const linkTip: Line = [
  span(" TIP ", { bg: "yellow", color: "black", bold: true }),
  span(" Click a link to open it ", { color: "yellow", bold: true }),
  span("(ctrl/⌘ + click in a local terminal)", { color: "yellow", dim: true }),
];
