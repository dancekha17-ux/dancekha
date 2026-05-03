import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroJpg640 from "@/assets/hero/hero-dance-640.jpg";
import heroJpg1024 from "@/assets/hero/hero-dance-1024.jpg";
import heroJpg1600 from "@/assets/hero/hero-dance-1600.jpg";
import heroJpg1920 from "@/assets/hero/hero-dance-1920.jpg";
import heroWebp640 from "@/assets/hero/hero-dance-640.webp";
import heroWebp1024 from "@/assets/hero/hero-dance-1024.webp";
import heroWebp1600 from "@/assets/hero/hero-dance-1600.webp";
import heroWebp1920 from "@/assets/hero/hero-dance-1920.webp";

export function HeroSection() {
  const webpSrcSet = `${heroWebp640} 640w, ${heroWebp1024} 1024w, ${heroWebp1600} 1600w, ${heroWebp1920} 1920w`;
  const jpgSrcSet = `${heroJpg640} 640w, ${heroJpg1024} 1024w, ${heroJpg1600} 1600w, ${heroJpg1920} 1920w`;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background — focal point shifted right to keep dancers visible */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source type="image/webp" srcSet={webpSrcSet} sizes="100vw" />
          <source type="image/jpeg" srcSet={jpgSrcSet} sizes="100vw" />
          <img
            src={heroJpg1600}
            alt="一群身穿傳統服飾的舞者在地中海風景中手牽手歡舞"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-[68%_center] md:object-[72%_center]"
          />
        </picture>
        {/* Cinematic gradient — stronger on mobile (vertical) for legibility, soft horizontal on desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/85 via-foreground/55 to-foreground/30 md:bg-gradient-to-r md:from-foreground/85 md:via-foreground/45 md:via-35% md:to-transparent" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 w-full"
        style={{
          paddingLeft: "clamp(1.25rem, 7vw, 6rem)",
          paddingRight: "clamp(1.25rem, 4vw, 2rem)",
          paddingTop: "clamp(6rem, 12vh, 9rem)",
          paddingBottom: "clamp(4rem, 10vh, 8rem)",
        }}
      >
        <div className="max-w-[540px] text-left">
          {/* Eyebrow — quiet, refined */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[10px] sm:text-xs uppercase font-body text-primary-foreground/70 mb-6 sm:mb-8"
            style={{ letterSpacing: "0.28em" }}
          >
            DanceKha · 舞蹈探索平台
          </motion.p>

          {/* Headline — italic accent instead of orange gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="text-fluid-hero font-display font-medium text-primary-foreground"
          >
            用舞步,
            <br />
            <span className="italic font-normal text-primary-foreground/95">
              遇見世界。
            </span>
          </motion.h1>

          {/* Hairline divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="origin-left h-px w-16 bg-primary-foreground/40 my-8"
          />

          {/* Subheadline — quieter, single sentence */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-base md:text-lg text-primary-foreground/80 font-body leading-relaxed mb-10 max-w-md"
          >
            連結世界舞蹈、人與旅程的文化平台。<br className="hidden sm:block" />
            從零基礎到深度文化探索,讓身體成為你的語言。
          </motion.p>

          {/* Single primary CTA — premium restraint */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex items-center gap-6"
          >
            <Button variant="hero" size="lg" className="group">
              開始探索
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <a
              href="#about"
              className="text-sm font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              了解品牌故事
            </a>
          </motion.div>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <span
          className="text-[10px] uppercase font-body text-primary-foreground/60"
          style={{ letterSpacing: "0.32em" }}
        >
          Scroll
        </span>
        <div className="w-px h-10 bg-primary-foreground/40" />
      </motion.div>
    </section>
  );
}
