import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: 1,
    title: "2025 春季國際舞蹈工作坊",
    date: "2025年3月15日",
    time: "09:00 - 18:00",
    location: "台北文創園區",
    type: "工作坊",
    isOnline: false,
    spots: 50,
    spotsLeft: 12,
    featured: true,
  },
  {
    id: 2,
    title: "線上大師班：當代舞即興創作",
    date: "2025年2月28日",
    time: "19:30 - 21:00",
    location: "Zoom 線上",
    type: "大師班",
    isOnline: true,
    spots: 100,
    spotsLeft: 45,
  },
  {
    id: 3,
    title: "舞島咖春日派對",
    date: "2025年4月5日",
    time: "14:00 - 20:00",
    location: "舞島咖總部",
    type: "社群活動",
    isOnline: false,
    spots: 80,
    spotsLeft: 28,
  },
];

export function EventsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="events"
      className="section-padding bg-secondary/30"
      ref={ref}
    >
      <div className="container-wide mx-auto">
        {/* Header */}
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
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-body transition-colors"
          >
            查看完整行事曆
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
              className={`group card-elevated p-6 md:p-8 hover:shadow-elevated transition-all duration-500 ${
                event.featured ? "ring-2 ring-primary/20" : ""
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Date Block */}
                <div className="flex lg:flex-col items-center gap-4 lg:gap-1 lg:w-24 shrink-0">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-primary/10 flex flex-col items-center justify-center">
                    <span className="text-2xl lg:text-3xl font-display font-semibold text-primary">
                      {event.date.split("月")[1]?.split("日")[0]}
                    </span>
                    <span className="text-xs text-primary/70 font-body">
                      {event.date.split("年")[1]?.split("月")[0]}月
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        event.isOnline
                          ? "bg-soul/10 text-soul"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {event.type}
                    </span>
                    {event.featured && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        精選推薦
                      </span>
                    )}
                  </div>

                  <h3 className="text-fluid-h3 font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-body">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      剩餘 {event.spotsLeft} / {event.spots} 名額
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="lg:shrink-0">
                  <Button
                    variant={event.featured ? "hero" : "outline"}
                    size="lg"
                    className="w-full lg:w-auto"
                  >
                    立即報名
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
