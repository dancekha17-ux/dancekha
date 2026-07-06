import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Eye, Trash2, Upload, Sprout, X } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type SeedVideoStatus = "draft" | "review" | "published";

interface SeedVideo {
  id: string;
  cover_url: string;
  title: string;
  dance_style: string;
  intro: string;
  video_url: string;
  duration_seconds: number;
  status: SeedVideoStatus;
  updated_at: string;
}

const TARGET_COUNT = 2;

const STATUS_META: Record<SeedVideoStatus, { label: string; className: string }> = {
  draft: {
    label: "草稿",
    className: "bg-muted text-muted-foreground border-border",
  },
  review: {
    label: "審核中",
    className: "bg-[#E89B5C]/15 text-[#B25C2E] border-[#E89B5C]/40",
  },
  published: {
    label: "已發布",
    className: "bg-success/15 text-success border-success/40",
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
    return Array.isArray(parsed) ? parsed : [];
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

interface EditorState {
  mode: "create" | "edit";
  video: SeedVideo;
}

function emptyVideo(): SeedVideo {
  return {
    id: `seed-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    cover_url: "",
    title: "",
    dance_style: "",
    intro: "",
    video_url: "",
    duration_seconds: 0,
    status: "draft",
    updated_at: new Date().toISOString(),
  };
}

export default function TeacherSeedVideos() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [videos, setVideos] = useState<SeedVideo[]>([]);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [previewVideo, setPreviewVideo] = useState<SeedVideo | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SeedVideo | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/teacher/login", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setVideos(loadVideos(user.id));
  }, [user]);

  const completed = useMemo(
    () => videos.filter((v) => v.status === "published").length,
    [videos]
  );
  const progressPct = Math.min(100, Math.round((completed / TARGET_COUNT) * 100));

  const persist = (next: SeedVideo[]) => {
    setVideos(next);
    if (user) saveVideos(user.id, next);
  };

  const handleSaveEditor = () => {
    if (!editor) return;
    const v = editor.video;
    if (!v.title.trim()) {
      toast({ title: "請輸入標題", variant: "destructive" });
      return;
    }
    const stamped: SeedVideo = { ...v, updated_at: new Date().toISOString() };
    const next =
      editor.mode === "create"
        ? [stamped, ...videos]
        : videos.map((x) => (x.id === v.id ? stamped : x));
    persist(next);
    setEditor(null);
    toast({ title: editor.mode === "create" ? "已新增短片" : "已更新短片" });
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    persist(videos.filter((v) => v.id !== confirmDelete.id));
    toast({ title: "已刪除短片" });
    setConfirmDelete(null);
  };

  const handleFileToDataUrl = (
    file: File,
    onLoad: (dataUrl: string, extra?: { duration?: number }) => void
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      if (file.type.startsWith("video/")) {
        const el = document.createElement("video");
        el.preload = "metadata";
        el.onloadedmetadata = () => {
          onLoad(dataUrl, { duration: el.duration });
        };
        el.onerror = () => onLoad(dataUrl);
        el.src = dataUrl;
      } else {
        onLoad(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">載入中…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5E6" }}>
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

      <main className="container-wide mx-auto py-10 md:py-14 px-4 max-w-4xl">
        <div className="mb-8">
          <span className="eyebrow">聚落共創 / 種子短片</span>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mt-3 flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            種子短片管理
          </h1>
          <p className="text-muted-foreground mt-3 leading-relaxed text-sm md:text-base">
            建立初學者基礎教學短片，作為平台會員專屬內容。第一階段完成 {TARGET_COUNT} 支即可，之後可持續累積更多主題。
          </p>
        </div>

        {/* Progress card */}
        <section className="rounded-3xl bg-card/70 border border-border/60 p-6 md:p-8 mb-6 shadow-soft">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="eyebrow">完成進度</span>
              <p className="font-display text-2xl text-foreground mt-1">
                {completed}
                <span className="text-muted-foreground text-lg"> / {TARGET_COUNT}</span>
              </p>
            </div>
            <span className="text-sm text-muted-foreground">{progressPct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-[#E89B5C]/15 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progressPct}%`,
                background:
                  "linear-gradient(90deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            {completed >= TARGET_COUNT
              ? "🎉 已達成第一階段！歡迎繼續累積更多種子短片。"
              : `再完成 ${TARGET_COUNT - completed} 支已發布短片即可達成第一階段目標。`}
          </p>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-foreground">我的短片</h2>
          <Button
            size="sm"
            className="text-white shadow-glow"
            style={{ background: "linear-gradient(135deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)" }}
            onClick={() => setEditor({ mode: "create", video: emptyVideo() })}
          >
            <Plus className="w-4 h-4" /> 新增短片
          </Button>
        </div>

        {/* Videos list */}
        {videos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-white/50 p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E89B5C]/15 text-[#B25C2E] flex items-center justify-center mx-auto mb-3">
              <Sprout className="w-6 h-6" />
            </div>
            <p className="font-display text-base text-foreground">還沒有種子短片</p>
            <p className="text-xs text-muted-foreground mt-1.5">
              點擊右上方「新增短片」，開始建立你的第一支基礎教學。
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((v) => {
              const status = STATUS_META[v.status];
              return (
                <li
                  key={v.id}
                  className="rounded-2xl border border-border/60 bg-card/80 overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="aspect-video bg-secondary/60 relative overflow-hidden">
                    {v.cover_url ? (
                      <img
                        src={v.cover_url}
                        alt={v.title || "cover"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        尚未上傳封面
                      </div>
                    )}
                    <span
                      className={`absolute top-2 left-2 text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border ${status.className}`}
                    >
                      {status.label}
                    </span>
                    {v.duration_seconds > 0 && (
                      <span className="absolute bottom-2 right-2 text-[11px] px-1.5 py-0.5 rounded bg-black/60 text-white">
                        {formatDuration(v.duration_seconds)}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="font-display text-base text-foreground truncate">
                      {v.title || "（未命名）"}
                    </p>
                    {v.dance_style && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {v.dance_style}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {v.intro || "—"}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setEditor({ mode: "edit", video: v })}
                      >
                        <Pencil className="w-3.5 h-3.5" /> 編輯
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewVideo(v)}
                        title="預覽"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete(v)}
                        title="刪除"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* Editor dialog */}
      <Dialog open={!!editor} onOpenChange={(o) => !o && setEditor(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editor?.mode === "create" ? "新增種子短片" : "編輯種子短片"}
            </DialogTitle>
            <DialogDescription>
              請填寫短片資訊，儲存後可在此頁面持續編輯與送出審核。
            </DialogDescription>
          </DialogHeader>

          {editor && (
            <div className="space-y-4">
              {/* Cover */}
              <div>
                <Label>封面圖片</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <div className="w-24 h-16 rounded-lg bg-secondary border border-border overflow-hidden flex items-center justify-center text-[10px] text-muted-foreground shrink-0">
                    {editor.video.cover_url ? (
                      <img
                        src={editor.video.cover_url}
                        alt="cover preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "無圖片"
                    )}
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer text-[#B25C2E] hover:underline">
                    <Upload className="w-4 h-4" /> 上傳封面
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        handleFileToDataUrl(f, (url) =>
                          setEditor((s) =>
                            s ? { ...s, video: { ...s.video, cover_url: url } } : s
                          )
                        );
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="seed-title">標題</Label>
                <Input
                  id="seed-title"
                  value={editor.video.title}
                  onChange={(e) =>
                    setEditor((s) =>
                      s ? { ...s, video: { ...s.video, title: e.target.value } } : s
                    )
                  }
                  placeholder="例如：Hula 基礎手勢 3 分鐘入門"
                />
              </div>

              <div>
                <Label htmlFor="seed-style">舞種</Label>
                <Input
                  id="seed-style"
                  value={editor.video.dance_style}
                  onChange={(e) =>
                    setEditor((s) =>
                      s ? { ...s, video: { ...s.video, dance_style: e.target.value } } : s
                    )
                  }
                  placeholder="例如：Hula / Horo / Odissi"
                />
              </div>

              <div>
                <Label htmlFor="seed-intro">簡介</Label>
                <Textarea
                  id="seed-intro"
                  rows={3}
                  value={editor.video.intro}
                  onChange={(e) =>
                    setEditor((s) =>
                      s ? { ...s, video: { ...s.video, intro: e.target.value } } : s
                    )
                  }
                  placeholder="簡短介紹這支短片的內容與學員收穫。"
                />
              </div>

              {/* Video upload */}
              <div>
                <Label>影片上傳</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer text-[#B25C2E] hover:underline">
                    <Upload className="w-4 h-4" />
                    {editor.video.video_url ? "重新上傳" : "選擇影片檔案"}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        handleFileToDataUrl(f, (url, extra) =>
                          setEditor((s) =>
                            s
                              ? {
                                  ...s,
                                  video: {
                                    ...s.video,
                                    video_url: url,
                                    duration_seconds: Math.round(extra?.duration ?? 0),
                                  },
                                }
                              : s
                          )
                        );
                      }}
                    />
                  </label>
                  {editor.video.video_url && (
                    <span className="text-xs text-muted-foreground">
                      已上傳 · 長度 {formatDuration(editor.video.duration_seconds)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  影片與封面暫存於此裝置的瀏覽器，未來將可上傳至平台影音庫。
                </p>
              </div>

              <div>
                <Label>狀態</Label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(Object.keys(STATUS_META) as SeedVideoStatus[]).map((k) => {
                    const active = editor.video.status === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() =>
                          setEditor((s) =>
                            s ? { ...s, video: { ...s.video, status: k } } : s
                          )
                        }
                        className={[
                          "px-3 py-1 rounded-full text-xs border transition-colors",
                          active
                            ? "bg-[#E36435] text-white border-[#E36435]"
                            : "bg-white text-foreground/70 border-border hover:border-[#E89B5C]",
                        ].join(" ")}
                      >
                        {STATUS_META[k].label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditor(null)}>
              取消
            </Button>
            <Button
              className="text-white"
              style={{ background: "linear-gradient(135deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)" }}
              onClick={handleSaveEditor}
            >
              儲存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={!!previewVideo} onOpenChange={(o) => !o && setPreviewVideo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewVideo?.title || "預覽短片"}</DialogTitle>
            {previewVideo?.dance_style && (
              <DialogDescription>{previewVideo.dance_style}</DialogDescription>
            )}
          </DialogHeader>
          {previewVideo?.video_url ? (
            <video
              src={previewVideo.video_url}
              controls
              className="w-full rounded-lg bg-black"
            />
          ) : (
            <div className="aspect-video rounded-lg bg-secondary flex items-center justify-center text-sm text-muted-foreground">
              尚未上傳影片
            </div>
          )}
          {previewVideo?.intro && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {previewVideo.intro}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
            <DialogDescription>
              確定要刪除「{confirmDelete?.title || "此短片"}」嗎？此操作無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <X className="w-4 h-4" /> 刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
