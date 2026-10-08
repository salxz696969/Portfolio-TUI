import React from "react";
import ScreenView from "../components/ScreenView";
import { getSkillsByCategory, type Skill } from "../data/skills";
import { ICON_COLS } from "../data/iconSize";
import icons from "../data/icons.generated.json";
import { imagesSupported } from "../images";
import { span, type Line, type Span } from "../lines";
import { theme } from "../theme";
import type { ScreenProps } from "./types";

interface Cell {
  ch: string;
  fg?: string;
  bg?: string;
}
const iconCells = icons as Record<string, { cells: Cell[][] }>;

// Fixed cell width so skills line up across rows and categories.
const CELL = 18;

/** A skill's logo (a real image placeholder, or pixel art) followed by its name. */
function cell(skill: Skill): Span[] {
  const icon = imagesSupported
    ? [span(" ".repeat(ICON_COLS), { image: skill.name })]
    : iconCells[skill.name].cells[0].map((c) => span(c.ch, { color: c.fg, bg: c.bg }));
  return [...icon, span(" " + skill.name.padEnd(CELL - ICON_COLS - 1), { bold: true })];
}

export default function Skills({ width, height, origin }: ScreenProps) {
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

  return <ScreenView title="Skills" lines={lines} width={width} height={height} origin={origin} />;
}
