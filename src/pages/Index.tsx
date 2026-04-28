import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { InstructorsSection } from "@/components/sections/InstructorsSection";
import { WorldFolkSection } from "@/components/sections/WorldFolkSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { EventsSection } from "@/components/sections/EventsSection";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <CoursesSection />
        <InstructorsSection />
        <WorldFolkSection />
        <CommunitySection />
        <EventsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
