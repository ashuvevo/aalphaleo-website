/**
 * Generate 16:9 featured images for all blog posts.
 * Usage: node scripts/generate-blog-images.js [--force]
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const OUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'blog');
const force = process.argv.includes('--force');
const W = 1280;
const H = 720;

const { loadAllBlogs, getCategoryLabel } = require('../build/lib/blogs');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncateTitle(title, max = 72) {
  if (title.length <= max) return title;
  return `${title.slice(0, max - 1).trim()}…`;
}

const CATEGORY_VISUALS = {
  shopify: {
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #14532d 100%)',
    accent: '#95bf47',
    label: 'Shopify',
    motif: `
      <div class="mock-store">
        <div class="mock-nav"></div>
        <div class="mock-hero"></div>
        <div class="mock-grid"><span></span><span></span><span></span></div>
      </div>`,
  },
  'website-development': {
    gradient: 'linear-gradient(135deg, #29292a 0%, #1e293b 55%, #334155 100%)',
    accent: '#fe9b21',
    label: 'Web Development',
    motif: `
      <div class="mock-browser">
        <div class="mock-dots"><i></i><i></i><i></i></div>
        <div class="mock-code"><span></span><span></span><span></span><span></span></div>
      </div>`,
  },
  seo: {
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #29292a 100%)',
    accent: '#38bdf8',
    label: 'SEO',
    motif: `
      <div class="mock-chart">
        <div class="bars"><i style="height:35%"></i><i style="height:55%"></i><i style="height:72%"></i><i style="height:90%"></i></div>
        <div class="search-pill"></div>
      </div>`,
  },
  'google-ads': {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #172554 55%, #29292a 100%)',
    accent: '#4285f4',
    label: 'Google Ads',
    motif: `
      <div class="mock-ads">
        <div class="ad-card"><small>Ad</small><span></span><span></span></div>
        <div class="ad-card warm"><small>Ad</small><span></span><span></span></div>
      </div>`,
  },
  'meta-ads': {
    gradient: 'linear-gradient(135deg, #312e81 0%, #581c87 45%, #29292a 100%)',
    accent: '#c084fc',
    label: 'Meta Ads',
    motif: `
      <div class="mock-social">
        <div class="social-card"><div class="avatar"></div><span></span></div>
        <div class="social-card"><div class="avatar"></div><span></span></div>
      </div>`,
  },
  'mobile-app': {
    gradient: 'linear-gradient(135deg, #164e63 0%, #29292a 50%, #0f172a 100%)',
    accent: '#22d3ee',
    label: 'Mobile App',
    motif: `
      <div class="mock-phone">
        <div class="phone-screen"><span></span><span></span><span></span></div>
      </div>`,
  },
  'business-growth': {
    gradient: 'linear-gradient(135deg, #431407 0%, #29292a 50%, #7c2d12 100%)',
    accent: '#fb923c',
    label: 'Business Growth',
    motif: `
      <div class="mock-growth">
        <div class="growth-line"></div>
        <div class="growth-dot"></div>
      </div>`,
  },
  ecommerce: {
    gradient: 'linear-gradient(135deg, #29292a 0%, #7c2d12 40%, #431407 100%)',
    accent: '#fc6025',
    label: 'eCommerce',
    motif: `
      <div class="mock-cart">
        <div class="cart-icon"></div>
        <div class="cart-items"><span></span><span></span></div>
      </div>`,
  },
  'case-studies': {
    gradient: 'linear-gradient(135deg, #29292a 0%, #14532d 45%, #0f172a 100%)',
    accent: '#4ade80',
    label: 'Case Studies',
    motif: `
      <div class="mock-metrics">
        <div class="metric"><strong>+120%</strong><span></span></div>
        <div class="metric"><strong>3.2x</strong><span></span></div>
      </div>`,
  },
};

const baseStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${W}px; height: ${H}px; overflow: hidden;
    font-family: Inter, system-ui, sans-serif; color: #fff;
    position: relative;
  }
  .bg { position: absolute; inset: 0; }
  .glow {
    position: absolute; width: 520px; height: 520px; border-radius: 50%;
    filter: blur(80px); opacity: 0.35; right: -80px; top: -120px;
  }
  .grid {
    position: absolute; inset: 0; opacity: 0.08;
    background-image: linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .content {
    position: relative; z-index: 2; height: 100%; display: flex;
    align-items: stretch; padding: 56px 64px; gap: 48px;
  }
  .copy { flex: 1.15; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
    margin-bottom: 18px; opacity: 0.92;
  }
  .eyebrow i {
    display: inline-block; width: 28px; height: 4px; border-radius: 999px;
    background: currentColor;
  }
  h1 {
    font-size: 46px; line-height: 1.12; font-weight: 800; max-width: 720px;
    text-wrap: balance;
  }
  .brand {
    margin-top: 28px; font-size: 14px; font-weight: 600; letter-spacing: 0.04em;
    opacity: 0.72;
  }
  .visual {
    flex: 0.85; display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .visual-panel {
    width: 100%; max-width: 420px; padding: 28px; border-radius: 24px;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(12px); box-shadow: 0 24px 60px rgba(0,0,0,0.28);
  }
  .mock-store .mock-nav { height: 12px; width: 40%; background: rgba(255,255,255,.25); border-radius: 999px; margin-bottom: 16px; }
  .mock-store .mock-hero { height: 88px; border-radius: 14px; background: linear-gradient(135deg,#fe9b21,#f12a33); margin-bottom: 16px; }
  .mock-store .mock-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .mock-store .mock-grid span { aspect-ratio: 1; border-radius: 10px; background: rgba(255,255,255,.12); }
  .mock-browser { background: rgba(15,23,42,.55); border-radius: 16px; overflow: hidden; }
  .mock-dots { display: flex; gap: 6px; padding: 12px 14px; background: rgba(255,255,255,.06); }
  .mock-dots i { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.35); display: block; }
  .mock-code { padding: 18px; display: grid; gap: 10px; }
  .mock-code span { display: block; height: 10px; border-radius: 999px; background: rgba(254,155,33,.55); }
  .mock-code span:nth-child(2){ width: 78%; background: rgba(252,96,37,.45); }
  .mock-code span:nth-child(3){ width: 62%; background: rgba(255,255,255,.18); }
  .mock-code span:nth-child(4){ width: 84%; background: rgba(241,42,51,.4); }
  .mock-chart .bars { display: flex; align-items: end; gap: 10px; height: 140px; margin-bottom: 18px; }
  .mock-chart .bars i { flex: 1; display: block; border-radius: 8px 8px 0 0; background: linear-gradient(180deg,#38bdf8,#0284c7); }
  .mock-chart .search-pill { height: 34px; border-radius: 999px; background: rgba(255,255,255,.14); }
  .mock-ads { display: grid; gap: 12px; }
  .mock-ads .ad-card { background: rgba(255,255,255,.08); border-radius: 12px; padding: 14px; }
  .mock-ads .ad-card small { color: #4285f4; font-size: 11px; font-weight: 700; }
  .mock-ads .ad-card span { display: block; height: 8px; background: rgba(255,255,255,.18); border-radius: 999px; margin-top: 10px; }
  .mock-ads .ad-card span:last-child { width: 70%; margin-top: 8px; }
  .mock-ads .ad-card.warm small { color: #fe9b21; }
  .mock-social { display: grid; gap: 12px; }
  .mock-social .social-card { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,.08); border-radius: 12px; padding: 14px; }
  .mock-social .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#fe9b21,#f12a33); flex-shrink: 0; }
  .mock-social .social-card span { display: block; height: 8px; flex: 1; background: rgba(255,255,255,.18); border-radius: 999px; }
  .mock-phone { width: 180px; margin: 0 auto; padding: 14px; border-radius: 28px; background: #111; border: 2px solid rgba(255,255,255,.15); }
  .mock-phone .phone-screen { background: #fff; border-radius: 18px; padding: 18px 14px; display: grid; gap: 10px; }
  .mock-phone .phone-screen span { display: block; height: 10px; border-radius: 999px; background: #e5e7eb; }
  .mock-phone .phone-screen span:first-child { height: 56px; border-radius: 12px; background: linear-gradient(135deg,#fe9b21,#fc6025); }
  .mock-growth { position: relative; height: 160px; }
  .mock-growth .growth-line {
    position: absolute; left: 12px; right: 12px; bottom: 24px; height: 120px;
    border-left: 2px solid rgba(255,255,255,.25); border-bottom: 2px solid rgba(255,255,255,.25);
    background: linear-gradient(135deg, transparent 40%, rgba(254,155,33,.25) 40%, rgba(252,96,37,.45) 100%);
    clip-path: polygon(0 100%, 0 68%, 22% 72%, 42% 48%, 62% 52%, 82% 18%, 100% 8%, 100% 100%);
  }
  .mock-growth .growth-dot {
    position: absolute; right: 28px; top: 28px; width: 18px; height: 18px; border-radius: 50%;
    background: #fe9b21; box-shadow: 0 0 0 8px rgba(254,155,33,.25);
  }
  .mock-cart { display: flex; align-items: center; gap: 18px; }
  .mock-cart .cart-icon {
    width: 72px; height: 72px; border-radius: 18px;
    background: linear-gradient(135deg,#fe9b21,#f12a33);
  }
  .mock-cart .cart-items { flex: 1; display: grid; gap: 10px; }
  .mock-cart .cart-items span { display: block; height: 12px; border-radius: 999px; background: rgba(255,255,255,.18); }
  .mock-cart .cart-items span:last-child { width: 65%; }
  .mock-metrics { display: grid; gap: 12px; }
  .mock-metrics .metric { background: rgba(255,255,255,.08); border-radius: 14px; padding: 16px 18px; }
  .mock-metrics .metric strong { display: block; font-size: 28px; margin-bottom: 8px; color: #4ade80; }
  .mock-metrics .metric span { display: block; height: 8px; width: 70%; background: rgba(255,255,255,.16); border-radius: 999px; }
`;

function buildFeaturedHtml(post) {
  const theme = CATEGORY_VISUALS[post.category] || CATEGORY_VISUALS['business-growth'];
  const title = escapeHtml(truncateTitle(post.title));
  const label = escapeHtml(theme.label || getCategoryLabel(post.category));

  return `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800&display=swap" rel="stylesheet">
<style>${baseStyles}</style></head><body>
<div class="bg" style="background:${theme.gradient}"></div>
<div class="glow" style="background:${theme.accent}"></div>
<div class="grid"></div>
<div class="content">
  <div class="copy">
    <div class="eyebrow" style="color:${theme.accent}"><i style="background:${theme.accent}"></i>${label}</div>
    <h1>${title}</h1>
    <div class="brand">Aalphaleo Digital Solution</div>
  </div>
  <div class="visual">
    <div class="visual-panel">${theme.motif}</div>
  </div>
</div>
</body></html>`;
}

async function main() {
  const posts = loadAllBlogs();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  let generated = 0;
  let skipped = 0;

  for (const post of posts) {
    const dest = path.join(OUT_DIR, `${post.slug}.jpg`);
    if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 12000) {
      skipped++;
      continue;
    }

    process.stdout.write(`  ${post.slug}.jpg... `);
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
      await page.setContent(buildFeaturedHtml(post), { waitUntil: 'networkidle0', timeout: 60000 });
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: dest, type: 'jpeg', quality: 86, fullPage: false });
      generated++;
      console.log(`ok (${Math.round(fs.statSync(dest).size / 1024)} KB)`);
    } catch (err) {
      console.log(`failed: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\nDone. Generated: ${generated}, skipped: ${skipped}, total posts: ${posts.length}`);
  console.log(`Images saved to assets/images/blog/\n`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
