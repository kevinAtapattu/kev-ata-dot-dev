import { type Project } from "../models/project";

const featuredProjects: Project[] = [
  {
    slug: "leadvault",
    title: "LeadVault",
    summary:
      "AI-powered lead generation platform that scrapes Google Maps with Playwright and generates pitch-ready client landing pages via Claude.",
    tech: ["Next.js", "TypeScript", "Claude AI", "Playwright", "Supabase"],
    repoUrl: "https://github.com/kevinAtapattu",
    category: "Lead Gen · AI",
    glyph: "L",
    thumbnail: "/projects/leadvault.png"
  },
  {
    slug: "pwrlft",
    title: "PwrLft",
    summary:
      "iOS app for powerlifters to track lifts, plan training sessions, and chase heavier numbers with structured programming.",
    tech: ["Swift", "SwiftUI", "iOS"],
    repoUrl: "https://github.com/kevinAtapattu/PwrLft",
    category: "iOS · Fitness",
    glyph: "P",
    thumbnail: "/projects/pwrlft.svg"
  },
  {
    slug: "sysoptix",
    title: "SysOptix",
    summary:
      "Real-time system monitoring tool that streams CPU, memory, and GPU metrics, with an LSTM neural network forecasting bottlenecks.",
    tech: ["Python", "PyTorch", "Flask", "MongoDB"],
    repoUrl: "https://github.com/kevinAtapattu",
    category: "ML · Systems",
    glyph: "S",
    thumbnail: "/projects/sysoptix.svg"
  },
  {
    slug: "5080finder",
    title: "5080Finder",
    summary:
      "Python script that scanned retailers for RTX 5080 stock and pinged me with alerts — how I actually secured my GPU during the launch.",
    tech: ["Python", "Web Scraping", "Notifications"],
    repoUrl: "https://github.com/kevinAtapattu/5080Finder",
    category: "Automation · Script",
    glyph: "5",
    thumbnail: "/projects/5080finder.svg"
  }
];

export async function getFeaturedProjects(): Promise<Project[]> {
  return featuredProjects;
}
