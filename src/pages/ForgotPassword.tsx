import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().trim().email({ message: "請輸入有效的 Email" }).max(255),
});

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast({ title: "請檢查輸入", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
    } catch {
      // 安全邏輯：忽略錯誤訊息，一律呈現相同回覆
    } finally {
      setBusy(false);
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body" style={{ backgroundColor: "#FFF5E6" }}>
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="block text-center mb-10">
            <span className="font-display text-3xl text-gradient">舞島咖 DanceKha</span>
            <p className="eyebrow mt-2">GUIDES' LOUNGE</p>
          </Link>

          <div className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl shadow-[#E63946]/5 p-8 md:p-10 border border-[#E63946]/10">
            <h1 className="font-display text-2xl text-foreground mb-2">找回探索地圖的鑰匙</h1>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              請輸入您註冊時使用的 Email，我們將寄送一封重設密碼的引導信。
            </p>

            {sent ? (
              <div className="space-y-6">
                <div className="rounded-2xl bg-[#FFF5E6] border border-[#E63946]/10 p-5 text-sm leading-relaxed text-foreground">
                  若該帳號存在，系統已發送重設連結至您的信箱。請至信箱（含垃圾郵件夾）查收『舞島咖 DanceKha ｜協助您找回探索地圖的鑰匙』。
                </div>
                <Link to="/teacher/login" className="block text-center text-sm text-primary hover:underline">
                  ← 返回登入
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-white hover:opacity-90"
                  style={{ backgroundColor: "#E63946" }}
                  disabled={busy}
                >
                  {busy ? "寄送中…" : "發送重設郵件"}
                </Button>
                <div className="text-center text-sm">
                  <Link to="/teacher/login" className="text-muted-foreground hover:text-foreground">
                    ← 返回登入
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
