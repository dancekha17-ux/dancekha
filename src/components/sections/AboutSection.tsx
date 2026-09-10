import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Globe2, Heart, Users } from "lucide-react";
import imperfectDanceImage from "@/assets/about/about-imperfect-dance.png.asset.json";
import worldMapImage from "@/assets/about/about-world-map.png.asset.json";
import communityImage from "@/assets/about/about-community.png.asset.json";
import allAgesImage from "@/assets/about/about-all-ages.png.asset.json";

const features = [
  {
    icon: Sparkles,
    image: imperfectDanceImage.url,
    imageAlt: "多人一起自在學舞",
    title: "不完美也沒關係",
    description:
      "每一次的嘗試，都是成長；每跨出的一步，都值得被珍惜。跟著老師專業的帶領輕鬆解鎖舞步，也遇見更美好的自己。",
  },
  {
    icon: Globe2,
    image: worldMapImage.url,
    imageAlt: "世界地圖與旅行軌跡",
    title: "跳進全世界",
    description:
      "從夏威夷呼拉舞、保加利亞鏈狀舞、印度奧迪西舞，到世界各地的舞蹈，舞步帶領我們走進不同民族的生命風景！",
  },
  {
    icon: Heart,
    image: communityImage.url,
    imageAlt: "舞者們圍坐交流談笑",
    title: "暖流社群",
    description:
      "不只是學習舞蹈的平台，更是一個彼此陪伴的文化聚落。因舞相遇、因分享而成長，每一次的舞動都是溫暖的力量。",
  },
  {
    icon: Users,
    image: allAgesImage.url,
    imageAlt: "不同世代手牽手共舞",
    title: "全齡樂舞",
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
                className="overflow-hidden rounded-2xl border border-border/50 bg-card/30 transition-colors duration-300 hover:border-primary/25 hover:bg-card/50"
              >
                <div className="aspect-[3/2] w-full overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-7">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </span>
                    <h3 className="text-lg md:text-xl font-display font-semibold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-neutral-600 font-body leading-[1.7] text-[15px]">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
