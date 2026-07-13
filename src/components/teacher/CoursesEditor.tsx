import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ImagePlus,
  CheckCircle2,
  FileText,
  Globe,
  Pencil,
  EyeOff,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export interface CourseRow {
  id: string;
  teacher_id: string;
  title: string;
  description: string;
  schedule: string;
  level: string;
  price: string;
  sort_order: number;
  course_image_url: string | null;
  region: string | null;
  sessions_count: number | null;
  age_range: string | null;
  notes: string | null;
  service_type: "in_person" | "pre_recorded" | "event_ticket" | "space_rental";
  location_address: string | null;
  online_link: string | null;
  session_info: string | null;
  is_published: boolean;
  status: "draft" | "pending" | "published";
  revision_notes: string | null;
  signup_url: string | null;
}

const STATUS_META: Record<CourseRow["status"], { label: string; cls: string }> = {
  draft: { label: "草稿", cls: "bg-muted text-muted-foreground border-border" },
  pending: { label: "審核中", cls: "bg-[#E89B5C]/15 text-[#B25C2E] border-[#E89B5C]/40" },
  published: { label: "已發布", cls: "bg-success/10 text-success border-success/30" },
};

const SERVICE_LABEL: Record<CourseRow["service_type"], string> = {
  in_person: "實體課程",
  pre_recorded: "線上預錄",
  event_ticket: "演出票券",
  space_rental: "空間出租",
};

const TAIWAN_REGIONS = [
  "台北市","新北市","基隆市","桃園市","新竹市","新竹縣","苗栗縣","台中市","彰化縣","南投縣",
  "雲林縣","嘉義市","嘉義縣","台南市","高雄市","屏東縣","宜蘭縣","花蓮縣","台東縣","澎湖縣","金門縣","連江縣",
];

const SERVICE_TYPES = [
  { value: "in_person", label: "實體課程 In-person Class" },
  { value: "pre_recorded", label: "線上預錄課程 Pre-recorded Course" },
  { value: "event_ticket", label: "演出票券 Event Ticket" },
  { value: "space_rental", label: "空間出租 Space Rental" },
] as const;

interface Props {
  teacherId: string;
}

export function CoursesEditor({ teacherId }: Props) {
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("instructor_courses")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("sort_order", { ascending: true });
      setCourses((data as CourseRow[]) ?? []);
      setLoading(false);
    })();
  }, [teacherId]);

  const editing = courses.find((c) => c.id === editingId) ?? null;

  const updateLocal = (id: string, patch: Partial<CourseRow>) =>
    setCourses((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const addCourse = async () => {
    const { data, error } = await (supabase as any)
      .from("instructor_courses")
      .insert({ teacher_id: teacherId, sort_order: courses.length, service_type: "in_person" })
      .select()
      .single();
    if (error) {
      toast({ title: "新增失敗", description: error.message, variant: "destructive" });
      return;
    }
    setCourses((c) => [...c, data as CourseRow]);
    setEditingId((data as CourseRow).id);
  };

  const removeCourse = async (id: string) => {
    if (!confirm("確定要刪除這筆課程／活動？此動作無法復原。")) return;
    const { error } = await (supabase as any).from("instructor_courses").delete().eq("id", id);
    if (error) {
      toast({ title: "刪除失敗", description: error.message, variant: "destructive" });
      return;
    }
    setCourses((c) => c.filter((x) => x.id !== id));
    toast({ title: "已刪除" });
  };

  const unpublish = async (course: CourseRow) => {
    if (!confirm(`確定要下架「${course.title || "（未命名）"}」？`)) return;
    const { error } = await (supabase as any)
      .from("instructor_courses")
      .update({ status: "draft", is_published: false })
      .eq("id", course.id);
    if (error) return toast({ title: "下架失敗", description: error.message, variant: "destructive" });
    updateLocal(course.id, { status: "draft", is_published: false });
    toast({ title: "已下架", description: "課程已轉為草稿，隨時可重新編輯與送審。" });
  };

  const buildPayload = (course: CourseRow) => ({
    title: course.title,
    description: course.description,
    schedule: course.schedule,
    level: course.level,
    price: course.price,
    course_image_url: course.course_image_url,
    region: course.region,
    sessions_count: course.sessions_count,
    age_range: course.age_range,
    notes: course.notes,
    service_type: course.service_type,
    location_address: course.location_address,
    online_link: course.online_link,
    session_info: course.session_info,
    signup_url: course.signup_url,
  });

  const persist = async (course: CourseRow, patch?: Partial<CourseRow>) => {
    const merged = { ...course, ...(patch ?? {}) };
    const { error } = await (supabase as any)
      .from("instructor_courses")
      .update(buildPayload(merged))
      .eq("id", course.id);
    if (error) toast({ title: "儲存失敗", description: error.message, variant: "destructive" });
  };

  const uploadImage = async (course: CourseRow, file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "圖片過大", description: "請上傳 8MB 以內", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) throw userErr ?? new Error("尚未登入");
      const ext = file.name.split(".").pop();
      const path = `${userData.user.id}/course-${course.id}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("instructor-media")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("instructor-media").getPublicUrl(path);
      updateLocal(course.id, { course_image_url: data.publicUrl });
      await persist(course, { course_image_url: data.publicUrl });
      toast({ title: "封面已更新" });
    } catch (err: any) {
      toast({ title: "上傳失敗", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">載入課程中…</p>;

  return (
    <div className="space-y-5">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          共 {courses.length} 筆 ｜ 點選卡片可編輯內容
        </p>
        <Button
          onClick={addCourse}
          size="sm"
          className={`text-white hover:opacity-90 transition-all duration-300 ${
            courses.length > 0 ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-1 pointer-events-none"
          }`}
          style={{ backgroundColor: "#E63946" }}
        >
          <Plus className="w-4 h-4" /> 新增課程／活動
        </Button>
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-[#E63946]/25 bg-white/60 p-10 text-center transition-all duration-500">
          <p className="font-display text-base text-foreground mb-1">{"\n"}</p>
          <p className="text-xs text-muted-foreground mb-4">
            新增內容，邀請學員走進你的舞蹈世界！
          </p>
          <Button
            onClick={addCourse}
            size="sm"
            className="text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#E63946" }}
          >
            <Plus className="w-4 h-4" /> 新增課程／活動
          </Button>
        </div>
      )}

      {/* Card grid (Airbnb-style) */}
      {courses.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {courses.map((course) => {
            const meta = STATUS_META[course.status ?? "draft"];
            return (
              <div
                key={course.id}
                className="group rounded-2xl border border-border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Thumb */}
                <button
                  type="button"
                  onClick={() => setEditingId(course.id)}
                  className="relative aspect-[16/10] bg-secondary overflow-hidden block text-left"
                >
                  {course.course_image_url ? (
                    <img
                      src={course.course_image_url}
                      alt={course.title || "course"}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                      <ImagePlus className="w-5 h-5 opacity-60" />
                      尚未上傳封面
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-full border backdrop-blur-sm ${meta.cls}`}
                  >
                    {course.status === "published" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <FileText className="w-3 h-3" />
                    )}
                    {meta.label}
                  </span>
                </button>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-1">
                    {SERVICE_LABEL[course.service_type ?? "in_person"]}
                  </div>
                  <h3 className="font-display text-base text-foreground line-clamp-1">
                    {course.title || "（未命名課程）"}
                  </h3>
                  {(course.region || course.schedule) && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {[course.region, course.schedule].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {course.revision_notes && course.status !== "published" && (
                    <p className="mt-2 text-[11px] text-destructive line-clamp-2">
                      修改建議：{course.revision_notes}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setEditingId(course.id)}
                    >
                      <Pencil className="w-3.5 h-3.5" /> 編輯
                    </Button>
                    {course.status === "published" || course.is_published ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => unpublish(course)}
                      >
                        <EyeOff className="w-3.5 h-3.5" /> 下架
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeCourse(course.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditingId(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  {editing.title?.trim() ? `編輯：${editing.title}` : "新增課程／活動"}
                </DialogTitle>
                <DialogDescription>
                  完成編輯後關閉視窗即會自動儲存為草稿；最後請至上方「申請刊登」一次送審。
                </DialogDescription>
              </DialogHeader>

              {editing.status === "pending" && (
                <div className="rounded-xl bg-[#E89B5C]/10 border border-[#E89B5C]/30 px-4 py-3 text-xs text-[#7a3d18] leading-relaxed">
                  舞島咖團隊確認中… 提交後預計需 2 個工作天完成內容確認。
                </div>
              )}
              {editing.revision_notes && editing.status !== "published" && (
                <div className="rounded-xl bg-destructive/5 border border-destructive/30 px-4 py-3 text-xs text-destructive leading-relaxed whitespace-pre-wrap">
                  <p className="font-medium mb-1">舞島咖團隊的修改建議：</p>
                  {editing.revision_notes}
                </div>
              )}

              <div className="space-y-5 pt-2">
                {/* Service type */}
                <div className="space-y-2">
                  <Label>類型 Service Type</Label>
                  <Select
                    value={editing.service_type ?? "in_person"}
                    onValueChange={(val) => {
                      updateLocal(editing.id, { service_type: val as CourseRow["service_type"] });
                      persist(editing, { service_type: val as CourseRow["service_type"] });
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cover image — dashed dropzone when empty, compact thumb when set */}
                <div className="space-y-2">
                  <Label>封面圖</Label>
                  {editing.course_image_url ? (
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-20 rounded-lg overflow-hidden border border-border bg-secondary shrink-0">
                        <img
                          src={editing.course_image_url}
                          alt="cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs cursor-pointer hover:bg-accent transition w-fit">
                          <ImagePlus className="w-3.5 h-3.5" />
                          {uploading ? "上傳中…" : "更換封面"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadImage(editing, f);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            updateLocal(editing.id, { course_image_url: null });
                            persist(editing, { course_image_url: null });
                          }}
                          className="text-[11px] text-muted-foreground hover:text-destructive inline-flex items-center gap-1 w-fit"
                        >
                          <X className="w-3 h-3" /> 移除封面
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="rounded-xl border-2 border-dashed border-border hover:border-[#E63946]/40 bg-secondary/30 hover:bg-secondary/50 transition px-4 py-6 text-center">
                        <ImagePlus className="w-5 h-5 mx-auto text-muted-foreground mb-1.5" />
                        <p className="text-xs text-foreground">
                          {uploading ? "上傳中…" : "點此上傳課程封面"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          建議 16:9 ／ 8MB 以內
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadImage(editing, f);
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>名稱</Label>
                  <Input
                    value={editing.title ?? ""}
                    placeholder="例：即興入門 / 仲夏舞夜票券 / 排練室出租"
                    onChange={(e) => updateLocal(editing.id, { title: e.target.value })}
                    onBlur={() => persist(editing)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>介紹</Label>
                  <Textarea
                    value={editing.description ?? ""}
                    rows={3}
                    placeholder="這項服務想帶學員體驗什麼？"
                    onChange={(e) => updateLocal(editing.id, { description: e.target.value })}
                    onBlur={() => persist(editing)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>縣市</Label>
                    <Select
                      value={editing.region ?? ""}
                      onValueChange={(val) => {
                        updateLocal(editing.id, { region: val });
                        persist(editing, { region: val });
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="請選擇縣市" /></SelectTrigger>
                      <SelectContent>
                        {TAIWAN_REGIONS.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>適合年齡段</Label>
                    <Input
                      value={editing.age_range ?? ""}
                      placeholder="例：18-35 歲 / 親子 / 樂齡 55+"
                      onChange={(e) => updateLocal(editing.id, { age_range: e.target.value })}
                      onBlur={() => persist(editing)}
                    />
                  </div>
                </div>

                {/* Dynamic fields by service type */}
                {(editing.service_type === "in_person" || editing.service_type === "space_rental") && (
                  <div className="space-y-2">
                    <Label>地點 / 地址</Label>
                    <Input
                      value={editing.location_address ?? ""}
                      placeholder="例：台北市中山區民生東路一段 X 號 3 樓"
                      onChange={(e) => updateLocal(editing.id, { location_address: e.target.value })}
                      onBlur={() => persist(editing)}
                    />
                  </div>
                )}
                {editing.service_type === "pre_recorded" && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" /> 影片連結 / 教學平台連結
                    </Label>
                    <Input
                      type="url"
                      value={editing.online_link ?? ""}
                      placeholder="https://..."
                      onChange={(e) => updateLocal(editing.id, { online_link: e.target.value })}
                      onBlur={() => persist(editing)}
                    />
                  </div>
                )}
                {editing.service_type === "event_ticket" && (
                  <div className="space-y-2">
                    <Label>場次 / 座位資訊</Label>
                    <Textarea
                      value={editing.session_info ?? ""}
                      rows={3}
                      placeholder="例：2025/12/20 19:30 場 ｜ A 區自由入座"
                      onChange={(e) => updateLocal(editing.id, { session_info: e.target.value })}
                      onBlur={() => persist(editing)}
                    />
                  </div>
                )}

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>時間</Label>
                    <Input
                      value={editing.schedule ?? ""}
                      placeholder="週三 19:30"
                      onChange={(e) => updateLocal(editing.id, { schedule: e.target.value })}
                      onBlur={() => persist(editing)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>堂數</Label>
                    <Input
                      type="number"
                      min={1}
                      value={editing.sessions_count ?? ""}
                      placeholder="例：8"
                      onChange={(e) =>
                        updateLocal(editing.id, {
                          sessions_count: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      onBlur={() => persist(editing)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>程度</Label>
                    <Input
                      value={editing.level ?? ""}
                      placeholder="初級 / 中級 / 高級"
                      onChange={(e) => updateLocal(editing.id, { level: e.target.value })}
                      onBlur={() => persist(editing)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>價格</Label>
                  <Input
                    value={editing.price ?? ""}
                    placeholder="NT$ 1,200"
                    onChange={(e) => updateLocal(editing.id, { price: e.target.value })}
                    onBlur={() => persist(editing)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    🎫 報名 / 收款連結（選填）
                  </Label>
                  <Input
                    type="url"
                    value={editing.signup_url ?? ""}
                    placeholder="https://forms.gle/... 或 綠界／街口收款連結"
                    onChange={(e) => updateLocal(editing.id, { signup_url: e.target.value })}
                    onBlur={() => persist(editing)}
                  />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    學員按下「🎫 我要報名」時，將於新分頁開啟此連結；未填寫時按鈕會顯示為「敬請期待」。
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>特別說明（補課、地址備註等）</Label>
                  <Textarea
                    value={editing.notes ?? ""}
                    rows={3}
                    placeholder="例如：颱風停課改至線上 / 補課政策…"
                    onChange={(e) => updateLocal(editing.id, { notes: e.target.value })}
                    onBlur={() => persist(editing)}
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => {
                      removeCourse(editing.id);
                      setEditingId(null);
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 刪除此筆
                  </button>
                  <Button onClick={() => setEditingId(null)} size="sm" variant="outline">
                    完成編輯
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
