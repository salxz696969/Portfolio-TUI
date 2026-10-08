import React from "react";
import { Box, Text } from "ink";
import ScreenView from "../components/ScreenView";
import EmailForm from "../components/EmailForm";
import { contactInfo } from "../data/content";
import { span, type Line } from "../lines";
import { theme } from "../theme";
import { linkTip } from "./linkTip";
import type { ScreenProps } from "./types";

interface ContactProps extends ScreenProps {
  draft: string;
  onDraftChange: (value: string) => void;
  gmailUrl: string | null;
  onSubmit: (url: string) => void;
}

const rows: [string, string][] = [
  ["Phone", contactInfo.phone],
  ["Email", contactInfo.email],
  ["LinkedIn", contactInfo.linkedin],
  ["GitHub", contactInfo.github],
];

/** OSC 8 hyperlink: shows `label`, opens `url` (the Gmail URL is too long to print). */
const osc8 = (url: string, label: string) => `\x1b]8;;${url}\x07${label}\x1b]8;;\x07`;

export default function Contact({ width, height, origin, draft, onDraftChange, gmailUrl, onSubmit }: ContactProps) {
  const lines: Line[] = rows.map(([label, value]) => [
    span("  " + label.padEnd(10), { color: theme.accent }),
    span(value),
  ]);
  lines.push([], linkTip);

  const footer = (
    <Box flexDirection="column" marginTop={1}>
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={theme.accent}
        paddingX={1}
        width={Math.min(width, 64)}
      >
        <Text color={theme.muted}>Write me a message · enter to send via Gmail</Text>
        <Box>
          <Text color={theme.accent}>{"> "}</Text>
          <EmailForm value={draft} onChange={onDraftChange} onSubmit={onSubmit} />
        </Box>
      </Box>
      {gmailUrl && (
        <Box marginTop={1} paddingLeft={2}>
          <Text color={theme.success}>✓ Draft ready → </Text>
          <Text color={theme.accent} underline bold>
            {osc8(gmailUrl, "click here to open it in Gmail")}
          </Text>
        </Box>
      )}
    </Box>
  );

  return (
    <ScreenView
      title="Contact"
      lines={lines}
      width={width}
      height={height}
      origin={origin}
      scrollKeys={false}
      footer={footer}
    />
  );
}
