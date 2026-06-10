import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
   { label: "關於我們", labelEn: "About", href: "/#about" },
   { label: "課程探索", labelEn: "Courses", href: "/#courses" },
   { label: "師資介紹", labelEn: "Instructors", href: "/#instructors" },
   { label: "舞遍世界", labelEn: "Global Styles", href: "/styles" },
   { label: "社群日常", labelEn: "Community", href: "/#community" },
  { label: "行事曆總覽", labelEn: "Events", href: "/#events" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<"zh" | "en">("zh");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => setLang(lang === "zh" ? "en" : "zh");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-lg shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide mx-auto">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-display font-semibold text-gradient">
                舞島咖
              </span>
              <span className={`text-sm font-body transition-colors ${isScrolled ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                DanceKha
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flow-line font-body text-sm transition-colors ${
                  isScrolled
                    ? "text-foreground hover:text-primary"
                    : "text-primary-foreground/90 hover:text-primary-foreground"
                }`}
              >
                {lang === "zh" ? item.label : item.labelEn}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleLang}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isScrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              <Globe className="w-4 h-4" />
              {lang === "zh" ? "EN" : "中"}
            </button>
            <Button asChild variant={isScrolled ? "outline" : "heroOutline"} size="sm">
              <Link to="/dashboard?role=student">{lang === "zh" ? "學員登入" : "Student Login"}</Link>
            </Button>
            <Button asChild variant="hero" size="sm">
              <Link to="/teacher/login">{lang === "zh" ? "舞島師資登入" : "Master Login"}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? "text-foreground" : "text-primary-foreground"
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <div className="container-wide mx-auto py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                >
                  {lang === "zh" ? item.label : item.labelEn}
                </Link>
              ))}
              <div className="flex gap-3 pt-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/dashboard?role=student" onClick={() => setIsMobileMenuOpen(false)}>
                    {lang === "zh" ? "學員登入" : "Student Login"}
                  </Link>
                </Button>
                <Button asChild variant="hero" className="flex-1">
                  <Link to="/teacher/login" onClick={() => setIsMobileMenuOpen(false)}>
                    {lang === "zh" ? "舞島師資登入" : "Master Login"}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
