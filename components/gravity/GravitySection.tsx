"use client";

import { useRef } from "react";
import { useScrub, prefersReducedMotion } from "../../lib/hooks/useScrub";
import Scramble from "./Scramble";

const LIFTS = [
  { label: "Squat", value: 445 },
  { label: "Bench", value: 300 },
  { label: "Deadlift", value: 500 }
];

const TOTAL = LIFTS.reduce((sum, lift) => sum + lift.value, 0);

/* Pinned section — the comp numbers are scrubbed by scroll, not played on a
   timer. Push into the section and the plates load; scroll back and they
   unload. Reps. */
export default function GravitySection() {
  const ref = useRef<HTMLElement>(null);
  const liftRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const totalRef = useRef<HTMLSpanElement>(null);

  useScrub(ref, (p) => {
    if (prefersReducedMotion()) p = 1;
    const e = Math.min(1, p * 1.5);
    const eased = 1 - Math.pow(1 - e, 2);
    LIFTS.forEach((lift, i) => {
      const el = liftRefs.current[i];
      if (el) el.textContent = String(Math.round(lift.value * eased));
    });
    if (totalRef.current) {
      totalRef.current.textContent = String(
        Math.round(TOTAL * eased)
      ).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }, "pinned");

  return (
    <section ref={ref} className="g-gravity" id="gravity">
      <div className="g-gravity__pin">
        <div className="g-section-head g-gravity__head">
          <span className="g-mono">
            <Scramble text="03 — AGAINST GRAVITY" />
          </span>
        </div>

        <div className="g-lifts">
          {LIFTS.map((lift, i) => (
            <div key={lift.label}>
              <div className="g-lift__label">{lift.label} — best comp lift</div>
              <div className="g-lift__value">
                <span
                  ref={(el) => {
                    liftRefs.current[i] = el;
                  }}
                >
                  0
                </span>
                <span className="g-lift__unit">LB</span>
              </div>
            </div>
          ))}
        </div>

        <div className="g-total">
          <span className="g-total__value" aria-label={`${TOTAL} pound total`}>
            <span ref={totalRef}>0</span>
          </span>
          <span className="g-total__caption">
            LB total. CANPL competitive powerlifter. President of Ravens
            Powerlifting. The numbers load as you scroll — scroll back and
            they unload. Reps.
          </span>
        </div>

        <p className="g-gravity__foot">
          Lifting is gravity resisted. Climbing is gravity defied —{" "}
          <strong>recently trading the platform for the wall</strong>,
          learning to move weight upward when the weight is me. Same
          discipline either way: show up, add load, recover, repeat.
        </p>
      </div>
    </section>
  );
}
