import React, { useEffect, useState } from "react";
import { Text } from "ink";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";

export default function Header() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <>
      <Gradient name="atlas">
        <BigText text="SAO VISAL" font="block" />
      </Gradient>
      <Text color="gray">  Full-Stack Developer · Phnom Penh, Cambodia</Text>
    </>
  );
}
