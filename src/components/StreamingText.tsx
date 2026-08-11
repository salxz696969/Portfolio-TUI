import React, { useEffect, useState } from "react";
import { Text } from "ink";

const SPEED = 4;

interface StreamingTextProps {
  text: string;
  onDone?: () => void;
}

export default function StreamingText({ text, onDone }: StreamingTextProps) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    setRevealed(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i > text.length) {
        clearInterval(id);
        onDone?.();
        return;
      }
      setRevealed(i);
    }, SPEED);
    return () => clearInterval(id);
  }, [text]);

  const displayed = text.slice(0, revealed);

  return <Text>{displayed}</Text>;
}
