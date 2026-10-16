// ============================================================
// ADMIN AUTHENTICATION SERVICE — Phát Đạt Jewelry Backoffice
// ============================================================

import { getSupabaseClient } from './supabase.js';

const ADMIN_SESSION_KEY = 'phatdat_admin_auth_session';
const ADMIN_EMAIL_KEY = 'phatdat_admin_email';
const ADMIN_PASS_KEY = 'phatdat_admin_password';

// Designated default credentials
export const DEFAULT_ADMIN = {
  email: 'admin@gmail.com',
  name: 'Quản Trị Viên (Phát Đạt Jewelry)',
  role: 'super_admin'
};

export function getAdminCredentials() {
  const email = (typeof localStorage !== 'undefined' && localStorage.getItem(ADMIN_EMAIL_KEY)) || 'admin@gmail.com';
  const password = (typeof localStorage !== 'undefined' && localStorage.getItem(ADMIN_PASS_KEY)) || 'admin';
  return { email, password };
}

export function updateAdminCredentials(newEmail, newPassword) {
  if (newEmail && newEmail.trim()) {
    localStorage.setItem(ADMIN_EMAIL_KEY, newEmail.trim().toLowerCase());
  }
  if (newPassword && newPassword.trim()) {
    localStorage.setItem(ADMIN_PASS_KEY, newPassword.trim());
  }
  return true;
}

export async function login(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();
  const currentCreds = getAdminCredentials();

  // Check admin credentials
  if (cleanEmail === currentCreds.email && cleanPass === currentCreds.password) {
    const session = {
      user: {
        id: 'admin-master',
        email: currentCreds.email,
        name: 'Quản Trị Viên Phát Đạt',
        role: 'super_admin'
      },
      token: 'admin-session-' + Date.now(),
      loginAt: new Date().toISOString()
    };
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return { success: true, session };
  }

  // Attempt Supabase Auth if client configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });
      if (!error && data.session) {
        const session = {
          user: data.user,
          token: data.session.access_token,
          loginAt: new Date().toISOString()
        };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        return { success: true, session };
      }
      return { success: false, message: error ? error.message : 'Sai tài khoản hoặc mật khẩu' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  return {
    success: false,
    message: 'Tài khoản hoặc mật khẩu không đúng. Vui lòng sử dụng admin@gmail.com / admin'
  };
}

export function logout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  const client = getSupabaseClient();
  if (client) {
    try { client.auth.signOut(); } catch (e) {}
  }
}

export function isAuthenticated() {
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  try {
    const parsed = JSON.parse(session);
    return !!parsed.token;
  } catch (e) {
    return false;
  }
}

export function getAdminUser() {
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return null;
  try {
    return JSON.parse(session).user;
  } catch (e) {
    return null;
  }
}
