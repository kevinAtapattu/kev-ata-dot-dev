"use client";

import { useEffect, useRef } from "react";

/* Fixed scroll-progress rail — the page "loads" like a bar as you descend. */
export default function LoadRail() {
  const fillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fillRef.current) fillRef.current.style.height = `${p * 100}%`;
      if (labelRef.current) {
        labelRef.current.textContent = `LOAD ${String(
          Math.round(p * 100)
        ).padStart(3, "0")}%`;
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
  }, []);

  return (
    <div className="g-rail" aria-hidden="true">
      <div className="g-rail__track">
        <div ref={fillRef} className="g-rail__fill" />
      </div>
      <div ref={labelRef} className="g-rail__label">
        LOAD 000%
      </div>
    </div>
  );
}
