import worldMapAsset from "@/assets/world-map.jpg.asset.json";

/**
 * 互動式世界舞蹈地圖 — Phase 1
 * 純視覺定位：背景圖 + 6 個發光脈動光點，使用百分比定位確保 RWD 等比縮放。
 */

interface MapRegion {
  id: string;
  name: string;
  top: string;
  left: string;
}

const MAP_REGIONS: MapRegion[] = [
  { id: "andalusia", name: "西班牙安達魯西亞", top: "45%", left: "46%" },
  { id: "ukraine", name: "烏克蘭", top: "38%", left: "54%" },
  { id: "balkans", name: "巴爾幹半島", top: "42%", left: "51%" },
  { id: "mediterranean", name: "地中海沿岸", top: "44%", left: "49%" },
  { id: "scotland", name: "蘇格蘭", top: "33%", left: "45%" },
  { id: "bulgaria", name: "保加利亞", top: "41.5%", left: "52.5%" },
];

export function WorldMap() {
  return (
    <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden">
      <img
        src={worldMapAsset.url}
        alt="世界舞蹈地圖"
        className="w-full h-auto block select-none"
        draggable={false}
      />

      {MAP_REGIONS.map((region) => (
        <button
          key={region.id}
          type="button"
          aria-label={region.name}
          className="absolute -translate-x-1/2 -translate-y-1/2 group"
          style={{ top: region.top, left: region.left }}
        >
          {/* 外層發光脈動暈圈 */}
          <span className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-amber-500/40 animate-ping" />
          <span className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-orange-500/30" />
          {/* 中心橙色實心點 */}
          <span className="relative block w-2.5 h-2.5 rounded-full bg-[#E36435] ring-2 ring-white/80 shadow-[0_0_8px_rgba(227,100,53,0.7)]" />
        </button>
      ))}
    </div>
  );
}
