import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import PixelSpinner from "../components/PixelSpinner";
import StreamingText from "../components/StreamingText";
import { contactInfo } from "../data/content";

const gmailLink =
  "https://mail.google.com/mail/?view=cm&fs=1&to=saovisal12192005@gmail.com&su=Portfolio%20Inquiry";

const contactText = `  Phone     ${contactInfo.phone}
  Email     ${contactInfo.email}`;

export default function Contact() {
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
          <Text bold color="cyan">Contact</Text>
          <Text> </Text>
          <StreamingText text={contactText} onDone={() => setStage("done")} />
          {stage === "done" && (
            <>
              <Text>  LinkedIn  <Text color="cyan" underline>{contactInfo.linkedin}</Text></Text>
              <Text>  GitHub    <Text color="cyan" underline>{contactInfo.github}</Text></Text>
              <Text> </Text>
              <Text color="dim">  Note: ctrl+click / ⌘+click to open links</Text>
              <Text> </Text>
              <Box marginTop={1} flexDirection="column" borderStyle="round" borderColor="cyan" paddingLeft={1} paddingRight={1} width={60}>
                <Text>Send me a message via Gmail:</Text>
                <Text> </Text>
                <Text color="cyan" underline>{gmailLink}</Text>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}
