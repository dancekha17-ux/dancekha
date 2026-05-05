import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  courses: {
    title: "社群日常",
    links: [
      { label: "零基礎入門", href: "#" },
      { label: "現代舞", href: "#" },
      { label: "中國舞", href: "#" },
      { label: "拉丁舞", href: "#" },
      { label: "樂齡律動", href: "#" },
    ],
  },
  about: {
    title: "關於我們",
    links: [
      { label: "品牌故事", href: "#" },
      { label: "師資團隊", href: "#" },
      { label: "合作夥伴", href: "#" },
      { label: "加入我們", href: "#" },
    ],
  },
  support: {
    title: "支援",
    links: [
      { label: "常見問題", href: "#" },
      { label: "聯絡我們", href: "#" },
      { label: "隱私政策", href: "#" },
      { label: "服務條款", href: "#" },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-wide mx-auto py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <a href="#" className="inline-block mb-4">
              <span className="text-2xl font-display font-semibold text-primary">
                舞島咖
              </span>
              <span className="block text-sm text-primary-foreground/60 font-body">
                DanceKha
              </span>
            </a>
            <p className="text-sm text-primary-foreground/60 font-body leading-relaxed mb-6">
              舞蹈啟動平台
              <br />
              用舞步遇見世界
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-semibold text-primary-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-primary-foreground/60 hover:text-primary transition-colors font-body"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">
              聯絡我們
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/60 font-body">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>台北市信義區信義路五段7號</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/60 font-body">
                <Phone className="w-4 h-4 shrink-0" />
                <span>02-2345-6789</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/60 font-body">
                <Mail className="w-4 h-4 shrink-0" />
                <span>hello@dancekha.tw</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/40 font-body">
            © 2025 舞島咖 DanceKha. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-primary-foreground/40 font-body">
            <a href="#" className="hover:text-primary transition-colors">
              隱私政策
            </a>
            <span>|</span>
            <a href="#" className="hover:text-primary transition-colors">
              服務條款
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
