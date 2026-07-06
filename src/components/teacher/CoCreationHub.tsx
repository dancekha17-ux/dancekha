import { Link } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/teacher/SectionCard";
import { Button } from "@/components/ui/button";
import { CO_CREATION_PROGRAMS } from "@/data/coCreationPrograms";

export function CoCreationHub() {
  return (
    <div id="co-creation" className="scroll-mt-24">
      <SectionCard
        eyebrow="Co-Creation Programs"
        title={
          <span className="flex items-center gap-2">
            🤝 聚落共創
          </span>
        }
        description="與舞島咖攜手推廣世界舞蹈文化，透過內容分享、品牌合作與文化交流，累積品牌影響力，讓更多人認識您的專業與故事。"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CO_CREATION_PROGRAMS.map((p) => {
            const isActive = p.status === "active" && !!p.href;
            const Card = (
              <div
                className={[
                  "group h-full rounded-2xl border p-5 flex flex-col gap-3 transition-all bg-white/70",
                  isActive
                    ? "border-[#E89B5C]/40 hover:border-[#E36435] hover:shadow-soft hover:-translate-y-0.5 cursor-pointer"
                    : "border-border/50 opacity-70",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl leading-none">{p.emoji}</span>
                  {!isActive && (
                    <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                      <Lock className="w-3 h-3" /> Coming Soon
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {p.description}
                  </p>
                </div>
                {isActive ? (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full justify-between bg-white/80 border-[#E89B5C]/40 hover:bg-[#E89B5C]/10"
                  >
                    <Link to={p.href!}>
                      {p.ctaLabel ?? "查看 / 管理"}
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
                    敬請期待
                  </Button>
                )}
              </div>
            );
            return isActive ? (
              <Link
                key={p.id}
                to={p.href!}
                aria-label={`${p.title} - ${p.ctaLabel ?? "查看"}`}
                className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E89B5C] rounded-2xl"
              >
                {Card}
              </Link>
            ) : (
              <div key={p.id}>{Card}</div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
