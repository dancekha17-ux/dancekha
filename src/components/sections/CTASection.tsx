import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button variant="hero" size="lg" className="group">
              免費開始
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <a
              href="#about"
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              預約一場參觀
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
