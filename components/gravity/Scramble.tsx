"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../lib/hooks/useScrub";

const CHARS = "▮▯/\\|<>+=*#%_";

/* Mono characters resolve left-to-right into the real text on first view. */
export default function Scramble({
  text,
  className
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || interval) return;
        const start = performance.now();
        const duration = 700;
        interval = setInterval(() => {
          const p = Math.min(1, (performance.now() - start) / duration);
          const resolved = Math.floor(p * text.length);
          let out = text.slice(0, resolved);
          for (let i = resolved; i < text.length; i++) {
            const c = text[i];
            out +=
              c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          el.textContent = out;
          if (p >= 1 && interval) {
            clearInterval(interval);
            el.textContent = text;
          }
        }, 34);
        io.disconnect();
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
