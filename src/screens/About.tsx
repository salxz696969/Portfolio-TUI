import React from "react";
import { Text } from "ink";
import ScreenView, { wrapText } from "../components/ScreenView";
import { aboutParagraphs, quickFacts } from "../data/content";
import { theme } from "../theme";
import type { ScreenProps } from "./types";

export default function About({ width, height, animate }: ScreenProps) {
  const textWidth = Math.min(width, 76);
  const lines: React.ReactNode[] = [];

  aboutParagraphs.forEach((p, i) => {
    if (i > 0) lines.push("");
    lines.push(...wrapText(p, textWidth));
  });

  lines.push("");
  for (const [label, value] of quickFacts) {
    lines.push(
      <Text>
        <Text color={theme.accent}>{"  " + label.padEnd(10)}</Text>
        <Text>{value}</Text>
      </Text>
    );
  }

  return <ScreenView title="About Me" lines={lines} width={width} height={height} animate={animate} />;
}
