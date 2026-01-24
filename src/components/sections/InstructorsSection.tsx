import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram, Youtube, Star } from "lucide-react";
import instructor1 from "@/assets/instructor-1.jpg";
import instructor2 from "@/assets/instructor-2.jpg";
import instructor3 from "@/assets/instructor-3.jpg";

const instructors = [
  {
    name: "林雅琪",
    nameEn: "Yachi Lin",
    specialty: "現代舞 / 即興舞蹈",
    image: instructor1,
    bio: "擁有15年舞蹈教學經驗，相信舞蹈是最直接的情感表達方式。",
    rating: 4.9,
    students: 320,
  },
  {
    name: "陳俊宏",
    nameEn: "Jun Hong Chen",
    specialty: "街舞 / Hip-Hop",
    image: instructor2,
    bio: "國際街舞大賽冠軍，致力於讓街舞文化在台灣扎根發芽。",
    rating: 4.8,
    students: 450,
  },
  {
    name: "張美玲",
    nameEn: "Mei Ling Chang",
    specialty: "國標舞 / 樂齡律動",
    image: instructor3,
    bio: "專注於樂齡舞蹈教學，證明年齡從來不是舞動的限制。",
    rating: 5.0,
    students: 180,
  },
];

export function InstructorsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="instructors"
      className="section-padding bg-secondary/30"
      ref={ref}
    >
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-body text-sm tracking-widest uppercase mb-4">
            創生軸心
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-6">
            用生命跳舞的<span className="text-gradient">舞蹈家們</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            我們的師資不只是技術精湛的專業者，更是懂得傾聽、願意陪伴的引路人。
            每一位老師都帶著獨特的故事與風格，等待與你相遇。
          </p>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 * (index + 1) }}
              className="group"
            >
              <div className="card-elevated overflow-hidden hover:shadow-elevated transition-all duration-500">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

                  {/* Social Links */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href="#"
                      className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-display font-semibold text-primary-foreground">
                      {instructor.name}
                    </h3>
                    <p className="text-sm text-primary-foreground/70 font-body">
                      {instructor.nameEn}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {instructor.specialty}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
                    {instructor.bio}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{instructor.rating}</span>
                    </div>
                    <span className="text-muted-foreground font-body">
                      {instructor.students} 位學員
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary font-medium flow-line hover:gap-3 transition-all"
          >
            探索所有師資
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
