// ============================================================
// FOOTER COMPONENT — Site footer
// ============================================================

import { t } from '../i18n.js';
import { siteInfo } from '../data/site-info.js';

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

      <div class="footer-contact">
        <p><strong>${siteInfo.name}</strong></p>
        <p>Địa chỉ: <a href="#/stores">${siteInfo.address}</a></p>
        <p>Hotline: <a href="${siteInfo.phoneHref}">${siteInfo.phoneDisplay}</a> &nbsp;·&nbsp; Giờ làm việc: ${siteInfo.hours}</p>
        <p>
          <a href="#/info/shipping">${t('footer.service1')}</a> &nbsp;·&nbsp;
          <a href="#/info/gifting">${t('footer.service2')}</a> &nbsp;·&nbsp;
          <a href="#/info/warranty">Bảo hành</a> &nbsp;·&nbsp;
          <a href="#/info/size-guide">Hướng dẫn chọn size</a>
        </p>
      </div>

      <div class="footer-bottom">
        <div class="footer-legal">
          <a href="#/about">${t('nav.about')}</a>
          <a href="#/contact">${t('nav.contactUs')}</a>
          <a href="#/legal/terms-of-use">${t('footer.legalNotices')}</a>
          <a href="#/legal/privacy-policy">${t('footer.privacyPolicy')}</a>
          <a href="#/info/cookies">${t('footer.cookies')}</a>
          <a href="#/info/accessibility">${t('footer.accessibility')}</a>
          <a href="#/sitemap">${t('footer.sitemap')}</a>
          <a href="#/admin" style="color: var(--color-brand-primary); font-weight: 600;">🔒 Quản trị (Admin)</a>
        </div>
        <div class="footer-social">
          <a href="${siteInfo.facebook}" target="_blank" rel="noopener" aria-label="Facebook ${siteInfo.facebookName}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>
          <a href="${siteInfo.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${siteInfo.instagramName}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
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

  return footer;
}
