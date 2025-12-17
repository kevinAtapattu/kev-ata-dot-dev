"use client";

import { useEffect, useState } from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { siteConfig } from "../../lib/config/site";
import Image from "next/image";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="flex flex-col gap-8">
      <div
        className={`transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <Badge>Currently: {siteConfig.location}</Badge>
      </div>
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-6">
          <div
            className={`transition-all duration-700 ease-out delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-sm uppercase tracking-[0.6em] text-white/60">{siteConfig.tagline}</p>
          </div>
          <div
            className={`transition-all duration-700 ease-out delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-5xl font-semibold">Hi, I'm Kevin 👋🏽 </h1>
          </div>
          <div
            className={`transition-all duration-700 ease-out delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-lg text-white/70">
              Software Engineer, Powerlifter, Caffeine Enthusiast.
            </p>
          </div>
          <div
            className={`transition-all duration-700 ease-out delay-[400ms] ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-base text-white/60 max-w-2xl">
              I'm a CS student at Carleton University, currently building enterprise experiences at IBM with previous
              experiences at ANVIL and my own media production startup. Away from the developing, I'm a
              competitive CANPL powerlifter and former e-Sports competitor. I'm always chasing bigger numbers with the same discipline and obsession I bring
              to all aspects of my life.
            </p>
          </div>
          <div
            className={`flex flex-wrap gap-4 transition-all duration-700 ease-out delay-500 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Button as="a" href="https://github.com/kevinAtapattu" target="_blank" rel="noopener noreferrer">View Work</Button>
            <Button as="a" href="/kevin_atapattu_resume.pdf" target="_blank" rel="noopener noreferrer" variant="ghost">Resume</Button>
          </div>
        </div>
        <div
          className={`flex items-baseline justify-center transition-all duration-700 ease-out delay-300 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
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
