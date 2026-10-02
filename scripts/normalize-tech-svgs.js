/**
 * Fix tech SVG files for use in <img> tags (remove duplicate attrs, title nodes).
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'assets', 'images', 'tech');

for (const file of fs.readdirSync(DIR).filter(f => f.endsWith('.svg'))) {
  const filePath = path.join(DIR, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] || '0 0 24 24';
  const paths = [...raw.matchAll(/<path[\s\S]*?\/>|<path[\s\S]*?<\/path>/g)].map(m => m[0]);
  if (!paths.length) {
    console.log(`skip ${file} (no paths)`);
    continue;
  }
  const normalized = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-hidden="true">${paths.join('')}</svg>\n`;
  fs.writeFileSync(filePath, normalized);
  console.log(`fixed ${file}`);
}
