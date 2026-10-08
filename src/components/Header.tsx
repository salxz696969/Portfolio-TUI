import React, { memo } from "react";
import { Box, Text } from "ink";
import Gradient from "ink-gradient";
import { profile } from "../data/content";
import { theme } from "../theme";

// "SAO VISAL" in the cfonts "block" font, pre-rendered so startup doesn't
// pay for the font engine. 72 columns wide, 6 rows tall.
const NAME_ART = [
  " ███████╗  █████╗   ██████╗      ██╗   ██╗ ██╗ ███████╗  █████╗  ██╗",
  " ██╔════╝ ██╔══██╗ ██╔═══██╗     ██║   ██║ ██║ ██╔════╝ ██╔══██╗ ██║",
  " ███████╗ ███████║ ██║   ██║     ██║   ██║ ██║ ███████╗ ███████║ ██║",
  " ╚════██║ ██╔══██║ ██║   ██║     ╚██╗ ██╔╝ ██║ ╚════██║ ██╔══██║ ██║",
  " ███████║ ██║  ██║ ╚██████╔╝      ╚████╔╝  ██║ ███████║ ██║  ██║ ███████╗",
  " ╚══════╝ ╚═╝  ╚═╝  ╚═════╝        ╚═══╝   ╚═╝ ╚══════╝ ╚═╝  ╚═╝ ╚══════╝",
].join("\n");

const BIG_MIN_COLUMNS = 78;
const BIG_MIN_ROWS = 26;

export function headerHeight(columns: number, rows: number) {
  return isBig(columns, rows) ? 9 : 4;
}

function isBig(columns: number, rows: number) {
  return columns >= BIG_MIN_COLUMNS && rows >= BIG_MIN_ROWS;
}

function Header({ columns, rows }: { columns: number; rows: number }) {
  const big = isBig(columns, rows);
  return (
    <Box flexDirection="column" paddingTop={1} marginBottom={1} flexShrink={0}>
      <Gradient name="atlas">
        {big ? (
          <Text>{NAME_ART}</Text>
        ) : (
          <Text bold>{"  " + profile.name.split("").join(" ")}</Text>
        )}
      </Gradient>
      <Text wrap="truncate">
        <Text color={theme.muted}>
          {"  "}
          {profile.title} · {profile.location} ·{" "}
        </Text>
        <Text color={theme.success}>● </Text>
        <Text color={theme.heading}>{profile.now}</Text>
      </Text>
    </Box>
  );
}

export default memo(Header);
