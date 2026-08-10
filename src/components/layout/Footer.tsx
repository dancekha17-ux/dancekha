import { Facebook, Instagram, Youtube, Mail } from "lucide-react";

const footerLinks = {
  courses: {
    title: "課程探索",
    links: [
      { label: "零基礎入門", href: "/#courses" },
      { label: "現代舞", href: "/#courses" },
      { label: "中國舞", href: "/#courses" },
      { label: "拉丁舞", href: "/#courses" },
      { label: "樂齡舞蹈", href: "/#courses" },
    ],
  },
  about: {
    title: "關於我們",
    links: [
      { label: "品牌故事", href: "/#about" },
      { label: "引導者團隊", href: "/#instructors" },
      { label: "加入我們", href: "/register" },
    ],
  },
  support: {
    title: "支援",
    links: [
      { label: "常見問題", href: "/register#faq" },
      { label: "聯絡我們", href: "mailto:hello@dancekha.tw" },
    ],
  },
};

// Social profiles are not published yet — shown as non-clickable placeholders.
const socialLinks = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Youtube, label: "YouTube" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-wide mx-auto py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <a href="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-semibold text-primary">
                舞島咖
              </span>
              <span className="block text-sm text-primary-foreground/60 font-body">
                DanceKha
              </span>
            </a>
            <p className="text-sm text-primary-foreground/60 font-body leading-relaxed mb-6">
              啟動你的舞蹈冒險
              <br />
              用舞步&nbsp; &nbsp; 跳進世界
            </p>

            {/* Social placeholders — not linked until profiles go live */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <span
                  key={social.label}
                  aria-label={`${social.label}（即將開通）`}
                  title="即將開通"
                  className="w-10 h-10 rounded-full bg-primary-foreground/5 flex items-center justify-center text-primary-foreground/30 cursor-default"
                >
                  <social.icon className="w-5 h-5" />
                </span>
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
              <li className="flex items-center gap-2 text-sm text-primary-foreground/60 font-body">
                <Mail className="w-4 h-4 shrink-0" />
                <a
                  href="mailto:hello@dancekha.tw"
                  className="hover:text-primary transition-colors break-all"
                >
                  hello@dancekha.tw
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/40 font-body">
            © {year} 舞島咖 DanceKha. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-primary-foreground/40 font-body">
            <a
              href="/admin"
              className="text-[11px] text-primary-foreground/25 hover:text-primary/80 transition-colors tracking-wider"
              title="管理者後台"
            >
              · admin ·
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
