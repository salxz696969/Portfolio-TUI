import React, { memo } from "react";
import { Box, Text } from "ink";
import { theme } from "../theme";

function Key({ k, label }: { k: string; label: string }) {
  return (
    <Text>
      <Text color={theme.accent}>{k}</Text>
      <Text color={theme.muted}>{" " + label + "   "}</Text>
    </Text>
  );
}

function Footer({ columns, exitPrompt }: { columns: number; exitPrompt: boolean }) {
  if (exitPrompt) {
    return (
      <Text color={theme.warn} bold wrap="truncate">
        {"  Press esc (or ctrl+c) again to exit"}
      </Text>
    );
  }
  const note =
    columns >= 150
      ? "Free server, may be a bit slow · 無料サーバーのため少し遅いです"
      : "Free server, may be a bit slow";
  return (
    <Box width={columns} justifyContent="space-between">
      <Text wrap="truncate">
        {"  "}
        <Key k="↑↓" label="navigate" />
        <Key k="1-5" label="jump" />
        <Key k="j/k" label="scroll" />
        <Key k="esc" label="quit" />
      </Text>
      {columns >= 100 && <Text color={theme.muted} dimColor>{note + " "}</Text>}
    </Box>
  );
}

export default memo(Footer);
