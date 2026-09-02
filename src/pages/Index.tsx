import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dna = searchParams.get("dna");
  useEffect(() => {
    if (!dna) return;
    const map: Record<string, string> = {
      ritual: "balkans",
      ocean: "beginner",
      stage: "latin",
      flow: "contemporary",
    };
    const category = map[dna];
    if (!category) return;
    const t = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("danceka:filter-category", { detail: category }));
      document.getElementById("courses")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => clearTimeout(t);
  }, [dna]);
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    // Wait for sections to mount
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => clearTimeout(t);
  }, [location.hash]);
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
