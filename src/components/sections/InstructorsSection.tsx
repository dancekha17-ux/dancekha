import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, Youtube, X } from "lucide-react";
import { usePublicInstructors } from "@/hooks/usePublicInstructors";
import { MAP_REGIONS } from "@/components/world-map/WorldMap";

export function InstructorsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { items: allInstructors } = usePublicInstructors();
  const location = useLocation();
  const regionParam = new URLSearchParams(location.search).get("region");
  const activeRegion = useMemo(
    () => MAP_REGIONS.find((r) => r.queryParam === regionParam) ?? null,
    [regionParam],
  );

  // Only show real, published guides from the database (demo/static data hidden pre-launch)
  const publishedInstructors = useMemo(
    () => allInstructors.filter((i) => i.source === "db"),
    [allInstructors],
  );

  const instructors = useMemo(() => {
    if (!activeRegion) return publishedInstructors;
    const kw = activeRegion.keywords.map((k) => k.toLowerCase());
    const matches = publishedInstructors.filter((i) => {
      const hay = [
        i.region,
        i.specialty,
        i.name,
        i.nameEn,
        ...(i.functionTags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return kw.some((k) => hay.includes(k));
    });
    return matches.length > 0 ? matches : publishedInstructors;
  }, [publishedInstructors, activeRegion]);

  return (
    <section
      id="instructors"
      className="section-padding bg-secondary/30"
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
          <span className="eyebrow">Instructors · 創生軸心</span>
          <div className="hairline mt-6 mb-8" />
          <h2 className="text-fluid-h1 font-display font-medium text-foreground mb-6">
            用生命跳舞的<span className="text-accent-italic">文化引導者</span>
          </h2>
          <p className="text-fluid-lead text-muted-foreground font-body">
            每一位引導者，都帶著獨特的舞蹈故事與文化視野。
            在這裡分享專業、連結學員，也讓更多人看見舞蹈的多元可能。
          </p>
          {activeRegion && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF5EC] border border-[#E8DCC4] text-sm font-body text-[#9C5A2E]">
              <span>正在篩選：{activeRegion.country} · {activeRegion.dance}</span>
              <Link
                to="/#instructors"
                aria-label="清除篩選"
                className="ml-1 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Recruiting state — shown until real guides are published */}
        {instructors.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-center px-8 py-12 md:py-14 rounded-3xl bg-background border border-border shadow-soft"
          >
            <h3 className="text-fluid-h3 font-display font-medium text-foreground mb-4">
              首批引導者招募中
            </h3>
            <p className="text-muted-foreground font-body leading-relaxed mb-8">
              如果您也相信舞蹈能連結文化、世代與世界，歡迎進駐舞島咖，
              建立專屬品牌頁面，與我們共築多元舞蹈聚落。
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              了解引導者計畫
              <span>→</span>
            </Link>
          </motion.div>
        )}

        {/* Instructors Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 * (index + 1) }}
              className="group"
            >
              <Link
                to={`/instructors/${instructor.slug}`}
                className="block card-elevated overflow-hidden hover:shadow-elevated transition-all duration-500"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground">
                      <Instagram className="w-4 h-4" />
                    </span>
                    <span className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground">
                      <Youtube className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-display font-semibold text-primary-foreground">
                      {instructor.name}
                    </h3>
                    <p className="text-sm text-primary-foreground/70 font-body">
                      {instructor.nameEn}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {instructor.specialty}
                    </span>
                    <span className="inline-block px-3 py-1 bg-soul/10 text-soul text-xs font-medium rounded-full">
                      {instructor.region}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed line-clamp-2">
                    {instructor.tagline || instructor.bio}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 rounded-2xl bg-[#FBF1EA] border border-[#E8DCC4]">
            <p className="text-sm md:text-base font-body text-[#6B4A2E] leading-relaxed">
              Join Us ·讓世界看見你的文化舞步，也啟發更多學員舞動人生！
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              成為舞島咖引導者
              <span className="transition-transform group-hover:translate-x-1">➔</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
