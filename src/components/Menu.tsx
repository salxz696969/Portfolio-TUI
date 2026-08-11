import React from "react";
import { Text } from "ink";

interface MenuProps {
  items: string[];
  selectedIndex: number;
  revealed?: number;
}

const HINTS = ["  ↑↓  navigate", "  esc exit"];

export default function Menu({ items, selectedIndex, revealed = Infinity }: MenuProps) {
  const all = [...items, "", ...HINTS];
  return (
    <>
      {all.map((item, i) => {
        if (i >= revealed) return null;
        if (i < items.length) {
          const isSelected = i === selectedIndex;
          return (
            <Text key={i}>
              {isSelected ? (
                <Text color="cyan" bold>
                  {"  ❯ "}
                  {item}
                </Text>
              ) : (
                <Text color="gray">{"    "}{item}</Text>
              )}
            </Text>
          );
        }
        return (
          <Text key={i} color="dim">
            {item}
          </Text>
        );
      })}
    </>
  );
}
