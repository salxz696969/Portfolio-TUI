import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";

const STREAM_SPEED = 60;

interface ScrollViewProps {
  lines: (string | React.ReactNode)[];
  maxHeight: number;
  stream?: boolean;
  onStreamDone?: () => void;
}

export default function ScrollView({ lines, maxHeight, stream, onStreamDone }: ScrollViewProps) {
  const [scroll, setScroll] = useState(0);
  const [revealed, setRevealed] = useState(stream ? 0 : lines.length);

  const visible = Math.max(1, maxHeight);
  const visibleLines = lines.slice(0, revealed);
  const maxScroll = Math.max(0, visibleLines.length - visible);

  useEffect(() => {
    if (!stream) {
      setRevealed(lines.length);
      return;
    }
    setRevealed(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i >= lines.length) {
        clearInterval(id);
        setRevealed(lines.length);
        onStreamDone?.();
        return;
      }
      setRevealed(i);
    }, STREAM_SPEED);
    return () => clearInterval(id);
  }, [lines, stream]);

  useEffect(() => {
    setScroll(0);
  }, [lines]);

  useInput((_input, key) => {
    if (revealed < lines.length) return;
    if (_input === "j" && !key.ctrl) {
      setScroll((s) => Math.min(maxScroll, s + 1));
    } else if (_input === "k" && !key.ctrl) {
      setScroll((s) => Math.max(0, s - 1));
    }
  });

  const displayLines = visibleLines.slice(scroll, scroll + visible);

  return (
    <Box flexDirection="column">
      {displayLines.map((line, i) =>
        typeof line === "string" ? (
          <Text key={i}>{line}</Text>
        ) : (
          <React.Fragment key={i}>{line}</React.Fragment>
        )
      )}
      {maxScroll > 0 && revealed >= lines.length && (
        <Text color="dim">
          {scroll > 0 ? "▲" : " "} {scroll + 1}–{Math.min(scroll + visible, lines.length)} of {lines.length} {scroll + visible <= lines.length ? "▼" : " "}  j/k scroll
        </Text>
      )}
    </Box>
  );
}