import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Camera, Eye, LogOut, Save, CheckCircle2, Clock, Circle, Lock, UserCircle2, FileSignature, CalendarRange, MapPin } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SectionCard } from "@/components/teacher/SectionCard";
import { HeroImageEditor } from "@/components/teacher/HeroImageEditor";
import { CoursesEditor } from "@/components/teacher/CoursesEditor";
import { MediaEditor } from "@/components/teacher/MediaEditor";
import { TagListEditor } from "@/components/teacher/TagListEditor";
import { ExperienceEditor } from "@/components/teacher/ExperienceEditor";
import { EventPublisher } from "@/components/teacher/EventPublisher";

const REQUIRED_MSG = "此欄位為必填，有了它學員才能找到你喔！";

const profileSchema = z.object({
  name: z.string().trim().min(1, REQUIRED_MSG).max(100),
  name_en: z.string().trim().max(100).optional().or(z.literal("")),
  slug: z
    .string()
    .trim()
    .min(1, REQUIRED_MSG)
    .max(60)
    .regex(/^[a-z0-9-]+$/, { message: "網址代稱只能使用小寫字母、數字、連字號" }),
  specialty: z.string().trim().max(120).optional().or(z.literal("")),
  region: z.string().trim().min(1, REQUIRED_MSG).max(80),
  tagline: z.string().trim().min(1, REQUIRED_MSG).max(160),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  instagram_url: z.string().trim().url("請輸入完整網址").max(255).optional().or(z.literal("")),
  youtube_url: z.string().trim().url("請輸入完整網址").max(255).optional().or(z.literal("")),
  website_url: z.string().trim().url("請輸入完整網址").max(255).optional().or(z.literal("")),
});

// Field id -> DOM id for scroll-to-error
const REQUIRED_FIELD_DOM_IDS: Record<string, string> = {
  name: "name",
  slug: "slug",
  region: "region",
  tagline: "tagline",
  dance_styles: "styles",
};

interface Profile {
  id: string;
  user_id: string;
  slug: string | null;
  name: string;
  name_en: string;
  specialty: string;
  region: string;
  bio: string;
  avatar_url: string | null;
  hero_image_url: string | null;
  tagline: string;
  credentials: string[];
  languages: string[];
  dance_styles: string[];
  instagram_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
  is_approved: boolean;
}

export default function TeacherDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const skipDirty = useRef(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/teacher/login", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("teacher_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) {
        toast({ title: "讀取失敗", description: error.message, variant: "destructive" });
      } else if (data) {
        const d = data as any;
        skipDirty.current = true;
        setProfile({
          ...d,
          tagline: d.tagline ?? "",
          credentials: d.credentials ?? [],
          languages: (d.languages ?? []).length > 0 ? d.languages : ["中文"],
          hero_image_url: d.hero_image_url ?? null,
        });
      }
      setLoading(false);
    })();
  }, [user, toast]);

  // Mark dirty whenever the profile state actually changes via user edits
  const update = (patch: Partial<Profile>) => {
    skipDirty.current = false;
    setProfile((p) => (p ? { ...p, ...patch } : p));
    setDirty(true);
  };

  // Warn on tab/refresh when there are unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "圖片過大", description: "請上傳 5MB 以內的圖片", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setProfile((p) => (p ? { ...p, avatar_url: data.publicUrl } : p));
      await supabase
        .from("teacher_profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("user_id", user.id);
      toast({ title: "頭像已更新" });
    } catch (err: any) {
      toast({ title: "上傳失敗", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleHeroSave = async (url: string) => {
    if (!user) return;
    setProfile((p) => (p ? { ...p, hero_image_url: url } : p));
    await (supabase as any)
      .from("teacher_profiles")
      .update({ hero_image_url: url })
      .eq("user_id", user.id);
  };

  const scrollToField = (fieldId: string) => {
    const domId = REQUIRED_FIELD_DOM_IDS[fieldId];
    if (!domId) return;
    const el = document.getElementById(domId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => (el as HTMLElement).focus?.(), 400);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    // Required fields check (in display order)
    const requiredChecks: Array<{ id: string; ok: boolean }> = [
      { id: "name", ok: !!profile.name?.trim() },
      { id: "slug", ok: !!profile.slug?.trim() },
      { id: "dance_styles", ok: (profile.dance_styles ?? []).filter(Boolean).length > 0 },
      { id: "region", ok: !!profile.region?.trim() },
      { id: "tagline", ok: !!profile.tagline?.trim() },
    ];
    const firstMissing = requiredChecks.find((r) => !r.ok);
    if (firstMissing) {
      toast({
        title: "請完成必填欄位",
        description: REQUIRED_MSG,
        variant: "destructive",
      });
      scrollToField(firstMissing.id);
      return;
    }

    const parsed = profileSchema.safeParse({
      name: profile.name,
      name_en: profile.name_en,
      slug: profile.slug ?? "",
      specialty: profile.specialty,
      region: profile.region,
      tagline: profile.tagline,
      bio: profile.bio,
      instagram_url: profile.instagram_url ?? "",
      youtube_url: profile.youtube_url ?? "",
      website_url: profile.website_url ?? "",
    });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      toast({
        title: "請檢查欄位",
        description: issue.message,
        variant: "destructive",
      });
      if (issue.path?.[0]) scrollToField(String(issue.path[0]));
      return;
    }

    // Auto-default teaching language to 中文 when user skipped it
    const languages =
      (profile.languages ?? []).filter(Boolean).length > 0 ? profile.languages : ["中文"];

    setSaving(true);
    const credentials = profile.credentials.map((s) => s.trim()).filter(Boolean);
    const { error } = await (supabase as any)
      .from("teacher_profiles")
      .update({
        name: profile.name.trim(),
        name_en: profile.name_en.trim(),
        slug: profile.slug?.trim() || null,
        specialty: profile.specialty.trim(),
        region: profile.region.trim(),
        tagline: profile.tagline.trim(),
        bio: profile.bio.trim(),
        credentials,
        languages,
        dance_styles: profile.dance_styles,
        instagram_url: profile.instagram_url?.trim() || null,
        youtube_url: profile.youtube_url?.trim() || null,
        website_url: profile.website_url?.trim() || null,
      })
      .eq("user_id", user.id);
    setSaving(false);

    if (error) {
      const msg = error.message.includes("duplicate") ? "這個網址代稱已被使用" : error.message;
      toast({ title: "儲存失敗", description: msg, variant: "destructive" });
    } else {
      setProfile((p) => (p ? { ...p, languages } : p));
      setDirty(false);
      toast({ title: "已儲存", description: "你的舞蹈故事已更新" });
    }
  };

  if (authLoading || loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">載入中…</p>
      </div>
    );
  }

  // ---- Onboarding progress (3 steps) ----
  const step1Done =
    !!profile.name?.trim() &&
    !!profile.slug?.trim() &&
    !!profile.region?.trim() &&
    !!profile.tagline?.trim() &&
    (profile.dance_styles ?? []).filter(Boolean).length > 0 &&
    !!profile.bio?.trim();
  const step2Done = false; // 合作協議簽署功能即將開放
  const step3Done = false; // 待第二步完成後啟用
  const coursesUnlocked = step2Done;

  const SavePanel = (
    <div className="space-y-4">
      <div className="rounded-3xl border border-[#E63946]/15 bg-white shadow-soft p-5">
        <div className="flex items-center gap-2 text-xs mb-3">
          {dirty ? (
            <>
              <Circle className="w-2.5 h-2.5 fill-[#E63946] text-[#E63946]" />
              <span className="text-[#E63946]">有未儲存的變更</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span className="text-muted-foreground">所有變更皆已儲存</span>
            </>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="w-full text-white hover:opacity-90"
          style={{ backgroundColor: "#E63946" }}
        >
          <Save className="w-4 h-4" /> {saving ? "儲存中…" : "儲存變更"}
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full mt-2">
          <Link to="/teacher/preview">
            <Eye className="w-4 h-4" /> 預覽完整頁面
          </Link>
        </Button>
        <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
          所有變更都會在你點下「儲存」後同步至個人名片、世界地圖與平台首頁。
        </p>
      </div>

      {/* Dedicated brand-page (map card) preview */}
      <div className="rounded-3xl border border-[#E89B5C]/30 bg-gradient-to-br from-[#FFF5E6] to-white shadow-soft p-5">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-[#E89B5C]" />
          <span className="eyebrow" style={{ color: "#E89B5C" }}>Brand Card</span>
        </div>
        <h3 className="font-display text-base text-foreground mb-1">品牌專頁預覽</h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
          即便還沒發佈課程,也能先看看自己在世界地圖上的專屬名片長什麼樣子。
        </p>
        <Button asChild variant="outline" size="sm" className="w-full border-[#E89B5C]/50 text-[#B25C2E] hover:bg-[#E89B5C]/10">
          <Link to="/teacher/preview?card=1">
            <Eye className="w-4 h-4" /> 預覽地圖名片
          </Link>
        </Button>
      </div>
    </div>
  );

  const steps = [
    { icon: UserCircle2, label: "完善品牌專頁", hint: "個人介紹與背景", done: step1Done, active: !step1Done },
    { icon: FileSignature, label: "簽署合作協議", hint: "即將開放", done: step2Done, active: step1Done && !step2Done },
    { icon: CalendarRange, label: "發佈課程與活動", hint: "完成前兩步後啟用", done: step3Done, active: step2Done && !step3Done },
  ];
  const completedCount = steps.filter((s) => s.done).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);


  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5E6" }}>
      <header className="border-b border-[#E63946]/10 bg-[#FFF5E6]/90 backdrop-blur sticky top-0 z-40">
        <div className="container-wide mx-auto h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-baseline gap-2 min-w-0">
            <span className="font-display text-xl text-gradient truncate">舞島咖 DanceKha</span>
            <span className="eyebrow hidden sm:inline">Leaders' Studio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "#identity", label: "個人檔案" },
              { href: "#courses", label: "課程與活動" },
              { href: "#media", label: "課堂瞬間" },
            ].map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="px-3 py-1.5 rounded-full text-sm text-foreground/70 hover:text-[#E63946] hover:bg-white transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/teacher/preview">
                <Eye className="w-4 h-4" /> <span className="hidden sm:inline">預覽</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">登出</span>
            </Button>
          </div>
        </div>
        <div className="md:hidden border-t border-[#E63946]/10 px-4 py-2 flex gap-2 overflow-x-auto">
          {[
            { href: "#identity", label: "個人檔案" },
            { href: "#courses", label: "課程與活動" },
            { href: "#media", label: "課堂瞬間" },
          ].map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-white text-foreground/70 border border-[#E63946]/15"
            >
              {n.label}
            </a>
          ))}
        </div>
      </header>

      <main className="container-wide mx-auto py-10 md:py-16 px-4 pb-32 lg:pb-16 max-w-6xl">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
          {/* Form column */}
          <div className="min-w-0 max-w-3xl">
            {/* Onboarding Progress Tracker */}
            <section className="mb-10 rounded-3xl border border-[#E63946]/15 bg-white/80 backdrop-blur shadow-soft p-6 md:p-7">
              <div className="flex items-end justify-between mb-5 gap-4 flex-wrap">
                <div>
                  <span className="eyebrow" style={{ color: "#E63946" }}>Onboarding</span>
                  <h2 className="font-display text-xl md:text-2xl text-foreground mt-1">進駐進度</h2>
                  <p className="text-xs text-muted-foreground mt-1">三個步驟,完整啟動你的舞蹈品牌。</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl text-[#E63946]">{progressPct}%</div>
                  <div className="text-[11px] text-muted-foreground">已完成 {completedCount} / {steps.length}</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 relative">
                {steps.map((s, i) => {
                  const Icon = s.done ? CheckCircle2 : s.active ? s.icon : Lock;
                  return (
                    <div
                      key={s.label}
                      className={`relative rounded-2xl border p-4 transition-all ${
                        s.done
                          ? "border-success/40 bg-success/5"
                          : s.active
                          ? "border-[#E63946]/40 bg-[#FFF5E6] shadow-sm"
                          : "border-border bg-secondary/30 opacity-70"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            s.done
                              ? "bg-success/15 text-success"
                              : s.active
                              ? "bg-[#E63946]/10 text-[#E63946]"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                            Step {i + 1}
                          </div>
                          <div className="font-medium text-sm text-foreground truncate">{s.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{s.hint}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Status banner */}
            <div
              className={`flex items-start gap-3 p-4 rounded-2xl mb-10 border shadow-sm ${
                profile.is_approved
                  ? "bg-success/5 border-success/30 text-success"
                  : "bg-white border-[#E63946]/15 text-muted-foreground"
              }`}
            >
              {profile.is_approved ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              ) : (
                <Clock className="w-5 h-5 mt-0.5 shrink-0" />
              )}
              <div className="text-sm leading-relaxed">
                {profile.is_approved ? (
                  <>
                    <p className="font-medium">你的故事已上線</p>
                    <p className="text-foreground/70 mt-0.5">學員可以在公開頁面與你相遇。</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-foreground">待審核中</p>
                    <p className="mt-0.5">把故事寫得更完整,團隊會盡快為你上線。</p>
                  </>
                )}
              </div>
            </div>



            <div id="identity" className="mb-10">
              <span className="eyebrow" style={{ color: "#E63946" }}>Your Story</span>
              <h1 className="font-display text-3xl md:text-4xl text-foreground mt-3">
                編輯<span className="text-accent-italic">舞蹈旅程</span>
              </h1>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                這不是履歷，是邀請函。讓人從這裡開始,願意走進你的舞蹈世界。
              </p>
            </div>

            {/* Hero & identity */}
            <SectionCard
              eyebrow="Cover"
              title="封面影像"
              description="第一眼會被記住的畫面。"
            >
              <HeroImageEditor
                userId={user!.id}
                value={profile.hero_image_url}
                onChange={handleHeroSave}
              />
            </SectionCard>

            <SectionCard
              eyebrow="Identity"
              title="基本身份"
              description="姓名、暱稱、網址代稱。"
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-secondary ring-2 ring-border">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-muted-foreground font-display">
                      {profile.name?.[0] ?? "?"}
                    </div>
                  )}
                </div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-secondary transition text-sm">
                    <Camera className="w-4 h-4" />
                    {uploading ? "上傳中…" : "更換頭像"}
                  </span>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </Label>
              </div>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名 <span className="text-[#E89B5C] ml-0.5" aria-hidden="true">*</span></Label>
                    <Input
                      id="name"
                      value={profile.name}
                      maxLength={100}
                      onChange={(e) => update({ name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_en">英文名</Label>
                    <Input
                      id="name_en"
                      value={profile.name_en}
                      maxLength={100}
                      onChange={(e) => update({ name_en: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">個人專屬網址設定 <span className="text-[#E89B5C] ml-0.5" aria-hidden="true">*</span></Label>
                  <div className="flex items-stretch rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background overflow-hidden">
                    <span className="hidden sm:inline-flex items-center px-3 text-xs text-muted-foreground bg-secondary/60 border-r border-input select-none whitespace-nowrap">
                      dancekha.lovable.app/instructors/
                    </span>
                    <Input
                      id="slug"
                      value={profile.slug ?? ""}
                      maxLength={60}
                      placeholder="elisha"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                      onChange={(e) => {
                        const raw = e.target.value.trim().toLowerCase();
                        const extracted = raw.includes("/")
                          ? raw.replace(/\/+$/, "").split("/").pop() ?? ""
                          : raw;
                        const sanitized = extracted.replace(/[^a-z0-9-]/g, "");
                        if (raw && sanitized !== raw) {
                          toast({
                            title: "格式不正確",
                            description: "只能輸入英文、數字或連字號，請勿填寫完整網址。",
                            variant: "destructive",
                          });
                        }
                        update({ slug: sanitized });
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    請填寫自訂的英文或數字（例如: elisha），這將成為您在舞島咖的專屬名片網址。
                  </p>
                  <p className="text-xs text-muted-foreground">
                    預覽：dancekha.lovable.app/instructors/{profile.slug || "your-name"}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">專長</Label>
                    <Input
                      id="specialty"
                      value={profile.specialty}
                      maxLength={120}
                      placeholder="現代舞 / 即興"
                      onChange={(e) => update({ specialty: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">地區 <span className="text-[#E89B5C] ml-0.5" aria-hidden="true">*</span></Label>
                    <Input
                      id="region"
                      value={profile.region}
                      maxLength={80}
                      placeholder="亞洲・台灣"
                      onChange={(e) => update({ region: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">一句話介紹 <span className="text-[#E89B5C] ml-0.5" aria-hidden="true">*</span></Label>
                  <Input
                    id="tagline"
                    value={profile.tagline}
                    maxLength={160}
                    placeholder="用一句話讓人記住你跳舞的樣子。"
                    onChange={(e) => update({ tagline: e.target.value })}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Story */}
            <SectionCard
              eyebrow="Story"
              title="關於我"
              description="像跟新朋友聊天一樣，分享你怎麼開始跳舞。"
            >
              <div className="space-y-3">
                <Textarea
                  value={profile.bio}
                  maxLength={2000}
                  rows={6}
                  placeholder="我叫 ___,跳的是 ___。讓我帶你走進這個世界。"
                  onChange={(e) => update({ bio: e.target.value })}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {profile.bio.length} / 2000
                </p>
              </div>
            </SectionCard>

            {/* Tags */}
            <SectionCard
              eyebrow="Tags"
              title="舞蹈風格與背景"
              description="幫助學員找到你的關鍵字。"
            >
              <div className="space-y-5">
                <TagListEditor
                  id="styles"
                  label={<>舞蹈風格／專長 <span className="text-[#E89B5C] ml-0.5" aria-hidden="true">*</span></>}
                  values={profile.dance_styles}
                  placeholder="現代舞, 即興, Contact Improv"
                  hint="以逗號分隔"
                  onChange={(v) => update({ dance_styles: v })}
                />
                <ExperienceEditor
                  values={profile.credentials}
                  onChange={(v) => update({ credentials: v })}
                />
                <TagListEditor
                  id="langs"
                  label="教學語言"
                  values={profile.languages}
                  placeholder="中文, English, 日本語"
                  pillTone="accent"
                  onChange={(v) => update({ languages: v })}
                />
              </div>
            </SectionCard>

            {/* Media */}
            <div id="media" className="scroll-mt-24">
              <SectionCard
                eyebrow="Moments"
                title="課堂精彩瞬間"
                description="上傳 1~3 張真實的課堂照片,充滿笑容與溫度的畫面最能打動學員！"
              >
                <MediaEditor teacherId={profile.id} userId={user!.id} />
              </SectionCard>
            </div>

            {/* Social */}
            <SectionCard eyebrow="Connect" title="社群連結">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="ig">Instagram</Label>
                  <Input
                    id="ig"
                    type="url"
                    value={profile.instagram_url ?? ""}
                    maxLength={255}
                    placeholder="https://instagram.com/your-handle"
                    onChange={(e) => update({ instagram_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yt">YouTube</Label>
                  <Input
                    id="yt"
                    type="url"
                    value={profile.youtube_url ?? ""}
                    maxLength={255}
                    placeholder="https://youtube.com/@your-channel"
                    onChange={(e) => update({ youtube_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="web">個人網站</Label>
                  <Input
                    id="web"
                    type="url"
                    value={profile.website_url ?? ""}
                    maxLength={255}
                    placeholder="https://your-site.com"
                    onChange={(e) => update({ website_url: e.target.value })}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Courses & Events — moved to bottom, locked until 合作協議 signed */}
            <div id="courses" className="scroll-mt-24 relative">
              <SectionCard
                eyebrow="Courses & Events"
                title={
                  <span className="flex items-center gap-2">
                    課程與活動管理
                    {!coursesUnlocked && (
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        <Lock className="w-3 h-3" /> 待啟用
                      </span>
                    )}
                  </span>
                }
                description={
                  coursesUnlocked
                    ? "在這裡管理您的所有課程與活動。只要建立並發布,系統將自動同步至您的個人名片、世界地圖與平台首頁！"
                    : "完成「簽署合作協議」後即可開放,屆時你可以在這裡發佈課程與活動,並同步至世界地圖。"
                }
              >
                <div className="relative">
                  <div className={coursesUnlocked ? "" : "pointer-events-none select-none opacity-40 blur-[1px]"}>
                    <div className="space-y-8">
                      <CoursesEditor teacherId={profile.id} />
                      <div className="pt-2 border-t border-border/50">
                        <EventPublisher userId={user!.id} instructorName={profile.name} />
                      </div>
                    </div>
                  </div>
                  {!coursesUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-2xl bg-white/95 border border-[#E89B5C]/40 shadow-soft px-6 py-5 text-center max-w-sm">
                        <div className="w-10 h-10 rounded-full bg-[#E89B5C]/15 text-[#B25C2E] flex items-center justify-center mx-auto mb-2">
                          <Lock className="w-4 h-4" />
                        </div>
                        <p className="font-display text-base text-foreground">此區待啟用</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          請先完成上方第二步「簽署合作協議」,即可開始發佈課程與活動。
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>


          {/* Sticky save panel (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">{SavePanel}</div>
          </aside>
        </div>
      </main>

      {/* Mobile fixed save bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E63946]/15 bg-[#FFF5E6]/90 backdrop-blur shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-3"
      >
        <div className="container-wide mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] min-w-0 flex-1">
            {dirty ? (
              <>
                <Circle className="w-2 h-2 fill-[#E63946] text-[#E63946] shrink-0" />
                <span className="text-[#E63946] truncate">有未儲存的變更</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                <span className="text-muted-foreground truncate">已儲存</span>
              </>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="text-white hover:opacity-90"
            style={{ backgroundColor: "#E63946" }}
          >
            <Save className="w-4 h-4" /> {saving ? "儲存中…" : "儲存變更"}
          </Button>
        </div>
      </div>

      {/* Wave decoration footer */}
      <div className="relative h-24 overflow-hidden hidden lg:block" aria-hidden="true">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <path
            d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 L1440,100 L0,100 Z"
            fill="#E63946"
            fillOpacity="0.08"
          />
          <path
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60"
            stroke="#E63946"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground font-body">
          舞島咖 DanceKha · 引領者專區
        </p>
      </div>
    </div>
  );
}
