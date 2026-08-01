const fs = require('fs');

const path = 'd:\\ShopTrangSuc-DaiPhat\\website\\src\\data\\products.js';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
  ["'./images/products/necklace-1.png'", "'./images/products/daychuyen3-removebg-preview.png'"],
  ["'./images/products/necklace-2.png'", "'./images/products/daychuyen3.2-removebg-preview.png'"],
  ["'./images/products/necklace-3.png'", "'./images/products/Daychuyen4.3-removebg-preview.png'"],
  ["'./images/products/necklace-4.png'", "'./images/products/daychuyen5.1-removebg-preview.png'"],
  ["'./images/products/necklace-5.png'", "'./images/products/daychuyen3-removebg-preview.png'"],
  ["'./images/products/necklace-6.png'", "'./images/products/daychuyen3.2-removebg-preview.png'"],
  ["'./images/products/necklace-7.png'", "'./images/products/Daychuyen4.3-removebg-preview.png'"],
  ["'./images/products/ring-1.png'", "'./images/products/4-removebg-preview.png'"],
  ["'./images/products/ring-2.png'", "'./images/products/6-removebg-preview.png'"],
  ["'./images/products/ring-3.png'", "'./images/products/4-removebg-preview.png'"],
  ["'./images/products/bracelet-1.png'", "'./images/products/4-removebg-preview.png'"],
  ["'./images/products/bracelet-2.png'", "'./images/products/6-removebg-preview.png'"],
  ["'./images/products/bracelet-3.png'", "'./images/products/4-removebg-preview.png'"],
  ["'./images/products/bracelet-4.png'", "'./images/products/6-removebg-preview.png'"],
  ["'./images/products/bracelet-5.png'", "'./images/products/4-removebg-preview.png'"],
  ["'./images/products/earring-1.png'", "'./images/products/bongtay1.1-removebg-preview.png'"],
  ["'./images/products/earring-2.png'", "'./images/products/bongtay2-removebg-preview.png'"],
  ["'./images/products/earring-3.png'", "'./images/products/bongtay3-removebg-preview.png'"]
];

for (const [oldStr, newStr] of replacements) {
  content = content.replace(oldStr, newStr);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Updated products.js images with removebg-preview pngs.');
