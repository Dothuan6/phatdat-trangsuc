// ============================================================
// ABOUT US PAGE
// ============================================================

import { t } from '../i18n.js';

export function renderAbout(container) {
  const page = document.createElement('div');
  page.className = 'page-about container section';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.style.textAlign = 'center';
  title.style.marginBottom = '48px';
  title.textContent = t('nav.about') || 'Về Chúng Tôi';
  page.appendChild(title);

  const content = document.createElement('div');
  content.style.maxWidth = '800px';
  content.style.margin = '0 auto';
  content.style.lineHeight = '1.8';
  content.style.fontSize = '1.1rem';

  content.innerHTML = `
    <div style="margin-bottom: 40px;">
      <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 24px; text-align: center;">${t('about.storyTitle') || 'Câu Chuyện Thương Hiệu'}</h2>
      <p style="margin-bottom: 20px;">${t('about.story1') || 'Được thành lập với niềm đam mê bất tận dành cho cái đẹp và sự hoàn mỹ, thương hiệu của chúng tôi tự hào là người bạn đồng hành trong những khoảnh khắc đáng nhớ nhất của cuộc đời bạn. Mỗi món trang sức không chỉ là một vật phẩm lấp lánh, mà còn là một câu chuyện, một lời hứa và một di sản vượt thời gian.'}</p>
      <p>${t('about.story2') || 'Chúng tôi tin rằng trang sức đích thực phải có khả năng chạm đến cảm xúc. Chính vì vậy, từ khâu lên ý tưởng thiết kế, lựa chọn nguyên liệu cho đến khi hoàn thiện sản phẩm, mọi quy trình đều được thực hiện với sự tận tâm và tỉ mỉ cao nhất.'}</p>
    </div>

    <div style="margin-bottom: 40px; text-align: center;">
      <div style="width: 100%; height: 400px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
    </div>

    <div>
      <h2 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 24px; text-align: center;">${t('about.craftTitle') || 'Nghệ Thuật Chế Tác'}</h2>
      <p style="margin-bottom: 20px;">${t('about.craft1') || 'Sự xuất sắc trong chế tác (Savoir-Faire) là kim chỉ nam cho mọi hoạt động của chúng tôi. Những nghệ nhân kim hoàn lành nghề đã dành hàng nghìn giờ đồng hồ để gọt giũa, đánh bóng và nạm từng viên đá quý, đảm bảo rằng mỗi tác phẩm khi đến tay khách hàng đều đạt độ tinh xảo tuyệt đối.'}</p>
      <p>${t('about.craft2') || 'Chúng tôi chỉ sử dụng những vật liệu cao cấp nhất: vàng 18K, bạch kim và những viên kim cương, đá quý tự nhiên được tuyển chọn khắt khe theo tiêu chuẩn quốc tế. Khẳng định giá trị bền vững và vẻ đẹp vĩnh cửu.'}</p>
    </div>
  `;

  page.appendChild(content);
  container.appendChild(page);
}
