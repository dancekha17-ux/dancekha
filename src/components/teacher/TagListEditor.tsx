import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  id: string;
  label: ReactNode;
  values: string[];
  placeholder?: string;
  onChange: (next: string[]) => void;
  hint?: string;
  pillTone?: "primary" | "soul" | "accent";
}

export function TagListEditor({
  id,
  label,
  values,
  placeholder,
  onChange,
  hint,
  pillTone = "primary",
}: Props) {
  const text = values.join(", ");
  const toneClass =
    pillTone === "soul"
      ? "bg-soul/10 text-soul"
      : pillTone === "accent"
      ? "bg-accent/10 text-accent"
      : "bg-primary/10 text-primary";

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={text}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {values.map((s) => (
            <span key={s} className={`px-3 py-1 rounded-full text-xs ${toneClass}`}>
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
