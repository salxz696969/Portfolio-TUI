import React, { useEffect, useState } from "react";
import { Text } from "ink";
import Gradient from "ink-gradient";

export default function Header() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <>
      <Text>
        <Text color="cyan">╔════════════════════════════════════════╗</Text>
      </Text>
      <Text>
        <Text color="cyan">║</Text>
        <Gradient name="atlas">
          SAO VISAL
        </Gradient>
        <Text color="gray"> — full-stack developer</Text>
      </Text>
      <Text>
        <Text color="cyan">╚════════════════════════════════════════╝</Text>
      </Text>
    </>
  );
}
