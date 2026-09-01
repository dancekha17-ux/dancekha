import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowRight, ArrowDown } from "lucide-react";
import { SectionCard } from "@/components/teacher/SectionCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  CO_CREATION_PROGRAMS,
  CO_CREATION_TOTAL_MILESTONES,
  SEED_VIDEO_TARGET,
  readSeedVideoStats,
} from "@/data/coCreationPrograms";

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

export function CoCreationHub() {
  const { user } = useAuth();
  const [seed, setSeed] = useState<SeedStats>({ total: 0, published: 0 });

  useEffect(() => {
    setSeed(readSeedVideoStats(user?.id));
  }, [user?.id]);

  const seedDone = seed.published >= SEED_VIDEO_TARGET;
  // 目前只有「種子短片」階段可以實際完成，其餘階段待平台逐步開放。
  const completedMilestones = seedDone ? 1 : 0;
  const milestonePct = Math.round(
    (completedMilestones / CO_CREATION_TOTAL_MILESTONES) * 100
  );
  const nextStep = seedDone
    ? "⭐ 等待列入島咖精選推薦"
    : `🌱 完成 ${SEED_VIDEO_TARGET} 支種子短片`;

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
        {/* Dashboard Hero Card — 聚落共創進度 */}
        <section
          className="rounded-3xl p-6 md:p-8 mb-8 shadow-soft relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#FDF6ED 0%,#F8E9D4 100%)",
            border: "1px solid rgba(232,155,92,0.25)",
          }}
        >
          <span className="eyebrow">MY CO-CREATION PROGRESS</span>
          <h3 className="font-display text-xl md:text-2xl text-foreground mt-2">
            我的聚落進度
          </h3>

          <div className="flex items-baseline justify-between flex-wrap gap-2 mt-5 mb-2">
            <span className="text-sm text-foreground">
              目前完成{" "}
              <span className="font-display text-lg text-[#C9461E]">
                {completedMilestones}
              </span>
              <span className="text-muted-foreground">
                {" "}
                / {CO_CREATION_TOTAL_MILESTONES} 個共創里程碑
              </span>
            </span>
            <span className="text-xs text-muted-foreground">{milestonePct}%</span>
          </div>
          <ProgressBar pct={milestonePct} />

          <p className="text-sm text-foreground/80 mt-5 leading-relaxed">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground block mb-1">
              下一步
            </span>
            {nextStep}
          </p>
        </section>

        {/* 成長旅程：依序完成的五個階段 */}
        <ol className="flex flex-col gap-0">
          {CO_CREATION_PROGRAMS.map((p, idx) => {
            const isActive = p.status === "active" && !!p.href;
            const isSeed = p.id === "seed-videos";

            const seedPct = Math.min(
              100,
              Math.round((seed.published / SEED_VIDEO_TARGET) * 100)
            );
            const seedCta = seed.total > 0 ? "繼續管理" : "開始建立";

            return (
              <li key={p.id}>
                {idx > 0 && (
                  <div className="flex justify-center py-1 text-[#E89B5C]/70" aria-hidden>
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={[
                    "group rounded-2xl border p-5 md:p-6 transition-all relative",
                    isActive
                      ? "border-[#E89B5C]/40 bg-white/70 hover:border-[#E36435] hover:shadow-soft"
                      : "border-[#E89B5C]/20 bg-[#FFF8F0]/60",
                  ].join(" ")}
                >
                  {/* Step index badge */}
                  <span
                    className={[
                      "absolute -top-2 -left-2 w-6 h-6 rounded-full border text-[11px] font-display flex items-center justify-center shadow-sm",
                      isActive
                        ? "bg-white border-[#E89B5C]/40 text-[#B25C2E]"
                        : "bg-white/80 border-[#E89B5C]/30 text-[#E89B5C]",
                    ].join(" ")}
                  >
                    {idx + 1}
                  </span>

                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    {/* 左側：標題與狀態 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl leading-none">{p.emoji}</span>
                          <div>
                            <h3 className="font-display text-base md:text-lg text-foreground">
                              {p.title}
                            </h3>
                            <p className="text-xs text-[#B25C2E] font-medium mt-0.5 leading-relaxed">
                              {p.subtitle}
                            </p>
                          </div>
                        </div>
                        {!isActive && (
                          <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#FFF5E6]/80 text-[#B25C2E] border border-[#E89B5C]/25 shrink-0">
                            🔒 尚未解鎖
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-3 leading-relaxed whitespace-pre-line">
                        {isActive ? p.description : p.lockedMessage ?? p.description}
                      </p>
                      {isActive && (
                        <p className="text-[11px] text-muted-foreground/80 mt-2 leading-relaxed">
                          完成本階段，即可逐步解鎖下一個共創機會。
                        </p>
                      )}
                    </div>

                    {/* 右側：種子短片的進度與行動 */}
                    {isSeed && (
                      <div className="w-full md:w-72 shrink-0 flex flex-col gap-3">
                        <div className="rounded-xl bg-[#FFF5E6] border border-[#E89B5C]/25 p-3">
                          <div className="flex items-baseline justify-between">
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
                          <ProgressBar pct={seedPct} className="mt-2" />
                        </div>

                        <Button
                          asChild
                          size="sm"
                          className="w-full justify-between text-white shadow-sm"
                          style={{
                            background:
                              "linear-gradient(135deg,#E89B5C 0%,#E36435 60%,#C9461E 100%)",
                          }}
                        >
                          <Link to={p.href!}>
                            {seedCta}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* 種子短片：短片建議 + 拍攝檢查清單 */}
                  {isSeed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                      <div className="rounded-xl bg-white/70 border border-[#E89B5C]/20 p-4">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                          短片建議
                        </p>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          您可以自由選擇分享：
                        </p>
                        <ul className="grid grid-cols-1 gap-y-1.5 text-xs text-foreground/85">
                          {SEED_TOPIC_SUGGESTIONS.map((item) => (
                            <li key={item} className="flex items-start gap-1.5 leading-relaxed">
                              <span className="text-[#2E8B57] mt-px">✅</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl bg-white/70 border border-[#E89B5C]/20 p-4">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2.5">
                          🌱 拍攝檢查清單
                        </p>
                        <ul className="grid grid-cols-1 gap-y-1.5 text-xs text-foreground/85">
                          {SEED_FILMING_CHECKLIST.map((item) => (
                            <li key={item} className="flex items-start gap-1.5 leading-relaxed">
                              <span className="inline-block w-3.5 h-3.5 mt-px rounded border border-[#E89B5C]/60 bg-white shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </SectionCard>
    </div>
  );
}
