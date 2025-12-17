"use client";

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
          <p className="text-base text-white/60 max-w-2xl">
            I'm a CS student at Carleton University, currently building enterprise experiences at IBM with previous
            stints at ANVIL and my own media production startup in mainstream entertainment. Away from the developing, I'm a
            competitive CANPL powerlifter. I'm always chasing heavier numbers with the same discipline and obsession I bring
            to all aspects of my life.
          </p>
        </div>
        <div className="flex items-baseline justify-center">
          <div className="relative h-[120px] w-[120px] sm:h-[200px] sm:w-[200px] overflow-hidden rounded-full border-4 border-white/10">
            <Image
              src="/ai-pl.jpeg"
              alt="Kevin Atapattu"
              fill
              className="object-bottom object-cover scale-150 translate-y-5"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
