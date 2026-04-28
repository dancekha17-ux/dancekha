import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe2, MapPin, Search, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { danceRegions } from "@/data/danceStyles";

export default function GlobalStyles() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredRegions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return danceRegions
      .filter((r) => !activeRegion || r.id === activeRegion)
      .map((r) => ({
        ...r,
        styles: r.styles.filter(
          (s) =>
            !q ||
            s.name.toLowerCase().includes(q) ||
            s.nameEn.toLowerCase().includes(q),
        ),
      }))
      .filter((r) => r.styles.length > 0);
  }, [activeRegion, query]);

  const scrollToRegion = (id: string) => {
    setActiveRegion(null);
    setTimeout(() => {
      document
        .getElementById(`region-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero with map */}
      <section className="pt-32 pb-12 md:pb-16 px-4 md:px-8">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <span className="inline-flex items-center gap-2 text-primary font-body text-sm tracking-widest uppercase mb-4">
              <Globe2 className="w-4 h-4" />
              Global Styles · 全球舞種探索
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-semibold text-foreground mb-6">
              用一張地圖,<span className="text-gradient">舞遍世界</span>
            </h1>
            <p className="text-lg text-muted-foreground font-body leading-relaxed">
              從亞洲的寺廟祭儀,到大洋洲的火光夜舞,再到巴爾幹的不對稱節拍——
              點擊地圖上的任一座島嶼,讓舞步帶你出發。
            </p>
          </motion.div>

          {/* Minimal world map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card-elevated p-4 md:p-8 mb-10"
          >
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-auto"
              role="img"
              aria-label="World map of dance regions"
            >
              {/* Subtle background continents (very simplified blobs) */}
              <g fill="hsl(var(--muted))" opacity="0.55">
                {/* Americas */}
                <path d="M150,140 q30,-40 70,-30 q40,10 50,60 q20,80 -20,140 q-30,40 -40,90 q-10,40 -50,40 q-50,0 -60,-60 q-10,-80 20,-160 q15,-50 30,-80z" />
                {/* Europe + Africa */}
                <path d="M470,120 q40,-20 90,0 q40,15 60,60 q15,40 -10,80 q-10,30 0,60 q15,60 -20,110 q-30,40 -80,30 q-50,-10 -60,-70 q-10,-60 0,-130 q5,-80 20,-140z" />
                {/* Asia */}
                <path d="M640,110 q60,-30 140,-10 q90,20 130,90 q30,60 -10,120 q-30,50 -90,60 q-90,15 -160,-20 q-60,-30 -70,-100 q-10,-90 60,-140z" />
                {/* Oceania */}
                <path d="M810,330 q40,-15 80,5 q35,20 25,55 q-10,30 -50,40 q-60,15 -80,-20 q-15,-40 25,-80z" />
              </g>

              {/* Connecting curves between region pins (flow lines) */}
              <g
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                strokeDasharray="3 5"
                opacity="0.35"
              >
                {danceRegions.slice(0, -1).map((r, i) => {
                  const next = danceRegions[i + 1];
                  const mx = (r.mapPos.x + next.mapPos.x) / 2;
                  const my = Math.min(r.mapPos.y, next.mapPos.y) - 40;
                  return (
                    <path
                      key={r.id}
                      d={`M${r.mapPos.x},${r.mapPos.y} Q${mx},${my} ${next.mapPos.x},${next.mapPos.y}`}
                    />
                  );
                })}
              </g>

              {/* Region pins */}
              {danceRegions.map((r) => {
                const active = activeRegion === r.id;
                return (
                  <g
                    key={r.id}
                    onClick={() => scrollToRegion(r.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={r.mapPos.x}
                      cy={r.mapPos.y}
                      r={active ? 18 : 14}
                      fill="hsl(var(--primary))"
                      opacity="0.18"
                      className="transition-all"
                    >
                      <animate
                        attributeName="r"
                        values={`${active ? 18 : 14};${active ? 26 : 22};${active ? 18 : 14}`}
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx={r.mapPos.x}
                      cy={r.mapPos.y}
                      r="6"
                      fill="hsl(var(--primary))"
                    />
                    <text
                      x={r.mapPos.x}
                      y={r.mapPos.y - 16}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="500"
                      fill="hsl(var(--foreground))"
                      className="font-body select-none"
                    >
                      {r.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* Search + Region quick filter */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋舞種、國家或關鍵字…"
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body text-foreground"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveRegion(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !activeRegion
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                全部地域
              </button>
              {danceRegions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setActiveRegion(r.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeRegion === r.id
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Region groups */}
      <section className="px-4 md:px-8 pb-24">
        <div className="container-wide mx-auto space-y-20">
          {filteredRegions.length === 0 && (
            <p className="text-center text-muted-foreground py-20">
              找不到符合「{query}」的舞種,試試其他關鍵字。
            </p>
          )}

          {filteredRegions.map((region, regionIndex) => (
            <motion.div
              key={region.id}
              id={`region-${region.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-28"
            >
              <div className="flex items-end justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-border/60">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-medium mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {region.labelEn}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-3">
                    {region.label}
                  </h2>
                  <p className="text-muted-foreground font-body max-w-2xl leading-relaxed">
                    {region.description}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {region.styles.length} 種舞風
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {region.styles.map((style, idx) => (
                  <motion.div
                    key={style.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                  >
                    <Link
                      to={`/courses?style=${style.id}`}
                      className="group block card-elevated p-6 h-full hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl" aria-hidden>
                          {style.flag}
                        </span>
                        {style.technicalTag && (
                          <span
                            className="px-2 py-1 rounded-full bg-soul/10 text-soul text-[10px] font-medium border border-soul/30"
                            title="進階技術屬性"
                          >
                            ⏱ {style.technicalTag}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {style.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-body mb-3">
                        {style.nameEn}
                      </p>
                      <p className="text-sm text-foreground/80 font-body leading-relaxed mb-4">
                        {style.blurb}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {style.functionTags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                        <Sparkles className="w-3.5 h-3.5" />
                        查看相關課程 →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
