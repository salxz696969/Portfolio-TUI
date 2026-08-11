import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import PixelSpinner from "../components/PixelSpinner";
import StreamingText from "../components/StreamingText";
import { aboutText } from "../data/content";

export default function About() {
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
          <Text bold color="cyan">About Me</Text>
          <Text> </Text>
          <StreamingText text={aboutText} onDone={() => setStage("done")} />
          {stage === "done" && (
            <>
              <Text> </Text>
              <Text color="gray">  ■ Computer Science student at CADT (2024–2027)</Text>
              <Text color="gray">  ■ Full-stack developer · TypeScript ecosystem</Text>
              <Text color="gray">  ■ Based in Phnom Penh, Cambodia</Text>
            </>
          )}
        </>
      )}
    </Box>
  );
}
