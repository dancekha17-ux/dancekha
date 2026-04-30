import { motion } from "framer-motion";
import { Play, ArrowRight, Users, Star, Heart } from "lucide-react";
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
    <section className="relative min-h-screen flex items-start overflow-hidden">
      {/* Background — dancers' faces sit in the lower-middle area, so we anchor text to the TOP safe zone */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source type="image/webp" srcSet={webpSrcSet} sizes="100vw" />
          <source type="image/jpeg" srcSet={jpgSrcSet} sizes="100vw" />
          <img
            src={heroJpg1600}
            alt="一群身穿傳統服飾的舞者在地中海風景中手牽手歡舞"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 70%" }}
          />
        </picture>
        {/* Top-weighted overlay to keep dancer faces clear (lower portion) and ensure text legibility in the upper safe zone */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/85 via-foreground/45 to-transparent" />
      </div>

      {/* Content — center-aligned for optimal readability */}
      <div
        className="relative z-10 w-full pt-16 md:pt-20 pb-[260px]"
        style={{ paddingLeft: "clamp(1.25rem, 4vw, 2rem)", paddingRight: "clamp(1.25rem, 4vw, 2rem)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-8 text-left"
          >
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-primary-foreground text-sm font-body">
              啟動你的舞蹈冒險
            </span>
          </motion.div>

          {/* Headline — fluid typography prevents awkward line breaks */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-fluid-hero font-display font-semibold text-primary-foreground mb-6 text-left"
          >
            跳起來!
            <br />
            <span className="text-gradient">用舞步遇見世界</span>
          </motion.h1>

          {/* Subheadline — fluid lead with mobile-optimized line-height */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-fluid-lead text-primary-foreground/85 font-body max-w-2xl mx-auto mb-10 text-left"
          >
            線上線下隨心舞動，零基礎也能 FUN 心跳。
            <br className="hidden md:block" />
            在這裡不只是學舞，還能透過社群互動舞出友誼的節奏。
          </motion.p>

        </div>
      </div>

      {/* Bottom-centered CTA + Stats */}
      <div className="absolute bottom-24 left-0 right-0 z-10 px-4 md:px-8">
        <div className="container-wide mx-auto flex flex-col items-center gap-10">
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button variant="hero" size="xl" className="group">
              開始探索
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="xl" className="group">
              <Play className="w-5 h-5" />
              觀看介紹
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-display font-semibold text-primary-foreground">
                  2000+
                </div>
                <div className="text-sm text-primary-foreground/60 font-body">
                  舞島咖學員
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-display font-semibold text-primary-foreground">
                  18+
                </div>
                <div className="text-sm text-primary-foreground/60 font-body">
                  專業師資
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-display font-semibold text-primary-foreground">
                  36
                </div>
                <div className="text-sm text-primary-foreground/60 font-body">
                  舞蹈風格
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>


      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L48 110C96 100 192 80 288 75C384 70 480 80 576 85C672 90 768 90 864 85C960 80 1056 70 1152 70C1248 70 1344 80 1392 85L1440 90V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
