import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ShieldCheck, LogOut, ExternalLink, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PendingProfile {
  id: string;
  user_id: string;
  name: string | null;
  slug: string | null;
  specialty: string | null;
  region: string | null;
  avatar_url: string | null;
  bio: string | null;
  updated_at: string;
  is_approved: boolean;
}

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pending, setPending] = useState<PendingProfile[]>([]);
  const [approved, setApproved] = useState<PendingProfile[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/teacher/login", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const admin = (roles ?? []).some((r: any) => r.role === "admin");
      setIsAdmin(admin);
      if (!admin) return;
      await refresh();
    })();
  }, [user]);

  const refresh = async () => {
    const { data } = await supabase
      .from("teacher_profiles")
      .select("id,user_id,name,slug,specialty,region,avatar_url,bio,updated_at,is_approved")
      .order("updated_at", { ascending: false });
    const rows = (data ?? []) as PendingProfile[];
    setPending(rows.filter((r) => !r.is_approved));
    setApproved(rows.filter((r) => r.is_approved));
  };

  const setApproval = async (row: PendingProfile, value: boolean) => {
    setBusyId(row.id);
    const { error } = await supabase
      .from("teacher_profiles")
      .update({ is_approved: value })
      .eq("id", row.id);
    setBusyId(null);
    if (error) {
      toast({ title: "操作失敗", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: value ? "已通過審核" : "已標記為待修改",
      description: value
        ? `${row.name ?? "該師資"} 現已公開於平台。`
        : `${row.name ?? "該師資"} 已退回草稿狀態。`,
    });
    refresh();
  };

  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">載入中…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-6 text-center">
        <ShieldCheck className="w-10 h-10 text-muted-foreground" />
        <h1 className="font-display text-2xl">此頁僅供平台管理員</h1>
        <p className="text-muted-foreground text-sm">你目前的帳號尚未具備管理員權限。</p>
        <Button asChild variant="outline">
          <Link to="/">回到首頁</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(32_45%_97%)] via-background to-secondary/40">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="container-wide mx-auto h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-xl text-gradient">舞島咖</span>
            <span className="eyebrow">Admin Console</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
          >
            <LogOut className="w-4 h-4" /> 登出
          </Button>
        </div>
      </header>

      <main className="container-wide mx-auto py-10 md:py-14 max-w-5xl">
        <div className="mb-10">
          <span className="eyebrow">Review Studio</span>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mt-3">
            師資<span className="text-accent-italic">審核控制台</span>
          </h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            審核新加入的引導者，他們通過後即會出現在師資團隊與世界地圖。
          </p>
        </div>

        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              待審核 <span className="text-muted-foreground text-sm">({pending.length})</span>
            </h2>
          </div>

          {pending.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center text-muted-foreground">
              目前沒有待審核的師資 🌿
            </div>
          ) : (
            <ul className="space-y-4">
              {pending.map((row) => (
                <li
                  key={row.id}
                  className="rounded-3xl border border-border/60 bg-card p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-5"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-secondary border border-border overflow-hidden shrink-0">
                      {row.avatar_url ? (
                        <img src={row.avatar_url} alt={row.name ?? ""} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-lg text-foreground truncate">
                        {row.name ?? "未命名"}
                        {row.slug && (
                          <span className="ml-2 text-xs text-muted-foreground font-body">/{row.slug}</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {[row.specialty, row.region].filter(Boolean).join(" · ") || "尚未填寫專長"}
                      </p>
                      <p className="text-xs text-muted-foreground/80 mt-1">
                        更新於 {new Date(row.updated_at).toLocaleString("zh-TW")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {row.slug && (
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/instructors/${row.slug}`} target="_blank">
                          <ExternalLink className="w-4 h-4" /> 預覽
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busyId === row.id}
                      onClick={() => setApproval(row, false)}
                    >
                      <XCircle className="w-4 h-4" /> 駁回修改
                    </Button>
                    <Button
                      size="sm"
                      disabled={busyId === row.id}
                      onClick={() => setApproval(row, true)}
                    >
                      <CheckCircle2 className="w-4 h-4" /> 通過審核
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-success" />
            已上線 <span className="text-muted-foreground text-sm">({approved.length})</span>
          </h2>
          {approved.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center text-muted-foreground text-sm">
              尚無已上線師資。
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-3">
              {approved.map((row) => (
                <li
                  key={row.id}
                  className="rounded-2xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{row.name ?? "未命名"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[row.specialty, row.region].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busyId === row.id}
                    onClick={() => setApproval(row, false)}
                  >
                    撤下
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
