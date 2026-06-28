import { useState } from "react";
import {
  Pencil,
  UserCircle2,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Youtube,
  Globe,
  Languages,
  Award,
  Camera,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TagListEditor } from "@/components/teacher/TagListEditor";
import { ExperienceEditor } from "@/components/teacher/ExperienceEditor";

interface ProfileLike {
  id: string;
  user_id: string;
  slug: string | null;
  name: string;
  name_en: string;
  specialty: string;
  region: string;
  tagline: string;
  avatar_url: string | null;
  credentials: string[];
  languages: string[];
  dance_styles: string[];
  instagram_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

interface Props {
  userId: string;
  profile: ProfileLike;
  update: (patch: Partial<ProfileLike>) => void;
}

export function ProfileSummaryCard({ userId, profile, update }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "圖片過大", description: "請上傳 5MB 以內的圖片", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      update({ avatar_url: data.publicUrl });
      await supabase
        .from("teacher_profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("user_id", userId);
      toast({ title: "頭像已更新" });
    } catch (err: any) {
      toast({ title: "上傳失敗", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const socials = [
    { url: profile.instagram_url, Icon: Instagram, label: "Instagram" },
    { url: profile.youtube_url, Icon: Youtube, label: "YouTube" },
    { url: profile.website_url, Icon: Globe, label: "個人網站" },
  ].filter((s) => !!s.url);

  return (
    <section
      id="identity"
      className="rounded-3xl bg-card/60 border border-border/60 p-6 md:p-8 mb-6 shadow-soft scroll-mt-24"
    >
      <header className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E89B5C]/15 text-[#B25C2E] flex items-center justify-center">
            <UserCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="eyebrow">Profile · 引導者名片</span>
            <h2 className="font-display text-xl md:text-2xl text-foreground mt-1">
              大師與團退
            </h2>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="shrink-0"
        >
          <Pencil className="w-3.5 h-3.5" /> 編輯資料
        </Button>
      </header>

      {/* Preview */}
      <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-secondary ring-2 ring-border shrink-0">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-muted-foreground font-display">
              {profile.name?.[0] ?? "?"}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-4">
          <div>
            <h3 className="font-display text-2xl text-foreground leading-tight">
              {profile.name || <span className="text-muted-foreground">尚未填寫姓名</span>}
              {profile.name_en && (
                <span className="text-base text-muted-foreground font-body ml-2">
                  · {profile.name_en}
                </span>
              )}
            </h3>
            {profile.tagline ? (
              <p className="text-foreground/75 mt-1.5 leading-relaxed">{profile.tagline}</p>
            ) : (
              <p className="text-muted-foreground italic mt-1.5">尚未填寫一句話介紹</p>
            )}
            {profile.region && (
              <p className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <MapPin className="w-3.5 h-3.5" /> {profile.region}
              </p>
            )}
          </div>

          {profile.dance_styles?.filter(Boolean).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.dance_styles.filter(Boolean).map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full text-xs bg-[#E89B5C]/15 text-[#B25C2E]"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {profile.credentials?.filter(Boolean).length > 0 && (
            <ul className="space-y-1.5">
              {profile.credentials.filter(Boolean).slice(0, 3).map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground/80"
                >
                  <Award className="w-3.5 h-3.5 text-[#E89B5C] mt-1 shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}

          {profile.languages?.filter(Boolean).length > 0 && (
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Languages className="w-3.5 h-3.5" />
              {profile.languages.filter(Boolean).join(" · ")}
            </p>
          )}

          {(profile.contact_email || profile.contact_phone || socials.length > 0) && (
            <div className="pt-3 border-t border-border/40 flex flex-wrap gap-x-4 gap-y-2 items-center text-xs text-muted-foreground">
              {profile.contact_email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {profile.contact_email}
                </span>
              )}
              {profile.contact_phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {profile.contact_phone}
                </span>
              )}
              {socials.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary hover:bg-[#E89B5C]/20 text-foreground/70 hover:text-[#B25C2E] transition"
                  aria-label={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">填寫基本資訊</DialogTitle>
            <DialogDescription>
              基本身份、舞蹈風格與聯絡資訊，整合於同一處編輯。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* Avatar */}
            <div className="flex items-center gap-5">
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

            {/* Identity */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  姓名 <span className="text-[#E89B5C]">*</span>
                </Label>
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
              <Label htmlFor="slug">
                個人專屬網址設定 <span className="text-[#E89B5C]">*</span>
              </Label>
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
                預覽：dancekha.lovable.app/instructors/{profile.slug || "your-name"}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
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
                <Label htmlFor="region">
                  地區 <span className="text-[#E89B5C]">*</span>
                </Label>
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
              <Label htmlFor="tagline">
                一句話介紹 <span className="text-[#E89B5C]">*</span>
              </Label>
              <Input
                id="tagline"
                value={profile.tagline}
                maxLength={160}
                placeholder="用一句話讓人記住你跳舞的樣子。"
                onChange={(e) => update({ tagline: e.target.value })}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-border/60 pt-5 space-y-5">
              <TagListEditor
                id="styles"
                label={
                  <>
                    舞蹈風格／專長 <span className="text-[#E89B5C]">*</span>
                  </>
                }
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

            {/* Connect */}
            <div className="border-t border-border/60 pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">
                    聯絡 Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={profile.contact_email ?? ""}
                    maxLength={255}
                    placeholder="you@example.com"
                    onChange={(e) => update({ contact_email: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">送審時必填，舞島咖團隊將以此聯繫您。</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">
                    聯絡電話 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={profile.contact_phone ?? ""}
                    maxLength={40}
                    placeholder="例：0912-345-678"
                    onChange={(e) => update({ contact_phone: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">僅平台管理員可見，不會公開顯示。</p>
                </div>
              </div>
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
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              關閉
            </Button>
            <Button
              onClick={() => setOpen(false)}
              className="text-white"
              style={{ backgroundColor: "#E63946" }}
            >
              完成編輯
            </Button>
          </DialogFooter>
          <p className="text-[11px] text-muted-foreground text-center -mt-2">
            記得回到上方點選「儲存變更」，所有調整才會永久保存。
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
