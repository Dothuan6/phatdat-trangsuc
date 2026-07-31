// ============================================================
// WISHLIST STORE — LocalStorage-based state for liked items
// ============================================================

const STORAGE_KEY = 'phatdat_wishlist';

function getWishlist() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse wishlist from local storage', e);
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  // Dispatch a custom event so other components can update
  window.dispatchEvent(new Event('wishlist-updated'));
}

export function isWishlisted(productId) {
  const list = getWishlist();
  return list.includes(productId);
}

export function toggleWishlist(productId) {
  let list = getWishlist();
  if (list.includes(productId)) {
    list = list.filter(id => id !== productId);
  } else {
    list.push(productId);
  }
  saveWishlist(list);
  return list.includes(productId);
}

export function getWishlistedProductIds() {
  return getWishlist();
}
