// ============================================================
// HOME PAGE
// ============================================================

import { hjCollections } from '../data/collections.js';
import { products } from '../data/products.js';
import { createProductCard } from '../components/product-card.js';
import { siteInfo } from '../data/site-info.js';
import { t } from '../i18n.js';
import {
  openGiftFinderModal,
  openLightboxModal,
  openCoupleBuilderModal,
  openAnniversaryReminderModal,
  openFaceHandStylingModal,
  openFengShuiMatcherModal,
  openQuickViewModal
} from '../components/feedback-modal.js';
import { openSizeGuideModal } from '../components/size-guide-modal.js';

export function renderHome(container) {
  const page = document.createElement('div');
  page.className = 'page-home';

  // ── Hero Section ──
  const hero = document.createElement('section');
  hero.className = 'hj-hero hero';
  hero.innerHTML = `
    <div class="hj-hero__bg" style="background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%);"></div>
    <div class="hero__decoration">
      <img src="./images/products/Daychuyen4.3-removebg-preview.png" alt="Dây chuyền Phát Đạt Jewelry">
    </div>
    <div class="hj-hero__content hero__content" style="color: #ffffff;">
      <span style="font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-accent-gold); display: block; margin-bottom: 12px; font-weight: 600;">PHÁT ĐẠT JEWELRY</span>
      <h1 class="hero__title" style="color: #ffffff; font-family: var(--font-display);">Trang Sức Bạc 925 Tinh Tế & Quý Phái</h1>
      <p class="hero__subtitle" style="color: rgba(255,255,255,0.85); font-size: 15px; max-width: 540px; margin: 0 auto 28px;">Tuyển tập các mẫu dây chuyền cỏ ba lá, nhẫn đính đá moissanite và lắc tay xà cừ chế tác tinh xảo, giá từ 129.000₫.</p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="#/jewelry" class="btn" style="background-color: var(--color-accent-gold); border-color: var(--color-accent-gold); color: #143F3B; font-weight: 600;">XEM TẤT CẢ SẢN PHẨM</a>
        <button type="button" id="hero-gift-finder-btn" class="btn" style="background: rgba(255,255,255,0.12); border-color: #ffffff; color: #ffffff;">🎁 TRỢ LÝ CHỌN QUÀ 30S</button>
      </div>
    </div>
  `;
  page.appendChild(hero);
  hero.querySelector('#hero-gift-finder-btn').addEventListener('click', () => openGiftFinderModal());

  // ── USP Commitment Strip ──
  const uspStrip = document.createElement('section');
  uspStrip.className = 'usp-strip';
  uspStrip.style.cssText = `
    background: #ffffff;
    border-bottom: 1px solid var(--color-border);
    padding: 24px 0;
  `;
  uspStrip.innerHTML = `
    <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--color-brand-light); color: var(--color-brand-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px;">🛡️</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: var(--color-brand-primary);">Bạc 925 Chuẩn Quốc Tế</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">Sáng bóng, an toàn cho da</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--color-brand-light); color: var(--color-brand-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px;">✨</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: var(--color-brand-primary);">Làm Sáng Trọn Đời</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">Đánh bóng & vệ sinh miễn phí</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--color-brand-light); color: var(--color-brand-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px;">🎁</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: var(--color-brand-primary);">Tặng Trọn Bộ Hộp Quà</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">Kèm thiệp viết tay & khăn lau bạc</div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--color-brand-light); color: var(--color-brand-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px;">🚚</div>
        <div>
          <div style="font-weight: 600; font-size: 14px; color: var(--color-brand-primary);">Giao Hàng & Đồng Kiểm</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">Kiểm tra hàng trước nhận</div>
        </div>
      </div>
    </div>
  `;
  page.appendChild(uspStrip);

  // ── Collections Grid ──
  const collectionsSection = document.createElement('section');
  collectionsSection.className = 'hj-collections container';
  collectionsSection.innerHTML = `<h2 class="section-heading">${t('home.collectionsTitle')}</h2>`;

  const collectionsGrid = document.createElement('div');
  collectionsGrid.className = 'grid-3';
  hjCollections.slice(0, 3).forEach(collection => {
    collectionsGrid.appendChild(createCollectionCard(collection));
  });
  collectionsSection.appendChild(collectionsGrid);
  collectionsSection.insertAdjacentHTML('beforeend',
    `<div class="text-center" style="margin-top: 32px;"><a href="#/high-jewelry" class="link-underline">XEM TẤT CẢ BỘ SƯU TẬP</a></div>`);
  page.appendChild(collectionsSection);

  // ── Interactive Gift Finder & Ring Sizer Banner ──
  const giftBanner = document.createElement('section');
  giftBanner.className = 'container';
  giftBanner.style.marginTop = '48px';
  giftBanner.innerHTML = `
    <div style="background: linear-gradient(135deg, #1E5D57 0%, #143F3B 100%); border-radius: 14px; padding: 32px 28px; color: #ffffff; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; box-shadow: 0 12px 32px rgba(20,63,59,0.16); border: 1px solid rgba(201,151,56,0.35);">
      <div style="max-width: 580px;">
        <span style="display: inline-block; background: rgba(201,151,56,0.22); color: #F1D28A; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 12px; border-radius: 20px; margin-bottom: 10px;">✨ Trải Nghiệm Độc Quyền Phát Đạt</span>
        <h3 style="font-family: var(--font-display); font-size: 24px; color: #ffffff; margin: 0 0 8px;">Băn Khoăn Chọn Quà Hay Chưa Biết Size Nhẫn?</h3>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0; line-height: 1.6;">
          Trả lời 3 câu hỏi ngắn để tìm ngay món trang sức hợp gu người nhận kèm thiệp viết tay miễn phí, hoặc đo nhẫn trực tiếp trên màn hình điện thoại chỉ trong 10 giây.
        </p>
      </div>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button type="button" id="banner-gift-quiz-btn" class="btn" style="background: var(--color-accent-gold); border-color: var(--color-accent-gold); color: #143F3B; font-weight: 700; padding: 13px 22px;">
          🎁 Tìm Quà Tặng (30 Giây)
        </button>
        <button type="button" id="banner-ring-sizer-btn" class="btn" style="background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.5); color: #ffffff; padding: 13px 20px;">
          📏 Đo Nhẫn Trên Màn Hình
        </button>
      </div>
    </div>
  `;
  page.appendChild(giftBanner);
  giftBanner.querySelector('#banner-gift-quiz-btn').addEventListener('click', () => openGiftFinderModal());
  giftBanner.querySelector('#banner-ring-sizer-btn').addEventListener('click', () => openSizeGuideModal('ruler'));

  // ── Personalization & Concierge Quick Tools Strip (Vòng 1, 3, 4) ──
  const conciergeStrip = document.createElement('section');
  conciergeStrip.className = 'container';
  conciergeStrip.style.marginTop = '24px';
  conciergeStrip.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
      <button type="button" id="home-tool-couple" style="background: #FDF2F8; border: 1px solid #FBCFE8; border-radius: 10px; padding: 14px 16px; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: transform 0.2s;">
        <span style="font-size: 24px;">💑</span>
        <div>
          <div style="font-size: 13.5px; font-weight: 700; color: #9D174D;">Xưởng Thiết Kế Nhẫn / Vòng Đôi</div>
          <div style="font-size: 11.5px; color: #6B7280; margin-top: 2px;">Khắc Laser tên đôi & ngày kỷ niệm miễn phí</div>
        </div>
      </button>
      <button type="button" id="home-tool-styling" style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 14px 16px; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: transform 0.2s;">
        <span style="font-size: 24px;">👗</span>
        <div>
          <div style="font-size: 13.5px; font-weight: 700; color: #1E40AF;">Chọn Theo Dáng Mặt & Bàn Tay</div>
          <div style="font-size: 11.5px; color: #6B7280; margin-top: 2px;">Cố vấn kiểu bông tai, dây chuyền & nhẫn tôn dáng</div>
        </div>
      </button>
      <button type="button" id="home-tool-fengshui" style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 14px 16px; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: transform 0.2s;">
        <span style="font-size: 24px;">🔮</span>
        <div>
          <div style="font-size: 13.5px; font-weight: 700; color: #92400E;">Cố Vấn Đá Phong Thủy Ngũ Hành</div>
          <div style="font-size: 11.5px; color: #6B7280; margin-top: 2px;">Chọn màu đá hợp mệnh Kim · Mộc · Thủy · Hỏa · Thổ</div>
        </div>
      </button>
      <button type="button" id="home-tool-reminder" style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 14px 16px; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: transform 0.2s;">
        <span style="font-size: 24px;">📅</span>
        <div>
          <div style="font-size: 13.5px; font-weight: 700; color: #166534;">Sổ Tay Nhắc Lịch Kỷ Niệm</div>
          <div style="font-size: 11.5px; color: #6B7280; margin-top: 2px;">Lưu ngày sinh nhật người thương & gợi ý quà</div>
        </div>
      </button>
    </div>
  `;
  page.appendChild(conciergeStrip);
  conciergeStrip.querySelector('#home-tool-couple').addEventListener('click', () => openCoupleBuilderModal());
  conciergeStrip.querySelector('#home-tool-styling').addEventListener('click', () => openFaceHandStylingModal());
  conciergeStrip.querySelector('#home-tool-fengshui').addEventListener('click', () => openFengShuiMatcherModal());
  conciergeStrip.querySelector('#home-tool-reminder').addEventListener('click', () => openAnniversaryReminderModal());

  // ── Featured Products ──
  const featured = document.createElement('section');
  featured.className = 'container section-pad';
  featured.innerHTML = `<h2 class="section-heading">Sản Phẩm Nổi Bật</h2>`;
  const grid = document.createElement('div');
  grid.className = 'grid-3';
  products.slice(0, 6).forEach(p => grid.appendChild(createProductCard(p)));
  featured.appendChild(grid);
  featured.insertAdjacentHTML('beforeend',
    `<div class="text-center" style="margin-top: 32px;"><a href="#/jewelry" class="btn">XEM TẤT CẢ TRANG SỨC</a></div>`);
  page.appendChild(featured);

  // ── Interactive Before / After Silver Polishing Slider (Vòng 2) ──
  const polishSection = document.createElement('section');
  polishSection.className = 'container';
  polishSection.style.marginBottom = '56px';
  polishSection.innerHTML = `
    <div style="background: #F8FAF9; border: 1px solid #C5DEDB; border-radius: 14px; padding: 28px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 28px; align-items: center;">
      <div>
        <span style="display: inline-block; background: #E6F4F1; color: var(--color-brand-primary); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 12px; border-radius: 16px; margin-bottom: 10px;">
          ✨ Đặc Quyền Bảo Hành Trọn Đời
        </span>
        <h2 style="font-family: var(--font-display); font-size: clamp(1.4rem, 2.5vw, 2rem); color: var(--color-brand-primary); margin: 0 0 12px;">
          Kéo Thanh Trượt Để Xem Hiệu Quả Đánh Bóng Siêu Âm Bạc S925
        </h2>
        <p style="font-size: 13.5px; color: var(--color-text-secondary); line-height: 1.65; margin: 0 0 16px;">
          Bạc thật S925 sau thời gian dài tiếp xúc mồ hôi có thể hơi xỉn màu tự nhiên. Tại <strong>Phát Đạt Jewelry</strong>, quý khách được <strong>vệ sinh bằng máy rung siêu âm & đánh bóng sáng như mới hoàn toàn miễn phí trọn đời</strong> chỉ trong 10 phút!
        </p>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <span style="font-size: 12px; font-weight: 600; color: #666;">Trước khi làm sạch</span>
          <input type="range" id="polish-compare-slider" min="5" max="95" value="55" style="flex: 1; accent-color: var(--color-brand-primary); cursor: ew-resize;">
          <span style="font-size: 12px; font-weight: 700; color: var(--color-brand-primary);">✨ Sau khi đánh bóng</span>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="#/stores" class="btn btn--sm" style="background: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary);">📅 Đặt Lịch Đánh Bóng Miễn Phí</a>
          <a href="#/info/care" class="btn btn--sm" style="background: #fff;">📖 Mẹo Giữ Bạc Sáng Tại Nhà</a>
        </div>
      </div>

      <!-- Visual Before/After Stage -->
      <div style="position: relative; height: 260px; border-radius: 12px; overflow: hidden; border: 2px solid var(--color-accent-gold); background: #ffffff; user-select: none;">
        <!-- AFTER (Polished Bright Silver) -->
        <div style="position: absolute; inset: 0; background: radial-gradient(circle, #FFFFFF 0%, #EBF5F3 100%); display: flex; align-items: center; justify-content: center;">
          <img src="./images/products/Daychuyen4.3-removebg-preview.png" alt="Sau khi làm sáng" style="width: 210px; height: 210px; object-fit: contain; filter: brightness(1.12) contrast(1.1) drop-shadow(0 8px 18px rgba(30,93,87,0.22));">
          <span style="position: absolute; top: 12px; right: 12px; background: var(--color-brand-primary); color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px;">
            ✨ Sau: Sáng Bóng Như Mới 100%
          </span>
        </div>

        <!-- BEFORE (Tarnished / Dull Silver) clipped by slider -->
        <div id="polish-before-layer" style="position: absolute; inset: 0; width: 55%; overflow: hidden; background: radial-gradient(circle, #D5D2CA 0%, #ABA69B 100%); border-right: 3px solid var(--color-accent-gold);">
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; min-width: 320px;">
            <img src="./images/products/Daychuyen4.3-removebg-preview.png" alt="Trước khi làm sáng" style="width: 210px; height: 210px; object-fit: contain; filter: sepia(0.55) brightness(0.75) contrast(0.85);">
          </div>
          <span style="position: absolute; top: 12px; left: 12px; background: rgba(45,45,45,0.85); color: #fff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 12px;">
            Trước: Bạc xỉn do mồ hôi
          </span>
        </div>
      </div>
    </div>
  `;
  page.appendChild(polishSection);
  const polishSlider = polishSection.querySelector('#polish-compare-slider');
  const beforeLayer = polishSection.querySelector('#polish-before-layer');
  polishSlider.addEventListener('input', () => {
    beforeLayer.style.width = `${polishSlider.value}%`;
  });

  // ── Customer Lookbook & Feedback Gallery with Interactive Style Filter & Quick View (Vòng 5) ──
  const lookbook = document.createElement('section');
  lookbook.className = 'container';
  lookbook.style.marginBottom = '56px';
  const lookbookItems = [
    { img: './images/gallery/g15.jpg', style: 'office', tag: 'Dây chuyền Cỏ Ba Lá', styleLabel: 'Đi làm thanh lịch', quote: '“Mặt xà cừ ở ngoài ánh lên rất sang, hộp quà chỉn chu.” — Minh Anh (Q.7)', prodId: 'pd-01' },
    { img: './images/gallery/g16.jpg', style: 'party', tag: 'Nhẫn Moissanite', styleLabel: 'Dự tiệc sang trọng', quote: '“Đá bắt sáng lấp lánh, đeo đi tiệc ai cũng khen.” — Thanh Thảo (Q.1)', prodId: 'pd-06' },
    { img: './images/gallery/g21.jpg', style: 'gift', tag: 'Lắc Tay Bạc 925', styleLabel: 'Quà tặng người thương', quote: '“Shop tư vấn nhiệt tình, có dây nối tăng đơ rất vừa tay.” — Ngọc Hân (Bình Thạnh)', prodId: 'pd-09' },
    { img: './images/gallery/g19.jpg', style: 'office', tag: 'Bông Tai Ngọc Trai', styleLabel: 'Đi làm thanh lịch', quote: '“Đeo nhẹ tai, không bị ngứa, bạc sáng bóng rất ưng ý!” — Khánh Linh (Q.3)', prodId: 'pd-11' }
  ];

  let activeLookbookStyle = 'all';

  lookbook.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-accent-gold);">KHÁCH HÀNG THÂN THIẾT & GÓC PHỐI ĐỒ</span>
      <h2 class="section-heading" style="margin-bottom: 8px;">Khoảnh Khắc Cùng Phát Đạt Jewelry</h2>
      <p style="font-size: 14px; color: var(--color-text-secondary); max-width: 540px; margin: 0 auto 16px;">Hơn 5.000+ khách hàng đã tin chọn trang sức bạc 925. Chọn phong cách bên dưới để xem gợi ý phối đồ thực tế:</p>
      <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;" id="lookbook-filter-bar">
        <button type="button" class="lb-filter-btn is-active" data-style="all" style="padding: 6px 14px; border-radius: 20px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; font-size: 12px; font-weight: 700; cursor: pointer;">Tất cả phong cách</button>
        <button type="button" class="lb-filter-btn" data-style="office" style="padding: 6px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12px; font-weight: 600; cursor: pointer;">💼 Đi làm thanh lịch</button>
        <button type="button" class="lb-filter-btn" data-style="party" style="padding: 6px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12px; font-weight: 600; cursor: pointer;">🥂 Dự tiệc sang trọng</button>
        <button type="button" class="lb-filter-btn" data-style="gift" style="padding: 6px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12px; font-weight: 600; cursor: pointer;">🎁 Quà tặng người thương</button>
      </div>
    </div>
    <div id="lookbook-grid-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 18px;"></div>
  `;
  page.appendChild(lookbook);

  const lbGrid = lookbook.querySelector('#lookbook-grid-container');
  function renderLookbookCards() {
    const filtered = activeLookbookStyle === 'all'
      ? lookbookItems
      : lookbookItems.filter(i => i.style === activeLookbookStyle);

    lbGrid.innerHTML = filtered.map((item, idx) => `
      <div class="lookbook-card" data-idx="${idx}" style="background: #ffffff; border: 1px solid var(--color-border); border-radius: 10px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.04); display: flex; flex-direction: column;">
        <div style="position: relative; height: 220px; overflow: hidden; cursor: zoom-in;" class="lookbook-img-wrap" data-idx="${idx}">
          <img src="${item.img}" alt="${item.tag}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease;">
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.92); color: var(--color-brand-primary); font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 12px;">${item.styleLabel}</span>
          <span style="position: absolute; bottom: 10px; left: 10px; background: rgba(20,63,59,0.88); color: #ffffff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px;">✨ ${item.tag}</span>
        </div>
        <div style="padding: 14px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <p style="font-size: 12.5px; color: var(--color-text-secondary); font-style: italic; margin: 0 0 10px; line-height: 1.5;">${item.quote}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <a href="#/product/${item.prodId}" style="font-size: 12px; font-weight: 700; color: var(--color-brand-primary); text-decoration: none;">Chi tiết mẫu →</a>
            <button type="button" class="lb-quickview-btn" data-id="${item.prodId}" style="background: #F4F9F8; border: 1px solid #C5DEDB; color: var(--color-brand-primary); border-radius: 14px; padding: 3px 9px; font-size: 11px; font-weight: 600; cursor: pointer;">👁 Xem nhanh</button>
          </div>
        </div>
      </div>
    `).join('');

    lbGrid.querySelectorAll('.lookbook-img-wrap').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx, 10) || 0;
        openLightboxModal(filtered.map(i => i.img), idx, 'Khoảnh Khắc Khách Hàng Phát Đạt Jewelry');
      });
    });

    lbGrid.querySelectorAll('.lb-quickview-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = products.find(p => p.id === btn.dataset.id) || products[0];
        if (prod) openQuickViewModal(prod);
      });
    });
  }

  lookbook.querySelectorAll('.lb-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeLookbookStyle = btn.dataset.style;
      lookbook.querySelectorAll('.lb-filter-btn').forEach(b => {
        b.style.background = '#fff';
        b.style.color = 'var(--color-text-primary)';
        b.style.borderColor = 'var(--color-border)';
      });
      btn.style.background = 'var(--color-brand-primary)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--color-brand-primary)';
      renderLookbookCards();
    });
  });

  renderLookbookCards();

  // ── Store strip ──
  const store = document.createElement('section');
  store.className = 'store-strip';
  store.innerHTML = `
    <div class="container store-strip__inner">
      <div class="store-strip__img"><img src="./images/gallery/g9.jpg" alt="Cửa hàng Phát Đạt Jewelry" loading="lazy"></div>
      <div class="store-strip__info">
        <h2 class="section-heading" style="text-align:left;">Ghé thăm cửa hàng</h2>
        <p><strong>Địa chỉ:</strong> ${siteInfo.address}</p>
        <p><strong>Điện thoại:</strong> <a href="${siteInfo.phoneHref}">${siteInfo.phoneDisplay}</a></p>
        <p><strong>Giờ làm việc:</strong> ${siteInfo.hours}</p>
        <div class="store-strip__actions">
          <a href="#/stores" class="btn">ĐẶT LỊCH HẸN & BẢN ĐỒ</a>
          <a href="${siteInfo.phoneHref}" class="link-underline">GỌI NGAY</a>
        </div>
      </div>
    </div>
  `;
  page.appendChild(store);

  container.appendChild(page);
}

export function createCollectionCard(collection) {
  const card = document.createElement('a');
  card.className = 'hj-collection-card';
  card.href = `#/collections/${collection.id}`;
  card.innerHTML = `
    <img src="${collection.image}" alt="Bộ sưu tập ${collection.name}" loading="lazy">
    <div class="hj-collection-card__overlay"></div>
    <span class="hj-collection-card__name">${collection.name}</span>
  `;
  return card;
}
