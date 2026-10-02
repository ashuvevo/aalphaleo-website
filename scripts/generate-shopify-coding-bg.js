/**
 * Generate Shopify custom coding background for featured service card.
 * Usage: node scripts/generate-shopify-coding-bg.js [--force]
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const OUT = path.join(__dirname, '..', 'assets', 'images', 'shopify-coding-bg.jpg');
const force = process.argv.includes('--force');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@500;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 960px;
    height: 640px;
    font-family: Inter, sans-serif;
    background: #0d1117;
    overflow: hidden;
    display: flex;
  }
  .sidebar {
    width: 220px;
    background: #010409;
    border-right: 1px solid #21262d;
    padding: 16px 0;
    flex-shrink: 0;
  }
  .sidebar-title {
    padding: 0 16px 12px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8b949e;
  }
  .file {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    font-size: 13px;
    color: #8b949e;
  }
  .file.active { background: #161b22; color: #e6edf3; border-left: 2px solid #fe9b21; }
  .dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
  .dot.liquid { background: #95bf47; }
  .dot.css { background: #563d7c; }
  .dot.js { background: #f1e05a; }
  .dot.json { background: #79b8ff; }
  .editor {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .tabs {
    display: flex;
    background: #161b22;
    border-bottom: 1px solid #21262d;
  }
  .tab {
    padding: 10px 16px;
    font-size: 12px;
    color: #8b949e;
    border-right: 1px solid #21262d;
  }
  .tab.active { background: #0d1117; color: #e6edf3; border-top: 2px solid #fe9b21; }
  .code {
    flex: 1;
    padding: 20px 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.65;
    color: #e6edf3;
    overflow: hidden;
  }
  .ln { color: #484f58; user-select: none; display: inline-block; width: 28px; }
  .tag { color: #7ee787; }
  .attr { color: #79c0ff; }
  .str { color: #a5d6ff; }
  .kw { color: #ff7b72; }
  .fn { color: #d2a8ff; }
  .cmt { color: #8b949e; font-style: italic; }
  .var { color: #ffa657; }
  .shopify { color: #95bf47; font-weight: 600; }
  .preview {
    width: 280px;
    background: #161b22;
    border-left: 1px solid #21262d;
    padding: 16px;
    flex-shrink: 0;
  }
  .preview-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8b949e;
    margin-bottom: 12px;
  }
  .preview-card {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .preview-hero {
    height: 100px;
    background: linear-gradient(135deg, #fe9b21, #f12a33);
  }
  .preview-body { padding: 12px; }
  .preview-line { height: 8px; background: #eee; border-radius: 4px; margin-bottom: 8px; }
  .preview-line.short { width: 60%; }
  .preview-btn {
    margin-top: 10px;
    height: 28px;
    border-radius: 999px;
    background: linear-gradient(90deg, #fe9b21, #fc6025);
  }
</style>
</head>
<body>
  <aside class="sidebar">
    <div class="sidebar-title">Shopify Theme</div>
    <div class="file active"><span class="dot liquid"></span>hero-banner.liquid</div>
    <div class="file"><span class="dot liquid"></span>product-card.liquid</div>
    <div class="file"><span class="dot css"></span>theme.css</div>
    <div class="file"><span class="dot js"></span>cart-drawer.js</div>
    <div class="file"><span class="dot json"></span>settings_schema.json</div>
    <div class="file"><span class="dot liquid"></span>featured-collection.liquid</div>
  </aside>
  <main class="editor">
    <div class="tabs">
      <div class="tab active">hero-banner.liquid</div>
      <div class="tab">theme.css</div>
    </div>
    <pre class="code"><span class="cmt">{%- comment -%} Custom Shopify hero section {%- endcomment -%}</span>
<span class="tag">&lt;section</span> <span class="attr">class</span>=<span class="str">"hero-banner"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;div</span> <span class="attr">class</span>=<span class="str">"hero-banner__content"</span><span class="tag">&gt;</span>
    <span class="tag">&lt;h1&gt;</span>{{ <span class="var">section.settings.heading</span> }}<span class="tag">&lt;/h1&gt;</span>
    <span class="tag">&lt;p&gt;</span>{{ <span class="var">section.settings.subtext</span> }}<span class="tag">&lt;/p&gt;</span>
    <span class="tag">&lt;a</span> <span class="attr">href</span>=<span class="str">"{{ section.settings.cta_url }}"</span><span class="tag">&gt;</span>
      {{ <span class="var">section.settings.cta_label</span> }}
    <span class="tag">&lt;/a&gt;</span>
  <span class="tag">&lt;/div&gt;</span>
  {% <span class="kw">for</span> <span class="var">block</span> <span class="kw">in</span> <span class="var">section.blocks</span> %}
    {% <span class="fn">render</span> <span class="var">block</span> %}
  {% <span class="kw">endfor</span> %}
<span class="tag">&lt;/section&gt;</span>

{% <span class="fn">schema</span> %}
{
  <span class="str">"name"</span>: <span class="str">"Hero Banner"</span>,
  <span class="str">"settings"</span>: [
    { <span class="str">"type"</span>: <span class="str">"text"</span>, <span class="str">"id"</span>: <span class="str">"heading"</span> }
  ]
}
{% <span class="fn">endschema</span> %}</pre>
  </main>
  <aside class="preview">
    <div class="preview-label">Live Preview</div>
    <div class="preview-card">
      <div class="preview-hero"></div>
      <div class="preview-body">
        <div class="preview-line"></div>
        <div class="preview-line short"></div>
        <div class="preview-btn"></div>
      </div>
    </div>
    <div style="margin-top:16px;font-size:11px;color:#95bf47;font-weight:600;">● Shopify CLI connected</div>
  </aside>
</body>
</html>`;

async function main() {
  if (!force && fs.existsSync(OUT) && fs.statSync(OUT).size > 30000) {
    console.log('  skip shopify-coding-bg.jpg');
    return;
  }

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 960, height: 640, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: OUT, type: 'jpeg', quality: 90, fullPage: false });
    console.log(`  ✓ shopify-coding-bg.jpg (${Math.round(fs.statSync(OUT).size / 1024)} KB)`);
  } finally {
    await page.close();
    await browser.close();
  }
}

main();
