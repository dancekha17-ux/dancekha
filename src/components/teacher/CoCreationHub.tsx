import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowRight, Sparkles } from "lucide-react";
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

  // Milestone tally — currently only "種子短片" milestone is measurable.
  const seedComplete = seed.published >= SEED_VIDEO_TARGET;
  const completedMilestones = seedComplete ? 1 : 0;
  const overallPct = Math.round(
    (completedMilestones / CO_CREATION_TOTAL_MILESTONES) * 100
  );

  const nextStep = seedComplete
    ? "⭐ 持續累積作品，等待島咖精選推薦"
    : `🌱 完成 ${SEED_VIDEO_TARGET} 支種子短片`;

  return (
    <div id="co-creation" className="scroll-mt-24">
      <SectionCard
        eyebrow="CO-CREATION PROGRAMS"
        title={
          <span className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-[#E89B5C]/15 text-2xl flex items-center justify-center">
              🤝
            </span>
            聚落共創
          </span>
        }
        description="這裡不只是功能專區，更是陪伴每位引導者持續發光的旅程。完成每一個共創里程碑，逐步累積品牌影響力，與舞島咖一起推廣舞蹈文化，讓更多人因您的舞步而受到啟發。"
      >
        {/* Journey summary hero card */}
        <section
          className="rounded-3xl border border-[#E89B5C]/30 p-6 md:p-8 shadow-soft relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(232,155,92,0.10) 0%, rgba(255,245,230,0.6) 55%, rgba(255,255,255,0.6) 100%)",
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <span className="eyebrow">MY CO-CREATION JOURNEY</span>
              <h2 className="font-display text-xl md:text-2xl text-foreground mt-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E36435]" />
                我的聚落進度
              </h2>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-3xl text-[#B25C2E] leading-none">
                {overallPct}
                <span className="text-lg">%</span>
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                Progress
              </p>
            </div>
          </div>

          <ProgressBar pct={overallPct} className="mt-5 h-2.5" />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/70 border border-border/50 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                目前完成
              </p>
              <p className="font-display text-lg text-foreground mt-1">
                {completedMilestones}{" "}
                <span className="text-muted-foreground text-sm">
                  / {CO_CREATION_TOTAL_MILESTONES} 個共創里程碑
                </span>
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 border border-border/50 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                下一步
              </p>
              <p className="text-sm text-foreground mt-1 leading-relaxed">{nextStep}</p>
            </div>
          </div>
        </section>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {CO_CREATION_PROGRAMS.map((p, idx) => {
            const isActive = p.status === "active" && !!p.href;
            const isSeed = p.id === "seed-videos";

            // Seed-specific dynamic CTA + progress
            const seedPct = Math.min(
              100,
              Math.round((seed.published / SEED_VIDEO_TARGET) * 100)
            );
            const seedCta =
              seed.total > 0 ? "繼續管理" : p.ctaLabel ?? "開始建立";

            return (
              <li key={p.id} className="h-full">
                <div
                  className={[
                    "group h-full rounded-2xl border p-5 flex flex-col gap-3 transition-all bg-white/70 relative",
                    isActive
                      ? "border-[#E89B5C]/40 hover:border-[#E36435] hover:shadow-soft hover:-translate-y-0.5"
                      : "border-border/50",
                  ].join(" ")}
                >
                  {/* Step index badge */}
                  <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white border border-[#E89B5C]/40 text-[11px] font-display text-[#B25C2E] flex items-center justify-center shadow-sm">
                    {idx + 1}
                  </span>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl leading-none">{p.emoji}</span>
                    {!isActive && (
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        <Lock className="w-3 h-3" /> 尚未解鎖
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base text-foreground">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {isActive ? p.description : p.lockedMessage ?? p.description}
                    </p>

                    {isSeed && (
                      <div className="mt-3 rounded-xl bg-[#FFF5E6] border border-[#E89B5C]/25 p-3">
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
                    )}
                  </div>

                  {isActive ? (
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
                        {isSeed ? seedCta : p.ctaLabel ?? "查看 / 管理"}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="w-full justify-center opacity-70"
                    >
                      <Lock className="w-3.5 h-3.5" /> 尚未解鎖
                    </Button>
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
