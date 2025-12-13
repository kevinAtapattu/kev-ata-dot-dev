import HeroSection from "../components/sections/HeroSection";
import ExperienceTimeline from "../components/sections/ExperienceTimeline";
import EducationSection from "../components/sections/EducationSection";
import ProjectGrid from "../components/sections/ProjectGrid";
import ContactForm from "../components/sections/ContactForm";
import SocialDock from "../components/sections/SocialDock";

export default function HomePage() {
  return (
    <main className="container mx-auto flex flex-col gap-20 px-4 py-16 max-w-5xl">
      <HeroSection />
      <ExperienceTimeline />
      <EducationSection />
      <ProjectGrid />
      <ContactForm />
      <SocialDock />
    </main>
  );
}
