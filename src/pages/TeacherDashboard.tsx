import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Camera, Eye, LogOut, Save, CheckCircle2, Clock } from "lucide-react";
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

const profileSchema = z.object({
  name: z.string().trim().min(1, "請輸入姓名").max(100),
  name_en: z.string().trim().max(100).optional().or(z.literal("")),
  slug: z
    .string()
    .trim()
    .max(60)
    .regex(/^[a-z0-9-]*$/, { message: "網址代稱只能使用小寫字母、數字、連字號" })
    .optional()
    .or(z.literal("")),
  specialty: z.string().trim().max(120).optional().or(z.literal("")),
  region: z.string().trim().max(80).optional().or(z.literal("")),
  tagline: z.string().trim().max(160).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  culture_title: z.string().trim().max(120).optional().or(z.literal("")),
  culture_body: z.string().trim().max(3000).optional().or(z.literal("")),
  next_session: z.string().trim().max(120).optional().or(z.literal("")),
  price_from: z.string().trim().max(80).optional().or(z.literal("")),
  instagram_url: z.string().trim().url("請輸入完整網址").max(255).optional().or(z.literal("")),
  youtube_url: z.string().trim().url("請輸入完整網址").max(255).optional().or(z.literal("")),
  website_url: z.string().trim().url("請輸入完整網址").max(255).optional().or(z.literal("")),
});

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
  culture_title: string;
  culture_body: string;
  credentials: string[];
  languages: string[];
  next_session: string;
  price_from: string;
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
        setProfile({
          ...d,
          tagline: d.tagline ?? "",
          culture_title: d.culture_title ?? "",
          culture_body: d.culture_body ?? "",
          credentials: d.credentials ?? [],
          languages: d.languages ?? [],
          next_session: d.next_session ?? "",
          price_from: d.price_from ?? "",
          hero_image_url: d.hero_image_url ?? null,
        });
      }
      setLoading(false);
    })();
  }, [user, toast]);

  const update = (patch: Partial<Profile>) =>
    setProfile((p) => (p ? { ...p, ...patch } : p));

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
      update({ avatar_url: data.publicUrl });
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
    update({ hero_image_url: url });
    await (supabase as any)
      .from("teacher_profiles")
      .update({ hero_image_url: url })
      .eq("user_id", user.id);
  };

  const handleSave = async () => {
    if (!profile || !user) return;
    const parsed = profileSchema.safeParse({
      name: profile.name,
      name_en: profile.name_en,
      slug: profile.slug ?? "",
      specialty: profile.specialty,
      region: profile.region,
      tagline: profile.tagline,
      bio: profile.bio,
      culture_title: profile.culture_title,
      culture_body: profile.culture_body,
      next_session: profile.next_session,
      price_from: profile.price_from,
      instagram_url: profile.instagram_url ?? "",
      youtube_url: profile.youtube_url ?? "",
      website_url: profile.website_url ?? "",
    });
    if (!parsed.success) {
      toast({
        title: "請檢查欄位",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
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
        culture_title: profile.culture_title.trim(),
        culture_body: profile.culture_body.trim(),
        next_session: profile.next_session.trim(),
        price_from: profile.price_from.trim(),
        credentials: profile.credentials,
        languages: profile.languages,
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5E6" }}>
      <header className="border-b border-[#E63946]/10 bg-[#FFF5E6]/90 backdrop-blur sticky top-0 z-40">
        <div className="container-wide mx-auto h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-baseline gap-2 min-w-0">
            <span className="font-display text-xl text-gradient truncate">舞島咖 DanceKha</span>
            <span className="eyebrow hidden sm:inline">Leaders' Studio</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "#identity", label: "個人檔案" },
              { href: "#courses", label: "課程管理" },
              { href: "#media", label: "學員互動" },
              { href: "#booking", label: "活動行事曆" },
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
        {/* Mobile module quick-nav */}
        <div className="md:hidden border-t border-[#E63946]/10 px-4 py-2 flex gap-2 overflow-x-auto">
          {[
            { href: "#identity", label: "個人檔案" },
            { href: "#courses", label: "課程管理" },
            { href: "#media", label: "學員互動" },
            { href: "#booking", label: "活動行事曆" },
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

      <main className="container-wide mx-auto py-10 md:py-16 max-w-3xl px-4">
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
                <p className="mt-0.5">把故事寫得更完整，團隊會盡快為你上線。</p>
              </>
            )}
          </div>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { href: "#identity", label: "個人檔案", desc: "你的舞蹈名片" },
            { href: "#courses", label: "課程管理", desc: "編排與排期" },
            { href: "#media", label: "學員互動", desc: "影像與訊息" },
            { href: "#booking", label: "活動行事曆", desc: "下一次相遇" },
          ].map((m) => (
            <a
              key={m.href}
              href={m.href}
              className="group rounded-2xl bg-white border border-[#E63946]/10 p-4 shadow-sm hover:shadow-md hover:border-[#E63946]/30 transition-all"
            >
              <p className="font-display text-base text-foreground group-hover:text-[#E63946] transition-colors">
                {m.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
            </a>
          ))}
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
                <Label htmlFor="name">姓名 *</Label>
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
              <Label htmlFor="slug">網址代稱</Label>
              <Input
                id="slug"
                value={profile.slug ?? ""}
                maxLength={60}
                placeholder="yachi-lin"
                onChange={(e) => update({ slug: e.target.value.toLowerCase() })}
              />
              <p className="text-xs text-muted-foreground">
                /instructors/{profile.slug || "your-name"}
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
                <Label htmlFor="region">地區</Label>
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
              <Label htmlFor="tagline">一句話介紹</Label>
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

        {/* Cultural story */}
        <SectionCard
          eyebrow="Culture"
          title="文化故事"
          description="這支舞從哪裡來？為什麼值得被認識。"
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="culture_title">故事標題</Label>
              <Input
                id="culture_title"
                value={profile.culture_title}
                maxLength={120}
                placeholder="例：Horo · 用 7/8 拍把村子串成一條鏈"
                onChange={(e) => update({ culture_title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="culture_body">故事內容</Label>
              <Textarea
                id="culture_body"
                value={profile.culture_body}
                maxLength={3000}
                rows={6}
                placeholder="說一段這個舞種的歷史、它在你心中的意義。"
                onChange={(e) => update({ culture_body: e.target.value })}
              />
            </div>
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
              label="舞蹈風格"
              values={profile.dance_styles}
              placeholder="現代舞, 即興, Contact Improv"
              hint="以逗號分隔"
              onChange={(v) => update({ dance_styles: v })}
            />
            <TagListEditor
              id="creds"
              label="經歷與獎項"
              values={profile.credentials}
              placeholder="雲門舞集巡演編舞助理, 2021 台新藝術獎入圍"
              hint="一條一條的小故事，比履歷更動人"
              pillTone="soul"
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

        {/* Booking hints */}
        <SectionCard
          eyebrow="Booking"
          title="預約資訊"
          description="讓有興趣的學員知道下一步怎麼走。"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="next_session">最近開課</Label>
              <Input
                id="next_session"
                value={profile.next_session}
                maxLength={120}
                placeholder="週三 19:30 · 週六 14:00"
                onChange={(e) => update({ next_session: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_from">起跳價格</Label>
              <Input
                id="price_from"
                value={profile.price_from}
                maxLength={80}
                placeholder="NT$ 1,200 / 堂"
                onChange={(e) => update({ price_from: e.target.value })}
              />
            </div>
          </div>
        </SectionCard>

        {/* Courses */}
        <SectionCard
          eyebrow="Courses"
          title="課程"
          description="每一堂課都是一個邀請。"
        >
          <CoursesEditor teacherId={profile.id} />
        </SectionCard>

        {/* Media */}
        <SectionCard
          eyebrow="Media"
          title="影像作品集"
          description="照片、影片，能勝過千字介紹。"
        >
          <MediaEditor teacherId={profile.id} userId={user!.id} />
        </SectionCard>

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

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pb-16">
          <Button asChild variant="outline" size="lg">
            <Link to="/teacher/preview">
              <Eye className="w-4 h-4" /> 預覽頁面
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="hero" size="lg">
            <Save className="w-4 h-4" /> {saving ? "儲存中…" : "儲存變更"}
          </Button>
        </div>
      </main>
    </div>
  );
}
