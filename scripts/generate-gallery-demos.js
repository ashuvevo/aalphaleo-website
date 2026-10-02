/**
 * Generate demo Shopify homepage mockup screenshots for the design gallery.
 * Usage: node scripts/generate-gallery-demos.js [--force]
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const site = require('../build/data/site');
const OUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'gallery');
const force = process.argv.includes('--force');

function mockupHtml(d) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1280">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Inter, sans-serif; background: ${d.bg}; color: ${d.text}; width: 1280px; overflow: hidden; }
  .bar { background: ${d.accent}; color: #fff; text-align: center; padding: 10px; font-size: 13px; font-weight: 500; }
  header { display: flex; align-items: center; justify-content: space-between; padding: 18px 48px; background: #fff; border-bottom: 1px solid #eee; }
  .logo { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: ${d.text}; }
  nav { display: flex; gap: 28px; font-size: 14px; color: #555; }
  .icons { display: flex; gap: 16px; font-size: 13px; color: #666; }
  .hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 420px; background: ${d.heroBg}; }
  .hero-copy { padding: 64px 48px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: ${d.accent}; font-weight: 600; margin-bottom: 16px; }
  h1 { font-size: 46px; line-height: 1.08; font-weight: 700; margin-bottom: 18px; color: ${d.text}; }
  .sub { font-size: 16px; line-height: 1.6; color: #666; max-width: 420px; margin-bottom: 28px; }
  .cta { display: inline-block; background: ${d.accent}; color: #fff; padding: 14px 28px; border-radius: 999px; font-size: 14px; font-weight: 600; width: fit-content; }
  .hero-img { position: relative; overflow: hidden; }
  .hero-img img { width: 100%; height: 100%; object-fit: cover; }
  .products { padding: 40px 48px 48px; background: #fff; }
  .products h2 { font-size: 22px; margin-bottom: 24px; font-weight: 700; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  .card { border-radius: 14px; overflow: hidden; background: #f8f8f8; border: 1px solid #eee; }
  .thumb { aspect-ratio: 1; background: linear-gradient(135deg, ${d.cardA}, ${d.cardB}); }
  .card-body { padding: 14px; }
  .card-body p { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
  .price { font-size: 12px; color: ${d.accent}; font-weight: 700; }
  .trust { display: flex; gap: 24px; padding: 18px 48px 28px; background: #fff; border-top: 1px solid #f0f0f0; font-size: 12px; color: #777; }
</style>
</head>
<body>
  <div class="bar">${d.announcement}</div>
  <header>
    <div class="logo">${d.brand}</div>
    <nav><span>Shop</span><span>Collections</span><span>New In</span><span>Sale</span></nav>
    <div class="icons"><span>Search</span><span>Account</span><span>Cart (0)</span></div>
  </header>
  <section class="hero">
    <div class="hero-copy">
      <div class="eyebrow">${d.eyebrow}</div>
      <h1>${d.headline}</h1>
      <p class="sub">${d.subheadline}</p>
      <div class="cta">Shop Collection</div>
    </div>
    <div class="hero-img"><img src="${d.image}" alt=""></div>
  </section>
  <section class="products">
    <h2>Featured Products</h2>
    <div class="grid">
      ${[1, 2, 3, 4].map(i => `<div class="card"><div class="thumb"></div><div class="card-body"><p>${d.products[i - 1]}</p><div class="price">₹${d.prices[i - 1]}</div></div></div>`).join('')}
    </div>
  </section>
  <div class="trust"><span>✓ Free Shipping</span><span>✓ Easy Returns</span><span>✓ Secure Checkout</span><span>✓ 24/7 Support</span></div>
</body>
</html>`;
}

const designs = [
  {
    slug: 'fashion-luxe',
    brand: 'MAISON ÉLÉGANCE',
    eyebrow: 'New Season',
    headline: 'Elevated Style<br>For Modern Women',
    subheadline: 'Discover curated collections crafted for confidence, comfort, and timeless appeal.',
    announcement: 'Free shipping on orders above ₹1,499 · New arrivals weekly',
    accent: '#1a1a1a',
    text: '#111',
    bg: '#fafafa',
    heroBg: '#f5f0eb',
    cardA: '#e8ddd3',
    cardB: '#d4c4b8',
    image: 'https://images.unsplash.com/photo-1483985988350-763728e46cbb?auto=format&fit=crop&w=900&q=80',
    products: ['Silk Midi Dress', 'Tailored Blazer', 'Linen Trousers', 'Cashmere Wrap'],
    prices: ['4,999', '6,499', '3,299', '5,799'],
  },
  {
    slug: 'fashion-minimal',
    brand: 'THREAD & CO.',
    eyebrow: 'Essentials',
    headline: 'Minimal Wardrobe.<br>Maximum Impact.',
    subheadline: 'Clean lines, premium fabrics, and everyday pieces designed to last.',
    announcement: 'Buy 2 Get 10% Off · Limited time offer',
    accent: '#fc6025',
    text: '#222',
    bg: '#fff',
    heroBg: '#fff7f2',
    cardA: '#ffe8db',
    cardB: '#ffd4bf',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
    products: ['Organic Tee', 'Relaxed Fit Denim', 'Oversized Shirt', 'Neutral Hoodie'],
    prices: ['1,299', '2,499', '1,899', '2,199'],
  },
  {
    slug: 'fashion-street',
    brand: 'URBAN DROP',
    eyebrow: 'Just Dropped',
    headline: 'Streetwear That<br>Speaks Loud',
    subheadline: 'Limited drops, bold graphics, and hype-worthy fits for the culture.',
    announcement: 'Drop ends in 48 hours · Free express delivery',
    accent: '#f12a33',
    text: '#111',
    bg: '#111',
    heroBg: '#1a1a1a',
    cardA: '#333',
    cardB: '#555',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
    products: ['Graphic Hoodie', 'Cargo Pants', 'High-Top Sneakers', 'Bucket Hat'],
    prices: ['2,999', '2,499', '4,499', '899'],
  },
  {
    slug: 'fashion-ethnic',
    brand: 'SANSKRITI',
    eyebrow: 'Festive Edit',
    headline: 'Grace In Every<br>Thread & Motif',
    subheadline: 'Handcrafted ethnic wear with contemporary silhouettes for every celebration.',
    announcement: 'Festive sale · Up to 40% off on sarees & lehengas',
    accent: '#b8860b',
    text: '#2c1810',
    bg: '#fffaf5',
    heroBg: '#fff5eb',
    cardA: '#f5e6d3',
    cardB: '#e8d4b8',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    products: ['Silk Saree', 'Anarkali Set', 'Embroidered Kurta', 'Dupatta Set'],
    prices: ['8,999', '6,499', '3,999', '2,499'],
  },
  {
    slug: 'beauty-glow',
    brand: 'GLOW LAB',
    eyebrow: 'Clean Beauty',
    headline: 'Radiance Starts<br>With Self-Care',
    subheadline: 'Dermatologist-tested skincare and makeup for a naturally luminous glow.',
    announcement: 'Free sample with every order · Clean & cruelty-free',
    accent: '#e91e8c',
    text: '#2d2d2d',
    bg: '#fff',
    heroBg: '#fff0f7',
    cardA: '#ffd6ec',
    cardB: '#ffb8de',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
    products: ['Vitamin C Serum', 'Hydrating Mist', 'Glow Foundation', 'Lip Tint Set'],
    prices: ['1,899', '999', '1,499', '699'],
  },
  {
    slug: 'beauty-perfume',
    brand: 'NOIR PARFUM',
    eyebrow: 'Signature Scents',
    headline: 'Fragrances That<br>Leave A Memory',
    subheadline: 'Artisan perfumes blended with rare notes for day and evening wear.',
    announcement: 'Complimentary gift wrapping on all orders',
    accent: '#4a1942',
    text: '#1a1a1a',
    bg: '#faf8fc',
    heroBg: '#f3eef7',
    cardA: '#e8dff0',
    cardB: '#d4c4e0',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
    products: ['Oud Intense', 'Rose Noir', 'Citrus Bloom', 'Discovery Set'],
    prices: ['3,499', '2,999', '2,499', '1,499'],
  },
  {
    slug: 'beauty-skincare',
    brand: 'PURE DERM',
    eyebrow: 'Clinical Care',
    headline: 'Science-Backed<br>Skincare Rituals',
    subheadline: 'Clinically proven formulas for acne, aging, and sensitive skin concerns.',
    announcement: 'Subscribe & save 15% on refills',
    accent: '#0d9488',
    text: '#134e4a',
    bg: '#f0fdfa',
    heroBg: '#ecfdf5',
    cardA: '#ccfbf1',
    cardB: '#99f6e4',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80',
    products: ['Retinol Night Cream', 'SPF 50 Sunscreen', 'Niacinamide Serum', 'Gentle Cleanser'],
    prices: ['2,199', '899', '1,599', '699'],
  },
  {
    slug: 'footwear-comfort',
    brand: 'STEP COMFORT',
    eyebrow: 'Walk Easy',
    headline: 'Comfort Meets<br>Everyday Style',
    subheadline: 'Lightweight soles and breathable designs for all-day wear.',
    announcement: 'Free returns within 30 days · Size guide available',
    accent: '#2563eb',
    text: '#1e293b',
    bg: '#f8fafc',
    heroBg: '#eff6ff',
    cardA: '#dbeafe',
    cardB: '#bfdbfe',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    products: ['Running Sneakers', 'Casual Loafers', 'Slide Sandals', 'Hiking Boots'],
    prices: ['3,999', '2,799', '1,499', '5,499'],
  },
  {
    slug: 'home-decor-living',
    brand: 'HAVEN HOME',
    eyebrow: 'Interior Edit',
    headline: 'Transform Spaces<br>Into Sanctuaries',
    subheadline: 'Curated furniture, decor, and lighting for modern living rooms.',
    announcement: 'Free assembly on furniture orders above ₹10,000',
    accent: '#78716c',
    text: '#292524',
    bg: '#fafaf9',
    heroBg: '#f5f5f4',
    cardA: '#e7e5e4',
    cardB: '#d6d3d1',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    products: ['Velvet Sofa', 'Oak Coffee Table', 'Floor Lamp', 'Throw Pillows'],
    prices: ['45,999', '12,999', '4,999', '1,299'],
  },
  {
    slug: 'ecommerce-market',
    brand: 'MARKETPLACE',
    eyebrow: 'Top Picks',
    headline: 'Everything You Need.<br>One Store.',
    subheadline: 'Shop trending products across categories with fast delivery nationwide.',
    announcement: 'Same-day delivery in metro cities · COD available',
    accent: '#fe9b21',
    text: '#29292a',
    bg: '#fff',
    heroBg: '#fff8f0',
    cardA: '#ffe4c4',
    cardB: '#ffd4a8',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80',
    products: ['Smart Watch', 'Wireless Earbuds', 'Travel Backpack', 'Insulated Bottle'],
    prices: ['4,999', '2,499', '1,899', '799'],
  },
  {
    slug: 'ecommerce-kids',
    brand: 'LITTLE JOY',
    eyebrow: 'Kids Collection',
    headline: 'Playful Finds For<br>Curious Minds',
    subheadline: 'Safe, fun, and educational toys and apparel for growing explorers.',
    announcement: 'Gift wrap free on birthday orders',
    accent: '#8b5cf6',
    text: '#4c1d95',
    bg: '#faf5ff',
    heroBg: '#f5f3ff',
    cardA: '#ede9fe',
    cardB: '#ddd6fe',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e945a1be?auto=format&fit=crop&w=900&q=80',
    products: ['Building Blocks', 'Storybook Set', 'Plush Toy', 'Art Kit'],
    prices: ['1,499', '599', '899', '749'],
  },
  {
    slug: 'jewelry-boutique',
    brand: 'AURORA GEMS',
    eyebrow: 'Fine Jewelry',
    headline: 'Timeless Pieces<br>For Every Moment',
    subheadline: 'Hand-finished jewelry in gold, silver, and precious stones.',
    announcement: 'Certified authenticity · Lifetime polishing',
    accent: '#ca8a04',
    text: '#1c1917',
    bg: '#fffbeb',
    heroBg: '#fef3c7',
    cardA: '#fde68a',
    cardB: '#fcd34d',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80',
    products: ['Diamond Pendant', 'Gold Hoops', 'Pearl Bracelet', 'Stacking Rings'],
    prices: ['24,999', '8,999', '6,499', '3,999'],
  },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  for (const d of designs) {
    const dest = path.join(OUT_DIR, `${d.slug}.jpg`);
    if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 30000) {
      console.log(`  skip ${d.slug}.jpg`);
      continue;
    }

    process.stdout.write(`  generating ${d.slug}.jpg... `);
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
      await page.setContent(mockupHtml(d), { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 1500));
      await page.screenshot({ path: dest, type: 'jpeg', quality: 88, fullPage: false });
      console.log(`ok (${Math.round(fs.statSync(dest).size / 1024)} KB)`);
    } catch (err) {
      console.log(`failed: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\nGenerated ${designs.length} demo mockups in assets/images/gallery/`);
}

main();
