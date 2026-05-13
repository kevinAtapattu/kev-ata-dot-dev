"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 44;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function HeroSection() {
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = portraitRef.current;
      if (!el) return;
      const y = window.scrollY;
      const offset = Math.min(y * 0.18, 120);
      const scale = 1 + Math.min(y * 0.0003, 0.06);
      el.style.transform = `translate3d(0, ${offset}px, 0) scale(${scale})`;
      el.style.opacity = String(Math.max(0, 1 - y * 0.0018));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="top" className="tile tile--black hero">
      <div className="hero__eyebrow reveal">Engineer · Lifter · Builder</div>

      <h1 className="reveal reveal--delay-1">
        Hi, I&apos;m Kevin.
        <br />
        <em>Building goated products</em>
        <br />
        <em>with discipline and intent.</em>
      </h1>

      <p className="hero__tag reveal reveal--delay-2">
        Pro. Personal. Beyond the bar.
      </p>

      <div className="hero__cta-row reveal reveal--delay-3">
        <a
          href="#work"
          className="hero__pill-primary"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("work");
          }}
        >
          See my work
        </a>
        <a href="mailto:kevinatapattu@gmail.com" className="hero__pill-secondary">
          Get in touch ›
        </a>
      </div>

      <div ref={portraitRef} className="hero__portrait reveal reveal--delay-4">
        <Image
          src="/ai-pl.jpeg"
          alt="Kevin Atapattu"
          fill
          className="object-cover"
          style={{ objectPosition: "50% 30%" }}
          priority
        />
      </div>
    </section>
  );
}
