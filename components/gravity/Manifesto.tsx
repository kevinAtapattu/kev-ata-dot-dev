"use client";

import { useRef } from "react";
import { useScrub } from "../../lib/hooks/useScrub";
import PlateStack from "./PlateStack";

const LINES = [
  { text: "Everything", outline: true },
  { text: "worth doing", outline: true },
  { text: "is heavy.", outline: false }
];

/* Masked shear reveal — each line rises out of its mask, scrubbed by scroll
   position and staggered. Scrolling back down-weights it again. */
export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useScrub(ref, (p) => {
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      const lp = Math.min(1, Math.max(0, p * 3.4 - i * 0.32));
      const e = 1 - Math.pow(1 - lp, 3);
      el.style.transform = `translateY(${(1 - e) * 110}%)`;
    });
  });

  return (
    <section ref={ref} className="g-manifesto">
      <div className="g-manifesto__grid">
        <div>
          {LINES.map((line, i) => (
            <div className="g-manifesto__line" key={line.text}>
              <span
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className={`g-display${line.outline ? " g-outline" : ""}`}
              >
                {line.text}
              </span>
            </div>
          ))}

          <p className="g-manifesto__body">
            Squats, systems, startups — same physics. Pick a load slightly
            heavier than you can handle, recover, repeat. I&apos;ve been
            running progressive overload since founding a production company
            at <strong>15</strong>; the barbell just made it literal. Now I
            ship at <strong>IBM</strong> for 10M+ learners, compete in{" "}
            <strong>CANPL powerlifting</strong>, and climb walls for fun.
          </p>
        </div>

        <div className="g-manifesto__viz" aria-hidden="false">
          <PlateStack />
        </div>
      </div>
    </section>
  );
}
