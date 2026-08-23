import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Globe2, Heart, Users } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "不完美也沒關係",
    description:
      "每一次跨步都值得被珍惜，跟著老師專業的帶領輕鬆解鎖、感受自在舞動，也遇見更美好的自己。",
  },
  {
    icon: Globe2,
    title: "跳進全世界",
    description:
      "從夏威夷 Hula 呼拉舞、保加利亞 Horo 鏈狀舞、印度 Odissi 奧迪西舞，到世界各地的舞蹈，舞步帶領我們跨越國界！",
  },
  {
    icon: Heart,
    title: "暖流社群",
    description:
      "因舞相遇、因分享而成長，讓每一次交流與鼓勵，都化為支持彼此前行的溫暖力量。",
  },
  {
    icon: Users,
    title: "全齡共融",
    description:
      "從親子共舞、青少年探索，到成人學習與樂齡律動，讓舞蹈陪伴每一段人生，也讓不同世代因舞而相聚。",
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

        {/* Magazine grid — 2x2 */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
                className="rounded-2xl border border-neutral-100 bg-card/30 p-8 transition-all duration-300 hover:border-primary/30 hover:bg-card/50"
              >
                <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center shrink-0 mb-5 transition-colors hover:border-primary/50">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 font-body leading-[1.7] text-[15px]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
