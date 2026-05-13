import Image from "next/image";
import { getFeaturedProjects } from "../../lib/services/projects";

export default async function ProjectGrid() {
  const projects = await getFeaturedProjects();

  return (
    <section id="projects" className="work">
      <div className="work__inner">
        <div className="work__head reveal">
          <div>
            <h2>Featured projects.</h2>
            <p className="sub">
              Cherry-picked builds. Cinematic motion, real data, shipped.
            </p>
          </div>
          <a
            href="https://github.com/kevinAtapattu"
            target="_blank"
            rel="noopener noreferrer"
            className="work-card__link"
            style={{ padding: "8px 0" }}
          >
            View everything on GitHub
          </a>
        </div>

        <div className="work__grid">
          {projects.map((project, i) => (
            <a
              key={project.slug}
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`work-card reveal reveal--delay-${(i % 3) + 1}`}
            >
              <div
                className="work-card__thumb"
                style={project.thumbnail ? { background: "#0c0d12" } : undefined}
              >
                {project.thumbnail ? (
                  <Image
                    src={project.thumbnail}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1068px) 50vw, 33vw"
                    style={{ objectFit: "fill" }}
                  />
                ) : (
                  <div className="thumb-pattern">
                    <div className="thumb-pattern__glyph">{project.glyph}</div>
                    <div className="thumb-pattern__chip">{project.tech[0]}</div>
                  </div>
                )}
              </div>

              <div className="work-card__category">{project.category}</div>
              <h3 className="work-card__name">{project.title}</h3>
              <p className="work-card__summary">{project.summary}</p>

              <div className="work-card__tags">
                {project.tech.map((tag) => (
                  <span key={tag} className="work-card__tag">{tag}</span>
                ))}
              </div>

              <span className="work-card__link">View on GitHub</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
