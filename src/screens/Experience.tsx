import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import PixelSpinner from "../components/PixelSpinner";
import StreamingText from "../components/StreamingText";
import { experienceEntries } from "../data/content";

export default function Experience() {
  const [stage, setStage] = useState<"loading" | "streaming" | "done">("loading");

  useEffect(() => {
    const t = setTimeout(() => setStage("streaming"), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Box flexDirection="column">
      {stage === "loading" && <PixelSpinner />}
      {(stage === "streaming" || stage === "done") && (
        <>
          <Text bold color="cyan">Experience</Text>
          <Text> </Text>
          {experienceEntries.map((entry, i) => (
            <Box key={i} flexDirection="column" marginBottom={1}>
              <Text bold color="magenta">{entry.title}</Text>
              <Text color="gray" italic>{entry.subtitle}</Text>
              <Text color="yellow">{entry.period}</Text>
              <Text> </Text>
              <StreamingText
                text={entry.description}
                onDone={i === experienceEntries.length - 1 ? () => setStage("done") : undefined}
              />
              <Text> </Text>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
