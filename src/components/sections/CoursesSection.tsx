import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Clock, Users, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", label: "全部課程" },
  { id: "beginner", label: "零基礎入門" },
  { id: "contemporary", label: "現代舞" },
  { id: "street", label: "中國舞" },
  { id: "latin", label: "拉丁舞" },
  { id: "senior", label: "樂齡律動" },
  { id: "eastern-europe", label: "東歐與中歐" },
  { id: "balkans", label: "巴爾幹與南歐" },
  { id: "mideast", label: "中東與地中海" },
];

const courses = [
  {
    id: 1,
    title: "零基礎｜身體開啟工作坊",
    category: "beginner",
    instructor: "林雅琪",
    duration: "90分鐘",
    students: 156,
    price: "NT$ 800",
    isOnline: true,
    isFeatured: true,
    gradient: "from-primary/20 to-accent/10",
  },
  {
    id: 2,
    title: "中國民間舞蹈",
    category: "street",
    instructor: "陳俊宏",
    duration: "60分鐘",
    students: 234,
    price: "NT$ 650",
    isOnline: false,
    gradient: "from-soul/20 to-primary/10",
  },
  {
    id: 3,
    title: "現代舞｜流動的詩",
    category: "contemporary",
    instructor: "林雅琪",
    duration: "120分鐘",
    students: 89,
    price: "NT$ 1,200",
    isOnline: true,
    gradient: "from-success/20 to-accent/10",
  },
  {
    id: 4,
    title: "樂齡身心律動",
    category: "senior",
    instructor: "張美玲",
    duration: "45分鐘",
    students: 67,
    price: "NT$ 500",
    isOnline: false,
    gradient: "from-accent/20 to-primary/10",
  },
  {
    id: 5,
    title: "騷莎入門：讓身體說話",
    category: "latin",
    instructor: "Carlos Martinez",
    duration: "75分鐘",
    students: 123,
    price: "NT$ 750",
    isOnline: true,
    gradient: "from-primary/20 to-soul/10",
  },
  {
    id: 6,
    title: "Popping & Locking 進階",
    category: "street",
    instructor: "陳俊宏",
    duration: "90分鐘",
    students: 78,
    price: "NT$ 900",
    isOnline: false,
    gradient: "from-soul/20 to-success/10",
  },
  {
    id: 7,
    title: "烏克蘭民俗舞｜大地的迴旋",
    category: "eastern-europe",
    instructor: "Olena Kovalenko",
    duration: "90分鐘",
    students: 42,
    price: "NT$ 950",
    isOnline: false,
    gradient: "from-primary/20 to-soul/10",
  },
  {
    id: 8,
    title: "西班牙佛朗明哥｜火焰節奏",
    category: "balkans",
    instructor: "María Delgado",
    duration: "100分鐘",
    students: 95,
    price: "NT$ 1,100",
    isOnline: false,
    gradient: "from-soul/20 to-accent/10",
  },
  {
    id: 9,
    title: "保加利亞民俗舞｜複雜節拍入門",
    category: "balkans",
    instructor: "Dimitar Petrov",
    duration: "75分鐘",
    students: 28,
    price: "NT$ 850",
    isOnline: true,
    gradient: "from-success/20 to-primary/10",
  },
  {
    id: 10,
    title: "以色列社交圈舞｜Israeli Folk",
    category: "mideast",
    instructor: "Noa Ben-David",
    duration: "60分鐘",
    students: 64,
    price: "NT$ 700",
    isOnline: false,
    gradient: "from-accent/20 to-soul/10",
  },
  {
    id: 11,
    title: "匈牙利民俗舞｜Csárdás 探索",
    category: "eastern-europe",
    instructor: "László Nagy",
    duration: "90分鐘",
    students: 31,
    price: "NT$ 900",
    isOnline: true,
    gradient: "from-primary/20 to-accent/10",
  },
];

export function CoursesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCourses =
    activeCategory === "all"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <section id="courses" className="section-padding bg-background" ref={ref}>
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block text-primary font-body text-sm tracking-widest uppercase mb-4">
            課程專區
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-6">
            找到屬於你的<span className="text-gradient">舞動節奏</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            從零基礎到專業進階，從傳統到舞台，超過 100+ 堂課程等你探索。
            線上線下混合學習，隨時隨地開啟你的舞蹈旅程。
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
              className="group"
            >
              <div className="card-elevated overflow-hidden hover:shadow-elevated transition-all duration-500 h-full flex flex-col">
                {/* Header with gradient */}
                <div
                  className={`relative h-40 bg-gradient-to-br ${course.gradient} p-6 flex flex-col justify-between`}
                >
                  {/* Badges */}
                  <div className="flex justify-between items-start">
                    {course.isOnline && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
                        <Play className="w-3 h-3" />
                        線上課程
                      </span>
                    )}
                    {course.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        推薦
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-2xl font-display font-semibold text-foreground">
                    {course.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body mb-4">
                    講師：{course.instructor}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students} 人已報名
                    </span>
                  </div>

                  <Button variant="outline" className="w-full">
                    查看課程
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button variant="hero" size="lg">
            瀏覽所有課程
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
