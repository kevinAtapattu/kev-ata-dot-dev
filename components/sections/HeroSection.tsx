"use client";

import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { siteConfig } from "../../lib/config/site";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="flex flex-col gap-8">
      <Badge>Currently: {siteConfig.location}</Badge>
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.6em] text-white/60">{siteConfig.tagline}</p>
          <h1 className="text-5xl font-semibold">Hi, I'm Kevin Atapattu</h1>
          <p className="text-lg text-white/70">
            Software Engineer, Powerlifter, Caffeine Enthusiast.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button as="a" href="https://github.com/kevinAtapattu" target="_blank" rel="noopener noreferrer">View Work</Button>
            <Button as="a" href="/kevin_atapattu_resume.pdf" target="_blank" rel="noopener noreferrer" variant="ghost">Resume</Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-[120px] w-[120px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full border-4 border-white/10">
            <Image
              src="/headshot.png"
              alt="Kevin Atapattu"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
