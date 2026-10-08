export const profile = {
  name: "SAO VISAL",
  title: "Full-Stack Developer",
  location: "Phnom Penh, Cambodia",
  now: "Intern @ CamCyber",
};

export const aboutParagraphs = [
  "Hello! I'm Sao Visal, a full-stack developer and computer science student based in Phnom Penh, Cambodia.",
  "I build web apps end to end: APIs and databases on the backend, React and Svelte on the frontend. Team projects I've worked on range from an open-source STEM learning platform for Cambodian students to a cinema booking system and a bilingual social app.",
];

export const quickFacts: [label: string, value: string][] = [
  ["Now", "Intern @ CamCyber"],
  ["Studying", "Software Engineering @ CADT"],
  ["Based in", "Phnom Penh, Cambodia"],
  ["Focus", "Full-stack web · TypeScript"],
];

export interface ExperienceEntry {
  title: string;
  subtitle: string;
  period: string;
  current?: boolean;
}

export const experienceGroups: { label: string; entries: ExperienceEntry[] }[] = [
  {
    label: "Work",
    entries: [
      {
        title: "CamCyber",
        subtitle: "Internship",
        period: "Aug 2026 – Present",
        current: true,
      },
      {
        title: "Next Make inc.co",
        subtitle: "Internship",
        period: "Apr 2026 – Jul 2026",
      },
    ],
  },
  {
    label: "Education",
    entries: [
      {
        title: "Cambodia Academy of Digital Technology (CADT)",
        subtitle: "Computer Science · Software Engineering",
        period: "2024 – Present",
        current: true,
      },
    ],
  },
  {
    label: "Programs",
    entries: [
      {
        title: "Next-Gen Engagement Program – Batch II",
        subtitle: "Batch Trainer and Project Contributor",
        period: "Aug 2025 – Sep 2025",
      },
    ],
  },
];

export interface Project {
  name: string;
  description: string;
  tech: string[];
  url: string;
}

export const projects: Project[] = [
  {
    name: "KOMPLEX",
    description:
      "Open-source STEM learning platform for Cambodian high-school students, with 3D models, interactive graphs and an AI tutor.",
    tech: ["Next.js", "TypeScript", "Three.js", "MeiliSearch"],
    url: "https://github.com/KOMPLEX-KH/KOMPLEX",
  },
  {
    name: "Jiyuu SNS",
    description:
      "Bilingual (English / Japanese) social app running on Cloudflare Workers with Google sign-in.",
    tech: ["SvelteKit", "Cloudflare D1", "Drizzle", "Better Auth"],
    url: "https://github.com/JIYUU-Team-3/jiyuu-sns",
  },
  {
    name: "Grand Cineplex",
    description:
      "Cinema management system with separate customer, cashier and manager interfaces and live seat reservations.",
    tech: ["React", "Express", "PostgreSQL", "Sequelize"],
    url: "https://github.com/RaksaOC/Grand-Cineplex",
  },
  {
    name: "Jou Em",
    description:
      "Khmer-themed fruit-merging physics puzzle game with a global leaderboard.",
    tech: ["Game", "Leaderboard API"],
    url: "https://github.com/Neitong/Fruit-Merge-Game",
  },
  {
    name: "Velo Toulouse",
    description:
      "Bike rental and subscription app refactored to the MVVM pattern, with station maps and payments.",
    tech: ["Flutter", "Dart", "Firebase"],
    url: "https://github.com/Ra-Fat/Velo-Toulouse",
  },
  {
    name: "Premier League Prediction",
    description:
      "Predicts match outcomes from form, fatigue and tactical features; compares Random Forest, XGBoost and more.",
    tech: ["Python", "Machine Learning", "XGBoost"],
    url: "https://github.com/salxz696969/premier-league-prediction-2019-2020",
  },
  {
    name: "KeebsForKeebs",
    description:
      "Mechanical keyboard storefront with an interactive 3D viewer and live switch sound tests.",
    tech: ["React", "Three.js", "Tailwind CSS"],
    url: "https://github.com/salxz696969/keyboard-showcase",
  },
  {
    name: "Portfolio TUI",
    description: "This portfolio: a terminal app served to the browser over ttyd.",
    tech: ["Ink", "React", "TypeScript", "Docker"],
    url: "https://github.com/salxz696969/Portfolio-TUI",
  },
];

export const contactInfo = {
  phone: "+855 966643834",
  email: "saovisal12192005@gmail.com",
  linkedin: "https://www.linkedin.com/in/sao-visal-7145b7339/",
  github: "https://github.com/salxz696969",
};
