// ============================================================
// SMART PWA INSTALL BANNER & OFFLINE EXPERIENCE (ROUND 29)
// ============================================================

const DISMISSED_KEY = 'phatdat_pwa_banner_dismissed_at';

export function initPwaInstallBanner() {
  // Do not show if already in standalone app mode
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    return;
  }

  // Check if dismissed recently (within 5 days)
  try {
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt && (Date.now() - Number(dismissedAt)) < 5 * 24 * 60 * 60 * 1000) {
      return;
    }
  } catch (e) {}

  let deferredPrompt = null;
  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  function createBanner() {
    const existing = document.getElementById('pd-pwa-install-banner');
    if (existing) return;

    const banner = document.createElement('div');
    banner.id = 'pd-pwa-install-banner';
    banner.style.cssText = `
      position: fixed;
      left: 16px;
      right: 16px;
      bottom: 74px;
      background: rgba(20, 63, 59, 0.96);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: #ffffff;
      border: 1px solid rgba(201, 151, 56, 0.4);
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      border-radius: 12px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      z-index: 870;
      max-width: 520px;
      margin: 0 auto;
      font-family: var(--font-body);
      animation: slideUpFade 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="/images/logo.png" alt="Phát Đạt" style="width: 40px; height: 40px; border-radius: 8px; background: #fff; padding: 3px; object-fit: contain; flex-shrink: 0;">
        <div style="line-height: 1.35;">
          <div style="font-size: 13px; font-weight: 700; color: #FFF8E7;">Cài đặt Web App Phát Đạt</div>
          <div style="font-size: 11px; color: #C5DEDB;">Mở siêu nhanh · Lướt mượt cả khi sóng yếu</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
        <button type="button" id="pwa-install-now-btn" style="background: linear-gradient(135deg, #C99738 0%, #A4791E 100%); color: #fff; border: none; padding: 7px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap;">
          Cài đặt
        </button>
        <button type="button" id="pwa-dismiss-btn" style="background: transparent; color: #9EABA7; border: none; font-size: 18px; cursor: pointer; padding: 4px;" title="Để sau">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    // Handlers
    banner.querySelector('#pwa-dismiss-btn').addEventListener('click', () => {
      localStorage.setItem(DISMISSED_KEY, Date.now().toString());
      banner.remove();
    });

    banner.querySelector('#pwa-install-now-btn').addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          banner.remove();
        }
        deferredPrompt = null;
      } else if (isIos) {
        alert("Để cài đặt trên iPhone / iPad:\n1. Bấm biểu tượng 'Chia sẻ' (ô vuông có mũi tên lên) ở thanh dưới cùng Safari.\n2. Cuộn xuống và chọn 'Thêm vào Màn hình chính' (Add to Home Screen).");
        banner.remove();
      } else {
        alert("Để cài đặt trên trình duyệt:\nBấm vào biểu tượng menu ba chấm trên góc trên cùng -> Chọn 'Cài đặt ứng dụng' hoặc 'Thêm vào màn hình chính'.");
        banner.remove();
      }
    });
  }

  // Capture beforeinstallprompt for Chrome/Edge/Android
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show after slight delay so user has seen the page
    setTimeout(createBanner, 4000);
  });

  // For iOS Safari, show prompt if user visits more than 1 page
  if (isIos && !window.navigator.standalone) {
    const pageVisits = Number(sessionStorage.getItem('pd_page_visits') || 0) + 1;
    sessionStorage.setItem('pd_page_visits', pageVisits);
    if (pageVisits >= 2) {
      setTimeout(createBanner, 5000);
    }
  }
}
