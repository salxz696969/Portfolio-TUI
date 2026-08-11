import React, { useEffect, useState, useMemo } from "react";
import { Box, Text } from "ink";
import PixelSpinner from "../components/PixelSpinner";
import StreamingLines from "../components/StreamingLines";
import { experienceEntries } from "../data/content";

export default function Experience() {
  const [stage, setStage] = useState<"loading" | "streaming" | "done">("loading");

  useEffect(() => {
    const t = setTimeout(() => setStage("streaming"), 200);
    return () => clearTimeout(t);
  }, []);

  const lines = useMemo(() => {
    const result: React.ReactNode[] = [];
    for (let i = 0; i < experienceEntries.length; i++) {
      const e = experienceEntries[i];
      result.push(<Text key={`t-${i}`} bold color="white">{e.title}</Text>);
      result.push(<Text key={`s-${i}`} color="gray" italic>{e.subtitle}</Text>);
      result.push(<Text key={`p-${i}`} color="gray">{e.period}</Text>);
      if (i < experienceEntries.length - 1) {
        result.push(<Text key={`b-${i}`}> </Text>);
      }
    }
    return result;
  }, []);

  return (
    <Box flexDirection="column">
      {stage === "loading" && <PixelSpinner />}
      {(stage === "streaming" || stage === "done") && (
        <>
          <Text bold color="cyan">Experience</Text>
          <Text> </Text>
          <StreamingLines lines={lines} onDone={() => setStage("done")} />
        </>
      )}
    </Box>
  );
}
