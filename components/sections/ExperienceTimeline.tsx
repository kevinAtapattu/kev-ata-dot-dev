import Card from "../ui/Card";
import Image from "next/image";

const timeline = [
  {
    date: "September 2025 - Current",
    role: "Software Engineer Intern",
    company: "IBM",
    logo: "/logos/ibm-logo-black-transparent.jpg"
  },
  {
    date: "January 2025 - April 2025",
    role: "Software Engineer Intern",
    company: "ANVIL",
    logo: "/logos/anvil_ai_logo.jpeg"
  },
  {
    date: "March 2020 - June 2022",
    role: "Web Developer & Founder",
    company: "Okami Production",
    logo: "/logos/okami-logo.png"
  }
];

export default function ExperienceTimeline() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-semibold">Experience</h2>
      <div className="space-y-4">
        {timeline.map((item) => (
          <Card key={item.company} className="flex items-start gap-6">
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
          </Card>
        ))}
      </div>
    </section>
  );
}
