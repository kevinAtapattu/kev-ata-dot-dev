import Card from "../ui/Card";
import ScrollReveal from "../ui/ScrollReveal";
import { getFeaturedProjects } from "../../lib/services/projects";
import {
  SiPython,
  SiSwift,
  SiSupabase,
  SiJson
} from "react-icons/si";
import { IconType } from "react-icons";

const techIcons: Record<string, IconType> = {
  "Python": SiPython,
  "Swift": SiSwift,
  // "SwiftUI": SiSwift,
  "Supabase": SiSupabase,
  "JSON": SiJson,
  // "Pickle": SiPython,
};

export default async function ProjectGrid() {
  const projects = await getFeaturedProjects();

  return (
    <section className="flex flex-col gap-6">
      <ScrollReveal>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Featured Work</h2>
        </div>
      </ScrollReveal>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <ScrollReveal key={project.slug} delay={index * 100}>
            <Card className="flex flex-col gap-4 relative h-full">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              aria-label="View repository"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/50">{project.slug}</p>
              <h3 className="text-2xl font-semibold">{project.title}</h3>
            </div>
            <p className="text-white/70">{project.summary}</p>
            <div className="flex flex-wrap gap-3 text-white/60">
              {project.tech.map((stack) => {
                const Icon = techIcons[stack];
                return Icon ? (
                  <Icon key={stack} className="w-6 h-6" title={stack} />
                ) : (
                  <span key={stack} className="text-xs rounded-full border border-white/10 px-2 py-1">
                    {stack}
                  </span>
                );
              })}
            </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
