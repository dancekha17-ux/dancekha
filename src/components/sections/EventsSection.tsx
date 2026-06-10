import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Clock, Users, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { RegistrationDialog } from "@/components/RegistrationDialog";

function formatDate(iso: string | null) {
  if (!iso) return { day: "—", month: "—", time: "" };
  const d = new Date(iso);
  return {
    day: String(d.getDate()),
    month: `${d.getMonth() + 1}月`,
    time: d.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false }),
    full: d.toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" }),
  } as { day: string; month: string; time: string; full: string };
}

export function EventsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: events, loading } = useEvents("event");
  const [selected, setSelected] = useState<{ id: string; title: string } | null>(null);

  return (
    <section id="events" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container-wide mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 mb-12 md:mb-16 pb-6 md:pb-8 border-b border-border"
        >
          <div>
            <span className="eyebrow">Events · 活動行事曆</span>
            <h2 className="text-fluid-h1 font-display font-medium text-foreground mt-6">
              即將到來的<span className="text-accent-italic">精彩時刻</span>
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-body transition-colors">
            查看完整行事曆
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {loading ? (
          <p className="text-center text-muted-foreground py-16">載入活動中…</p>
        ) : events.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">目前尚未有上架活動，敬請期待。</p>
        ) : (
          <div className="space-y-6">
            {events.map((event, index) => {
              const dt = formatDate(event.starts_at);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
                  className={`group card-elevated p-6 md:p-8 hover:shadow-elevated transition-all duration-500 ${
                    event.is_featured ? "ring-2 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex lg:flex-col items-center gap-4 lg:gap-1 lg:w-24 shrink-0">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-2xl lg:text-3xl font-display font-semibold text-primary">{dt.day}</span>
                        <span className="text-xs text-primary/70 font-body">{dt.month}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          event.is_online ? "bg-soul/10 text-soul" : "bg-success/10 text-success"
                        }`}>
                          {event.category || (event.is_online ? "線上" : "現場")}
                        </span>
                        {event.is_featured && (
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            精選推薦
                          </span>
                        )}
                        {event.tags?.filter(t => t !== event.category).slice(0, 2).map(t => (
                          <span key={t} className="inline-block px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full text-[11px] font-body">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-fluid-h3 font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-body">
                        {dt.time && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {dt.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1.5">
                            {event.is_online ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                            {event.location}
                          </span>
                        )}
                        {event.total_spots !== null && (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            剩餘 {event.spots_left ?? "—"} / {event.total_spots} 名額
                          </span>
                        )}
                        {event.fee && (
                          <span className="flex items-center gap-1.5 text-primary">
                            {event.fee}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="lg:shrink-0">
                      <Button
                        variant={event.is_featured ? "hero" : "outline"}
                        size="lg"
                        className="w-full lg:w-auto"
                        onClick={() => setSelected({ id: event.id, title: event.title })}
                      >
                        立即報名
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <RegistrationDialog
          open={!!selected}
          onOpenChange={(o) => !o && setSelected(null)}
          eventId={selected.id}
          eventTitle={selected.title}
        />
      )}
    </section>
  );
}
