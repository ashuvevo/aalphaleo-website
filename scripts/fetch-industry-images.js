/**
 * Download industry hero images from Unsplash.
 * Usage: node scripts/fetch-industry-images.js [--force]
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'industries');
const force = process.argv.includes('--force');

const images = {
  'fashion.jpg': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
  'furniture.jpg': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  'beauty.jpg': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80',
  'jewelry.jpg': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80',
  'healthcare.jpg': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
  'food.jpg': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  'electronics.jpg': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
  'manufacturing.jpg': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
  'corporate.jpg': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
};

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [file, url] of Object.entries(images)) {
    const dest = path.join(OUT_DIR, file);
    if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
      console.log(`  skip ${file}`);
      continue;
    }
    process.stdout.write(`  fetching ${file}... `);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`ok (${Math.round(buf.length / 1024)} KB)`);
    } catch (err) {
      console.log(`failed: ${err.message}`);
    }
  }
}

main();
