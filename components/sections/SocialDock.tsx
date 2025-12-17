"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { siteConfig } from "../../lib/config/site";

const linkItems = [
  {
    href: siteConfig.socials.linkedin,
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
        <path
          d="M4.98 3.5a2.5 2.5 0 11-.01 5 2.5 2.5 0 01.01-5zm-.88 6.71h1.78V20H4.1zm4.35 0h1.71v1.48h.03c.24-.46.83-1.18 1.92-1.18 2.05 0 2.43 1.35 2.43 3.1V20h-1.85v-4.1c0-.98-.02-2.23-1.36-2.23-1.36 0-1.57 1.06-1.57 2.16V20H8.45z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    href: siteConfig.socials.github,
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
        <path
          d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 007.86 10.93c.58.1.79-.25.79-.55v-1.94c-3.2.69-3.87-1.37-3.87-1.37-.52-1.3-1.27-1.65-1.27-1.65-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.8 10.8 0 015.74 0c2.19-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.68.41.36.77 1.07.77 2.15v3.19c0 .3.21.66.8.55A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    href: siteConfig.socials.resume,
    label: "Resume",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
        <path
          d="M6 2a2 2 0 00-2 2v16c0 1.1.9 2 2 2h12a2 2 0 002-2V8.83a2 2 0 00-.59-1.41l-4.83-4.83A2 2 0 0013.17 2H6zm6 2l6 6h-4a2 2 0 01-2-2V4zm-4 9h8v2H8v-2zm0 4h8v2H8v-2z"
          fill="currentColor"
        />
      </svg>
    )
  }
];

export default function SocialDock() {
  const dockRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const targetOffset = useRef(0);
  const frameRef = useRef<number>();

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const rect = dockRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const center = rect.width / 2;
    const ratio = (x - center) / center;
    targetOffset.current = ratio * 30;
  }, []);

  const resetOffset = useCallback(() => {
    targetOffset.current = 0;
  }, []);

  useEffect(() => {
    const tick = () => {
      setOffset((current) => {
        const next = current + (targetOffset.current - current) * 0.12;
        return Math.abs(next - targetOffset.current) < 0.1 ? targetOffset.current : next;
      });
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const dockTransform = `translate3d(${offset * -0.4}px, 0, 0) scale(${isActive ? 1.06 : 1})`;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        ref={dockRef}
        onMouseEnter={() => setIsActive(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          resetOffset();
          setIsActive(false);
        }}
        className="pointer-events-auto inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur transition-all duration-300"
        style={{
          transform: dockTransform,
          paddingInline: isActive ? "2.75rem" : "1.5rem",
          gap: isActive ? "1.75rem" : "1.25rem"
        }}
      >
        {linkItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 transition duration-300 hover:text-white"
          >
            <span className="sr-only">{item.label}</span>
            {item.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
