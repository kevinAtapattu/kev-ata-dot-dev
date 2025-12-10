import { type Project } from "../models/project";

const fallbackProjects: Project[] = [
  {
    slug: "motion-dashboard",
    title: "Motion Dashboard",
    summary: "Realtime analytics surface with smooth motion primitives and live data feed.",
    tech: ["Next.js", "TypeScript", "TailwindCSS"],
    repoUrl: "https://github.com/kevin/motion-dashboard",
    liveUrl: "https://motion-dashboard.example.com"
  },
  {
    slug: "neon-portfolio",
    title: "Neon Portfolio",
    summary: "Interactive, dark, neon portfolio concept highlighting experimental UX.",
    tech: ["React", "Framer Motion", "Three.js"],
    repoUrl: "https://github.com/kevin/neon-portfolio",
    liveUrl: "https://neon-portfolio.example.com"
  }
];

export async function getFeaturedProjects(): Promise<Project[]> {
  // Placeholder for future GitHub/API fetch logic.
  return fallbackProjects;
}
