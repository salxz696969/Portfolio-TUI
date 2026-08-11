import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import PixelSpinner from "../components/PixelSpinner";
import { experienceEntries } from "../data/content";

export default function Experience() {
  const [stage, setStage] = useState<"loading" | "done">("loading");

  useEffect(() => {
    const t = setTimeout(() => setStage("done"), 200);
    return () => clearTimeout(t);
  }, []);

  if (stage === "loading") return <PixelSpinner />;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Experience</Text>
      <Text> </Text>
      {experienceEntries.map((e, i) => (
        <Box key={i} flexDirection="column" marginBottom={1}>
          <Text bold color="white">{e.title}</Text>
          <Text color="gray" italic>{e.subtitle}</Text>
          <Text color="gray">{e.period}</Text>
          <Text> </Text>
        </Box>
      ))}
    </Box>
  );
}
