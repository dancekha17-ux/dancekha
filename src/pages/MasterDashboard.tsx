import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Image as ImageIcon,
  LogOut,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TagListEditor } from "@/components/teacher/TagListEditor";

interface MasterProfile {
  id?: string;
  user_id: string;
  profile_images: string[];
  studio_images: string[];
  logo_url: string | null;
  video_links: string[];
  dance_intro: string;
  bio: string;
  motto: string;
  cultural_tags: string[];
  dance_dna_type: string;
  is_published: boolean;
  is_draft: boolean;
}

const emptyProfile = (uid: string): MasterProfile => ({
  user_id: uid,
  profile_images: [],
  studio_images: [],
  logo_url: null,
  video_links: [],
  dance_intro: "",
  bio: "",
  motto: "",
  cultural_tags: [],
  dance_dna_type: "",
  is_published: false,
  is_draft: true,
});

const submitSchema = z.object({
  dance_intro: z.string().trim().min(20, "請完成深度介紹（至少 20 字）").max(500),
  bio: z.string().trim().min(20, "請填寫個人簡歷").max(3000),
  motto: z.string().trim().min(2, "請寫下你的舞蹈理念或座右銘").max(200),
});

const STEPS = [
  { id: 1, label: "基本身份", caption: "Identity" },
  { id: 2, label: "影像作品", caption: "Visuals" },
  { id: 3, label: "理念故事", caption: "Story" },
] as const;

export default function MasterDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<MasterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/teacher/login", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // Route protection: only teachers/masters/admins may access this dashboard
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const allowed = (roles ?? []).some((r: any) =>
        ["teacher", "master", "admin"].includes(r.role),
      );
      if (!allowed) {
        toast({
          title: "此頁僅供引導者使用",
          description: "已為你導向學員主控台。",
        });
        navigate("/dashboard?role=student", { replace: true });
        return;
      }

      const { data } = await (supabase as any)
        .from("master_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setProfile(data ? { ...emptyProfile(user.id), ...data } : emptyProfile(user.id));
      setLoading(false);
    })();
  }, [user]);

  const update = (patch: Partial<MasterProfile>) =>
    setProfile((p) => (p ? { ...p, ...patch } : p));

  const persist = async (overrides: Partial<MasterProfile> = {}) => {
    if (!profile || !user) return null;
    const payload = { ...profile, ...overrides, user_id: user.id };
    // Strip non-DB fields
    const { id: _id, ...row } = payload as any;
    const { data, error } = await (supabase as any)
      .from("master_profiles")
      .upsert(row, { onConflict: "user_id" })
      .select()
      .single();
    if (error) {
      toast({ title: "儲存失敗", description: error.message, variant: "destructive" });
      return null;
    }
    setProfile({ ...emptyProfile(user.id), ...data });
    return data;
  };

  const saveDraft = async () => {
    setSaving(true);
    await persist({ is_draft: true });
    setSaving(false);
    toast({ title: "草稿已儲存", description: "你可以隨時回來繼續編輯。" });
  };

  const submitForReview = async () => {
    if (!profile) return;
    const parsed = submitSchema.safeParse(profile);
    if (!parsed.success) {
      toast({
        title: "再補上一些細節吧",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      setStep(3);
      return;
    }
    if (profile.profile_images.length === 0) {
      toast({
        title: "需要至少一張形象照",
        description: "讓島民先看見你的樣子。",
        variant: "destructive",
      });
      setStep(2);
      return;
    }
    setSubmitting(true);
    const data = await persist({ is_draft: false });
    setSubmitting(false);
    if (data) {
      toast({
        title: "已收到你的內容",
        description: "我們將在 48 小時內為你的頁面點亮通知。",
      });
    }
  };

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profile_images" | "studio_images" | "logo_url",
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user || !profile) return;
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "圖片過大", description: "請上傳 8MB 以內", variant: "destructive" });
      return;
    }
    setBusyKey(field);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/master-${field}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("instructor-media")
        .upload(path, file, { contentType: file.type });
      if (error) throw error;
      const url = supabase.storage.from("instructor-media").getPublicUrl(path).data.publicUrl;
      if (field === "logo_url") {
        update({ logo_url: url });
      } else {
        update({ [field]: [...profile[field], url] } as any);
      }
    } catch (err: any) {
      toast({ title: "上傳失敗", description: err.message, variant: "destructive" });
    } finally {
      setBusyKey(null);
      e.target.value = "";
    }
  };

  const removeAt = (field: "profile_images" | "studio_images", idx: number) => {
    if (!profile) return;
    update({ [field]: profile[field].filter((_, i) => i !== idx) } as any);
  };

  const completion = useMemo(() => {
    if (!profile) return 0;
    let done = 0;
    const total = 7;
    if (profile.profile_images.length) done++;
    if (profile.studio_images.length) done++;
    if (profile.logo_url) done++;
    if (profile.dance_intro.trim().length >= 20) done++;
    if (profile.bio.trim().length >= 20) done++;
    if (profile.motto.trim().length >= 2) done++;
    if (profile.cultural_tags.length) done++;
    return Math.round((done / total) * 100);
  }, [profile]);

  if (authLoading || loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">載入中…</p>
      </div>
    );
  }

  const isPublished = profile.is_published;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(32_45%_97%)] via-background to-secondary/40">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="container-wide mx-auto h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-xl text-gradient">舞島咖</span>
            <span className="eyebrow">Master Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut className="w-4 h-4" /> 登出
            </Button>
          </div>
        </div>
      </header>

      <main className="container-wide mx-auto py-10 md:py-14 max-w-3xl">
        <div className="mb-8">
          <span className="eyebrow">Become a Master</span>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mt-3">
            點亮你的<span className="text-accent-italic">引導者頁面</span>
          </h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            三個步驟，把你的舞蹈世界寫成一封讓人想走進來的邀請函。
          </p>
        </div>

        {/* Status banner */}
        <div
          className={`flex items-start gap-3 p-4 rounded-2xl mb-8 border ${
            isPublished
              ? "bg-success/5 border-success/30 text-success"
              : profile.is_draft
                ? "bg-secondary/60 border-border text-muted-foreground"
                : "bg-primary/5 border-primary/20 text-foreground"
          }`}
        >
          {isPublished ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 mt-0.5 shrink-0" />
          )}
          <div className="text-sm leading-relaxed">
            {isPublished ? (
              <p className="font-medium">你的頁面已上線，島民正在認識你。</p>
            ) : profile.is_draft ? (
              <p className="font-medium text-foreground">草稿模式 · 完成度 {completion}%</p>
            ) : (
              <>
                <p className="font-medium">已送審，敬請期待</p>
                <p className="mt-0.5">我們將在 48 小時內為你優化並點亮通知。</p>
              </>
            )}
          </div>
        </div>

        {/* Stepper */}
        <ol className="flex items-center gap-2 mb-8">
          {STEPS.map((s, idx) => {
            const active = step === s.id;
            const passed = step > s.id;
            return (
              <li key={s.id} className="flex-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition ${
                    active
                      ? "bg-foreground text-background"
                      : passed
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center text-[10px]">
                    {passed ? <Check className="w-3 h-3" /> : s.id}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <span className="flex-1 h-px bg-border" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>

        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-sm"
          >
            {step === 1 && (
              <div className="space-y-6">
                <header>
                  <p className="eyebrow">Step 1 · Identity</p>
                  <h2 className="font-display text-2xl text-foreground mt-1">
                    基本資料、Logo 與標籤
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    讓島民第一眼認識你來自哪裡、跳的是什麼。
                  </p>
                </header>

                <div className="space-y-3">
                  <Label>個人 Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-secondary border border-border overflow-hidden flex items-center justify-center">
                      {profile.logo_url ? (
                        <img src={profile.logo_url} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-secondary transition cursor-pointer text-sm">
                      <Upload className="w-4 h-4" />
                      {busyKey === "logo_url" ? "上傳中…" : "上傳 Logo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => uploadImage(e, "logo_url")}
                      />
                    </label>
                  </div>
                </div>

                <TagListEditor
                  id="dna"
                  label="舞蹈 DNA 類型"
                  values={profile.dance_dna_type ? [profile.dance_dna_type] : []}
                  placeholder="曠野靈魂"
                  hint="對接學員測驗的單一類型"
                  onChange={(v) => update({ dance_dna_type: v[0] ?? "" })}
                />

                <TagListEditor
                  id="cultural"
                  label="文化標籤"
                  values={profile.cultural_tags}
                  placeholder="巴爾幹, 西非, 安達盧西亞"
                  hint="以逗號分隔，將對接世界地圖"
                  pillTone="soul"
                  onChange={(v) => update({ cultural_tags: v })}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <header>
                  <p className="eyebrow">Step 2 · Visuals</p>
                  <h2 className="font-display text-2xl text-foreground mt-1">
                    高品質劇照與教學側拍
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    所有照片以 4:3 顯示，請挑選能代表你美學的畫面。
                  </p>
                </header>

                <ImageGrid
                  title="形象照（劇照）"
                  hint="主視覺、海報、舞台精選。"
                  images={profile.profile_images}
                  field="profile_images"
                  onUpload={uploadImage}
                  onRemove={removeAt}
                  busy={busyKey === "profile_images"}
                />

                <ImageGrid
                  title="教學 / 教室側拍"
                  hint="團體照、課堂氣氛、學員笑容。"
                  images={profile.studio_images}
                  field="studio_images"
                  onUpload={uploadImage}
                  onRemove={removeAt}
                  busy={busyKey === "studio_images"}
                />

                <TagListEditor
                  id="videos"
                  label="影像連結"
                  values={profile.video_links}
                  placeholder="貼上 YouTube / Vimeo 連結，逗號分隔"
                  onChange={(v) => update({ video_links: v })}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <header>
                  <p className="eyebrow">Step 3 · Story</p>
                  <h2 className="font-display text-2xl text-foreground mt-1">
                    舞蹈理念、座右銘與深度介紹
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    這是你和島民最初的對話。
                  </p>
                </header>

                <div className="space-y-2">
                  <Label htmlFor="motto">座右銘 / 舞蹈理念</Label>
                  <Input
                    id="motto"
                    value={profile.motto}
                    maxLength={200}
                    placeholder="跳舞，是把世界重新感受一次。"
                    onChange={(e) => update({ motto: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dance_intro">100 字深度介紹</Label>
                  <Textarea
                    id="dance_intro"
                    value={profile.dance_intro}
                    maxLength={500}
                    rows={4}
                    placeholder="像跟新朋友自我介紹，把你最重要的舞蹈核心寫進這段文字。"
                    onChange={(e) => update({ dance_intro: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {profile.dance_intro.length} / 500
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">個人簡歷</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    maxLength={3000}
                    rows={8}
                    placeholder="從怎麼開始跳舞，到現在你想帶人看見的世界。"
                    onChange={(e) => update({ bio: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {profile.bio.length} / 3000
                  </p>
                </div>
              </div>
            )}
          </motion.section>
        </AnimatePresence>

        {/* Footer actions */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4" /> 上一步
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={saveDraft} disabled={saving}>
                <Save className="w-4 h-4" />
                {saving ? "儲存中…" : "儲存草稿"}
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep((s) => Math.min(3, s + 1))}>
                  下一步 <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="warm" size="lg" onClick={submitForReview} disabled={submitting}>
                  {submitting ? "送出中…" : "已完成內容，請為我刊登。"}
                </Button>
              )}
            </div>
          </div>

          {step === 3 && (
            <p className="text-xs text-muted-foreground text-center sm:text-right leading-relaxed">
              謝謝您的耐心完成，我們將在 48 小時內將您的專屬頁面優化與點亮通知。
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

interface ImageGridProps {
  title: string;
  hint: string;
  images: string[];
  field: "profile_images" | "studio_images";
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profile_images" | "studio_images" | "logo_url",
  ) => void;
  onRemove: (field: "profile_images" | "studio_images", idx: number) => void;
  busy: boolean;
}

function ImageGrid({ title, hint, images, field, onUpload, onRemove, busy }: ImageGridProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>{title}</Label>
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, idx) => (
            <figure
              key={url + idx}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border group shadow-sm"
            >
              <img src={url} alt="預覽圖片" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              <figcaption className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-background/85 backdrop-blur text-[10px] text-foreground/80 tracking-wide">
                4:3 預覽
              </figcaption>
              <button
                type="button"
                onClick={() => onRemove(field, idx)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:text-destructive"
                aria-label="移除圖片"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </figure>
          ))}
        </div>
      )}

      <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-border hover:bg-secondary/50 transition cursor-pointer text-sm">
        <Upload className="w-4 h-4" />
        {busy ? "上傳中…" : "新增照片（建議 4:3）"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onUpload(e, field)}
          disabled={busy}
        />
      </label>
    </div>
  );
}
