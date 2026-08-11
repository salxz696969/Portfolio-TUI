import React, { useEffect, useState, useMemo } from "react";
import { Box, Text } from "ink";
import PixelSpinner from "../components/PixelSpinner";
import ScrollView from "../components/ScrollView";
import TechIcon from "../components/TechIcon";
import iconColorsRaw from "../data/techIconColors.json";
import { getSkillsByCategory } from "../data/skills";
import type { Skill } from "../data/skills";
import type { Icon2x2Colors } from "../components/TechIcon";

const iconColors = iconColorsRaw as unknown as Record<string, Icon2x2Colors>;

const SKILLS_PER_ROW = 5;
const GAP = 3;

function skillLine(skill: Skill): React.ReactNode {
  const colors = iconColors[skill.name];
  return (
    <Box key={skill.name} flexDirection="row" gap={1}>
      {colors ? <TechIcon colors={colors} /> : <Text color={skill.color}>??</Text>}
      <Text> </Text>
      <Text bold color={skill.color}>{skill.name}</Text>
    </Box>
  );
}

export default function Skills({ maxLines }: { maxLines: number }) {
  const [stage, setStage] = useState<"loading" | "streaming">("loading");

  useEffect(() => {
    const t = setTimeout(() => setStage("streaming"), 200);
    return () => clearTimeout(t);
  }, []);

  const lines = useMemo(() => {
    const byCategory = getSkillsByCategory();
    const result: React.ReactNode[] = [
      <Text key="title" bold color="cyan">Skills</Text>,
      " ",
    ];

    for (const [category, categorySkills] of byCategory) {
      result.push(
        <Text key={`cat-${category}`} bold color="yellow" underline>
          {category}
        </Text>
      );
      result.push(" ");

      for (let i = 0; i < categorySkills.length; i += SKILLS_PER_ROW) {
        const row = categorySkills.slice(i, i + SKILLS_PER_ROW);
        result.push(
          <Box key={`row-${category}-${i}`} flexDirection="row" gap={GAP}>
            {row.map(skillLine)}
          </Box>
        );
      }
      result.push(" ");
    }

    return result;
  }, []);

  if (stage === "loading") return <PixelSpinner />;

  return <ScrollView maxHeight={maxLines} lines={lines} stream />;
}