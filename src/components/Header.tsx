import React, { useEffect, useState } from "react";
import { Text } from "ink";
import Gradient from "ink-gradient";
import CFonts from "cfonts";

const raw = CFonts.render("SAO VISAL", { font: "block" });
const LINES: string[] = raw ? raw.array : ["SAO VISAL"];
const HEADER_SPEED = 60;

interface HeaderProps {
  onDone?: () => void;
}

export default function Header({ onDone }: HeaderProps) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const total = LINES.length + 1;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= total) {
        clearInterval(id);
        onDone?.();
      }
    }, HEADER_SPEED);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Gradient name="atlas">
        {LINES.slice(0, revealed).map((line: string, i: number) => (
          <Text key={i}>{line}</Text>
        ))}
      </Gradient>
      {revealed > LINES.length && (
        <Text color="gray">  Full-Stack Developer · Phnom Penh, Cambodia</Text>
      )}
    </>
  );
}
