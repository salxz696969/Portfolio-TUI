import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import PixelSpinner from "../components/PixelSpinner";
import StreamingText from "../components/StreamingText";
import EmailForm from "../components/EmailForm";
import { contactInfo } from "../data/content";

const contactText = `  Phone     ${contactInfo.phone}
  Email     ${contactInfo.email}`;

export default function Contact() {
  const [stage, setStage] = useState<"loading" | "streaming" | "done">("loading");
  const [submitted, setSubmitted] = useState(false);

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
              <Text color="dim">  Note: ctrl + click / ⌘ + click to open</Text>
              <Text> </Text>
              <Text> </Text>
              <Text color="gray">  Write me a message (enter to send via email):</Text>
              <Box marginTop={1} flexDirection="column" borderStyle="round" borderColor="cyan" paddingLeft={1} paddingRight={1} width={60}>
                <Box flexDirection="row">
                  <Text color="cyan">{"> "}</Text>
                  <EmailForm onSubmitted={() => setSubmitted(true)} />
                </Box>
              </Box>
              {submitted && (
                <Box marginTop={1} flexDirection="column">
                  <Text color="green">  ✓ Opening Gmail in your browser…</Text>
                  <Text color="dim">  If it doesn't open, email me at: {contactInfo.email}</Text>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
}
