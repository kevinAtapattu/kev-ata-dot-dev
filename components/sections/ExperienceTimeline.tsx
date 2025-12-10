import Card from "../ui/Card";

const timeline = [
  { year: "2024", role: "Senior Frontend Engineer", company: "Freelance", summary: "Delivering cinematic user journeys for SaaS teams." },
  { year: "2022", role: "Lead UI Engineer", company: "Flow Labs", summary: "Launched a motion-heavy analytics suite." }
];

export default function ExperienceTimeline() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-semibold">Experience</h2>
      <div className="space-y-4">
        {timeline.map((item) => (
          <Card key={item.year} className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-white/60">{item.year}</p>
              <h3 className="text-xl font-semibold">{item.role}</h3>
              <p className="text-white/70">{item.company}</p>
            </div>
            <p className="text-sm text-white/60 max-w-sm">{item.summary}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
