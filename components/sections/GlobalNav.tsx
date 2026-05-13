"use client";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 44;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function GlobalNav() {
  return (
    <nav className="gn">
      <div className="gn__row">
        <a
          href="#top"
          className="gn__brand"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="gn__brand-mark">K</span>
          <span>Kevin Atapattu</span>
        </a>
        <div className="gn__links">
          <a href="#story" onClick={(e) => { e.preventDefault(); scrollToId("story"); }}>Story</a>
          <a href="#work"  onClick={(e) => { e.preventDefault(); scrollToId("work"); }}>Work</a>
          <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToId("projects"); }}>Projects</a>
          <a href="#pursuits" onClick={(e) => { e.preventDefault(); scrollToId("pursuits"); }}>Pursuits</a>
          <a
            href="/kevin_atapattu_resume.pdf"
            className="gn__cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}
