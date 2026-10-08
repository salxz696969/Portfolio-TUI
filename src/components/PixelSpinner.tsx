import React, { useEffect, useState } from "react";
import { Text } from "ink";
import { theme } from "../theme";

const SPEED = 40;

const frames = ["▖", "▘", "▝", "▗", "▚", "▞", "▙", "▛", "▜", "▟", "█", "▓", "▒", "░"];

export default function PixelSpinner() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % frames.length);
    }, SPEED);
    return () => clearInterval(id);
  }, []);

  return (
    <Text>
      <Text color={theme.accent}>{frames[frame]}</Text>
      {" "}
      <Text color={theme.muted}>loading...</Text>
    </Text>
  );
}
