import GravityNav from "../components/gravity/GravityNav";
import LoadRail from "../components/gravity/LoadRail";
import GravityHero from "../components/gravity/GravityHero";
import Manifesto from "../components/gravity/Manifesto";
import WorkStack from "../components/gravity/WorkStack";
import ProjectsSection from "../components/gravity/ProjectsSection";
import GravitySection from "../components/gravity/GravitySection";
import ContactSection from "../components/gravity/ContactSection";
import { getFeaturedProjects } from "../lib/services/projects";

export default async function HomePage() {
  const projects = await getFeaturedProjects();

  return (
    <main className="g-root">
      <GravityNav />
      <LoadRail />

      <GravityHero />
      <Manifesto />
      <WorkStack />
      <ProjectsSection projects={projects} />
      <GravitySection />
      <ContactSection />
    </main>
  );
}
