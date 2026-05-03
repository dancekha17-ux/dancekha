import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Globe2, Heart, Users } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "不完美也沒關係",
    description:
      "我們相信每一個不完美的舞步，都是通往完美的旅程。在這裡，你可以放心地跌倒、再站起來。",
  },
  {
    icon: Globe2,
    title: "跳進全世界",
    description:
      "連結全球舞蹈脈絡，從中國舞到芭蕾、從拉丁到當代，多國舞風隨你探索。",
  },
  {
    icon: Heart,
    title: "暖流社群",
    description:
      "在這個島上，每個人都是彼此的暖流。透過舞蹈交流，建立深厚的友誼連結。",
  },
  {
    icon: Users,
    title: "全齡共舞",
    description:
      "不分年齡、不分體態，只要你有一顆想跳舞的心，這裡就是你的舞台。",
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
          <p className="text-fluid-lead text-muted-foreground font-body">
            舞島咖是一個溫暖的舞蹈生態系。我們串起世界的舞蹈藝術家與愛舞者，
            創造一個讓每個人都能自在起舞、用身體與世界對話的空間。
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
