import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DanceDnaQuiz } from "@/components/quiz/DanceDnaQuiz";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <section className="section-padding bg-background relative overflow-hidden" ref={ref}>
      {/* Soft warm glow */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-wide mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="eyebrow">Begin · 啟程</span>
          <div className="hairline mt-6 mb-10" />

          <h2 className="text-fluid-hero font-display font-medium text-foreground mb-8">
            讓身體
            <br />
            <span className="italic font-normal text-primary">成為你的語言。</span>
          </h2>

          <p className="text-fluid-lead text-muted-foreground font-body max-w-xl mx-auto mb-12">
             無論你是初次起舞，還是想走得更遠，  
            舞島咖陪你走進世界、走進自己。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            {/* Primary CTA — pulsing orange, opens DNA quiz */}
            <motion.div
              animate={{ scale: [1, 1.025, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full sm:w-auto rounded-md"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 blur-md opacity-70 animate-pulse"
              />
              <Button
                variant="hero"
                size="lg"
                className="group relative w-full sm:w-auto shadow-lg"
                onClick={() => setQuizOpen(true)}
              >
                🧬 解鎖你的舞蹈 DNA ➔
              </Button>
            </motion.div>

            {/* Secondary CTA — ghost button to world dance culture page */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm bg-transparent transition-all duration-300"
            >
              <Link to="/world-dance">🌍 探索世界舞蹈</Link>
            </Button>
          </div>

        </motion.div>
      </div>

      <DanceDnaQuiz open={quizOpen} onOpenChange={setQuizOpen} />
    </section>
  );
}
