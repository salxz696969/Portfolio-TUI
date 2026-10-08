import React from "react";
import ScreenView from "../components/ScreenView";
import { experienceGroups } from "../data/content";
import { span, type Line } from "../lines";
import { theme } from "../theme";
import type { ScreenProps } from "./types";

export default function Experience({ width, height, origin }: ScreenProps) {
  const rowWidth = Math.min(width - 2, 80);
  const lines: Line[] = [];

  experienceGroups.forEach((group, g) => {
    if (g > 0) lines.push([]);
    lines.push([span(group.label, { bold: true, color: theme.heading })]);
    group.entries.forEach((e, i) => {
      const last = i === group.entries.length - 1;
      const rail = span(last ? "   " : " │ ", { color: theme.muted, dim: true });
      const period = e.period && span(e.period, { color: e.current ? theme.success : theme.muted });
      const title = [
        span(" ● ", { color: e.current ? theme.success : theme.accent }),
        span(e.title, { bold: true }),
      ];
      // Right-align the period beside the title, or drop it to its own line
      // when the row is too narrow.
      const gap = rowWidth - 3 - e.title.length - (e.period?.length ?? 0);
      const stacked = period && gap < 2;
      lines.push(period && !stacked ? [...title, span(" ".repeat(gap)), period] : title);
      lines.push([rail, span(e.subtitle, { color: theme.muted, italic: true })]);
      if (period && stacked) lines.push([rail, period]);
      if (!last) lines.push([span(" │", { color: theme.muted, dim: true })]);
    });
  });

  return <ScreenView title="Experience" lines={lines} width={width} height={height} origin={origin} />;
}
