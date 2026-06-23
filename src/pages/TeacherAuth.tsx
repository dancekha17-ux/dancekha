import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PasswordInput, PasswordStrengthMeter, isPasswordStrong } from "@/components/ui/password-input";

const credentialsSchema = z.object({
  email: z.string().trim().email({ message: "請輸入有效的 Email" }).max(255),
  password: z.string().min(8, { message: "密碼至少 8 個字元" }).max(72),
});

export default function TeacherAuth() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate("/teacher/dashboard", { replace: true });
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast({ title: "請檢查輸入", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/teacher/dashboard`,
            data: { name },
          },
        });
        if (error) throw error;
        toast({ title: "歡迎加入舞島咖", description: "帳號已建立，正在進入後台…" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      const msg = err?.message?.includes("Invalid login")
        ? "Email 或密碼錯誤"
        : err?.message ?? "發生錯誤，請稍後再試";
      toast({ title: "無法繼續", description: msg, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body" style={{ backgroundColor: "#FFF5E6" }}>
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="block text-center mb-10">
            <span className="font-display text-3xl text-gradient">舞島咖 DanceKha</span>
            <p className="eyebrow mt-2">Leaders' Studio</p>
          </Link>

          <div className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl shadow-[#E63946]/5 p-8 md:p-10 border border-[#E63946]/10">
            <h1 className="font-display text-2xl text-foreground mb-2">
              {mode === "signin" ? "歡迎回來，引導者！" : "建立你的引導者檔案"}
            </h1>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              {mode === "signin"
                ? "謝謝您的進駐！願舞島咖能成為您自由揮灑創作、專注教學的溫暖樂土。"
                : "註冊後即可建立引導者頁面，由團隊檢視完整度後上線。"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    placeholder="例：林雅琪"
                  />
                </div>
              )}
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
              <div className="space-y-2">
                <Label htmlFor="password">密碼</Label>
                <PasswordInput
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 8 個字元"
                />
                {mode === "signup" && <PasswordStrengthMeter value={password} />}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full text-white hover:opacity-90"
                style={{ backgroundColor: "#E63946" }}
                disabled={busy || (mode === "signup" && !isPasswordStrong(password))}
              >
                {busy ? "處理中…" : mode === "signin" ? "登入引導者專區" : "成為引導者，啟動舞蹈冒險"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "還沒有帳號？" : "已經有帳號？"}{" "}
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-primary hover:underline font-medium"
              >
                {mode === "signin" ? "註冊成為舞島的引導者" : "前往登入"}
              </button>
            </div>
          </div>

          <Link
            to="/"
            className="block text-center text-xs text-muted-foreground mt-8 hover:text-foreground"
          >
            ← 回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
