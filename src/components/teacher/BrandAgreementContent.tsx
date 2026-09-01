/**
 * Single source of truth for the 引導者合作約定 body content.
 * Shared by:
 *  - The formal「申請品牌頁上線」Dialog (writes agreement metadata on submit)
 *  - The low-key bottom-right 查閱 entry (read-only, no writes)
 *
 * Editing the agreement text here updates both entry points at once,
 * keeping the two views from drifting out of sync.
 */
export function BrandAgreementContent() {
  return (
    <div className="space-y-4">
      <p className="text-center text-foreground/70 italic leading-relaxed px-2">
        「我們像落在這座島嶼上的沙，不需要很大，但聚在一起，就能隨著音樂掀起最美麗的浪花。」
      </p>
      <p className="text-foreground/75">
        希望能串聯不同舞種、文化與世代的舞蹈老師與團隊，一起建立一座讓更多人看見舞蹈的交流平台。加入前，邀請您簡單了解以下合作約定：
      </p>

      <div className="space-y-3">
        <p className="leading-relaxed">
          <span className="mr-1.5">🏝️</span>
          <span className="font-semibold text-foreground">1｜品牌進駐</span>
          <br />
          舞島咖提供您專屬品牌頁與管理後台，協助展示您的教學特色、文化背景與專業內容；您可自主維護品牌資料，一起累積品牌影響力與舞蹈文化價值。
        </p>
        <p className="leading-relaxed">
          <span className="mr-1.5">🌱</span>
          <span className="font-semibold text-foreground">2｜島嶼種子計畫</span>
          <br />
          進駐後三個月內，邀請您提供 3～5 支教學短片（每支約 5–8 分鐘），作為平台行銷推廣與會員學習內容，一起共創聚落的舞蹈文化資源。
        </p>
        <p className="leading-relaxed">
          <span className="mr-1.5">📝</span>
          <span className="font-semibold text-foreground">3｜您的創作，屬於您</span>
          <br />
          您上傳的照片、影片、編舞、講義等原創內容，智慧財產權皆歸您所有；您同意舞島咖合理使用公開品牌資料與精彩片段，作為平台及社群推廣之用。
        </p>
        <p className="leading-relaxed">
          <span className="mr-1.5">🤝</span>
          <span className="font-semibold text-foreground">4｜真實專業・彼此尊重</span>
          <br />
          您提供的專業資料應真實完整，並尊重著作權、個資及參與者權益；如有重大不實或違法情形，舞島咖得暫停相關內容或合作。
        </p>
        <p className="leading-relaxed">
          <span className="mr-1.5">⚙️</span>
          <span className="font-semibold text-foreground">5｜平台持續成長</span>
          <br />
          舞島咖目前為試營運階段，功能與服務將持續優化；未來若開放課程交易、金流或其他付費服務，涉及雙方權益的重要規範將另行說明。
        </p>
      </div>

      <p className="text-center text-foreground/70 italic leading-relaxed px-2 pt-1">
        「我們相信，讓專業彼此連結，就能擴大影響力，讓舞蹈的美好走得更遠。」
      </p>
    </div>
  );
}

export default BrandAgreementContent;
