import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "隱藏密碼" : "顯示密碼"}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground hover:text-foreground transition-colors rounded-r-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export interface PasswordStrengthRule {
  label: string;
  test: (v: string) => boolean;
}

export const defaultPasswordRules: PasswordStrengthRule[] = [
  { label: "至少 8 個字元", test: (v) => v.length >= 8 },
  { label: "包含至少一個大寫英文字母", test: (v) => /[A-Z]/.test(v) },
  { label: "包含至少一個數字或特殊符號", test: (v) => /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(v) },
];

export function isPasswordStrong(v: string, rules: PasswordStrengthRule[] = defaultPasswordRules) {
  return rules.every((r) => r.test(v));
}

interface PasswordStrengthMeterProps {
  value: string;
  rules?: PasswordStrengthRule[];
  className?: string;
}

export function PasswordStrengthMeter({
  value,
  rules = defaultPasswordRules,
  className,
}: PasswordStrengthMeterProps) {
  const results = rules.map((r) => r.test(value));
  const passed = results.filter(Boolean).length;
  const total = rules.length;
  const pct = value.length === 0 ? 0 : Math.round((passed / total) * 100);

  const level =
    passed === 0 ? { label: "請輸入密碼", color: "bg-muted-foreground/30", text: "text-muted-foreground" } :
    passed === 1 ? { label: "弱", color: "bg-[#E8A87C]", text: "text-[#C97B5C]" } :
    passed === 2 ? { label: "中", color: "bg-[#D4A574]", text: "text-[#A8763E]" } :
                   { label: "強", color: "bg-[#7FA988]", text: "text-[#5C8268]" };

  return (
    <div className={cn("space-y-2 pt-1", className)}>
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300 rounded-full", level.color)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={cn("text-xs font-medium tabular-nums", level.text)}>{level.label}</span>
      </div>
      <ul className="space-y-1">
        {rules.map((r, i) => {
          const ok = results[i];
          return (
            <li
              key={r.label}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                ok ? "text-[#5C8268]" : "text-muted-foreground/70",
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center h-3.5 w-3.5 rounded-full border text-[10px] leading-none transition-colors",
                  ok
                    ? "bg-[#7FA988] border-[#7FA988] text-white"
                    : "border-muted-foreground/30 bg-transparent",
                )}
              >
                {ok ? "✓" : ""}
              </span>
              <span>{r.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { PasswordInput };
