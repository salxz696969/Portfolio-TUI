import React from "react";
import ScreenView from "../components/ScreenView";
import { getSkillsByCategory, type Skill } from "../data/skills";
import { ICON_COLS, ICON_ROWS } from "../data/iconSize";
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

// Each skill is a card: the logo (ICON_COLS × ICON_ROWS) centered above its name.
const CARD = 13;
const GAP = 2;

const center = (text: string, width: number) => {
  const left = Math.floor((width - text.length) / 2);
  return " ".repeat(left) + text + " ".repeat(width - text.length - left);
};

/** One row of a skill's logo: a real image placeholder, or pixel art. */
function iconRow(skill: Skill, row: number): Span[] {
  const pad = Math.floor((CARD - ICON_COLS) / 2);
  const left = span(" ".repeat(pad));
  const right = span(" ".repeat(CARD - ICON_COLS - pad));
  if (imagesSupported) {
    return [left, span(" ".repeat(ICON_COLS), row === 0 ? { image: skill.name } : { underImage: true }), right];
  }
  const cells = iconCells[skill.name].cells[row];
  return [left, ...cells.map((c) => span(c.ch, { color: c.fg, bg: c.bg })), right];
}

export default function Skills({ width, height, origin }: ScreenProps) {
  const perRow = Math.max(1, Math.floor((width - 2 + GAP) / (CARD + GAP)));
  const gap = span(" ".repeat(GAP));
  const lines: Line[] = [];

  for (const [category, categorySkills] of getSkillsByCategory()) {
    if (categorySkills.length === 0) continue;
    if (lines.length > 0) lines.push([]);
    lines.push([span(category, { bold: true, color: theme.heading })]);
    for (let i = 0; i < categorySkills.length; i += perRow) {
      const row = categorySkills.slice(i, i + perRow);
      const join = (cells: Span[][]) => cells.flatMap((c, j) => (j === 0 ? c : [gap, ...c]));
      for (let r = 0; r < ICON_ROWS; r++) lines.push(join(row.map((s) => iconRow(s, r))));
      lines.push(join(row.map((s) => [span(center(s.name, CARD), { color: theme.muted })])));
    }
  }

  return <ScreenView title="Skills" lines={lines} width={width} height={height} origin={origin} />;
}
