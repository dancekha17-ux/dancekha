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
  const [activeFunction, setActiveFunction] = useState<string | null>(null);

  const filteredCourses = courses.filter((c) => {
    const byCategory = activeCategory === "all" || c.category === activeCategory;
    const byFunction =
      !activeFunction || c.functionTags.includes(activeFunction);
    return byCategory && byFunction;
  });

  return (
    <section id="courses" className="section-padding bg-background" ref={ref}>
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block text-primary font-body text-sm tracking-widest uppercase mb-4">
            課程專區
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-6">
            找到屬於你的<span className="text-gradient">舞動節奏</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            從零基礎到專業進階，從傳統到舞台，超過 100+ 堂課程等你探索。
            線上線下混合學習，隨時隨地開啟你的舞蹈旅程。
          </p>
        </motion.div>

        {/* Region / Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <p className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
            <MapPin className="w-3.5 h-3.5" /> 依地域 / 類型
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Function Tag Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <p className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
            <Tag className="w-3.5 h-3.5" /> 依功能標籤
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveFunction(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                !activeFunction
                  ? "bg-soul text-soul-foreground shadow-glow"
                  : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
              }`}
            >
              全部功能
            </button>
            {FUNCTION_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setActiveFunction(activeFunction === tag ? null : tag)
                }
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeFunction === tag
                    ? "bg-soul text-soul-foreground shadow-glow"
                    : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            目前沒有符合篩選條件的課程，試試其他組合。
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.05 * (index + 1) }}
                className="group"
              >
                <Link
                  to={`/course-detail/${course.id}`}
                  className="block h-full"
                >
                  <div className="card-elevated overflow-hidden hover:shadow-elevated transition-all duration-500 h-full flex flex-col group-hover:-translate-y-1">
                    {/* Header with gradient */}
                    <div
                      className={`relative h-40 bg-gradient-to-br ${course.gradient} p-6 flex flex-col justify-between`}
                    >
                      <div className="flex justify-between items-start">
                        {course.isOnline && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
                            <Play className="w-3 h-3" />
                            線上課程
                          </span>
                        )}
                        {course.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium ml-auto">
                            <Sparkles className="w-3 h-3" />
                            推薦
                          </span>
                        )}
                      </div>

                      <div className="text-2xl font-display font-semibold text-foreground">
                        {course.price}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-body mb-3">
                        講師：{course.instructor}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {course.functionTags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.students}
                        </span>
                      </div>

                      <Button variant="outline" className="w-full">
                        查看課程
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button variant="hero" size="lg">
            瀏覽所有課程
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
