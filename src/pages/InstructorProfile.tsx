import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Globe2,
  MapPin,
  Play,
  Star,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { fetchInstructorBySlug, PublicInstructor } from "@/hooks/usePublicInstructors";

export default function InstructorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState<PublicInstructor | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    fetchInstructorBySlug(slug).then((res) => setInstructor(res ?? null));
  }, [slug]);

  if (instructor === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">載入中…</p>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="font-display text-2xl text-foreground">找不到這位舞蹈家</p>
        <Button onClick={() => navigate("/")}>回首頁</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Cover */}
      <section className="relative pt-20">
        <div className="relative h-[420px] md:h-[520px] overflow-hidden">
          <img
            src={instructor.cover}
            alt={`${instructor.name} cover`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Floating identity card */}
        <div className="container-wide mx-auto px-4 md:px-8 -mt-24 md:-mt-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end gap-6"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden ring-4 ring-background shadow-elevated">
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 pb-2">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> 返回
              </button>
              <h1 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-1">
                {instructor.name}
              </h1>
              <p className="text-lg font-body text-muted-foreground mb-4">
                {instructor.nameEn} · {instructor.specialty}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-soul/10 text-soul text-xs font-medium border border-soul/20">
                  <MapPin className="w-3.5 h-3.5" />
                  {instructor.region}
                </span>
                {instructor.functionTags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="section-padding pt-12 md:pt-16">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-14">
            {/* Left column */}
            <div className="space-y-14 min-w-0">
              {/* Bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-lg md:text-xl font-body leading-loose text-foreground/90">
                  {instructor.bio}
                </p>
                <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-medium text-foreground">
                      {instructor.rating}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users2 className="w-4 h-4" />
                    {instructor.students} 位學員
                  </span>
                </div>
              </motion.div>

              {/* 舞種淵源 / 文化故事 */}
              {instructor.cultureBody && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="text-xs uppercase tracking-widest text-primary font-medium">
                      舞種淵源 · Cultural Roots
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-5">
                    {instructor.cultureTitle}
                  </h2>
                  <div className="card-elevated p-7 md:p-9 border-l-4 border-primary/40">
                    <p className="text-base md:text-lg font-body leading-loose text-foreground/85">
                      {instructor.cultureBody}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 多媒體影片 */}
              {instructor.videoEmbedUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Play className="w-5 h-5 text-primary" />
                    <span className="text-xs uppercase tracking-widest text-primary font-medium">
                      舞姿展示 · Watch in Motion
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-5">
                    看見老師的呼吸
                  </h2>
                  <div className="relative rounded-2xl overflow-hidden shadow-elevated aspect-video bg-foreground/5">
                    <iframe
                      src={instructor.videoEmbedUrl}
                      title={`${instructor.name} 舞蹈展示`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </motion.div>
              )}

              {/* 經歷與獎項 */}
              {instructor.credentials.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="text-xs uppercase tracking-widest text-primary font-medium">
                      經歷與獎項 · Credentials
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-6">
                    田野與舞台的足跡
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {instructor.credentials.map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-3 p-4 rounded-xl bg-secondary/60 border border-border/50"
                      >
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span className="text-sm font-body text-foreground/85 leading-relaxed">
                          {c}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Right sticky booking */}
            <aside className="lg:block">
              <div className="lg:sticky lg:top-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="card-elevated p-6 shadow-elevated border border-border/60"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
                    課程價格起
                  </p>
                  <p className="text-3xl font-display font-semibold text-foreground mb-1">
                    {instructor.priceFrom}
                  </p>
                  <p className="text-sm text-muted-foreground mb-5 inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {instructor.nextSession}
                  </p>

                  <div className="space-y-3 mb-6">
                    {instructor.courses.map((c) => (
                      <div
                        key={c.title}
                        className="p-3 rounded-xl bg-secondary/40 border border-border/40"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-body font-medium text-foreground text-sm">
                            {c.title}
                          </p>
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-soul/10 text-soul font-medium shrink-0">
                            {c.level}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {c.schedule}
                          </span>
                          <span className="font-medium text-foreground/80">
                            {c.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="hero" size="lg" className="w-full">
                    立即預約
                  </Button>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    傳訊息給老師
                  </Button>

                  <div className="mt-5 pt-5 border-t border-border/50 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Globe2 className="w-3.5 h-3.5" />
                    支援線上 / 實體授課
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
