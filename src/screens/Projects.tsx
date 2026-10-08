import React from "react";
import { Text } from "ink";
import ScreenView, { wrapText } from "../components/ScreenView";
import { projects } from "../data/content";
import { theme } from "../theme";
import type { ScreenProps } from "./types";

export default function Projects({ width, height, animate }: ScreenProps) {
  const textWidth = Math.min(width - 4, 76);
  const lines: React.ReactNode[] = [];

  projects.forEach((p, i) => {
    if (i > 0) lines.push("");
    lines.push(
      <Text wrap="truncate">
        <Text color={theme.accent}>{"▸ "}</Text>
        <Text bold>{p.name}</Text>
      </Text>
    );
    for (const l of wrapText(p.description, textWidth)) lines.push("  " + l);
    lines.push(<Text color={theme.warn} wrap="truncate">{"  " + p.tech.join(" · ")}</Text>);
    lines.push(<Text color={theme.muted} wrap="truncate">{"  " + p.url}</Text>);
  });

  return <ScreenView title="Projects" lines={lines} width={width} height={height} animate={animate} />;
}
