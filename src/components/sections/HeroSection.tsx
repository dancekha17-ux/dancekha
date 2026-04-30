import { motion } from "framer-motion";
import { Play, ArrowRight, Users, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-start overflow-hidden bg-cream">
      {/* Content — left-aligned, ~50% right whitespace */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-[260px]">
        <div className="w-full md:w-1/2 max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8"
          >
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-cream-foreground text-sm font-body tracking-wide">
              舞 蹈 啟 動 平 台
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left text-5xl md:text-6xl lg:text-7xl font-display font-semibold text-cream-foreground leading-[1.15] mb-6"
          >
            跳起來！
            <br />
            <span className="text-gradient">用舞步遇見世界</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-left text-lg md:text-xl text-cream-foreground/75 font-body max-w-xl mb-10 leading-relaxed"
          >
            線上線下隨心舞動，零基礎也能 FUN 心跳。
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
            <Button variant="outline" size="xl" className="group">
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
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-display font-semibold text-cream-foreground">
                  2000+
                </div>
                <div className="text-sm text-cream-foreground/60 font-body">
                  舞島咖學員
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-display font-semibold text-cream-foreground">
                  18+
                </div>
                <div className="text-sm text-cream-foreground/60 font-body">
                  專業師資
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-display font-semibold text-cream-foreground">
                  36
                </div>
                <div className="text-sm text-cream-foreground/60 font-body">
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
