// ============================================================
// COLLECTION DATA — Bộ sưu tập Phát Đạt Jewelry
// ============================================================

import { slugify } from './products.js';

const G = (n) => `./images/gallery/g${n}.jpg`;

export const defaultHjCollections = [
  { name: 'Cỏ Ba Lá', description: 'Biểu tượng của may mắn và hạnh phúc, họa tiết cỏ ba lá xà cừ thanh lịch cho mọi dịp.', image: G(16), color: '#1B2A4A' },
  { name: 'Hoa Xinh', description: 'Những bông hoa nhỏ nhắn đính đá CZ, nhẹ nhàng và nữ tính như chính bạn.', image: G(11), color: '#A8B09A' },
  { name: 'Hạt Ngọc', description: 'Những hạt tròn bóng gương xếp liền mạch, tối giản mà sang trọng.', image: G(22), color: '#7EAED4' },
  { name: 'Ngọt Ngào', description: 'Trái tim và họa tiết nhỏ xinh — món quà ngọt ngào dành tặng người thương.', image: G(19), color: '#C4A77D' },
  { name: 'Cánh Bướm', description: 'Đôi bướm tung bay với ngọc lam và đá CZ, biểu tượng của tự do.', image: G(18), color: '#D8C4D8' },
  { name: 'Ánh Sao', description: 'Moissanite và đá CZ rực rỡ như ánh sao, toả sáng trong mọi khoảnh khắc.', image: G(1), color: '#2D5A3D' },
].map(c => ({ ...c, id: slugify(c.name) }));

export function getLiveHjCollections() {
  try {
    const local = typeof localStorage !== 'undefined' ? localStorage.getItem('phatdat_admin_collections') : null;
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(c => ({
          ...c,
          id: c.id || slugify(c.name)
        }));
      }
    }
  } catch (e) {}
  return defaultHjCollections;
}

// Reactive collections proxy
export const hjCollections = new Proxy(defaultHjCollections, {
  get(target, prop, receiver) {
    const live = getLiveHjCollections();
    if (prop === 'length') return live.length;
    if (typeof prop === 'string' && /^\d+$/.test(prop)) {
      return live[Number(prop)];
    }
    if (prop in live && typeof live[prop] === 'function') {
      return live[prop].bind(live);
    }
    if (prop === Symbol.iterator) {
      return live[Symbol.iterator].bind(live);
    }
    return Reflect.get(live, prop, receiver);
  }
});

export function getCollectionBySlug(slug) {
  const live = getLiveHjCollections();
  return live.find(c => c.id === slug || slugify(c.name) === slug);
}

// Feature sections for the High Jewelry page
export const hjFeatures = [
  { id: 'savoir-faire', image: G(3), ctaLink: '#/about' },
  { id: 'stones', image: G(7), ctaLink: '#/collections/anh-sao' },
];
