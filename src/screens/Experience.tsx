import React from "react";
import { Box, Text } from "ink";
import ScreenView from "../components/ScreenView";
import { experienceGroups } from "../data/content";
import { theme } from "../theme";
import type { ScreenProps } from "./types";

export default function Experience({ width, height, animate }: ScreenProps) {
  const rowWidth = Math.min(width - 2, 80);
  const lines: React.ReactNode[] = [];

  experienceGroups.forEach((group, g) => {
    if (g > 0) lines.push("");
    lines.push(<Text bold color={theme.heading}>{group.label}</Text>);
    group.entries.forEach((e, i) => {
      const last = i === group.entries.length - 1;
      const rail = <Text color={theme.muted} dimColor>{last ? "   " : " │ "}</Text>;
      const periodText = <Text color={e.current ? theme.success : theme.muted}>{e.period}</Text>;
      // Drop the period onto its own line when it can't sit beside the title.
      const stacked = e.title.length + e.period.length + 5 > rowWidth;
      const title = (
        <Text wrap="truncate">
          <Text color={e.current ? theme.success : theme.accent}>{" ● "}</Text>
          <Text bold>{e.title}</Text>
        </Text>
      );
      lines.push(
        stacked ? (
          title
        ) : (
          <Box width={rowWidth} justifyContent="space-between">
            {title}
            {periodText}
          </Box>
        )
      );
      lines.push(
        <Text wrap="truncate">
          {rail}
          <Text color={theme.muted} italic>{e.subtitle}</Text>
        </Text>
      );
      if (stacked) lines.push(<Text>{rail}{periodText}</Text>);
      if (!last) lines.push(<Text color={theme.muted} dimColor>{" │"}</Text>);
    });
  });

  return <ScreenView title="Experience" lines={lines} width={width} height={height} animate={animate} />;
}
