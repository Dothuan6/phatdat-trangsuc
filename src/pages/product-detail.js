// ============================================================
// PRODUCT DETAIL PAGE (PDP) — Phát Đạt Jewelry
// ============================================================

import { products, getProductById, getRelatedProducts, formatPrice } from '../data/products.js';
import { createAccordion } from '../components/accordion.js';
import { createProductCard } from '../components/product-card.js';
import { createCarousel } from '../components/carousel.js';
import { openGlobalSizeGuide } from '../components/size-guide-modal.js';
import { siteInfo } from '../data/site-info.js';
import { t } from '../i18n.js';
import {
  isWishlisted,
  toggleWishlist,
  addRecentlyViewed,
  getRecentlyViewedProductIds,
  isCompared,
  toggleCompareProduct,
  trackProductEvent,
  getCustomProductReviews,
  addCustomProductReview
} from '../data/wishlist-store.js';
import {
  showToast,
  openLightboxModal,
  openQuickCallbackModal,
  shareProductLink,
  openQrTagModal,
  openFengShuiMatcherModal,
  openWarrantyLookupModal
} from '../components/feedback-modal.js';

export function renderProductDetail(container, params = {}) {
  const productId = params.id;
  const product = getProductById(productId);

  if (!product) {
    container.innerHTML = `
      <div class="container section text-center" style="padding: 80px 20px;">
        <h2 style="font-family: var(--font-display); margin-bottom: 24px; color: var(--color-brand-primary);">Không tìm thấy sản phẩm</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: 24px;">Sản phẩm bạn đang tìm kiếm có thể đã được cập nhật hoặc ngừng kinh doanh.</p>
        <a href="#/jewelry" class="btn" style="background-color: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary);">KHÁM PHÁ CÁC MẪU TRANG SỨC KHÁC</a>
      </div>
    `;
    return;
  }

  // Track Recently Viewed & Analytics View
  addRecentlyViewed(product.id);
  trackProductEvent(product.id, 'view');

  // Inject JSON-LD Structured Data for Google Rich Snippets
  let jsonLdEl = document.getElementById('pd-jsonld-product');
  if (!jsonLdEl) {
    jsonLdEl = document.createElement('script');
    jsonLdEl.id = 'pd-jsonld-product';
    jsonLdEl.type = 'application/ld+json';
    document.head.appendChild(jsonLdEl);
  }
  jsonLdEl.textContent = JSON.stringify({
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    sku: product.reference,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Phát Đạt Jewelry'
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: 'VND',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewsCount || 20
    }
  });

  const page = document.createElement('div');
  page.className = 'page-pdp';

  // State
  let selectedSize = product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes[0] : '';
  let selectedColor = product.availableColors && product.availableColors.length > 0 ? product.availableColors[0] : '';

  // ── Main PDP Layout ──
  const pdpLayout = document.createElement('div');
  pdpLayout.className = 'layout-pdp container';
  pdpLayout.style.cssText = 'padding-top: 24px;';

  // ── Gallery (Left) ──
  const gallery = document.createElement('div');
  gallery.className = 'layout-pdp__gallery';

  const galleryInner = document.createElement('div');
  galleryInner.className = 'pdp-gallery';

  const galleryImages = product.images.length > 0 ? product.images : ['./images/products/Daychuyen4.3-removebg-preview.png'];

  galleryImages.forEach((imgSrc, idx) => {
    const item = document.createElement('div');
    item.className = 'pdp-gallery__item';
    item.dataset.index = idx;
    item.style.cursor = 'zoom-in';
    item.title = 'Bấm để phóng to xem chi tiết đá & giác cắt';
    item.innerHTML = `
      <img src="${imgSrc}" alt="${product.name} - Hình ${idx + 1}" loading="${idx === 0 ? 'eager' : 'lazy'}"
           onerror="this.src='./images/products/Daychuyen4.3-removebg-preview.png'">
    `;
    item.addEventListener('click', () => {
      openLightboxModal(galleryImages, idx);
    });
    galleryInner.appendChild(item);
  });

  // Gallery thumbnail dots
  const thumbDots = document.createElement('div');
  thumbDots.className = 'pdp-gallery__thumbs';
  galleryImages.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `pdp-gallery__thumb${idx === 0 ? ' is-active' : ''}`;
    dot.dataset.index = idx;
    dot.addEventListener('click', () => {
      const targetItem = galleryInner.querySelector(`[data-index="${idx}"]`);
      if (targetItem) {
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      thumbDots.querySelectorAll('.pdp-gallery__thumb').forEach(d => d.classList.remove('is-active'));
      dot.classList.add('is-active');
    });
    thumbDots.appendChild(dot);
  });

  gallery.appendChild(thumbDots);
  gallery.appendChild(galleryInner);

  // ── Skin-Tone & Lighting Backdrop Switcher (Ướm thử tông da & nền trưng bày) ──
  const skinToneBar = document.createElement('div');
  skinToneBar.style.cssText = `
    display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px;
    padding: 10px 14px; margin-top: 10px; background: #FAF8F4; border: 1px solid var(--color-border-light);
    border-radius: 10px;
  `;
  skinToneBar.innerHTML = `
    <span style="font-size: 12px; font-weight: 600; color: var(--color-text-secondary); margin-right: 4px;">📸 Ướm thử trên nền:</span>
    <button type="button" class="pd-skintone-btn is-active" data-bg="#F9F9F9" data-border="var(--color-brand-primary)" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 16px; border: 1.5px solid var(--color-brand-primary); background: #fff; font-size: 11.5px; font-weight: 600; cursor: pointer;">
      <span style="width: 12px; height: 12px; border-radius: 50%; background: #F9F9F9; border: 1px solid #ccc;"></span> Studio Sáng
    </button>
    <button type="button" class="pd-skintone-btn" data-bg="linear-gradient(135deg, #FCECE3 0%, #F5D6C6 100%)" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 16px; border: 1px solid var(--color-border); background: #fff; font-size: 11.5px; font-weight: 500; cursor: pointer;">
      <span style="width: 12px; height: 12px; border-radius: 50%; background: #F5D6C6; border: 1px solid rgba(0,0,0,0.1);"></span> Da Trắng Hồng
    </button>
    <button type="button" class="pd-skintone-btn" data-bg="linear-gradient(135deg, #F3D7B8 0%, #E2BA91 100%)" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 16px; border: 1px solid var(--color-border); background: #fff; font-size: 11.5px; font-weight: 500; cursor: pointer;">
      <span style="width: 12px; height: 12px; border-radius: 50%; background: #E2BA91; border: 1px solid rgba(0,0,0,0.1);"></span> Da Tự Nhiên
    </button>
    <button type="button" class="pd-skintone-btn" data-bg="linear-gradient(135deg, #D8A97C 0%, #BE8A5B 100%)" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 16px; border: 1px solid var(--color-border); background: #fff; font-size: 11.5px; font-weight: 500; cursor: pointer;">
      <span style="width: 12px; height: 12px; border-radius: 50%; background: #BE8A5B; border: 1px solid rgba(0,0,0,0.1);"></span> Da Bánh Mật
    </button>
    <button type="button" class="pd-skintone-btn" data-bg="radial-gradient(circle, #244743 0%, #112624 100%)" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 16px; border: 1px solid var(--color-border); background: #fff; font-size: 11.5px; font-weight: 500; cursor: pointer;">
      <span style="width: 12px; height: 12px; border-radius: 50%; background: #143F3B; border: 1px solid rgba(0,0,0,0.1);"></span> Nhung Ngọc Lục Bảo
    </button>
  `;
  skinToneBar.querySelectorAll('.pd-skintone-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      skinToneBar.querySelectorAll('.pd-skintone-btn').forEach(b => {
        b.style.border = '1px solid var(--color-border)';
        b.style.fontWeight = '500';
      });
      btn.style.border = '1.5px solid var(--color-brand-primary)';
      btn.style.fontWeight = '600';
      const bgVal = btn.dataset.bg;
      galleryInner.querySelectorAll('.pdp-gallery__item').forEach(itemEl => {
        itemEl.style.background = bgVal;
        itemEl.style.transition = 'background 0.35s ease';
      });
    });
  });
  gallery.appendChild(skinToneBar);
  pdpLayout.appendChild(gallery);

  // ── Info Panel (Right) ──
  const infoPanel = document.createElement('div');
  infoPanel.className = 'layout-pdp__info';

  const info = document.createElement('div');
  info.className = 'pdp-info';

  // Breadcrumb mini
  const breadcrumbEl = document.createElement('div');
  breadcrumbEl.style.cssText = 'font-size: 12px; color: var(--color-text-secondary); margin-bottom: 12px;';
  breadcrumbEl.innerHTML = `
    <a href="#/" style="color: inherit; text-decoration: none;">Trang chủ</a> &nbsp;/&nbsp;
    <a href="#/jewelry/${product.category}" style="color: inherit; text-decoration: none;">${product.collection}</a> &nbsp;/&nbsp;
    <span style="color: var(--color-brand-primary); font-weight: 500;">${product.name}</span>
  `;
  info.appendChild(breadcrumbEl);

  // Product Name
  const nameEl = document.createElement('h1');
  nameEl.className = 'pdp-info__name';
  nameEl.style.cssText = 'font-family: var(--font-display); font-size: clamp(1.5rem, 2.5vw, 2.2rem); color: var(--color-brand-primary); margin-bottom: 8px;';
  nameEl.textContent = product.name;
  info.appendChild(nameEl);

  // Rating, Code & Quick Utility Row (Share, QR, Compare, Wishlist)
  const isLiked = isWishlisted(product.id);
  const heartFill = isLiked ? '#D4380D' : 'none';
  const heartColor = isLiked ? '#D4380D' : 'currentColor';
  const inCompare = isCompared(product.id);

  const subRow = document.createElement('div');
  subRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; border-bottom: 1px solid var(--color-border-light); padding-bottom: 12px;';
  subRow.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
      <span style="color: #f39c12;">★★★★★</span>
      <span style="font-weight: 600; color: var(--color-text-primary);">${product.rating}</span>
      <span style="color: var(--color-text-secondary);">(${product.reviewsCount} đánh giá)</span>
      <span style="color: var(--color-border);">|</span>
      <span style="color: var(--color-text-secondary); font-family: monospace;">Mã: ${product.reference}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <button type="button" id="pdp-compare-btn" style="background: ${inCompare ? 'var(--color-brand-primary)' : '#f4f7f6'}; color: ${inCompare ? '#fff' : 'var(--color-text-primary)'}; border: 1px solid var(--color-border); border-radius: 16px; padding: 4px 10px; font-size: 12px; font-weight: 600; cursor: pointer;" title="So sánh sản phẩm">
        ${inCompare ? '✓ Đang so sánh' : '⚖️ So sánh'}
      </button>
      <button type="button" id="pdp-qr-btn" style="background: #f4f7f6; color: var(--color-text-primary); border: 1px solid var(--color-border); border-radius: 16px; padding: 4px 10px; font-size: 12px; font-weight: 600; cursor: pointer;" title="Xem Mã QR & Thẻ giá">
        🏷️ Mã QR
      </button>
      <button type="button" id="pdp-share-btn" style="background: #f4f7f6; color: var(--color-text-primary); border: 1px solid var(--color-border); border-radius: 16px; padding: 4px 10px; font-size: 12px; font-weight: 600; cursor: pointer;" title="Chia sẻ sản phẩm">
        🔗 Chia sẻ
      </button>
      <button class="wishlist-btn" aria-label="Thêm vào yêu thích" id="wishlist-btn-${product.id}" style="color: ${heartColor}; background:none; border:none; cursor:pointer; display:flex; align-items:center;">
        <svg viewBox="0 0 24 24" fill="${heartFill}" stroke="currentColor" stroke-width="1.6" width="22" height="22">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>
    </div>
  `;
  info.appendChild(subRow);

  subRow.querySelector('#pdp-share-btn').addEventListener('click', () => shareProductLink(product));
  subRow.querySelector('#pdp-qr-btn').addEventListener('click', () => openQrTagModal(product));
  subRow.querySelector('#pdp-compare-btn').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const res = toggleCompareProduct(product.id);
    if (res.limitReached) {
      showToast('Chỉ có thể so sánh tối đa 3 mẫu trang sức cùng lúc!', 'warning');
      return;
    }
    btn.textContent = res.added ? '✓ Đang so sánh' : '⚖️ So sánh';
    btn.style.background = res.added ? 'var(--color-brand-primary)' : '#f4f7f6';
    btn.style.color = res.added ? '#fff' : 'var(--color-text-primary)';
    showToast(
      res.added ? `Đã thêm "${product.name}" vào bảng so sánh (${res.list.length}/3)!` : `Đã bỏ "${product.name}" khỏi bảng so sánh`,
      res.added ? 'success' : 'info',
      2200
    );
  });

  // Price
  const priceEl = document.createElement('div');
  priceEl.className = 'pdp-info__price';
  priceEl.style.cssText = 'font-size: 26px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 20px; display: flex; align-items: baseline; gap: 8px;';
  priceEl.innerHTML = `
    <span>${formatPrice(product.price)}</span>
    <span style="font-size: 13px; font-weight: 400; color: var(--color-text-secondary);">(Đã bao gồm hộp quà & bảo hành)</span>
  `;
  info.appendChild(priceEl);

  // Variant: Sizes & Size Guide
  if (product.availableSizes && product.availableSizes.length > 0) {
    const sizeSection = document.createElement('div');
    sizeSection.style.cssText = 'margin-bottom: 20px;';
    
    const sizeHeader = document.createElement('div');
    sizeHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;';
    sizeHeader.innerHTML = `
      <span style="font-size: 13px; font-weight: 600; color: var(--color-text-primary);">KÍCH CỠ / CHIỀU DÀI:</span>
      <button id="open-size-guide-link" type="button" style="background: none; border: none; font-size: 13px; color: var(--color-brand-primary); cursor: pointer; text-decoration: underline; font-weight: 600; display: flex; align-items: center; gap: 4px;">
        📏 ${product.category === 'necklaces' ? 'Xem dáng dây trên cổ & đo size' : 'Đo nhẫn trực tiếp trên màn hình'}
      </button>
    `;
    sizeSection.appendChild(sizeHeader);

    const sizePills = document.createElement('div');
    sizePills.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px;';
    product.availableSizes.forEach((s, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isSelected = idx === 0;
      btn.style.cssText = `
        padding: 8px 14px;
        border-radius: 4px;
        border: 1px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-border)'};
        background: ${isSelected ? 'var(--color-brand-light)' : '#ffffff'};
        color: ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-text-primary)'};
        font-weight: ${isSelected ? '600' : '400'};
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      btn.textContent = s;
      btn.addEventListener('click', () => {
        selectedSize = s;
        sizePills.querySelectorAll('button').forEach(b => {
          b.style.borderColor = 'var(--color-border)';
          b.style.background = '#ffffff';
          b.style.color = 'var(--color-text-primary)';
          b.style.fontWeight = '400';
        });
        btn.style.borderColor = 'var(--color-brand-primary)';
        btn.style.background = 'var(--color-brand-light)';
        btn.style.color = 'var(--color-brand-primary)';
        btn.style.fontWeight = '600';
      });
      sizePills.appendChild(btn);
    });
    sizeSection.appendChild(sizePills);

    // Size guide click
    sizeHeader.querySelector('#open-size-guide-link').addEventListener('click', () => {
      const targetTab = product.category === 'necklaces' ? 'necklace' : (product.category === 'bracelets' ? 'care' : 'ruler');
      openGlobalSizeGuide(targetTab);
    });

    info.appendChild(sizeSection);
  }

  // Variant: Colors
  if (product.availableColors && product.availableColors.length > 0) {
    const colorSection = document.createElement('div');
    colorSection.style.cssText = 'margin-bottom: 20px;';
    colorSection.innerHTML = `
      <span style="font-size: 13px; font-weight: 600; color: var(--color-text-primary); display: block; margin-bottom: 8px;">MÀU SẮC XI MẠ:</span>
    `;

    const colorChips = document.createElement('div');
    colorChips.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px;';

    product.availableColors.forEach((c, idx) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      const isSelected = idx === 0;
      chip.style.cssText = `
        padding: 7px 12px;
        border-radius: 4px;
        border: 1px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-border)'};
        background: ${isSelected ? 'var(--color-brand-light)' : '#ffffff'};
        color: ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-text-primary)'};
        font-weight: ${isSelected ? '600' : '400'};
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
      `;
      const dotColor = c.includes('vàng hồng') ? '#e8a598' : (c.includes('vàng 18K') ? '#d4af37' : '#dcdde1');
      chip.innerHTML = `<span style="width: 10px; height: 10px; border-radius: 50%; background: ${dotColor}; display: inline-block; border: 1px solid rgba(0,0,0,0.1);"></span> ${c}`;
      chip.addEventListener('click', () => {
        selectedColor = c;
        colorChips.querySelectorAll('button').forEach(b => {
          b.style.borderColor = 'var(--color-border)';
          b.style.background = '#ffffff';
          b.style.color = 'var(--color-text-primary)';
          b.style.fontWeight = '400';
        });
        chip.style.borderColor = 'var(--color-brand-primary)';
        chip.style.background = 'var(--color-brand-light)';
        chip.style.color = 'var(--color-brand-primary)';
        chip.style.fontWeight = '600';
      });
      colorChips.appendChild(chip);
    });

    colorSection.appendChild(colorChips);
    info.appendChild(colorSection);
  }

  // ── Personalization: Live Laser Engraving Previewer (Khắc Laser Tên / Ký Hiệu Miễn Phí) ──
  let selectedEngravingFont = "'Cormorant Garamond', Georgia, serif";
  let selectedEngravingFontLabel = 'Chữ Thanh Lịch';
  let selectedGiftBoxStyle = 'Hộp Nhung Xanh Ngọc Lục Bảo';

  const engraveBox = document.createElement('div');
  engraveBox.style.cssText = `
    background: #F4F9F8;
    border: 1px solid #C5DEDB;
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 12px;
  `;
  engraveBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
      <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--color-brand-primary); cursor: pointer;">
        <input type="checkbox" id="pdp-engrave-toggle" style="accent-color: var(--color-brand-primary); width: 16px; height: 16px; cursor: pointer;">
        <span>✒️ Khắc Laser Tên / Ngày Kỷ Niệm Lên Trang Sức (Miễn phí)</span>
      </label>
      <button type="button" id="pdp-fengshui-check-btn" style="background: #FFF9EB; border: 1px solid #E5C158; color: #7A5411; border-radius: 14px; padding: 3px 10px; font-size: 11.5px; font-weight: 700; cursor: pointer;">
        🔮 Tư vấn hợp mệnh
      </button>
    </div>
    <div id="pdp-engrave-pane" style="display: none; margin-top: 12px;">
      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <input type="text" id="pdp-engrave-input" maxlength="18" style="flex: 1; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 6px; font-size: 13px; background: #fff;" placeholder="Nhập chữ khắc (Tối đa 18 ký tự, VD: Minh ♥ Anh)...">
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="font-size: 11.5px; color: var(--color-text-secondary);">Ký hiệu nhanh:</span>
          <button type="button" class="engrave-sym-btn" data-sym=" ♥ " style="border: 1px solid var(--color-border); background: #fff; border-radius: 4px; padding: 2px 7px; font-size: 12px; cursor: pointer;">♥</button>
          <button type="button" class="engrave-sym-btn" data-sym=" ∞ " style="border: 1px solid var(--color-border); background: #fff; border-radius: 4px; padding: 2px 7px; font-size: 12px; cursor: pointer;">∞</button>
          <button type="button" class="engrave-sym-btn" data-sym=" ★ " style="border: 1px solid var(--color-border); background: #fff; border-radius: 4px; padding: 2px 7px; font-size: 12px; cursor: pointer;">★</button>
          <button type="button" class="engrave-sym-btn" data-sym=" 🍀 " style="border: 1px solid var(--color-border); background: #fff; border-radius: 4px; padding: 2px 7px; font-size: 12px; cursor: pointer;">🍀</button>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <button type="button" class="engrave-font-btn is-active" data-font="'Cormorant Garamond', Georgia, serif" data-label="Chữ Thanh Lịch" style="border: 1px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; border-radius: 4px; padding: 3px 8px; font-size: 11px; cursor: pointer;">Thanh lịch</button>
          <button type="button" class="engrave-font-btn" data-font="cursive, serif" data-label="Chữ Ký Mềm Mại" style="border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); border-radius: 4px; padding: 3px 8px; font-size: 11px; font-style: italic; cursor: pointer;">Chữ ký</button>
          <button type="button" class="engrave-font-btn" data-font="'Plus Jakarta Sans', sans-serif" data-label="Chữ Hiện Đại" style="border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); border-radius: 4px; padding: 3px 8px; font-size: 11px; font-weight: 600; cursor: pointer;">Hiện đại</button>
        </div>
      </div>
      <!-- Metallic Silver Engraving Plate Preview -->
      <div style="background: linear-gradient(135deg, #E2E5E8 0%, #F8F9FA 45%, #CFD4D8 55%, #EBEEF0 100%); border: 1px solid #BDC3C7; border-radius: 24px; padding: 10px 18px; text-align: center; box-shadow: inset 0 1px 4px rgba(0,0,0,0.12);">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #667; margin-bottom: 2px;">Mô phỏng khắc trên bề mặt Bạc S925</div>
        <div id="pdp-engrave-preview-text" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 600; color: #3A4246; text-shadow: 0 1px 0 rgba(255,255,255,0.85); letter-spacing: 0.06em; min-height: 24px;">Phát Đạt ♥ Forever</div>
      </div>
    </div>
  `;
  info.appendChild(engraveBox);

  const engraveToggle = engraveBox.querySelector('#pdp-engrave-toggle');
  const engravePane = engraveBox.querySelector('#pdp-engrave-pane');
  const engraveInput = engraveBox.querySelector('#pdp-engrave-input');
  const engravePreview = engraveBox.querySelector('#pdp-engrave-preview-text');

  engraveBox.querySelector('#pdp-fengshui-check-btn').addEventListener('click', () => {
    openFengShuiMatcherModal();
  });

  engraveToggle.addEventListener('change', () => {
    engravePane.style.display = engraveToggle.checked ? 'block' : 'none';
    if (engraveToggle.checked) engraveInput.focus();
  });
  engraveInput.addEventListener('input', () => {
    engravePreview.textContent = engraveInput.value.trim() || 'Phát Đạt ♥ Forever';
  });
  engraveBox.querySelectorAll('.engrave-sym-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if ((engraveInput.value + btn.dataset.sym).length <= 18) {
        engraveInput.value += btn.dataset.sym;
        engravePreview.textContent = engraveInput.value.trim() || 'Phát Đạt ♥ Forever';
        engraveInput.focus();
      }
    });
  });
  engraveBox.querySelectorAll('.engrave-font-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedEngravingFont = btn.dataset.font;
      selectedEngravingFontLabel = btn.dataset.label;
      engravePreview.style.fontFamily = selectedEngravingFont;
      engraveBox.querySelectorAll('.engrave-font-btn').forEach(b => {
        b.style.background = '#fff';
        b.style.color = 'var(--color-text-primary)';
        b.style.borderColor = 'var(--color-border)';
      });
      btn.style.background = 'var(--color-brand-primary)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--color-brand-primary)';
    });
  });

  // ── Gift Card Message Box & VIP Packaging Selector (Hộp quà & Thiệp viết tay miễn phí) ──
  const giftBox = document.createElement('div');
  giftBox.style.cssText = `
    background: #FAF6EE;
    border: 1px dashed var(--color-accent-gold);
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 18px;
  `;
  giftBox.innerHTML = `
    <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #8A6218; cursor: pointer;">
      <input type="checkbox" id="pdp-gift-toggle" style="accent-color: var(--color-brand-primary); width: 16px; height: 16px; cursor: pointer;">
      <span>🎁 Chọn Hộp Quà Tặng Sang Trọng & Thiệp Viết Tay (Miễn phí)</span>
    </label>
    <div id="pdp-gift-pane" style="display: none; margin-top: 10px;">
      <div style="font-size: 11.5px; font-weight: 600; color: #7A5411; margin-bottom: 6px;">🎀 Chọn phong cách hộp quà đi kèm:</div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 10px;">
        <button type="button" class="gift-box-style-btn is-active" data-box="Hộp Nhung Xanh Ngọc Lục Bảo" style="padding: 6px; border: 1.5px solid var(--color-brand-primary); background: #fff; border-radius: 6px; font-size: 11px; font-weight: 600; color: var(--color-brand-primary); cursor: pointer;">💚 Hộp Nhung Xanh</button>
        <button type="button" class="gift-box-style-btn" data-box="Hộp Nơ Kem Hoàng Gia" style="padding: 6px; border: 1px solid var(--color-border); background: #fff; border-radius: 6px; font-size: 11px; color: var(--color-text-primary); cursor: pointer;">🎀 Hộp Nơ Kem</button>
        <button type="button" class="gift-box-style-btn" data-box="Túi Gấm Đỏ May Mắn" style="padding: 6px; border: 1px solid var(--color-border); background: #fff; border-radius: 6px; font-size: 11px; color: var(--color-text-primary); cursor: pointer;">🧧 Túi Gấm Đỏ</button>
      </div>
      <input type="text" id="pdp-gift-note-input" style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 4px; font-size: 13px; background: #fff;" placeholder="Nhập lời chúc trên thiệp (VD: Chúc mừng sinh nhật em yêu!)...">
      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px;">
        <button type="button" class="gift-preset-chip" data-msg="Chúc mừng sinh nhật người thương, luôn rạng rỡ và hạnh phúc!" style="background: #fff; border: 1px solid var(--color-border); border-radius: 12px; padding: 2px 8px; font-size: 11px; color: var(--color-text-secondary); cursor: pointer;">+ Sinh nhật người yêu</button>
        <button type="button" class="gift-preset-chip" data-msg="Chúc Mẹ yêu luôn mạnh khỏe, bình an và tươi trẻ!" style="background: #fff; border: 1px solid var(--color-border); border-radius: 12px; padding: 2px 8px; font-size: 11px; color: var(--color-text-secondary); cursor: pointer;">+ Tặng Mẹ</button>
        <button type="button" class="gift-preset-chip" data-msg="Gửi ngàn điều may mắn và yêu thương đến bạn!" style="background: #fff; border: 1px solid var(--color-border); border-radius: 12px; padding: 2px 8px; font-size: 11px; color: var(--color-text-secondary); cursor: pointer;">+ Lời chúc may mắn</button>
      </div>
    </div>
  `;
  info.appendChild(giftBox);

  const giftToggle = giftBox.querySelector('#pdp-gift-toggle');
  const giftPane = giftBox.querySelector('#pdp-gift-pane');
  const giftNoteInput = giftBox.querySelector('#pdp-gift-note-input');
  giftToggle.addEventListener('change', () => {
    giftPane.style.display = giftToggle.checked ? 'block' : 'none';
    if (giftToggle.checked) giftNoteInput.focus();
  });
  giftBox.querySelectorAll('.gift-box-style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedGiftBoxStyle = btn.dataset.box;
      giftBox.querySelectorAll('.gift-box-style-btn').forEach(b => {
        b.style.border = '1px solid var(--color-border)';
        b.style.fontWeight = '400';
        b.style.color = 'var(--color-text-primary)';
      });
      btn.style.border = '1.5px solid var(--color-brand-primary)';
      btn.style.fontWeight = '600';
      btn.style.color = 'var(--color-brand-primary)';
    });
  });
  giftBox.querySelectorAll('.gift-preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      giftNoteInput.value = chip.dataset.msg;
    });
  });

  // ── Call to action buttons ──
  const ctaContainer = document.createElement('div');
  ctaContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;';

  // 1. Zalo Consult Button with Auto-copy Product Info + Engraving + Gift Note
  const zaloBtn = document.createElement('button');
  zaloBtn.type = 'button';
  zaloBtn.className = 'btn btn--full';
  zaloBtn.style.cssText = `
    background-color: #0068FF;
    border-color: #0068FF;
    color: #ffffff;
    font-weight: 600;
    gap: 8px;
    padding: 14px 20px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `;
  zaloBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.84 7.07-.17 1.15-.72 2.76-1.78 3.86 1.76.12 3.65-.63 4.94-1.57.97.26 2 .41 3 .41 5.52 0 10-4.03 10-9s-4.48-9-10-9z"/>
    </svg>
    <span>NHẮN ZALO TƯ VẤN & XEM VIDEO THẬT</span>
  `;

  zaloBtn.addEventListener('click', () => {
    trackProductEvent(product.id, 'zalo');
    const engraveText = engraveToggle.checked && engraveInput.value.trim()
      ? `\n- ✒️ Khắc Laser: "${engraveInput.value.trim()}" (${selectedEngravingFontLabel})`
      : '';
    const giftText = giftToggle.checked
      ? `\n- 🎁 Đóng gói: ${selectedGiftBoxStyle}${giftNoteInput.value.trim() ? ` | Thiệp: "${giftNoteInput.value.trim()}"` : ''}`
      : '';
    const variantText = `\n- Tùy chọn: ${selectedSize || 'Freesize'} | ${selectedColor || 'Chuẩn'}`;
    const infoText = `[Phát Đạt Jewelry] Tôi muốn tư vấn sản phẩm:\n- Tên SP: ${product.name}\n- Mã SKU: ${product.reference}\n- Giá: ${formatPrice(product.price)}${variantText}${engraveText}${giftText}\n- Link xem: ${window.location.href}`;
    try {
      navigator.clipboard.writeText(infoText);
      showToast('Đã sao chép thông tin sản phẩm & tùy chọn cá nhân hóa! Bạn chỉ cần Dán (Paste) vào Zalo.', 'success', 4000);
    } catch (e) {}
    setTimeout(() => {
      window.open(siteInfo.zalo, '_blank', 'noopener,noreferrer');
    }, 500);
  });
  ctaContainer.appendChild(zaloBtn);

  // 2. Quick Callback Request Button
  const callbackBtn = document.createElement('button');
  callbackBtn.type = 'button';
  callbackBtn.className = 'btn btn--full';
  callbackBtn.style.cssText = `
    background-color: var(--color-accent-gold);
    border-color: var(--color-accent-gold);
    color: #143F3B;
    font-weight: 700;
    gap: 8px;
    padding: 13px 20px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;
  `;
  callbackBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
    <span>YÊU CẦU GỌI LẠI TƯ VẤN (MIỄN PHÍ)</span>
  `;
  callbackBtn.addEventListener('click', () => {
    const engraveSummary = engraveToggle.checked && engraveInput.value.trim()
      ? ` | Khắc: "${engraveInput.value.trim()}" (${selectedEngravingFontLabel})`
      : '';
    const boxSummary = giftToggle.checked ? `[${selectedGiftBoxStyle}] ${giftNoteInput.value.trim()}` : '';
    openQuickCallbackModal(product, {
      selectedInfo: `Size: ${selectedSize || 'Freesize'}, Màu: ${selectedColor || 'Bạc 925'}${engraveSummary}`,
      giftCardNote: boxSummary
    });
  });
  ctaContainer.appendChild(callbackBtn);

  // 3. Phone Call Button (Secondary CTA)
  const phoneBtn = document.createElement('a');
  phoneBtn.className = 'btn btn--full btn--outline';
  phoneBtn.style.cssText = `
    border-color: var(--color-brand-primary);
    color: var(--color-brand-primary);
    font-weight: 600;
    gap: 8px;
    padding: 12px 20px;
  `;
  phoneBtn.href = siteInfo.phoneHref;
  phoneBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
    <span>GỌI HOTLINE: ${siteInfo.phoneDisplay}</span>
  `;
  ctaContainer.appendChild(phoneBtn);

  info.appendChild(ctaContainer);

  // ── Brand Trust & Service Commitments ──
  const trustBox = document.createElement('div');
  trustBox.style.cssText = `
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 24px;
    font-size: 13px;
    line-height: 1.6;
  `;
  trustBox.innerHTML = `
    <div style="font-weight: 600; color: var(--color-brand-primary); margin-bottom: 8px; font-size: 14px;">CAM KẾT TỪ PHÁT ĐẠT JEWELRY:</div>
    <div style="display: grid; gap: 8px;">
      <div style="display: flex; align-items: flex-start; gap: 8px;">
        <span style="color: var(--color-brand-primary); font-size: 15px;">✓</span>
        <span><strong>Bạc 925 chuẩn kiểm định:</strong> Bề mặt sáng bóng, an toàn cho da nhạy cảm.</span>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 8px;">
        <span style="color: var(--color-brand-primary); font-size: 15px;">✓</span>
        <span><strong>Làm sáng trọn đời miễn phí:</strong> Hỗ trợ đánh bóng & làm sạch sản phẩm bất kỳ lúc nào.</span>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 8px;">
        <span style="color: var(--color-brand-primary); font-size: 15px;">✓</span>
        <span><strong>Tặng kèm trọn bộ quà:</strong> Hộp bảo quản sang trọng + khăn lau bạc chuyên dụng.</span>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 8px;">
        <span style="color: var(--color-brand-primary); font-size: 15px;">✓</span>
        <span><strong>Giao hàng toàn quốc:</strong> Khách được kiểm tra hàng trước khi thanh toán.</span>
      </div>
    </div>
  `;
  info.appendChild(trustBox);

  // Specifications Accordions
  if (product.specifications && Object.keys(product.specifications).length > 0) {
    const specsSection = document.createElement('div');
    specsSection.className = 'pdp-specs';

    const specsContent = Object.entries(product.specifications).map(([key, value]) => `
      <div style="display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--color-border-light);">
        <span style="color: var(--color-text-secondary); font-size: 13px;">${key}</span>
        <span style="font-size: 13px; font-weight: 500; color: var(--color-text-primary);">${value}</span>
      </div>
    `).join('');

    specsSection.appendChild(createAccordion('CHI TIẾT CHẾ TÁC & THÔNG SỐ', `
      <p style="margin-bottom: 14px; font-size: 14px; line-height: 1.6;">${product.description}</p>
      ${specsContent}
    `, true));

    specsSection.appendChild(createAccordion('CHÍNH SÁCH BẢO HÀNH & LÀM SÁNG', `
      <p style="font-size: 13px; line-height: 1.7; margin-bottom: 8px;">• Bảo hành làm sáng, đánh bóng bạc miễn phí trọn đời tại cửa hàng.</p>
      <p style="font-size: 13px; line-height: 1.7; margin-bottom: 8px;">• Đổi mới 1-1 trong 7 ngày nếu sản phẩm có lỗi từ khâu sản xuất hoặc đứt gãy trong quá trình vận chuyển.</p>
      <p style="font-size: 13px; line-height: 1.7;">• Hỗ trợ thu đổi hoặc chỉnh sửa kích cỡ vòng/nhẫn chu đáo.</p>
    `));

    specsSection.appendChild(createAccordion('QUY CÁCH ĐÓNG GÓI & QUÀ TẶNG', `
      <p style="font-size: 13px; line-height: 1.7;">Mỗi sản phẩm gửi đến quý khách đều được bọc cẩn thận trong hộp nhung hoặc hộp nơ Phát Đạt Jewelry, kèm túi giấy thanh lịch và khăn lau bạc cao cấp. Rất thích hợp làm quà tặng bạn bè, người thương hoặc tự thưởng cho bản thân.</p>
    `));

    info.appendChild(specsSection);
  }

  // ── Complete The Look / Mix & Match Combo Set ──
  const sameCollectionDiffCat = products.filter(p => p.id !== product.id && p.collection === product.collection && p.category !== product.category);
  const fallbackComplement = products.filter(p => p.id !== product.id && p.category !== product.category);
  const pairItems = [...sameCollectionDiffCat, ...fallbackComplement].slice(0, 2);

  if (pairItems.length > 0) {
    const comboProducts = [product, ...pairItems];
    const comboBox = document.createElement('div');
    comboBox.style.cssText = 'margin-top: 28px; background: #FBF9F5; border: 1px solid #E5DEC9; border-radius: 10px; padding: 18px;';
    comboBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
        <div>
          <span style="font-size: 11px; font-weight: 700; color: #8A6218; text-transform: uppercase; letter-spacing: 0.08em;">✨ Gợi ý phối đồ đồng điệu</span>
          <h3 style="font-family: var(--font-display); font-size: 17px; color: var(--color-brand-primary); margin: 2px 0 0;">Phối Trọn Bộ ${product.collection}</h3>
        </div>
        <span style="font-size: 11px; background: #FAF4E8; color: #8A6218; border: 1px solid var(--color-accent-gold); padding: 3px 9px; border-radius: 12px; font-weight: 600;">🎁 Tặng hộp quà đôi & khăn lau bạc</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;" id="combo-items-list">
        ${comboProducts.map((cp, idx) => `
          <label style="display: flex; align-items: center; gap: 10px; background: #ffffff; border: 1px solid var(--color-border-light); border-radius: 8px; padding: 8px 10px; cursor: pointer;">
            <input type="checkbox" class="combo-item-check" data-id="${cp.id}" checked style="width: 16px; height: 16px; accent-color: var(--color-brand-primary);">
            <img src="${cp.images[0]}" alt="${cp.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px; flex-shrink: 0;">
            <div style="flex: 1; overflow: hidden;">
              <div style="font-size: 12.5px; font-weight: 600; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${idx === 0 ? '<span style="color:var(--color-brand-primary);">[Đang xem]</span> ' : ''}${cp.name}
              </div>
              <div style="font-size: 11px; color: var(--color-text-secondary);">Mã: ${cp.reference} · ${cp.materials}</div>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); white-space: nowrap;">${formatPrice(cp.price)}</div>
          </label>
        `).join('')}
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; border-top: 1px dashed #DFD6BE; padding-top: 12px;">
        <div>
          <span style="font-size: 12px; color: var(--color-text-secondary);">Tổng giá trị bộ (<span id="combo-count-num">${comboProducts.length}</span> món):</span>
          <strong id="combo-total-price" style="font-size: 17px; color: var(--color-brand-primary); margin-left: 6px;">
            ${formatPrice(comboProducts.reduce((s, i) => s + i.price, 0))}
          </strong>
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="button" id="combo-zalo-btn" style="background: #0068FF; color: #fff; border: none; border-radius: 6px; padding: 8px 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
            💬 Tư vấn bộ này qua Zalo
          </button>
          <button type="button" id="combo-callback-btn" style="background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; padding: 8px 12px; font-size: 12px; font-weight: 700; cursor: pointer;">
            📞 Gọi lại tư vấn bộ
          </button>
        </div>
      </div>
    `;
    info.appendChild(comboBox);

    const getSelectedComboProducts = () => {
      const checkedIds = Array.from(comboBox.querySelectorAll('.combo-item-check:checked')).map(c => c.dataset.id);
      return comboProducts.filter(cp => checkedIds.includes(cp.id));
    };

    comboBox.querySelectorAll('.combo-item-check').forEach(chk => {
      chk.addEventListener('change', () => {
        const selected = getSelectedComboProducts();
        comboBox.querySelector('#combo-count-num').textContent = selected.length;
        comboBox.querySelector('#combo-total-price').textContent = formatPrice(selected.reduce((s, i) => s + i.price, 0));
      });
    });

    comboBox.querySelector('#combo-zalo-btn').addEventListener('click', () => {
      const selected = getSelectedComboProducts();
      if (selected.length === 0) {
        showToast('Vui lòng chọn ít nhất 1 món trong bộ trang sức!', 'warning');
        return;
      }
      const lines = selected.map((item, idx) => `${idx + 1}. ${item.name} (${item.reference}) - ${formatPrice(item.price)}`).join('\n');
      const total = formatPrice(selected.reduce((s, i) => s + i.price, 0));
      const msg = `[Phát Đạt Jewelry] Tôi muốn tư vấn phối trọn bộ (${selected.length} món - Tổng: ${total}):\n${lines}`;
      try {
        navigator.clipboard.writeText(msg);
        showToast('Đã sao chép trọn bộ trang sức! Bạn chỉ cần Dán (Paste) vào Zalo.', 'success', 3500);
      } catch (e) {}
      setTimeout(() => {
        window.open(siteInfo.zalo, '_blank', 'noopener,noreferrer');
      }, 450);
    });

    comboBox.querySelector('#combo-callback-btn').addEventListener('click', () => {
      const selected = getSelectedComboProducts();
      if (selected.length === 0) {
        showToast('Vui lòng chọn ít nhất 1 món trong bộ trang sức!', 'warning');
        return;
      }
      openQuickCallbackModal(selected);
    });
  }

  // ── Customer Reviews & Interactive Review Submission ──
  const reviewsSection = document.createElement('div');
  reviewsSection.style.cssText = 'margin-top: 32px; border-top: 1px solid var(--color-border); padding-top: 24px;';

  function renderReviewsContent() {
    const customRevs = getCustomProductReviews(product.id);
    const allReviews = [...customRevs, ...(product.reviews || [])];
    let chosenRating = 5;

    reviewsSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 16px;">
        <div>
          <h3 style="font-family: var(--font-display); font-size: 18px; color: var(--color-brand-primary); margin: 0;">Đánh Giá Của Khách Hàng (${allReviews.length})</h3>
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Trung bình ★ ${product.rating || 4.9}/5 từ khách hàng đã sở hữu</div>
        </div>
        <button type="button" id="toggle-write-review-btn" style="background: var(--color-brand-light); color: var(--color-brand-primary); border: 1px solid var(--color-brand-primary); border-radius: 6px; padding: 7px 14px; font-size: 12.5px; font-weight: 700; cursor: pointer;">
          ✍️ Viết đánh giá của bạn
        </button>
      </div>

      <!-- Write Review Form (Collapsible) -->
      <form id="pdp-write-review-form" style="display: none; background: #F8FAF9; border: 1px solid var(--color-border); border-radius: 8px; padding: 16px; margin-bottom: 18px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 10px;">Chia sẻ cảm nhận của bạn về ${product.name}</div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <span style="font-size: 12px; font-weight: 600;">Mức độ hài lòng:</span>
          <div id="rev-star-picker" style="display: inline-flex; gap: 4px;">
            ${[1, 2, 3, 4, 5].map(st => `
              <button type="button" class="rev-star-btn" data-star="${st}" style="background: none; border: none; font-size: 20px; color: #f39c12; cursor: pointer; padding: 0;">★</button>
            `).join('')}
          </div>
          <span id="rev-star-label" style="font-size: 12px; color: var(--color-brand-primary); font-weight: 600;">Tuyệt vời (5/5)</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <input type="text" id="rev-author" required placeholder="Tên của bạn (VD: Minh Thư) *" style="padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12.5px;">
          <input type="text" id="rev-city" placeholder="Tỉnh / Thành (VD: Q.7, TP.HCM)" style="padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12.5px;">
        </div>
        <textarea id="rev-comment" rows="2" required placeholder="Cảm nhận về độ sáng của bạc, đá đính kèm, hộp quà... *" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12.5px; margin-bottom: 10px;"></textarea>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" id="cancel-rev-btn" style="background: #fff; border: 1px solid var(--color-border); border-radius: 6px; padding: 6px 12px; font-size: 12px; cursor: pointer;">Hủy</button>
          <button type="submit" style="background: var(--color-brand-primary); color: #fff; border: none; border-radius: 6px; padding: 7px 16px; font-size: 12px; font-weight: 700; cursor: pointer;">Gửi đánh giá</button>
        </div>
      </form>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${allReviews.map(r => `
          <div style="background: #fafaf8; border: 1px solid var(--color-border-light); border-radius: 6px; padding: 14px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="font-weight: 600; font-size: 13px; color: var(--color-text-primary);">
                ${r.author} <span style="font-weight: 400; color: var(--color-text-secondary); font-size: 12px;">(${r.city || 'TP.HCM'})</span>
                ${r.variant ? `<span style="margin-left: 6px; font-size: 11px; background: #EBF4F3; color: var(--color-brand-primary); padding: 1px 7px; border-radius: 10px; font-weight: 500;">${r.variant}</span>` : ''}
              </div>
              <div style="color: #f39c12; font-size: 12px;">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
            </div>
            <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.5; margin: 0;">"${r.comment}"</p>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 6px; text-align: right;">✓ Đã sở hữu tại Phát Đạt Jewelry · ${r.date}</div>
          </div>
        `).join('')}
      </div>
    `;

    const toggleBtn = reviewsSection.querySelector('#toggle-write-review-btn');
    const revForm = reviewsSection.querySelector('#pdp-write-review-form');
    const cancelBtn = reviewsSection.querySelector('#cancel-rev-btn');

    toggleBtn.addEventListener('click', () => {
      revForm.style.display = revForm.style.display === 'none' ? 'block' : 'none';
    });
    cancelBtn.addEventListener('click', () => {
      revForm.style.display = 'none';
    });

    const starLabels = { 1: 'Cần cải thiện (1/5)', 2: 'Tạm ổn (2/5)', 3: 'Hài lòng (3/5)', 4: 'Rất đẹp (4/5)', 5: 'Tuyệt vời (5/5)' };
    reviewsSection.querySelectorAll('.rev-star-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        chosenRating = parseInt(btn.dataset.star, 10) || 5;
        reviewsSection.querySelector('#rev-star-label').textContent = starLabels[chosenRating];
        reviewsSection.querySelectorAll('.rev-star-btn').forEach(b => {
          const st = parseInt(b.dataset.star, 10);
          b.textContent = st <= chosenRating ? '★' : '☆';
        });
      });
    });

    revForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = reviewsSection.querySelector('#rev-author').value.trim();
      const city = reviewsSection.querySelector('#rev-city').value.trim() || 'TP.HCM';
      const comment = reviewsSection.querySelector('#rev-comment').value.trim();
      if (!author || !comment) return;

      addCustomProductReview(product.id, {
        author,
        city,
        rating: chosenRating,
        variant: `${selectedSize} · ${selectedColor}`,
        comment
      });
      showToast('Cảm ơn bạn đã gửi đánh giá cho sản phẩm!', 'success', 3000);
      renderReviewsContent();
    });
  }

  renderReviewsContent();
  info.appendChild(reviewsSection);

  infoPanel.appendChild(info);
  pdpLayout.appendChild(infoPanel);
  page.appendChild(pdpLayout);

  // ── Mobile Sticky Bar ──
  const stickyBar = document.createElement('div');
  stickyBar.className = 'pdp-mobile-sticky-bar';
  stickyBar.style.cssText = `
    position: fixed;
    bottom: 56px;
    left: 0;
    right: 0;
    background: #ffffff;
    border-top: 1px solid var(--color-border);
    padding: 10px 16px;
    display: none;
    align-items: center;
    justify-content: space-between;
    z-index: 700;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.06);
  `;
  stickyBar.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; max-width: 45%;">
      <img src="${galleryImages[0]}" alt="${product.name}" style="width: 38px; height: 38px; object-fit: cover; border-radius: 4px; border: 1px solid var(--color-border-light); flex-shrink: 0;">
      <div style="overflow: hidden;">
        <div style="font-size: 12px; font-weight: 600; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.name}</div>
        <div style="font-size: 12px; font-weight: 700; color: var(--color-brand-primary);">${formatPrice(product.price)}</div>
      </div>
    </div>
    <div style="display: flex; gap: 6px; align-items: center;">
      <button type="button" id="sticky-callback-btn" style="
        background-color: var(--color-accent-gold);
        color: #143F3B;
        border: none;
        padding: 8px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
      ">Gọi lại</button>
      <button type="button" id="sticky-zalo-btn" style="
        background-color: #0068FF;
        color: #fff;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      ">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.84 7.07-.17 1.15-.72 2.76-1.78 3.86 1.76.12 3.65-.63 4.94-1.57.97.26 2 .41 3 .41 5.52 0 10-4.03 10-9s-4.48-9-10-9z"/>
        </svg>
        Zalo
      </button>
    </div>
  `;
  page.appendChild(stickyBar);

  stickyBar.querySelector('#sticky-callback-btn').addEventListener('click', () => {
    openQuickCallbackModal(product);
  });

  stickyBar.querySelector('#sticky-zalo-btn').addEventListener('click', () => {
    const infoText = `[Phát Đạt Jewelry] Tôi muốn tư vấn sản phẩm:\n- Tên SP: ${product.name}\n- Mã SKU: ${product.reference}\n- Giá: ${formatPrice(product.price)}\n- Link xem: ${window.location.href}`;
    try {
      navigator.clipboard.writeText(infoText);
      showToast('Đã sao chép mã và link sản phẩm! Bạn chỉ cần Dán (Paste) vào khung chat Zalo.', 'success', 3500);
    } catch (e) {}
    setTimeout(() => {
      window.open(siteInfo.zalo, '_blank', 'noopener,noreferrer');
    }, 400);
  });

  // Show sticky bar on scroll on mobile
  const handleScroll = () => {
    if (window.innerWidth <= 768) {
      if (window.scrollY > 400) {
        stickyBar.style.display = 'flex';
      } else {
        stickyBar.style.display = 'none';
      }
    } else {
      stickyBar.style.display = 'none';
    }
  };
  window.addEventListener('scroll', handleScroll);

  // ── Related Products Carousel ──
  const related = getRelatedProducts(productId, 6);
  if (related.length > 0) {
    const relatedSection = document.createElement('section');
    relatedSection.className = 'pdp-related container';
    relatedSection.style.cssText = 'margin-top: 48px; border-top: 1px solid var(--color-border); padding-top: 40px;';

    const relatedHeader = document.createElement('div');
    relatedHeader.className = 'pdp-related__header';
    relatedHeader.innerHTML = `
      <h2 class="pdp-related__title" style="font-family: var(--font-display); color: var(--color-brand-primary);">Cùng Bộ Sưu Tập ${product.collection}</h2>
    `;
    relatedSection.appendChild(relatedHeader);

    const carouselItems = related.map(p => createProductCard(p));
    const carousel = createCarousel(carouselItems, {
      slidesPerView: 3,
      slidesPerViewTablet: 2,
      slidesPerViewMobile: 1,
      showDots: true,
      showArrows: true,
    });
    relatedSection.appendChild(carousel);

    page.appendChild(relatedSection);
  }

  // ── Recently Viewed Products ──
  const recentIds = getRecentlyViewedProductIds(productId);
  const recentProducts = recentIds.map(id => getProductById(id)).filter(Boolean).slice(0, 4);
  if (recentProducts.length > 0) {
    const recentSection = document.createElement('section');
    recentSection.className = 'pdp-recent container';
    recentSection.style.cssText = 'margin-top: 40px; border-top: 1px solid var(--color-border-light); padding-top: 32px; padding-bottom: 24px;';
    recentSection.innerHTML = `
      <h2 class="pdp-related__title" style="font-family: var(--font-display); font-size: 20px; color: var(--color-brand-primary); margin-bottom: 20px; text-align: center;">
        Sản Phẩm Bạn Vừa Xem
      </h2>
      <div class="jewelry-grid" id="pdp-recent-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;"></div>
    `;
    const recentGrid = recentSection.querySelector('#pdp-recent-grid');
    recentProducts.forEach(rp => recentGrid.appendChild(createProductCard(rp)));
    page.appendChild(recentSection);
  }

  container.appendChild(page);

  // Wishlist button click
  const wishlistBtn = page.querySelector(`#wishlist-btn-${product.id}`);
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      const isNowLiked = toggleWishlist(product.id);
      const svg = wishlistBtn.querySelector('svg');
      svg.setAttribute('fill', isNowLiked ? '#D4380D' : 'none');
      wishlistBtn.style.color = isNowLiked ? '#D4380D' : 'currentColor';
      showToast(
        isNowLiked ? `Đã thêm "${product.name}" vào danh sách yêu thích!` : `Đã xóa "${product.name}" khỏi danh sách yêu thích`,
        isNowLiked ? 'success' : 'info',
        2500
      );
    });
  }

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}
