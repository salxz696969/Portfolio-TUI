import React from "react";
import ScreenView from "../components/ScreenView";
import { getSkillsByCategory, type Skill } from "../data/skills";
import { span, type Line, type Span } from "../lines";
import { theme } from "../theme";
import type { ScreenProps } from "./types";

// Fixed cell width so skills line up across rows and categories.
const CELL = 20;

/** Black or white text, whichever reads better on `hex`. */
function textOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#000000" : "#FFFFFF";
}

function cell(skill: Skill): Span[] {
  return [
    span(` ${skill.badge} `, { bg: skill.color, color: textOn(skill.color), bold: true }),
    span(" " + skill.name.padEnd(CELL - 5)),
  ];
}

export default function Skills({ width, height }: ScreenProps) {
  const perRow = Math.max(1, Math.floor((width - 3) / CELL));
  const lines: Line[] = [];

  for (const [category, categorySkills] of getSkillsByCategory()) {
    if (categorySkills.length === 0) continue;
    if (lines.length > 0) lines.push([]);
    lines.push([span(category, { bold: true, color: theme.heading })]);
    for (let i = 0; i < categorySkills.length; i += perRow) {
      lines.push([span(" "), ...categorySkills.slice(i, i + perRow).flatMap(cell)]);
    }
  }

  return <ScreenView title="Skills" verb="Loading skills" lines={lines} width={width} height={height} />;
}
