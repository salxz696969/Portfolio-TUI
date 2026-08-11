import React from "react";
import { Text } from "ink";

interface MenuProps {
  items: string[];
  selectedIndex: number;
}

export default function Menu({ items, selectedIndex }: MenuProps) {
  return (
    <>
      {items.map((item, i) => {
        const isSelected = i === selectedIndex;
        return (
          <Text key={item}>
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
      })}
      <Text> </Text>
      <Text> </Text>
      <Text> </Text>
      <Text color="dim">  ↑↓  navigate</Text>
      <Text color="dim">  esc exit</Text>
    </>
  );
}
