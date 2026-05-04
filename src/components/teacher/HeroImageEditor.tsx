import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  userId: string;
  value: string | null;
  onChange: (url: string) => void;
}

export function HeroImageEditor({ userId, value, onChange }: Props) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "圖片過大", description: "請上傳 8MB 以內", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/hero-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("instructor-media")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("instructor-media").getPublicUrl(path);
      onChange(data.publicUrl);
      toast({ title: "封面已更新" });
    } catch (err: any) {
      toast({ title: "上傳失敗", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="relative aspect-[16/7] rounded-2xl overflow-hidden bg-secondary border border-border">
        {value ? (
          <img src={value} alt="hero" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            尚未上傳封面
          </div>
        )}
        <label className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/95 border border-border text-sm cursor-pointer hover:bg-background transition shadow-soft">
          <ImagePlus className="w-4 h-4" />
          {busy ? "上傳中…" : value ? "更換封面" : "上傳封面"}
          <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={busy} />
        </label>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        建議 16:7 寬版照片，捕捉你跳舞時最有故事感的一刻。
      </p>
    </div>
  );
}
