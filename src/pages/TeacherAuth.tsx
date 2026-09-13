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
import { lovable } from "@/integrations/lovable/index";

const credentialsSchema = z.object({
  email: z.string().trim().email({ message: "請輸入有效的 Email" }).max(255),
  password: z.string().min(8, { message: "密碼至少 8 個字元" }).max(72),
});

export default function TeacherAuth({ defaultMode = "signin" }: { defaultMode?: "signin" | "signup" }) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate("/teacher/dashboard", { replace: true });
  }, [session, navigate]);

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({ title: "無法使用 Google 登入", description: "請稍後再試，或改用 Email 註冊。", variant: "destructive" });
        return;
      }
      if (result.redirected) return;
      navigate("/teacher/dashboard", { replace: true });
    } finally {
      setBusy(false);
    }
  };

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
          <Link to="/" aria-label="舞島咖 DanceKha — 返回首頁" className="block text-center mb-10 cursor-pointer transition-opacity duration-300 hover:opacity-80">
            <span className="font-display text-3xl text-gradient">舞島咖 DanceKha</span>
            <p className="eyebrow mt-2">GUIDES' LOUNGE</p>
          </Link>

          <div className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl shadow-[#E63946]/5 p-8 md:p-10 border border-[#E63946]/10">
            <h1 className="font-display text-2xl text-foreground mb-2">
              {mode === "signin" ? "歡迎回來，引導者！" : "建立你的引導者檔案"}
            </h1>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              {mode === "signin"
                ? "謝謝您的進駐！願舞島咖能成為您自由揮灑創作、專注教學的溫暖樂土。"
                : "註冊後即可建立品牌專頁，由團隊為您刊登上線。"}
            </p>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="w-full h-12 rounded-full border border-border bg-white flex items-center justify-center gap-3 text-sm font-medium text-foreground shadow-sm hover:shadow-md hover:bg-muted/40 transition-all disabled:opacity-60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.55-5.17 3.55-8.87Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.09A12 12 0 0 0 12 24Z" />
                <path fill="#FBBC05" d="M5.27 14.29a7.21 7.21 0 0 1 0-4.58V6.62H1.26a12 12 0 0 0 0 10.76l4.01-3.09Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.18 15.23 0 12 0A12 12 0 0 0 1.26 6.62l4.01 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
              </svg>
              使用 Google 帳號快速{mode === "signin" ? "登入" : "註冊"}
            </button>

            <div className="flex items-center gap-3 my-6">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                或使用 Email 帳號{mode === "signin" ? "登入" : "註冊"}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

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
                {mode === "signin" && (
                  <div className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary hover:underline"
                    >
                      忘記密碼？
                    </Link>
                  </div>
                )}
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
                {mode === "signin" ? "註冊成為舞島咖的引導者" : "前往登入"}
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
