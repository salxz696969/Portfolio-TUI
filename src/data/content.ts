export const profile = {
  name: "SAO VISAL",
  title: "Full-Stack Developer",
  location: "Phnom Penh, Cambodia",
  now: "AI Engineer Intern @ CamCyber",
};

export const aboutParagraphs = [
  "Hello! I'm Sao Visal, a full-stack developer and computer science student based in Phnom Penh, Cambodia.",
];

export const quickFacts: [label: string, value: string][] = [
  ["Now", "AI Engineer Intern @ CamCyber"],
  ["Studying", "Software Engineering @ CADT"],
  ["Based in", "Phnom Penh, Cambodia"],
];

export interface ExperienceEntry {
  title: string;
  subtitle: string;
  period?: string;
  current?: boolean;
}

export const experienceGroups: { label: string; entries: ExperienceEntry[] }[] = [
  {
    label: "Work",
    entries: [
      {
        title: "CamCyber",
        subtitle: "AI Engineer · Internship",
        period: "Aug 2026 – Present",
        current: true,
      },
      {
        title: "Next Make inc.co",
        subtitle: "Full-Stack Engineer · Internship",
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
        title: "Next-Gen Engagement Program – Batch III",
        subtitle: "Mentor",
      },
      {
        title: "AI in Motion (AIM)",
        subtitle: "Technical Coach",
      },
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
    name: "Premier League Prediction",
    description:
      "Predicts match outcomes from form, fatigue and tactical features; compares Random Forest, XGBoost and more.",
    tech: ["Python", "Machine Learning", "XGBoost"],
    url: "https://github.com/salxz696969/premier-league-prediction-2019-2020",
  },
];

export const contactInfo = {
  phone: "+855 966643834",
  email: "saovisal12192005@gmail.com",
  linkedin: "https://www.linkedin.com/in/sao-visal-7145b7339/",
  github: "https://github.com/salxz696969",
};
