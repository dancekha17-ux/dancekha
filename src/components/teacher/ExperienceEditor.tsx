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
      <Label>經歷與獎項</Label>
      <div className="space-y-2">
        {values.map((v, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              value={v}
              maxLength={40}
              placeholder="例：5 年兒童舞蹈教學經驗"
              onChange={(e) => updateAt(idx, e.target.value)}
            />
            <span className="text-[10px] text-muted-foreground w-10 text-right tabular-nums">
              {v.length}/40
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeAt(idx)}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="mt-2"
      >
        <Plus className="w-4 h-4" /> 新增經歷／獎項
      </Button>
      <p className="text-xs text-muted-foreground">
        請用精簡的條列式呈現您的含金量（例：5年兒童舞蹈教學經驗 / 雲門舞集巡演編舞助理），讓學員一秒抓到重點！
      </p>
    </div>
  );
}
