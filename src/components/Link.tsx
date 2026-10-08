import React from "react";
import { Text } from "ink";
import type { TextProps } from "ink";

/**
 * OSC 8 terminal hyperlink. Terminals that support it (xterm.js under ttyd,
 * iTerm2, kitty, Windows Terminal…) make `children` clickable; others just
 * print the label.
 */
export default function Link({ url, children, ...props }: { url: string; children?: string } & TextProps) {
  return <Text {...props}>{`\x1b]8;;${url}\x07${children ?? url}\x1b]8;;\x07`}</Text>;
}
