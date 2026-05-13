export default function StoryTile() {
  return (
    <section
      id="story"
      className="tile tile--parch"
      style={{
        paddingTop: "clamp(72px, 9vw, 120px)",
        paddingBottom: "clamp(72px, 9vw, 120px)"
      }}
    >
      <div className="tile__eyebrow reveal">A note from Kevin</div>

      <h2
        className="tile__name reveal reveal--delay-1"
        style={{ maxWidth: "940px" }}
      >
        I&apos;m a CS student at Carleton, currently engineering at IBM.{" "}
        <em style={{ color: "var(--ink-muted-48)", fontStyle: "normal" }}>
          Previously ANVIL and my own media startup. Always chasing heavier
          numbers — in the gym and in the codebase.
        </em>
      </h2>

      <div className="tile__ctas reveal reveal--delay-2">
        <a href="#work" className="guillemet">
          Read my full story
        </a>
        <a
          href="/kevin_atapattu_resume.pdf"
          className="guillemet"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download resume
        </a>
      </div>
    </section>
  );
}
