"use client";

import { useEffect, useState } from "react";

export default function StickyBar() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setHidden(window.scrollY < window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div id="contact" className={`stickybar${hidden ? " stickybar--hidden" : ""}`}>
      <div className="stickybar__copy">
        <span className="stickybar__dot" aria-hidden="true" />
        <span>
          <strong style={{ fontWeight: 600 }}>
            Available for Summer 2026 internships.
          </strong>
        </span>
        <span className="stickybar__meta">· Toronto · Open to remote.</span>
      </div>
      <a href="mailto:kevinatapattu@gmail.com" className="stickybar__cta">
        Say hello ›
      </a>
    </div>
  );
}
