// ============================================================
// SUPABASE CLIENT SERVICE & REPOSITORY — Phát Đạt Jewelry
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { products as defaultProducts, collections as defaultCollectionsList } from '../data/products.js';
import { hjCollections as defaultHjCollections } from '../data/collections.js';
import { siteInfo as defaultSiteInfo } from '../data/site-info.js';

export const SUPABASE_PROJECT_ID = 'mvmxlcruorsjejnjugrf';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

const STORAGE_KEY_ANON = 'phatdat_supabase_anon_key';
const STORAGE_KEY_PRODUCTS = 'phatdat_admin_products';
const STORAGE_KEY_COLLECTIONS = 'phatdat_admin_collections';
const STORAGE_KEY_CONTACTS = 'phatdat_admin_contacts';
const STORAGE_KEY_SETTINGS = 'phatdat_admin_settings';

// Get current anon key (from localStorage or environment)
export function getSupabaseAnonKey() {
  return localStorage.getItem(STORAGE_KEY_ANON) || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';
}

export function setSupabaseAnonKey(key) {
  if (key) {
    localStorage.setItem(STORAGE_KEY_ANON, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_ANON);
  }
}

// Create or get Supabase client
let supabaseInstance = null;
export function getSupabaseClient() {
  const key = getSupabaseAnonKey();
  if (!key) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, key);
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
  const checkKey = key || getSupabaseAnonKey();
  if (!checkKey) return { success: false, message: 'Chưa nhập Supabase Anon Key' };
  try {
    const client = createClient(SUPABASE_URL, checkKey);
    const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, it's connected to Supabase but schema is missing
      if (error.code === '42P01') {
        return { success: true, needSchema: true, message: 'Đã kết nối Supabase thành công! Cần khởi tạo cấu trúc bảng (chạy script SQL).' };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Đã kết nối Supabase thành công & sẵn sàng lưu trữ!' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// ══════════════════════════════════════════════════════════════
// PRODUCTS CRUD OPERATIONS (Supabase + Local Fallback)
// ══════════════════════════════════════════════════════════════

export async function getAdminProducts() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch products error, fallback to local:', e);
    }
  }

  // Local fallback
  const local = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  // Initialize with default products
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(defaultProducts));
  return defaultProducts;
}

export async function saveAdminProduct(product) {
  const client = getSupabaseClient();
  let savedProduct = { ...product };

  if (client) {
    try {
      if (product.id) {
        const { data, error } = await client.from('products').upsert(product).select().single();
        if (!error && data) savedProduct = data;
      }
    } catch (e) {
      console.warn('Supabase save product error:', e);
    }
  }

  // Update local storage
  const list = await getAdminProducts();
  const existingIdx = list.findIndex(p => p.id === product.id);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...savedProduct };
  } else {
    list.unshift(savedProduct);
  }
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
  return savedProduct;
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
  return true;
}

// ══════════════════════════════════════════════════════════════
// COLLECTIONS CRUD OPERATIONS
// ══════════════════════════════════════════════════════════════

export async function getAdminCollections() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('collections').select('*');
      if (!error && data && data.length > 0) return data;
    } catch (e) {}
  }

  const local = localStorage.getItem(STORAGE_KEY_COLLECTIONS);
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(defaultHjCollections));
  return defaultHjCollections;
}

export async function saveAdminCollection(collection) {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('collections').upsert(collection);
    } catch (e) {}
  }

  const list = await getAdminCollections();
  const idx = list.findIndex(c => c.id === collection.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...collection };
  } else {
    list.push(collection);
  }
  localStorage.setItem(STORAGE_KEY_COLLECTIONS, JSON.stringify(list));
  return collection;
}

// ══════════════════════════════════════════════════════════════
// CONTACT / CONSULTATION REQUESTS
// ══════════════════════════════════════════════════════════════

export async function getAdminContacts() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('contacts').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {}
  }

  const local = localStorage.getItem(STORAGE_KEY_CONTACTS);
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }

  // Default sample inquiries
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
    ...contact,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  if (client) {
    try {
      await client.from('contacts').insert([item]);
    } catch (e) {}
  }

  const list = await getAdminContacts();
  list.unshift(item);
  localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(list));
  return item;
}

export async function updateContactStatus(id, status) {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('contacts').update({ status }).eq('id', id);
    } catch (e) {}
  }

  const list = await getAdminContacts();
  const item = list.find(c => c.id === id);
  if (item) {
    item.status = status;
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(list));
  }
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
      if (!error && data && data.length > 0) {
        const obj = {};
        data.forEach(row => { obj[row.key] = row.value; });
        return { ...defaultSiteInfo, ...obj };
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
        await client.from('site_settings').upsert({ key: k, value: v, updated_at: new Date().toISOString() });
      }
    } catch (e) {}
  }
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  return settings;
}
