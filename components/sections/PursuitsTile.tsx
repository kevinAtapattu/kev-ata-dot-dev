export default function PursuitsTile() {
  return (
    <section id="pursuits" className="tile tile--black pursuit">
      <div
        className="tile__eyebrow reveal"
        style={{ color: "var(--action-blue-on-dark)", opacity: 1 }}
      >
        Outside the codebase
      </div>

      <h2
        className="exp__role reveal reveal--delay-1"
        style={{ maxWidth: "980px" }}
      >
        Adventure awaits.{" "}
        <em style={{ opacity: 0.46, fontStyle: "normal" }}>
          At 1,245 lb total.
        </em>
      </h2>

      <p className="tile__sub reveal reveal--delay-2" style={{ maxWidth: "720px" }}>
        CANPL competitive powerlifter. President of Ravens Powerlifting.
      </p>

      <p
        className="reveal reveal--delay-2"
        style={{
          fontSize: 18,
          lineHeight: 1.5,
          opacity: 0.7,
          marginTop: 18,
          maxWidth: 640,
          letterSpacing: "-0.2px"
        }}
      >
        Same discipline I bring to the codebase, three plates at a time.
        Chasing heavier numbers and cleaner reps — both at the office and under
        the bar.
      </p>

      <div className="pursuit__stat-row reveal reveal--delay-3">
        <div className="pursuit__stat">
          <div className="pursuit__stat-value">
            445<sup>lb</sup>
          </div>
          <div className="pursuit__stat-label">Squat — best comp lift</div>
        </div>
        <div className="pursuit__stat">
          <div className="pursuit__stat-value">
            300<sup>lb</sup>
          </div>
          <div className="pursuit__stat-label">Bench — best comp lift</div>
        </div>
        <div className="pursuit__stat">
          <div className="pursuit__stat-value">
            500<sup>lb</sup>
          </div>
          <div className="pursuit__stat-label">Deadlift — best comp lift</div>
        </div>
      </div>
    </section>
  );
}
