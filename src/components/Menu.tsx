import React, { memo } from "react";
import { Text } from "ink";
import { theme } from "../theme";

interface MenuProps {
  items: string[];
  selectedIndex: number;
}

function Menu({ items, selectedIndex }: MenuProps) {
  return (
    <>
      {items.map((item, i) => {
        const isSelected = i === selectedIndex;
        return isSelected ? (
          <Text key={item} color={theme.accent} bold>
            {" ❯ "}
            {item}
          </Text>
        ) : (
          <Text key={item} color={theme.muted}>
            {"   "}
            {item}
          </Text>
        );
      })}
    </>
  );
}

export default memo(Menu);
