import { useState, type KeyboardEvent, type ReactNode } from "react";
import { X } from "lucide-react";
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
  const [draft, setDraft] = useState("");

  const toneClass =
    pillTone === "soul"
      ? "bg-soul/10 text-soul"
      : pillTone === "accent"
        ? "bg-accent/10 text-accent"
        : "bg-primary/10 text-primary";

  const commit = (raw: string) => {
    const parts = raw
      .split(/[,，、]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...values];
    parts.forEach((p) => {
      if (!next.includes(p)) next.push(p);
    });
    onChange(next);
  };

  const handleChange = (v: string) => {
    if (/[,，、]/.test(v)) {
      commit(v);
      setDraft("");
      return;
    }
    setDraft(v);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit(draft);
      setDraft("");
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const remove = (tag: string) => onChange(values.filter((v) => v !== tag));

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          commit(draft);
          setDraft("");
        }}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {values.map((s) => (
            <span
              key={s}
              className={`inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs ${toneClass}`}
            >
              {s}
              <button
                type="button"
                aria-label={`移除 ${s}`}
                onClick={() => remove(s)}
                className="rounded-full p-0.5 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
