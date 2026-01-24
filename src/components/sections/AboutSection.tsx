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
      "連結全球舞蹈脈絡，從街舞到芭蕾、從拉丁到當代，多國舞風隨你探索。",
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
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-body text-sm tracking-widest uppercase mb-4">
            關於舞島咖
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-6">
            這座島，為<span className="text-gradient">舞動的靈魂</span>而生
          </h2>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            舞島咖是一個溫暖的舞蹈生態系，我們串起舞蹈藝術家與愛舞者，
            創造一個讓每個人都能自在起舞的空間。在這裡，舞蹈不只是技巧，
            更是連結、是療癒、是發現自己的旅程。
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
              className="group card-elevated p-8 hover:shadow-elevated transition-all duration-500"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-body leading-relaxed">
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
