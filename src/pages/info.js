// ============================================================
// INFO PAGES — Giao hàng, Quà tặng, Hướng dẫn size, Cookies,
// Khả năng tiếp cận, Bảo hành
// ============================================================

import { siteInfo } from '../data/site-info.js';
import { openGiftFinderModal } from '../components/feedback-modal.js';
import { openGlobalSizeGuide } from '../components/size-guide-modal.js';

const G = (n) => `./images/gallery/g${n}.jpg`;

const contactBlock = () => `
  <h2>Cần hỗ trợ thêm?</h2>
  <p>Gọi / Zalo <a href="${siteInfo.phoneHref}"><strong>${siteInfo.phoneDisplay}</strong></a> (${siteInfo.hours.toLowerCase()})
  hoặc nhắn tin qua <a href="${siteInfo.facebook}" target="_blank" rel="noopener">Facebook ${siteInfo.facebookName}</a> /
  <a href="${siteInfo.instagram}" target="_blank" rel="noopener">Instagram ${siteInfo.instagramName}</a>.</p>
`;

export const infoPages = {
  shipping: {
    title: 'Giao Hàng & Đổi Trả',
    image: G(4),
    body: () => `
      <h2>Giao hàng toàn quốc</h2>
      <ul>
        <li>Miễn phí giao hàng cho đơn từ 2 sản phẩm hoặc khách hàng thân thiết.</li>
        <li>Nội thành TP. Hồ Chí Minh: Giao nhanh 2–4h hoặc 1–2 ngày. Tỉnh thành khác: 2–4 ngày.</li>
        <li>Được đồng kiểm tra sản phẩm và hộp quà trước khi thanh toán (COD).</li>
      </ul>
      <h2>Chính sách đổi trả</h2>
      <ul>
        <li>Đổi size nhẫn / đổi mẫu miễn phí trong vòng 7 ngày kể từ khi nhận hàng.</li>
        <li>Sản phẩm còn nguyên tem, hộp quà và chưa qua sử dụng.</li>
        <li>Đổi mới 1-1 hoặc hoàn tiền 100% nếu sản phẩm có lỗi chế tác hoặc vận chuyển.</li>
      </ul>
      ${contactBlock()}`,
  },
  gifting: {
    title: 'Nghệ Thuật Quà Tặng',
    image: G(2),
    body: () => `
      <p>Mỗi sản phẩm Phát Đạt Jewelry đều được đóng gói chỉn chu trong hộp nhung hoặc hộp nơ sang trọng, kèm túi giấy, khăn lau bạc chuyên dụng và <strong>thiệp chúc mừng viết tay miễn phí</strong>.</p>
      <div style="background: #FBF9F5; border: 1px solid #E5DEC9; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
        <h3 style="margin: 0 0 8px; color: var(--color-brand-primary);">Chưa biết chọn mẫu nào hợp gu người nhận?</h3>
        <p style="font-size: 13.5px; color: var(--color-text-secondary); margin: 0 0 14px;">Trả lời 3 câu hỏi trắc nghiệm nhanh để hệ thống gợi ý mẫu trang sức phù hợp nhất theo dịp tặng & ngân sách.</p>
        <button type="button" id="info-open-gift-quiz" class="btn" style="background: var(--color-accent-gold); border-color: var(--color-accent-gold); color: #143F3B; font-weight: 700;">
          🎁 MỞ TRỢ LÝ CHỌN QUÀ TẶNG (30 GIÂY)
        </button>
      </div>
      <h2>Gợi ý quà tặng theo ngân sách</h2>
      <ul>
        <li><a href="#/jewelry?price=under-200"><strong>Dưới 200.000₫</strong></a> — Bông tai nụ bạc 925, nhẫn mảnh tối giản, lắc tay xinh xắn.</li>
        <li><a href="#/jewelry?price=200-300"><strong>200.000₫ – 300.000₫</strong></a> — Dây chuyền Cỏ Ba Lá xà cừ, lắc tay đính đá CZ, bông tai ngọc trai.</li>
        <li><a href="#/jewelry?price=above-300"><strong>Trên 300.000₫</strong></a> — Nhẫn & dây chuyền đá Moissanite lấp lánh cao cấp.</li>
      </ul>
      ${contactBlock()}`,
  },
  'size-guide': {
    title: 'Hướng Dẫn Chọn Size Chuẩn Việt Nam',
    image: G(5),
    body: () => `
      <div style="background: #F4F9F8; border: 1px solid #C5DEDB; border-radius: 10px; padding: 20px; margin-bottom: 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;">
        <div>
          <h3 style="margin: 0 0 4px; color: var(--color-brand-primary);">Công cụ đo size tương tác trực tiếp</h3>
          <p style="margin: 0; font-size: 13px; color: var(--color-text-secondary);">Đặt nhẫn thật lên màn hình để đo đường kính hoặc xem mô phỏng dáng dây chuyền trên cổ.</p>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" id="info-open-ring-ruler" class="btn" style="background: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary); padding: 10px 16px; font-size: 12.5px;">
            📏 Đo Nhẫn Trên Màn Hình
          </button>
          <button type="button" id="info-open-necklace-viz" class="btn" style="background: #fff; color: var(--color-brand-primary); border-color: var(--color-brand-primary); padding: 10px 16px; font-size: 12.5px;">
            📿 Xem Dáng Dây Chuyền
          </button>
        </div>
      </div>
      <h2>Bảng quy đổi Size nhẫn chuẩn Việt Nam (Size 5 – Size 9)</h2>
      <p>Dùng một sợi chỉ hoặc mảnh giấy nhỏ quấn vừa khít quanh ngón tay, đánh dấu điểm giao nhau rồi đo chiều dài (chu vi) bằng thước kẻ:</p>
      <table>
        <tr><th>Size Nhẫn</th><th>Chu vi ngón tay (mm)</th><th>Đường kính lòng nhẫn (mm)</th><th>Gợi ý phổ biến</th></tr>
        <tr><td><strong>Size 5</strong></td><td>46 – 48 mm</td><td>14.7 – 15.3 mm</td><td>Ngón út hoặc tay nữ nhỏ mảnh</td></tr>
        <tr><td><strong>Size 6</strong></td><td>49 – 51 mm</td><td>15.6 – 16.2 mm</td><td>Size nữ phổ biến nhất (45–52kg)</td></tr>
        <tr><td><strong>Size 7</strong></td><td>52 – 54 mm</td><td>16.5 – 17.2 mm</td><td>Size nữ trung bình / ngón trỏ (52–58kg)</td></tr>
        <tr><td><strong>Size 8</strong></td><td>55 – 57 mm</td><td>17.5 – 18.1 mm</td><td>Ngón giữa / ngón trỏ hoặc tay đầy đặn</td></tr>
        <tr><td><strong>Size 9</strong></td><td>58 – 60 mm</td><td>18.5 – 19.0 mm</td><td>Cỡ tay lớn thoải mái</td></tr>
      </table>
      <h2>Lắc tay & Dây chuyền</h2>
      <p>Lắc tay bạc 925 tiêu chuẩn dài <strong>16cm + 3cm dây nối tăng đơ</strong> (vừa vặn mọi cổ tay từ 14–18.5cm). Dây chuyền tiêu chuẩn <strong>40–45cm</strong> tôn xương quai xanh.</p>
      <p>Hầu hết các mẫu nhẫn hở (Freesize) tại Phát Đạt Jewelry có thể nhẹ nhàng bóp/nới từ Size 5 đến Size 8.</p>
      ${contactBlock()}`,
  },
  warranty: {
    title: 'Chính Sách Bảo Hành Trọn Đời',
    image: G(6),
    body: () => `
      <ul>
        <li><strong>Làm sáng & đánh bóng miễn phí trọn đời:</strong> Bất cứ khi nào trang sức bị xỉn nhẹ do mồ hôi, quý khách mang đến cửa hàng sẽ được siêu âm làm sạch và đánh bóng miễn phí 100%.</li>
        <li><strong>Bảo hành gắn đáCZ tấm & hàn dây:</strong> Hỗ trợ miễn phí trong 12 tháng đầu sử dụng.</li>
        <li><strong>Xi mạ lại vàng 18K / Bạch kim:</strong> Hỗ trợ chi phí gốc ưu đãi dành riêng cho khách hàng Phát Đạt.</li>
      </ul>
      ${contactBlock()}`,
  },
  cookies: {
    title: 'Chính Sách Cookies',
    image: G(8),
    body: () => `
      <p>Website sử dụng cookies và bộ nhớ trình duyệt (localStorage) để ghi nhớ danh sách yêu thích, sản phẩm vừa xem và danh sách so sánh của bạn.</p>
      <p>Bạn có thể xóa hoặc chặn cookies trong phần cài đặt trình duyệt bất cứ lúc nào. Xem thêm tại <a href="#/legal/privacy-policy">Chính sách bảo mật</a>.</p>`,
  },
  accessibility: {
    title: 'Khả Năng Tiếp Cận',
    image: G(12),
    body: () => `
      <p>Phát Đạt Jewelry mong muốn mọi khách hàng đều có thể sử dụng website dễ dàng: giao diện tương thích di động, hình ảnh sắc nét có mô tả thay thế và hỗ trợ điều hướng bằng bàn phím.</p>
      <p>Nếu bạn cần tư vấn trực tiếp qua cuộc gọi hoặc video Zalo, hãy liên hệ Hotline <strong>${siteInfo.phoneDisplay}</strong>.</p>
      ${contactBlock()}`,
  },
};

export function renderInfo(container, params = {}) {
  const data = infoPages[params.slug];
  if (!data) {
    window.location.hash = '/404';
    return;
  }
  const page = document.createElement('div');
  page.className = 'page-info';
  page.innerHTML = `
    <section class="info-hero">
      <img src="${data.image}" alt="${data.title}">
      <h1>${data.title}</h1>
    </section>
    <article class="info-body">${data.body()}</article>
  `;

  const giftBtn = page.querySelector('#info-open-gift-quiz');
  if (giftBtn) giftBtn.addEventListener('click', () => openGiftFinderModal());

  const rulerBtn = page.querySelector('#info-open-ring-ruler');
  if (rulerBtn) rulerBtn.addEventListener('click', () => openGlobalSizeGuide('ruler'));

  const neckBtn = page.querySelector('#info-open-necklace-viz');
  if (neckBtn) neckBtn.addEventListener('click', () => openGlobalSizeGuide('necklace'));

  container.appendChild(page);
}

