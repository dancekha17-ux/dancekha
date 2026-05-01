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
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  dance_styles: z.string().max(500).optional().or(z.literal("")),
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
      } else {
        setProfile(data as Profile);
      }
      setLoading(false);
    })();
  }, [user, toast]);

  const update = (patch: Partial<Profile>) => setProfile((p) => (p ? { ...p, ...patch } : p));

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
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      update({ avatar_url: data.publicUrl });
      // also persist immediately
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

  const handleSave = async () => {
    if (!profile || !user) return;

    const stylesString = profile.dance_styles.join(", ");
    const parsed = profileSchema.safeParse({
      name: profile.name,
      name_en: profile.name_en,
      slug: profile.slug ?? "",
      specialty: profile.specialty,
      region: profile.region,
      bio: profile.bio,
      dance_styles: stylesString,
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
    const { error } = await supabase
      .from("teacher_profiles")
      .update({
        name: profile.name.trim(),
        name_en: profile.name_en.trim(),
        slug: profile.slug?.trim() || null,
        specialty: profile.specialty.trim(),
        region: profile.region.trim(),
        bio: profile.bio.trim(),
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
      toast({ title: "已儲存", description: "你的檔案已更新" });
    }
  };

  if (authLoading || loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">載入中…</p>
      </div>
    );
  }

  const stylesText = profile.dance_styles.join(", ");

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="container-wide mx-auto h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-xl text-gradient">舞島咖</span>
            <span className="eyebrow">Creator Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/teacher/preview">
                <Eye className="w-4 h-4" /> 預覽
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4" /> 登出
            </Button>
          </div>
        </div>
      </header>

      <main className="container-wide mx-auto py-10 md:py-16 max-w-3xl">
        {/* Status banner */}
        <div
          className={`flex items-start gap-3 p-4 rounded-2xl mb-10 border ${
            profile.is_approved
              ? "bg-success/5 border-success/30 text-success"
              : "bg-secondary/60 border-border text-muted-foreground"
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
                <p className="font-medium">你的檔案已上線</p>
                <p className="text-foreground/70 mt-0.5">學員可以在公開頁面上找到你。</p>
              </>
            ) : (
              <>
                <p className="font-medium text-foreground">待審核中</p>
                <p className="mt-0.5">完善資料後，團隊會盡快為你上線公開頁面。</p>
              </>
            )}
          </div>
        </div>

        <div className="mb-10">
          <span className="eyebrow">Your Profile</span>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mt-3">
            編輯<span className="text-accent-italic">個人檔案</span>
          </h1>
        </div>

        {/* Avatar */}
        <section className="mb-12">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-secondary ring-2 ring-border">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-muted-foreground font-display">
                  {profile.name?.[0] ?? "?"}
                </div>
              )}
            </div>
            <div>
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
              <p className="text-xs text-muted-foreground mt-2">建議方形圖片，5MB 以內</p>
            </div>
          </div>
        </section>

        {/* Basic info */}
        <section className="space-y-6 mb-12">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input id="name" value={profile.name} maxLength={100}
                onChange={(e) => update({ name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_en">英文名</Label>
              <Input id="name_en" value={profile.name_en} maxLength={100}
                onChange={(e) => update({ name_en: e.target.value })} />
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
              將出現在 /instructors/{profile.slug || "your-name"}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="specialty">專長</Label>
              <Input id="specialty" value={profile.specialty} maxLength={120}
                placeholder="現代舞 / 即興"
                onChange={(e) => update({ specialty: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">地區</Label>
              <Input id="region" value={profile.region} maxLength={80}
                placeholder="亞洲・台灣"
                onChange={(e) => update({ region: e.target.value })} />
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="space-y-3 mb-12">
          <Label htmlFor="bio">個人簡介</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            maxLength={2000}
            rows={6}
            placeholder="分享你的舞蹈旅程、教學理念與最想傳遞的文化。"
            onChange={(e) => update({ bio: e.target.value })}
          />
          <p className="text-xs text-muted-foreground text-right">{profile.bio.length} / 2000</p>
        </section>

        {/* Styles */}
        <section className="space-y-3 mb-12">
          <Label htmlFor="styles">舞蹈風格（以逗號分隔）</Label>
          <Input
            id="styles"
            value={stylesText}
            placeholder="現代舞, 即興, Contact Improv"
            onChange={(e) =>
              update({
                dance_styles: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
          {profile.dance_styles.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.dance_styles.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                  {s}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Social */}
        <section className="space-y-5 mb-12">
          <h2 className="font-display text-lg text-foreground">社群連結</h2>
          <div className="space-y-2">
            <Label htmlFor="ig">Instagram</Label>
            <Input id="ig" type="url" value={profile.instagram_url ?? ""} maxLength={255}
              placeholder="https://instagram.com/your-handle"
              onChange={(e) => update({ instagram_url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yt">YouTube</Label>
            <Input id="yt" type="url" value={profile.youtube_url ?? ""} maxLength={255}
              placeholder="https://youtube.com/@your-channel"
              onChange={(e) => update({ youtube_url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="web">個人網站</Label>
            <Input id="web" type="url" value={profile.website_url ?? ""} maxLength={255}
              placeholder="https://your-site.com"
              onChange={(e) => update({ website_url: e.target.value })} />
          </div>
        </section>

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
