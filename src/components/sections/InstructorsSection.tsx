import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, Youtube, Star, X } from "lucide-react";
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

  const instructors = useMemo(() => {
    if (!activeRegion) return allInstructors;
    const kw = activeRegion.keywords.map((k) => k.toLowerCase());
    const matches = allInstructors.filter((i) => {
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
    return matches.length > 0 ? matches : allInstructors;
  }, [allInstructors, activeRegion]);

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
            用生命跳舞的<span className="text-accent-italic">舞蹈家們</span>
          </h2>
          <p className="text-fluid-lead text-muted-foreground font-body">
            每一位老師都是文化傳遞者，
            帶著獨特的故事與節奏，等待與你相遇。
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
                  <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
                    {instructor.bio}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{instructor.rating}</span>
                    </div>
                    <span className="text-muted-foreground font-body">
                      {instructor.students} 位學員
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/styles"
            className="inline-flex items-center gap-2 text-primary font-medium flow-line hover:gap-3 transition-all"
          >
            探索全球舞種總覽
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
