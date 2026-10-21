// ============================================================
// ABOUT US PAGE — Câu Chuyện Thương Hiệu, Chế Tác Bạc 925 & FAQ
// ============================================================

import { t } from '../i18n.js';
import { createAccordion } from '../components/accordion.js';
import { openGiftFinderModal } from '../components/feedback-modal.js';

export function renderAbout(container) {
  const page = document.createElement('div');
  page.className = 'page-about container section';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.style.textAlign = 'center';
  title.style.marginBottom = '36px';
  title.textContent = t('nav.about') || 'Về Phát Đạt Jewelry';
  page.appendChild(title);

  const content = document.createElement('div');
  content.style.maxWidth = '920px';
  content.style.margin = '0 auto';
  content.style.lineHeight = '1.8';
  content.style.fontSize = '1.02rem';
  content.style.color = 'var(--color-text-primary)';

  content.innerHTML = `
    <div style="margin-bottom: 40px; text-align: center;">
      <span style="font-size: 12px; font-weight: 700; color: var(--color-accent-gold); text-transform: uppercase; letter-spacing: 0.14em;">SỨ MỆNH THƯƠNG HIỆU</span>
      <h2 style="font-family: var(--font-display); font-size: 2rem; margin: 8px 0 20px; color: var(--color-brand-primary);">Câu Chuyện Thương Hiệu Phát Đạt Jewelry</h2>
      <p style="margin-bottom: 18px;">Được thành lập tại Quận 7, TP.HCM với sứ mệnh mang đến vẻ đẹp tinh tế, sang trọng nhưng gần gũi cho phụ nữ Việt Nam, <strong>Phát Đạt Jewelry</strong> tin rằng mỗi món trang sức nhỏ bé đều mang một nguồn năng lượng tích cực và may mắn riêng cho người đeo.</p>
      <p>Từ họa tiết cỏ ba lá biểu trưng cho may mắn, những đóa hoa nhỏ đính đá rạng rỡ cho đến những viên đá Moissanite lấp lánh tựa ánh sao, chúng tôi mang đến những thiết kế trang sức bạc hiện đại, nhẹ nhàng để bạn tự tin toả sáng trong công việc hằng ngày cũng như những buổi tiệc đặc biệt.</p>
    </div>

    <div style="margin-bottom: 44px; text-align: center;">
      <img src="./images/gallery/g16.jpg" alt="Chế tác trang sức Phát Đạt Jewelry" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 10px; box-shadow: 0 6px 24px rgba(0,0,0,0.08);">
    </div>

    <!-- Interactive 6-Stage Craftsmanship Journey Explorer (Round 26) -->
    <div style="margin-bottom: 52px; background: #FAF9F6; border: 1px solid #E8EDE9; border-radius: 16px; padding: 28px 24px;">
      <div style="text-align: center; max-width: 680px; margin: 0 auto 24px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-accent-gold); font-weight: 700;">Hành Trình Kim Hoàn Phát Đạt</span>
        <h2 style="font-family: var(--font-display); font-size: 1.85rem; color: var(--color-brand-primary); margin: 6px 0 10px;">6 Công Đoạn Chế Tác Bạc S925 Thủ Công</h2>
        <p style="font-size: 13.5px; color: var(--color-text-secondary); margin: 0;">Mỗi thiết kế đều trải qua hơn 18 giờ làm việc tỉ mỉ của các nghệ nhân kim hoàn lành nghề.</p>
      </div>

      <!-- Stage Step Pills -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 20px;" id="craft-stage-tabs">
        <button type="button" class="craft-tab-btn is-active" data-idx="0" style="flex: 1; min-width: 125px; padding: 10px; border-radius: 8px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; text-align: center;">
          01. Phôi Bạc Ý
        </button>
        <button type="button" class="craft-tab-btn" data-idx="1" style="flex: 1; min-width: 125px; padding: 10px; border-radius: 8px; border: 1px solid #D5E2DF; background: #fff; color: var(--color-text-primary); font-size: 12px; font-weight: 600; cursor: pointer; text-align: center;">
          02. Đúc Chân Không
        </button>
        <button type="button" class="craft-tab-btn" data-idx="2" style="flex: 1; min-width: 125px; padding: 10px; border-radius: 8px; border: 1px solid #D5E2DF; background: #fff; color: var(--color-text-primary); font-size: 12px; font-weight: 600; cursor: pointer; text-align: center;">
          03. Nạm Đá Vi Mô
        </button>
        <button type="button" class="craft-tab-btn" data-idx="3" style="flex: 1; min-width: 125px; padding: 10px; border-radius: 8px; border: 1px solid #D5E2DF; background: #fff; color: var(--color-text-primary); font-size: 12px; font-weight: 600; cursor: pointer; text-align: center;">
          04. Mài Gương Siêu Âm
        </button>
        <button type="button" class="craft-tab-btn" data-idx="4" style="flex: 1; min-width: 125px; padding: 10px; border-radius: 8px; border: 1px solid #D5E2DF; background: #fff; color: var(--color-text-primary); font-size: 12px; font-weight: 600; cursor: pointer; text-align: center;">
          05. Xi Rodium 3 Lớp
        </button>
        <button type="button" class="craft-tab-btn" data-idx="5" style="flex: 1; min-width: 125px; padding: 10px; border-radius: 8px; border: 1px solid #D5E2DF; background: #fff; color: var(--color-text-primary); font-size: 12px; font-weight: 600; cursor: pointer; text-align: center;">
          06. Quang Phổ S925
        </button>
      </div>

      <!-- Stage Display Card -->
      <div id="craft-stage-display" style="background: #ffffff; border: 1px solid #E2EBE7; border-radius: 12px; padding: 22px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
      </div>
    </div>

    <!-- Interactive FAQ Section -->
    <div style="margin-bottom: 44px;">
      <h2 style="font-family: var(--font-display); font-size: 1.85rem; margin-bottom: 20px; text-align: center; color: var(--color-brand-primary);">Câu Hỏi Thường Gặp Về Trang Sức Phát Đạt</h2>
      <div id="about-faq-list"></div>
    </div>

    <div style="text-align: center; display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
      <a href="#/jewelry" class="btn" style="background-color: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary);">KHÁM PHÁ CÁC BỘ SƯU TẬP</a>
      <button type="button" id="about-gift-btn" class="btn" style="background: var(--color-accent-gold); border-color: var(--color-accent-gold); color: #143F3B; font-weight: 700;">🎁 MỞ TRỢ LÝ CHỌN QUÀ 30S</button>
    </div>
  `;

  // Interactive Craftsmanship Journey Logic (Round 26)
  const craftDisplay = content.querySelector('#craft-stage-display');
  const craftTabs = content.querySelectorAll('.craft-tab-btn');
  const stages = [
    {
      title: '01. Tuyển Chọn Phôi Bạc Ý S925 Nhập Khẩu',
      icon: '🧪',
      metric: 'Hàm lượng Ag 92.5% ± 0.2%',
      desc: 'Phát Đạt sử dụng 92.5% bạc hạt nguyên chất tinh khiết phối trộn với 7.5% hợp kim kim hoàn vi lượng cao cấp từ Ý. Cam kết 100% không chứa niken hay chì gây kích ứng, an toàn tuyệt đối ngay cả với làn da nhạy cảm nhất.',
      highlight: 'An toàn da liễu · Không rỉ sét · Độ bóng phản xạ quang học 98%'
    },
    {
      title: '02. Điêu Khắc 3D & Đúc Khuôn Áp Lực Chân Không',
      icon: '🔥',
      metric: 'Nhiệt độ nung 961.8°C',
      desc: 'Bản vẽ CAD 3D được in sáp độ phân giải micron, sau đó đổ thạch cao và nung chảy bạc trong buồng chân không áp suất cao. Phương pháp này loại bỏ hoàn toàn bọt khí li ti, giúp đai nhẫn và ổ chấu đạt độ đặc chắc và chịu lực hoàn hảo.',
      highlight: 'Không rỗ bọt khí · Độ sắc nét 0.05mm · Kết cấu kim loại siêu bền'
    },
    {
      title: '03. Nạm Đá Vi Mô Thủ Công Dưới Kính Hiển Vi',
      icon: '🔬',
      metric: 'Kính lúp hiển vi 20x',
      desc: 'Từng viên đá Moissanite giác cắt Hearts & Arrows, đá CZ 5A và đá xà cừ tự nhiên được nghệ nhân nạm chấu 4 chân vi điểm. Từng chân chấu được gập nhẹ và ôm chặt viền đá, đảm bảo không bao giờ rơi rớt khi đeo vận động thường ngày.',
      highlight: 'Giác cắt chuẩn 57 giác · Giữ đá vĩnh viễn · Tán sắc 7 màu cầu vồng'
    },
    {
      title: '04. Mài Gương Thủ Công & Rung Siêu Âm 5 Cấp Độ',
      icon: '🪞',
      metric: '5 Cấp độ mài bóng',
      desc: 'Sau khi đúc, sản phẩm trải qua 5 bước mài rung thô -> mài mịn -> đánh bóng lơ xanh -> mài gương thủ công bằng bánh vải lông cừu -> tẩy rửa trong bể sóng siêu âm 40kHz để loại bỏ toàn bộ mạt kim loại và bụi bẩn trong kẽ đá.',
      highlight: 'Bề mặt phẳng gương soi · Không vướng tơ áo · Sạch 100% kẽ ổ đá'
    },
    {
      title: '05. Xi Mạ Điện Phân Bạch Kim Rodium 3 Lớp',
      icon: '✨',
      metric: 'Phủ Rodium 0.5 - 1.0 micron',
      desc: 'Trang sức được nhúng bể điện phân phủ 3 lớp: Lớp lót tăng bám -> Lớp Palladium ngăn oxy hóa -> Lớp ngoài cùng là Rodium (kim loại quý hiếm đắt hơn vàng). Lớp áo này giúp trang sức sáng lấp lánh như vàng trắng Ý và hạn chế tối đa xỉn màu do mồ hôi.',
      highlight: 'Bền màu gấp 4 lần · Chống xỉn mồ hôi muối · Tông màu bạch kim sang trọng'
    },
    {
      title: '06. Kiểm Định Quang Phổ & Khắc Laser Tem S925',
      icon: '🔍',
      metric: 'Máy quang phổ XRF & Laser Fiber',
      desc: 'Trước khi xuất xưởng, máy quang phổ huỳnh quang tia X (XRF) quét kiểm tra hàm lượng bạc từng mẻ. Máy khắc Laser Fiber tạo dấu chứng nhận [S925] và logo Phát Đạt siêu nét trên móc khóa. Kèm thẻ bảo hành làm sáng miễn phí trọn đời.',
      highlight: 'Tem S925 chuẩn mực · Thẻ bảo hành điện tử · Quà tặng trọn đời'
    }
  ];

  function renderCraftStage(idx) {
    const s = stages[idx];
    craftTabs.forEach((tab, i) => {
      const active = i === idx;
      tab.style.background = active ? 'var(--color-brand-primary)' : '#fff';
      tab.style.color = active ? '#fff' : 'var(--color-text-primary)';
      tab.style.borderColor = active ? 'var(--color-brand-primary)' : '#D5E2DF';
      tab.style.fontWeight = active ? '700' : '600';
    });

    craftDisplay.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; flex-wrap: wrap; margin-bottom: 12px;">
        <div>
          <span style="font-size: 11px; font-weight: 700; color: var(--color-accent-gold); text-transform: uppercase; letter-spacing: 0.08em;">Công đoạn ${idx + 1}/6</span>
          <h3 style="font-family: var(--font-display); font-size: 1.35rem; color: var(--color-brand-primary); margin: 4px 0 0;">${s.title}</h3>
        </div>
        <div style="background: #FAF5E8; border: 1px solid #EADBBA; border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 700; color: #735316;">
          ${s.metric}
        </div>
      </div>

      <p style="font-size: 13.5px; color: var(--color-text-secondary); line-height: 1.65; margin-bottom: 16px;">
        ${s.desc}
      </p>

      <div style="background: #F4F9F8; border-left: 3px solid var(--color-brand-primary); padding: 10px 14px; border-radius: 0 8px 8px 0; font-size: 12.5px; font-weight: 600; color: var(--color-brand-primary);">
        💎 Tiêu chuẩn đạt được: ${s.highlight}
      </div>
    `;
  }

  craftTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      renderCraftStage(Number(btn.dataset.idx));
    });
  });
  renderCraftStage(0);

  const faqList = content.querySelector('#about-faq-list');
  const aboutFaqs = [
    {
      q: 'Làm sao phân biệt Bạc 925 thật tại Phát Đạt Jewelry?',
      a: '<p style="font-size:13.5px;line-height:1.6;color:var(--color-text-secondary);">Mỗi sản phẩm tại Phát Đạt đều có khắc ký hiệu <strong>S925</strong> tinh xảo trên móc khóa hoặc lòng nhẫn, đi kèm thẻ bảo hành chính hãng của cửa hàng tại 709 Trần Xuân Soạn, Quận 7.</p>'
    },
    {
      q: 'Chính sách bảo hành đánh bóng & làm sáng trọn đời áp dụng như thế nào?',
      a: '<p style="font-size:13.5px;line-height:1.6;color:var(--color-text-secondary);">Bất kỳ khi nào trang sức của bạn bị mờ sau thời gian dài sử dụng, bạn chỉ cần mang ghé trực tiếp cửa hàng hoặc gửi về tiệm, kỹ thuật viên sẽ siêu âm làm sạch và đánh bóng miễn phí 100% không giới hạn số lần.</p>'
    },
    {
      q: 'Da nhạy cảm đeo trang sức bạc xi vàng của shop có bị ngứa không?',
      a: '<p style="font-size:13.5px;line-height:1.6;color:var(--color-text-secondary);">Hoàn toàn không. Phôi bạc S925 chuẩn quốc tế của Phát Đạt không pha tạp niken — nguyên nhân chính gây kích ứng da ở các loại mỹ ký giá rẻ.</p>'
    }
  ];
  aboutFaqs.forEach((f, idx) => faqList.appendChild(createAccordion(f.q, f.a, idx === 0)));

  content.querySelector('#about-gift-btn').addEventListener('click', () => openGiftFinderModal());

  page.appendChild(content);
  container.appendChild(page);
}

