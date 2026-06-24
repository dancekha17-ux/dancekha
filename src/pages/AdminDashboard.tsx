import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ShieldCheck, LogOut, ExternalLink, Clock, FileText, Send, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PendingProfile {
  id: string;
  user_id: string;
  name: string | null;
  slug: string | null;
  specialty: string | null;
  region: string | null;
  avatar_url: string | null;
  bio: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  updated_at: string;
  is_approved: boolean;
}

function ContactLine({ email, phone }: { email?: string | null; phone?: string | null }) {
  if (!email && !phone) {
    return (
      <p className="text-xs text-muted-foreground/70 italic mt-0.5">尚未提供聯絡方式</p>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-muted-foreground">
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <Mail className="w-3 h-3" /> {email}
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone.replace(/\s+/g, "")}`}
          className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="w-3 h-3" /> {phone}
        </a>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pending, setPending] = useState<PendingProfile[]>([]);
  const [approved, setApproved] = useState<PendingProfile[]>([]);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectingCourse, setRejectingCourse] = useState<any | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");

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
    const { data } = await (supabase as any)
      .from("teacher_profiles")
      .select("id,user_id,name,slug,specialty,region,avatar_url,bio,contact_email,contact_phone,updated_at,is_approved")
      .order("updated_at", { ascending: false });
    const rows = (data ?? []) as PendingProfile[];
    setPending(rows.filter((r) => !r.is_approved));
    setApproved(rows.filter((r) => r.is_approved));

    const { data: courses } = await (supabase as any)
      .from("instructor_courses")
      .select("id,title,description,service_type,price,region,location_address,online_link,session_info,submitted_at,teacher_id,teacher_profiles!inner(name,slug,user_id,contact_email,contact_phone)")
      .eq("status", "pending")
      .order("submitted_at", { ascending: true });
    setPendingCourses(courses ?? []);
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

  const approveCourse = async (id: string) => {
    setBusyId(id);
    const { error } = await (supabase as any)
      .from("instructor_courses")
      .update({ status: "published", is_published: true, reviewed_at: new Date().toISOString(), revision_notes: null })
      .eq("id", id);
    setBusyId(null);
    if (error) return toast({ title: "操作失敗", description: error.message, variant: "destructive" });
    toast({ title: "已核准上架", description: "課程已同步至公開頁面。" });
    refresh();
  };

  const confirmRejectCourse = async () => {
    if (!rejectingCourse) return;
    const notes = rejectNotes.trim();
    if (!notes) {
      toast({ title: "請填寫修改建議", description: "退回時請說明需要老師調整的內容。", variant: "destructive" });
      return;
    }
    const id = rejectingCourse.id;
    setBusyId(id);
    const { error } = await (supabase as any)
      .from("instructor_courses")
      .update({ status: "draft", is_published: false, reviewed_at: new Date().toISOString(), revision_notes: notes })
      .eq("id", id);
    if (error) {
      setBusyId(null);
      return toast({ title: "操作失敗", description: error.message, variant: "destructive" });
    }
    // Best-effort email notification — silently ignore if email infra is not yet ready
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "course-revision-request",
          recipientEmail: rejectingCourse.teacher_profiles?.contact_email ?? undefined,
          recipientUserId: rejectingCourse.teacher_profiles?.user_id ?? undefined,
          idempotencyKey: `course-revision-${id}-${Date.now()}`,
          templateData: {
            teacherName: rejectingCourse.teacher_profiles?.name ?? "老師",
            courseTitle: rejectingCourse.title ?? "你的服務",
            revisionNotes: notes,
          },
        },
      });
    } catch (_) {
      /* email notify is non-blocking */
    }
    setBusyId(null);
    toast({ title: "已退回老師修改", description: "建議已存入，系統將通知老師查看。" });
    setRejectingCourse(null);
    setRejectNotes("");
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
                      <ContactLine email={row.contact_email} phone={row.contact_phone} />
                      <p className="text-sm text-muted-foreground truncate mt-1">
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

        {/* Pending courses awaiting publication review */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <Send className="w-5 h-5 text-[#E89B5C]" />
              課程送審清單 <span className="text-muted-foreground text-sm">({pendingCourses.length})</span>
            </h2>
          </div>
          {pendingCourses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center text-muted-foreground text-sm">
              目前沒有等待審核的課程 ☕
            </div>
          ) : (
            <ul className="space-y-4">
              {pendingCourses.map((c) => {
                const teacherName = c.teacher_profiles?.name ?? "未具名老師";
                const teacherSlug = c.teacher_profiles?.slug;
                const serviceLabels: Record<string, string> = {
                  in_person: "實體課程",
                  pre_recorded: "線上預錄",
                  event_ticket: "演出票券",
                  space_rental: "空間出租",
                };
                return (
                  <li key={c.id} className="rounded-3xl border border-border/60 bg-card p-5 md:p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full bg-[#E89B5C]/15 text-[#B25C2E] border border-[#E89B5C]/40">
                            {serviceLabels[c.service_type] ?? c.service_type}
                          </span>
                          <span className="text-xs text-muted-foreground">{teacherName}</span>
                        </div>
                        <ContactLine
                          email={c.teacher_profiles?.contact_email}
                          phone={c.teacher_profiles?.contact_phone}
                        />
                        <p className="font-display text-lg text-foreground mt-1">{c.title || "（未命名服務）"}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 whitespace-pre-wrap">
                          {c.description || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {[c.region, c.location_address, c.online_link, c.session_info, c.price]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        {c.submitted_at && (
                          <p className="text-[11px] text-muted-foreground/80 mt-1">
                            送審於 {new Date(c.submitted_at).toLocaleString("zh-TW")}
                          </p>
                        )}
                      </div>
                      {teacherSlug && (
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/instructors/${teacherSlug}`} target="_blank">
                            <ExternalLink className="w-4 h-4" /> 看老師頁
                          </Link>
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busyId === c.id}
                        onClick={() => {
                          setRejectingCourse(c);
                          setRejectNotes("");
                        }}
                      >
                        <XCircle className="w-4 h-4" /> 退回老師修改
                      </Button>
                      <Button
                        size="sm"
                        disabled={busyId === c.id}
                        onClick={() => approveCourse(c.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" /> 核准並發布
                      </Button>
                    </div>
                  </li>
                );
              })}
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
                    <ContactLine email={row.contact_email} phone={row.contact_phone} />
                    <p className="text-xs text-muted-foreground truncate mt-1">
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

      <Dialog
        open={!!rejectingCourse}
        onOpenChange={(open) => {
          if (!open) {
            setRejectingCourse(null);
            setRejectNotes("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>退回老師修改</DialogTitle>
            <DialogDescription>
              請填寫具體的修改建議。送出後課程將回到「草稿」狀態，並透過 Email 通知老師。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              服務：<span className="text-foreground font-medium">{rejectingCourse?.title || "（未命名）"}</span>
            </p>
            <Textarea
              autoFocus
              rows={5}
              required
              placeholder="例如：請補充課程地點、上課時段，並提供至少一張封面照片。"
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setRejectingCourse(null);
                setRejectNotes("");
              }}
            >
              取消
            </Button>
            <Button
              disabled={!rejectNotes.trim() || busyId === rejectingCourse?.id}
              onClick={confirmRejectCourse}
            >
              <XCircle className="w-4 h-4" /> 確認退回並通知
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

