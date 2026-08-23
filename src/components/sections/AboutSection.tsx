import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Sparkles, Globe2, Heart, Users } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "不完美也沒關係",
    description:
      "每一次的嘗試，都是成長；每跨出的ㄧ步，都值得被珍惜。跟著老師專業的帶領輕鬆解鎖，感受自在舞動，也在歡笑與交流中，遇見更美好的自己。",
  },
  {
    icon: Globe2,
    title: "跳進全世界",
    description:
      "從夏威夷 Hula 呼拉舞、保加利亞 Horo 鏈狀舞、印度 Odissi 奧迪西舞，到世界各地的舞蹈文化，舞步帶領我們跨越國界，探索世界，也走進不同民族的生命風景。",
  },
  {
    icon: Heart,
    title: "暖流社群",
    description:
      "舞島咖不只是學習舞蹈的平台，更是一個彼此陪伴的文化聚落。因舞相遇、因分享而成長，讓每一次交流與鼓勵，都化為支持彼此前行的溫暖力量。",
  },
  {
    icon: Users,
    title: "全齡共舞",
    description:
      "每個人生階段，都能找到屬於自己的舞步。從親子共舞、青少年探索，到成人學習與樂齡律動，讓舞蹈陪伴每一段人生，也讓不同世代因舞而相聚。",
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section id="about" className="section-padding bg-background" ref={ref}>
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center max-w-2xl mx-auto section-header"
        >
          <span className="eyebrow">About · 關於舞島咖</span>
          <div className="hairline mt-6 mb-8" />
          <h2 className="text-fluid-h1 font-display font-medium text-foreground mb-8">
            這座島，為<span className="text-accent-italic">舞動的靈魂</span>而生
          </h2>
          <p className="text-fluid-lead text-muted-foreground font-body whitespace-pre-line">
            我們將串起世界各地的舞蹈大師與喜愛舞動的你，{"\n"}
            {"\u00a0"}創造一個讓每個人都能自在起舞、用身體與世界對話的平台。
          </p>
        </motion.div>

        {/* Accordion Grid — single open at a time */}
        <div className="grid md:grid-cols-2 gap-x-8 md:gap-x-10 gap-y-5 md:gap-y-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const isOpen = openIndex === index;
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`about-panel-${index}`}
                  className={`w-full text-left rounded-2xl border border-border/70 bg-card/30 px-5 md:px-6 py-4 md:py-5 transition-all duration-300 hover:border-primary/40 hover:bg-card/50 ${
                    isOpen ? "border-primary/40 bg-card/50" : ""
                  }`}
                >
                  {/* Header row: icon + title + toggle */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center shrink-0 transition-colors group-hover:border-primary/50">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="flex-1 text-lg md:text-xl font-display font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <span
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center shrink-0 text-muted-foreground transition-colors"
                      aria-hidden
                    >
                      <motion.span
                        key={isOpen ? "minus" : "plus"}
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-base leading-none"
                      >
                        {isOpen ? "−" : "+"}
                      </motion.span>
                    </span>
                  </div>

                  {/* Expandable body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="panel"
                        id={`about-panel-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-muted-foreground font-body leading-relaxed text-[15px] pt-5 mt-2 border-t border-border/40">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
