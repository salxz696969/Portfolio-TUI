import React from "react";
import { Box, Text } from "ink";
import ScreenView from "../components/ScreenView";
import TechIcon from "../components/TechIcon";
import iconColorsRaw from "../data/techIconColors.json";
import { getSkillsByCategory } from "../data/skills";
import type { Skill } from "../data/skills";
import type { Icon2x2Colors } from "../components/TechIcon";
import { theme } from "../theme";
import type { ScreenProps } from "./types";

const iconColors = iconColorsRaw as unknown as Record<string, Icon2x2Colors>;

const GAP = 4;
// Fixed column width so skills line up across rows and categories.
const CELL = 16;

function SkillCell({ skill }: { skill: Skill }) {
  const c = skill.color;
  return (
    <Box width={CELL} gap={1}>
      <TechIcon colors={iconColors[skill.name] ?? [c, c, c, c]} />
      <Text bold color={skill.color}>{skill.name}</Text>
    </Box>
  );
}

export default function Skills({ width, height, animate }: ScreenProps) {
  const perRow = Math.max(1, Math.floor((width - 2 + GAP) / (CELL + GAP)));
  const lines: React.ReactNode[] = [];

  for (const [category, categorySkills] of getSkillsByCategory()) {
    if (categorySkills.length === 0) continue;
    if (lines.length > 0) lines.push("");
    lines.push(<Text bold color={theme.heading}>{category}</Text>);
    for (let i = 0; i < categorySkills.length; i += perRow) {
      lines.push(
        <Box gap={GAP} paddingLeft={1}>
          {categorySkills.slice(i, i + perRow).map((s) => (
            <SkillCell key={s.name} skill={s} />
          ))}
        </Box>
      );
    }
  }

  return <ScreenView title="Skills" lines={lines} width={width} height={height} animate={animate} />;
}
