import React from "react";
import { Box, Text } from "ink";
import ScreenView from "../components/ScreenView";
import EmailForm from "../components/EmailForm";
import Link from "../components/Link";
import { contactInfo } from "../data/content";
import { theme } from "../theme";
import type { ScreenProps } from "./types";

interface ContactProps extends ScreenProps {
  draft: string;
  onDraftChange: (value: string) => void;
  gmailUrl: string | null;
  onSubmit: (url: string) => void;
}

const rows: [label: string, value: string, url?: string][] = [
  ["Phone", contactInfo.phone, `tel:${contactInfo.phone.replace(/\s/g, "")}`],
  ["Email", contactInfo.email, `mailto:${contactInfo.email}`],
  ["LinkedIn", contactInfo.linkedin, contactInfo.linkedin],
  ["GitHub", contactInfo.github, contactInfo.github],
];

export default function Contact({ width, height, animate, draft, onDraftChange, gmailUrl, onSubmit }: ContactProps) {
  const lines: React.ReactNode[] = rows.map(([label, value, url]) => (
    <Box>
      <Text color={theme.accent}>{"  " + label.padEnd(10)}</Text>
      {url ? <Link url={url} wrap="truncate">{value}</Link> : <Text>{value}</Text>}
    </Box>
  ));
  lines.push("", <Text color={theme.muted} dimColor>{"  ctrl/⌘ + click a link to open it"}</Text>);

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
          <Link url={gmailUrl} color={theme.accent} underline>
            open it in Gmail
          </Link>
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
      animate={animate}
      scrollKeys={false}
      footer={footer}
    />
  );
}
