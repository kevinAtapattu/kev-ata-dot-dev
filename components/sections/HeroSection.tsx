"use client";

import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { siteConfig } from "../../lib/config/site";
import { useThemeToggle } from "../../lib/hooks/useThemeToggle";

export default function HeroSection() {
  const { theme, toggle } = useThemeToggle();

  return (
    <section className="flex flex-col gap-8">
      <Badge>Currently: {siteConfig.location}</Badge>
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.6em] text-white/60">{siteConfig.tagline}</p>
          <h1 className="text-5xl font-semibold">Kevin Ata</h1>
          <p className="text-lg text-white/70">
            Crafting dynamic, fluid interfaces with performance-first engineering and a taste for cinematic interactions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button>View Work</Button>
            <Button variant="ghost">Resume</Button>
          </div>
        </div>
        <div className="hidden min-h-[200px] flex-1 rounded-[40px] border border-white/5 bg-gradient-to-b from-white/10 to-white/0 p-6 sm:block">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Theme</p>
          <p className="text-3xl font-semibold">{theme}</p>
          <Button className="mt-8" onClick={toggle}>
            Toggle Theme
          </Button>
        </div>
      </div>
    </section>
  );
}
