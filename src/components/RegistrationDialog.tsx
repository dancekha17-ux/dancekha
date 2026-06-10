import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "請輸入姓名").max(100, "姓名過長"),
  phone: z
    .string()
    .trim()
    .min(4, "請輸入有效電話")
    .max(30, "電話過長")
    .regex(/^[0-9+\-\s()]+$/, "電話僅可包含數字與 + - ( )"),
  note: z.string().max(500, "備註過長").optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
}

export function RegistrationDialog({ open, onOpenChange, eventId, eventTitle }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, phone, note });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("event_registrations").insert({
      event_id: eventId,
      user_id: auth.user?.id ?? null,
      name: parsed.data.name,
      phone: parsed.data.phone,
      note: parsed.data.note || null,
    });
    setLoading(false);
    if (error) {
      toast.error("報名失敗，請稍後再試");
      return;
    }
    toast.success("報名成功！我們將以電話與您聯繫。");
    setName(""); setPhone(""); setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">立即報名</DialogTitle>
          <DialogDescription>{eventTitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-name">姓名 *</Label>
            <Input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-phone">聯絡電話 *</Label>
            <Input id="reg-phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} required placeholder="0912-345-678" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-note">備註（選填）</Label>
            <Textarea id="reg-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={3} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              取消
            </Button>
            <Button type="submit" variant="hero" disabled={loading}>
              {loading ? "送出中..." : "送出報名"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
