import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Globe, Sparkles, Heart, Compass, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { RegistrationDialog } from "@/components/RegistrationDialog";
import type { EventRow } from "@/hooks/useEvents";

interface InstructorMini {
  name: string;
  slug: string | null;
  avatar_url: string | null;
  bio: string | null;
  tagline: string | null;
}

function formatDateTime(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
    time: d.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}

// Parse optional sections from description using simple markers; fall back to defaults.
function parseSections(description: string | null) {
  const text = description ?? "";
  const grab = (label: RegExp) => {
    const m = text.match(label);
    return m?.[1]?.trim() || null;
  };
  return {
    intro: grab(/【課程介紹】([\s\S]*?)(?=【|$)/) || text || null,
    culture: grab(/【文化背景】([\s\S]*?)(?=【|$)/),
    forWho: grab(/【適合誰】([\s\S]*?)(?=【|$)/),
    learn: grab(/【你會學到】([\s\S]*?)(?=【|$)/),
  };
}

function toBullets(s: string | null, fallback: string[]): string[] {
  if (!s) return fallback;
  return s
    .split(/\n|[、,]|\s*[-・•]\s*/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventRow | null>(null);
  const [instructor, setInstructor] = useState<InstructorMini | null>(null);
  const [loading, setLoading] = useState(true);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
      if (!alive) return;
      if (error || !data) {
        setLoading(false);
        return;
      }
      setEvent(data as EventRow);

      // Try fetch matching instructor by name (best-effort).
      if (data.instructor) {
        const { data: t } = await supabase
          .from("teacher_profiles")
          .select("name, slug, avatar_url, bio, tagline")
          .ilike("name", data.instructor)
          .maybeSingle();
        if (alive && t) setInstructor(t as InstructorMini);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-body">載入中…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground font-body">找不到這個活動。</p>
        <Button onClick={() => navigate("/")} variant="outline">回首頁</Button>
      </div>
    );
  }

  const dt = formatDateTime(event.starts_at);
  const sections = parseSections(event.description);
  const forWho = toBullets(sections.forWho, [
    "零基礎、想為日常找一點儀式感的你",
    "想透過身體釋放壓力的上班族",
    "對世界文化與肢體語言充滿好奇的舞蹈愛好者",
  ]);
  const learnList = toBullets(sections.learn, [
    "認識舞步背後的文化脈絡與節奏結構",
    "建立基礎身體律動與重心轉移",
    "完成一段可以帶回生活的小段組合",
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section
        className={`relative h-[55vh] min-h-[420px] w-full overflow-hidden bg-gradient-to-br ${
          event.gradient || "from-sand/40 to-coral/30"
        }`}
      >
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-sm font-body text-foreground hover:bg-background transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </Link>
        </div>

        <div className="container-wide mx-auto h-full flex flex-col justify-end relative z-10 pb-10 md:pb-14 px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-background/85 backdrop-blur-sm text-foreground">
                {event.kind === "course" ? "課程" : "活動"}
              </span>
              {event.category && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary backdrop-blur-sm">
                  {event.category}
                </span>
              )}
              {event.is_featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-foreground/85 text-primary-foreground">
                  <Sparkles className="w-3 h-3" />
                  精選推薦
                </span>
              )}
            </div>
            <h1 className="text-fluid-h1 font-display font-medium text-foreground leading-tight">
              {event.title}
            </h1>
            {event.instructor && (
              <p className="mt-3 text-fluid-lead text-muted-foreground font-body">
                與 <span className="text-foreground">{event.instructor}</span> 一起，走進這段身體的旅程。
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide mx-auto grid lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="eyebrow">About · 課程介紹</span>
              <div className="hairline mt-4 mb-6" />
              <p className="text-fluid-lead text-foreground/80 font-body leading-relaxed whitespace-pre-line">
                {sections.intro || "在溫暖的舞島，每一段律動都是一封寫給自己的信。"}
              </p>
            </motion.div>

            {/* Cultural background */}
            {sections.culture && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="card-elevated p-7 md:p-9 bg-sand/20"
              >
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Compass className="w-4 h-4" />
                  <span className="eyebrow !mt-0">Culture · 文化背景</span>
                </div>
                <p className="text-foreground/80 font-body leading-relaxed whitespace-pre-line">
                  {sections.culture}
                </p>
              </motion.div>
            )}

            {/* For who */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 text-primary mb-3">
                <Heart className="w-4 h-4" />
                <span className="eyebrow !mt-0">For You · 這堂課適合誰</span>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3 mt-4">
                {forWho.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/40 border border-border/50"
                  >
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-sm md:text-base text-foreground/85 font-body">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 text-primary mb-3">
                <Star className="w-4 h-4" />
                <span className="eyebrow !mt-0">Learn · 你會學到什麼</span>
              </div>
              <ol className="mt-4 space-y-3">
                {learnList.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-display flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-foreground/85 font-body">{item}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Instructor */}
            {(instructor || event.instructor) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="card-elevated p-7 md:p-9"
              >
                <span className="eyebrow">Leader · 引領者</span>
                <div className="hairline mt-4 mb-6" />
                <div className="flex items-start gap-5">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-sand/40 shrink-0">
                    {instructor?.avatar_url ? (
                      <img src={instructor.avatar_url} alt={instructor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-display text-primary">
                        {(instructor?.name || event.instructor || "·").slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-medium text-foreground mb-2">
                      {instructor?.name || event.instructor}
                    </h3>
                    <p className="text-sm text-foreground/75 font-body leading-relaxed">
                      {instructor?.tagline || instructor?.bio ||
                        "用身體說故事的引領者，期待在課堂上與你相遇，一起把日常變成節奏。"}
                    </p>
                    {instructor?.slug && (
                      <Link
                        to={`/instructors/${instructor.slug}`}
                        className="inline-block mt-3 text-sm text-primary hover:underline font-body"
                      >
                        查看引領者專頁 →
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - meta + CTA */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-5">
              <div className="card-elevated p-6 md:p-7 bg-background">
                <span className="eyebrow">Details · 活動資訊</span>
                <div className="hairline mt-4 mb-6" />
                <ul className="space-y-4 text-sm font-body">
                  {dt && (
                    <li className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <div>
                        <div className="text-foreground">{dt.date}</div>
                        <div className="text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          {dt.time}
                          {event.duration ? ` · ${event.duration}` : ""}
                        </div>
                      </div>
                    </li>
                  )}
                  {event.location && (
                    <li className="flex items-start gap-3">
                      {event.is_online ? (
                        <Globe className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      ) : (
                        <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      )}
                      <span className="text-foreground/85">{event.location}</span>
                    </li>
                  )}
                  {event.total_spots !== null && (
                    <li className="flex items-start gap-3">
                      <Users className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span className="text-foreground/85">
                        剩餘 {event.spots_left ?? "—"} / {event.total_spots} 名額
                      </span>
                    </li>
                  )}
                  {event.fee && (
                    <li className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span className="text-foreground/85">{event.fee}</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="card-elevated p-6 md:p-7 bg-gradient-to-br from-sand/30 to-coral/10">
                <p className="text-sm text-foreground/80 font-body mb-4">
                  看完整段介紹了嗎？準備好讓身體說話，就把這個位置留給自己吧。
                </p>
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={() => setRegisterOpen(true)}
                >
                  確認報名
                </Button>
                <p className="mt-3 text-xs text-muted-foreground font-body text-center">
                  我們會在 48 小時內以電話或訊息與你確認細節。
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom CTA band */}
      <section className="pb-20 md:pb-28">
        <div className="container-wide mx-auto px-6">
          <div className="card-elevated p-8 md:p-12 text-center bg-gradient-to-br from-secondary/60 to-sand/30">
            <span className="eyebrow">Ready? · 準備好了嗎</span>
            <h2 className="text-fluid-h2 font-display font-medium text-foreground mt-4 mb-3">
              讓這段舞蹈，從今天開始
            </h2>
            <p className="text-fluid-lead text-muted-foreground font-body max-w-xl mx-auto mb-7">
              點下按鈕，留下你的聯絡方式，我們很快與你見面。
            </p>
            <Button variant="hero" size="lg" onClick={() => setRegisterOpen(true)}>
              確認報名
            </Button>
          </div>
        </div>
      </section>

      <RegistrationDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        eventId={event.id}
        eventTitle={event.title}
      />
    </div>
  );
}
