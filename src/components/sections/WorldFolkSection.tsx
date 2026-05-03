import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { BookOpen, Globe2, Music, Sparkles, Users2 } from "lucide-react";

/**
 * 世界民俗舞蹈專區
 * 對應規格：
 * - 地域/文化維度：東歐與中歐、巴爾幹與南歐、中東與地中海
 * - 標籤關聯邏輯（前端示意）：
 *   - 以色列舞蹈 → 社交與聚會、祭典與傳承
 *   - 佛朗明哥 / 烏克蘭 / 俄羅斯 → 表演與藝術
 *   - 保加利亞 / 匈牙利 → 隱藏技術屬性「複雜節拍 (Complex Meters)」
 * - 文化小百科：每個舞種附起源故事
 */

type FunctionTag = "社交與聚會" | "祭典與傳承" | "表演與藝術";

interface FolkDance {
  id: string;
  name: string;
  nameEn: string;
  region: "eastern-europe" | "balkans" | "mideast";
  regionLabel: string;
  flag: string;
  functionTags: FunctionTag[];
  technicalTag?: string; // 隱藏技術屬性，例如「複雜節拍」
  origin: string; // 文化小百科
  gradient: string;
}

const dances: FolkDance[] = [
  {
    id: "ukrainian",
    name: "烏克蘭舞蹈",
    nameEn: "Ukrainian",
    region: "eastern-europe",
    regionLabel: "東歐與中歐",
    flag: "🇺🇦",
    functionTags: ["表演與藝術"],
    origin:
      "源自第聶伯河流域農耕生活，男子的高躍與旋轉象徵草原戰士精神，女子的繞圈步伐則描繪豐收與祝福。",
    gradient: "from-primary/20 to-soul/10",
  },
  {
    id: "russian",
    name: "俄羅斯舞蹈",
    nameEn: "Russian",
    region: "eastern-europe",
    regionLabel: "東歐與中歐",
    flag: "🇷🇺",
    functionTags: ["表演與藝術"],
    origin:
      "從村莊節慶到帝俄宮廷，Khorovod 圓圈舞與蹲跳 Prisyadka 構成俄羅斯民間舞的雙重靈魂。",
    gradient: "from-soul/20 to-accent/10",
  },
  {
    id: "hungarian",
    name: "匈牙利舞蹈",
    nameEn: "Hungarian",
    region: "eastern-europe",
    regionLabel: "東歐與中歐",
    flag: "🇭🇺",
    functionTags: ["祭典與傳承"],
    technicalTag: "複雜節拍 (Complex Meters)",
    origin:
      "Csárdás 從慢板 Lassú 進入急速 Friss，馬扎爾人以靴跟敲擊節奏，回應潘諾尼亞平原的廣袤。",
    gradient: "from-accent/20 to-primary/10",
  },
  {
    id: "bulgarian",
    name: "保加利亞舞蹈",
    nameEn: "Bulgarian",
    region: "balkans",
    regionLabel: "巴爾幹與南歐",
    flag: "🇧🇬",
    functionTags: ["祭典與傳承", "社交與聚會"],
    technicalTag: "複雜節拍 (Complex Meters)",
    origin:
      "Horo 圓圈舞以 7/8、9/8、11/8 等不對稱節拍著稱，村民手牽手環繞，把整個社群編進一條會呼吸的鏈。",
    gradient: "from-success/20 to-primary/10",
  },
  {
    id: "flamenco",
    name: "西班牙佛朗明哥",
    nameEn: "Flamenco",
    region: "balkans",
    regionLabel: "巴爾幹與南歐",
    flag: "🇪🇸",
    functionTags: ["表演與藝術"],
    origin:
      "誕生於安達魯西亞的吉普賽社群，融合摩爾、猶太與羅姆文化。Cante、Toque、Baile 三位一體，是身體裡的火焰。",
    gradient: "from-soul/20 to-accent/10",
  },
  {
    id: "israeli",
    name: "以色列舞蹈",
    nameEn: "Israeli",
    region: "mideast",
    regionLabel: "中東與地中海",
    flag: "🇮🇱",
    functionTags: ["社交與聚會", "祭典與傳承"],
    origin:
      "20 世紀初由屯墾社區發展出的集體圈舞 Rikudei Am，融合東歐、葉門與阿拉伯元素，至今仍是社區聚會的核心儀式。",
    gradient: "from-accent/20 to-soul/10",
  },
];

const hotTags = [
  { label: "#巴爾幹風情", region: "balkans" as const },
  { label: "#以色列社交舞", region: "mideast" as const },
  { label: "#佛朗明哥藝術", region: "balkans" as const },
];

const regions = [
  { id: "all" as const, label: "全部地域", icon: Globe2 },
  { id: "eastern-europe" as const, label: "東歐與中歐", icon: Music },
  { id: "balkans" as const, label: "巴爾幹與南歐", icon: Sparkles },
  { id: "mideast" as const, label: "中東與地中海", icon: Users2 },
];

export function WorldFolkSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeRegion, setActiveRegion] = useState<
    "all" | "eastern-europe" | "balkans" | "mideast"
  >("all");
  const [openOrigin, setOpenOrigin] = useState<string | null>(null);

  const filtered =
    activeRegion === "all"
      ? dances
      : dances.filter((d) => d.region === activeRegion);

  return (
    <section
      id="world-folk"
      className="section-padding bg-gradient-to-b from-background via-secondary/20 to-background"
      ref={ref}
    >
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center max-w-2xl mx-auto section-header"
        >
          <span className="eyebrow">World Folk · 世界民俗</span>
          <div className="hairline mt-6 mb-8" />
          <h2 className="text-fluid-h1 font-display font-medium text-foreground mb-6">
            用舞步走遍<span className="text-accent-italic">大地的記憶</span>
          </h2>
          <p className="text-fluid-lead text-muted-foreground font-body">
            從烏克蘭草原到安達魯西亞夜晚，從巴爾幹的不對稱節拍到地中海岸邊的圓圈——
            我們收藏每個民族用身體寫下的歷史。
          </p>
        </motion.div>

        {/* 熱門民俗探索 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <p className="text-xs font-body uppercase tracking-widest text-muted-foreground text-center mb-3">
            熱門民俗探索
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {hotTags.map((tag) => (
              <button
                key={tag.label}
                onClick={() => setActiveRegion(tag.region)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent-foreground border border-accent/30 hover:bg-accent/20 hover:border-accent transition-all"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Region tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {regions.map((r) => {
            const Icon = r.icon;
            const active = activeRegion === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRegion(r.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {r.label}
              </button>
            );
          })}
        </motion.div>

        {/* Dances Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((dance, index) => {
            const isOpen = openOrigin === dance.id;
            return (
              <motion.div
                key={dance.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.08 * (index + 1) }}
                className="group"
              >
                <div className="card-elevated overflow-hidden hover:shadow-elevated transition-all duration-500 h-full flex flex-col">
                  {/* Header gradient */}
                  <div
                    className={`relative h-36 bg-gradient-to-br ${dance.gradient} p-6 flex flex-col justify-between`}
                  >
                    <span className="inline-flex items-center gap-1 self-start px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
                      {dance.regionLabel}
                    </span>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-3xl mb-1" aria-hidden>
                          {dance.flag}
                        </div>
                        <h3 className="text-xl font-display font-semibold text-foreground">
                          {dance.name}
                        </h3>
                        <p className="text-xs font-body text-muted-foreground">
                          {dance.nameEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* 功能標籤 */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {dance.functionTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {dance.technicalTag && (
                        <span
                          className="px-2.5 py-1 bg-soul/10 text-soul text-xs font-medium rounded-full border border-soul/30"
                          title="進階學員專屬技術屬性"
                        >
                          ⏱ {dance.technicalTag}
                        </span>
                      )}
                    </div>

                    {/* 文化小百科 toggle */}
                    <button
                      onClick={() => setOpenOrigin(isOpen ? null : dance.id)}
                      className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all self-start"
                    >
                      <BookOpen className="w-4 h-4" />
                      文化小百科
                      <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
                    </button>

                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                        marginTop: isOpen ? 12 : 0,
                      }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-muted-foreground font-body leading-relaxed pl-6 border-l-2 border-primary/30">
                        {dance.origin}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
