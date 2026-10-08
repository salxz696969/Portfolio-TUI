import React, { useCallback, useMemo, useRef, useState } from "react";
import { Box, useApp, useInput } from "ink";
import Header, { headerHeight } from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import About from "./screens/About";
import Experience from "./screens/Experience";
import Projects from "./screens/Projects";
import Skills from "./screens/Skills";
import Contact from "./screens/Contact";
import { useTerminalSize } from "./hooks/useTerminalSize";
import { useMouse, type MouseEvent } from "./mouse";
import { theme } from "./theme";

const screens = [
  { id: "about", label: "About Me" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;
const menuItems = screens.map((s) => s.label);

const SIDEBAR_WIDTH = 15;
const CONTENT_MARGIN = 2;
const EXIT_PROMPT_MS = 3000;

export default function App() {
  const { exit } = useApp();
  const { columns, rows } = useTerminalSize();
  const [menuIndex, setMenuIndex] = useState(0);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draft, setDraft] = useState("");
  const [gmailUrl, setGmailUrl] = useState<string | null>(null);

  const screen = screens[menuIndex].id;

  const onSubmit = useCallback((url: string) => {
    setGmailUrl(url);
    setDraft("");
  }, []);

  useInput((input, key) => {
    // Two-phase exit: the first esc/ctrl+c shows a prompt, the second quits.
    if (key.escape || (key.ctrl && input === "c")) {
      if (exitTimer.current) {
        clearTimeout(exitTimer.current);
        exit();
        return;
      }
      setShowExitPrompt(true);
      exitTimer.current = setTimeout(() => {
        exitTimer.current = null;
        setShowExitPrompt(false);
      }, EXIT_PROMPT_MS);
      return;
    }

    const n = screens.length;
    if (key.upArrow || (key.tab && key.shift)) {
      setMenuIndex((i) => (i - 1 + n) % n);
    } else if (key.downArrow || key.tab) {
      setMenuIndex((i) => (i + 1) % n);
    } else if (screen !== "contact" && /^[1-9]$/.test(input) && Number(input) <= n) {
      // Digits are typed into the message box on the Contact screen.
      setMenuIndex(Number(input) - 1);
    }
  });

  // Ink clears and repaints the whole terminal on every frame when output
  // fills all rows, so leave the last row free to keep incremental updates.
  const height = rows - 1;
  const header = headerHeight(columns, height);
  const bodyHeight = Math.max(5, height - header - 1);
  const contentWidth = Math.max(20, columns - SIDEBAR_WIDTH - 4);
  const origin = useMemo(() => ({ x: SIDEBAR_WIDTH + CONTENT_MARGIN, y: header }), [header]);
  const props = { width: contentWidth, height: bodyHeight, origin };

  // Clicking a menu item opens that screen.
  const onMouse = useCallback(
    (e: MouseEvent) => {
      const item = e.y - header;
      if (e.type === "click" && e.x < SIDEBAR_WIDTH && item >= 0 && item < screens.length) {
        setMenuIndex(item);
      }
    },
    [header]
  );
  useMouse(onMouse);

  return (
    <Box flexDirection="column" width={columns} height={height}>
      <Header columns={columns} rows={height} />
      <Box flexDirection="row" height={bodyHeight}>
        <Box
          flexDirection="column"
          flexShrink={0}
          width={SIDEBAR_WIDTH}
          borderStyle="single"
          borderColor={theme.muted}
          borderDimColor
          borderTop={false}
          borderBottom={false}
          borderLeft={false}
        >
          <Menu items={menuItems} selectedIndex={menuIndex} />
        </Box>
        <Box key={screen} flexDirection="column" marginLeft={CONTENT_MARGIN} flexGrow={1}>
          {screen === "about" && <About {...props} />}
          {screen === "experience" && <Experience {...props} />}
          {screen === "projects" && <Projects {...props} />}
          {screen === "skills" && <Skills {...props} />}
          {screen === "contact" && (
            <Contact
              {...props}
              draft={draft}
              onDraftChange={setDraft}
              gmailUrl={gmailUrl}
              onSubmit={onSubmit}
            />
          )}
        </Box>
      </Box>
      <Footer columns={columns} exitPrompt={showExitPrompt} />
    </Box>
  );
}
