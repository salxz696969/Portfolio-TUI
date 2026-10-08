export interface Skill {
  name: string;
  category: string;
  color: string;
}

// Icons come from techIconColors.json (generated from logo files); skills
// without generated colors fall back to a solid block in their brand color.
export const skills: Skill[] = [
  { name: "JavaScript",   category: "Languages",  color: "#F7DF1E" },
  { name: "TypeScript",   category: "Languages",  color: "#3178C6" },
  { name: "Python",       category: "Languages",  color: "#3776AB" },
  { name: "Dart",         category: "Languages",  color: "#0175C2" },
  { name: "React",        category: "Frontend",   color: "#61DAFB" },
  { name: "Svelte",       category: "Frontend",   color: "#FF3E00" },
  { name: "Tailwind CSS", category: "Frontend",   color: "#06B6D4" },
  { name: "Express",      category: "Backend",    color: "#FFFFFF" },
  { name: "FastAPI",      category: "Backend",    color: "#009688" },
  { name: "NestJS",       category: "Backend",    color: "#E0234E" },
  { name: "Next.js",      category: "Full-Stack", color: "#FFFFFF" },
  { name: "Flutter",      category: "Mobile",     color: "#02569B" },
  { name: "PostgreSQL",   category: "Databases",  color: "#336791" },
  { name: "MongoDB",      category: "Databases",  color: "#47A248" },
  { name: "MySQL",        category: "Databases",  color: "#4479A1" },
  { name: "Redis",        category: "Databases",  color: "#DC382D" },
  { name: "SQLite",       category: "Databases",  color: "#003B57" },
  { name: "Docker",       category: "Tools",      color: "#2496ED" },
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
