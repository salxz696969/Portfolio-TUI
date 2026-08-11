import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import PixelSpinner from "../components/PixelSpinner";
import StreamingText from "../components/StreamingText";
import { experienceEntries } from "../data/content";

export default function Experience() {
  const [stage, setStage] = useState<"loading" | "streaming" | "done">("loading");
  const [entryIndex, setEntryIndex] = useState(0);
  const [streamKey, setStreamKey] = useState(0);

  const isLast = entryIndex === experienceEntries.length - 1;

  useEffect(() => {
    const t = setTimeout(() => {
      setStage("streaming");
      setEntryIndex(0);
      setStreamKey(0);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  if (stage === "loading") return <PixelSpinner />;

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">Experience</Text>
      <Text> </Text>

      {experienceEntries.map((e, i) => {
        if (i > entryIndex) return null;

        return (
          <Box key={i} flexDirection="column" marginBottom={1}>
            <Text bold color="magenta">{e.title}</Text>
            <Text color="gray" italic>{e.subtitle}</Text>
            <Text color="yellow">{e.period}</Text>
            <Text> </Text>
            {i === entryIndex ? (
              <StreamingText
                key={streamKey}
                text={e.description}
                onDone={() => {
                  if (isLast) {
                    setStage("done");
                  } else {
                    setEntryIndex((n) => n + 1);
                    setStreamKey((k) => k + 1);
                  }
                }}
              />
            ) : (
              <Text>{e.description}</Text>
            )}
            <Text> </Text>
          </Box>
        );
      })}
    </Box>
  );
}
