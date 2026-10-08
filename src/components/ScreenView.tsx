import React, { useCallback, useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import { lineLength, sliceLine, type Line } from "../lines";
import { useMouse, type MouseEvent } from "../mouse";
import { theme } from "../theme";

// Every visit plays a Claude Code–style "thinking" spinner, then streams the
// visible text in. Streaming takes ~STREAM_TICKS ticks regardless of length.
const SPINNER_MS = 320;
const SPINNER_FRAME_MS = 80;
const TICK_MS = 20;
const STREAM_TICKS = 22;
const WHEEL_LINES = 2;

const SPINNER = ["·", "✢", "✳", "✶", "✻", "✽", "✻", "✶", "✳", "✢"];

interface ScreenViewProps {
  title: string;
  /** Spinner text, e.g. "Recalling". */
  verb: string;
  lines: Line[];
  width: number;
  height: number;
  /** Disable j/k scrolling, e.g. while a text input owns the keyboard. */
  scrollKeys?: boolean;
  /** Rendered under the lines once streaming is done; not scrolled. */
  footer?: React.ReactNode;
}

export default function ScreenView({
  title,
  verb,
  lines,
  width,
  height,
  scrollKeys = true,
  footer,
}: ScreenViewProps) {
  const bodyHeight = Math.max(1, height - 2);
  const overflow = lines.length > bodyHeight;
  const maxScroll = Math.max(0, lines.length - bodyHeight);

  const [frame, setFrame] = useState<number | null>(0);
  const [chars, setChars] = useState(0);
  const [scroll, setScroll] = useState(0);

  const visibleLines = lines.slice(scroll, scroll + bodyHeight);
  const total = visibleLines.reduce((n, l) => n + lineLength(l), 0);
  const done = chars === Infinity;

  useEffect(() => {
    const spin = setInterval(() => setFrame((f) => (f === null ? f : f + 1)), SPINNER_FRAME_MS);
    let stream: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      clearInterval(spin);
      setFrame(null);
      const step = Math.max(4, Math.ceil(total / STREAM_TICKS));
      stream = setInterval(() => {
        setChars((c) => {
          if (c + step < total) return c + step;
          clearInterval(stream);
          return Infinity;
        });
      }, TICK_MS);
    }, SPINNER_MS);
    return () => {
      clearInterval(spin);
      clearTimeout(start);
      clearInterval(stream);
    };
  }, []);

  useEffect(() => {
    setScroll((s) => Math.min(s, maxScroll));
  }, [maxScroll]);

  const scrollBy = useCallback(
    (delta: number) => setScroll((s) => Math.max(0, Math.min(maxScroll, s + delta))),
    [maxScroll]
  );

  useInput(
    (input, key) => {
      if (input === "j") scrollBy(1);
      else if (input === "k") scrollBy(-1);
      else if (key.pageDown) scrollBy(bodyHeight - 1);
      else if (key.pageUp) scrollBy(-(bodyHeight - 1));
    },
    { isActive: scrollKeys && overflow && done }
  );

  const onMouse = useCallback(
    (e: MouseEvent) => {
      if (e.type === "wheelDown") scrollBy(WHEEL_LINES);
      else if (e.type === "wheelUp") scrollBy(-WHEEL_LINES);
    },
    [scrollBy]
  );
  useMouse(onMouse, overflow && done);

  const rule = "─".repeat(Math.max(0, width - title.length - 1));

  // While streaming, show the first `chars` characters of the viewport.
  let budget = done ? Infinity : chars;
  const shown: Line[] = [];
  for (const line of visibleLines) {
    if (budget <= 0) break;
    shown.push(sliceLine(line, budget));
    budget -= Math.max(1, lineLength(line));
  }

  return (
    <Box flexDirection="column" width={width} height={height}>
      <Text wrap="truncate">
        <Text bold color={theme.accent}>{title}</Text>
        <Text color={theme.muted} dimColor>{" " + rule}</Text>
      </Text>
      <Text> </Text>
      {frame !== null ? (
        <Text>
          <Text color={theme.claude}>{SPINNER[frame % SPINNER.length]} </Text>
          <Text color={theme.claude}>{verb}…</Text>
        </Text>
      ) : (
        <Box flexDirection="row">
          <Box flexDirection="column" width={overflow ? width - 2 : width}>
            {shown.map((line, i) => (
              <Text key={scroll + i} wrap="truncate">
                {line.length === 0
                  ? " "
                  : line.map((s, j) => (
                      <Text
                        key={j}
                        color={s.color}
                        backgroundColor={s.bg}
                        bold={s.bold}
                        italic={s.italic}
                        dimColor={s.dim}
                      >
                        {s.text}
                      </Text>
                    ))}
              </Text>
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
