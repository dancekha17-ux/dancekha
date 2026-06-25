import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  values: string[];
  onChange: (next: string[]) => void;
}

export function ExperienceEditor({ values, onChange }: Props) {
  const updateAt = (idx: number, val: string) => {
    const next = [...values];
    next[idx] = val.slice(0, 40);
    onChange(next);
  };
  const removeAt = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };
  const add = () => onChange([...values, ""]);

  return (
    <div className="space-y-2">
      <Label>經歷/獎項/證照</Label>
...
        className="mt-2"
      >
        <Plus className="w-4 h-4" /> 新增經歷／獎項／證照
      </Button>
      <p className="text-xs text-muted-foreground">
        請用精簡的條列式呈現您的含金量（例：5年兒童舞蹈教學經驗 / 雲門舞集巡演編舞助理），讓學員一秒抓到重點！
      </p>
    </div>
  );
}
