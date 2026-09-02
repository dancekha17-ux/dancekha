import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Compass, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import balkanCircle from "@/assets/world-dance/balkan-circle.jpg";
import flamenco from "@/assets/world-dance/flamenco.jpg";
import israeliCircle from "@/assets/world-dance/israeli-circle.jpg";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { WorldMap } from "@/components/world-map/WorldMap";

const featuredDances = [
  {
    id: "balkans",
    eyebrow: "BALKANS · 巴爾幹",
    name: "保加利亞 Horo 圓圈舞",
    tags: ["不對稱節拍", "聚落共舞"],
    description:
      "手牽手踏進 7/8 與 11/16 的複合節奏，讓整個村落在同一條呼吸裡前進。",
    image: balkanCircle,
    alt: "身穿傳統服飾的舞者在戶外牽手跳保加利亞圓圈舞",
    to: "/?region=Bulgaria#instructors",
  },
  {
    id: "flamenco",
    eyebrow: "ANDALUSIA · 安達魯西亞",
    name: "佛朗明哥 Flamenco",
    tags: ["情感敘事", "節奏藝術"],
    description:
      "裙襬、掌聲與足音交織成 Duende；每一次轉身，都是身體對生命最直接的告白。",
    image: flamenco,
    alt: "佛朗明哥舞者在安達魯西亞庭院旋轉紅色裙襬",
    to: "/?region=Spain#instructors",
  },
  {
    id: "israeli",
    eyebrow: "MEDITERRANEAN · 地中海",
    name: "以色列社交圓圈舞",
    tags: ["社群連結", "節慶傳承"],
    description:
      "在海風與歌聲裡牽起彼此，把不同世代的故事，跳成一個沒有終點的圓。",
    image: israeliCircle,
    alt: "人們在地中海岸邊牽手跳以色列社交圓圈舞",
    to: "/?region=Israel#instructors",
  },
];

export default function WorldDance() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="overflow-hidden px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
          <div className="container-wide mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mx-auto mb-10 max-w-3xl text-center md:mb-14"
            >
              <span className="eyebrow inline-flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-primary" />
                World Dance Atlas · 舞遍世界
              </span>
              <div className="hairline mb-8 mt-6" />
              <h1 className="text-fluid-hero mb-6 font-display font-medium text-foreground">
                循著舞步，讀懂
                <span className="text-accent-italic">世界的身體語言</span>
              </h1>
              <p className="text-fluid-lead mx-auto max-w-2xl text-muted-foreground">
                點亮地圖上的島嶼，從節拍、祭典與日常相遇一種文化，也找到願意帶你走進其中的引導者。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-lg border border-border/70 bg-card p-2 shadow-elevated md:p-5">
                <WorldMap />
              </div>
              <a
                href="#popular-folk"
                aria-label="前往熱門民俗探索"
                className="mx-auto mt-8 flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                探索本期精選
                <ArrowDown className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </section>

        <section id="popular-folk" className="scroll-mt-24 bg-secondary/45 px-5 py-16 md:px-8 md:py-24">
          <div className="container-wide mx-auto">
            <div className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span className="eyebrow inline-flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  Featured Folk Stories
                </span>
                <h2 className="text-fluid-h1 mt-4 font-display font-medium text-foreground">
                  熱門民俗探索
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-right">
                從裙襬飛揚的瞬間，走進一方土地的記憶；每張卡片都是一段文化與課程的入口。
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {featuredDances.map((dance, index) => (
                <motion.article
                  key={dance.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="group overflow-hidden rounded-lg border border-border/70 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={dance.image}
                      alt={dance.alt}
                      loading="lazy"
                      width={1280}
                      height={960}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <p className="mb-2 text-[11px] font-medium uppercase text-primary-foreground/75">
                        {dance.eyebrow}
                      </p>
                      <h3 className="mb-3 text-2xl font-display font-semibold text-primary-foreground">
                        {dance.name}
                      </h3>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {dance.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-primary-foreground/25 bg-background/15 px-2.5 py-1 text-xs text-primary-foreground backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="mb-5 text-sm leading-relaxed text-primary-foreground/85">
                        {dance.description}
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="w-full opacity-100 transition-all duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
                      >
                        <Link to={dance.to}>
                          👉 探索文化與課程
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
