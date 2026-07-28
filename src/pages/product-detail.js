// ============================================================
// PRODUCT DETAIL PAGE (PDP)
// ============================================================

import { getProductById, getRelatedProducts, formatPrice } from '../data/products.js';
import { createAccordion } from '../components/accordion.js';
import { createProductCard } from '../components/product-card.js';
import { createCarousel } from '../components/carousel.js';

export function renderProductDetail(container, params = {}) {
  const productId = params.id;
  const product = getProductById(productId);

  if (!product) {
    container.innerHTML = `
      <div class="container section text-center">
        <h2 style="font-family: var(--font-display); margin-bottom: 24px;">Product not found</h2>
        <p>The product you are looking for does not exist.</p>
        <a href="#/jewelry" class="link-underline" style="margin-top: 24px; display: inline-block;">BACK TO JEWELRY</a>
      </div>
    `;
    return;
  }

  const page = document.createElement('div');
  page.className = 'page-pdp';

  // ── Main PDP Layout ──
  const pdpLayout = document.createElement('div');
  pdpLayout.className = 'layout-pdp';

  // ── Gallery (Left) ──
  const gallery = document.createElement('div');
  gallery.className = 'layout-pdp__gallery';

  const galleryInner = document.createElement('div');
  galleryInner.className = 'pdp-gallery';

  // Create gallery images (product images + fallback SVGs)
  const galleryImages = product.images.length > 0 ? product.images : [null];

  // Always show at least 2 images
  const imagesToShow = [...galleryImages];
  if (imagesToShow.length < 2) {
    imagesToShow.push(null); // will render a worn/lifestyle placeholder
  }

  imagesToShow.forEach((imgSrc, idx) => {
    const item = document.createElement('div');
    item.className = 'pdp-gallery__item';
    item.dataset.index = idx;

    if (idx === 0) {
      // Product on neutral background
      item.innerHTML = `
        <img src="${imgSrc || ''}" alt="${product.name} - View ${idx + 1}" loading="${idx === 0 ? 'eager' : 'lazy'}"
             onerror="this.onerror=null; this.parentElement.innerHTML = \`
              <div style='width:100%;aspect-ratio:4/5;background:#F5F5F0;display:flex;align-items:center;justify-content:center;'>
                <svg width='200' height='280' viewBox='0 0 200 280' fill='none'>
                  <path d='M100 30 C60 30, 30 60, 30 100 C30 150, 65 200, 100 260 C135 200, 170 150, 170 100 C170 60, 140 30, 100 30Z' stroke='#C5A467' stroke-width='1.5' fill='none'/>
                  <circle cx='100' cy='220' r='18' stroke='#C5A467' stroke-width='1.5' fill='none'/>
                  <path d='M88 220 L100 208 L112 220 L100 232Z' stroke='#C5A467' stroke-width='1' fill='none'/>
                  <circle cx='100' cy='220' r='4' fill='#C5A467' opacity='0.3'/>
                </svg>
              </div>
             \`;">
      `;
    } else {
      // Lifestyle / worn shot
      item.innerHTML = `
        <img src="${imgSrc || ''}" alt="${product.name} - Lifestyle" loading="lazy"
             onerror="this.onerror=null; this.parentElement.innerHTML = \`
              <div style='width:100%;aspect-ratio:4/5;background:linear-gradient(180deg,#F0EDE5 0%,#E8E4DC 100%);display:flex;align-items:center;justify-content:center;'>
                <div style='text-align:center;opacity:0.4;'>
                  <svg width='120' height='200' viewBox='0 0 120 200' fill='none'>
                    <ellipse cx='60' cy='40' rx='25' ry='30' stroke='#999' stroke-width='1'/>
                    <path d='M35 70 L25 140 L60 200 L95 140 L85 70' stroke='#999' stroke-width='1' fill='none'/>
                    <path d='M45 90 C50 100, 55 110, 60 140 C65 110, 70 100, 75 90' stroke='#C5A467' stroke-width='1' fill='none'/>
                    <circle cx='60' cy='140' r='10' stroke='#C5A467' stroke-width='1' fill='none'/>
                  </svg>
                </div>
              </div>
             \`;">
      `;
    }
    galleryInner.appendChild(item);
  });

  // Gallery thumbnail dots
  const thumbDots = document.createElement('div');
  thumbDots.className = 'pdp-gallery__thumbs';
  imagesToShow.forEach((_, idx) => {
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

  // Product Name
  const nameEl = document.createElement('h1');
  nameEl.className = 'pdp-info__name';
  nameEl.textContent = product.name;
  info.appendChild(nameEl);

  // Materials
  const materialsEl = document.createElement('p');
  materialsEl.className = 'pdp-info__materials';
  materialsEl.textContent = product.materials;
  info.appendChild(materialsEl);

  // Reference + Wishlist
  const refRow = document.createElement('div');
  refRow.className = 'pdp-info__ref';
  refRow.innerHTML = `
    <span class="pdp-info__ref-text">${product.reference} - <a href="#">Product details</a></span>
    <button class="wishlist-btn" aria-label="Add to wishlist" id="wishlist-btn-${product.id}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    </button>
  `;
  info.appendChild(refRow);

  // Price
  const priceEl = document.createElement('div');
  priceEl.className = 'pdp-info__price';
  priceEl.textContent = `${formatPrice(product.price, product.currency)} Including taxes`;
  info.appendChild(priceEl);

  // Variant Selector (if applicable)
  if (product.variants.length > 0 || product.variationCount > 0) {
    const variants = document.createElement('div');
    variants.className = 'pdp-variants';
    variants.innerHTML = `
      <div class="pdp-variants__header">
        <span class="pdp-variants__label">
          DISCOVER MORE STONES
          <span class="pdp-variants__dot"></span>
        </span>
        <span class="pdp-variants__chevron">›</span>
      </div>
    `;

    if (product.variants.length > 0) {
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'pdp-variants__options';

      product.variants.forEach((variant, idx) => {
        const thumb = document.createElement('div');
        thumb.className = `pdp-variant-thumb${idx === 0 ? ' is-active' : ''}`;
        thumb.innerHTML = `
          <div class="pdp-variant-thumb__img">
            <img src="${variant.image || ''}" alt="${variant.label}"
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23F5F5F0%22 width=%22100%22 height=%22100%22/%3E%3Cpath d=%22M50 20 L40 40 L20 40 L35 55 L30 75 L50 63 L70 75 L65 55 L80 40 L60 40Z%22 fill=%22none%22 stroke=%22%23ccc%22 stroke-width=%221%22/%3E%3C/svg%3E';">
          </div>
          <span class="pdp-variant-thumb__label">${variant.label}</span>
        `;
        thumb.addEventListener('click', () => {
          optionsContainer.querySelectorAll('.pdp-variant-thumb').forEach(t => t.classList.remove('is-active'));
          thumb.classList.add('is-active');
        });
        optionsContainer.appendChild(thumb);
      });

      variants.appendChild(optionsContainer);
    }

    info.appendChild(variants);
  }

  // Size Guide link
  const sizeGuide = document.createElement('div');
  sizeGuide.className = 'pdp-size-guide';
  sizeGuide.innerHTML = `<a href="#">Which size to choose?</a>`;
  info.appendChild(sizeGuide);

  // Order button
  const orderBtn = document.createElement('button');
  orderBtn.className = 'btn btn--full';
  orderBtn.textContent = 'ORDER BY PHONE';
  orderBtn.id = 'order-btn';
  orderBtn.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('toggle-contact-drawer'));
  });
  info.appendChild(orderBtn);

  // Specifications Accordion
  if (product.specifications && Object.keys(product.specifications).length > 0) {
    const specsSection = document.createElement('div');
    specsSection.className = 'pdp-specs';
    specsSection.style.marginTop = '32px';

    const specsContent = Object.entries(product.specifications).map(([key, value]) => `
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--color-border-light);">
        <span style="color: var(--color-text-secondary); font-size: 14px;">${key}</span>
        <span style="font-size: 14px;">${value}</span>
      </div>
    `).join('');

    specsSection.appendChild(createAccordion('THE CREATION', `
      <p style="margin-bottom: 16px;">${product.description}</p>
      ${specsContent}
    `));

    specsSection.appendChild(createAccordion('DELIVERY & RETURNS', `
      <p>Phat Dat Jewelry offers complimentary delivery on all orders.</p>
      <p>Items may be returned within 30 days of delivery. Please contact our Client Advisors for more information.</p>
    `));

    specsSection.appendChild(createAccordion('GIFTING', `
      <p>Each Phat Dat Jewelry creation is presented in the Maison's iconic packaging, making it the perfect gift for any occasion.</p>
    `));

    info.appendChild(specsSection);
  }

  infoPanel.appendChild(info);
  pdpLayout.appendChild(infoPanel);
  page.appendChild(pdpLayout);

  // ── Related Products Carousel ──
  const related = getRelatedProducts(productId, 6);
  if (related.length > 0) {
    const relatedSection = document.createElement('section');
    relatedSection.className = 'pdp-related container';

    const relatedHeader = document.createElement('div');
    relatedHeader.className = 'pdp-related__header';
    relatedHeader.innerHTML = `
      <h2 class="pdp-related__title">${product.collection} collection</h2>
    `;
    relatedSection.appendChild(relatedHeader);

    // Create carousel with product cards
    const carouselItems = related.map(p => createProductCard(p));
    const carousel = createCarousel(carouselItems, {
      slidesPerView: 3,
      slidesPerViewTablet: 2,
      slidesPerViewMobile: 1,
      showDots: true,
      showArrows: true,
    });
    relatedSection.appendChild(carousel);

    // CTA
    const relatedCta = document.createElement('div');
    relatedCta.className = 'pdp-related__cta';
    relatedCta.innerHTML = `<a href="#/jewelry" class="link-underline">SEE ALL ${product.collection.toUpperCase()} COLLECTION</a>`;
    relatedSection.appendChild(relatedCta);

    page.appendChild(relatedSection);
  }

  container.appendChild(page);

  // Wishlist toggle
  const wishlistBtn = page.querySelector(`#wishlist-btn-${product.id}`);
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      const svg = wishlistBtn.querySelector('svg');
      const isFilled = svg.getAttribute('fill') !== 'none';
      svg.setAttribute('fill', isFilled ? 'none' : 'currentColor');
      wishlistBtn.style.color = isFilled ? '' : '#D4380D';
    });
  }

  // Scroll-driven thumbnail dot updates
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = entry.target.dataset.index;
        thumbDots.querySelectorAll('.pdp-gallery__thumb').forEach(d => d.classList.remove('is-active'));
        const activeDot = thumbDots.querySelector(`[data-index="${idx}"]`);
        if (activeDot) activeDot.classList.add('is-active');
      }
    });
  }, { threshold: 0.5 });

  galleryInner.querySelectorAll('.pdp-gallery__item').forEach(item => {
    observer.observe(item);
  });

  return () => {
    observer.disconnect();
  };
}
