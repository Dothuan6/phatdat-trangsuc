// ============================================================
// SIZE GUIDE MODAL COMPONENT
// ============================================================

export function createSizeGuideModal() {
  const overlay = document.createElement('div');
  overlay.className = 'size-guide-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 35, 32, 0.65);
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 16px;
    backdrop-filter: blur(4px);
  `;

  const modal = document.createElement('div');
  modal.className = 'size-guide-modal';
  modal.style.cssText = `
    background: #ffffff;
    max-width: 580px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.25);
    padding: 28px 24px;
    position: relative;
    font-family: var(--font-body);
  `;

  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 16px; margin-bottom: 20px;">
      <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--color-brand-primary); margin: 0;">Hướng Dẫn Đo Size Trang Sức</h3>
      <button class="size-guide-close" style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--color-text-secondary); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">✕</button>
    </div>

    <div class="size-guide-content">
      <!-- Tabs -->
      <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid var(--color-border-light);">
        <button id="tab-ring-btn" class="size-tab-btn is-active" style="padding: 10px 18px; border: none; background: none; font-weight: 600; cursor: pointer; color: var(--color-brand-primary); border-bottom: 2px solid var(--color-brand-primary); margin-bottom: -2px;">Size Nhẫn</button>
        <button id="tab-bracelet-btn" class="size-tab-btn" style="padding: 10px 18px; border: none; background: none; font-weight: 500; cursor: pointer; color: var(--color-text-secondary); border-bottom: 2px solid transparent; margin-bottom: -2px;">Size Vòng & Lắc Tay</button>
      </div>

      <!-- Ring Guide Tab -->
      <div id="ring-guide-pane">
        <h4 style="font-size: 15px; margin-bottom: 10px; color: var(--color-brand-primary);">Cách 1: Đo chu vi ngón tay bằng dải giấy</h4>
        <ol style="padding-left: 20px; font-size: 13px; line-height: 1.6; color: var(--color-text-secondary); margin-bottom: 16px;">
          <li>Dùng dải giấy nhỏ (bản rộng ~1cm) quấn vừa vặn quanh khớp ngón tay bạn muốn đeo.</li>
          <li>Đánh dấu điểm giao nhau của dải giấy.</li>
          <li>Dùng thước kẻ đo chiều dài đoạn giấy vừa đánh dấu (tính bằng milimet - mm).</li>
          <li>Đối chiếu với bảng size tiêu chuẩn bên dưới để chọn size.</li>
        </ol>

        <div style="overflow-x: auto; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: center;">
            <thead>
              <tr style="background-color: var(--color-brand-light); color: var(--color-brand-primary);">
                <th style="padding: 10px 8px; border: 1px solid var(--color-border);">Size nhẫn</th>
                <th style="padding: 10px 8px; border: 1px solid var(--color-border);">Đường kính trong</th>
                <th style="padding: 10px 8px; border: 1px solid var(--color-border);">Chu vi ngón tay</th>
                <th style="padding: 10px 8px; border: 1px solid var(--color-border);">Độ phổ biến</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; border: 1px solid var(--color-border); font-weight: 600;">Size 6</td>
                <td style="padding: 8px; border: 1px solid var(--color-border);">16.0 mm</td>
                <td style="padding: 8px; border: 1px solid var(--color-border);">50 – 52 mm</td>
                <td style="padding: 8px; border: 1px solid var(--color-border); color: #e67e22;">Tay nhỏ/ngón thon</td>
              </tr>
              <tr style="background: #fafaf8;">
                <td style="padding: 8px; border: 1px solid var(--color-border); font-weight: 600; color: var(--color-brand-primary);">Size 7</td>
                <td style="padding: 8px; border: 1px solid var(--color-border);">17.0 mm</td>
                <td style="padding: 8px; border: 1px solid var(--color-border);">53 – 55 mm</td>
                <td style="padding: 8px; border: 1px solid var(--color-border); color: var(--color-success); font-weight: 500;">Phổ biến nhất nữ VN</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid var(--color-border); font-weight: 600;">Size 8</td>
                <td style="padding: 8px; border: 1px solid var(--color-border);">18.0 mm</td>
                <td style="padding: 8px; border: 1px solid var(--color-border);">56 – 58 mm</td>
                <td style="padding: 8px; border: 1px solid var(--color-border);">Tay đầy đặn</td>
              </tr>
              <tr style="background: #fafaf8;">
                <td style="padding: 8px; border: 1px solid var(--color-border); font-weight: 600;">Freesize</td>
                <td style="padding: 8px; border: 1px solid var(--color-border);">Tùy chỉnh</td>
                <td style="padding: 8px; border: 1px solid var(--color-border);">49 – 60 mm</td>
                <td style="padding: 8px; border: 1px solid var(--color-border); color: var(--color-brand-primary);">Nhẫn hở, tự bóp/nới vừa tay</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bracelet Guide Tab -->
      <div id="bracelet-guide-pane" style="display: none;">
        <h4 style="font-size: 15px; margin-bottom: 10px; color: var(--color-brand-primary);">Cách đo size lắc tay & vòng tay</h4>
        <ol style="padding-left: 20px; font-size: 13px; line-height: 1.6; color: var(--color-text-secondary); margin-bottom: 16px;">
          <li>Lấy thước dây hoặc sợi chỉ quấn quanh cổ tay sát vị trí bạn muốn đeo.</li>
          <li>Đo chiều dài đoạn dây.</li>
          <li><strong>Cộng thêm 1.5cm đến 2cm</strong> để tạo độ cử động thoải mái khi đeo lắc.</li>
        </ol>

        <div style="background-color: var(--color-bg-secondary); border-radius: 6px; padding: 14px 16px; font-size: 13px; line-height: 1.7; color: var(--color-text-primary);">
          <p>• <strong>Cổ tay 14 – 15 cm:</strong> Chọn lắc dài <strong>16 cm</strong></p>
          <p>• <strong>Cổ tay 15 – 16 cm (Chuẩn nữ VN):</strong> Chọn lắc dài <strong>17 – 18 cm</strong></p>
          <p style="margin: 0; color: var(--color-brand-primary);">* Đa số các mẫu lắc tay tại Phát Đạt Jewelry đều thiết kế kèm theo <strong>xích phụ 2-3cm</strong> giúp khách dễ dàng điều chỉnh vừa khít cổ tay.</p>
        </div>
      </div>

      <!-- Footer contact note -->
      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--color-border); text-align: center;">
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 10px;">Chưa chắc chắn về kích cỡ? Nhắn tin để nhân viên tư vấn chọn size chuẩn xác:</p>
        <a href="https://zalo.me/0898025013" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 8px; background-color: var(--color-brand-primary); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 13px; font-weight: 500; text-decoration: none;">
          Tư vấn qua Zalo 0898 025 013
        </a>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Switch tabs
  const tabRing = modal.querySelector('#tab-ring-btn');
  const tabBracelet = modal.querySelector('#tab-bracelet-btn');
  const paneRing = modal.querySelector('#ring-guide-pane');
  const paneBracelet = modal.querySelector('#bracelet-guide-pane');

  tabRing.addEventListener('click', () => {
    tabRing.style.color = 'var(--color-brand-primary)';
    tabRing.style.borderBottomColor = 'var(--color-brand-primary)';
    tabBracelet.style.color = 'var(--color-text-secondary)';
    tabBracelet.style.borderBottomColor = 'transparent';
    paneRing.style.display = 'block';
    paneBracelet.style.display = 'none';
  });

  tabBracelet.addEventListener('click', () => {
    tabBracelet.style.color = 'var(--color-brand-primary)';
    tabBracelet.style.borderBottomColor = 'var(--color-brand-primary)';
    tabRing.style.color = 'var(--color-text-secondary)';
    tabRing.style.borderBottomColor = 'transparent';
    paneBracelet.style.display = 'block';
    paneRing.style.display = 'none';
  });

  function open(tabName = 'ring') {
    if (tabName === 'bracelet') {
      tabBracelet.click();
    } else {
      tabRing.click();
    }
    overlay.style.display = 'flex';
    document.body.classList.add('no-scroll');
  }

  function close() {
    overlay.style.display = 'none';
    document.body.classList.remove('no-scroll');
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  modal.querySelector('.size-guide-close').addEventListener('click', close);

  return { open, close };
}

// Global modal instance singleton
let globalSizeModal = null;
export function openGlobalSizeGuide(tab = 'ring') {
  if (!globalSizeModal) {
    globalSizeModal = createSizeGuideModal();
  }
  globalSizeModal.open(tab);
}
