import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Globe2,
  Compass,
  Bookmark,
  ChevronRight,
  Eye,
  PenLine,
  BookOpen,
  Users,
  TrendingUp,
  Calendar,
  MessageCircle,
  Repeat,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Role = "student" | "master";

export default function Dashboard() {
  const [params, setParams] = useSearchParams();
  const initial = (params.get("role") as Role) || "student";
  const [role, setRole] = useState<Role>(initial);

  useEffect(() => {
    const r = (params.get("role") as Role) || "student";
    setRole(r);
  }, [params]);

  const toggleRole = () => {
    const next: Role = role === "student" ? "master" : "student";
    setRole(next);
    setParams({ role: next }, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hidden role-switcher (preview only) */}
      <button
        onClick={toggleRole}
        aria-label="Switch dashboard role"
        title={`切換至 ${role === "student" ? "Master" : "Student"} 視角`}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/90 text-background text-xs shadow-elevated hover:bg-foreground transition opacity-30 hover:opacity-100"
      >
        <Repeat className="w-3.5 h-3.5" />
        {role === "student" ? "Student" : "Master"}
      </button>

      <main className="pt-24 md:pt-28 pb-16">
        {role === "student" ? <StudentDashboard /> : <MasterDashboard />}
      </main>

      <Footer />
    </div>
  );
}

/* ---------------- Student Dashboard ---------------- */

function StudentDashboard() {
  const dnaTraits = [
    { label: "節奏感", value: 82 },
    { label: "即興力", value: 64 },
    { label: "文化共鳴", value: 91 },
  ];

  const exploration = [
    { region: "拉丁美洲", progress: 70, styles: "Salsa · Bachata" },
    { region: "西非", progress: 35, styles: "Afrobeat · Sabar" },
    { region: "東南亞", progress: 55, styles: "Bharatanatyam" },
    { region: "歐陸", progress: 20, styles: "Flamenco · Waltz" },
  ];

  const favorites = [
    { name: "Maya Lin", style: "Contemporary", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600" },
    { name: "Carlos Vega", style: "Salsa", img: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600" },
    { name: "Ayaka Tanaka", style: "Butoh", img: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=600" },
    { name: "Diego Pérez", style: "Tango", img: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600" },
  ];

  return (
    <div className="container-wide mx-auto px-4 md:px-6 space-y-10">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="eyebrow">Hej · 歡迎回來</span>
        <h1 className="font-display text-3xl md:text-5xl text-foreground mt-2">
          今天，想跟著哪段節奏走？
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          一杯咖啡的時間，看看你的舞蹈足跡與下一段旅程。
        </p>
      </motion.div>

      {/* My Dance DNA */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden border-0 shadow-elevated rounded-[2rem] bg-gradient-to-br from-[hsl(32_70%_94%)] via-[hsl(20_65%_90%)] to-[hsl(350_45%_86%)]">
          {/* Glassmorphism orbs */}
          <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[hsl(15_70%_75%)]/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full bg-[hsl(35_75%_82%)]/50 blur-3xl pointer-events-none" />
          <CardContent className="relative p-6 md:p-10">
            <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/40 backdrop-blur-md border border-background/40 text-xs font-medium text-foreground/80 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  我的舞蹈 DNA
                </div>
                <h2 className="font-display italic text-4xl md:text-5xl text-foreground mt-4 leading-[1.05]">
                  曠野靈魂
                </h2>
                <p className="font-display italic text-base text-foreground/60 mt-1">Wildland Soul · 火光型舞者</p>
                <p className="text-foreground/75 mt-4 leading-relaxed">
                  熱愛節奏與即興，在群體裡自然成為氣氛中心。下一步，試著走進更靜的身體語言。
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  <Badge variant="secondary" className="font-display italic bg-background/40 backdrop-blur-md border border-background/50 text-foreground/85">熱情 Passionate</Badge>
                  <Badge variant="secondary" className="font-display italic bg-background/40 backdrop-blur-md border border-background/50 text-foreground/85">直覺 Intuitive</Badge>
                  <Badge variant="secondary" className="font-display italic bg-background/40 backdrop-blur-md border border-background/50 text-foreground/85">社交 Social</Badge>
                </div>
              </div>

              <div className="space-y-5 rounded-2xl bg-background/30 backdrop-blur-xl border border-background/40 p-5 shadow-sm">
                {dnaTraits.map((t) => (
                  <div key={t.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display italic text-sm text-foreground/85">{t.label}</span>
                      <span className="font-display text-sm font-medium text-foreground">{t.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-background/40 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-foreground/60 to-foreground/90 rounded-full"
                        style={{ width: `${t.value}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="mt-2 border-foreground/30 bg-background/40 backdrop-blur text-foreground hover:bg-foreground hover:text-background">
                  查看完整分析
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Exploration progress */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="eyebrow">Explore · 舞遍世界</span>
            <h2 className="font-display text-2xl md:text-3xl text-foreground mt-1">
              我的探索進度
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/styles">
              <Globe2 className="w-4 h-4" /> 全球地圖
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {exploration.map((e) => (
            <Card key={e.region} className="rounded-2xl border-border/60 hover:shadow-elevated transition">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <RingProgress value={e.progress} />
                <h3 className="font-display text-base mt-3 text-foreground">{e.region}</h3>
                <p className="text-xs text-muted-foreground mt-1">{e.styles}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Favorites scroll */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="eyebrow">Saved · 收藏</span>
            <h2 className="font-display text-2xl md:text-3xl text-foreground mt-1">
              收藏的導師與課程
            </h2>
          </div>
          <Button variant="ghost" size="sm">
            <Bookmark className="w-4 h-4" /> 全部
          </Button>
        </div>

        <ScrollArea className="w-full whitespace-nowrap pb-3">
          <div className="flex gap-4">
            {favorites.map((f) => (
              <Card
                key={f.name}
                className="inline-block w-[260px] shrink-0 overflow-hidden rounded-2xl border-border/60 hover:shadow-elevated transition"
              >
                <div className="aspect-[4/5] overflow-hidden bg-secondary">
                  <img src={f.img} alt={f.name} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display text-lg text-foreground">{f.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{f.style}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                      <Heart className="w-3.5 h-3.5 fill-primary" /> 已收藏
                    </span>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      查看 <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Next step CTA */}
      <Card className="rounded-3xl border-border/60 bg-secondary/40">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground">下一段旅程</h3>
              <p className="text-sm text-muted-foreground">根據你的 DNA，推薦：西非 Sabar 入門工作坊</p>
            </div>
          </div>
          <Button variant="hero">查看推薦</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function RingProgress({ value }: { value: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 70 70" className="w-full h-full -rotate-90">
        <circle cx="35" cy="35" r={r} stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
        <circle
          cx="35"
          cy="35"
          r={r}
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-sm text-foreground">
        {value}%
      </span>
    </div>
  );
}

/* ---------------- Master Dashboard ---------------- */

function MasterDashboard() {
  const courses = [
    { title: "Salsa 身體節奏入門", students: 42, status: "進行中" },
    { title: "古巴 Rumba 文化工作坊", students: 18, status: "招生中" },
    { title: "Afro-Cuban 即興夜", students: 0, status: "草稿" },
  ];

  const stats = [
    { icon: Users, label: "島民追蹤", value: "1,284", trend: "+12%" },
    { icon: Eye, label: "本月瀏覽", value: "8,932", trend: "+23%" },
    { icon: MessageCircle, label: "互動訊息", value: "47", trend: "+5" },
    { icon: Calendar, label: "預約場次", value: "9", trend: "本週" },
  ];

  return (
    <div className="container-wide mx-auto px-4 md:px-6 space-y-12">
      {/* Editorial header */}
      <header className="border-b border-border pb-8">
        <span className="eyebrow tracking-[0.3em]">Master · 引導者</span>
        <h1 className="font-display italic text-4xl md:text-6xl text-foreground mt-3 leading-[1.05]">
          你的舞台，<br className="hidden md:block" />
          由你親手策展。
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Button asChild variant="hero">
            <Link to="/teacher/dashboard">
              <PenLine className="w-4 h-4" /> 編輯個人形象
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/teacher/preview">
              <Eye className="w-4 h-4" /> 預覽公開頁面
            </Link>
          </Button>
        </div>
      </header>

      {/* Influence index — featured */}
      <section className="grid md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-4">
        <Card className="md:row-span-1 rounded-3xl border-0 overflow-hidden bg-gradient-to-br from-foreground via-foreground to-primary/80 text-background relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary-foreground))_0%,transparent_50%)]" />
          <CardContent className="relative p-6 md:p-7">
            <div className="flex items-center justify-between">
              <span className="eyebrow tracking-[0.3em] text-background/70">Influence Index</span>
              <TrendingUp className="w-4 h-4 text-background/70" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display italic text-5xl md:text-6xl">87</span>
              <span className="text-xs text-background/60">/ 100</span>
            </div>
            <div className="text-sm text-background/80 mt-2 font-display italic">島民影響力指數</div>
            <div className="mt-4 h-1 rounded-full bg-background/20 overflow-hidden">
              <div className="h-full bg-background/90 rounded-full" style={{ width: "87%" }} />
            </div>
            <p className="text-xs text-background/60 mt-3">高於 92% 的引導者 · +6 本月</p>
          </CardContent>
        </Card>
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/60 shadow-none">
            <CardContent className="p-5">
              <s.icon className="w-4 h-4 text-foreground/50" strokeWidth={1.5} />
              <div className="mt-6">
                <div className="font-display text-3xl text-foreground tracking-tight">{s.value}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-[10px] text-foreground/50">{s.trend}</span>
                </div>
              </div>
              {/* minimal sparkline */}
              <svg viewBox="0 0 100 20" className="w-full h-5 mt-3 text-foreground/30">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  points="0,15 15,12 30,14 45,8 60,10 75,5 90,7 100,3"
                />
              </svg>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Profile editor preview */}
      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="rounded-[2rem] overflow-hidden border border-border/60 bg-background shadow-elevated">
          {/* Gallery frame */}
          <div className="p-4 md:p-6 bg-secondary/30">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
                <span className="w-2 h-2 rounded-full bg-foreground/20" />
              </div>
              <span className="eyebrow tracking-[0.3em] text-[10px] text-muted-foreground">Gallery Preview</span>
            </div>
            <div className="aspect-[16/8] relative overflow-hidden rounded-2xl ring-1 ring-foreground/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1400"
                alt="hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute top-5 left-6">
                <span className="inline-block px-3 py-1 rounded-full bg-background/20 backdrop-blur-md border border-background/30 text-[10px] tracking-[0.25em] text-background uppercase">
                  Featured Master
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-background">
                <span className="text-[11px] uppercase tracking-[0.3em] opacity-70">個人形象專區</span>
                <h3 className="font-display italic text-3xl md:text-4xl mt-2 leading-tight">在身體裡寫下文化</h3>
                <div className="flex items-center gap-3 mt-3 text-xs opacity-80">
                  <span>Salsa</span>
                  <span className="w-1 h-1 rounded-full bg-background/60" />
                  <span>Afro-Cuban</span>
                  <span className="w-1 h-1 rounded-full bg-background/60" />
                  <span>15 yrs</span>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-6 flex items-center justify-between border-t border-border/60">
            <div>
              <p className="font-display italic text-base text-foreground">封面 · 簡介 · 文化故事 · 時間軸</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-1 w-32 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: "78%" }} />
                </div>
                <span className="text-xs text-muted-foreground">完成度 78%</span>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/teacher/dashboard">
                編輯 <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Interaction insights */}
        <Card className="rounded-3xl border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              島民互動
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">頁面互動率</span>
                <span className="text-foreground font-medium">68%</span>
              </div>
              <Progress value={68} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">課程轉換率</span>
                <span className="text-foreground font-medium">42%</span>
              </div>
              <Progress value={42} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">回訪島民</span>
                <span className="text-foreground font-medium">55%</span>
              </div>
              <Progress value={55} />
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              本週新增 28 位島民收藏你的專區。
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Course / culture content management */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="eyebrow tracking-[0.3em]">Content · 課程與文化</span>
            <h2 className="font-display italic text-2xl md:text-3xl text-foreground mt-1">
              內容管理
            </h2>
          </div>
          <Button variant="hero" size="sm">
            <BookOpen className="w-4 h-4" /> 新增內容
          </Button>
        </div>

        <Card className="rounded-2xl border-border/60 overflow-hidden">
          <div className="divide-y divide-border">
            {courses.map((c) => (
              <div
                key={c.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 hover:bg-secondary/40 transition"
              >
                <div>
                  <h3 className="font-display text-lg text-foreground">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {c.students} 位島民 · {c.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" /> 預覽
                  </Button>
                  <Button variant="outline" size="sm">
                    <PenLine className="w-4 h-4" /> 編輯
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
