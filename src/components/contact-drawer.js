// ============================================================
// CONTACT DRAWER COMPONENT — "Any Questions?" slide-out panel
// ============================================================

import { createAccordionGroup } from './accordion.js';
import { t } from '../i18n.js';

export function createContactDrawer() {
  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'contact-drawer-overlay';
  overlay.id = 'contact-drawer-overlay';

  // Drawer
  const drawer = document.createElement('div');
  drawer.className = 'contact-drawer';
  drawer.id = 'contact-drawer';

  drawer.innerHTML = `
    <div class="contact-drawer__header">
      <span class="contact-drawer__title">${t('contactDrawer.title')}</span>
      <button class="contact-drawer__close" aria-label="Close">✕</button>
    </div>
    <div class="contact-drawer__intro">
      <p>${t('contactDrawer.intro')}</p>
    </div>
    <div class="contact-drawer__body" id="contact-drawer-body"></div>
  `;

  // Accordion items
  const accordionItems = [
    {
      label: t('contactDrawer.callUs'),
      isOpen: true,
      content: `
        <p>${t('contactDrawer.callContent1')}</p>
        <p>${t('contactDrawer.callContent2')}</p>
        <p>${t('contactDrawer.callContent3')}</p>
        <p>${t('contactDrawer.callContent4')}</p>
        <div class="phone-row" style="margin-top: 16px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          <span>Phone Number: +84-2838614228</span>
        </div>
      `,
    },
    {
      label: t('contactDrawer.meetUs'),
      isOpen: false,
      content: `
        <p>${t('contactDrawer.meetContent')}</p>
        <a href="#" class="link-underline" style="margin-top: 12px; display: inline-block; font-size: 12px;">${t('contactDrawer.findBoutique')}</a>
      `,
    },
    {
      label: t('contactDrawer.writeUs'),
      isOpen: false,
      content: `
        <p>${t('contactDrawer.writeContent')}</p>
        <a href="#/contact" class="link-underline" style="margin-top: 12px; display: inline-block; font-size: 12px;">${t('contactDrawer.emailUs')}</a>
      `,
    },
  ];

  const body = drawer.querySelector('#contact-drawer-body');
  body.appendChild(createAccordionGroup(accordionItems, true));

  // Close handlers
  function closeDrawer() {
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  function openDrawer() {
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function toggleDrawer() {
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  overlay.addEventListener('click', closeDrawer);
  drawer.querySelector('.contact-drawer__close').addEventListener('click', closeDrawer);

  // Listen for header's toggle event
  document.addEventListener('toggle-contact-drawer', toggleDrawer);

  // Close on navigation inside drawer
  drawer.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  return { overlay, drawer, open: openDrawer, close: closeDrawer };
}
