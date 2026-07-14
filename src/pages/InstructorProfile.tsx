import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Globe2,
  MapPin,
  Play,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { fetchInstructorBySlug, PublicInstructor } from "@/hooks/usePublicInstructors";
import { supabase } from "@/integrations/supabase/client";

interface MomentMedia {
  id: string;
  url: string;
  caption: string;
  scale: number;
  offset_x: number;
  offset_y: number;
}

interface PublishedCourse {
  id: string;
  title: string;
  description: string | null;
  schedule: string | null;
  level: string | null;
  price: string | null;
  region: string | null;
  service_type: string | null;
  course_image_url: string | null;
  location_address: string | null;
  online_link: string | null;
  signup_url: string | null;
}

const SERVICE_LABEL: Record<string, string> = {
  in_person: "實體課程",
  pre_recorded: "線上預錄",
  event_ticket: "演出票券",
  space_rental: "空間出租",
};

export default function InstructorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState<(PublicInstructor & { isPreview?: boolean }) | null | undefined>(undefined);
  const [priceRevealed, setPriceRevealed] = useState(false);
  const [moments, setMoments] = useState<MomentMedia[]>([]);
  const [publishedCourses, setPublishedCourses] = useState<PublishedCourse[]>([]);
  const coursesRef = useRef<HTMLDivElement | null>(null);
  const courseListRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (!slug) return;
    fetchInstructorBySlug(slug).then((res) => setInstructor(res ?? null));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: tp } = await supabase
        .from("teacher_profiles")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!tp) return;
      const teacherId = (tp as any).id;
      const { data } = await (supabase as any)
        .from("instructor_media")
        .select("id,url,caption,scale,offset_x,offset_y,sort_order")
        .eq("teacher_id", teacherId)
        .eq("kind", "image")
        .order("sort_order", { ascending: true });
      setMoments((data as MomentMedia[]) ?? []);
      const { data: courseData } = await (supabase as any)
        .from("instructor_courses")
        .select("id,title,description,schedule,level,price,region,service_type,course_image_url,location_address,online_link,signup_url,sort_order")
        .eq("teacher_id", teacherId)
        .eq("status", "published")
        .order("sort_order", { ascending: true });
      setPublishedCourses((courseData as PublishedCourse[]) ?? []);

    })();
  }, [slug]);

  useEffect(() => {
    const node = coursesRef.current;
    if (!node || priceRevealed) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPriceRevealed(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [instructor, priceRevealed]);

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

      {instructor.isPreview && (
        <div className="pt-20">
          <div className="container-wide mx-auto px-4 md:px-8 mt-4">
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary font-medium text-center">
              管理員預覽模式 · 此引導者尚未公開，僅管理員與本人可見
            </div>
          </div>
        </div>
      )}



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
              <div className="flex items-center gap-3 mb-3">
                {publishedCourses.length > 0 && (
                  <button
                    onClick={() =>
                      courseListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <GraduationCap className="w-4 h-4" /> 跟著老師一起跳（{publishedCourses.length}）
                  </button>
                )}

              </div>
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
                    看見引導者的呼吸
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
                  ref={coursesRef}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="text-xs uppercase tracking-widest text-primary font-medium">
                      經歷/獎項/證照 · CREDENTIALS
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-6">
                    舞動歷程與足跡
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

              {/* 開設課程 · Courses */}
              {publishedCourses.length > 0 && (
                <motion.div
                  ref={courseListRef}
                  id="teacher-courses"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-28"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span className="text-xs uppercase tracking-widest text-primary font-medium">
                      實體課程/線上課程/營隊活動/演出票卷 · COURSES/CAMPS/EVENT
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-6">
                    一起來跳舞吧！
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {publishedCourses.map((c) => (
                      <article
                        key={c.id}
                        className="group card-elevated overflow-hidden border border-border/50 flex flex-col"
                      >
                        {c.course_image_url && (
                          <div className="aspect-[16/10] overflow-hidden bg-secondary">
                            <img
                              src={c.course_image_url}
                              alt={c.title}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex flex-col items-start gap-1.5 mb-3">
                            {c.service_type && (
                              <span className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary font-medium">
                                {SERVICE_LABEL[c.service_type] || c.service_type}
                              </span>
                            )}
                            {c.level && (
                              <span className="px-2 py-0.5 text-[10px] rounded-full bg-soul/10 text-soul font-medium">
                                {c.level}
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-lg text-foreground mb-3 leading-snug">
                            {c.title}
                          </h3>
                          {c.description && (
                            <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">
                              {c.description}
                            </p>
                          )}
                          <div className="mt-auto space-y-4 text-xs text-muted-foreground">
                            {c.schedule && (
                              <p className="inline-flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> {c.schedule}
                              </p>
                            )}
                            {(c.region || c.location_address) && (
                              <p className="inline-flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {c.region}
                                {c.region && c.location_address ? " · " : ""}
                                {c.location_address}
                              </p>
                            )}
                            {c.price && (
                              <p className="font-medium text-foreground/80">{c.price}</p>
                            )}
                          </div>
                          {c.online_link && (
                            <a
                              href={c.online_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium"
                            >
                              前往課程連結 ↗
                            </a>
                          )}
                          <a
                            href={c.signup_url && c.signup_url.trim() ? c.signup_url : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              if (!c.signup_url || !c.signup_url.trim()) e.preventDefault();
                            }}
                            className="mt-4 inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full text-sm font-medium text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all"
                            style={{
                              background:
                                "linear-gradient(135deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)",
                              cursor: c.signup_url && c.signup_url.trim() ? "pointer" : "not-allowed",
                              opacity: c.signup_url && c.signup_url.trim() ? 1 : 0.55,
                            }}
                          >
                            🎫 {c.signup_url && c.signup_url.trim() ? "我要報名" : "敬請期待"}
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>


            {/* Right sticky booking */}
            <aside className="lg:block">
              <div className="lg:sticky lg:top-28">
                {instructor.priceFrom ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="card-elevated p-6 shadow-elevated border border-border/60"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {priceRevealed ? (
                        <motion.div
                          key="revealed"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
                            課程價格起
                          </p>
                          <p className="text-3xl font-display font-semibold text-foreground mb-1">
                            {instructor.priceFrom}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3 inline-flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {instructor.nextSession}
                          </p>
                          <motion.p
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                            className="text-xs text-primary/90 font-medium mb-5 inline-flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            恭喜！您已解鎖這段文化旅程的門票。
                          </motion.p>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="hidden"
                          type="button"
                          onClick={() => setPriceRevealed(true)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full text-left p-4 mb-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition group"
                        >
                          <p className="text-xs uppercase tracking-widest text-primary/80 font-medium mb-1">
                            Experience details
                          </p>
                          <p className="font-display text-lg text-foreground group-hover:translate-x-0.5 transition-transform">
                            點擊了解體驗細節 →
                          </p>
                        </motion.button>
                      )}
                    </AnimatePresence>

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
                            <span
                              className={`font-medium text-foreground/80 transition-opacity duration-500 ${
                                priceRevealed ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              {c.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <AnimatePresence>
                      {priceRevealed && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Button variant="hero" size="lg" className="w-full">
                            加入這段舞蹈旅程
                          </Button>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            傳訊息給引導者
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-5 pt-5 border-t border-border/50 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Globe2 className="w-3.5 h-3.5" />
                      支援線上 / 實體授課
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="card-elevated p-6 shadow-elevated border border-border/60"
                  >
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                      聯絡 · Connect
                    </p>
                    <div className="space-y-2 text-sm">
                      {instructor.instagramUrl && (
                        <a href={instructor.instagramUrl} target="_blank" rel="noopener noreferrer"
                           className="block text-foreground/80 hover:text-primary truncate">
                          Instagram ↗
                        </a>
                      )}
                      {instructor.youtubeUrl && (
                        <a href={instructor.youtubeUrl} target="_blank" rel="noopener noreferrer"
                           className="block text-foreground/80 hover:text-primary truncate">
                          YouTube ↗
                        </a>
                      )}
                      {instructor.websiteUrl && (
                        <a href={instructor.websiteUrl} target="_blank" rel="noopener noreferrer"
                           className="block text-foreground/80 hover:text-primary truncate">
                          個人網站 ↗
                        </a>
                      )}
                      {!instructor.instagramUrl && !instructor.youtubeUrl && !instructor.websiteUrl && (
                        <p className="text-muted-foreground">引導者尚未提供聯絡方式</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {moments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-4 card-elevated p-5 border border-border/60"
                  >
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                      精彩瞬間／教室環境 · Moments
                    </p>
                    <div className="grid grid-cols-2 gap-[5px] rounded-lg overflow-hidden border border-border/60 bg-secondary/40">
                      {moments.slice(0, 4).map((m) => (
                        <figure
                          key={m.id}
                          className="relative aspect-square overflow-hidden bg-secondary/60 group"
                        >
                          <img
                            src={m.url}
                            alt={m.caption || "舞蹈故事與畫面"}
                            loading="lazy"
                            decoding="async"
                            sizes="(max-width: 768px) 50vw, 400px"
                            className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:brightness-105"
                          />
                        </figure>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> 返回上一頁
                  </button>
                </div>


              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
