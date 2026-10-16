// ============================================================
// PRODUCT DETAIL PAGE (PDP) — Phát Đạt Jewelry
// ============================================================

import { getProductById, getRelatedProducts, formatPrice } from '../data/products.js';
import { createAccordion } from '../components/accordion.js';
import { createProductCard } from '../components/product-card.js';
import { createCarousel } from '../components/carousel.js';
import { openGlobalSizeGuide } from '../components/size-guide-modal.js';
import { siteInfo } from '../data/site-info.js';
import { t } from '../i18n.js';
import { isWishlisted, toggleWishlist } from '../data/wishlist-store.js';
import { showToast, openLightboxModal, openQuickCallbackModal } from '../components/feedback-modal.js';

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

  // Rating & Code Row
  const isLiked = isWishlisted(product.id);
  const heartFill = isLiked ? '#D4380D' : 'none';
  const heartColor = isLiked ? '#D4380D' : 'currentColor';

  const subRow = document.createElement('div');
  subRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--color-border-light); padding-bottom: 12px;';
  subRow.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
      <span style="color: #f39c12;">★★★★★</span>
      <span style="font-weight: 600; color: var(--color-text-primary);">${product.rating}</span>
      <span style="color: var(--color-text-secondary);">(${product.reviewsCount} đánh giá)</span>
      <span style="color: var(--color-border);">|</span>
      <span style="color: var(--color-text-secondary); font-family: monospace;">Mã: ${product.reference}</span>
    </div>
    <button class="wishlist-btn" aria-label="Thêm vào yêu thích" id="wishlist-btn-${product.id}" style="color: ${heartColor}; background:none; border:none; cursor:pointer;">
      <svg viewBox="0 0 24 24" fill="${heartFill}" stroke="currentColor" stroke-width="1.6" width="22" height="22">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    </button>
  `;
  info.appendChild(subRow);

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
      <button id="open-size-guide-link" type="button" style="background: none; border: none; font-size: 13px; color: var(--color-brand-primary); cursor: pointer; text-decoration: underline; font-weight: 500; display: flex; align-items: center; gap: 4px;">
        📏 Hướng dẫn chọn size
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
      openGlobalSizeGuide(product.category === 'bracelets' ? 'bracelet' : 'ring');
    });

    info.appendChild(sizeSection);
  }

  // Variant: Colors
  if (product.availableColors && product.availableColors.length > 0) {
    const colorSection = document.createElement('div');
    colorSection.style.cssText = 'margin-bottom: 24px;';
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

  // ── Call to action buttons ──
  const ctaContainer = document.createElement('div');
  ctaContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;';

  // 1. Zalo Consult Button with Auto-copy Product Info
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
    const infoText = `[Phát Đạt Jewelry] Tôi muốn tư vấn sản phẩm:\n- Tên SP: ${product.name}\n- Mã SKU: ${product.reference}\n- Giá: ${formatPrice(product.price)}\n- Link xem: ${window.location.href}`;
    try {
      navigator.clipboard.writeText(infoText);
      showToast('Đã sao chép mã và link sản phẩm! Bạn chỉ cần Dán (Paste) vào khung chat Zalo.', 'success', 4000);
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
    openQuickCallbackModal(product);
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

  // ── Customer Reviews & Ratings ──
  const reviewsSection = document.createElement('div');
  reviewsSection.style.cssText = 'margin-top: 32px; border-top: 1px solid var(--color-border); padding-top: 24px;';
  reviewsSection.innerHTML = `
    <h3 style="font-family: var(--font-display); font-size: 18px; color: var(--color-brand-primary); margin-bottom: 16px;">Đánh Giá Của Khách Hàng (${product.reviews.length})</h3>
    <div style="display: flex; flex-direction: column; gap: 14px;">
      ${product.reviews.map(r => `
        <div style="background: #fafaf8; border: 1px solid var(--color-border-light); border-radius: 6px; padding: 14px 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-weight: 600; font-size: 13px; color: var(--color-text-primary);">
              ${r.author} <span style="font-weight: 400; color: var(--color-text-secondary); font-size: 12px;">(${r.city})</span>
            </div>
            <div style="color: #f39c12; font-size: 12px;">★★★★★</div>
          </div>
          <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.5; margin: 0;">"${r.comment}"</p>
          <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 6px; text-align: right;">Đã mua tại Phát Đạt Jewelry · ${r.date}</div>
        </div>
      `).join('')}
    </div>
  `;
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
