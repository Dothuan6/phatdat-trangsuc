// ============================================================
// INFO PAGES — Giao hàng, Quà tặng, Hướng dẫn size, Cookies,
// Khả năng tiếp cận, Bảo hành
// ============================================================

import { siteInfo } from '../data/site-info.js';

const G = (n) => `./images/gallery/g${n}.jpg`;

const contactBlock = () => `
  <h2>Cần hỗ trợ thêm?</h2>
  <p>Gọi <a href="${siteInfo.phoneHref}"><strong>${siteInfo.phoneDisplay}</strong></a> (${siteInfo.hours.toLowerCase()})
  hoặc nhắn tin qua <a href="${siteInfo.facebook}" target="_blank" rel="noopener">Facebook ${siteInfo.facebookName}</a> /
  <a href="${siteInfo.instagram}" target="_blank" rel="noopener">Instagram ${siteInfo.instagramName}</a>.</p>
`;

export const infoPages = {
  shipping: {
    title: 'Giao Hàng & Đổi Trả',
    image: G(4),
    body: () => `
      <h2>Giao hàng</h2>
      <ul>
        <li>Miễn phí giao hàng toàn quốc cho mọi đơn hàng.</li>
        <li>Nội thành TP. Hồ Chí Minh: 1–2 ngày. Tỉnh thành khác: 2–5 ngày.</li>
        <li>Được kiểm tra hàng trước khi thanh toán (COD).</li>
      </ul>
      <h2>Đổi trả</h2>
      <ul>
        <li>Đổi size / đổi mẫu miễn phí trong vòng 7 ngày kể từ khi nhận hàng.</li>
        <li>Sản phẩm còn nguyên tem, hộp và chưa qua sử dụng.</li>
        <li>Hoàn tiền 100% nếu sản phẩm lỗi do nhà sản xuất.</li>
      </ul>
      ${contactBlock()}`,
  },
  gifting: {
    title: 'Nghệ Thuật Quà Tặng',
    image: G(2),
    body: () => `
      <p>Mỗi sản phẩm Phát Đạt Jewelry đều được đóng gói trong hộp quà sang trọng, kèm túi giấy và thiệp viết tay miễn phí.</p>
      <h2>Gợi ý quà tặng theo ngân sách</h2>
      <ul>
        <li><a href="#/jewelry">Dưới 200.000₫</a> — lắc tay, mặt dây chuyền nhỏ xinh.</li>
        <li><a href="#/jewelry">200.000₫ – 300.000₫</a> — nhẫn, bông tai đính đá.</li>
        <li><a href="#/jewelry">300.000₫ – 399.000₫</a> — dây chuyền dài, nhẫn Moissanite.</li>
      </ul>
      ${contactBlock()}`,
  },
  'size-guide': {
    title: 'Hướng Dẫn Chọn Size',
    image: G(5),
    body: () => `
      <h2>Size nhẫn</h2>
      <p>Dùng một sợi chỉ quấn quanh ngón tay, đánh dấu và đo chiều dài (chu vi) rồi đối chiếu bảng dưới đây:</p>
      <table>
        <tr><th>Chu vi (mm)</th><th>Size</th></tr>
        <tr><td>46</td><td>6</td></tr><tr><td>48</td><td>8</td></tr>
        <tr><td>50</td><td>10</td></tr><tr><td>52</td><td>12</td></tr>
        <tr><td>54</td><td>14</td></tr><tr><td>56</td><td>16</td></tr>
      </table>
      <h2>Lắc tay & dây chuyền</h2>
      <p>Lắc tay tiêu chuẩn 16–19 cm (có khoen điều chỉnh). Dây chuyền 40–45 cm, dây dài khoảng 80 cm.</p>
      <p>Phần lớn nhẫn tại Phát Đạt Jewelry có thể điều chỉnh size.</p>
      ${contactBlock()}`,
  },
  warranty: {
    title: 'Chính Sách Bảo Hành',
    image: G(6),
    body: () => `
      <ul>
        <li>Bảo hành gắn đá, hàn dây miễn phí trọn đời.</li>
        <li>Làm sáng, đánh bóng sản phẩm miễn phí trong 12 tháng.</li>
        <li>Xi mạ lại với chi phí ưu đãi.</li>
      </ul>
      ${contactBlock()}`,
  },
  cookies: {
    title: 'Chính Sách Cookies',
    image: G(8),
    body: () => `
      <p>Website sử dụng cookies và bộ nhớ trình duyệt (localStorage) để ghi nhớ danh sách yêu thích của bạn và cải thiện trải nghiệm.</p>
      <p>Bạn có thể xóa hoặc chặn cookies trong phần cài đặt trình duyệt bất cứ lúc nào. Xem thêm tại <a href="#/legal/privacy-policy">Chính sách bảo mật</a>.</p>`,
  },
  accessibility: {
    title: 'Khả Năng Tiếp Cận',
    image: G(12),
    body: () => `
      <p>Phát Đạt Jewelry mong muốn mọi khách hàng đều có thể sử dụng website dễ dàng: giao diện tương thích di động, hình ảnh có mô tả thay thế và hỗ trợ điều hướng bằng bàn phím.</p>
      <p>Nếu bạn gặp khó khăn khi truy cập, hãy liên hệ để được hỗ trợ đặt hàng trực tiếp.</p>
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
  container.appendChild(page);
}
