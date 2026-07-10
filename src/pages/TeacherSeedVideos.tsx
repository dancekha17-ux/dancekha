import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sprout,
  Video,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Cloud,
  Film,
  ExternalLink,
  RefreshCw,
  Eye,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// -----------------------------------------------------------------------------
// Types & constants
// -----------------------------------------------------------------------------

type SeedVideoStatus =
  | "received" // 📤 已收到
  | "reviewing" // 👀 確認中
  | "producing" // ✨ 整理中
  | "published" // ✅ 已發布
  | "needs_revision"; // 🔄 需補件

interface SeedVideo {
  id: string;
  cover_url: string;
  title: string;
  uploaded_at: string; // ISO
  duration_seconds: number;
  status: SeedVideoStatus;
  revision_reason?: string;
  published_at?: string;
  video_url?: string;
}

const TARGET_COUNT = 5;

// Google Drive submission folder (placeholder — replace with real folder link)
const DRIVE_UPLOAD_URL = "https://drive.google.com/drive/folders/danceka-seed-videos";

const STATUS_META: Record<
  SeedVideoStatus,
  { label: string; className: string; dotColor: string }
> = {
  received: {
    label: "📤 已收到",
    className: "bg-muted/70 text-foreground/70 border-border",
    dotColor: "#9CA3AF",
  },
  reviewing: {
    label: "👀 確認中",
    className: "bg-[#E89B5C]/15 text-[#B25C2E] border-[#E89B5C]/40",
    dotColor: "#E89B5C",
  },
  producing: {
    label: "✨ 整理中",
    className: "bg-[#5A8FBF]/12 text-[#2F6690] border-[#5A8FBF]/35",
    dotColor: "#5A8FBF",
  },
  published: {
    label: "✅ 已發布",
    className: "bg-success/15 text-success border-success/40",
    dotColor: "hsl(var(--success))",
  },
  needs_revision: {
    label: "🔄 需補件",
    className: "bg-destructive/10 text-destructive border-destructive/30",
    dotColor: "hsl(var(--destructive))",
  },
};

function storageKey(userId: string) {
  return `danceka:seed-videos:${userId}`;
}

function loadVideos(userId: string): SeedVideo[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Backwards-compat: map old status shapes → new
    return parsed.map((v: any) => {
      let status: SeedVideoStatus;
      if (v.status === "draft") status = "received";
      else if (v.status === "review") status = "reviewing";
      else if (STATUS_META[v.status as SeedVideoStatus]) status = v.status as SeedVideoStatus;
      else status = "received";
      return {
        id: v.id,
        cover_url: v.cover_url ?? "",
        title: v.title ?? "",
        uploaded_at: v.uploaded_at ?? v.updated_at ?? new Date().toISOString(),
        duration_seconds: v.duration_seconds ?? 0,
        status,
        revision_reason: v.revision_reason,
        published_at: v.published_at,
        video_url: v.video_url,
      } as SeedVideo;
    });
  } catch {
    return [];
  }
}

function saveVideos(userId: string, videos: SeedVideo[]) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(videos));
  } catch {
    /* ignore quota errors */
  }
}

function formatDuration(sec: number) {
  if (!sec || sec < 1) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")}`;
  } catch {
    return "—";
  }
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function TeacherSeedVideos() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [videos, setVideos] = useState<SeedVideo[]>([]);
  const [previewVideo, setPreviewVideo] = useState<SeedVideo | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SeedVideo | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/teacher/login", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setVideos(loadVideos(user.id));
  }, [user]);

  const sowedCount = useMemo(
    () => videos.filter((v) => v.status !== "needs_revision").length,
    [videos]
  );
  const remaining = Math.max(0, TARGET_COUNT - sowedCount);
  const progressPct = Math.min(100, Math.round((sowedCount / TARGET_COUNT) * 100));

  const persist = (next: SeedVideo[]) => {
    setVideos(next);
    if (user) saveVideos(user.id, next);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    persist(videos.filter((v) => v.id !== confirmDelete.id));
    toast({ title: "已移除此筆記錄" });
    setConfirmDelete(null);
  };

  const openDrive = () => {
    window.open(DRIVE_UPLOAD_URL, "_blank", "noopener,noreferrer");
    toast({
      title: "即將開啟 Google Drive",
      description: "上傳完成後，舞島咖將協助後續整理與收錄。",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">載入中…</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5E6" }}>
      {/* Header */}
      <header className="border-b border-[#E63946]/10 bg-[#FFF5E6]/90 backdrop-blur sticky top-0 z-40">
        <div className="container-wide mx-auto h-16 flex items-center justify-between gap-3 px-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/teacher/dashboard">
              <ArrowLeft className="w-4 h-4" /> 返回引導者專區
            </Link>
          </Button>
          <span className="eyebrow hidden sm:inline">CO-CREATION · SEED VIDEOS</span>
        </div>
      </header>

      <main className="container-wide mx-auto py-10 md:py-14 px-4 max-w-5xl">
        {/* Hero */}
        <section className="mb-10 md:mb-12">
          <span className="eyebrow">聚落共創 / 種子短片</span>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mt-3 flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            種子短片
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed text-sm md:text-base max-w-2xl">
            分享一段最能代表教學特色的內容，只要交給我們影片素材，
            舞島咖將協助您整理，並收錄至引導者典藏會員專區，讓更多人因您的舞步而受到啟發。
          </p>
        </section>

        {/* Progress card */}
        <section
          className="rounded-3xl bg-white/70 border border-[#E89B5C]/25 p-6 md:p-8 mb-8 shadow-soft"
        >
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
            <div>
              <span className="eyebrow">播種進度</span>
              <p className="font-display text-2xl md:text-3xl text-foreground mt-1.5">
                已播種 <span className="text-[#C9461E]">{sowedCount}</span>
                <span className="text-muted-foreground text-lg"> / {TARGET_COUNT} 支短片</span>
              </p>
            </div>
            <span className="text-xs md:text-sm text-muted-foreground">
              {remaining > 0
                ? `還可以繼續播種 ${remaining} 支`
                : "🎉 已完成本階段種子短片"}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#E89B5C]/15 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background:
                  "linear-gradient(90deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            每位引導者／團隊最多可提供 5 支種子短片，建議每支影片格式為 MP4、1080P、16:9，影片長度 8 分鐘內。
          </p>
        </section>

        {/* Submission timeline */}
        <section className="rounded-3xl bg-white/70 border border-[#E89B5C]/25 p-6 md:p-8 mb-8 shadow-soft">
          <span className="eyebrow">SUBMISSION FLOW</span>
          <h2 className="font-display text-xl md:text-2xl text-foreground mt-2 flex items-center gap-2">
            <span>🌱</span> 流程說明
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            共同創作的每一步，都有舞島咖與您並肩陪伴。
          </p>

          <ol className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-3">
            {[
              { icon: Video, title: "錄製影片", desc: "以 MP4 / 1080P / 16:9 拍攝您的分享。" },
              { icon: UploadCloud, title: "上傳 Drive", desc: "上傳至舞島咖指定的 Google Drive。" },
              { icon: Eye, title: "平台審核", desc: "由舞島咖協助確認畫質與內容。" },
              { icon: Sparkles, title: "整理製作", desc: "統一封面、字幕與品牌樣式。" },
              { icon: CheckCircle2, title: "上架典藏", desc: "上傳官方 YouTube (Unlisted) 並收錄會員專區。" },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="relative">
                  <div className="rounded-2xl bg-[#FFF5E6]/60 border border-[#E89B5C]/20 p-4 h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <Icon className="w-4 h-4 text-[#B25C2E]" />
                    </div>
                    <p className="font-display text-sm md:text-base text-foreground">
                      {step.title}
                    </p>
                    <p className="text-[11px] md:text-xs text-muted-foreground mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Two-column: suggested topics + checklist */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-3xl bg-white/70 border border-[#E89B5C]/25 p-6 md:p-7 shadow-soft">
            <span className="eyebrow">SUGGESTED TOPICS</span>
            <h2 className="font-display text-lg md:text-xl text-foreground mt-2 flex items-center gap-2">
              <span>🌿</span> 建議拍攝主題
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1.5 leading-relaxed">
              自由選擇最能傳達您教學靈魂的主題。
            </p>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-foreground/85">
              {[
                "一段入門教學",
                "舞蹈文化小知識",
                "核心技巧分享",
                "暖身與收操",
                "經典舞步解析",
                "節奏與音樂掌握",
                "常見錯誤與修正",
                "希望初學者先理解的一件事",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#2E8B57] mt-0.5">✅</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white/70 border border-[#E89B5C]/25 p-6 md:p-7 shadow-soft">
            <span className="eyebrow">BEFORE YOU SUBMIT</span>
            <h2 className="font-display text-lg md:text-xl text-foreground mt-2 flex items-center gap-2">
              <span>✅</span> 投稿前請確認
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1.5 leading-relaxed">
              簡單自我檢查，讓典藏過程更順暢。
            </p>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-foreground/85">
              {[
                "格式為 MP4",
                "1080P 以上解析度",
                "橫式 16:9",
                "影片長度 8 分鐘內",
                "畫面清楚",
                "聲音清楚",
                "無版權音樂問題",
                "已取得出演者同意",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 leading-relaxed">
                  <span className="inline-block w-4 h-4 mt-0.5 rounded border border-[#E89B5C]/60 bg-white shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Upload CTA */}
        <section
          className="rounded-3xl p-8 md:p-12 mb-8 text-center shadow-glow relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,#FFF8EC 0%,#FCE7CE 60%,#F6C9A0 100%)",
            border: "1px solid rgba(232,155,92,0.35)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl bg-white/70 backdrop-blur flex items-center justify-center mx-auto mb-4 shadow-sm"
          >
            <Cloud className="w-7 h-7 text-[#C9461E]" />
          </div>
          <span className="eyebrow">SUBMIT YOUR SEED</span>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mt-2 flex items-center justify-center gap-2">
            <span>☁️</span> 上傳影片
          </h2>
          <p className="text-sm md:text-base text-foreground/75 mt-3 max-w-xl mx-auto leading-relaxed">
            請點擊下方按鈕，將影片上傳至舞島咖指定 Google Drive 資料夾。
          </p>

          <div className="mt-6">
            <Button
              size="lg"
              onClick={openDrive}
              className="text-white shadow-glow rounded-full px-8 h-12 text-base"
              style={{
                background:
                  "linear-gradient(135deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)",
              }}
            >
              📤 前往 Google Drive 上傳
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground mt-5 max-w-lg mx-auto leading-relaxed">
            上傳完成後，舞島咖將協助完成影片確認、封面整理，
            並收錄至引導者典藏會員專區。
          </p>
        </section>

        {/* My seed videos */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="eyebrow">MY SEEDS</span>
              <h2 className="font-display text-xl md:text-2xl text-foreground mt-1.5 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-[#2E8B57]" /> 我的種子短片
              </h2>
            </div>
          </div>

          {videos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#E89B5C]/40 bg-white/50 p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-[#E89B5C]/15 text-[#B25C2E] flex items-center justify-center mx-auto mb-4">
                <Film className="w-7 h-7" />
              </div>
              <p className="font-display text-base text-foreground">
                尚未有種子短片
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
                完成上傳後，您的作品將顯示於此。舞島咖團隊將協助後續整理與典藏。
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {videos.map((v) => {
                const status = STATUS_META[v.status];
                const isPublished = v.status === "published";
                const needsRevision = v.status === "needs_revision";
                return (
                  <li
                    key={v.id}
                    className="rounded-3xl border border-border/60 bg-white/80 overflow-hidden shadow-soft flex flex-col"
                  >
                    <div className="aspect-video bg-secondary/60 relative overflow-hidden">
                      {v.cover_url ? (
                        <img
                          src={v.cover_url}
                          alt={v.title || "cover"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-xs gap-1.5 bg-gradient-to-br from-[#FFF5E6] to-[#FCE7CE]">
                          <Film className="w-6 h-6 opacity-60" />
                          <span>影片整理中</span>
                        </div>
                      )}
                      <span
                        className={`absolute top-3 left-3 text-[11px] tracking-wide px-2.5 py-1 rounded-full border backdrop-blur bg-white/85 ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <p className="font-display text-base text-foreground line-clamp-1">
                        {v.title || "（未命名短片）"}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          上傳 {formatDate(v.uploaded_at)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(v.duration_seconds)}
                        </span>
                      </div>

                      {isPublished && (
                        <div className="mt-3 rounded-xl bg-success/10 border border-success/25 px-3 py-2 text-xs text-success leading-relaxed">
                          ✓ 已收錄會員專區
                          {v.published_at && (
                            <span className="text-success/80 ml-1">
                              · 發布於 {formatDate(v.published_at)}
                            </span>
                          )}
                        </div>
                      )}

                      {needsRevision && v.revision_reason && (
                        <div className="mt-3 rounded-xl bg-destructive/8 border border-destructive/25 px-3 py-2 text-xs text-destructive leading-relaxed">
                          補件原因：{v.revision_reason}
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2 pt-4 border-t border-border/50">
                        {needsRevision ? (
                          <Button
                            size="sm"
                            className="flex-1 text-white"
                            style={{
                              background:
                                "linear-gradient(135deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)",
                            }}
                            onClick={openDrive}
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> 重新上傳
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setPreviewVideo(v)}
                          >
                            <Eye className="w-3.5 h-3.5" /> 預覽
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDelete(v)}
                          title="移除"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      {/* Preview dialog */}
      <Dialog open={!!previewVideo} onOpenChange={(o) => !o && setPreviewVideo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewVideo?.title || "預覽短片"}</DialogTitle>
            <DialogDescription>
              {previewVideo && STATUS_META[previewVideo.status].label}
              {previewVideo?.uploaded_at &&
                ` · 上傳 ${formatDate(previewVideo.uploaded_at)}`}
            </DialogDescription>
          </DialogHeader>
          {previewVideo?.video_url ? (
            <video
              src={previewVideo.video_url}
              controls
              className="w-full rounded-lg bg-black"
            />
          ) : (
            <div className="aspect-video rounded-lg bg-secondary flex flex-col items-center justify-center text-sm text-muted-foreground gap-2">
              <Film className="w-8 h-8 opacity-60" />
              <p>影片正由舞島咖團隊協助整理中</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>移除此筆記錄</DialogTitle>
            <DialogDescription>
              確定要移除「{confirmDelete?.title || "此短片"}」的追蹤記錄嗎？
              此操作僅移除本頁顯示，實際影片與典藏請聯繫舞島咖團隊。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              移除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
