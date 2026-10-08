import React from "react";
import ScreenView from "../components/ScreenView";
import { aboutParagraphs, quickFacts } from "../data/content";
import { span, wrapText, type Line } from "../lines";
import { theme } from "../theme";
import type { ScreenProps } from "./types";

export default function About({ width, height }: ScreenProps) {
  const textWidth = Math.min(width, 76);
  const lines: Line[] = [];

  aboutParagraphs.forEach((p, i) => {
    if (i > 0) lines.push([]);
    for (const l of wrapText(p, textWidth)) lines.push([span(l)]);
  });

  lines.push([]);
  for (const [label, value] of quickFacts) {
    lines.push([span("  " + label.padEnd(10), { color: theme.accent }), span(value)]);
  }

  return <ScreenView title="About Me" verb="Introducing" lines={lines} width={width} height={height} />;
}
