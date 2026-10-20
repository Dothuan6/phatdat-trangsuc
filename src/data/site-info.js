// ============================================================
// SITE INFO — Thông tin liên hệ cửa hàng (dùng chung toàn site)
// ============================================================

const defaultSiteInfo = {
  name: 'Phát Đạt Jewelry',
  phone: '0898025013',
  phoneDisplay: '0898 025 013',
  phoneHref: 'tel:0898025013',
  zalo: 'https://zalo.me/0898025013',
  facebookName: 'Phát Đạt Jewelry',
  facebook: 'https://www.facebook.com/profile.php?id=61594821396672',
  tiktokName: 'Phát Đạt Jewelry (@phat.dat.jewelry)',
  tiktokHandle: '@phat.dat.jewelry',
  tiktok: 'https://www.tiktok.com/@phat.dat.jewelry?_r=1&_t=ZS-9AblM3HdvqX',
  instagramName: 'Phát Đạt Jewelry (@jewelryphatdat)',
  instagramHandle: '@jewelryphatdat',
  instagram: 'https://www.instagram.com/jewelryphatdat/',
  instagramQr: './images/instagram-qr.png',
  address: 'C3B, 96, Ấp 3B, Tân Vĩnh Lộc, TP. Hồ Chí Minh, Việt Nam',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=C3B%2C%2096%2C%20Ap%203B%2C%20Tan%20Vinh%20Loc%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam',
  mapsEmbed: 'https://www.google.com/maps?q=Tan%20Vinh%20Loc%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam&output=embed',
  hours: 'Mở cửa cả ngày (full time) — tất cả các ngày trong tuần',
};

function getLiveSiteInfo() {
  try {
    const saved = localStorage.getItem('phatdat_admin_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.facebook && parsed.facebook.includes('facebook.com/search')) delete parsed.facebook;
      if (parsed.instagram && parsed.instagram.includes('instagram.com/explore')) delete parsed.instagram;
      return { ...defaultSiteInfo, ...parsed };
    }
  } catch (e) {}
  return defaultSiteInfo;
}

export const siteInfo = new Proxy(defaultSiteInfo, {
  get(target, prop) {
    const live = getLiveSiteInfo();
    return live[prop] || target[prop];
  }
});

