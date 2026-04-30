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
    <section className="relative overflow-hidden bg-foreground">
      {/* ============================================================
          DESKTOP (≥1024px): Side-by-side — text left 45%, image right
          MOBILE/TABLET (<1024px): Vertical stack — text on top, image below
          No absolute overlap of text and faces.
         ============================================================ */}
      <div className="flex flex-col lg:flex-row lg:min-h-screen">
        {/* TEXT COLUMN */}
        <div
          className="relative w-full lg:w-[45%] flex items-center bg-foreground"
          style={{
            paddingTop: "clamp(5rem, 10vw, 8rem)",
            paddingBottom: "clamp(3rem, 6vw, 5rem)",
            paddingLeft: "clamp(1.25rem, 10vw, 8rem)",
            paddingRight: "clamp(1.25rem, 4vw, 3rem)",
          }}
        >
          <div className="w-full max-w-xl text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-8"
            >
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-primary-foreground text-sm font-body">
                啟 動 你 的 舞 蹈 冒 險
              </span>
            </motion.div>

            {/* Headline — rem-based, mobile 2.2rem auto-scaling up */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-body font-bold text-primary-foreground mb-6"
              style={{
                fontSize: "clamp(2.2rem, 4vw + 0.5rem, 4.25rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              跳起來!
              <br />
              <span className="text-gradient">用舞步遇見世界</span>
            </motion.h1>

            {/* Subheadline — rem-based, mobile 1.1rem */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-primary-foreground/85 font-body mb-10"
              style={{
                fontSize: "clamp(1.1rem, 0.6vw + 1rem, 1.25rem)",
                lineHeight: 1.7,
                letterSpacing: "0.015em",
              }}
            >
              DanceKha 舞島咖 — 線上線下隨心舞動，零基礎也能 FUN 心跳。
              在這裡不只是學舞，還能透過社群互動舞出友誼的節奏。
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-12"
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
              className="flex flex-wrap gap-6 md:gap-8"
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

          {/* Subtle gradient mask at the bottom of text column on desktop, blending into image */}
          <div className="hidden lg:block absolute top-0 right-0 h-full w-24 bg-gradient-to-r from-foreground to-transparent pointer-events-none" />
        </div>

        {/* IMAGE COLUMN — standard flow, no overlap with text */}
        <div className="relative w-full lg:w-[55%] h-[50vh] sm:h-[60vh] lg:h-auto lg:min-h-screen">
          <picture>
            <source type="image/webp" srcSet={webpSrcSet} sizes="(min-width: 1024px) 55vw, 100vw" />
            <source type="image/jpeg" srcSet={jpgSrcSet} sizes="(min-width: 1024px) 55vw, 100vw" />
            <img
              src={heroJpg1600}
              alt="一群身穿傳統服飾的舞者在地中海風景中手牽手歡舞"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </picture>
          {/* Soft left-edge gradient on desktop only — keeps faces clear, blends with text column */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-foreground/60 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Decorative wave — preserved */}
      <div className="relative left-0 right-0 -mt-px">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
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
