"use client";

import { useRef } from "react";
import { type Project } from "../../lib/models/project";
import { useScrub } from "../../lib/hooks/useScrub";
import Scramble from "./Scramble";

/* Index rows that shift into place as they travel the viewport, with a full
   black→white inversion on hover. */
export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useScrub(ref, (p) => {
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const rp = Math.min(1, Math.max(0, p * 2.6 - i * 0.22));
      const e = 1 - Math.pow(1 - rp, 3);
      const dir = i % 2 === 0 ? 1 : -1;
      el.style.transform = `translateX(${(1 - e) * 70 * dir}px)`;
      el.style.opacity = String(0.15 + e * 0.85);
    });
  });

  return (
    <section className="g-projects" id="builds">
      <div className="g-section-head">
        <span className="g-mono">
          <Scramble text="02 — SELECTED BUILDS" />
        </span>
      </div>

      <div ref={ref} className="g-rows">
        {projects.map((project, i) => (
          <a
            key={project.slug}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className="g-row"
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="g-row__index">
              /{String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="g-display g-row__title">{project.title}</h3>
            <div className="g-row__info">
              <span className="g-row__cat">{project.category}</span>
              <span className="g-row__sum">{project.summary}</span>
            </div>
            <span className="g-row__arrow">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
