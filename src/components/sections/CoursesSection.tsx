import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";

const categories = [
  { id: "all", label: "全部課程" },
  { id: "beginner", label: "零基礎入門" },
  { id: "contemporary", label: "現代舞" },
  { id: "street", label: "中國舞" },
  { id: "latin", label: "拉丁舞" },
  { id: "senior", label: "樂齡律動" },
  { id: "eastern-europe", label: "東歐與中歐" },
  { id: "balkans", label: "巴爾幹與南歐" },
  { id: "mideast", label: "中東與地中海" },
];

export function CoursesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCourses = courses.filter(
    (c) => activeCategory === "all" || c.category === activeCategory,
  );

  return (
    <section id="courses" className="section-padding bg-background" ref={ref}>
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center max-w-2xl mx-auto section-header"
        >
          <span className="eyebrow">Community · 社群日常</span>
          <div className="hairline mt-6 mb-8" />
          <h2 className="text-fluid-h1 font-display font-medium text-foreground mb-6">
            找到屬於你的<span className="text-accent-italic">舞動節奏</span>
          </h2>
          <p className="text-fluid-lead text-muted-foreground font-body">
            從零基礎到深度文化探索，線上線下隨心切換。
            每一堂課，都是一次與世界相遇的旅程。
          </p>
        </motion.div>

        {/* Single, refined filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible justify-start md:justify-center gap-x-5 md:gap-x-6 gap-y-3 mb-12 md:mb-16 pb-4 md:pb-6 border-b border-border scrollbar-none"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 whitespace-nowrap text-sm font-body transition-colors duration-300 pb-1 border-b ${
                activeCategory === cat.id
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Courses Grid — quieter editorial cards */}
        {filteredCourses.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            目前沒有符合篩選條件的課程，試試其他組合。
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.05 * (index + 1) }}
                className="group"
              >
                <Link
                  to={`/course-detail/${course.id}`}
                  className="block h-full"
                >
                  <div className="h-full flex flex-col">
                    {/* Image plate — taller, cinematic ratio */}
                    <div
                      className={`relative aspect-[4/5] overflow-hidden rounded-sm bg-gradient-to-br ${course.gradient} mb-5`}
                    >
                      <div className="absolute inset-0 p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          {course.isOnline && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-background/85 backdrop-blur-sm rounded-full text-[11px] font-body text-foreground">
                              <Play className="w-2.5 h-2.5" />
                              線上
                            </span>
                          )}
                          {course.isFeatured && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-foreground/85 text-primary-foreground rounded-full text-[11px] font-body ml-auto">
                              <Sparkles className="w-2.5 h-2.5" />
                              精選
                            </span>
                          )}
                        </div>
                        <div className="text-xl font-display font-medium text-foreground/90">
                          {course.price}
                        </div>
                      </div>
                    </div>

                    {/* Text — editorial, quiet */}
                    <div className="flex-1 flex flex-col">
                      <p className="text-[11px] uppercase font-body text-muted-foreground mb-2" style={{ letterSpacing: "0.18em" }}>
                        {course.instructor}
                      </p>
                      <h3 className="text-lg md:text-xl font-display font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-body mt-auto">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {course.students}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA — single quiet link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-14 md:mt-20"
        >
          <Button variant="outline" size="lg">
            瀏覽所有課程
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
