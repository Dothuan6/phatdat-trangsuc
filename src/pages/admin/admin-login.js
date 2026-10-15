// ============================================================
// ADMIN LOGIN PAGE — Phát Đạt Jewelry Backoffice
// ============================================================

import { login, isAuthenticated } from '../../services/auth.js';
import { navigate } from '../../router.js';
import { showToast } from '../../components/feedback-modal.js';
import './admin.css';

export function renderAdminLogin(container) {
  // If already logged in, redirect directly to dashboard
  if (isAuthenticated()) {
    navigate('/admin');
    return;
  }

  const page = document.createElement('div');
  page.className = 'admin-login-page';

  page.innerHTML = `
    <div class="admin-login-card">
      <div class="admin-login-header">
        <a href="#/">
          <img src="/images/logo.png" alt="Phát Đạt Jewelry" class="admin-login-logo">
        </a>
        <h1 class="admin-login-title">Hệ Thống Quản Trị</h1>
        <p class="admin-login-subtitle">Đăng nhập tài khoản quản trị Phát Đạt Jewelry</p>
      </div>

      <div id="login-error-alert" style="display: none; background: #ffebee; color: #c62828; padding: 10px 14px; border-radius: 6px; font-size: 13px; margin-bottom: 16px;"></div>

      <form id="admin-login-form">
        <div class="admin-form-group">
          <label for="admin-email">Email quản trị</label>
          <input type="email" id="admin-email" class="admin-form-input" value="admin@gmail.com" required placeholder="admin@gmail.com">
        </div>

        <div class="admin-form-group">
          <label for="admin-password">Mật khẩu</label>
          <input type="password" id="admin-password" class="admin-form-input" value="admin" required placeholder="••••••">
        </div>

        <button type="submit" id="admin-submit-btn" class="admin-login-btn">
          ĐĂNG NHẬP BACKOFFICE
        </button>
      </form>

      <div class="admin-login-notice">
        <div><strong>Tài khoản mặc định:</strong></div>
        <div>Email: <code>admin@gmail.com</code> · Mật khẩu: <code>admin</code></div>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="#/" style="font-size: 13px; color: var(--color-brand-primary); text-decoration: none;">← Quay lại Trang chủ Website</a>
      </div>
    </div>
  `;

  const form = page.querySelector('#admin-login-form');
  const errorAlert = page.querySelector('#login-error-alert');
  const submitBtn = page.querySelector('#admin-submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorAlert.style.display = 'none';
    submitBtn.textContent = 'Đang xác thực...';
    submitBtn.disabled = true;

    const email = page.querySelector('#admin-email').value;
    const password = page.querySelector('#admin-password').value;

    const result = await login(email, password);
    if (result.success) {
      submitBtn.textContent = 'Đăng nhập thành công!';
      submitBtn.style.backgroundColor = '#1E824C';
      showToast('Chào mừng trở lại Quản trị viên Phát Đạt!', 'success');
      setTimeout(() => {
        navigate('/admin');
      }, 400);
    } else {
      const msg = result.message || 'Đăng nhập không thành công';
      errorAlert.textContent = msg;
      errorAlert.style.display = 'block';
      submitBtn.textContent = 'ĐĂNG NHẬP BACKOFFICE';
      submitBtn.disabled = false;
      showToast(msg, 'error');
    }
  });

  container.appendChild(page);
}
