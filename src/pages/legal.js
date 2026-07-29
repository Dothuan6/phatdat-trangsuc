// ============================================================
// LEGAL PAGE — Privacy Policy & Terms of Use
// ============================================================

import { t } from '../i18n.js';

export function renderLegal(container, params = {}) {
  const page = document.createElement('div');
  page.className = 'page-legal';

  // Determine initial tab from params or hash
  const initialTab = params.tab || 'privacy-policy';

  // ── Hero / Page Title ──
  const hero = document.createElement('section');
  hero.className = 'legal-hero';
  hero.innerHTML = `
    <div class="container">
      <h1 class="legal-hero__title">${t('legal.pageTitle')}</h1>
    </div>
    <div class="legal-hero__divider"></div>
  `;
  page.appendChild(hero);

  // ── Main Content Layout ──
  const mainSection = document.createElement('section');
  mainSection.className = 'legal-main';

  const mainContainer = document.createElement('div');
  mainContainer.className = 'legal-main__container container';

  // ── Sidebar Navigation ──
  const sidebar = document.createElement('nav');
  sidebar.className = 'legal-sidebar';
  sidebar.setAttribute('aria-label', 'Legal sections');
  sidebar.innerHTML = `
    <ul class="legal-sidebar__list">
      <li>
        <button class="legal-sidebar__link ${initialTab === 'privacy-policy' ? 'is-active' : ''}" 
                data-tab="privacy-policy" id="legal-tab-privacy">
          ${t('legal.privacyPolicy')}
        </button>
      </li>
      <li>
        <button class="legal-sidebar__link ${initialTab === 'terms-of-use' ? 'is-active' : ''}" 
                data-tab="terms-of-use" id="legal-tab-terms">
          ${t('legal.termsOfUse')}
        </button>
      </li>
    </ul>
  `;
  mainContainer.appendChild(sidebar);

  // ── Content Area ──
  const contentArea = document.createElement('div');
  contentArea.className = 'legal-content';

  // Privacy Policy Panel
  const privacyPanel = document.createElement('div');
  privacyPanel.className = `legal-panel ${initialTab === 'privacy-policy' ? 'is-active' : ''}`;
  privacyPanel.id = 'panel-privacy-policy';
  privacyPanel.innerHTML = buildPrivacyContent();
  contentArea.appendChild(privacyPanel);

  // Terms of Use Panel
  const termsPanel = document.createElement('div');
  termsPanel.className = `legal-panel ${initialTab === 'terms-of-use' ? 'is-active' : ''}`;
  termsPanel.id = 'panel-terms-of-use';
  termsPanel.innerHTML = buildTermsContent();
  contentArea.appendChild(termsPanel);

  mainContainer.appendChild(contentArea);
  mainSection.appendChild(mainContainer);
  page.appendChild(mainSection);

  container.appendChild(page);

  // ── Tab Switching Logic ──
  const tabButtons = sidebar.querySelectorAll('.legal-sidebar__link');
  const panels = contentArea.querySelectorAll('.legal-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // Update active tab
      tabButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Update active panel with fade animation
      panels.forEach(p => {
        if (p.id === `panel-${targetTab}`) {
          p.classList.add('is-active');
        } else {
          p.classList.remove('is-active');
        }
      });

      // Scroll to top of content
      mainSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Scroll Spy: Update active tab as user scrolls ──
  // (Optional: highlight sidebar based on scroll position within panels)
}


// ── Privacy Policy Content ──
function buildPrivacyContent() {
  return `
    <h2 class="legal-content__title">${t('legal.privacyPolicy')}</h2>

    <div class="legal-content__meta">
      <p class="legal-content__brand">PHAT DAT JEWELRY</p>
      <p>${t('legal.privacyPolicy')}</p>
      <p>${t('legal.lastUpdated')}: ${t('legal.privacyDate')}</p>
    </div>

    <h3 class="legal-content__heading">${t('legal.privacy.aboutTitle')}</h3>
    <p class="legal-content__text">${t('legal.privacy.aboutText')}</p>

    <h3 class="legal-content__heading">${t('legal.privacy.commitmentTitle')}</h3>
    <p class="legal-content__text">${t('legal.privacy.commitmentIntro')}</p>
    <ol class="legal-content__list legal-content__list--ordered">
      <li><strong>${t('legal.privacy.commitment1Title')}</strong> — ${t('legal.privacy.commitment1Desc')}</li>
      <li><strong>${t('legal.privacy.commitment2Title')}</strong> — ${t('legal.privacy.commitment2Desc')}</li>
      <li><strong>${t('legal.privacy.commitment3Title')}</strong> — ${t('legal.privacy.commitment3Desc')}</li>
    </ol>

    <h3 class="legal-content__heading">${t('legal.privacy.dataCollectedTitle')}</h3>
    <p class="legal-content__text">${t('legal.privacy.dataCollectedIntro')}</p>
    <ul class="legal-content__list">
      <li><strong>${t('legal.privacy.data1Title')}</strong>: ${t('legal.privacy.data1Desc')}</li>
      <li><strong>${t('legal.privacy.data2Title')}</strong>: ${t('legal.privacy.data2Desc')}</li>
      <li><strong>${t('legal.privacy.data3Title')}</strong>: ${t('legal.privacy.data3Desc')}</li>
      <li><strong>${t('legal.privacy.data4Title')}</strong>: ${t('legal.privacy.data4Desc')}</li>
      <li><strong>${t('legal.privacy.data5Title')}</strong>: ${t('legal.privacy.data5Desc')}</li>
    </ul>

    <h3 class="legal-content__heading">${t('legal.privacy.purposeTitle')}</h3>
    <p class="legal-content__text">${t('legal.privacy.purposeIntro')}</p>
    <ul class="legal-content__list">
      <li><strong>${t('legal.privacy.purpose1Title')}</strong>: ${t('legal.privacy.purpose1Desc')}</li>
      <li><strong>${t('legal.privacy.purpose2Title')}</strong>: ${t('legal.privacy.purpose2Desc')}</li>
      <li><strong>${t('legal.privacy.purpose3Title')}</strong>: ${t('legal.privacy.purpose3Desc')}</li>
      <li><strong>${t('legal.privacy.purpose4Title')}</strong>: ${t('legal.privacy.purpose4Desc')}</li>
    </ul>

    <h3 class="legal-content__heading">${t('legal.privacy.sharingTitle')}</h3>
    <p class="legal-content__text">${t('legal.privacy.sharingText')}</p>

    <h3 class="legal-content__heading">${t('legal.privacy.retentionTitle')}</h3>
    <p class="legal-content__text">${t('legal.privacy.retentionText')}</p>

    <h3 class="legal-content__heading">${t('legal.privacy.rightsTitle')}</h3>
    <p class="legal-content__text">${t('legal.privacy.rightsIntro')}</p>
    <ul class="legal-content__list">
      <li>${t('legal.privacy.right1')}</li>
      <li>${t('legal.privacy.right2')}</li>
      <li>${t('legal.privacy.right3')}</li>
      <li>${t('legal.privacy.right4')}</li>
      <li>${t('legal.privacy.right5')}</li>
      <li>${t('legal.privacy.right6')}</li>
    </ul>

    <h3 class="legal-content__heading">${t('legal.privacy.cookiesTitle')}</h3>
    <p class="legal-content__text">${t('legal.privacy.cookiesText')}</p>

    <h3 class="legal-content__heading">${t('legal.privacy.childrenTitle')}</h3>
    <p class="legal-content__text">${t('legal.privacy.childrenText')}</p>

    <h3 class="legal-content__heading">${t('legal.privacy.contactTitle')}</h3>
    <p class="legal-content__text">${t('legal.privacy.contactText')}</p>
    <div class="legal-content__contact-info">
      <p><strong>Email:</strong> contact@phatdatjewelry.com</p>
      <p><strong>${t('legal.privacy.contactAddress')}:</strong> ${t('legal.privacy.contactAddressValue')}</p>
      <p><strong>${t('legal.privacy.contactPhone')}:</strong> +84 28 3861 4228</p>
    </div>
  `;
}


// ── Terms of Use Content ──
function buildTermsContent() {
  return `
    <h2 class="legal-content__title">${t('legal.termsOfUse')}</h2>

    <div class="legal-content__meta">
      <p class="legal-content__brand">PHAT DAT JEWELRY</p>
      <p>${t('legal.termsOfUse')}</p>
      <p>${t('legal.lastUpdated')}: ${t('legal.termsDate')}</p>
    </div>

    <h3 class="legal-content__heading">${t('legal.terms.aboutTitle')}</h3>
    <p class="legal-content__text">${t('legal.terms.aboutText')}</p>

    <h3 class="legal-content__heading">${t('legal.terms.useTitle')}</h3>
    <p class="legal-content__text">${t('legal.terms.useText')}</p>

    <h3 class="legal-content__heading">${t('legal.terms.ipTitle')}</h3>
    <p class="legal-content__text">${t('legal.terms.ipText')}</p>

    <h3 class="legal-content__heading">${t('legal.terms.submissionsTitle')}</h3>
    <p class="legal-content__text">${t('legal.terms.submissionsText')}</p>

    <h3 class="legal-content__heading">${t('legal.terms.liabilityTitle')}</h3>
    <p class="legal-content__text">${t('legal.terms.liabilityText')}</p>

    <h3 class="legal-content__heading">${t('legal.terms.trademarksTitle')}</h3>
    <p class="legal-content__text">${t('legal.terms.trademarksText')}</p>

    <h3 class="legal-content__heading">${t('legal.terms.linksTitle')}</h3>
    <p class="legal-content__text">${t('legal.terms.linksText')}</p>

    <h3 class="legal-content__heading">${t('legal.terms.prohibitedTitle')}</h3>
    <p class="legal-content__text">${t('legal.terms.prohibitedText')}</p>
    <ul class="legal-content__list">
      <li>${t('legal.terms.prohibited1')}</li>
      <li>${t('legal.terms.prohibited2')}</li>
      <li>${t('legal.terms.prohibited3')}</li>
      <li>${t('legal.terms.prohibited4')}</li>
      <li>${t('legal.terms.prohibited5')}</li>
    </ul>

    <h3 class="legal-content__heading">${t('legal.terms.governingTitle')}</h3>
    <p class="legal-content__text">${t('legal.terms.governingText')}</p>

    <h3 class="legal-content__heading">${t('legal.terms.contactTitle')}</h3>
    <p class="legal-content__text">${t('legal.terms.contactText')}</p>
    <div class="legal-content__contact-info">
      <p><strong>Email:</strong> contact@phatdatjewelry.com</p>
      <p><strong>${t('legal.privacy.contactPhone')}:</strong> +84 28 3861 4228</p>
    </div>
  `;
}
