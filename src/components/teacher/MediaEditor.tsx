import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MediaRow {
  id: string;
  teacher_id: string;
  kind: "image" | "video_embed";
  url: string;
  caption: string;
  sort_order: number;
}

interface Props {
  teacherId: string;
  userId: string;
}

export function MediaEditor({ teacherId, userId }: Props) {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaRow[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("instructor_media")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("sort_order", { ascending: true });
      setItems((data as MediaRow[]) ?? []);
    })();
  }, [teacherId]);

  const addRow = async (row: Partial<MediaRow>) => {
    const { data, error } = await (supabase as any)
      .from("instructor_media")
      .insert({ teacher_id: teacherId, sort_order: items.length, ...row })
      .select()
      .single();
    if (error) {
      toast({ title: "新增失敗", description: error.message, variant: "destructive" });
      return;
    }
    setItems((s) => [...s, data as MediaRow]);
  };

  const remove = async (id: string) => {
    await (supabase as any).from("instructor_media").delete().eq("id", id);
    setItems((s) => s.filter((x) => x.id !== id));
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "圖片過大", description: "請上傳 8MB 以內", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/gallery-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("instructor-media")
        .upload(path, file, { contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("instructor-media").getPublicUrl(path);
      await addRow({ kind: "image", url: data.publicUrl });
    } catch (err: any) {
      toast({ title: "上傳失敗", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((m) => (
            <div
              key={m.id}
              className="relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border group"
            >
              {m.kind === "image" ? (
                <img src={m.url} alt={m.caption} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-3 text-center break-all">
                  🎬 {m.url}
                </div>
              )}
              <button
                onClick={() => remove(m.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-border hover:bg-secondary/50 transition cursor-pointer text-sm">
        <Upload className="w-4 h-4" />
        {busy ? "上傳中…" : "⬆️ 上傳照片"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadImage}
          disabled={busy}
        />
      </label>
    </div>
  );
}

