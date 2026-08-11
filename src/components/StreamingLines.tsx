import React, { useEffect, useState } from "react";
import { Box } from "ink";

const SPEED = 80;

interface StreamingLinesProps {
  lines: React.ReactNode[];
  onDone?: () => void;
}

export default function StreamingLines({ lines, onDone }: StreamingLinesProps) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    setRevealed(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i > lines.length) {
        clearInterval(id);
        onDone?.();
        return;
      }
      setRevealed(i);
    }, SPEED);
    return () => clearInterval(id);
  }, [lines]);

  return (
    <Box flexDirection="column">
      {lines.slice(0, revealed).map((line, i) => (
        <React.Fragment key={i}>{line}</React.Fragment>
      ))}
    </Box>
  );
}
