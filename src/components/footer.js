// ============================================================
// FOOTER COMPONENT — Site footer
// ============================================================

export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.id = 'site-footer';

  footer.innerHTML = `
    <div class="container">
      <div class="footer-tagline">
        <p>Thanks to the savoir-faire, creativity and excellence, Van Cleef & Arpels accompanies the happiest moments of life</p>
        <a href="#/high-jewelry" class="link-underline">ENTER THE TIMELESS UNIVERSE</a>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-creations">
        <h2>Our creations</h2>
        <p>Discover a variety of our pieces.</p>
      </div>

      <div class="footer-categories">
        <a href="#/jewelry/necklaces" class="footer-category-card" id="footer-cat-necklaces">
          <div class="footer-category-card__bg" style="background: linear-gradient(135deg, #F5F0EB, #EDE5DA); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
              <path d="M40 10 C20 10, 10 25, 10 40 C10 60, 25 80, 40 110 C55 80, 70 60, 70 40 C70 25, 60 10, 40 10Z" stroke="#C5A467" stroke-width="1" fill="none"/>
              <circle cx="40" cy="95" r="6" stroke="#C5A467" stroke-width="1" fill="none"/>
            </svg>
          </div>
          <span class="footer-category-card__label">Necklaces</span>
        </a>
        <a href="#/jewelry/rings" class="footer-category-card" id="footer-cat-rings">
          <div class="footer-category-card__bg" style="background: linear-gradient(135deg, #F0EDE5, #E5DDD4); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <ellipse cx="40" cy="40" rx="28" ry="32" stroke="#C5A467" stroke-width="1" fill="none"/>
              <circle cx="40" cy="12" r="8" stroke="#C5A467" stroke-width="1" fill="none"/>
            </svg>
          </div>
          <span class="footer-category-card__label">Rings</span>
        </a>
        <a href="#/jewelry/bracelets" class="footer-category-card" id="footer-cat-bracelets">
          <div class="footer-category-card__bg" style="background: linear-gradient(135deg, #EDE8F0, #DDD8E5); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
              <ellipse cx="50" cy="40" rx="40" ry="30" stroke="#C5A467" stroke-width="1" fill="none"/>
              <circle cx="20" cy="25" r="5" stroke="#C5A467" stroke-width="1" fill="none"/>
              <circle cx="50" cy="15" r="5" stroke="#C5A467" stroke-width="1" fill="none"/>
              <circle cx="80" cy="25" r="5" stroke="#C5A467" stroke-width="1" fill="none"/>
            </svg>
          </div>
          <span class="footer-category-card__label">Bracelets</span>
        </a>
      </div>

      <div class="footer-bottom">
        <div class="footer-legal">
          <a href="#">Legal notices</a>
          <a href="#">Privacy policy</a>
          <a href="#">Cookies</a>
          <a href="#">Accessibility</a>
          <a href="#">Sitemap</a>
        </div>
        <div class="footer-social">
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/>
              <polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/>
            </svg>
          </a>
          <a href="#" aria-label="Pinterest">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.19-5.03 1.19-5.03s-.3-.61-.3-1.51c0-1.41.82-2.47 1.84-2.47.87 0 1.29.65 1.29 1.43 0 .87-.55 2.18-.84 3.39-.24 1.01.51 1.83 1.5 1.83 1.8 0 3.19-1.9 3.19-4.64 0-2.43-1.74-4.12-4.23-4.12-2.88 0-4.57 2.16-4.57 4.39 0 .87.33 1.8.75 2.31.08.1.09.19.07.29l-.28 1.15c-.04.18-.14.22-.33.13-1.23-.57-2-2.37-2-3.81 0-3.1 2.25-5.94 6.49-5.94 3.41 0 6.06 2.43 6.06 5.68 0 3.39-2.14 6.11-5.1 6.11-1 0-1.93-.52-2.25-1.13l-.61 2.34c-.22.86-.82 1.93-1.22 2.59.92.28 1.9.44 2.91.44 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
          </a>
        </div>
      </div>

      <p class="footer-copyright">© Van Cleef & Arpels ${new Date().getFullYear()}</p>
    </div>
  `;

  return footer;
}
