// ============================================================
// SUPABASE CLIENT SERVICE & REPOSITORY — Phát Đạt Jewelry
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { defaultProducts } from '../data/products.js';
import { hjCollections as defaultHjCollections } from '../data/collections.js';
import { siteInfo as defaultSiteInfo } from '../data/site-info.js';

export const SUPABASE_PROJECT_ID = 'mvmxlcruorsjejnjugrf';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

// Designated Supabase public anon key for project mvmxlcruorsjejnjugrf
export const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bXhsY3J1b3JzamVqbmp1Z3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMjk1MzIsImV4cCI6MjEwNzYwNTUzMn0.gY_yqu3q95Gn6jwxAkANdxTyGojnLSyZFwnZ1EFN_os';

const STORAGE_KEY_ANON = 'phatdat_supabase_anon_key';
const STORAGE_KEY_PRODUCTS = 'phatdat_admin_products';
const STORAGE_KEY_COLLECTIONS = 'phatdat_admin_collections';
const STORAGE_KEY_CONTACTS = 'phatdat_admin_contacts';
const STORAGE_KEY_SETTINGS = 'phatdat_admin_settings';

// Get current anon key (from localStorage, Vite environment, or default)
export function getSupabaseAnonKey() {
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) : null;
  if (localKey && localKey.trim()) return localKey.trim();

  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY);
  if (envKey && envKey.trim()) return envKey.trim();

  return DEFAULT_ANON_KEY;
}

export function setSupabaseAnonKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEY_ANON, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_ANON);
  }
  resetSupabaseClient();
}

// Singleton Supabase client
let supabaseInstance = null;
export function getSupabaseClient() {
  const key = getSupabaseAnonKey();
  if (!key) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(SUPABASE_URL, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

// Reset instance when key changes
export function resetSupabaseClient() {
  supabaseInstance = null;
  return getSupabaseClient();
}

// Test connection
export async function testSupabaseConnection(key = null) {
  const checkKey = (key || getSupabaseAnonKey() || '').trim();
  if (!checkKey) return { success: false, message: 'Chưa nhập Supabase Anon Key' };
  try {
    const client = createClient(SUPABASE_URL, checkKey);
    const { count, error } = await client.from('products').select('*', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01') {
        return { success: true, needSchema: true, message: 'Đã kết nối Supabase thành công! Cần khởi tạo cấu trúc bảng (chạy script SQL).' };
      }
      return { success: false, message: error.message };
    }
    return {
      success: true,
      message: `Kết nối Supabase thành công! Hiện có ${count ?? 0} sản phẩm trong CSDL.`
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// ══════════════════════════════════════════════════════════════
// DATA NORMALIZERS (Bridge DB snake_case & Frontend camelCase)
// ══════════════════════════════════════════════════════════════

export function normalizeProductFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || 'Sản phẩm',
    reference: row.reference || ('PD' + String(row.id).slice(-6)),
    collection: row.collection || 'Bộ Sưu Tập',
    category: row.category || 'necklaces',
    materials: row.materials || 'Bạc 925',
    stones: row.stones || '',
    price: Number(row.price) || 0,
    currency: row.currency || '₫',
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : ['./images/products/Daychuyen4.3-removebg-preview.png'],
    availableSizes: row.available_sizes || row.availableSizes || ['Freesize'],
    availableColors: row.available_colors || row.availableColors || ['Bạc sáng 925'],
    rating: Number(row.rating) || 4.9,
    reviewsCount: Number(row.reviews_count ?? row.reviewsCount ?? 20),
    description: row.description || '',
    specifications: row.specifications || {},
    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
    isActive: row.is_active !== undefined ? Boolean(row.is_active) : true,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export function normalizeProductForDb(prod) {
  return {
    id: prod.id,
    name: prod.name,
    reference: prod.reference || ('PD' + Date.now().toString().slice(-6)),
    collection: prod.collection || 'Bộ Sưu Tập',
    category: prod.category || 'necklaces',
    materials: prod.materials || 'Bạc 925',
    stones: prod.stones || '',
    price: Number(prod.price) || 0,
    currency: prod.currency || '₫',
    images: Array.isArray(prod.images) ? prod.images : [prod.images || './images/products/Daychuyen4.3-removebg-preview.png'],
    available_sizes: prod.availableSizes || prod.available_sizes || ['Freesize'],
    available_colors: prod.availableColors || prod.available_colors || ['Bạc sáng 925'],
    rating: Number(prod.rating) || 4.9,
    reviews_count: Number(prod.reviewsCount ?? prod.reviews_count ?? 20),
    description: prod.description || '',
    specifications: prod.specifications || {},
    is_active: prod.is_active !== undefined ? Boolean(prod.is_active) : (prod.isActive !== undefined ? Boolean(prod.isActive) : true),
    updated_at: new Date().toISOString()
  };
}

function normalizeContactFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name || row.fullName || 'Khách hàng',
    phone: row.phone || '',
    email: row.email || '',
    subject: row.subject || 'Tư vấn sản phẩm',
    message: row.message || '',
    status: row.status || 'pending',
    created_at: row.created_at || new Date().toISOString()
  };
}

// ══════════════════════════════════════════════════════════════
// PRODUCTS CRUD OPERATIONS (Supabase + LocalStorage Fallback)
// ══════════════════════════════════════════════════════════════

export async function getAdminProducts() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeProductFromDb);
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(normalized));
        return normalized;
      }
    } catch (e) {
      console.warn('Supabase fetch products error, fallback to local:', e);
    }
  }

  // Local fallback
  const local = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProductFromDb);
      }
    } catch (e) {}
  }

  // Initialize with default products
  const normalizedDefaults = (defaultProducts || []).map(normalizeProductFromDb);
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(normalizedDefaults));
  return normalizedDefaults;
}

export async function saveAdminProduct(product) {
  const client = getSupabaseClient();
  const dbPayload = normalizeProductForDb(product);
  let savedProduct = normalizeProductFromDb(dbPayload);

  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .upsert(dbPayload)
        .select()
        .single();

      if (!error && data) {
        savedProduct = normalizeProductFromDb(data);
      } else if (error) {
        console.warn('Supabase save product warning:', error);
      }
    } catch (e) {
      console.warn('Supabase save product error:', e);
    }
  }

  // Update local storage
  const list = await getAdminProducts();
  const existingIdx = list.findIndex(p => p.id === savedProduct.id);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...savedProduct };
  } else {
    list.unshift(savedProduct);
  }
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));

  // Dispatch live update event for client reactive components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('phatdat:products-updated', { detail: savedProduct }));
  }

  return savedProduct;
}

export async function toggleProductActive(productId, isActive) {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('products').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', productId);
    } catch (e) {
      console.warn('Supabase toggle error:', e);
    }
  }

  const list = await getAdminProducts();
  const item = list.find(p => p.id === productId);
  if (item) {
    item.is_active = isActive;
    item.isActive = isActive;
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('phatdat:products-updated'));
  }
  return true;
}

export async function deleteAdminProduct(productId) {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('products').delete().eq('id', productId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  const list = await getAdminProducts();
  const filtered = list.filter(p => p.id !== productId);
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(filtered));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('phatdat:products-updated'));
  }
  return true;
}

// One-click Seed all default sample products to Supabase
export async function syncAllProductsToSupabase() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Chưa kết nối Supabase');

  const productsPayload = (defaultProducts || []).map(normalizeProductForDb);
  const collectionsPayload = (defaultHjCollections || []).map(c => ({
    id: c.id,
    name: c.name,
    description: c.description || '',
    image: c.image || '',
    color: c.color || '#1E5D57'
  }));

  // Upsert products
  const { data: pData, error: pError } = await client.from('products').upsert(productsPayload).select();
  if (pError) throw new Error('Lỗi sync sản phẩm: ' + pError.message);

  // Upsert collections
  await client.from('collections').upsert(collectionsPayload);

  // Refresh local cache
  await getAdminProducts();
  await getAdminCollections();

  return {
    productsCount: pData ? pData.length : productsPayload.length,
    collectionsCount: collectionsPayload.length
  };
}

// ══════════════════════════════════════════════════════════════
// COLLECTIONS CRUD OPERATIONS
// ══════════════════════════════════════════════════════════════

export async function getAdminCollections() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('collections').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(data));
        return data;
      }
    } catch (e) {}
  }

  const local = localStorage.getItem(STORAGE_KEY_COLLECTIONS);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }

  localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(defaultHjCollections));
  return defaultHjCollections;
}

export async function saveAdminCollection(collection) {
  const client = getSupabaseClient();
  const item = {
    id: collection.id || collection.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: collection.name,
    description: collection.description || '',
    image: collection.image || './images/gallery/g1.jpg',
    color: collection.color || '#1E5D57'
  };

  if (client) {
    try {
      await client.from('collections').upsert(item);
    } catch (e) {
      console.warn('Supabase save collection error:', e);
    }
  }

  const list = await getAdminCollections();
  const idx = list.findIndex(c => c.id === item.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...item };
  } else {
    list.push(item);
  }
  localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(list));
  return item;
}

export async function deleteAdminCollection(collectionId) {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('collections').delete().eq('id', collectionId);
    } catch (e) {
      console.warn('Supabase delete collection error:', e);
    }
  }

  const list = await getAdminCollections();
  const filtered = list.filter(c => c.id !== collectionId);
  localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(filtered));
  return true;
}

// ══════════════════════════════════════════════════════════════
// CONTACT / CONSULTATION REQUESTS
// ══════════════════════════════════════════════════════════════

export async function getAdminContacts() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('contacts').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        const normalized = data.map(normalizeContactFromDb);
        localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(normalized));
        return normalized;
      }
    } catch (e) {}
  }

  const local = localStorage.getItem(STORAGE_KEY_CONTACTS);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed.map(normalizeContactFromDb);
    } catch (e) {}
  }

  const samples = [
    {
      id: 'REQ-101',
      fullName: 'Trần Thị Thu Hà',
      phone: '0912345678',
      email: 'thuha@gmail.com',
      subject: 'Tư vấn nhẫn cỏ ba lá Size 7',
      message: 'Shop ơi mình muốn tư vấn nhẫn cỏ ba lá xi vàng có sẵn size 7 không, giao qua Quận 1 mất bao lâu?',
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'REQ-102',
      fullName: 'Lê Hoàng Yến',
      phone: '0988776655',
      email: 'hoangyen@gmail.com',
      subject: 'Đặt làm quà sinh nhật dây chuyền Moissanite',
      message: 'Mình cần gói quà tặng sinh nhật kèm thiệp chúc mừng, shop có hỗ trợ viết thiệp không?',
      status: 'completed',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    }
  ];
  localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(samples));
  return samples;
}

export async function addCustomerContact(contact) {
  const client = getSupabaseClient();
  const item = {
    id: 'REQ-' + Date.now().toString().slice(-6),
    full_name: contact.fullName || contact.full_name || 'Khách hàng',
    phone: contact.phone || '',
    email: contact.email || '',
    subject: contact.subject || 'Tư vấn sản phẩm',
    message: contact.message || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };

  if (client) {
    try {
      await client.from('contacts').insert([item]);
    } catch (e) {
      console.warn('Supabase insert contact error:', e);
    }
  }

  const list = await getAdminContacts();
  const normalized = normalizeContactFromDb(item);
  list.unshift(normalized);
  localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(list));
  return normalized;
}

export async function updateContactStatus(id, status) {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('contacts').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase update contact status error:', e);
    }
  }

  const list = await getAdminContacts();
  const item = list.find(c => c.id === id);
  if (item) {
    item.status = status;
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(list));
  }
  return true;
}

export async function deleteAdminContact(id) {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('contacts').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete contact error:', e);
    }
  }

  const list = await getAdminContacts();
  const filtered = list.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(filtered));
  return true;
}

// ══════════════════════════════════════════════════════════════
// SITE SETTINGS
// ══════════════════════════════════════════════════════════════

export async function getAdminSiteSettings() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('site_settings').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        const obj = {};
        data.forEach(row => {
          let val = row.value;
          try {
            if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
              val = JSON.parse(val);
            }
          } catch (e) {}
          obj[row.key] = val;
        });
        const combined = { ...defaultSiteInfo, ...obj };
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(combined));
        return combined;
      }
    } catch (e) {}
  }

  const local = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  return defaultSiteInfo;
}

export async function saveAdminSiteSettings(settings) {
  const client = getSupabaseClient();
  if (client) {
    try {
      for (const [k, v] of Object.entries(settings)) {
        await client.from('site_settings').upsert({
          key: k,
          value: v,
          updated_at: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn('Supabase save site settings error:', e);
    }
  }
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('phatdat:settings-updated', { detail: settings }));
  }
  return settings;
}

// ══════════════════════════════════════════════════════════════
// BACKGROUND DATA SYNC (Client initialization)
// ══════════════════════════════════════════════════════════════

export async function initDataSync() {
  try {
    const client = getSupabaseClient();
    if (!client) return;

    // Fetch site settings first to update contact numbers and branding
    await getAdminSiteSettings();

    // Fetch products and collections in background
    await Promise.all([
      getAdminProducts(),
      getAdminCollections()
    ]);
  } catch (err) {
    console.debug('Background sync completed with local cache.');
  }
}
