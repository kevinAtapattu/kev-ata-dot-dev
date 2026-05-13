import RevealWrapper from "../components/RevealWrapper";
import GlobalNav from "../components/sections/GlobalNav";
import HeroSection from "../components/sections/HeroSection";
import StoryTile from "../components/sections/StoryTile";
import ExperienceTile from "../components/sections/ExperienceTile";
import PursuitsTile from "../components/sections/PursuitsTile";
import ProjectGrid from "../components/sections/ProjectGrid";
import SkillsTile from "../components/sections/SkillsTile";
import Footer from "../components/sections/Footer";
import StickyBar from "../components/sections/StickyBar";

export default function HomePage() {
  return (
    <RevealWrapper>
      <GlobalNav />

      <HeroSection />

      <StoryTile />

      <div id="work">
        <ExperienceTile
          id="ibm"
          tone="dark"
          eyebrow="Currently · September 2025 →"
          roleText="Engineering at IBM."
          roleEm="For 10M+ learners."
          tagline="Pro. Beyond."
          period="Software Engineer Intern · Ruby on Rails · Docker · Kubernetes · PostgreSQL · TypeScript"
          logo="/logos/ibm-logo-black-transparent.jpg"
          logoBg="#fff"
          bullets={[
            <>Designed a two-phase monitoring automation in the portal-deploy pipeline, bulk-registering <strong>100+ portals</strong> via the <strong>Instana API</strong> and adding a deploy hook to auto-register future portals, <strong>cutting monitoring costs by 100%</strong>.</>,
            <>Implemented the learner-facing Activities layer in <strong>Ruby/ERB</strong>, integrating with Curator&apos;s content catalog to deliver content across IBM&apos;s multi-tenant portal platform, <strong>serving 10M+ global learners</strong>.</>,
            <>Delivered technical LMS platform <strong>demos to global clients</strong>, securing <strong>stakeholder buy-in</strong> and feature adoption.</>,
            <>Reviewed <strong>AI features</strong> and core platform PRs, enforcing Rails conventions (<strong>fat models, skinny controllers</strong>) and mentoring interns to eliminate controller bloat and redundant abstractions.</>,
            <>Ensured deployment stability via <strong>GitHub Actions</strong> and <strong>RSpec</strong> suites, preventing production regressions.</>
          ]}
        />

        <ExperienceTile
          id="anvil"
          tone="parch"
          eyebrow="January 2025 — May 2025"
          roleText="API discipline."
          roleEm="At ANVIL."
          tagline="Strict. Validated."
          period="Software Engineer Intern · Python · Django · DRF · PostgreSQL · Elasticsearch"
          logo="/logos/anvil_ai_logo.jpeg"
          logoBg="#fff"
          bullets={[
            <>Implemented a dedicated <strong>API validation class</strong> that rejects unauthorized extra fields, enhancing data integrity.</>,
            <>Developed a <strong>data import script</strong> in Python reducing load times by <strong>97.5%</strong>, accelerating UI testing and iteration.</>,
            <>Utilized <strong>Python Debugger</strong> and <strong>Docker logs</strong> to debug API endpoints to ensure reliable backend performance.</>,
            <>Wrote unit tests with <strong>PyTest</strong> to validate API functionality, prevent regressions, and achieved <strong>80%</strong> code coverage.</>
          ]}
        />

        <ExperienceTile
          id="okami"
          tone="dark-2"
          eyebrow="March 2020 — June 2022"
          roleText="Founder mode."
          roleEm="At 16."
          tagline="Built. Shipped. Sold."
          period="Frontend Developer & Founder · Okami Productions"
          logo="/logos/okami-logo.png"
          logoBg="#000"
          logoScale={98}
          bullets={[
            <>Developed a dynamic portfolio website using <strong>React</strong>, <strong>JavaScript</strong>, <strong>HTML</strong>, and <strong>CSS</strong> to display video projects.</>,
            <>Built interactive <strong>UI elements</strong>, improving client engagement and <strong>generating $40k+ in revenue</strong>.</>
          ]}
        />
      </div>

      <PursuitsTile />

      <ProjectGrid />

      <SkillsTile />

      <ExperienceTile
        id="carleton"
        tone="dark-3"
        eyebrow="2022 — 2027"
        roleText="Studying CS."
        roleEm="At Carleton University."
        tagline="Foundation. Forward."
        period="Bachelor of Science · Computer Science"
        logo="/logos/carleton-logo.png"
        logoBg="#fff"
        bullets={[
          "Carleton University Bachelor of Science in Computer Science.",
          "Focused on systems, software design, and applied algorithms.",
          "President of Ravens Powerlifting in parallel.",
          "On track for 2027 graduation while interning full-stack at IBM."
        ]}
      />

      <Footer />

      <StickyBar />
    </RevealWrapper>
  );
}
