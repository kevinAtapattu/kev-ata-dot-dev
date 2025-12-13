"use client";

import { useState } from "react";
import Card from "../ui/Card";
import Image from "next/image";

const timeline = [
  {
    date: "September 2025 - Current",
    role: "Software Engineer Intern",
    company: "IBM",
    logo: "/logos/ibm-logo-black-transparent.jpg",
    description: [
      "Contributed to the Skills Network team as a full-stack developer in an Agile Scrum environment.",
      "Engineered multi-tenant content management system using MySQL views and JSON storage, enabling 50+ clients to customize learning content independently without affecting global enrollment data",
      "Developed a learning-content type for learners using Rails and TypeScript, improving UX for 10M+ users.",
      "Utilized Jenkins for CI/CD pipelines and performed logger testing to ensure deployment reliability.",
      "Refactored front-end templates by migrating code from Liquid to ERB, simplifying maintainability of codebase."
    ]
  },
  {
    date: "January 2025 - April 2025",
    role: "Software Engineer Intern",
    company: "ANVIL",
    logo: "/logos/anvil_ai_logo.jpeg",
    description: [
      "Implemented a dedicated API validation class that rejects unauthorized extra fields, enhancing data integrity.",
      "Developed a data import script in Python reducing load times by 97.5%, accelerating UI testing and iteration.",
      "Utilized Python Debugger and Docker logs to debug API endpoints to ensure reliable backend performance.",
      "Wrote unit tests with PyTest to validate API functionality, prevent regressions, and achieved 80% code coverage."
    ]
  },
  {
    date: "March 2020 - June 2022",
    role: "Web Developer & Founder",
    company: "Okami Productions",
    logo: "/logos/okami-logo.png",
    description: [
      "Developed a dynamic portfolio website using React, JavaScript, HTML, and CSS to display video projects.",
      "Built interactive UI elements, improving client engagement and generating $40k+ in revenue."
    ]
  }
];

function ExperienceCard({ item }: { item: typeof timeline[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Card className="flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:border-white/20">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 relative h-20 w-20 rounded-lg bg-white flex items-center justify-center overflow-hidden">
            <Image
              src={item.logo}
              alt={`${item.company} logo`}
              fill
              className="object-contain p-3"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white/60 mb-1">{item.date}</p>
            <h3 className="text-xl font-semibold">{item.role}</h3>
            <p className="text-white/70">{item.company}</p>
          </div>
          <div
            className={`flex-shrink-0 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg
              className={`w-6 h-6 text-white/60 transition-transform duration-300 ease-in-out ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
          } overflow-hidden`}
        >
          <div className="pt-4 border-t border-white/10">
            <ul className="space-y-2 text-white/70">
              {item.description.map((point, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-white/40 flex-shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ExperienceTimeline() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-semibold">Experience</h2>
      <div className="space-y-4">
        {timeline.map((item) => (
          <ExperienceCard key={item.company} item={item} />
        ))}
      </div>
    </section>
  );
}
