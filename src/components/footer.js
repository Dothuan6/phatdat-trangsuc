// ============================================================
// FOOTER COMPONENT — Site footer
// ============================================================

import { t } from '../i18n.js';
import { siteInfo } from '../data/site-info.js';
import {
  openFengShuiMatcherModal,
  openWarrantyLookupModal,
  openGiftFinderModal,
  openLightboxModal
} from './feedback-modal.js';
import { openGlobalSizeGuide } from './size-guide-modal.js';

export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.id = 'site-footer';

  footer.innerHTML = `
    <div class="container">
      <div class="footer-tagline">
        <p>${t('footer.tagline')}</p>
        <a href="#/jewelry" class="link-underline">${t('footer.enterUniverse')}</a>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-creations">
        <h2>${t('footer.ourCreations')}</h2>
        <p>${t('footer.creationsDesc')}</p>
      </div>

      <div class="footer-categories">
        <a href="#/jewelry/necklaces" class="footer-category-card" id="footer-cat-necklaces">
          <img src="./images/gallery/g15.jpg" alt="${t('nav.necklaces')}" loading="lazy">
          <span class="footer-category-card__label">${t('nav.necklaces')}</span>
        </a>
        <a href="#/jewelry/rings" class="footer-category-card" id="footer-cat-rings">
          <img src="./images/gallery/g1.jpg" alt="${t('nav.rings')}" loading="lazy">
          <span class="footer-category-card__label">${t('nav.rings')}</span>
        </a>
        <a href="#/jewelry/bracelets" class="footer-category-card" id="footer-cat-bracelets">
          <img src="./images/gallery/g22.jpg" alt="${t('nav.bracelets')}" loading="lazy">
          <span class="footer-category-card__label">${t('nav.bracelets')}</span>
        </a>
      </div>

      <!-- Interactive Digital Tools Bar in Footer -->
      <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 24px 0;">
        <button type="button" id="footer-btn-fengshui" style="padding: 8px 14px; border-radius: 20px; border: 1px solid #E5C158; background: #FFF9EB; color: #7A5411; font-size: 12.5px; font-weight: 600; cursor: pointer;">🔮 Chọn đá hợp mệnh</button>
        <button type="button" id="footer-btn-warranty" style="padding: 8px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-brand-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🛡️ Tra cứu thẻ bảo hành SĐT</button>
        <button type="button" id="footer-btn-size" style="padding: 8px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">📏 Đo size nhẫn trên màn hình</button>
        <button type="button" id="footer-btn-gift" style="padding: 8px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🎁 Trợ lý chọn quà 30s</button>
      </div>

      <div class="footer-contact">
        <p><strong>${siteInfo.name}</strong></p>
        <p>Địa chỉ: <a href="#/stores">${siteInfo.address}</a></p>
        <p>Hotline: <a href="${siteInfo.phoneHref}">${siteInfo.phoneDisplay}</a> &nbsp;·&nbsp; Giờ làm việc: ${siteInfo.hours}</p>
        <p>
          <a href="#/info/shipping">${t('footer.service1')}</a> &nbsp;·&nbsp;
          <a href="#/info/gifting">${t('footer.service2')}</a> &nbsp;·&nbsp;
          <a href="#/info/warranty">Bảo hành</a> &nbsp;·&nbsp;
          <a href="#/info/size-guide">Hướng dẫn chọn size</a> &nbsp;·&nbsp;
          <a href="#/info/style-guide">Cẩm nang phối đồ</a>
        </p>
      </div>

      <div class="footer-bottom">
        <div class="footer-legal">
          <a href="#/about">${t('nav.about')}</a>
          <a href="#/contact">${t('nav.contactUs')}</a>
          <a href="#/legal/terms-of-use">${t('footer.legalNotices')}</a>
          <a href="#/legal/privacy-policy">${t('footer.privacyPolicy')}</a>
          <a href="#/legal/silver-guarantee">Cam kết Bạc S925</a>
          <a href="#/info/cookies">${t('footer.cookies')}</a>
          <a href="#/info/accessibility">${t('footer.accessibility')}</a>
          <a href="#/sitemap">${t('footer.sitemap')}</a>
          <a href="#/admin" style="color: var(--color-brand-primary); font-weight: 600;">🔒 Quản trị (Admin)</a>
        </div>
        <div class="footer-social">
          <a href="${siteInfo.facebook}" target="_blank" rel="noopener" aria-label="Facebook ${siteInfo.facebookName}" title="Facebook Phát Đạt Jewelry">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>
          <a href="${siteInfo.tiktok}" target="_blank" rel="noopener" aria-label="TikTok ${siteInfo.tiktokName}" title="TikTok @phat.dat.jewelry">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
            </svg>
          </a>
          <a href="${siteInfo.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${siteInfo.instagramName}" title="Instagram @jewelryphatdat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <button type="button" id="footer-ig-qr-btn" class="footer-social__zalo" style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #fff; border: none; cursor: pointer; padding: 4px 10px; border-radius: 14px; font-size: 11px; font-weight: 700;" title="Quét mã QR Instagram @jewelryphatdat">
            QR IG
          </button>
          <a href="${siteInfo.zalo}" target="_blank" rel="noopener" class="footer-social__zalo" aria-label="Zalo">Zalo</a>
          <a href="${siteInfo.phoneHref}" aria-label="Gọi ${siteInfo.phoneDisplay}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </a>
        </div>
      </div>

      <p class="footer-copyright">${t('common.copyright')}</p>
    </div>
  `;

  footer.querySelector('#footer-btn-fengshui').addEventListener('click', () => openFengShuiMatcherModal());
  footer.querySelector('#footer-btn-warranty').addEventListener('click', () => openWarrantyLookupModal());
  footer.querySelector('#footer-btn-size').addEventListener('click', () => openGlobalSizeGuide('ruler'));
  footer.querySelector('#footer-btn-gift').addEventListener('click', () => openGiftFinderModal());
  footer.querySelector('#footer-ig-qr-btn').addEventListener('click', () => {
    openLightboxModal([siteInfo.instagramQr || './images/instagram-qr.png'], 0, 'Mã QR Instagram @jewelryphatdat — Phát Đạt Jewelry');
  });

  return footer;
}
