"use client";

import { useRef, type ReactNode } from "react";
import { useScrub } from "../../lib/hooks/useScrub";
import Scramble from "./Scramble";

type Job = {
  org: string;
  role: string;
  period: string;
  stack: string[];
  points: ReactNode[];
  bg: string;
};

const JOBS: Job[] = [
  {
    org: "IBM",
    role: "Software Engineer Intern — Current",
    period: "Sep 2025 →",
    stack: ["Ruby on Rails", "TypeScript", "Docker", "Kubernetes", "PostgreSQL"],
    bg: "#0d0d0d",
    points: [
      <>
        Two-phase monitoring automation in the portal-deploy pipeline —
        bulk-registered <strong>100+ portals</strong> via the Instana API,{" "}
        <strong>cutting monitoring costs by 100%</strong>.
      </>,
      <>
        Built the learner-facing Activities layer on IBM&apos;s multi-tenant
        LMS, <strong>serving 10M+ global learners</strong>.
      </>,
      <>
        Demo the platform to <strong>global clients</strong>; review AI
        features and core platform PRs.
      </>
    ]
  },
  {
    org: "Anvil",
    role: "Software Engineer Intern",
    period: "Jan — May 2025",
    stack: ["Python", "Django", "DRF", "PostgreSQL", "Elasticsearch"],
    bg: "#101010",
    points: [
      <>
        API validation layer that rejects unauthorized fields —{" "}
        <strong>data integrity by default</strong>.
      </>,
      <>
        Data import script that cut load times by <strong>97.5%</strong>,
        accelerating UI testing and iteration.
      </>,
      <>
        PyTest suites to <strong>80% coverage</strong>, zero regressions
        shipped.
      </>
    ]
  },
  {
    org: "Okami",
    role: "Founder & Frontend Developer",
    period: "2020 — 2022 · Founded at 15",
    stack: ["React", "JavaScript", "Videography", "Design"],
    bg: "#131313",
    points: [
      <>
        Founded a videography &amp; graphic design studio at{" "}
        <strong>15</strong> — client work, production, delivery, all of it.
      </>,
      <>
        Built the React portfolio that closed clients —{" "}
        <strong>$40k+ in revenue</strong> before finishing high school.
      </>
    ]
  },
  {
    org: "Carleton",
    role: "BSc Computer Science",
    period: "2022 — 2027",
    stack: ["Systems", "Software Design", "Applied Algorithms"],
    bg: "#0b0b0b",
    points: [
      <>
        CS undergrad on track for <strong>2027</strong>, interning full-stack
        in parallel.
      </>,
      <>
        <strong>President of Ravens Powerlifting</strong> — running the club,
        the meets, and my own prep.
      </>
    ]
  }
];

/* Sticky plate stack — cards pin and compress as the next one loads on top. */
export default function WorkStack() {
  const ref = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useScrub(ref, () => {
    const cards = cardRefs.current;
    const vh = window.innerHeight;
    for (let i = 0; i < cards.length - 1; i++) {
      const card = cards[i];
      const next = cards[i + 1];
      if (!card || !next) continue;
      const gap = next.getBoundingClientRect().top - card.getBoundingClientRect().top;
      const cover = Math.min(1, Math.max(0, 1 - (gap - 30) / (vh * 0.6)));
      card.style.transform = `scale(${1 - cover * 0.06})`;
      card.style.filter = `brightness(${1 - cover * 0.5})`;
    }
  });

  return (
    <section className="g-work" id="work">
      <div className="g-section-head">
        <span className="g-mono">
          <Scramble text="01 — WORK UNDER LOAD" />
        </span>
      </div>

      <div ref={ref} className="g-stack">
        {JOBS.map((job, i) => (
          <article
            key={job.org}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="g-card"
            style={{ top: 90 + i * 16, background: job.bg }}
          >
            <div className="g-card__index">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h3 className="g-display g-card__org">{job.org}</h3>
              <div className="g-card__role">{job.role}</div>
              <ul className="g-card__points">
                {job.points.map((point, j) => (
                  <li key={j}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="g-card__meta">
              <div className="g-card__period">{job.period}</div>
              <div className="g-card__stack">{job.stack.join(" / ")}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
