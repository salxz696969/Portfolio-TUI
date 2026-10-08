import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import PixelSpinner from "./PixelSpinner";
import { theme } from "../theme";

// Spinner duration before content appears, and ms between revealed lines.
// Only the first visit to a screen animates; revisits render instantly.
const SPINNER_MS = 150;
const LINE_MS = 18;

interface ScreenViewProps {
  title: string;
  /** One terminal row per entry; pre-wrap long text with `wrapText`. */
  lines: React.ReactNode[];
  width: number;
  height: number;
  animate: boolean;
  /** Disable j/k scrolling, e.g. while a text input owns the keyboard. */
  scrollKeys?: boolean;
  /** Rendered under the lines once revealed; not scrolled. */
  footer?: React.ReactNode;
}

export default function ScreenView({
  title,
  lines,
  width,
  height,
  animate,
  scrollKeys = true,
  footer,
}: ScreenViewProps) {
  const bodyHeight = Math.max(1, height - 2);
  const overflow = lines.length > bodyHeight;
  const maxScroll = Math.max(0, lines.length - bodyHeight);

  const [loading, setLoading] = useState(animate);
  const [revealed, setRevealed] = useState(animate ? 0 : Infinity);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      setLoading(false);
      // Only lines inside the viewport are worth animating.
      const target = Math.min(lines.length, bodyHeight);
      id = setInterval(() => {
        setRevealed((r) => {
          if (r + 1 >= target) {
            clearInterval(id);
            return Infinity;
          }
          return r + 1;
        });
      }, LINE_MS);
    }, SPINNER_MS);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    setScroll((s) => Math.min(s, maxScroll));
  }, [maxScroll]);

  const done = revealed === Infinity;
  useInput(
    (input, key) => {
      if (input === "j" || key.pageDown) {
        setScroll((s) => Math.min(maxScroll, s + (key.pageDown ? bodyHeight - 1 : 1)));
      } else if (input === "k" || key.pageUp) {
        setScroll((s) => Math.max(0, s - (key.pageUp ? bodyHeight - 1 : 1)));
      }
    },
    { isActive: scrollKeys && overflow && done }
  );

  const rule = "─".repeat(Math.max(0, width - title.length - 1));
  const visible = lines.slice(scroll, scroll + bodyHeight).slice(0, revealed);

  return (
    <Box flexDirection="column" width={width} height={height}>
      <Text wrap="truncate">
        <Text bold color={theme.accent}>{title}</Text>
        <Text color={theme.muted} dimColor>{" " + rule}</Text>
      </Text>
      <Text> </Text>
      {loading ? (
        <PixelSpinner />
      ) : (
        <Box flexDirection="row">
          <Box flexDirection="column" width={overflow ? width - 2 : width}>
            {visible.map((line, i) => (
              <Box key={scroll + i} height={1} overflow="hidden">
                {typeof line === "string" ? <Text>{line || " "}</Text> : line}
              </Box>
            ))}
          </Box>
          {overflow && done && (
            <Box flexDirection="column" marginLeft={1}>
              <Scrollbar height={bodyHeight} offset={scroll} total={lines.length} />
            </Box>
          )}
        </Box>
      )}
      {done && footer}
    </Box>
  );
}

function Scrollbar({ height, offset, total }: { height: number; offset: number; total: number }) {
  const thumb = Math.max(1, Math.round((height * height) / total));
  const maxOffset = total - height;
  const start = maxOffset > 0 ? Math.round((offset / maxOffset) * (height - thumb)) : 0;
  return (
    <>
      {Array.from({ length: height }, (_, i) =>
        i >= start && i < start + thumb ? (
          <Text key={i} color={theme.accent}>┃</Text>
        ) : (
          <Text key={i} color={theme.muted} dimColor>│</Text>
        )
      )}
    </>
  );
}

/** Word-wrap `text` into lines no wider than `width` columns. */
export function wrapText(text: string, width: number): string[] {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (!word) continue;
    if (!line) line = word;
    else if (line.length + 1 + word.length <= width) line += " " + word;
    else {
      out.push(line);
      line = word;
    }
  }
  if (line) out.push(line);
  return out;
}
