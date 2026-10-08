import React, { useCallback, useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import { lineLength, sliceLine, type Line } from "../lines";
import { useMouse, type MouseEvent } from "../mouse";
import { setImagePlacements, type Placement } from "../images";
import { ICON_ROWS } from "../data/iconSize";
import { theme } from "../theme";

// Each visit streams the visible text in. Lines type in parallel, each one
// starting LINE_STAGGER_MS after the previous, at CHARS_PER_MS. Progress is
// computed from elapsed time, so the speed stays even when frames are late.
const CHARS_PER_MS = 0.4;
const LINE_STAGGER_MS = 18;
const FRAME_MS = 16;
const WHEEL_LINES = 2;

interface ScreenViewProps {
  title: string;
  lines: Line[];
  width: number;
  height: number;
  /** Screen cell of this view's top-left corner, for placing images. */
  origin: { x: number; y: number };
  /** Disable j/k scrolling, e.g. while a text input owns the keyboard. */
  scrollKeys?: boolean;
  /** Rendered under the lines once streaming is done; not scrolled. */
  footer?: React.ReactNode;
}

export default function ScreenView({
  title,
  lines,
  width,
  height,
  origin,
  scrollKeys = true,
  footer,
}: ScreenViewProps) {
  const bodyHeight = Math.max(1, height - 2);
  const overflow = lines.length > bodyHeight;
  const maxScroll = Math.max(0, lines.length - bodyHeight);

  const [elapsed, setElapsed] = useState(0);
  const [scroll, setScroll] = useState(0);
  const visibleLines = lines.slice(scroll, scroll + bodyHeight);

  const lineDone = (i: number) => (elapsed - i * LINE_STAGGER_MS) * CHARS_PER_MS;
  const done = elapsed === Infinity;

  useEffect(() => {
    const start = Date.now();
    const finish = Math.max(
      0,
      ...visibleLines.map((l, i) => i * LINE_STAGGER_MS + lineLength(l) / CHARS_PER_MS)
    );
    const id = setInterval(() => {
      const t = Date.now() - start;
      if (t >= finish) {
        clearInterval(id);
        setElapsed(Infinity);
      } else {
        setElapsed(t);
      }
    }, FRAME_MS);
    return () => clearInterval(id);
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

  // Draw real images over the blank cells reserved for them, once the text
  // has settled. Skip images that would be cut off by the viewport.
  useEffect(() => {
    if (!done) return;
    const placements: Placement[] = [];
    visibleLines.forEach((line, i) => {
      if (i + ICON_ROWS > bodyHeight) return;
      let x = 0;
      for (const s of line) {
        if (s.image) placements.push({ name: s.image, x: origin.x + x, y: origin.y + 2 + i });
        x += s.text.length;
      }
    });
    setImagePlacements(placements);
  }, [done, scroll, lines, bodyHeight, origin.x, origin.y]);
  useEffect(() => () => setImagePlacements([]), []);

  const rule = "─".repeat(Math.max(0, width - title.length - 1));

  // Ink skips rewriting rows whose text didn't change, and only rewritten
  // cells lose an image. The blank cells under images spell the line's index
  // in normal spaces and Braille blanks (U+2800) — both look empty and are one
  // column wide — so moving or leaving those rows always rewrites them and
  // clears the old image.
  const encodeBlank = (line: Line, index: number): Line => {
    let bit = 0;
    return line.map((s) =>
      s.image || s.underImage
        ? { ...s, text: [...s.text].map(() => ((index >> bit++ % 16) & 1 ? "\u2800" : " ")).join("") }
        : s
    );
  };

  const shown = (done ? visibleLines : visibleLines.map((l, i) => sliceLine(l, lineDone(i)))).map((l, i) =>
    encodeBlank(l, scroll + i + 1)
  );

  return (
    <Box flexDirection="column" width={width} height={height}>
      <Text wrap="truncate">
        <Text bold color={theme.accent}>{title}</Text>
        <Text color={theme.muted} dimColor>{" " + rule}</Text>
      </Text>
      <Text> </Text>
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
