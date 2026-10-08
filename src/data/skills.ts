export interface Skill {
  name: string;
  category: string;
  /** devicon folder name; the logo is read from devicon/icons/<icon>/<icon>-<variant>.svg */
  icon: string;
  variant?: string;
  /** Logo is black: invert it so it shows on a dark terminal. */
  invert?: boolean;
}

// Icons are generated from these by `pnpm generate:icons`.
export const skills: Skill[] = [
  { name: "JavaScript",   category: "Languages",         icon: "javascript" },
  { name: "TypeScript",   category: "Languages",         icon: "typescript" },
  { name: "Python",       category: "Languages",         icon: "python" },
  { name: "Dart",         category: "Languages",         icon: "dart" },
  { name: "React",        category: "Frontend & Mobile", icon: "react" },
  { name: "Next.js",      category: "Frontend & Mobile", icon: "nextjs", invert: true },
  { name: "Svelte",       category: "Frontend & Mobile", icon: "svelte" },
  { name: "Tailwind CSS", category: "Frontend & Mobile", icon: "tailwindcss" },
  { name: "Flutter",      category: "Frontend & Mobile", icon: "flutter" },
  { name: "Express",      category: "Backend",           icon: "express", invert: true },
  { name: "NestJS",       category: "Backend",           icon: "nestjs" },
  { name: "FastAPI",      category: "Backend",           icon: "fastapi" },
  { name: "PostgreSQL",   category: "Databases & Tools", icon: "postgresql" },
  { name: "MongoDB",      category: "Databases & Tools", icon: "mongodb" },
  { name: "MySQL",        category: "Databases & Tools", icon: "mysql" },
  { name: "Redis",        category: "Databases & Tools", icon: "redis" },
  { name: "SQLite",       category: "Databases & Tools", icon: "sqlite" },
  { name: "Docker",       category: "Databases & Tools", icon: "docker" },
];

export const categoryOrder = ["Languages", "Frontend & Mobile", "Backend", "Databases & Tools"];

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
