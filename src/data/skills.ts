export interface Skill {
  name: string;
  category: string;
  color: string;
  icon: string;
}

export const skills: Skill[] = [
  { name: "JavaScript", category: "Languages", color: "#F7DF1E", icon: "▉┐" },
  { name: "TypeScript", category: "Languages", color: "#3178C6", icon: "▗┒" },
  { name: "Python",     category: "Languages", color: "#3776AB", icon: "▗╼" },
  { name: "React",      category: "Frontend",  color: "#61DAFB", icon: "▍▋" },
  { name: "Express",    category: "Backend",   color: "#FFFFFF", icon: "▎▋" },
  { name: "FastAPI",    category: "Backend",   color: "#009688", icon: "╺╸" },
  { name: "NestJS",     category: "Backend",   color: "#E0234E", icon: "▝▊" },
  { name: "Next.js",    category: "Full-Stack",color: "#FFFFFF", icon: "╴╸" },
  { name: "PostgreSQL", category: "Databases", color: "#336791", icon: "▇▉" },
  { name: "MongoDB",    category: "Databases", color: "#47A248", icon: "▊▎" },
  { name: "MySQL",      category: "Databases", color: "#4479A1", icon: "▍▊" },
  { name: "Redis",      category: "Databases", color: "#DC382D", icon: "▁▁" },
  { name: "SQLite",     category: "Databases", color: "#003B57", icon: "▁▘" },
];

export const categoryOrder = [
  "Languages",
  "Frontend",
  "Backend",
  "Full-Stack",
  "Databases",
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
