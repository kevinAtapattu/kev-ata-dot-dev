const skillGroups = [
  {
    heading: "Languages",
    items: ["TypeScript", "Python", "Ruby", "Java", "SQL", "Go"]
  },
  {
    heading: "Frameworks",
    items: ["Next.js", "React", "Rails", "Node.js", "Tailwind"]
  },
  {
    heading: "Platforms",
    items: ["AWS", "Docker", "Jenkins", "MySQL", "PostgreSQL"]
  },
  {
    heading: "Practices",
    items: ["Agile / Scrum", "CI/CD", "PyTest", "Code review", "Pair programming"]
  }
];

export default function SkillsTile() {
  return (
    <section id="skills" className="skills">
      <div className="skills__inner">
        <div className="skills__head reveal">
          <div className="tile__eyebrow" style={{ opacity: 0.65 }}>
            The toolbox
          </div>
          <h2>
            Built with the right tools.
            <br />
            Optimized for the right outcomes.
          </h2>
        </div>

        <div className="skills__grid">
          {skillGroups.map((group, i) => (
            <div key={group.heading} className={`skills__col reveal reveal--delay-${i + 1}`}>
              <h3>{group.heading}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
