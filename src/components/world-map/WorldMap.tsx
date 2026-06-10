import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

/**
 * 互動式世界地圖
 * - 自動讀取 events 表中 kind='course' 且 region 不為空的課程
 * - 以等距長方圓柱投影 (Equirectangular) 把座標換算為 SVG 百分比
 * - 點擊圓點 → 平滑捲動至 #courses 並透過 CustomEvent 觸發地區篩選
 */

// 地區中心座標（緯度、經度）+ 中文名稱
const REGION_PRESETS: Record<
  string,
  { label: string; lat: number; lng: number }
> = {
  india: { label: "印度", lat: 20.5, lng: 78.9 },
  scotland: { label: "蘇格蘭", lat: 56.5, lng: -4 },
  ireland: { label: "愛爾蘭", lat: 53.4, lng: -8 },
  israel: { label: "以色列", lat: 31.5, lng: 35 },
  mideast: { label: "中東與地中海", lat: 33, lng: 36 },
  hawaii: { label: "夏威夷", lat: 20.7, lng: -157 },
  china: { label: "中國", lat: 35, lng: 105 },
  japan: { label: "日本", lat: 36, lng: 138 },
  bulgaria: { label: "保加利亞", lat: 42.7, lng: 25.5 },
  ukraine: { label: "烏克蘭", lat: 49, lng: 32 },
  hungary: { label: "匈牙利", lat: 47.2, lng: 19.5 },
  russia: { label: "俄羅斯", lat: 60, lng: 90 },
  spain: { label: "西班牙", lat: 40, lng: -3.7 },
  "eastern-europe": { label: "東歐與中歐", lat: 50, lng: 25 },
  balkans: { label: "巴爾幹半島", lat: 43, lng: 22 },
  taiwan: { label: "台灣", lat: 23.7, lng: 121 },
  brazil: { label: "巴西", lat: -10, lng: -55 },
  mexico: { label: "墨西哥", lat: 23, lng: -102 },
  morocco: { label: "摩洛哥", lat: 31.8, lng: -7 },
};

const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 100,
  // 緯度壓縮 0.78 倍，視覺更接近常見地圖比例
  y: 50 - (lat / 90) * 50 * 0.78,
});

interface RegionPoint {
  key: string;
  label: string;
  count: number;
  x: number;
  y: number;
}

export function WorldMap() {
  const [regions, setRegions] = useState<RegionPoint[]>([]);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("region")
        .eq("kind", "course")
        .eq("is_published", true)
        .not("region", "is", null);

      const counts = new Map<string, number>();
      (data ?? []).forEach((r: { region: string | null }) => {
        if (!r.region) return;
        counts.set(r.region, (counts.get(r.region) ?? 0) + 1);
      });

      const points: RegionPoint[] = [];
      counts.forEach((count, key) => {
        const preset = REGION_PRESETS[key];
        if (!preset) return;
        const { x, y } = project(preset.lat, preset.lng);
        points.push({ key, label: preset.label, count, x, y });
      });
      setRegions(points);
    })();
  }, []);

  const handleClick = (region: string) => {
    window.dispatchEvent(
      new CustomEvent("danceka:filter-region", { detail: region })
    );
    const el = document.getElementById("courses");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const continents = useMemo(
    () => (
      // 抽象暖色系大陸輪廓（簡約裝飾，非精準地理）
      <g fill="hsl(var(--sand) / 0.55)" stroke="hsl(var(--primary) / 0.25)" strokeWidth="0.15">
        {/* 北美 */}
        <path d="M8,18 Q14,12 22,14 Q28,15 30,22 Q32,30 26,36 Q20,42 14,38 Q8,32 8,26 Z" />
        {/* 南美 */}
        <path d="M24,46 Q28,44 32,48 Q34,56 30,66 Q26,74 22,70 Q20,60 24,46 Z" />
        {/* 歐洲 */}
        <path d="M46,18 Q52,16 56,20 Q58,24 54,28 Q48,30 44,26 Q42,22 46,18 Z" />
        {/* 非洲 */}
        <path d="M48,34 Q56,32 60,40 Q62,52 56,62 Q50,68 46,60 Q44,46 48,34 Z" />
        {/* 亞洲 */}
        <path d="M58,16 Q72,12 86,18 Q92,24 88,32 Q80,38 70,36 Q60,34 56,26 Q54,20 58,16 Z" />
        {/* 大洋洲 */}
        <path d="M80,52 Q88,50 92,56 Q90,62 84,62 Q78,60 80,52 Z" />
      </g>
    ),
    []
  );

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-gradient-to-br from-sand/15 via-background to-coral/10 shadow-soft">
        <svg
          viewBox="0 0 100 60"
          className="w-full h-auto block"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="世界舞蹈地圖"
        >
          {/* 經緯虛線 */}
          <g stroke="hsl(var(--primary) / 0.08)" strokeWidth="0.1">
            {[15, 30, 45].map((y) => (
              <line key={`h${y}`} x1="0" x2="100" y1={y} y2={y} />
            ))}
            {[25, 50, 75].map((x) => (
              <line key={`v${x}`} x1={x} x2={x} y1="0" y2="60" />
            ))}
          </g>

          {continents}

          {/* 課程地點圓點 */}
          {regions.map((p) => {
            const isHover = hover === p.key;
            return (
              <g key={p.key} className="cursor-pointer" onClick={() => handleClick(p.key)}
                 onMouseEnter={() => setHover(p.key)} onMouseLeave={() => setHover(null)}>
                {/* 漣漪 */}
                <circle cx={p.x} cy={p.y} r="2.2" fill="hsl(var(--coral) / 0.3)">
                  <animate attributeName="r" values="1.2;3;1.2" dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2.6s" repeatCount="indefinite" />
                </circle>
                <circle cx={p.x} cy={p.y} r={isHover ? 1.4 : 1.1}
                  fill="hsl(var(--coral))"
                  stroke="hsl(var(--background))" strokeWidth="0.25"
                  style={{ transition: "r 0.25s" }} />
                {/* 標籤 */}
                <text x={p.x} y={p.y - 2.2}
                  textAnchor="middle"
                  className="pointer-events-none"
                  fontSize={isHover ? 2.2 : 1.8}
                  fill="hsl(var(--foreground))"
                  style={{
                    fontWeight: 500,
                    opacity: isHover ? 1 : 0.75,
                    transition: "all 0.25s",
                  }}>
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {regions.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground font-body bg-background/40">
            正在採集大地的舞步…
          </div>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-4 text-center text-xs md:text-sm text-muted-foreground font-body"
      >
        點擊地圖上的光點，前往對應地區的課程
        {regions.length > 0 && ` · 目前共 ${regions.length} 個地區有課程`}
      </motion.p>
    </div>
  );
}
