import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  PasswordInput,
  PasswordStrengthMeter,
  isPasswordStrong,
} from "@/components/ui/password-input";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supabase 重設密碼連結可能以三種形式回傳：
  //   1. PKCE: ?code=...
  //   2. 新版 magic-link: ?token_hash=...&type=recovery
  //   3. 舊版 implicit: #access_token=...&refresh_token=...&type=recovery
  // 我們依序嘗試三種解析，任何一種成功即建立 recovery session。
  useEffect(() => {
    let cancelled = false;

    const markReady = () => {
      if (!cancelled) setReady(true);
    };

    const fail = (msg: string) => {
      if (cancelled) return;
      setError(msg);
      // 為避免使用者卡在錯誤頁，3 秒後自動導向重新申請
      setTimeout(() => {
        if (!cancelled) navigate("/forgot-password", { replace: true });
      }, 3000);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        markReady();
      }
    });

    (async () => {
      try {
        // 先檢查現有 session（hash token 可能已被 supabase-js 自動處理）
        const { data: existing } = await supabase.auth.getSession();
        if (existing.session) return markReady();

        const url = new URL(window.location.href);
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

        // 1) PKCE flow: ?code=...
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) return fail("重設連結已失效或不正確，請重新申請。");
          return markReady();
        }

        // 2) token_hash + type=recovery
        const tokenHash = url.searchParams.get("token_hash") ?? hash.get("token_hash");
        const type = (url.searchParams.get("type") ?? hash.get("type")) as
          | "recovery"
          | null;
        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
          if (error) return fail("重設連結已失效或不正確，請重新申請。");
          return markReady();
        }

        // 3) implicit access_token in hash
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) return fail("重設連結已失效或不正確，請重新申請。");
          return markReady();
        }

        // 4) error param 直接回報
        const errDesc = url.searchParams.get("error_description") ?? hash.get("error_description");
        if (errDesc) return fail(decodeURIComponent(errDesc));

        // 給 onAuthStateChange 一點時間（防止 race）
        setTimeout(async () => {
          const { data: d2 } = await supabase.auth.getSession();
          if (d2.session) markReady();
          else fail("重設連結已失效或不正確，請重新申請。");
        }, 1200);
      } catch (e: any) {
        fail(e?.message ?? "重設連結已失效或不正確，請重新申請。");
      }
    })();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong(password)) {
      toast({ title: "密碼強度不足", description: "請依下方規則設定更安全的密碼。", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "兩次密碼不一致", description: "請確認後再試一次。", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "密碼已更新", description: "請使用新密碼登入。" });
      await supabase.auth.signOut();
      navigate("/teacher/login", { replace: true });
    } catch (err: any) {
      toast({
        title: "無法更新密碼",
        description: err?.message ?? "請稍後再試。",
        variant: "destructive",
      });
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
            <p className="eyebrow mt-2">GUIDES' LOUNGE</p>
          </Link>

          <div className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl shadow-[#E63946]/5 p-8 md:p-10 border border-[#E63946]/10">
            <h1 className="font-display text-2xl text-foreground mb-2">設定新的密碼</h1>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              為了您的帳號安全，請設定一組僅您知道的全新密碼。
            </p>

            {error ? (
              <div className="space-y-6">
                <div className="rounded-2xl bg-[#FFF5E6] border border-[#E63946]/20 p-5 text-sm leading-[1.7] text-foreground">
                  <p className="font-medium mb-1">{error}</p>
                  <p className="text-muted-foreground text-xs">
                    為了您的帳號安全，重設連結有時效性。請重新申請一封新的引導信。
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full text-white hover:opacity-90"
                  style={{ backgroundColor: "#E63946" }}
                >
                  <Link to="/forgot-password">重新申請重設連結</Link>
                </Button>
                <Link to="/teacher/login" className="block text-center text-xs text-muted-foreground hover:text-foreground">
                  ← 返回登入
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">新密碼</Label>
                  <PasswordInput
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 8 個字元"
                    disabled={!ready}
                  />
                  <PasswordStrengthMeter value={password} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">再次輸入新密碼</Label>
                  <PasswordInput
                    id="confirm"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="再次輸入以確認"
                    disabled={!ready}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-white hover:opacity-90"
                  style={{ backgroundColor: "#E63946" }}
                  disabled={busy || !ready || !isPasswordStrong(password) || password !== confirm}
                >
                  {busy ? "更新中…" : ready ? "更新密碼" : "驗證連結中…"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
