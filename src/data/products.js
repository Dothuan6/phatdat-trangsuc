// ============================================================
// PRODUCT DATA — Danh mục sản phẩm Phát Đạt Jewelry
// ============================================================

const P = './images/products/';
const G = (n) => `./images/gallery/g${n}.jpg`;

function make(id, name, collection, category, materials, stones, price, images, description, specs, variationCount = 0) {
  return {
    id, name, collection, category, materials, stones,
    reference: 'PD' + id.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase(),
    price, currency: '₫', images, variants: [], description,
    specifications: { 'Chất liệu': materials, ...(stones ? { 'Đá': stones } : {}), ...specs },
    variationCount,
  };
}

export const products = [
  make('day-chuyen-co-ba-la', 'Dây chuyền cỏ ba lá', 'Cỏ Ba Lá', 'necklaces', 'Bạc 925 xi vàng', 'Xà cừ', 289000,
    [P + 'daychuyen3-removebg-preview.png', G(15), G(16)],
    'Mặt cỏ ba lá xà cừ biểu tượng của may mắn, phù hợp đeo hằng ngày hoặc làm quà tặng.',
    { 'Kích thước mặt': 'Khoảng 15 mm', 'Độ dài dây': 'Khoảng 42 cm' }),
  make('nhan-co-ba-la', 'Nhẫn cỏ ba lá', 'Cỏ Ba Lá', 'rings', 'Bạc 925 xi vàng', 'Đá CZ, Xà cừ', 249000,
    [P + '4-removebg-preview.png', G(1), G(2)],
    'Nhẫn cỏ ba lá tinh tế với viên đá CZ lấp lánh ở trung tâm.',
    { 'Size': 'Điều chỉnh được' }, 2),
  make('lac-tay-co-ba-la-5', 'Lắc tay cỏ ba lá 5 họa tiết', 'Cỏ Ba Lá', 'bracelets', 'Bạc 925 xi vàng', 'Xà cừ', 359000,
    [P + '4-removebg-preview.png', G(20), G(21)],
    'Năm họa tiết cỏ ba lá điểm xuyết trên chiếc lắc tay mảnh mai, nữ tính.',
    { 'Số họa tiết': '5', 'Độ dài': '16–19 cm' }, 3),
  make('day-chuyen-dai-co-ba-la', 'Dây chuyền dài cỏ ba lá', 'Cỏ Ba Lá', 'necklaces', 'Bạc 925 xi vàng', 'Xà cừ', 399000,
    [P + 'daychuyen3.2-removebg-preview.png', G(17), G(18)],
    'Dây chuyền dài nhiều họa tiết, có thể quấn đôi để tạo phong cách khác biệt.',
    { 'Độ dài dây': 'Khoảng 80 cm' }, 2),
  make('mat-day-chuyen-trai-tim', 'Mặt dây chuyền trái tim', 'Ngọt Ngào', 'necklaces', 'Bạc 925', 'Đá CZ', 199000,
    [P + 'Daychuyen4.3-removebg-preview.png', G(19), G(15)],
    'Mặt trái tim nhỏ xinh đính đá CZ, món quà ý nghĩa cho người thương.',
    { 'Độ dài dây': 'Khoảng 45 cm' }),
  make('day-chuyen-6-hoa-tiet', 'Dây chuyền 6 họa tiết', 'Cỏ Ba Lá', 'necklaces', 'Bạc 925 xi vàng', 'Xà cừ', 349000,
    [P + 'daychuyen5.1-removebg-preview.png', G(16), G(17)],
    'Sáu họa tiết với kích thước khác nhau tạo nên bố cục hài hòa, vui tươi.',
    { 'Số họa tiết': '6' }, 1),
  make('lac-tay-hat-vang', 'Lắc tay hạt tròn', 'Hạt Ngọc', 'bracelets', 'Bạc 925 xi vàng', '', 229000,
    [P + '6-removebg-preview.png', G(22), G(23)],
    'Những hạt tròn bóng gương xếp liền mạch, tôn lên vẻ thanh lịch cổ tay.',
    { 'Hoàn thiện': 'Đánh bóng gương' }),
  make('lac-tay-co-ngot-ngao', 'Lắc tay cỏ ngọt ngào', 'Hạt Ngọc', 'bracelets', 'Bạc 925 xi vàng hồng', 'Đá CZ', 269000,
    [P + '4-removebg-preview.png', G(24), G(20)],
    'Hàng hạt tròn bao quanh họa tiết cỏ đính đá CZ sáng lấp lánh.',
    {}),
  make('mat-day-chuyen-hoa', 'Mặt dây chuyền hoa', 'Hoa Xinh', 'necklaces', 'Bạc 925 xi vàng', 'Đá CZ', 179000,
    [P + 'daychuyen3-removebg-preview.png', G(18), G(19)],
    'Bông hoa nhỏ nhắn với viên đá CZ ở nhụy, nhẹ nhàng và nữ tính.',
    {}),
  make('bong-tai-2-bong-hoa', 'Bông tai 2 bông hoa', 'Hoa Xinh', 'earrings', 'Bạc 925 xi vàng', 'Đá CZ', 219000,
    [P + 'bongtay1.1-removebg-preview.png', G(10), G(11)],
    'Đôi bông tai hai bông hoa thanh lịch, phù hợp mọi dịp.',
    { 'Kiểu khóa': 'Chốt đẩy' }),
  make('bong-tai-co-ba-la', 'Bông tai cỏ ba lá', 'Cỏ Ba Lá', 'earrings', 'Bạc 925 xi vàng', 'Đá Onyx', 239000,
    [P + 'bongtay2-removebg-preview.png', G(12), G(13)],
    'Bông tai cỏ ba lá đá onyx đen sang trọng, cá tính.',
    {}, 2),
  make('day-chuyen-3-bong-hoa', 'Dây chuyền 3 bông hoa', 'Hoa Xinh', 'necklaces', 'Bạc 925', 'Đá CZ', 329000,
    [P + 'daychuyen3.2-removebg-preview.png', G(15), G(19)],
    'Ba bông hoa đính kín đá CZ, rực rỡ dưới mọi ánh sáng.',
    {}),
  make('nhan-hoa-flora', 'Nhẫn hoa Flora', 'Hoa Xinh', 'rings', 'Bạc 925 xi vàng', 'Đá CZ', 259000,
    [P + '6-removebg-preview.png', G(3), G(4)],
    'Lấy cảm hứng từ thiên nhiên, chiếc nhẫn nở rộ với những viên đá lấp lánh.',
    { 'Size': 'Điều chỉnh được' }),
  make('nhan-hat-3-hang', 'Nhẫn hạt tròn 3 hàng', 'Hạt Ngọc', 'rings', 'Bạc 925 xi vàng', '', 189000,
    [P + '4-removebg-preview.png', G(5), G(6)],
    'Ba hàng hạt tròn tạo nên chiếc nhẫn biểu tượng, dễ phối đồ.',
    {}),
  make('mat-day-chuyen-buom', 'Mặt dây chuyền đôi bướm', 'Cánh Bướm', 'necklaces', 'Bạc 925 xi vàng', 'Đá CZ, Ngọc lam', 299000,
    [P + 'Daychuyen4.3-removebg-preview.png', G(16), G(18)],
    'Đôi bướm tung bay với ngọc lam và đá CZ, biểu tượng của tự do.',
    {}),
  make('bong-tai-cosmos', 'Bông tai Cosmos', 'Cosmos', 'earrings', 'Bạc 925', 'Đá CZ', 279000,
    [P + 'bongtay3-removebg-preview.png', G(14), G(10)],
    'Vẻ đẹp cuốn hút của bông hoa xoay tròn được tái hiện tinh tế.',
    {}),
  make('lac-tay-co-ba-la-10', 'Lắc tay cỏ ba lá 10 họa tiết', 'Cỏ Ba Lá', 'bracelets', 'Bạc 925 xi vàng', 'Đá Carnelian', 389000,
    [P + '6-removebg-preview.png', G(21), G(22)],
    'Mười họa tiết cỏ ba lá đá đỏ carnelian nổi bật, sang trọng.',
    { 'Số họa tiết': '10' }, 1),
  make('lac-tay-ngot-ngao', 'Lắc tay ngọt ngào', 'Ngọt Ngào', 'bracelets', 'Bạc 925', 'Xà cừ', 129000,
    [P + '4-removebg-preview.png', G(23), G(24)],
    'Chiếc lắc mảnh mai với họa tiết nhỏ xinh, đeo hằng ngày.',
    {}),
  make('nhan-kim-cuong-nhan-tao', 'Nhẫn đá Moissanite ổ hoa', 'Ánh Sao', 'rings', 'Bạc 925 xi bạch kim', 'Moissanite', 399000,
    [G(1), G(7), G(8)],
    'Viên Moissanite lớn được bao quanh bởi vòng đá nhỏ, rực rỡ như ánh sao.',
    { 'Size': 'Điều chỉnh được' }),
  make('day-chuyen-ganh-to', 'Dây chuyền gành tô đá đơn', 'Ánh Sao', 'necklaces', 'Bạc 925', 'Đá CZ', 159000,
    [G(15), G(17), G(19)],
    'Dây gành tô lấp lánh kèm mặt đá đơn 6 chấu thanh lịch.',
    { 'Độ dài dây': '40 + 5 cm' }),
];

// Categories for the PLP page
export const categories = [
  { id: 'necklaces', name: 'Dây chuyền & Mặt dây chuyền', slug: 'necklaces' },
  { id: 'rings', name: 'Nhẫn', slug: 'rings' },
  { id: 'bracelets', name: 'Vòng tay', slug: 'bracelets' },
  { id: 'earrings', name: 'Hoa tai', slug: 'earrings' },
];

// Collections filter
export const collections = [...new Set(products.map(p => p.collection))];

export function slugify(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Format price — kiểu Việt Nam: 129.000 ₫
export function formatPrice(price, currency = '₫') {
  return `${price.toLocaleString('vi-VN')} ${currency}`;
}

export function getProductsByCategory(category) {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category === category);
}

export function getProductsByCollection(slug) {
  return products.filter(p => slugify(p.collection) === slug);
}

export function searchProducts(query) {
  const q = slugify(query || '');
  if (!q) return products;
  return products.filter(p => slugify(`${p.name} ${p.collection} ${p.materials} ${p.stones}`).includes(q));
}

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getRelatedProducts(productId, limit = 6) {
  const product = getProductById(productId);
  if (!product) return products.slice(0, limit);
  const related = products.filter(p => p.id !== productId && p.collection === product.collection);
  if (related.length < limit) {
    const others = products.filter(p => p.id !== productId && p.collection !== product.collection);
    return [...related, ...others].slice(0, limit);
  }
  return related.slice(0, limit);
}
