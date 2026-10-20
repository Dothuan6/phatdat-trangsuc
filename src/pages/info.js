// ============================================================
// INFO PAGES — Giao hàng, Quà tặng, Hướng dẫn size, Cookies,
// Khả năng tiếp cận, Bảo hành
// ============================================================

import { siteInfo } from '../data/site-info.js';
import {
  openGiftFinderModal,
  openFengShuiMatcherModal,
  openWarrantyLookupModal,
  openCoupleBuilderModal,
  openFaceHandStylingModal,
  openAnniversaryReminderModal
} from '../components/feedback-modal.js';
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
      <h2>4. Bàn Soi So Sánh Đá Quý & Chất Liệu Bạc S925 (Tương Tác)</h2>
      <div id="info-gem-explorer" style="background: #F8FAF9; border: 1px solid #C5DEDB; border-radius: 12px; padding: 18px; margin: 16px 0 24px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 10px;">
          💎 Bấm chọn loại đá hoặc lớp xi mạ để xem thông số quang học & độ bền:
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
          <button type="button" class="gem-exp-btn is-active" data-gem="moissanite" style="padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; font-size: 12.5px; font-weight: 700; cursor: pointer;">✨ Đá Moissanite Cao Cấp</button>
          <button type="button" class="gem-exp-btn" data-gem="cz" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">💎 Đá CZ (Cubic Zirconia 5A)</button>
          <button type="button" class="gem-exp-btn" data-gem="mop" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🐚 Xà Cừ & Ngọc Trai Tự Nhiên</button>
          <button type="button" class="gem-exp-btn" data-gem="s925" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🛡️ Bạc Ý S925 Xi Bạch Kim / Vàng 18K</button>
        </div>
        <div id="gem-exp-detail" style="background: #ffffff; border: 1px solid var(--color-border-light); border-radius: 10px; padding: 16px;">
          <div style="font-size: 15px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">✨ Đá Moissanite — Độ Lửa Rực Rỡ Vượt Kim Cương</div>
          <div style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.6;">
            • <strong>Độ cứng Mohs:</strong> 9.25 / 10 (Chống trầy xước cực cao, bền bỉ trọn đời)<br>
            • <strong>Chiết suất ánh sáng (Brilliance):</strong> 2.65 – 2.69 (Tán sắc cầu vồng rực rỡ dưới ánh đèn tiệc & nắng tự nhiên)<br>
            • <strong>Phù hợp nhất:</strong> Nhẫn cầu hôn, nhẫn dự tiệc, mặt dây chuyền Solitaire sang trọng.
          </div>
        </div>
      </div>
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
        <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          <button type="button" id="info-open-gift-quiz" class="btn" style="background: var(--color-accent-gold); border-color: var(--color-accent-gold); color: #143F3B; font-weight: 700;">
            🎁 MỞ TRỢ LÝ CHỌN QUÀ TẶNG (30 GIÂY)
          </button>
          <button type="button" id="info-open-fengshui" class="btn" style="background: #fff; border-color: var(--color-brand-primary); color: var(--color-brand-primary); font-weight: 700;">
            🔮 CHỌN ĐÁ PHONG THỦY HỢP MỆNH
          </button>
        </div>
      </div>
      <h2>Gợi ý quà tặng theo ngân sách</h2>
      <ul>
        <li><a href="#/jewelry?price=under-200"><strong>Dưới 200.000₫</strong></a> — Bông tai nụ bạc 925, nhẫn mảnh tối giản, lắc tay xinh xắn.</li>
        <li><a href="#/jewelry?price=200-300"><strong>200.000₫ – 300.000₫</strong></a> — Dây chuyền Cỏ Ba Lá xà cừ, lắc tay đính đá CZ, bông tai ngọc trai.</li>
        <li><a href="#/jewelry?price=above-300"><strong>Trên 300.000₫</strong></a> — Nhẫn & dây chuyền đá Moissanite lấp lánh cao cấp.</li>
      </ul>
      <h2>4. Bàn Soi So Sánh Đá Quý & Chất Liệu Bạc S925 (Tương Tác)</h2>
      <div id="info-gem-explorer" style="background: #F8FAF9; border: 1px solid #C5DEDB; border-radius: 12px; padding: 18px; margin: 16px 0 24px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 10px;">
          💎 Bấm chọn loại đá hoặc lớp xi mạ để xem thông số quang học & độ bền:
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
          <button type="button" class="gem-exp-btn is-active" data-gem="moissanite" style="padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; font-size: 12.5px; font-weight: 700; cursor: pointer;">✨ Đá Moissanite Cao Cấp</button>
          <button type="button" class="gem-exp-btn" data-gem="cz" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">💎 Đá CZ (Cubic Zirconia 5A)</button>
          <button type="button" class="gem-exp-btn" data-gem="mop" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🐚 Xà Cừ & Ngọc Trai Tự Nhiên</button>
          <button type="button" class="gem-exp-btn" data-gem="s925" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🛡️ Bạc Ý S925 Xi Bạch Kim / Vàng 18K</button>
        </div>
        <div id="gem-exp-detail" style="background: #ffffff; border: 1px solid var(--color-border-light); border-radius: 10px; padding: 16px;">
          <div style="font-size: 15px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">✨ Đá Moissanite — Độ Lửa Rực Rỡ Vượt Kim Cương</div>
          <div style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.6;">
            • <strong>Độ cứng Mohs:</strong> 9.25 / 10 (Chống trầy xước cực cao, bền bỉ trọn đời)<br>
            • <strong>Chiết suất ánh sáng (Brilliance):</strong> 2.65 – 2.69 (Tán sắc cầu vồng rực rỡ dưới ánh đèn tiệc & nắng tự nhiên)<br>
            • <strong>Phù hợp nhất:</strong> Nhẫn cầu hôn, nhẫn dự tiệc, mặt dây chuyền Solitaire sang trọng.
          </div>
        </div>
      </div>
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
      <h2>4. Bàn Soi So Sánh Đá Quý & Chất Liệu Bạc S925 (Tương Tác)</h2>
      <div id="info-gem-explorer" style="background: #F8FAF9; border: 1px solid #C5DEDB; border-radius: 12px; padding: 18px; margin: 16px 0 24px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 10px;">
          💎 Bấm chọn loại đá hoặc lớp xi mạ để xem thông số quang học & độ bền:
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
          <button type="button" class="gem-exp-btn is-active" data-gem="moissanite" style="padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; font-size: 12.5px; font-weight: 700; cursor: pointer;">✨ Đá Moissanite Cao Cấp</button>
          <button type="button" class="gem-exp-btn" data-gem="cz" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">💎 Đá CZ (Cubic Zirconia 5A)</button>
          <button type="button" class="gem-exp-btn" data-gem="mop" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🐚 Xà Cừ & Ngọc Trai Tự Nhiên</button>
          <button type="button" class="gem-exp-btn" data-gem="s925" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🛡️ Bạc Ý S925 Xi Bạch Kim / Vàng 18K</button>
        </div>
        <div id="gem-exp-detail" style="background: #ffffff; border: 1px solid var(--color-border-light); border-radius: 10px; padding: 16px;">
          <div style="font-size: 15px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">✨ Đá Moissanite — Độ Lửa Rực Rỡ Vượt Kim Cương</div>
          <div style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.6;">
            • <strong>Độ cứng Mohs:</strong> 9.25 / 10 (Chống trầy xước cực cao, bền bỉ trọn đời)<br>
            • <strong>Chiết suất ánh sáng (Brilliance):</strong> 2.65 – 2.69 (Tán sắc cầu vồng rực rỡ dưới ánh đèn tiệc & nắng tự nhiên)<br>
            • <strong>Phù hợp nhất:</strong> Nhẫn cầu hôn, nhẫn dự tiệc, mặt dây chuyền Solitaire sang trọng.
          </div>
        </div>
      </div>
      ${contactBlock()}`,
  },
  warranty: {
    title: 'Chính Sách Bảo Hành Trọn Đời',
    image: G(6),
    body: () => `
      <div style="background: linear-gradient(135deg, #143F3B 0%, #1E5D57 100%); color: #fff; border-radius: 12px; padding: 22px; margin-bottom: 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
        <div>
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #F3D184; font-weight: 700;">Đặc quyền khách hàng Phát Đạt</span>
          <h3 style="margin: 4px 0 6px; color: #fff; font-family: var(--font-display); font-size: 1.4rem;">Tra Cứu Thẻ Bảo Hành Điện Tử</h3>
          <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.85);">Không cần giữ hóa đơn giấy — chỉ cần nhập Số điện thoại để kích hoạt & kiểm tra quyền lợi làm sáng bạc miễn phí trọn đời.</p>
        </div>
        <button type="button" id="info-open-warranty-lookup" class="btn" style="background: var(--color-accent-gold); border-color: var(--color-accent-gold); color: #143F3B; font-weight: 700; white-space: nowrap;">
          🛡️ TRA CỨU THẺ BẢO HÀNH NGAY
        </button>
      </div>
      <ul>
        <li><strong>Làm sáng & đánh bóng miễn phí trọn đời:</strong> Bất cứ khi nào trang sức bị xỉn nhẹ do mồ hôi, quý khách mang đến cửa hàng sẽ được siêu âm làm sạch và đánh bóng miễn phí 100%.</li>
        <li><strong>Bảo hành gắn đá CZ tấm & hàn dây:</strong> Hỗ trợ miễn phí trong 12 tháng đầu sử dụng.</li>
        <li><strong>Xi mạ lại vàng 18K / Bạch kim:</strong> Hỗ trợ chi phí gốc ưu đãi dành riêng cho khách hàng Phát Đạt.</li>
      </ul>
      <h2>4. Bàn Soi So Sánh Đá Quý & Chất Liệu Bạc S925 (Tương Tác)</h2>
      <div id="info-gem-explorer" style="background: #F8FAF9; border: 1px solid #C5DEDB; border-radius: 12px; padding: 18px; margin: 16px 0 24px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 10px;">
          💎 Bấm chọn loại đá hoặc lớp xi mạ để xem thông số quang học & độ bền:
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
          <button type="button" class="gem-exp-btn is-active" data-gem="moissanite" style="padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; font-size: 12.5px; font-weight: 700; cursor: pointer;">✨ Đá Moissanite Cao Cấp</button>
          <button type="button" class="gem-exp-btn" data-gem="cz" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">💎 Đá CZ (Cubic Zirconia 5A)</button>
          <button type="button" class="gem-exp-btn" data-gem="mop" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🐚 Xà Cừ & Ngọc Trai Tự Nhiên</button>
          <button type="button" class="gem-exp-btn" data-gem="s925" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🛡️ Bạc Ý S925 Xi Bạch Kim / Vàng 18K</button>
        </div>
        <div id="gem-exp-detail" style="background: #ffffff; border: 1px solid var(--color-border-light); border-radius: 10px; padding: 16px;">
          <div style="font-size: 15px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">✨ Đá Moissanite — Độ Lửa Rực Rỡ Vượt Kim Cương</div>
          <div style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.6;">
            • <strong>Độ cứng Mohs:</strong> 9.25 / 10 (Chống trầy xước cực cao, bền bỉ trọn đời)<br>
            • <strong>Chiết suất ánh sáng (Brilliance):</strong> 2.65 – 2.69 (Tán sắc cầu vồng rực rỡ dưới ánh đèn tiệc & nắng tự nhiên)<br>
            • <strong>Phù hợp nhất:</strong> Nhẫn cầu hôn, nhẫn dự tiệc, mặt dây chuyền Solitaire sang trọng.
          </div>
        </div>
      </div>
      ${contactBlock()}`,
  },
  'style-guide': {
    title: 'Cẩm Nang Phối Đồ & Bảo Quản Bạc S925',
    image: G(11),
    body: () => `
      <p>Trang sức Bạc Ý S925 không chỉ là điểm nhấn thanh lịch cho trang phục thường ngày mà còn tôn lên thần thái riêng biệt của mỗi quý cô. Cùng Phát Đạt Jewelry khám phá bí quyết phối trang sức chuẩn Stylist và cách giữ bạc luôn sáng bóng như mới.</p>

      <div style="background: #FBF9F5; border: 1px solid #E5DEC9; border-radius: 10px; padding: 18px 20px; margin: 20px 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;">
        <div>
          <h3 style="margin: 0 0 4px; color: var(--color-brand-primary); font-size: 1.05rem;">🔮 Bạn muốn chọn màu đá hợp phong thủy & bản mệnh?</h3>
          <p style="margin: 0; font-size: 13px; color: var(--color-text-secondary);">Khám phá gợi ý trang sức theo Ngũ Hành (Kim – Mộc – Thủy – Hỏa – Thổ) thu hút may mắn & bình an.</p>
        </div>
        <button type="button" id="info-open-fengshui" class="btn" style="background: var(--color-brand-primary); color: #fff; border-color: var(--color-brand-primary); font-size: 12.5px; padding: 10px 16px;">
          🔮 Mở Cố Vấn Hợp Mệnh
        </button>
      </div>

      <h2>1. Bí quyết chọn Dây Chuyền theo dáng cổ áo</h2>
      <table>
        <tr><th>Kiểu trang phục / Cổ áo</th><th>Độ dài dây lý tưởng</th><th>Thiết kế mặt dây gợi ý</th></tr>
        <tr><td><strong>Áo sơ mi mở cúc / Cổ chữ V</strong></td><td>40cm – 42cm (Chạm xương quai xanh)</td><td>Mặt Cỏ Ba Lá, giọt nước hoặc đá Solitaire đơn giản</td></tr>
        <tr><td><strong>Đầm trễ vai / Đầm dự tiệc</strong></td><td>38cm – 40cm (Ôm sát thanh thoát)</td><td>Đá Moissanite bắt sáng hoặc dây đính ngọc trai</td></tr>
        <tr><td><strong>Áo cổ lọ / Áo thun tròn kín cổ</strong></td><td>45cm – 50cm (Dáng dài/Layering)</td><td>Phối 2 tầng dây mảnh tạo hiệu ứng thon gọn</td></tr>
      </table>

      <h2>2. Chọn Bông Tai tôn đường nét khuôn mặt</h2>
      <ul>
        <li><strong>Khuôn mặt tròn bầu bĩnh:</strong> Ưu tiên bông tai dáng dài, giọt nước hoặc tua rua mảnh để tạo cảm giác khuôn mặt thanh thoát hơn.</li>
        <li><strong>Khuôn mặt trái xoan (Oval):</strong> Phù hợp với mọi kiểu bông tai, đặc biệt tỏa sáng với bông tai nụ đá CZ, Cỏ Ba Lá hoặc ngọc trai.</li>
        <li><strong>Khuôn mặt góc cạnh / vuông:</strong> Chọn bông tai dáng tròn (Hoop), đường cong mềm mại hoặc họa tiết hoa để làm dịu đường nét.</li>
      </ul>

      <h2>3. Quy tắc 3 bước giữ Bạc S925 sáng bóng tại nhà</h2>
      <ul>
        <li><strong>Bước 1 — Hạn chế tiếp xúc hóa chất:</strong> Nên đeo trang sức sau cùng khi đã xịt nước hoa, keo xịt tóc hoặc thoa kem dưỡng da.</li>
        <li><strong>Bước 2 — Lau nhẹ bằng khăn chuyên dụng:</strong> Sau khi đeo cả ngày, dùng khăn lau bạc (được Phát Đạt tặng kèm miễn phí) lau nhẹ mồ hôi trước khi cất vào hộp.</li>
        <li><strong>Bước 3 — Làm sáng nhanh trong 2 phút:</strong> Nếu bạc bị xỉn nhẹ do lưu huỳnh trong mồ hôi, bạn có thể dùng một chút kem đánh răng và bàn chải mềm chà nhẹ dưới nước ấm, hoặc mang trực tiếp đến cửa hàng Phát Đạt để được đánh bóng siêu âm miễn phí trọn đời!</li>
      </ul>
      <h2>4. Bàn Soi So Sánh Đá Quý & Chất Liệu Bạc S925 (Tương Tác)</h2>
      <div id="info-gem-explorer" style="background: #F8FAF9; border: 1px solid #C5DEDB; border-radius: 12px; padding: 18px; margin: 16px 0 24px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 10px;">
          💎 Bấm chọn loại đá hoặc lớp xi mạ để xem thông số quang học & độ bền:
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
          <button type="button" class="gem-exp-btn is-active" data-gem="moissanite" style="padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; font-size: 12.5px; font-weight: 700; cursor: pointer;">✨ Đá Moissanite Cao Cấp</button>
          <button type="button" class="gem-exp-btn" data-gem="cz" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">💎 Đá CZ (Cubic Zirconia 5A)</button>
          <button type="button" class="gem-exp-btn" data-gem="mop" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🐚 Xà Cừ & Ngọc Trai Tự Nhiên</button>
          <button type="button" class="gem-exp-btn" data-gem="s925" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🛡️ Bạc Ý S925 Xi Bạch Kim / Vàng 18K</button>
        </div>
        <div id="gem-exp-detail" style="background: #ffffff; border: 1px solid var(--color-border-light); border-radius: 10px; padding: 16px;">
          <div style="font-size: 15px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">✨ Đá Moissanite — Độ Lửa Rực Rỡ Vượt Kim Cương</div>
          <div style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.6;">
            • <strong>Độ cứng Mohs:</strong> 9.25 / 10 (Chống trầy xước cực cao, bền bỉ trọn đời)<br>
            • <strong>Chiết suất ánh sáng (Brilliance):</strong> 2.65 – 2.69 (Tán sắc cầu vồng rực rỡ dưới ánh đèn tiệc & nắng tự nhiên)<br>
            • <strong>Phù hợp nhất:</strong> Nhẫn cầu hôn, nhẫn dự tiệc, mặt dây chuyền Solitaire sang trọng.
          </div>
        </div>
      </div>
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
      <h2>4. Bàn Soi So Sánh Đá Quý & Chất Liệu Bạc S925 (Tương Tác)</h2>
      <div id="info-gem-explorer" style="background: #F8FAF9; border: 1px solid #C5DEDB; border-radius: 12px; padding: 18px; margin: 16px 0 24px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 10px;">
          💎 Bấm chọn loại đá hoặc lớp xi mạ để xem thông số quang học & độ bền:
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
          <button type="button" class="gem-exp-btn is-active" data-gem="moissanite" style="padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--color-brand-primary); background: var(--color-brand-primary); color: #fff; font-size: 12.5px; font-weight: 700; cursor: pointer;">✨ Đá Moissanite Cao Cấp</button>
          <button type="button" class="gem-exp-btn" data-gem="cz" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">💎 Đá CZ (Cubic Zirconia 5A)</button>
          <button type="button" class="gem-exp-btn" data-gem="mop" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🐚 Xà Cừ & Ngọc Trai Tự Nhiên</button>
          <button type="button" class="gem-exp-btn" data-gem="s925" style="padding: 7px 14px; border-radius: 20px; border: 1px solid var(--color-border); background: #fff; color: var(--color-text-primary); font-size: 12.5px; font-weight: 600; cursor: pointer;">🛡️ Bạc Ý S925 Xi Bạch Kim / Vàng 18K</button>
        </div>
        <div id="gem-exp-detail" style="background: #ffffff; border: 1px solid var(--color-border-light); border-radius: 10px; padding: 16px;">
          <div style="font-size: 15px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">✨ Đá Moissanite — Độ Lửa Rực Rỡ Vượt Kim Cương</div>
          <div style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.6;">
            • <strong>Độ cứng Mohs:</strong> 9.25 / 10 (Chống trầy xước cực cao, bền bỉ trọn đời)<br>
            • <strong>Chiết suất ánh sáng (Brilliance):</strong> 2.65 – 2.69 (Tán sắc cầu vồng rực rỡ dưới ánh đèn tiệc & nắng tự nhiên)<br>
            • <strong>Phù hợp nhất:</strong> Nhẫn cầu hôn, nhẫn dự tiệc, mặt dây chuyền Solitaire sang trọng.
          </div>
        </div>
      </div>
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

  const fengshuiBtn = page.querySelector('#info-open-fengshui');
  if (fengshuiBtn) fengshuiBtn.addEventListener('click', () => openFengShuiMatcherModal());

  const warrantyBtn = page.querySelector('#info-open-warranty-lookup');
  if (warrantyBtn) warrantyBtn.addEventListener('click', () => openWarrantyLookupModal());

  const rulerBtn = page.querySelector('#info-open-ring-ruler');
  if (rulerBtn) rulerBtn.addEventListener('click', () => openGlobalSizeGuide('ruler'));

  const neckBtn = page.querySelector('#info-open-necklace-viz');
  if (neckBtn) neckBtn.addEventListener('click', () => openGlobalSizeGuide('necklace'));

  // Interactive Gemstone Explorer handler (Vòng 8)
  const gemSpecs = {
    moissanite: {
      title: '✨ Đá Moissanite — Độ Lửa Rực Rỡ Vượt Kim Cương',
      html: '• <strong>Độ cứng Mohs:</strong> 9.25 / 10 (Chống trầy xước cực cao, bền bỉ trọn đời)<br>• <strong>Chiết suất ánh sáng (Brilliance):</strong> 2.65 – 2.69 (Tán sắc cầu vồng rực rỡ dưới ánh đèn tiệc & nắng tự nhiên)<br>• <strong>Phù hợp nhất:</strong> Nhẫn cầu hôn, nhẫn dự tiệc, mặt dây chuyền Solitaire sang trọng.'
    },
    cz: {
      title: '💎 Đá Cubic Zirconia Chuẩn 5A — Trong Suốt & Thanh Lịch',
      html: '• <strong>Độ cứng Mohs:</strong> 8.5 / 10 (Giữ giác cắt sắc nét trong sinh hoạt hằng ngày)<br>• <strong>Chiết suất ánh sáng:</strong> 2.15 – 2.18 (Độ trong suốt tinh khiết, bắt sáng dịu mắt)<br>• <strong>Phù hợp nhất:</strong> Bông tai đính đá tấm, dây chuyền đeo đi làm hằng ngày, lắc tay nữ tính.'
    },
    mop: {
      title: '🐚 Xà Cừ Thiên Nhiên & Ngọc Trai — Ánh Xà Cừ Độc Bản',
      html: '• <strong>Đặc tính tự nhiên:</strong> Mỗi mặt xà cừ có vân ánh hồng - trắng ngà độc nhất vô nhị, dịu nhẹ với làn da<br>• <strong>Ý nghĩa phong thủy:</strong> Biểu tượng của sự bình an, may mắn và vẻ đẹp quý phái vượt thời gian<br>• <strong>Lưu ý bảo quản:</strong> Tránh ngâm nước nóng hoặc hóa chất tẩy rửa mạnh để giữ lớp xà cừ bóng mịn.'
    },
    s925: {
      title: '🛡️ Bạc Chuẩn S925 Phủ Xi Bạch Kim Rhodium / Vàng 18K',
      html: '• <strong>Thành phần chuẩn quốc tế:</strong> 92.5% Bạc nguyên chất kết hợp 7.5% hợp kim quý giúp khung trang sức cứng cáp, giữ chấu đá chắc chắn<br>• <strong>An toàn cho da:</strong> 100% Không chứa Niken (Nickel-free), không gây ngứa hay kích ứng da nhạy cảm<br>• <strong>Đặc quyền Phát Đạt:</strong> Bảo hành đánh bóng & làm sáng siêu âm miễn phí trọn đời tại cửa hàng.'
    }
  };

  const gemDetail = page.querySelector('#gem-exp-detail');
  page.querySelectorAll('.gem-exp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const spec = gemSpecs[btn.dataset.gem];
      if (!spec || !gemDetail) return;
      page.querySelectorAll('.gem-exp-btn').forEach(b => {
        b.style.background = '#fff';
        b.style.color = 'var(--color-text-primary)';
        b.style.borderColor = 'var(--color-border)';
      });
      btn.style.background = 'var(--color-brand-primary)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--color-brand-primary)';
      gemDetail.innerHTML = `
        <div style="font-size: 15px; font-weight: 700; color: var(--color-brand-primary); margin-bottom: 6px;">${spec.title}</div>
        <div style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.6;">${spec.html}</div>
      `;
    });
  });

  container.appendChild(page);
}

