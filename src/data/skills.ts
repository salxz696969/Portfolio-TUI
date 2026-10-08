export interface Skill {
  name: string;
  category: string;
  /** Brand color, used as the badge background. */
  color: string;
  /** Two-letter badge label. */
  badge: string;
}

export const skills: Skill[] = [
  { name: "JavaScript",   category: "Languages",  color: "#F7DF1E", badge: "JS" },
  { name: "TypeScript",   category: "Languages",  color: "#3178C6", badge: "TS" },
  { name: "Python",       category: "Languages",  color: "#3776AB", badge: "Py" },
  { name: "Dart",         category: "Languages",  color: "#0175C2", badge: "Dt" },
  { name: "React",        category: "Frontend",   color: "#61DAFB", badge: "Re" },
  { name: "Svelte",       category: "Frontend",   color: "#FF3E00", badge: "Sv" },
  { name: "Tailwind CSS", category: "Frontend",   color: "#06B6D4", badge: "Tw" },
  { name: "Express",      category: "Backend",    color: "#FFFFFF", badge: "Ex" },
  { name: "FastAPI",      category: "Backend",    color: "#009688", badge: "Fa" },
  { name: "NestJS",       category: "Backend",    color: "#E0234E", badge: "Ne" },
  { name: "Next.js",      category: "Full-Stack", color: "#FFFFFF", badge: "Nx" },
  { name: "Flutter",      category: "Mobile",     color: "#02569B", badge: "Fl" },
  { name: "PostgreSQL",   category: "Databases",  color: "#336791", badge: "Pg" },
  { name: "MongoDB",      category: "Databases",  color: "#47A248", badge: "Mg" },
  { name: "MySQL",        category: "Databases",  color: "#4479A1", badge: "My" },
  { name: "Redis",        category: "Databases",  color: "#DC382D", badge: "Rd" },
  { name: "SQLite",       category: "Databases",  color: "#003B57", badge: "Sq" },
  { name: "Docker",       category: "Tools",      color: "#2496ED", badge: "Dk" },
];

export const categoryOrder = [
  "Languages",
  "Frontend",
  "Backend",
  "Full-Stack",
  "Mobile",
  "Databases",
  "Tools",
];

export function getSkillsByCategory(): Map<string, Skill[]> {
  const map = new Map<string, Skill[]>();
  for (const cat of categoryOrder) {
    map.set(
      cat,
      skills.filter((s) => s.category === cat)
    );
  }
  return map;
}
