import { useEffect, useRef, useState } from "react";
import { Trash2, Upload, Move } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

export interface MediaRow {
  id: string;
  teacher_id: string;
  kind: "image" | "video_embed";
  url: string;
  caption: string;
  sort_order: number;
  scale: number;
  offset_x: number;
  offset_y: number;
}

interface Props {
  teacherId: string;
  userId: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;

function CropCard({
  item,
  onChange,
  onRemove,
}: {
  item: MediaRow;
  onChange: (patch: Partial<MediaRow>) => void;
  onRemove: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  const clampOffsets = (scale: number, x: number, y: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const w = el.clientWidth;
    const h = el.clientHeight;
    // Limit pan so image edges don't reveal background
    const maxX = (w * (scale - 1)) / 2;
    const maxY = (h * (scale - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (item.scale <= 1) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = {
      startX: e.clientX,
      startY: e.clientY,
      ox: item.offset_x,
      oy: item.offset_y,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragging.current.startX;
    const dy = e.clientY - dragging.current.startY;
    const { x, y } = clampOffsets(item.scale, dragging.current.ox + dx, dragging.current.oy + dy);
    onChange({ offset_x: x, offset_y: y });
  };
  const onPointerUp = () => {
    dragging.current = null;
  };

  const onScaleChange = (val: number) => {
    const { x, y } = clampOffsets(val, item.offset_x, item.offset_y);
    onChange({ scale: val, offset_x: x, offset_y: y });
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-border bg-secondary group">
      <div
        ref={containerRef}
        className="relative aspect-square overflow-hidden touch-none select-none"
        style={{ cursor: item.scale > 1 ? "grab" : "default" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={item.url}
          alt={item.caption}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{
            transform: `translate(${item.offset_x}px, ${item.offset_y}px) scale(${item.scale})`,
            transformOrigin: "center center",
          }}
        />
        {item.scale > 1 && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] text-muted-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <Move className="w-3 h-3" /> 拖曳移動
          </div>
        )}
        <button
          onClick={onRemove}
          aria-label="刪除照片"
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="px-3 py-2.5 bg-white/70 border-t border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-8 shrink-0">縮放</span>
          <Slider
            value={[item.scale]}
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={0.05}
            onValueChange={(v) => onScaleChange(v[0])}
            className="flex-1"
          />
          <span className="text-[10px] text-muted-foreground tabular-nums w-10 text-right">
            {item.scale.toFixed(2)}×
          </span>
        </div>
      </div>
    </div>
  );
}

export function MediaEditor({ teacherId, userId }: Props) {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaRow[]>([]);
  const [busy, setBusy] = useState(false);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("instructor_media")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("sort_order", { ascending: true });
      const rows = ((data as any[]) ?? []).map((r) => ({
        scale: 1,
        offset_x: 0,
        offset_y: 0,
        ...r,
      })) as MediaRow[];
      setItems(rows);
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

  const patchItem = (id: string, patch: Partial<MediaRow>) => {
    setItems((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    if (saveTimers.current[id]) clearTimeout(saveTimers.current[id]);
    saveTimers.current[id] = setTimeout(async () => {
      await (supabase as any).from("instructor_media").update(patch).eq("id", id);
    }, 350);
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (items.length >= 4) {
      toast({ title: "已達上限", description: "課堂精彩瞬間最多上傳 4 張照片", variant: "destructive" });
      e.target.value = "";
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast({ title: "圖片過大", description: "請上傳 15MB 以內", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const webpBlob = await compressToWebp(file, 1600, 0.85);
      const path = `${userId}/gallery-${Date.now()}.webp`;
      const { error } = await supabase.storage
        .from("instructor-media")
        .upload(path, webpBlob, { contentType: "image/webp", cacheControl: "31536000" });
      if (error) throw error;
      const { data } = supabase.storage.from("instructor-media").getPublicUrl(path);
      await addRow({ kind: "image", url: data.publicUrl, scale: 1, offset_x: 0, offset_y: 0 });
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((m) => (
            <CropCard
              key={m.id}
              item={m}
              onChange={(patch) => patchItem(m.id, patch)}
              onRemove={() => remove(m.id)}
            />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <p className="text-xs text-muted-foreground -mt-2">
          ✨ 上傳後可拖曳調整位置、用滑桿縮放，找到最動人的構圖。
        </p>
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
