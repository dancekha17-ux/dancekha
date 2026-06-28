import { useEffect, useState } from "react";
import { Pencil, BookHeart, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { HeroImageEditor } from "@/components/teacher/HeroImageEditor";
import { MediaEditor } from "@/components/teacher/MediaEditor";

interface ProfileLike {
  id: string;
  bio: string;
  hero_image_url: string | null;
}

interface Props {
  userId: string;
  profile: ProfileLike;
  updateBio: (val: string) => void;
  onHeroChange: (url: string) => void;
}

export function StoryMomentsCard({ userId, profile, updateBio, onHeroChange }: Props) {
  const [open, setOpen] = useState(false);
  const [moments, setMoments] = useState<
    Array<{ id: string; url: string; scale: number; offset_x: number; offset_y: number }>
  >([]);

  // Refresh moments preview whenever the modal closes (in case images were added/removed)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any)
        .from("instructor_media")
        .select("id,url,scale,offset_x,offset_y,sort_order")
        .eq("teacher_id", profile.id)
        .order("sort_order", { ascending: true });
      if (!cancelled) {
        setMoments(
          ((data as any[]) ?? []).map((r) => ({
            id: r.id,
            url: r.url,
            scale: r.scale ?? 1,
            offset_x: r.offset_x ?? 0,
            offset_y: r.offset_y ?? 0,
          })),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile.id, open]);

  return (
    <section
      id="story"
      className="rounded-3xl bg-card/60 border border-border/60 p-6 md:p-8 mb-6 shadow-soft scroll-mt-24"
    >
      <header className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E63946]/10 text-[#E63946] flex items-center justify-center">
            <BookHeart className="w-5 h-5" />
          </div>
          <div>
            <span className="eyebrow">STORY · 舞蹈畫面</span>
            <h2 className="font-display text-xl md:text-2xl text-foreground mt-1">
              精彩瞬間
            </h2>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Pencil className="w-3.5 h-3.5" /> 編輯內容
        </Button>
      </header>

      {/* Preview */}
      <div className="space-y-6">
        <div className="relative aspect-[16/7] rounded-2xl overflow-hidden bg-secondary border border-border/60">
          {profile.hero_image_url ? (
            <img
              src={profile.hero_image_url}
              alt="封面"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <ImageIcon className="w-6 h-6" />
              <span className="text-sm">尚未上傳封面影像</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white/70 border border-border/40 p-5 md:p-6">
          {profile.bio?.trim() ? (
            <p className="font-body text-foreground/85 leading-loose whitespace-pre-wrap">
              {profile.bio}
            </p>
          ) : (
            <p className="text-muted-foreground italic">
              還沒有舞蹈故事──分享你怎麼開始跳舞、團隊或品牌的初心。
            </p>
          )}
        </div>

        <div>
          <p className="eyebrow mb-3">跳舞畫面／教室環境</p>
          {moments.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
              {moments.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border/60 bg-secondary"
                >
                  <img
                    src={m.url}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(${m.offset_x}px, ${m.offset_y}px) scale(${m.scale})`,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              還沒有課堂照片──精選 1~4 張真實的課堂瞬間或教室氛圍，最能打動學員。
            </p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">精彩瞬間</DialogTitle>
            <DialogDescription>
              封面影像、舞蹈畫面與精彩瞬間，三個層次一次完成。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 pt-2">
            <div>
              <Label className="mb-3 block">
                封面影像 · Cover
                <span className="block text-xs text-muted-foreground font-normal mt-1">
                  第一眼會被記住的畫面。
                </span>
              </Label>
              <HeroImageEditor
                userId={userId}
                value={profile.hero_image_url}
                onChange={onHeroChange}
              />
            </div>

            <div>
              <Label htmlFor="bio" className="mb-3 block">
                關於我／團隊 · Story
                <span className="block text-xs text-muted-foreground font-normal mt-1">
                  像跟新朋友聊天一樣，分享你怎麼開始跳舞／介紹團隊或品牌。
                </span>
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                maxLength={2000}
                rows={6}
                placeholder="我叫 ___，跳的是 ___。讓我帶你走進這個世界。"
                onChange={(e) => updateBio(e.target.value)}
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {profile.bio.length} / 2000
              </p>
            </div>

            <div>
              <Label className="mb-3 block">
                舞蹈畫面／教室環境 · Moments
                <span className="block text-xs text-muted-foreground font-normal mt-1">
                  精選 1~4 張真實的課堂照片／環境氛圍，最能打動學員！
                </span>
              </Label>
              <MediaEditor teacherId={profile.id} userId={userId} />
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
            記得回到上方點選「儲存變更」，文字內容才會永久保存。
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
