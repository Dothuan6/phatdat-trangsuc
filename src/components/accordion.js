// ============================================================
// ACCORDION COMPONENT
// ============================================================

export function createAccordion(label, content, isOpen = false) {
  const accordion = document.createElement('div');
  accordion.className = `accordion${isOpen ? ' is-open' : ''}`;

  accordion.innerHTML = `
    <button class="accordion__trigger" aria-expanded="${isOpen}">
      <span>${label}</span>
      <span class="accordion__icon">+</span>
    </button>
    <div class="accordion__content">
      <div class="accordion__body">
        ${content}
      </div>
    </div>
  `;

  const trigger = accordion.querySelector('.accordion__trigger');

  trigger.addEventListener('click', () => {
    const isExpanded = accordion.classList.contains('is-open');

    if (isExpanded) {
      accordion.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    } else {
      accordion.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  return accordion;
}

// Create a group of accordions (only one open at a time)
export function createAccordionGroup(items, singleOpen = false) {
  const group = document.createElement('div');
  group.className = 'accordion-group';

  const accordions = items.map(item =>
    createAccordion(item.label, item.content, item.isOpen || false)
  );

  if (singleOpen) {
    accordions.forEach((accordion, idx) => {
      const trigger = accordion.querySelector('.accordion__trigger');
      const originalHandler = trigger.onclick;

      trigger.addEventListener('click', () => {
        const isOpening = !accordion.classList.contains('is-open');
        if (isOpening) {
          // Close others
          accordions.forEach((other, otherIdx) => {
            if (otherIdx !== idx && other.classList.contains('is-open')) {
              other.classList.remove('is-open');
              other.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    });
  }

  accordions.forEach(a => group.appendChild(a));
  return group;
}
