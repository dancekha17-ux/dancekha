import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/teacher/SectionCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  CO_CREATION_PROGRAMS,
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
        description="這裡不只是功能專區，更是陪伴每位引導者持續發光的旅程。完成每一個共創里程碑，逐步累積品牌影響力，與舞島咖一起推廣舞蹈文化，讓更多人因您的舞步而受到啟發。"
      >
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CO_CREATION_PROGRAMS.map((p, idx) => {
            const isActive = p.status === "active" && !!p.href;
            const isSeed = p.id === "seed-videos";

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
                    "group h-full rounded-2xl border p-5 md:p-6 flex flex-col gap-3 transition-all bg-white/70 relative",
                    isActive
                      ? "border-[#E89B5C]/40 hover:border-[#E36435] hover:shadow-soft hover:-translate-y-0.5"
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

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl leading-none">{p.emoji}</span>
                    {!isActive && (
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.16em] uppercase px-2 py-0.5 rounded-full bg-[#FFF5E6]/80 text-[#B25C2E] border border-[#E89B5C]/20">
                        <Lock className="w-3 h-3" /> Coming Soon
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col">
                    <h3 className="font-display text-base text-foreground">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#B25C2E] font-medium mt-1 leading-relaxed">
                      {p.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {isActive ? p.description : p.lockedMessage ?? p.description}
                    </p>

                    {isSeed && (
                      <div className="mt-4 rounded-xl bg-[#FFF5E6] border border-[#E89B5C]/25 p-3">
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
                      className="w-full justify-center bg-white/50 border-[#E89B5C]/20 text-[#B25C2E]/80 opacity-70 hover:opacity-100"
                    >
                      <Lock className="w-3 h-3 mr-1" /> 敬請期待
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
