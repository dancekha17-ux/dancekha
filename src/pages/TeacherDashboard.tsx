import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Camera, Eye, LogOut, Save, CheckCircle2, Clock, Circle, Lock, UserCircle2, FileSignature, CalendarRange, MapPin, Send } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SectionCard } from "@/components/teacher/SectionCard";
import { CoursesEditor } from "@/components/teacher/CoursesEditor";
import { ProfileSummaryCard } from "@/components/teacher/ProfileSummaryCard";
import { StoryMomentsCard } from "@/components/teacher/StoryMomentsCard";


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
  contact_email: z.string().trim().email("請輸入有效的 Email").max(255).optional().or(z.literal("")),
  contact_phone: z.string().trim().max(40).optional().or(z.literal("")),
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
  contact_email: string | null;
  contact_phone: string | null;
  is_approved: boolean;
  agreement_signed_at: string | null;
}

export default function TeacherDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [revisionAlerts, setRevisionAlerts] = useState<Array<{ id: string; title: string; revision_notes: string }>>([]);


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
        // Fetch any courses with admin revision feedback
        const { data: revRows } = await (supabase as any)
          .from("instructor_courses")
          .select("id,title,revision_notes,status")
          .eq("teacher_id", d.id)
          .eq("status", "draft")
          .not("revision_notes", "is", null);
        setRevisionAlerts((revRows ?? []).filter((r: any) => (r.revision_notes ?? "").trim().length > 0));
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
      contact_email: profile.contact_email ?? "",
      contact_phone: profile.contact_phone ?? "",
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
        contact_email: profile.contact_email?.trim() || null,
        contact_phone: profile.contact_phone?.trim() || null,
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

  const handleSubmitForReview = async () => {
    if (!profile) return;
    if (dirty) {
      toast({ title: "請先儲存變更", description: "申請刊登前請先儲存所有編輯。", variant: "destructive" });
      return;
    }
    if (!profile.contact_email?.trim() || !profile.contact_phone?.trim()) {
      toast({ title: "請先補齊聯絡資訊", description: "送審前請至「聯絡與社群」填寫 Email 與電話。", variant: "destructive" });
      return;
    }
    if (!profile.agreement_signed_at) {
      toast({ title: "請先完成合作協議簽署", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { data: drafts, error: fetchErr } = await (supabase as any)
      .from("instructor_courses")
      .select("*")
      .eq("teacher_id", profile.id)
      .eq("status", "draft");
    if (fetchErr) {
      setSubmitting(false);
      return toast({ title: "讀取失敗", description: fetchErr.message, variant: "destructive" });
    }
    if (!drafts || drafts.length === 0) {
      setSubmitting(false);
      return toast({
        title: "尚無可送審的課程／活動",
        description: "請先在下方「課程活動管理」新增至少一筆完整內容。",
        variant: "destructive",
      });
    }
    const valid = drafts.filter((c: any) => {
      if (!c.title?.trim() || !c.description?.trim() || !c.price?.trim()) return false;
      const t = c.service_type;
      if ((t === "in_person" || t === "space_rental") && !c.location_address?.trim()) return false;
      if (t === "pre_recorded" && !c.online_link?.trim()) return false;
      if (t === "event_ticket" && !c.session_info?.trim()) return false;
      return true;
    });
    if (valid.length === 0) {
      setSubmitting(false);
      return toast({
        title: "請補齊草稿欄位",
        description: "至少要有一筆完整的課程／活動才能申請刊登。",
        variant: "destructive",
      });
    }
    const { error } = await (supabase as any)
      .from("instructor_courses")
      .update({ status: "pending", submitted_at: new Date().toISOString(), revision_notes: null })
      .in("id", valid.map((c: any) => c.id));
    setSubmitting(false);
    if (error) return toast({ title: "送審失敗", description: error.message, variant: "destructive" });
    toast({
      title: "已申請刊登！",
      description: `已提交 ${valid.length} 筆服務，舞島咖團隊將於 2 個工作天內完成審閱與聯繫。`,
    });
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
  const step2Done = !!profile.agreement_signed_at;
  const step3Done = false; // 待第三步完成後啟用
  const coursesUnlocked = step1Done && step2Done; // 必須完成品牌專頁 + 簽署協議

  // Header now hosts Save / Preview / Submit / Map actions (see header JSX below).


  const steps = [
    { icon: UserCircle2, label: "完善品牌專頁", hint: "個人介紹與背景", done: step1Done, active: !step1Done, href: "#identity" },
    { icon: FileSignature, label: "簽署合作協議", hint: step2Done ? "已完成簽署" : "前往閱讀並簽署 →", done: step2Done, active: step1Done && !step2Done, href: "/teacher/agreement" },
    { icon: CalendarRange, label: "發佈課程與服務", hint: step2Done ? "可開始建立服務" : "完成前兩步後啟用", done: step3Done, active: step2Done && !step3Done, href: "#courses" },
  ];
  const completedCount = steps.filter((s) => s.done).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);


  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5E6" }}>
      <header className="border-b border-[#E63946]/10 bg-[#FFF5E6]/90 backdrop-blur sticky top-0 z-40">
        <div className="container-wide mx-auto h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-baseline gap-2 min-w-0">
            <span className="font-display text-xl text-gradient truncate">舞島咖 DanceKha</span>
            <span className="eyebrow hidden sm:inline">GUIDES' LOUNGE</span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {[
              { href: "#identity", label: "個人檔案" },
              { href: "#courses", label: "課程活動管理" },
              { href: "#media", label: "舞蹈故事與畫面" },
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

          {/* Integrated action bar (replaces right sidebar SavePanel) */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <span
              className="hidden md:inline-flex items-center gap-1.5 text-[11px] mr-1"
              aria-live="polite"
            >
              {dirty ? (
                <>
                  <Circle className="w-2 h-2 fill-[#E63946] text-[#E63946]" />
                  <span className="text-[#E63946]">未儲存</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  <span className="text-muted-foreground">已儲存</span>
                </>
              )}
            </span>

            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="text-white hover:opacity-90"
              style={{ backgroundColor: "#E63946" }}
            >
              <Save className="w-4 h-4" /> <span className="hidden sm:inline">{saving ? "儲存中…" : "儲存變更"}</span>
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/teacher/preview">
                <Eye className="w-4 h-4" /> 預覽專頁
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex border border-[#E89B5C]/40 text-[#B25C2E] hover:bg-[#E89B5C]/10">
              <Link to="/teacher/preview?card=1">
                <MapPin className="w-4 h-4" /> 預覽地圖
              </Link>
            </Button>
            <Button
              onClick={handleSubmitForReview}
              disabled={submitting || !coursesUnlocked || dirty}
              size="sm"
              className="text-white shadow-glow hover:opacity-95 ring-1 ring-[#E89B5C]/30 hover:ring-[#E89B5C]/60"
              style={{ background: "linear-gradient(135deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)" }}
              title={
                coursesUnlocked
                  ? "一鍵將草稿提交給舞島咖團隊審閱"
                  : "請先完成品牌專頁與合作協議"
              }
            >
              <Send className="w-4 h-4" /> <span className="hidden sm:inline">{submitting ? "送出中…" : "申請刊登"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="xl:hidden border-t border-[#E63946]/10 px-4 py-2 flex gap-2 overflow-x-auto">
          {[
            { href: "#identity", label: "個人檔案" },
            { href: "#courses", label: "課程活動管理" },
            { href: "#media", label: "舞蹈故事與畫面" },
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


      <main className="container-wide mx-auto py-10 md:py-16 px-4 max-w-4xl">
        <div>
          {/* Form column */}
          <div className="min-w-0">

            {revisionAlerts.length > 0 && (
              <section className="mb-8 rounded-3xl border-2 border-destructive/40 bg-destructive/5 p-5 md:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
                    !
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg text-destructive">
                      舞島咖團隊的修改建議（{revisionAlerts.length}）
                    </h3>
                    <p className="text-xs text-destructive/80 mt-1">
                      以下服務已退回為草稿狀態，請依建議完成調整後再次送出審核。
                    </p>
                    <ul className="mt-4 space-y-3">
                      {revisionAlerts.map((r) => (
                        <li
                          key={r.id}
                          className="rounded-xl bg-white/70 border border-destructive/20 p-3"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {r.title || "（未命名服務）"}
                          </p>
                          <p className="text-xs text-destructive whitespace-pre-wrap mt-1">
                            {r.revision_notes}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <Button asChild size="sm" variant="outline">
                        <a href="#courses">前往修改</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            )}
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
                  const interactive = s.active || s.done;
                  const isInternal = s.href.startsWith("/");
                  const inner = (
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
                  );
                  const className = `relative rounded-2xl border p-4 transition-all ${
                    s.done
                      ? "border-success/40 bg-success/5"
                      : s.active
                      ? "border-[#E63946]/40 bg-[#FFF5E6] shadow-sm hover:shadow-md"
                      : "border-border bg-secondary/30 opacity-70"
                  } ${interactive ? "cursor-pointer" : ""}`;
                  if (interactive && isInternal) {
                    return (
                      <Link key={s.label} to={s.href} className={className}>
                        {inner}
                      </Link>
                    );
                  }
                  if (interactive) {
                    return (
                      <a key={s.label} href={s.href} className={className}>
                        {inner}
                      </a>
                    );
                  }
                  return (
                    <div key={s.label} className={className}>
                      {inner}
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
                    <p className="font-medium text-foreground">待確認中</p>
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

            {/* Card A — Identity + Tags + Connect */}
            <ProfileSummaryCard userId={user!.id} profile={profile} update={update} />

            {/* Card B — Story + Cover + Moments */}
            <div id="media" className="scroll-mt-24">
              <StoryMomentsCard
                userId={user!.id}
                profile={profile}
                updateBio={(v) => update({ bio: v })}
                onHeroChange={handleHeroSave}
              />
            </div>

            {/* Courses & Events — moved to bottom, locked until 合作協議 signed */}
            <div id="courses" className="scroll-mt-24 relative">
              <SectionCard
                eyebrow="Courses & Events"
                title={
                  <span className="flex items-center gap-2">
                    課程活動管理
                    {!coursesUnlocked && (
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        <Lock className="w-3 h-3" /> 待啟用
                      </span>
                    )}
                  </span>
                }
                description={
                  step2Done
                    ? "請在這裡管理您的所有課程與活動。"
                    : "點擊下方「刊登新課程 / 活動」時,系統會請你先完成「合作夥伴協議」簽署,簽署後即可立即發佈。"
                }
              >
                <div className="relative">
                  <div className={coursesUnlocked ? "" : "pointer-events-none select-none opacity-40 blur-[1px]"}>
                    <div className="space-y-8">
                      <CoursesEditor teacherId={profile.id} />
                    </div>
                  </div>
                  {!coursesUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-2xl bg-white/95 border border-[#E89B5C]/40 shadow-soft px-6 py-5 text-center max-w-sm">
                        <div className="w-10 h-10 rounded-full bg-[#E89B5C]/15 text-[#B25C2E] flex items-center justify-center mx-auto mb-2">
                          <Lock className="w-4 h-4" />
                        </div>
                        <p className="font-display text-base text-foreground">
                          {!step1Done ? "請先完善品牌專頁" : "請先完成合作協議簽署"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed mb-3">
                          {!step1Done
                            ? "完成 Step 1 後即可進行 Step 2 簽署。"
                            : "簽署協議是發佈服務的最後一步,完成後即可開放發布權限。"}
                        </p>
                        {step1Done && !step2Done && (
                          <Button asChild size="sm" className="text-white" style={{ backgroundColor: "#E63946" }}>
                            <Link to="/teacher/agreement">
                              <FileSignature className="w-4 h-4" /> 前往簽署協議
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>

        </div>
      </main>



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
          舞島咖 DanceKha · 引導者專區
        </p>
      </div>
    </div>
  );
}
