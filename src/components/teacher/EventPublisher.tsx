import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const eventSchema = z.object({
  title: z.string().trim().min(1, "請輸入名稱").max(160),
  kind: z.enum(["course", "event"]),
  starts_at: z.string().optional(),
  location: z.string().trim().max(160).optional(),
  fee: z.string().trim().max(60).optional(),
  total_spots: z.string().regex(/^\d*$/, "請輸入數字").optional(),
  audience: z.string().trim().max(80).optional(),
  description: z.string().trim().max(2000).optional(),
});

interface EventLite {
  id: string;
  title: string;
  kind: string;
  starts_at: string | null;
  fee: string | null;
  spots_left: number | null;
  total_spots: number | null;
}

interface Props {
  userId: string;
  instructorName: string;
  agreementSigned?: boolean;
  onRequestAgreement?: () => void;
}

export interface EventPublisherHandle {
  openPublisher: () => void;
}

export const EventPublisher = forwardRef<EventPublisherHandle, Props>(function EventPublisher(
  { userId, instructorName, agreementSigned = true, onRequestAgreement },
  ref,
) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<EventLite[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    kind: "course" as "course" | "event",
    starts_at: "",
    location: "",
    fee: "",
    total_spots: "",
    audience: "",
    description: "",
  });

  const load = async () => {
    const { data } = await supabase
      .from("events")
      .select("id,title,kind,starts_at,fee,spots_left,total_spots")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });
    setList((data ?? []) as EventLite[]);
  };

  useEffect(() => {
    load();
  }, [userId]);

  const handleSubmit = async () => {
    const parsed = eventSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "請檢查欄位",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const total = form.total_spots ? Number(form.total_spots) : null;
    const tags = form.audience ? [form.audience] : [];
    const { error } = await supabase.from("events").insert({
      title: form.title.trim(),
      kind: form.kind,
      starts_at: form.starts_at || null,
      location: form.location.trim() || null,
      fee: form.fee.trim() || null,
      total_spots: total,
      spots_left: total,
      tags,
      category: form.audience || null,
      instructor: instructorName || null,
      description: form.description.trim() || null,
      is_published: true,
      created_by: userId,
    });
    setSaving(false);
    if (error) {
      toast({ title: "刊登失敗", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "已刊登", description: "課程已上架到首頁。" });
    setOpen(false);
    setForm({
      title: "",
      kind: "course",
      starts_at: "",
      location: "",
      fee: "",
      total_spots: "",
      audience: "",
      description: "",
    });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      toast({ title: "刪除失敗", description: error.message, variant: "destructive" });
      return;
    }
    setList((xs) => xs.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-5">
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          還沒有刊登任何課程。點下方按鈕，把你的第一堂課放上首頁。
        </p>
      ) : (
        <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-background/40">
          {list.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {e.title}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {e.kind === "course" ? "課程" : "活動"}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {e.starts_at
                    ? new Date(e.starts_at).toLocaleString("zh-TW", {
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "時間待定"}
                  {e.fee ? ` · ${e.fee}` : ""}
                  {e.total_spots ? ` · 名額 ${e.spots_left ?? e.total_spots}/${e.total_spots}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/events/${e.id}`}>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(e.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          size="lg"
          className="w-full text-white hover:opacity-90"
          style={{ backgroundColor: "#E63946" }}
          onClick={() => {
            if (!agreementSigned) {
              onRequestAgreement?.();
              return;
            }
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> 刊登新課程 / 活動
        </Button>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">刊登新課程 / 活動</DialogTitle>
            <DialogDescription>
              送出後將即時顯示在首頁「課程探索」或「活動行事曆」。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>類型</Label>
                <Select
                  value={form.kind}
                  onValueChange={(v) => setForm({ ...form, kind: v as "course" | "event" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">課程</SelectItem>
                    <SelectItem value="event">活動</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>適合對象</Label>
                <Input
                  value={form.audience}
                  placeholder="零基礎 / 進階"
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>名稱 *</Label>
              <Input
                value={form.title}
                maxLength={160}
                placeholder="例：佛朗明哥即興夜"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>日期時間</Label>
                <Input
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>地點</Label>
                <Input
                  value={form.location}
                  placeholder="台北・小島舞場"
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>費用</Label>
                <Input
                  value={form.fee}
                  placeholder="NT$ 800"
                  onChange={(e) => setForm({ ...form, fee: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>總名額</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.total_spots}
                  placeholder="20"
                  onChange={(e) => setForm({ ...form, total_spots: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>課程介紹</Label>
              <Textarea
                rows={4}
                value={form.description}
                maxLength={2000}
                placeholder="這堂課的故事與內容。"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="text-white hover:opacity-90"
              style={{ backgroundColor: "#E63946" }}
            >
              {saving ? "刊登中…" : "確認刊登"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
