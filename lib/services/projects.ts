import { type Project } from "../models/project";

const fallbackProjects: Project[] = [
  {
    slug: "ilift",
    title: "iOS Powerlifting App",
    summary: "Engineered a Swift app tailored for powerlifters to optimize workouts with features like plate conversion and logs.",
    tech: ["Swift", "Supabase"],
    repoUrl: "https://github.com/kevinAtapattu/PwrLft",
  },
  {
    slug: "smartcoach",
    title: "Coach with Machine Learning",
    summary: "Led a team of engineers to develop a reinforcement learning agent to create & optimize a powerlifting program.",
    tech: ["Python", "JSON"],
    repoUrl: "https://github.com/kevinAtapattu",
  }
];

export async function getFeaturedProjects(): Promise<Project[]> {
  // Placeholder for future GitHub/API fetch logic.
  return fallbackProjects;
}
