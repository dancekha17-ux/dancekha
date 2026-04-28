import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  courses: {
    title: "課程專區",
    links: [
      { label: "零基礎入門", href: "#" },
      { label: "現代舞", href: "#" },
      { label: "街舞", href: "#" },
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
      <div className="container-wide mx-auto px-4 md:px-8 py-16">
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
...
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
