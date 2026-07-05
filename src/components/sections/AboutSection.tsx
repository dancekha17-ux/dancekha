import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Globe2, Heart, Users } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "不完美也沒關係",
    description:
      "每一次嘗試，都是一次成長；每一個舞步，都值得被珍惜。在舞島咖，我們相信，真正重要的不是完美，而是持續熱愛、勇敢起舞的初心。",
  },
  {
    icon: Globe2,
    title: "跳進全世界",
    description:
      "從夏威夷 Hula 呼拉舞、保加利亞 Horo 鏈狀舞、印度 Odissi 奧迪西舞，到世界各地的舞蹈文化，讓舞步帶領我們跨越國界，探索世界，也走進不同民族的生命風景。",
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
      "舞蹈沒有年齡限制，每個人生階段，都能找到屬於自己的舞步。從親子共舞、青少年探索，到成人學習與樂齡律動，讓舞蹈陪伴每一段人生，也讓不同世代因舞而相聚。",
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

        {/* Features Grid — quieter editorial layout */}
        <div className="grid md:grid-cols-2 gap-x-10 md:gap-x-12 gap-y-10 md:gap-y-14 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
              className="group"
            >
              <div className="flex items-start gap-5">
                <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-display font-medium text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-body leading-relaxed text-[15px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
