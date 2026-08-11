import React, { useEffect, useState, useMemo } from "react";
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

  const combinedText = useMemo(
    () =>
      experienceEntries
        .map(
          (e) => `  ${e.title}\n  ${e.subtitle}\n  ${e.period}`
        )
        .join("\n\n"),
    []
  );

  return (
    <Box flexDirection="column">
      {stage === "loading" && <PixelSpinner />}
      {(stage === "streaming" || stage === "done") && (
        <>
          <Text bold color="cyan">Experience</Text>
          <Text> </Text>
          <StreamingText text={combinedText} onDone={() => setStage("done")} />
        </>
      )}
    </Box>
  );
}
