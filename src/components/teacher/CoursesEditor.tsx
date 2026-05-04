import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
}

interface Props {
  teacherId: string;
}

export function CoursesEditor({ teacherId }: Props) {
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);

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
      .insert({ teacher_id: teacherId, sort_order: courses.length })
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

  const persist = async (course: CourseRow) => {
    const { error } = await (supabase as any)
      .from("instructor_courses")
      .update({
        title: course.title,
        description: course.description,
        schedule: course.schedule,
        level: course.level,
        price: course.price,
      })
      .eq("id", course.id);
    if (error) toast({ title: "儲存失敗", description: error.message, variant: "destructive" });
  };

  if (loading) return <p className="text-sm text-muted-foreground">載入課程中…</p>;

  return (
    <div className="space-y-5">
      {courses.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          還沒有課程。新增第一堂，邀請學員走進你的舞蹈世界。
        </p>
      )}
      {courses.map((course) => (
        <div
          key={course.id}
          className="rounded-2xl border border-border/60 bg-background/50 p-5 space-y-4"
        >
          <div className="flex items-start justify-between">
            <GripVertical className="w-4 h-4 text-muted-foreground/50 mt-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCourse(course.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label>課程名稱</Label>
            <Input
              value={course.title}
              placeholder="例：即興入門"
              onChange={(e) => updateLocal(course.id, { title: e.target.value })}
              onBlur={() => persist(course)}
            />
          </div>
          <div className="space-y-2">
            <Label>課程介紹</Label>
            <Textarea
              value={course.description}
              rows={3}
              placeholder="這堂課想帶學員體驗什麼？"
              onChange={(e) => updateLocal(course.id, { description: e.target.value })}
              onBlur={() => persist(course)}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>時間</Label>
              <Input
                value={course.schedule}
                placeholder="週三 19:30"
                onChange={(e) => updateLocal(course.id, { schedule: e.target.value })}
                onBlur={() => persist(course)}
              />
            </div>
            <div className="space-y-2">
              <Label>程度</Label>
              <Input
                value={course.level}
                placeholder="初級 / 中級 / 高級"
                onChange={(e) => updateLocal(course.id, { level: e.target.value })}
                onBlur={() => persist(course)}
              />
            </div>
            <div className="space-y-2">
              <Label>價格</Label>
              <Input
                value={course.price}
                placeholder="NT$ 1,200"
                onChange={(e) => updateLocal(course.id, { price: e.target.value })}
                onBlur={() => persist(course)}
              />
            </div>
          </div>
        </div>
      ))}
      <Button onClick={addCourse} variant="outline" size="lg" className="w-full">
        <Plus className="w-4 h-4" /> 新增課程
      </Button>
    </div>
  );
}
