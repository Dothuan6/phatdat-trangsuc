// ============================================================
// CAROUSEL COMPONENT — Product slider
// ============================================================

export function createCarousel(items, options = {}) {
  const {
    slidesPerView = 3,
    slidesPerViewTablet = 2,
    slidesPerViewMobile = 1,
    showDots = true,
    showArrows = true,
    autoplay = false,
  } = options;

  const carousel = document.createElement('div');
  carousel.className = 'carousel';

  let currentIndex = 0;

  // Determine slides per view based on screen width
  function getSlidesPerView() {
    if (window.innerWidth <= 768) return slidesPerViewMobile;
    if (window.innerWidth <= 1024) return slidesPerViewTablet;
    return slidesPerView;
  }

  function getTotalPages() {
    return Math.ceil(items.length / getSlidesPerView());
  }

  function updatePosition() {
    const track = carousel.querySelector('.carousel__track');
    const slideWidth = 100 / getSlidesPerView();
    const offset = -(currentIndex * slideWidth);
    track.style.transform = `translateX(${offset}%)`;

    // Update dots
    if (showDots) {
      carousel.querySelectorAll('.carousel__dot').forEach((dot, idx) => {
        const page = Math.floor(currentIndex / getSlidesPerView());
        dot.classList.toggle('is-active', idx === page);
      });
    }

    // Update arrows visibility
    if (showArrows) {
      const prevBtn = carousel.querySelector('.carousel__nav--prev');
      const nextBtn = carousel.querySelector('.carousel__nav--next');
      if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
      if (nextBtn) {
        const maxIndex = items.length - getSlidesPerView();
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
      }
    }
  }

  function goNext() {
    const maxIndex = items.length - getSlidesPerView();
    if (currentIndex < maxIndex) {
      currentIndex += getSlidesPerView();
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      updatePosition();
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      currentIndex -= getSlidesPerView();
      if (currentIndex < 0) currentIndex = 0;
      updatePosition();
    }
  }

  // Build slides
  const trackHtml = items.map((item, idx) => `
    <div class="carousel__slide" data-index="${idx}">
      ${typeof item === 'string' ? item : ''}
    </div>
  `).join('');

  // Build dots
  const totalPages = getTotalPages();
  const dotsHtml = showDots ? `
    <div class="carousel__dots">
      ${Array.from({ length: totalPages }, (_, i) => `
        <button class="carousel__dot${i === 0 ? ' is-active' : ''}" data-page="${i}" aria-label="Page ${i + 1}"></button>
      `).join('')}
    </div>
  ` : '';

  // Build arrows
  const arrowsHtml = showArrows ? `
    <button class="carousel__nav carousel__nav--prev" aria-label="Previous" style="opacity: 0.3">‹</button>
    <button class="carousel__nav carousel__nav--next" aria-label="Next">›</button>
  ` : '';

  carousel.innerHTML = `
    <div class="carousel__track">${trackHtml}</div>
    ${arrowsHtml}
    ${dotsHtml}
  `;

  // Append DOM elements for items that are nodes
  if (items.length > 0 && typeof items[0] !== 'string') {
    const slides = carousel.querySelectorAll('.carousel__slide');
    items.forEach((item, idx) => {
      if (item instanceof HTMLElement) {
        slides[idx].innerHTML = '';
        slides[idx].appendChild(item);
      }
    });
  }

  // Event listeners
  if (showArrows) {
    carousel.querySelector('.carousel__nav--prev')?.addEventListener('click', goPrev);
    carousel.querySelector('.carousel__nav--next')?.addEventListener('click', goNext);
  }

  if (showDots) {
    carousel.querySelectorAll('.carousel__dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const page = parseInt(dot.dataset.page);
        currentIndex = page * getSlidesPerView();
        const maxIndex = items.length - getSlidesPerView();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updatePosition();
      });
    });
  }

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      currentIndex = 0;
      updatePosition();
      // Rebuild dots
      if (showDots) {
        const dotsContainer = carousel.querySelector('.carousel__dots');
        if (dotsContainer) {
          const newTotalPages = getTotalPages();
          dotsContainer.innerHTML = Array.from({ length: newTotalPages }, (_, i) => `
            <button class="carousel__dot${i === 0 ? ' is-active' : ''}" data-page="${i}" aria-label="Page ${i + 1}"></button>
          `).join('');

          dotsContainer.querySelectorAll('.carousel__dot').forEach(dot => {
            dot.addEventListener('click', () => {
              const page = parseInt(dot.dataset.page);
              currentIndex = page * getSlidesPerView();
              const maxIndex = items.length - getSlidesPerView();
              if (currentIndex > maxIndex) currentIndex = maxIndex;
              updatePosition();
            });
          });
        }
      }
    }, 200);
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }, { passive: true });

  return carousel;
}
