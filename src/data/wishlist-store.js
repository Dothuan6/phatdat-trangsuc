// ============================================================
// WISHLIST, RECENTLY VIEWED, COMPARE & ANALYTICS STORE
// ============================================================

const STORAGE_KEY = 'phatdat_wishlist';
const RECENT_KEY = 'phatdat_recently_viewed';
const COMPARE_KEY = 'phatdat_compare_list';
const ANALYTICS_KEY = 'phatdat_product_analytics';
const SEARCH_HISTORY_KEY = 'phatdat_recent_searches';
const CRM_NOTES_KEY = 'phatdat_contact_crm_notes';

// ── 1. WISHLIST ──
function getWishlist() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: list.length, list } }));
}

export function isWishlisted(productId) {
  return getWishlist().includes(productId);
}

export function toggleWishlist(productId) {
  let list = getWishlist();
  const exists = list.includes(productId);
  if (exists) {
    list = list.filter(id => id !== productId);
  } else {
    list.push(productId);
    trackProductEvent(productId, 'wishlist');
  }
  saveWishlist(list);
  return !exists;
}

export function getWishlistedProductIds() {
  return getWishlist();
}

export function mergeSharedWishlist(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return getWishlist();
  const current = getWishlist();
  const merged = Array.from(new Set([...current, ...ids]));
  saveWishlist(merged);
  return merged;
}

// ── 2. RECENTLY VIEWED PRODUCTS ──
export function addRecentlyViewed(productId) {
  if (!productId) return;
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    let list = raw ? JSON.parse(raw) : [];
    list = list.filter(id => id !== productId);
    list.unshift(productId);
    if (list.length > 8) list = list.slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch (e) {}
}

export function getRecentlyViewedProductIds(excludeId = null) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return excludeId ? list.filter(id => id !== excludeId) : list;
  } catch (e) {
    return [];
  }
}

// ── 3. PRODUCT QUICK COMPARE (MAX 3) ──
export function getCompareProductIds() {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isCompared(productId) {
  return getCompareProductIds().includes(productId);
}

export function toggleCompareProduct(productId) {
  let list = getCompareProductIds();
  if (list.includes(productId)) {
    list = list.filter(id => id !== productId);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('compare-updated', { detail: { list } }));
    return { added: false, limitReached: false, list };
  }
  if (list.length >= 3) {
    return { added: false, limitReached: true, list };
  }
  list.push(productId);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('compare-updated', { detail: { list } }));
  return { added: true, limitReached: false, list };
}

export function clearCompareList() {
  localStorage.removeItem(COMPARE_KEY);
  window.dispatchEvent(new CustomEvent('compare-updated', { detail: { list: [] } }));
}

// ── 4. PRODUCT VIEW & CONSULTATION ANALYTICS ──
const DEFAULT_SEED_STATS = {
  'pd-01': { views: 142, zalo: 28, callback: 9, wishlist: 34 },
  'pd-02': { views: 118, zalo: 22, callback: 7, wishlist: 29 },
  'pd-05': { views: 96, zalo: 19, callback: 6, wishlist: 21 },
  'pd-09': { views: 134, zalo: 31, callback: 11, wishlist: 38 },
  'pd-14': { views: 88, zalo: 15, callback: 5, wishlist: 18 },
  'pd-17': { views: 79, zalo: 14, callback: 4, wishlist: 16 }
};

export function getProductAnalytics() {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    return { ...DEFAULT_SEED_STATS, ...saved };
  } catch (e) {
    return { ...DEFAULT_SEED_STATS };
  }
}

export function trackProductEvent(productId, type = 'view') {
  if (!productId) return;
  try {
    const stats = getProductAnalytics();
    if (!stats[productId]) {
      stats[productId] = { views: 12, zalo: 2, callback: 1, wishlist: 3 };
    }
    if (type === 'view') stats[productId].views = (stats[productId].views || 0) + 1;
    if (type === 'zalo') stats[productId].zalo = (stats[productId].zalo || 0) + 1;
    if (type === 'callback') stats[productId].callback = (stats[productId].callback || 0) + 1;
    if (type === 'wishlist') stats[productId].wishlist = (stats[productId].wishlist || 0) + 1;
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(stats));
  } catch (e) {}
}

// ── 5. RECENT SEARCHES ──
export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : ['Cỏ ba lá', 'Nhẫn Moissanite', 'Dây chuyền bạc 925'];
  } catch (e) {
    return ['Cỏ ba lá', 'Nhẫn Moissanite'];
  }
}

export function addRecentSearch(term) {
  const clean = (term || '').trim();
  if (!clean || clean.length < 2) return;
  try {
    let list = getRecentSearches().filter(item => item.toLowerCase() !== clean.toLowerCase());
    list.unshift(clean);
    if (list.length > 6) list = list.slice(0, 6);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(list));
  } catch (e) {}
}

// ── 6. ADMIN CRM NOTES FOR CONTACTS ──
export function getContactCrmNotes() {
  try {
    const raw = localStorage.getItem(CRM_NOTES_KEY);
    return raw ? JSON.parse(raw) : {
      'REQ-101': 'Khách hẹn chiều T7 ghé xem mẫu nhẫn cỏ 3 lá size 7.',
      'REQ-102': 'Đã gói hộp nhung + viết thiệp chúc mừng sinh nhật.'
    };
  } catch (e) {
    return {};
  }
}

export function saveContactCrmNote(contactId, note) {
  try {
    const notes = getContactCrmNotes();
    notes[contactId] = (note || '').trim();
    localStorage.setItem(CRM_NOTES_KEY, JSON.stringify(notes));
    return true;
  } catch (e) {
    return false;
  }
}

// ── 7. CUSTOMER INTERACTIVE PRODUCT REVIEWS ──
const REVIEWS_KEY = 'phatdat_custom_reviews';

export function getCustomProductReviews(productId) {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return Array.isArray(all[productId]) ? all[productId] : [];
  } catch (e) {
    return [];
  }
}

export function addCustomProductReview(productId, reviewObj) {
  if (!productId || !reviewObj) return [];
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const list = Array.isArray(all[productId]) ? all[productId] : [];
    const newEntry = {
      id: 'rev-' + Date.now(),
      author: (reviewObj.author || 'Khách hàng').trim(),
      city: (reviewObj.city || 'TP.HCM').trim(),
      rating: Number(reviewObj.rating) || 5,
      variant: (reviewObj.variant || 'Bạc sáng 925').trim(),
      comment: (reviewObj.comment || '').trim(),
      date: new Date().toLocaleDateString('vi-VN')
    };
    list.unshift(newEntry);
    all[productId] = list;
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
    return list;
  } catch (e) {
    return [];
  }
}

// ── 8. MY JEWELRY BOX & SILVER CARE TRACKER (TỦ TRANG SỨC CÁ NHÂN) ──
const OWNED_BOX_KEY = 'phatdat_owned_jewelry';

export function getOwnedJewelryList() {
  try {
    const raw = localStorage.getItem(OWNED_BOX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isOwnedJewelry(productId) {
  return getOwnedJewelryList().some(item => item.productId === productId);
}

export function toggleOwnedJewelry(productId, customNote = '') {
  let list = getOwnedJewelryList();
  const exists = list.some(item => item.productId === productId);
  if (exists) {
    list = list.filter(item => item.productId !== productId);
  } else {
    const now = new Date();
    const nextPolish = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days recommended polish cycle
    list.unshift({
      productId,
      addedDate: now.toLocaleDateString('vi-VN'),
      lastPolishedDate: now.toLocaleDateString('vi-VN'),
      nextPolishDate: nextPolish.toLocaleDateString('vi-VN'),
      note: customNote || 'Bảo hành đánh bóng miễn phí trọn đời tại Phát Đạt Jewelry'
    });
  }
  localStorage.setItem(OWNED_BOX_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('owned-box-updated', { detail: { list } }));
  return !exists;
}

export function markJewelryPolishedToday(productId) {
  const list = getOwnedJewelryList();
  const now = new Date();
  const nextPolish = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const updated = list.map(item => {
    if (item.productId === productId) {
      return {
        ...item,
        lastPolishedDate: now.toLocaleDateString('vi-VN'),
        nextPolishDate: nextPolish.toLocaleDateString('vi-VN')
      };
    }
    return item;
  });
  localStorage.setItem(OWNED_BOX_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('owned-box-updated', { detail: { list: updated } }));
  return updated;
}

// ── 9. ANNIVERSARY & GIFT REMINDER PLANNER (LỊCH NHẮC KỶ NIỆM & QUÀ TẶNG) ──
const REMINDERS_KEY = 'phatdat_anniversary_reminders';

const DEFAULT_REMINDERS = [
  {
    id: 'rem-default-1',
    title: 'Ngày Phụ Nữ Việt Nam 20/10',
    recipient: 'Mẹ & Người thương',
    dateStr: `${new Date().getFullYear()}-10-20`,
    categoryHint: 'necklaces',
    note: 'Gợi ý: Dây chuyền Cỏ Ba Lá hoặc Nhẫn Moissanite kèm hộp nhung xanh'
  }
];

export function getAnniversaryReminders() {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_REMINDERS;
  } catch (e) {
    return DEFAULT_REMINDERS;
  }
}

export function addAnniversaryReminder(reminder) {
  const list = getAnniversaryReminders();
  const entry = {
    id: 'rem-' + Date.now(),
    title: (reminder.title || 'Kỷ niệm đặc biệt').trim(),
    recipient: (reminder.recipient || 'Người thương').trim(),
    dateStr: reminder.dateStr || new Date().toISOString().slice(0, 10),
    categoryHint: reminder.categoryHint || 'necklaces',
    note: (reminder.note || 'Tặng kèm hộp quà nhung & thiệp viết tay').trim()
  };
  list.unshift(entry);
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(list));
  return list;
}

export function deleteAnniversaryReminder(id) {
  const list = getAnniversaryReminders().filter(r => r.id !== id);
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(list));
  return list;
}

// ── 10. COMFORT READING & ACCESSIBILITY PREFERENCES ──
const COMFORT_KEY = 'phatdat_comfort_prefs';

export function getComfortPrefs() {
  try {
    const raw = localStorage.getItem(COMFORT_KEY);
    return raw ? JSON.parse(raw) : { largeText: false, warmTone: false };
  } catch (e) {
    return { largeText: false, warmTone: false };
  }
}

export function applyComfortPrefs(prefs = getComfortPrefs()) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('pd-comfort-large-text', !!prefs.largeText);
  document.body.classList.toggle('pd-comfort-warm-tone', !!prefs.warmTone);
}

export function saveComfortPrefs(prefs) {
  const merged = { ...getComfortPrefs(), ...prefs };
  localStorage.setItem(COMFORT_KEY, JSON.stringify(merged));
  applyComfortPrefs(merged);
  return merged;
}

// ── 11. MULTI-CURRENCY CONVERTER PREVIEW (ROUND 28) ──
const CURRENCY_KEY = 'phatdat_user_currency';

export const CURRENCY_RATES = {
  VND: { code: 'VND', symbol: '₫', rate: 1, name: 'Việt Nam Đồng', flag: '🇻🇳', isBase: true },
  USD: { code: 'USD', symbol: '$', rate: 25400, name: 'Đô la Mỹ (USD)', flag: '🇺🇸', isBase: false },
  EUR: { code: 'EUR', symbol: '€', rate: 27500, name: 'Euro (EUR)', flag: '🇪🇺', isBase: false },
  AUD: { code: 'AUD', symbol: 'A$', rate: 16500, name: 'Đô la Úc (AUD)', flag: '🇦🇺', isBase: false },
  JPY: { code: 'JPY', symbol: '¥', rate: 165, name: 'Yên Nhật (JPY)', flag: '🇯🇵', isBase: false },
  CAD: { code: 'CAD', symbol: 'C$', rate: 18400, name: 'Đô la Canada (CAD)', flag: '🇨🇦', isBase: false }
};

export function getSelectedCurrency() {
  try {
    const code = localStorage.getItem(CURRENCY_KEY) || 'VND';
    return CURRENCY_RATES[code] ? code : 'VND';
  } catch (e) {
    return 'VND';
  }
}

export function setSelectedCurrency(currencyCode) {
  if (CURRENCY_RATES[currencyCode]) {
    localStorage.setItem(CURRENCY_KEY, currencyCode);
    window.dispatchEvent(new CustomEvent('currency-changed', { detail: { currency: currencyCode } }));
    return currencyCode;
  }
  return 'VND';
}

export function formatConvertedPrice(priceVnd) {
  const code = getSelectedCurrency();
  const info = CURRENCY_RATES[code] || CURRENCY_RATES.VND;
  if (!priceVnd || priceVnd <= 0) return 'Liên hệ';
  if (info.isBase) {
    return new Intl.NumberFormat('vi-VN').format(priceVnd) + ' ₫';
  }
  const converted = priceVnd / info.rate;
  let formatted = '';
  if (code === 'JPY') {
    formatted = Math.round(converted).toLocaleString('ja-JP');
  } else {
    formatted = converted.toFixed(2);
  }
  return `${info.symbol}${formatted} ${code}`;
}

// ── 12. STYLE QUIZ & PERSONA STORE (ROUND 24) ──
const STYLE_QUIZ_KEY = 'phatdat_style_quiz_result';

export function getStyleQuizResult() {
  try {
    const raw = localStorage.getItem(STYLE_QUIZ_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveStyleQuizResult(result) {
  localStorage.setItem(STYLE_QUIZ_KEY, JSON.stringify(result));
  window.dispatchEvent(new CustomEvent('style-quiz-saved', { detail: result }));
  return result;
}

// ── 13. USER JEWELRY SIZES STORE (WRIST & CHAIN - ROUNDS 21, 22) ──
const SIZES_KEY = 'phatdat_user_sizes';

export function getUserJewelrySizes() {
  try {
    const raw = localStorage.getItem(SIZES_KEY);
    return raw ? JSON.parse(raw) : { ringSize: null, wristCm: null, chainCm: null };
  } catch (e) {
    return { ringSize: null, wristCm: null, chainCm: null };
  }
}

export function saveUserJewelrySizes(sizes) {
  const current = getUserJewelrySizes();
  const merged = { ...current, ...sizes };
  localStorage.setItem(SIZES_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent('user-sizes-updated', { detail: merged }));
  return merged;
}

// ── 14. LOVED ONES SIZE BOOK (SỔ ĐO SIZE NGƯỜI THÂN - ROUND 36) ──
const LOVED_ONES_KEY = 'phatdat_loved_ones_sizes';

const DEFAULT_LOVED_ONES = [
  {
    id: 'lo-1',
    name: 'Người yêu / Bạn gái',
    relation: 'Người thương',
    ringSize: 'Size 6 (16mm)',
    wristSize: '15.5 cm',
    chainLength: '42 cm (Princess)',
    note: 'Thích nhẫn đính đá Moissanite & xi Bạch Kim'
  },
  {
    id: 'lo-2',
    name: 'Mẹ yêu',
    relation: 'Mẹ',
    ringSize: 'Size 8 (18mm)',
    wristSize: '17.0 cm',
    chainLength: '45 - 50 cm',
    note: 'Hợp mặt đá Xà cừ phong thủy hoặc Cỏ 4 lá'
  }
];

export function getLovedOnesSizes() {
  try {
    const raw = localStorage.getItem(LOVED_ONES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_LOVED_ONES;
  } catch (e) {
    return DEFAULT_LOVED_ONES;
  }
}

export function saveLovedOneSize(entry) {
  const list = getLovedOnesSizes();
  const existingIdx = list.findIndex(item => item.id === entry.id);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...entry };
  } else {
    list.push({ ...entry, id: 'lo-' + Date.now() });
  }
  localStorage.setItem(LOVED_ONES_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('loved-ones-updated', { detail: { list } }));
  return list;
}

export function deleteLovedOneSize(id) {
  const list = getLovedOnesSizes().filter(item => item.id !== id);
  localStorage.setItem(LOVED_ONES_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('loved-ones-updated', { detail: { list } }));
  return list;
}




