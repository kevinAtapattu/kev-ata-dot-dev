import Card from "../ui/Card";
import Image from "next/image";

const education = [
  {
    date: "2022 - 2027",
    degree: "Bachelor of Science in Computer Science",
    institution: "Carleton University",
    logo: "/logos/carleton-logo.png"
  }
];

export default function EducationSection() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-semibold">Education</h2>
      <div className="space-y-4">
        {education.map((item) => (
          <Card key={item.institution} className="flex items-start gap-6">
            <div className="flex-shrink-0 relative h-20 w-20 rounded-lg bg-white flex items-center justify-center overflow-hidden">
              <Image
                src={item.logo}
                alt={`${item.institution} logo`}
                fill
                className="object-contain p-3"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/60 mb-1">{item.date}</p>
              <h3 className="text-xl font-semibold">{item.degree}</h3>
              <p className="text-white/70">{item.institution}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
