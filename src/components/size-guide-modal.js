// ============================================================
// INTERACTIVE SIZE GUIDE, ON-SCREEN RING RULER, NECKLACE
// VISUALIZER & SILVER CARE MODAL — Phát Đạt Jewelry
// ============================================================

export function createSizeGuideModal() {
  const overlay = document.createElement('div');
  overlay.className = 'size-guide-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 35, 32, 0.68);
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
    max-width: 640px;
    width: 100%;
    max-height: 92vh;
    overflow-y: auto;
    border-radius: 10px;
    box-shadow: 0 15px 50px rgba(0,0,0,0.3);
    padding: 24px;
    position: relative;
    font-family: var(--font-body);
  `;

  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 14px; margin-bottom: 16px;">
      <div>
        <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--color-brand-primary); margin: 0;">Cẩm Nang Đo Size & Bảo Quản Bạc 925</h3>
        <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Công cụ đo size nhẫn trực quan & minh họa dáng dây chuyền</div>
      </div>
      <button class="size-guide-close" style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--color-text-secondary); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">✕</button>
    </div>

    <div class="size-guide-content">
      <!-- 4 Interactive Tabs -->
      <div style="display: flex; gap: 6px; overflow-x: auto; margin-bottom: 18px; border-bottom: 2px solid var(--color-border-light); padding-bottom: 2px;">
        <button type="button" data-sg-tab="ruler" class="size-tab-btn is-active" style="padding: 8px 12px; border: none; background: none; font-weight: 700; font-size: 13px; white-space: nowrap; cursor: pointer; color: var(--color-brand-primary); border-bottom: 2px solid var(--color-brand-primary); margin-bottom: -4px;">
          📏 Đo Nhẫn Trên Màn Hình
        </button>
        <button type="button" data-sg-tab="necklace" class="size-tab-btn" style="padding: 8px 12px; border: none; background: none; font-weight: 500; font-size: 13px; white-space: nowrap; cursor: pointer; color: var(--color-text-secondary); border-bottom: 2px solid transparent; margin-bottom: -4px;">
          📿 Dáng Dây Chuyền
        </button>
        <button type="button" data-sg-tab="ring" class="size-tab-btn" style="padding: 8px 12px; border: none; background: none; font-weight: 500; font-size: 13px; white-space: nowrap; cursor: pointer; color: var(--color-text-secondary); border-bottom: 2px solid transparent; margin-bottom: -4px;">
          💍 Bảng Size Nhẫn
        </button>
        <button type="button" data-sg-tab="care" class="size-tab-btn" style="padding: 8px 12px; border: none; background: none; font-weight: 500; font-size: 13px; white-space: nowrap; cursor: pointer; color: var(--color-text-secondary); border-bottom: 2px solid transparent; margin-bottom: -4px;">
          ✨ Lắc Tay & Bảo Quản Bạc
        </button>
      </div>

      <!-- PANE 1: INTERACTIVE ON-SCREEN RING SIZER -->
      <div id="sg-pane-ruler" class="sg-pane">
        <div style="background: #f8faf9; border: 1px solid var(--color-border); border-radius: 8px; padding: 16px; text-align: center;">
          <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 12px;">
            Đặt chiếc nhẫn bạn đang đeo lên vòng tròn bên dưới, sau đó kéo thanh trượt sao cho <strong>viền vòng tròn khớp với lòng trong của nhẫn</strong>:
          </div>

          <!-- Ring Visual Circle Arena -->
          <div style="height: 150px; display: flex; align-items: center; justify-content: center; position: relative; background: radial-gradient(circle, #ffffff 0%, #eef4f3 100%); border-radius: 8px; border: 1px dashed var(--color-border); margin-bottom: 14px;">
            <div id="interactive-ring-circle" style="
              width: 17mm;
              height: 17mm;
              border-radius: 50%;
              border: 2.5px solid var(--color-brand-primary);
              background: rgba(201, 151, 56, 0.16);
              box-shadow: 0 0 0 4px rgba(201, 151, 56, 0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              transition: width 0.06s, height 0.06s;
            ">
              <span id="ring-circle-mm" style="font-size: 11px; font-weight: 700; color: var(--color-brand-primary);">17.0mm</span>
            </div>
          </div>

          <!-- Slider Control -->
          <div style="display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 14px;">
            <button type="button" id="ring-step-minus" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--color-border); background: #fff; font-weight: 700; cursor: pointer;">−</button>
            <input type="range" id="ring-diameter-slider" min="14.5" max="20.0" step="0.1" value="17.0" style="flex: 1; max-width: 280px; accent-color: var(--color-brand-primary); cursor: pointer;">
            <button type="button" id="ring-step-plus" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--color-border); background: #fff; font-weight: 700; cursor: pointer;">+</button>
          </div>

          <!-- Live Calculated Result -->
          <div style="background: #ffffff; border: 1px solid var(--color-brand-primary); border-radius: 8px; padding: 12px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
            <div>
              <div style="font-size: 11px; color: var(--color-text-secondary);">Đường kính trong</div>
              <div id="res-diameter" style="font-size: 16px; font-weight: 700; color: var(--color-text-primary);">17.0 mm</div>
            </div>
            <div style="border-left: 1px solid var(--color-border-light); border-right: 1px solid var(--color-border-light);">
              <div style="font-size: 11px; color: var(--color-text-secondary);">Chu vi lòng nhẫn</div>
              <div id="res-circumference" style="font-size: 16px; font-weight: 700; color: var(--color-text-primary);">53.4 mm</div>
            </div>
            <div>
              <div style="font-size: 11px; color: var(--color-text-secondary);">Size đề xuất</div>
              <div id="res-ring-size" style="font-size: 16px; font-weight: 700; color: var(--color-brand-primary);">Size 7</div>
            </div>
          </div>
          <div id="res-ring-desc" style="font-size: 12px; color: #2E7D32; font-weight: 600; margin-top: 8px;">
            ✓ Size 7: Phổ biến nhất cho ngón áp út & ngón giữa nữ Việt Nam
          </div>
        </div>
      </div>

      <!-- PANE 2: NECKLACE LENGTH VISUALIZER -->
      <div id="sg-pane-necklace" class="sg-pane" style="display: none;">
        <div style="background: #f8faf9; border: 1px solid var(--color-border); border-radius: 8px; padding: 16px;">
          <div style="font-size: 13px; color: var(--color-text-secondary); text-align: center; margin-bottom: 12px;">
            Chạm vào từng kích thước để xem vị trí dây chuyền nằm trên cổ và xương quai xanh:
          </div>

          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 14px;" id="necklace-length-pills">
            <button type="button" class="gift-quiz-pill" data-len="40" style="padding: 6px 14px; font-size: 12px;">40 cm (Choker)</button>
            <button type="button" class="gift-quiz-pill is-selected" data-len="45" style="padding: 6px 14px; font-size: 12px;">45 cm (Chuẩn tôn dáng)</button>
            <button type="button" class="gift-quiz-pill" data-len="50" style="padding: 6px 14px; font-size: 12px;">50 cm (Thanh lịch)</button>
            <button type="button" class="gift-quiz-pill" data-len="55" style="padding: 6px 14px; font-size: 12px;">55 cm (Dáng dài)</button>
          </div>

          <!-- Neck Silhouette SVG -->
          <div style="max-width: 280px; margin: 0 auto 12px auto; background: #fff; border-radius: 8px; padding: 12px; border: 1px solid var(--color-border-light);">
            <svg viewBox="0 0 240 210" style="width: 100%; height: auto; display: block;">
              <!-- Neck & Shoulders Silhouette -->
              <path d="M85 15 C88 45, 85 70, 35 90 L15 100 L15 200 L225 200 L225 100 L205 90 C155 70, 152 45, 155 15" fill="#F6F3EE" stroke="#D5CFC4" stroke-width="1.5"/>
              <!-- Collarbones -->
              <path d="M55 96 Q95 106 114 98" fill="none" stroke="#DFD8CC" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M185 96 Q145 106 126 98" fill="none" stroke="#DFD8CC" stroke-width="1.5" stroke-linecap="round"/>

              <!-- 40cm Chain -->
              <path id="chain-40" class="neck-chain-arc" d="M78 72 Q120 112 162 72" fill="none" stroke="#B0B8B6" stroke-width="1.6" stroke-dasharray="3,2"/>
              <text x="168" y="80" font-size="9" fill="#666">40cm</text>

              <!-- 45cm Chain (Default Highlighted) -->
              <path id="chain-45" class="neck-chain-arc" d="M73 74 Q120 135 167 74" fill="none" stroke="#C99738" stroke-width="3"/>
              <circle id="pendant-45" cx="120" cy="106" r="4.5" fill="#C99738"/>
              <text x="172" y="102" font-size="9" font-weight="bold" fill="#1E5D57">45cm</text>

              <!-- 50cm Chain -->
              <path id="chain-50" class="neck-chain-arc" d="M68 76 Q120 160 172 76" fill="none" stroke="#B0B8B6" stroke-width="1.6" stroke-dasharray="3,2"/>
              <text x="176" y="124" font-size="9" fill="#666">50cm</text>

              <!-- 55cm Chain -->
              <path id="chain-55" class="neck-chain-arc" d="M63 78 Q120 186 177 78" fill="none" stroke="#B0B8B6" stroke-width="1.6" stroke-dasharray="3,2"/>
              <text x="180" y="148" font-size="9" fill="#666">55cm</text>
            </svg>
          </div>

          <div id="necklace-len-desc" style="background: #fff; border-left: 3px solid var(--color-brand-primary); padding: 10px 12px; font-size: 13px; color: var(--color-text-primary); border-radius: 4px;">
            <strong>Dây 45cm (40cm + 5cm dây nối):</strong> Độ dài chuẩn phổ biến nhất tại Phát Đạt Jewelry. Mặt dây chuyền nằm ngay dưới hõm cổ, giúp tôn xương quai xanh thanh thoát.
          </div>
        </div>
      </div>

      <!-- PANE 3: RING GUIDE TABLE -->
      <div id="sg-pane-ring" class="sg-pane" style="display: none;">
        <h4 style="font-size: 15px; margin-bottom: 10px; color: var(--color-brand-primary);">Đo chu vi ngón tay bằng dải giấy hoặc sợi chỉ</h4>
        <ol style="padding-left: 20px; font-size: 13px; line-height: 1.6; color: var(--color-text-secondary); margin-bottom: 16px;">
          <li>Dùng dải giấy nhỏ (bản rộng ~1cm) quấn vừa vặn quanh khớp ngón tay bạn muốn đeo.</li>
          <li>Đánh dấu điểm giao nhau và dùng thước kẻ đo chiều dài đoạn giấy (mm).</li>
          <li>Đối chiếu với bảng size tiêu chuẩn bên dưới.</li>
        </ol>

        <div style="overflow-x: auto; margin-bottom: 16px;">
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
                <td style="padding: 8px; border: 1px solid var(--color-border); color: var(--color-brand-primary);">Nhẫn hở, tự chỉnh vừa tay</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PANE 4: BRACELET SIZE & SILVER 925 CARE GUIDE -->
      <div id="sg-pane-care" class="sg-pane" style="display: none;">
        <h4 style="font-size: 15px; margin-bottom: 8px; color: var(--color-brand-primary);">1. Cách chọn size Lắc Tay & Vòng Tay</h4>
        <div style="background-color: var(--color-bg-secondary); border-radius: 6px; padding: 12px 14px; font-size: 13px; line-height: 1.65; margin-bottom: 16px;">
          <p style="margin: 0 0 6px 0;">• <strong>Cổ tay 13.5 – 15 cm:</strong> Chọn lắc dài <strong>16 cm</strong></p>
          <p style="margin: 0 0 6px 0;">• <strong>Cổ tay 15 – 16.5 cm (Chuẩn nữ VN):</strong> Chọn lắc dài <strong>17 – 18 cm</strong></p>
          <p style="margin: 0; color: var(--color-brand-primary);">* Tất cả lắc tay Phát Đạt đều có <strong>đoạn xích phụ 3cm</strong> giúp tăng giảm linh hoạt.</p>
        </div>

        <h4 style="font-size: 15px; margin-bottom: 8px; color: var(--color-brand-primary);">2. Bí quyết giữ Bạc 925 luôn sáng bóng tại nhà</h4>
        <div style="display: grid; gap: 10px; font-size: 13px;">
          <div style="background: #f8faf9; border: 1px solid var(--color-border-light); padding: 10px 12px; border-radius: 6px;">
            <strong>✨ Mẹo làm sáng trong 2 phút:</strong> Thoa một lớp kem đánh răng mỏng hoặc đun nhẹ với nước cốt chanh + chút muối hạt, sau đó lau nhẹ bằng khăn lau bạc chuyên dụng được Phát Đạt tặng kèm.
          </div>
          <div style="background: #f8faf9; border: 1px solid var(--color-border-light); padding: 10px 12px; border-radius: 6px;">
            <strong>🧴 Hạn chế hóa chất mạnh:</strong> Tháo trang sức khi tiếp xúc thuốc tẩy, suối khoáng nóng hoặc xịt nước hoa trực tiếp lên bề mặt xi vàng.
          </div>
          <div style="background: #f8faf9; border: 1px solid var(--color-border-light); padding: 10px 12px; border-radius: 6px;">
            <strong>🛡️ Bảo hành trọn đời:</strong> Bất kỳ lúc nào trang sức cần đánh bóng hoặc kiểm tra ổ đá, bạn chỉ cần ghé cửa hàng Phát Đạt Jewelry để được vệ sinh bằng máy siêu âm hoàn toàn miễn phí!
          </div>
        </div>
      </div>

      <!-- Footer contact note -->
      <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--color-border); text-align: center;">
        <p style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 8px;">Chưa chắc chắn về kích cỡ? Nhắn tin để chuyên viên tư vấn chọn size chuẩn 100%:</p>
        <a href="https://zalo.me/0898025013" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 8px; background-color: var(--color-brand-primary); color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 13px; font-weight: 600; text-decoration: none;">
          💬 Tư vấn chọn size qua Zalo 0898 025 013
        </a>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Tab switching logic
  const tabBtns = modal.querySelectorAll('[data-sg-tab]');
  const panes = {
    ruler: modal.querySelector('#sg-pane-ruler'),
    necklace: modal.querySelector('#sg-pane-necklace'),
    ring: modal.querySelector('#sg-pane-ring'),
    care: modal.querySelector('#sg-pane-care')
  };

  function switchTab(tabKey) {
    const target = panes[tabKey] ? tabKey : 'ruler';
    tabBtns.forEach(btn => {
      const active = btn.dataset.sgTab === target;
      btn.style.color = active ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)';
      btn.style.borderBottomColor = active ? 'var(--color-brand-primary)' : 'transparent';
      btn.style.fontWeight = active ? '700' : '500';
    });
    Object.entries(panes).forEach(([k, el]) => {
      if (el) el.style.display = k === target ? 'block' : 'none';
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.sgTab));
  });

  // Interactive Ring Sizer Logic
  const slider = modal.querySelector('#ring-diameter-slider');
  const ringCircle = modal.querySelector('#interactive-ring-circle');
  const circleMm = modal.querySelector('#ring-circle-mm');
  const resDiam = modal.querySelector('#res-diameter');
  const resCirc = modal.querySelector('#res-circumference');
  const resSize = modal.querySelector('#res-ring-size');
  const resDesc = modal.querySelector('#res-ring-desc');

  function updateRingRuler(val) {
    const d = parseFloat(val);
    const c = (d * Math.PI).toFixed(1);
    ringCircle.style.width = `${d}mm`;
    ringCircle.style.height = `${d}mm`;
    circleMm.textContent = `${d.toFixed(1)}mm`;
    resDiam.textContent = `${d.toFixed(1)} mm`;
    resCirc.textContent = `${c} mm`;

    let sizeLabel = 'Size 7';
    let descLabel = '✓ Size 7: Phổ biến nhất cho ngón áp út & ngón giữa nữ Việt Nam';
    if (d < 15.6) {
      sizeLabel = 'Size 5 (hoặc Nhẫn Freesize)';
      descLabel = '✓ Phù hợp ngón út hoặc bàn tay rất nhỏ nhắn';
    } else if (d < 16.5) {
      sizeLabel = 'Size 6';
      descLabel = '✓ Size 6: Phù hợp bàn tay nữ thon mảnh';
    } else if (d < 17.5) {
      sizeLabel = 'Size 7';
      descLabel = '✓ Size 7: Kích cỡ chuẩn phổ biến nhất của nữ giới Việt Nam';
    } else if (d < 18.5) {
      sizeLabel = 'Size 8';
      descLabel = '✓ Size 8: Phù hợp tay đầy đặn hoặc đeo ngón trỏ/ngón giữa';
    } else {
      sizeLabel = 'Size 9 (hoặc Nhẫn Freesize)';
      descLabel = '✓ Phù hợp ngón tay lớn hoặc nhẫn bản hở điều chỉnh';
    }
    resSize.textContent = sizeLabel;
    resDesc.textContent = descLabel;
  }

  slider.addEventListener('input', (e) => updateRingRuler(e.target.value));
  modal.querySelector('#ring-step-minus').addEventListener('click', () => {
    slider.value = Math.max(14.5, parseFloat(slider.value) - 0.1).toFixed(1);
    updateRingRuler(slider.value);
  });
  modal.querySelector('#ring-step-plus').addEventListener('click', () => {
    slider.value = Math.min(20.0, parseFloat(slider.value) + 0.1).toFixed(1);
    updateRingRuler(slider.value);
  });

  // Necklace Length Visualizer Logic
  const neckDescs = {
    '40': '<strong>Dây 40cm (Dáng Choker):</strong> Ôm nhẹ sát chân cổ, cực kỳ tôn cổ cao và hợp với mặt dây chuyền nụ đá hoặc cỏ 4 lá nhỏ xinh.',
    '45': '<strong>Dây 45cm (40cm + 5cm dây nối):</strong> Độ dài chuẩn phổ biến nhất tại Phát Đạt Jewelry. Mặt dây chuyền nằm ngay dưới hõm cổ, giúp tôn xương quai xanh thanh thoát.',
    '50': '<strong>Dây 50cm (Dáng Thanh Lịch):</strong> Mặt dây rơi xuống dưới xương quai xanh khoảng 3-4cm, rất đẹp khi phối cùng áo sơ mi, đầm cổ chữ V hoặc áo cổ lọ.',
    '55': '<strong>Dây 55cm (Dáng Dài Thời Trang):</strong> Tạo hiệu ứng thon gọn phần thân trên, thích hợp phối layer 2 tầng dây hoặc mặt dây bản lớn.'
  };

  modal.querySelectorAll('#necklace-length-pills [data-len]').forEach(btn => {
    btn.addEventListener('click', () => {
      const len = btn.dataset.len;
      modal.querySelectorAll('#necklace-length-pills [data-len]').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      ['40', '45', '50', '55'].forEach(l => {
        const arc = modal.querySelector(`#chain-${l}`);
        if (arc) {
          if (l === len) {
            arc.setAttribute('stroke', '#C99738');
            arc.setAttribute('stroke-width', '3');
            arc.removeAttribute('stroke-dasharray');
          } else {
            arc.setAttribute('stroke', '#B0B8B6');
            arc.setAttribute('stroke-width', '1.6');
            arc.setAttribute('stroke-dasharray', '3,2');
          }
        }
      });

      const pendant = modal.querySelector('#pendant-45');
      if (pendant) {
        const cyMap = { '40': '92', '45': '106', '50': '118', '55': '132' };
        pendant.setAttribute('cy', cyMap[len] || '106');
      }

      modal.querySelector('#necklace-len-desc').innerHTML = neckDescs[len] || neckDescs['45'];
    });
  });

  function open(tabName = 'ruler') {
    if (tabName === 'bracelet') {
      switchTab('care');
    } else if (panes[tabName]) {
      switchTab(tabName);
    } else {
      switchTab('ruler');
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

let globalSizeModal = null;
export function openGlobalSizeGuide(tab = 'ruler') {
  if (!globalSizeModal) {
    globalSizeModal = createSizeGuideModal();
  }
  globalSizeModal.open(tab);
}
export const openSizeGuideModal = openGlobalSizeGuide;
