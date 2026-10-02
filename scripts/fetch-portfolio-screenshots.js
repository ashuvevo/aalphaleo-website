/**
 * Download homepage screenshots for portfolio projects.
 * Primary: Microlink API. Fallback: local Puppeteer capture.
 * Usage: node scripts/fetch-portfolio-screenshots.js [--force]
 */
const fs = require('fs');
const path = require('path');

const site = require('../build/data/site');
const { portfolioSlug } = require('../build/helpers');

const OUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'portfolio');
const force = process.argv.includes('--force');
const MIN_SIZE = 25000;

function microlinkApiUrl(url) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false`;
}

async function fetchViaMicrolink(url, dest, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 5000 * i));
    const res = await fetch(microlinkApiUrl(url));
    if (!res.ok) continue;
    const json = await res.json();
    const imgUrl = json?.data?.screenshot?.url;
    if (!imgUrl) continue;
    const imgRes = await fetch(imgUrl);
    if (!imgRes.ok) continue;
    const buf = Buffer.from(await imgRes.arrayBuffer());
    if (buf.length >= MIN_SIZE) {
      fs.writeFileSync(dest, buf);
      return buf.length;
    }
  }
  return 0;
}

async function fetchViaPuppeteer(url, dest) {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    return 0;
  }

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: dest, type: 'jpeg', quality: 82, fullPage: false });
    const size = fs.statSync(dest).size;
    return size >= MIN_SIZE ? size : 0;
  } catch {
    return 0;
  } finally {
    await page.close();
    await browser.close();
  }
}

async function fetchScreenshot(url, dest) {
  const microlinkSize = await fetchViaMicrolink(url, dest);
  if (microlinkSize) return microlinkSize;
  return fetchViaPuppeteer(url, dest);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const project of site.portfolioProjects) {
    const slug = portfolioSlug(project.url);
    const dest = path.join(OUT_DIR, `${slug}.jpg`);

    if (!force && fs.existsSync(dest) && fs.statSync(dest).size >= MIN_SIZE) {
      console.log(`  skip ${slug}.jpg`);
      skip++;
      continue;
    }

    process.stdout.write(`  fetching ${project.title}... `);
    try {
      const size = await fetchScreenshot(project.url, dest);
      if (size) {
        console.log(`ok (${Math.round(size / 1024)} KB)`);
        ok++;
      } else {
        console.log('failed');
        fail++;
      }
    } catch (err) {
      console.log(`error: ${err.message}`);
      fail++;
    }

    await new Promise(r => setTimeout(r, 2500));
  }

  console.log(`\nDone: ${ok} fetched, ${skip} skipped, ${fail} failed`);
}

main();
