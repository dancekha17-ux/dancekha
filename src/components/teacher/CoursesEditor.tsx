import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, ImagePlus, CheckCircle2, FileText, Globe } from "lucide-react";
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
}

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
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

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
  };

  const removeCourse = async (id: string) => {
    const { error } = await (supabase as any).from("instructor_courses").delete().eq("id", id);
    if (error) {
      toast({ title: "刪除失敗", description: error.message, variant: "destructive" });
      return;
    }
    setCourses((c) => c.filter((x) => x.id !== id));
  };

  const updateLocal = (id: string, patch: Partial<CourseRow>) =>
    setCourses((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const buildPayload = (course: CourseRow, patch?: Partial<CourseRow>) => ({
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
    ...patch,
  });

  const persist = async (course: CourseRow, patch?: Partial<CourseRow>) => {
    const { error } = await (supabase as any)
      .from("instructor_courses")
      .update(buildPayload(course, patch))
      .eq("id", course.id);
    if (error) toast({ title: "儲存失敗", description: error.message, variant: "destructive" });
  };

  const saveDraft = async (course: CourseRow) => {
    setBusyId(course.id);
    const { error } = await (supabase as any)
      .from("instructor_courses")
      .update({ ...buildPayload(course), is_published: false })
      .eq("id", course.id);
    setBusyId(null);
    if (error) return toast({ title: "儲存失敗", description: error.message, variant: "destructive" });
    updateLocal(course.id, { is_published: false });
    toast({ title: "草稿已儲存" });
  };

  const publish = async (course: CourseRow) => {
    if (!course.title?.trim()) {
      toast({ title: "請先填寫服務名稱", variant: "destructive" });
      return;
    }
    setBusyId(course.id);
    const { error } = await (supabase as any)
      .from("instructor_courses")
      .update({ ...buildPayload(course), is_published: true })
      .eq("id", course.id);
    setBusyId(null);
    if (error) return toast({ title: "發布失敗", description: error.message, variant: "destructive" });
    updateLocal(course.id, { is_published: true });
    toast({ title: "服務已發布", description: "已同步至個人名片與平台首頁" });
  };

  const uploadImage = async (course: CourseRow, file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "圖片過大", description: "請上傳 8MB 以內", variant: "destructive" });
      return;
    }
    setUploadingId(course.id);
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
      toast({ title: "課程封面已更新" });
    } catch (err: any) {
      toast({ title: "上傳失敗", description: err.message, variant: "destructive" });
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">載入課程中…</p>;

  return (
    <div className="space-y-6">
      {courses.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          還沒有服務。新增第一筆,邀請學員走進你的舞蹈世界。
        </p>
      )}

      {courses.map((course) => {
        const t = course.service_type ?? "in_person";
        const showAddress = t === "in_person" || t === "space_rental";
        const showOnline = t === "pre_recorded";
        const showSession = t === "event_ticket";

        return (
          <div
            key={course.id}
            className="rounded-2xl border border-border/60 bg-background/50 p-5 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                <span
                  className={`inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded-full border ${
                    course.is_published
                      ? "bg-success/10 text-success border-success/30"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {course.is_published ? <CheckCircle2 className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                  {course.is_published ? "已發布" : "草稿"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCourse(course.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Service type */}
            <div className="space-y-2">
              <Label>服務類型 Service Type</Label>
              <Select
                value={course.service_type ?? "in_person"}
                onValueChange={(val) => {
                  updateLocal(course.id, { service_type: val as CourseRow["service_type"] });
                  persist({ ...course, service_type: val as CourseRow["service_type"] });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course image */}
            <div className="space-y-2">
              <Label>封面圖</Label>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-secondary border border-border">
                {course.course_image_url ? (
                  <img
                    src={course.course_image_url}
                    alt={course.title || "course"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    尚未上傳封面
                  </div>
                )}
                <label className="absolute bottom-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/95 border border-border text-xs cursor-pointer hover:bg-background transition shadow-soft">
                  <ImagePlus className="w-3.5 h-3.5" />
                  {uploadingId === course.id
                    ? "上傳中…"
                    : course.course_image_url
                      ? "更換封面"
                      : "上傳封面"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingId === course.id}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadImage(course, f);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>名稱</Label>
              <Input
                value={course.title ?? ""}
                placeholder="例：即興入門 / 仲夏舞夜票券 / 排練室出租"
                onChange={(e) => updateLocal(course.id, { title: e.target.value })}
                onBlur={() => persist(course)}
              />
            </div>

            <div className="space-y-2">
              <Label>介紹</Label>
              <Textarea
                value={course.description ?? ""}
                rows={3}
                placeholder="這項服務想帶學員體驗什麼？"
                onChange={(e) => updateLocal(course.id, { description: e.target.value })}
                onBlur={() => persist(course)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>縣市</Label>
                <Select
                  value={course.region ?? ""}
                  onValueChange={(val) => {
                    updateLocal(course.id, { region: val });
                    persist({ ...course, region: val });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇縣市" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAIWAN_REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>適合年齡段</Label>
                <Input
                  value={course.age_range ?? ""}
                  placeholder="例：18-35 歲 / 親子 / 樂齡 55+"
                  onChange={(e) => updateLocal(course.id, { age_range: e.target.value })}
                  onBlur={() => persist(course)}
                />
              </div>
            </div>

            {/* Dynamic fields by service type */}
            {showAddress && (
              <div className="space-y-2">
                <Label>地點 / 地址</Label>
                <Input
                  value={course.location_address ?? ""}
                  placeholder="例：台北市中山區民生東路一段 X 號 3 樓 排練室 A"
                  onChange={(e) => updateLocal(course.id, { location_address: e.target.value })}
                  onBlur={() => persist(course)}
                />
              </div>
            )}
            {showOnline && (
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> 影片連結 / 教學平台連結
                </Label>
                <Input
                  type="url"
                  value={course.online_link ?? ""}
                  placeholder="https://vimeo.com/... 或 https://your-platform.com/course"
                  onChange={(e) => updateLocal(course.id, { online_link: e.target.value })}
                  onBlur={() => persist(course)}
                />
              </div>
            )}
            {showSession && (
              <div className="space-y-2">
                <Label>場次 / 座位資訊</Label>
                <Textarea
                  value={course.session_info ?? ""}
                  rows={3}
                  placeholder="例：2025/12/20 19:30 場 ｜ A 區自由入座 / B 區對號入座 100 席"
                  onChange={(e) => updateLocal(course.id, { session_info: e.target.value })}
                  onBlur={() => persist(course)}
                />
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>時間</Label>
                <Input
                  value={course.schedule ?? ""}
                  placeholder="週三 19:30"
                  onChange={(e) => updateLocal(course.id, { schedule: e.target.value })}
                  onBlur={() => persist(course)}
                />
              </div>
              <div className="space-y-2">
                <Label>堂數</Label>
                <Input
                  type="number"
                  min={1}
                  value={course.sessions_count ?? ""}
                  placeholder="例：8"
                  onChange={(e) =>
                    updateLocal(course.id, {
                      sessions_count: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  onBlur={() => persist(course)}
                />
              </div>
              <div className="space-y-2">
                <Label>程度</Label>
                <Input
                  value={course.level ?? ""}
                  placeholder="初級 / 中級 / 高級"
                  onChange={(e) => updateLocal(course.id, { level: e.target.value })}
                  onBlur={() => persist(course)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>價格</Label>
              <Input
                value={course.price ?? ""}
                placeholder="NT$ 1,200"
                onChange={(e) => updateLocal(course.id, { price: e.target.value })}
                onBlur={() => persist(course)}
              />
            </div>

            <div className="space-y-2">
              <Label>特別說明（補課、地址備註等）</Label>
              <Textarea
                value={course.notes ?? ""}
                rows={4}
                placeholder="例如：颱風停課改至線上 / 教室地址備註 / 補課政策…"
                onChange={(e) => updateLocal(course.id, { notes: e.target.value })}
                onBlur={() => persist(course)}
              />
            </div>

            {/* Persistent save / publish dual buttons */}
            <div className="sticky bottom-0 -mx-5 -mb-5 px-5 py-3 bg-background/95 backdrop-blur border-t border-border/60 rounded-b-2xl flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="lg"
                className="sm:flex-1"
                disabled={busyId === course.id}
                onClick={() => saveDraft(course)}
              >
                <FileText className="w-4 h-4" /> 儲存草稿
              </Button>
              <Button
                size="lg"
                className="sm:flex-1 text-white hover:opacity-90"
                style={{ backgroundColor: "#E63946" }}
                disabled={busyId === course.id}
                onClick={() => publish(course)}
              >
                <CheckCircle2 className="w-4 h-4" />
                {course.is_published ? "更新已發布內容" : "發布服務"}
              </Button>
            </div>
          </div>
        );
      })}

      <Button onClick={addCourse} variant="outline" size="lg" className="w-full">
        <Plus className="w-4 h-4" /> 新增服務
      </Button>
    </div>
  );
}
