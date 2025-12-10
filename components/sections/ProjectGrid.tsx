import Card from "../ui/Card";
import Button from "../ui/Button";
import { getFeaturedProjects } from "../../lib/services/projects";

export default async function ProjectGrid() {
  const projects = await getFeaturedProjects();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Featured Work</h2>
        <Button variant="ghost">View GitHub</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.slug} className="flex flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/50">{project.slug}</p>
              <h3 className="text-2xl font-semibold">{project.title}</h3>
            </div>
            <p className="text-white/70">{project.summary}</p>
            <div className="flex flex-wrap gap-2 text-xs text-white/60">
              {project.tech.map((stack) => (
                <span key={stack} className="rounded-full border border-white/10 px-2 py-1">
                  {stack}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
