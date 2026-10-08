/**
 * Screens describe their content as styled text so ScreenView can stream it
 * character by character. One `Line` is exactly one terminal row.
 */
export interface Span {
  text: string;
  color?: string;
  bg?: string;
  bold?: boolean;
  italic?: boolean;
  dim?: boolean;
}
export type Line = Span[];

export const span = (text: string, style: Omit<Span, "text"> = {}): Span => ({ text, ...style });

export const lineLength = (line: Line) => line.reduce((n, s) => n + s.text.length, 0);

/** The first `n` characters of `line`, keeping styles. */
export function sliceLine(line: Line, n: number): Line {
  const out: Line = [];
  for (const s of line) {
    if (n <= 0) break;
    out.push(n >= s.text.length ? s : { ...s, text: s.text.slice(0, n) });
    n -= s.text.length;
  }
  return out;
}

/** Word-wrap `text` into lines no wider than `width` columns. */
export function wrapText(text: string, width: number): string[] {
  const out: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (!word) continue;
    if (!line) line = word;
    else if (line.length + 1 + word.length <= width) line += " " + word;
    else {
      out.push(line);
      line = word;
    }
  }
  if (line) out.push(line);
  return out;
}
