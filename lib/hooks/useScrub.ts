"use client";

import { useEffect, useRef, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Scroll-scrubbed progress for a section. Calls `onProgress` with a 0–1
 * value derived from scroll position (reversible — scrolling back rewinds).
 *
 * mode "pinned": for sections taller than the viewport with a sticky child;
 *   progress covers the pinned travel (0 when the pin engages, 1 on release).
 * mode "travel": progress of the element travelling through the viewport
 *   (0 = top edge enters at bottom, 1 = bottom edge leaves at top).
 */
export function useScrub<T extends HTMLElement>(
  ref: RefObject<T>,
  onProgress: (progress: number) => void,
  mode: "pinned" | "travel" = "travel"
) {
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let last = -1;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "pinned") {
        const travel = rect.height - vh;
        p = travel > 0 ? -rect.top / travel : 1;
      } else {
        p = (vh - rect.top) / (vh + rect.height);
      }
      p = Math.min(1, Math.max(0, p));
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        cb.current(p);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, mode]);
}
