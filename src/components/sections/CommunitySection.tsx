import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function CommunitySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="community"
      className="section-padding bg-foreground text-primary-foreground"
      ref={ref}
    >
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="eyebrow text-primary-foreground/70">Community · 暖流社群</span>
          <div className="mx-auto h-px w-12 bg-primary-foreground/30 mt-6 mb-8" />
          <h2 className="text-fluid-h1 font-display font-medium mb-6">
            舞出<span className="italic font-normal text-primary">友誼的節奏</span>
          </h2>
          <p className="text-fluid-lead text-primary-foreground/70 font-body">
            舞島咖不只是一個學習舞蹈的平台，更是一座彼此陪伴的文化聚落。
            因舞相遇、因分享成長，讓每一次交流都成為支持彼此前行的力量。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
