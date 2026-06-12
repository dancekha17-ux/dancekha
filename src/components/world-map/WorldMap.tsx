import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import worldMapAsset from "@/assets/world-map.jpg.asset.json";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * 互動式世界舞蹈地圖 — Phase 2
 * 加入懸停/點擊互動 + 卡片彈窗 + 路由跳轉。
 */

interface MapRegion {
  id: string;
  name: string;
  country: string;
  dance: string;
  desc: string;
  queryParam: string;
  top: string;
  left: string;
}

const MAP_REGIONS: MapRegion[] = [
  {
    id: "spain",
    name: "西班牙安達魯西亞",
    country: "西班牙 · 安達魯西亞",
    dance: "弗拉明戈 Flamenco",
    desc: "熱情奔放的吉普賽靈魂，用強烈的腳步聲擊碎深夜的寂靜。",
    queryParam: "Spain",
    top: "45%",
    left: "46%",
  },
  {
    id: "ukraine",
    name: "烏克蘭",
    country: "烏克蘭",
    dance: "霍巴克 Hopak",
    desc: "奔放的哥薩克跳躍，在大草原上舞動出自由與生命的韌性。",
    queryParam: "Ukraine",
    top: "38%",
    left: "54%",
  },
  {
    id: "balkans",
    name: "巴爾幹半島",
    country: "巴爾幹半島",
    dance: "不對稱節奏圓圈舞 Kolo",
    desc: "跳躍在 7/8 拍的奇幻節奏中，手拉手連結整個村落的古老記憶。",
    queryParam: "Balkans",
    top: "42%",
    left: "51%",
  },
  {
    id: "mediterranean",
    name: "地中海沿岸",
    country: "地中海沿岸",
    dance: "塔蘭泰拉 Tarantella",
    desc: "源自義大利南部的解毒之舞，在極速的鈴鼓聲中釋放身體能量。",
    queryParam: "Mediterranean",
    top: "44%",
    left: "49%",
  },
  {
    id: "scotland",
    name: "蘇格蘭",
    country: "蘇格蘭",
    dance: "高地舞 Highland Dance",
    desc: "伴隨風笛聲的英勇步伐，跨越歷史塵埃的優雅與力量。",
    queryParam: "Scotland",
    top: "33%",
    left: "45%",
  },
  {
    id: "bulgaria",
    name: "保加利亞",
    country: "保加利亞",
    dance: "霍拉舞 Hora",
    desc: "巴爾幹半島深處的靈魂共振，用繁複的足技踏響大地的脈搏。",
    queryParam: "Bulgaria",
    top: "41.5%",
    left: "52.5%",
  },
];

interface RegionCardProps {
  region: MapRegion;
  onExplore: (region: MapRegion) => void;
  onClose?: () => void;
  floating?: boolean;
  style?: React.CSSProperties;
}

function RegionCard({ region, onExplore, onClose, floating, style }: RegionCardProps) {
  return (
    <div
      style={style}
      className={`${
        floating ? "absolute z-30 w-72 -translate-x-1/2" : "relative w-full max-w-md mx-auto mt-6"
      } rounded-2xl shadow-[0_20px_50px_-15px_rgba(30,41,59,0.35)] bg-[#FBF5EC] border border-[#E8DCC4] p-5 animate-fade-in`}
    >
      {onClose && (
        <button
          onClick={onClose}
          aria-label="關閉"
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <p className="text-xs font-body uppercase tracking-widest text-[#E36435] mb-1">
        {region.country}
      </p>
      <h4 className="text-lg font-display font-semibold text-slate-800 mb-2">
        {region.dance}
      </h4>
      <p className="text-sm text-slate-600 font-body leading-relaxed mb-4">
        {region.desc}
      </p>
      <button
        onClick={() => onExplore(region)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E36435] text-white text-sm font-medium hover:bg-[#c95628] transition-all hover:gap-2.5 shadow-sm"
      >
        探索此區課程
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export function WorldMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const activeRegion = MAP_REGIONS.find((r) => r.id === activeId) ?? null;

  const handleExplore = (region: MapRegion) => {
    const coursesEl = document.getElementById("courses");
    if (coursesEl) {
      coursesEl.scrollIntoView({ behavior: "smooth" });
    }
    navigate(`/?region=${encodeURIComponent(region.queryParam)}#courses`);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="relative w-full overflow-visible">
        <img
          src={worldMapAsset.url}
          alt="世界舞蹈地圖"
          className="w-full h-auto block select-none rounded-lg"
          draggable={false}
        />

        {MAP_REGIONS.map((region) => {
          const isActive = activeId === region.id;
          return (
            <div
              key={region.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: region.top, left: region.left }}
            >
              <button
                type="button"
                aria-label={region.name}
                onMouseEnter={() => !isMobile && setActiveId(region.id)}
                onClick={() => setActiveId(isActive ? null : region.id)}
                className="relative w-6 h-6 flex items-center justify-center group focus:outline-none"
              >
                <span className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-amber-500/40 animate-ping" />
                <span className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-orange-500/30" />
                <span
                  className={`relative block w-2.5 h-2.5 rounded-full bg-[#E36435] ring-2 ring-white/80 shadow-[0_0_8px_rgba(227,100,53,0.7)] transition-transform ${
                    isActive ? "scale-150" : "group-hover:scale-125"
                  }`}
                />
              </button>

              {/* Desktop: floating card near pin */}
              {!isMobile && isActive && activeRegion?.id === region.id && (
                <RegionCard
                  region={region}
                  onExplore={handleExplore}
                  onClose={() => setActiveId(null)}
                  floating
                  style={{ top: "20px", left: "50%" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: card below map */}
      {isMobile && activeRegion && (
        <RegionCard
          region={activeRegion}
          onExplore={handleExplore}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  );
}
