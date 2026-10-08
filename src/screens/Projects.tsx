import React from "react";
import ScreenView from "../components/ScreenView";
import { projects } from "../data/content";
import { span, wrapText, type Line } from "../lines";
import { theme } from "../theme";
import { linkTip } from "./linkTip";
import type { ScreenProps } from "./types";

export default function Projects({ width, height }: ScreenProps) {
  const textWidth = Math.min(width - 4, 76);
  const lines: Line[] = [];

  projects.forEach((p, i) => {
    if (i > 0) lines.push([]);
    lines.push([span("▸ ", { color: theme.accent }), span(p.name, { bold: true })]);
    for (const l of wrapText(p.description, textWidth)) lines.push([span("  " + l)]);
    lines.push([span("  " + p.tech.join(" · "), { color: theme.warn })]);
    lines.push([span("  " + p.url, { color: theme.accent })]);
  });
  lines.push([], linkTip);

  return <ScreenView title="Projects" verb="Compiling" lines={lines} width={width} height={height} />;
}
