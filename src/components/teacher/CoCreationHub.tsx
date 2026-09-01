import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/teacher/SectionCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SEED_VIDEO_TARGET, readSeedVideoStats } from "@/data/coCreationPrograms";

interface SeedStats {
  total: number;
  published: number;
}

const SEED_TOPIC_SUGGESTIONS = [
  "一段入門教學",
  "經典舞步解析",
  "常見錯誤與修正",
  "核心技巧練習",
  "身體運用觀念",
  "節奏與音樂掌握",
  "舞蹈文化小知識",
  "您最希望初學者先理解的一件事",
];

const SEED_FILMING_CHECKLIST = [
  "已完成自我介紹",
  "已說明舞蹈特色",
  "已示範 1–2 個基礎動作",
  "已安排跟跳練習",
  "已確認收音清楚",
  "已確認全身入鏡",
  "已確認影片長度 5–8 分鐘",
];

function ProgressBar({ pct, className = "" }: { pct: number; className?: string }) {
  return (
    <div className={`h-2 rounded-full bg-[#E89B5C]/15 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${Math.min(100, Math.max(0, pct))}%`,
          background: "linear-gradient(90deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)",
        }}
      />
    </div>
  );
}

/** 低調的點擊展開／收合區塊，預設收合 */
function Collapsible({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B25C2E] hover:text-[#C9461E] transition-colors"
        aria-expanded={open}
      >
        <span className="text-[#E89B5C]">{open ? "−" : "＋"}</span>
        <span>{label}</span>
      </button>
      {open && <div className="mt-2 pl-1">{children}</div>}
    </div>
  );
}

export function CoCreationHub() {
  const { user } = useAuth();
  const [seed, setSeed] = useState<SeedStats>({ total: 0, published: 0 });

  useEffect(() => {
    setSeed(readSeedVideoStats(user?.id));
  }, [user?.id]);

  const seedPct = Math.min(
    100,
    Math.round((seed.published / SEED_VIDEO_TARGET) * 100)
  );
  const seedCta = seed.total > 0 ? "繼續管理" : "開始建立";

  return (
    <div id="co-creation" className="scroll-mt-24">
      <SectionCard
        eyebrow="CO-CREATION PROGRAMS"
        title={
          <span className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-[#E89B5C]/15 text-2xl text-foreground flex items-center justify-center">
              🤝
            </span>
            聚落共創
          </span>
        }
        description="與舞島咖一起分享舞蹈、推廣文化，讓每一次共創，都成為彼此成長的力量。"
      >
        <ol className="flex flex-col gap-0">
          {/* ── 主題一：種子短片 ── */}
          <li className="py-5 border-b border-[#E89B5C]/15">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">🌱</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] text-muted-foreground">1</span>
                  <h3 className="font-display text-base md:text-lg text-foreground">
                    種子短片
                  </h3>
                </div>
                <p className="text-xs text-[#B25C2E] font-medium mt-0.5 leading-relaxed">
                  一支短片、一顆種子，共築舞島聚落。
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
                  您的每一次分享，都是舞島咖會員典藏的重要養分；逐步累積自己的數位資產，也讓更多人認識並愛上這門舞蹈。
                </p>

                {/* 進度與行動 */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        目前進度
                      </span>
                      <span className="text-xs text-foreground">
                        {seed.published}{" "}
                        <span className="text-muted-foreground">
                          / {SEED_VIDEO_TARGET} 支
                        </span>
                      </span>
                    </div>
                    <ProgressBar pct={seedPct} />
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="justify-between text-white shadow-sm md:w-40 shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)",
                    }}
                  >
                    <Link to="/teacher/co-creation/seed-videos">
                      {seedCta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                {/* 輔助說明：預設收合 */}
                <div className="flex flex-col gap-2.5 mt-4">
                  <Collapsible label="短片建議">
                    <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                      您可以自由選擇分享：
                    </p>
                    <ul className="grid grid-cols-1 gap-y-1.5 text-xs text-foreground/85">
                      {SEED_TOPIC_SUGGESTIONS.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-1.5 leading-relaxed"
                        >
                          <span className="text-[#2E8B57] mt-px">✅</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Collapsible>
                  <Collapsible label="拍攝檢查清單">
                    <ul className="grid grid-cols-1 gap-y-1.5 text-xs text-foreground/85">
                      {SEED_FILMING_CHECKLIST.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-1.5 leading-relaxed"
                        >
                          <span className="inline-block w-3.5 h-3.5 mt-px rounded border border-[#E89B5C]/60 bg-white shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Collapsible>
                </div>
              </div>
            </div>
          </li>

          {/* ── 主題二：特別企劃 ── */}
          <li className="py-5 border-b border-[#E89B5C]/15">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">🎤</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] text-muted-foreground">2</span>
                  <h3 className="font-display text-base md:text-lg text-foreground">
                    特別企劃
                  </h3>
                </div>
                <p className="text-xs text-[#B25C2E] font-medium mt-0.5 leading-relaxed">
                  跨界合作 × 分享故事，放大品牌影響力。
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
                  透過文化企劃、跨域合作與品牌專訪，讓更多人認識您的理念與舞蹈文化。
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#FFF5E6]/80 text-[#B25C2E] border border-[#E89B5C]/25 mt-3">
                  🔒 敬請期待
                </span>
              </div>
            </div>
          </li>

          {/* ── 主題三：島咖徽章 ── */}
          <li className="py-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">🏅</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] text-muted-foreground">3</span>
                  <h3 className="font-display text-base md:text-lg text-foreground">
                    島咖徽章
                  </h3>
                </div>
                <p className="text-xs text-[#B25C2E] font-medium mt-0.5 leading-relaxed">
                  累積信任，成就品牌價值。
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
                  您的每一次參與，都是品牌成長的足跡，也成為聚落共同前行的見證。
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#FFF5E6]/80 text-[#B25C2E] border border-[#E89B5C]/25 mt-3">
                  🔒 敬請期待
                </span>
              </div>
            </div>
          </li>
        </ol>
      </SectionCard>
    </div>
  );
}
