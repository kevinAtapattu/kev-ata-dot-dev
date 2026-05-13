import Image from "next/image";

type Tone = "dark" | "dark-2" | "dark-3" | "parch" | "white" | "black";

type ExperienceTileProps = {
  id: string;
  tone: Tone;
  eyebrow: string;
  roleText: string;
  roleEm: string;
  tagline: string;
  period: string;
  logo: string;
  logoBg?: string;
  logoScale?: number;
  bullets: React.ReactNode[];
};

const toneClass: Record<Tone, string> = {
  dark:    "tile--dark",
  "dark-2":"tile--dark-2",
  "dark-3":"tile--dark-3",
  parch:   "tile--parch",
  white:   "tile--white",
  black:   "tile--black"
};

export default function ExperienceTile({
  id,
  tone,
  eyebrow,
  roleText,
  roleEm,
  tagline,
  period,
  logo,
  logoBg,
  logoScale = 70,
  bullets
}: ExperienceTileProps) {
  const logoSize = `${logoScale}%`;
  return (
    <section id={id} className={`tile ${toneClass[tone]} exp`}>
      <div className="exp__inner">
        <div className="tile__eyebrow reveal">{eyebrow}</div>

        <h2 className="exp__role reveal reveal--delay-1">
          {roleText} <em>{roleEm}</em>
        </h2>

        {tagline && (
          <p className="tile__sub reveal reveal--delay-2">{tagline}</p>
        )}

        <p className="exp__period reveal reveal--delay-2">{period}</p>

        <div
          className="exp__logo reveal reveal--delay-3"
          style={logoBg ? { background: logoBg } : undefined}
        >
          <Image
            src={logo}
            alt=""
            width={154}
            height={154}
            className="object-contain"
            style={{ width: logoSize, height: logoSize }}
          />
        </div>

        <ul className="exp__bullets reveal reveal--delay-4">
          {bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
