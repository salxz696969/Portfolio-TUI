import React, { useState, useMemo, useRef } from "react";
import { Box, Text, useInput, useApp, useStdout } from "ink";
import Header from "./components/Header";
import Menu from "./components/Menu";
import About from "./screens/About";
import Skills from "./screens/Skills";
import Experience from "./screens/Experience";
import Contact from "./screens/Contact";

type ScreenId = "about" | "skills" | "experience" | "contact";
const menuItems = ["About Me", "Skills", "Experience", "Contact"];
const screenMap: Record<string, ScreenId> = {
  "About Me": "about",
  Skills: "skills",
  Experience: "experience",
  Contact: "contact",
};

const HEADER_LINES = 4;

export default function App() {
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [menuIndex, setMenuIndex] = useState(0);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const escRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const screen = screenMap[menuItems[menuIndex]];

  const contentHeight = useMemo(() => {
    const rows = stdout?.rows ?? 24;
    return Math.max(5, rows - HEADER_LINES - 1);
  }, [stdout?.rows]);

  useInput((_input, key) => {
    if (key.escape) {
      if (escRef.current) {
        clearTimeout(escRef.current);
        escRef.current = null;
        exit();
      } else {
        setShowExitPrompt(true);
        escRef.current = setTimeout(() => {
          escRef.current = null;
          setShowExitPrompt(false);
        }, 3000);
      }
      return;
    }
    if (key.upArrow) {
      setMenuIndex((i) => (i - 1 + menuItems.length) % menuItems.length);
    } else if (key.downArrow) {
      setMenuIndex((i) => (i + 1) % menuItems.length);
    }
  });

  return (
    <Box flexDirection="column" height={stdout?.rows ?? 24}>
      <Header />
      <Box flexDirection="row" marginTop={1} height={contentHeight}>
        <Box flexDirection="column" marginRight={4} flexShrink={0} width={16}>
          <Menu items={menuItems} selectedIndex={menuIndex} />
        </Box>
        <Box flexDirection="column" flexGrow={1}>
          <Box key={menuIndex} flexDirection="column">
            {screen === "about" && <About />}
            {screen === "skills" && <Skills maxLines={contentHeight} />}
            {screen === "experience" && <Experience />}
            {screen === "contact" && <Contact />}
          </Box>
        </Box>
      </Box>
      {showExitPrompt && (
        <Box marginTop={1}>
          <Text color="yellow" bold>
            {"  Press esc again to exit"}
          </Text>
        </Box>
      )}
    </Box>
  );
}
