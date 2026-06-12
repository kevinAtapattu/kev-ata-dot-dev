import { siteConfig } from "../../lib/config/site";
import Scramble from "./Scramble";

export default function ContactSection() {
  const year = new Date().getFullYear();
  return (
    <section className="g-contact" id="contact">
      <div className="g-section-head" style={{ padding: 0 }}>
        <span className="g-mono">
          <Scramble text="04 — ADD WEIGHT" />
        </span>
      </div>

      <h2 className="g-display g-contact__title">
        Let&apos;s lift
        <br />
        <em>something.</em>
      </h2>

      <p className="g-contact__sub">
        Have something heavy to build? I want under it. Internships, projects,
        or a spot on your hardest problem.
      </p>

      <a className="g-contact__cta" href={`mailto:${siteConfig.socials.email}`}>
        {siteConfig.socials.email}
      </a>

      <div className="g-contact__links">
        <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
        <a href={siteConfig.socials.resume} target="_blank" rel="noopener noreferrer">
          Résumé ↗
        </a>
      </div>

      <footer className="g-footer">
        <span>© {year} Kevin Atapattu</span>
        <span>Built against gravity — no templates, no three.js</span>
        <span>Ottawa / Toronto</span>
      </footer>
    </section>
  );
}
