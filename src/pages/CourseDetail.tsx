import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Globe2,
  MapPin,
  Play,
  Users2,
  UserCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCourseById } from "@/data/courses";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = id ? getCourseById(id) : undefined;

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="font-display text-2xl text-foreground">找不到這堂課程</p>
        <Button onClick={() => navigate("/")}>回首頁</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Cover hero */}
      <section className="relative pt-20">
        <div className="relative h-[360px] md:h-[480px] overflow-hidden">
          <img
            src={course.cover}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
        </div>

        <div className="container-wide mx-auto px-4 md:px-8 -mt-32 md:-mt-40 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回課程列表
            </button>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-soul/10 text-soul text-xs font-medium border border-soul/20">
                <MapPin className="w-3.5 h-3.5" />
                {course.region}
              </span>
              {course.functionTags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                >
                  {t}
                </span>
              ))}
              {course.isOnline && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 text-foreground text-xs font-medium">
                  <Play className="w-3.5 h-3.5" /> 線上課程
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-2 max-w-3xl">
              {course.title}
            </h1>
            {course.titleEn && (
              <p className="text-lg font-body text-muted-foreground">
                {course.titleEn}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="section-padding pt-12 md:pt-16">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-14">
            {/* Left column */}
            <div className="space-y-14 min-w-0">
              {/* Intro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-lg md:text-xl font-body leading-loose text-foreground/90">
                  {course.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users2 className="w-4 h-4" />
                    {course.students} 人已報名
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    {course.level}
                  </span>
                </div>
              </motion.div>

              {/* Video placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Play className="w-5 h-5 text-primary" />
                  <span className="text-xs uppercase tracking-widest text-primary font-medium">
                    課程預覽 · Class Preview
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-5">
                  看見課堂的樣子
                </h2>
                <div className="relative rounded-2xl overflow-hidden shadow-elevated aspect-video bg-foreground/5">
                  <iframe
                    src={course.videoEmbedUrl}
                    title={`${course.title} 課程預覽`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </motion.div>

              {/* 文化小百科 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-xs uppercase tracking-widest text-primary font-medium">
                    文化小百科 · Culture Note
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-5">
                  {course.cultureTitle}
                </h2>
                <div className="card-elevated p-7 md:p-9 border-l-4 border-primary/40">
                  <p className="text-base md:text-lg font-body leading-loose text-foreground/85">
                    {course.cultureBody}
                  </p>
                </div>
              </motion.div>

              {/* 師資介紹 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <UserCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-xs uppercase tracking-widest text-primary font-medium">
                    師資介紹 · Your Instructor
                  </span>
                </div>
                <div className="card-elevated p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-soul/20 flex items-center justify-center shrink-0">
                    <UserCircle2 className="w-12 h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-semibold text-foreground mb-1">
                      {course.instructor}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {course.region} · {course.functionTags.join(" / ")}
                    </p>
                    {course.instructorSlug ? (
                      <Link to={`/instructors/${course.instructorSlug}`}>
                        <Button variant="outline" size="sm">
                          查看老師完整資料 →
                        </Button>
                      </Link>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        客座講師
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right sticky booking */}
            <aside>
              <div className="lg:sticky lg:top-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="card-elevated p-6 shadow-elevated border border-border/60"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
                    課程價格
                  </p>
                  <p className="text-3xl font-display font-semibold text-foreground mb-1">
                    {course.price}
                  </p>
                  <p className="text-sm text-muted-foreground mb-5 inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    每堂 {course.duration}
                  </p>

                  <div className="space-y-2 mb-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2 inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> 開課時段
                    </p>
                    {course.schedule.map((s) => (
                      <div
                        key={s}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/40 text-sm"
                      >
                        <span className="font-body text-foreground/85">{s}</span>
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-soul/10 text-soul font-medium">
                          {course.level}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button variant="hero" size="lg" className="w-full">
                    立即預約
                  </Button>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    加入願望清單
                  </Button>

                  <div className="mt-5 pt-5 border-t border-border/50 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Globe2 className="w-3.5 h-3.5" />
                    {course.isOnline ? "支援線上 / 實體授課" : "實體現場授課"}
                  </div>
                </motion.div>

                <Link
                  to="/styles"
                  className="block mt-4 text-center text-sm text-primary hover:underline"
                >
                  探索更多世界舞種 →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
