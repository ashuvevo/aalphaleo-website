/**
 * Generate hero mockup images for all service pages.
 * Usage: node scripts/generate-service-images.js [--force]
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const OUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'services');
const force = process.argv.includes('--force');
const W = 800;
const H = 600;

const baseStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: ${W}px; height: ${H}px; font-family: Inter, sans-serif; overflow: hidden; }
`;

const mockups = {
  'shopify-development': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #0d1117; display: flex; }
.sidebar { width: 180px; background: #010409; border-right: 1px solid #21262d; padding: 14px 0; }
.file { padding: 6px 14px; font-size: 11px; color: #8b949e; display: flex; gap: 6px; align-items: center; }
.file.active { background: #161b22; color: #e6edf3; border-left: 2px solid #fe9b21; }
.dot { width: 7px; height: 7px; border-radius: 2px; background: #95bf47; }
.editor { flex: 1; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.6; color: #e6edf3; }
.tag { color: #7ee787; } .kw { color: #ff7b72; } .var { color: #ffa657; } .cmt { color: #8b949e; }
.preview { width: 200px; background: #161b22; border-left: 1px solid #21262d; padding: 14px; }
.pcard { background: #fff; border-radius: 8px; overflow: hidden; margin-top: 10px; }
.phero { height: 70px; background: linear-gradient(135deg,#fe9b21,#f12a33); }
</style></head><body>
<aside class="sidebar"><div class="file active"><span class="dot"></span>hero.liquid</div><div class="file"><span class="dot"></span>product-card.liquid</div><div class="file"><span class="dot"></span>theme.css</div></aside>
<pre class="editor"><span class="cmt">{%- Custom Shopify section -%}</span>
<span class="tag">&lt;section</span> class=<span class="var">"hero"</span><span class="tag">&gt;</span>
  {{ <span class="var">section.settings.heading</span> }}
  {% <span class="kw">for</span> block <span class="kw">in</span> section.blocks %}
    {% render block %}
  {% <span class="kw">endfor</span> %}
<span class="tag">&lt;/section&gt;</span></pre>
<aside class="preview"><div style="font-size:10px;color:#95bf47;font-weight:600;">● Shopify CLI</div><div class="pcard"><div class="phero"></div><div style="padding:10px"><div style="height:6px;background:#eee;border-radius:3px;margin-bottom:6px"></div><div style="height:6px;background:#eee;border-radius:3px;width:60%"></div></div></div></aside>
</body></html>`,

  'shopify-redesign': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #f5f5f5; display: flex; gap: 0; }
.half { flex: 1; padding: 20px; position: relative; }
.before { background: #e8e8e8; }
.after { background: linear-gradient(135deg,#fff7f0,#fff); }
.label { position: absolute; top: 16px; left: 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 999px; }
.before .label { background: #ccc; color: #555; }
.after .label { background: linear-gradient(90deg,#fe9b21,#fc6025); color: #fff; }
.mock { background: #fff; border-radius: 10px; padding: 14px; margin-top: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.hero-old { height: 60px; background: #ddd; border-radius: 6px; margin-bottom: 10px; }
.hero-new { height: 80px; background: linear-gradient(135deg,#fe9b21,#f12a33); border-radius: 8px; margin-bottom: 10px; }
.line { height: 8px; background: #eee; border-radius: 4px; margin-bottom: 8px; }
.btn-old { height: 24px; width: 80px; background: #bbb; border-radius: 4px; margin-top: 8px; }
.btn-new { height: 28px; width: 100px; background: linear-gradient(90deg,#fe9b21,#fc6025); border-radius: 999px; margin-top: 8px; }
.arrow { position: absolute; right: -14px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; background: #fc6025; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; z-index: 2; }
</style></head><body>
<div class="half before"><span class="label">BEFORE</span><div class="mock"><div class="hero-old"></div><div class="line"></div><div class="line" style="width:70%"></div><div class="btn-old"></div></div></div>
<div class="half after"><span class="arrow">→</span><span class="label">AFTER</span><div class="mock"><div class="hero-new"></div><div class="line"></div><div class="line" style="width:70%"></div><div class="btn-new"></div></div></div>
</body></html>`,

  'shopify-theme-customization': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #f0f0f0; display: flex; }
.store { flex: 1; background: #fff; margin: 20px; border-radius: 10px; padding: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
.customize { width: 260px; background: #1a1a1a; color: #fff; padding: 16px; }
.customize h3 { font-size: 13px; margin-bottom: 12px; color: #fe9b21; }
.block { background: #2a2a2a; border-radius: 8px; padding: 10px; margin-bottom: 8px; font-size: 11px; display: flex; align-items: center; gap: 8px; border: 1px dashed #444; cursor: grab; }
.block:hover { border-color: #fe9b21; }
.handle { color: #666; }
.hero-m { height: 100px; background: linear-gradient(135deg,#fe9b21,#fc6025); border-radius: 8px; margin-bottom: 12px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.prod { aspect-ratio: 1; background: #f5f5f5; border-radius: 6px; }
</style></head><body>
<div class="store"><div class="hero-m"></div><div class="grid"><div class="prod"></div><div class="prod"></div><div class="prod"></div><div class="prod"></div></div></div>
<aside class="customize"><h3>Customize Theme</h3><div class="block"><span class="handle">⋮⋮</span> Hero Banner</div><div class="block"><span class="handle">⋮⋮</span> Featured Collection</div><div class="block"><span class="handle">⋮⋮</span> Testimonials</div><div class="block"><span class="handle">⋮⋮</span> Newsletter</div></aside>
</body></html>`,

  'shopify-migration': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: linear-gradient(135deg,#1a1a2e,#16213e); display: flex; align-items: center; justify-content: center; gap: 24px; padding: 40px; }
.platform { width: 120px; height: 120px; background: #fff; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #333; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
.platform.old { opacity: 0.7; }
.platform.shopify { background: linear-gradient(135deg,#95bf47,#5e8e3e); color: #fff; }
.icon { font-size: 32px; margin-bottom: 8px; }
.flow { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.arrow { color: #fe9b21; font-size: 28px; }
.items { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; max-width: 200px; }
.chip { background: rgba(254,155,33,0.2); color: #fe9b21; font-size: 9px; padding: 4px 8px; border-radius: 999px; font-weight: 600; }
</style></head><body>
<div class="platform old"><div class="icon">W</div>WooCommerce</div>
<div class="flow"><div class="arrow">→</div><div class="items"><span class="chip">Products</span><span class="chip">Orders</span><span class="chip">Customers</span><span class="chip">SEO</span></div></div>
<div class="platform shopify"><div class="icon">S</div>Shopify</div>
</body></html>`,

  'shopify-maintenance': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #f8fafc; padding: 24px; }
.header { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 20px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
.card h4 { font-size: 12px; color: #64748b; margin-bottom: 8px; }
.status { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #16a34a; }
.dot { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
.metric { font-size: 28px; font-weight: 700; color: #fe9b21; }
.bar { height: 6px; background: #e2e8f0; border-radius: 3px; margin-top: 8px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg,#fe9b21,#fc6025); border-radius: 3px; width: 94%; }
</style></head><body>
<div class="header">Store Health Dashboard</div>
<div class="grid">
<div class="card"><h4>System Status</h4><div class="status"><span class="dot"></span> All systems operational</div></div>
<div class="card"><h4>Uptime</h4><div class="metric">99.9%</div><div class="bar"><div class="bar-fill"></div></div></div>
<div class="card"><h4>Theme Updates</h4><div class="status"><span class="dot"></span> Up to date</div></div>
<div class="card"><h4>Security Scan</h4><div class="status"><span class="dot"></span> No issues found</div></div>
</div></body></html>`,

  'shopify-speed-optimization': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #fff; display: flex; align-items: center; justify-content: center; gap: 40px; padding: 40px; }
.gauge { width: 180px; height: 180px; border-radius: 50%; background: conic-gradient(#22c55e 0deg 324deg, #e5e7eb 324deg); display: flex; align-items: center; justify-content: center; position: relative; }
.gauge-inner { width: 140px; height: 140px; background: #fff; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.score { font-size: 48px; font-weight: 700; color: #16a34a; }
.label { font-size: 12px; color: #64748b; }
.metrics { display: flex; flex-direction: column; gap: 12px; }
.m { display: flex; align-items: center; gap: 12px; font-size: 13px; }
.m-bar { width: 120px; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
.m-fill { height: 100%; background: #22c55e; border-radius: 4px; }
.m:nth-child(1) .m-fill { width: 95%; } .m:nth-child(2) .m-fill { width: 88%; } .m:nth-child(3) .m-fill { width: 92%; }
</style></head><body>
<div class="gauge"><div class="gauge-inner"><div class="score">92</div><div class="label">Performance</div></div></div>
<div class="metrics">
<div class="m"><span>LCP</span><div class="m-bar"><div class="m-fill"></div></div><span style="color:#16a34a;font-weight:600">1.2s</span></div>
<div class="m"><span>FID</span><div class="m-bar"><div class="m-fill"></div></div><span style="color:#16a34a;font-weight:600">45ms</span></div>
<div class="m"><span>CLS</span><div class="m-bar"><div class="m-fill"></div></div><span style="color:#16a34a;font-weight:600">0.05</span></div>
</div></body></html>`,

  'shopify-cro': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #fafafa; padding: 30px; }
.title { font-size: 14px; font-weight: 700; color: #333; margin-bottom: 20px; }
.funnel { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.step { background: linear-gradient(90deg,#fe9b21,#fc6025); color: #fff; padding: 12px 24px; border-radius: 8px; font-size: 12px; font-weight: 600; text-align: center; }
.step:nth-child(1){width:90%} .step:nth-child(2){width:70%} .step:nth-child(3){width:50%} .step:nth-child(4){width:35%;background:linear-gradient(90deg,#22c55e,#16a34a)}
.chart { position: absolute; right: 30px; top: 50%; transform: translateY(-50%); width: 200px; height: 120px; }
.bars { display: flex; align-items: flex-end; gap: 12px; height: 100px; }
.bar { width: 36px; background: linear-gradient(180deg,#fe9b21,#fc6025); border-radius: 6px 6px 0 0; }
.bar:nth-child(1){height:40%} .bar:nth-child(2){height:55%} .bar:nth-child(3){height:75%} .bar:nth-child(4){height:100%;background:linear-gradient(180deg,#22c55e,#16a34a)}
.conv { position: absolute; bottom: 0; left: 30px; font-size: 32px; font-weight: 700; color: #16a34a; }
.conv span { font-size: 14px; color: #64748b; font-weight: 500; }
</style></head><body style="position:relative">
<div class="title">Conversion Funnel</div>
<div class="funnel"><div class="step">Visitors 10,000</div><div class="step">Product Views 6,200</div><div class="step">Add to Cart 2,800</div><div class="step">Purchases 1,240</div></div>
<div class="chart"><div class="bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div></div>
<div class="conv">+34% <span>conversion rate</span></div>
</body></html>`,

  'shopify-seo': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #fff; padding: 24px; }
.search { background: #f1f3f4; border-radius: 24px; padding: 12px 20px; font-size: 14px; color: #333; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.result { padding: 14px 0; border-bottom: 1px solid #eee; }
.result.highlight { background: #f0fdf4; margin: 0 -12px; padding: 14px 12px; border-radius: 8px; border: none; }
.url { font-size: 11px; color: #16a34a; margin-bottom: 4px; }
.title { font-size: 16px; color: #1a0dab; font-weight: 500; margin-bottom: 4px; }
.desc { font-size: 12px; color: #4d5156; line-height: 1.5; }
.rank { float: right; background: #22c55e; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
</style></head><body>
<div class="search">🔍 shopify fashion store india</div>
<div class="result"><div class="url">competitor-store.com</div><div class="title">Fashion Store Online</div><div class="desc">Shop latest fashion trends...</div></div>
<div class="result highlight"><span class="rank">#1</span><div class="url">yourstore.myshopify.com</div><div class="title">Premium Fashion Store | Your Brand</div><div class="desc">Discover curated collections. Free shipping on orders above ₹999. Shop now.</div></div>
<div class="result"><div class="url">another-store.com</div><div class="title">Online Fashion Shop</div><div class="desc">Buy clothes online...</div></div>
</body></html>`,

  'custom-website-development': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #f8fafc; }
.browser { margin: 24px; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
.chrome { background: #e2e8f0; padding: 10px 14px; display: flex; gap: 6px; align-items: center; }
.dot { width: 10px; height: 10px; border-radius: 50%; } .dot.r{background:#ef4444} .dot.y{background:#eab308} .dot.g{background:#22c55e}
.url-bar { flex: 1; background: #fff; border-radius: 6px; padding: 6px 12px; font-size: 11px; color: #64748b; margin-left: 10px; }
.hero { background: linear-gradient(135deg,#1e293b,#334155); padding: 40px 30px; color: #fff; }
.hero h1 { font-size: 22px; margin-bottom: 8px; }
.hero p { font-size: 12px; opacity: 0.8; margin-bottom: 16px; }
.cta { display: inline-block; background: linear-gradient(90deg,#fe9b21,#fc6025); color: #fff; padding: 8px 18px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.features { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; padding: 20px; }
.feat { background: #f1f5f9; border-radius: 8px; padding: 14px; text-align: center; font-size: 11px; font-weight: 600; color: #475569; }
</style></head><body>
<div class="browser"><div class="chrome"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><div class="url-bar">www.yourbusiness.com</div></div>
<div class="hero"><h1>Professional Business Solutions</h1><p>Trusted by 500+ companies worldwide</p><span class="cta">Get Started</span></div>
<div class="features"><div class="feat">Services</div><div class="feat">About Us</div><div class="feat">Contact</div></div></div>
</body></html>`,

  'woocommerce-development': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #f0f0f1; display: flex; }
.wp-admin { flex: 1; background: #1d2327; color: #fff; padding: 16px; }
.wp-sidebar { width: 48px; background: #1d2327; border-right: 1px solid #2c3338; }
.menu { font-size: 11px; padding: 8px 0; color: #a7aaad; }
.menu.active { color: #72aee6; background: #2271b1; margin: 0 -16px; padding: 8px 16px; }
.content { flex: 2; background: #fff; margin: 16px; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.wc-logo { color: #96588a; font-weight: 700; font-size: 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
.stat { background: #f6f7f7; border-radius: 8px; padding: 14px; }
.stat-val { font-size: 20px; font-weight: 700; color: #96588a; }
.stat-label { font-size: 10px; color: #646970; }
</style></head><body>
<aside class="wp-sidebar"></aside>
<div class="wp-admin"><div class="menu active">WooCommerce</div><div class="menu">Products</div><div class="menu">Orders</div><div class="menu">Analytics</div></div>
<div class="content"><div class="wc-logo">W WooCommerce Dashboard</div><div class="stats"><div class="stat"><div class="stat-val">₹2.4L</div><div class="stat-label">Net Sales</div></div><div class="stat"><div class="stat-val">186</div><div class="stat-label">Orders</div></div><div class="stat"><div class="stat-val">1,240</div><div class="stat-label">Products</div></div></div></div>
</body></html>`,

  'mobile-app-development': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: linear-gradient(135deg,#667eea,#764ba2); display: flex; align-items: center; justify-content: center; }
.phone { width: 220px; height: 440px; background: #1a1a1a; border-radius: 32px; padding: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
.screen { width: 100%; height: 100%; background: #fff; border-radius: 24px; overflow: hidden; }
.app-header { background: linear-gradient(135deg,#fe9b21,#fc6025); padding: 40px 16px 20px; color: #fff; }
.app-header h2 { font-size: 16px; margin-bottom: 4px; }
.app-header p { font-size: 10px; opacity: 0.9; }
.products { padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.prod { background: #f5f5f5; border-radius: 8px; aspect-ratio: 1; }
.nav { position: absolute; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #eee; display: flex; justify-content: space-around; padding: 10px; font-size: 18px; }
</style></head><body>
<div class="phone"><div class="screen" style="position:relative">
<div class="app-header"><h2>Shop Now</h2><p>Free delivery on all orders</p></div>
<div class="products"><div class="prod"></div><div class="prod"></div><div class="prod"></div><div class="prod"></div></div>
<div class="nav">🏠 🛒 ❤️ 👤</div>
</div></div></body></html>`,

  'meta-ads-management': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #f0f2f5; padding: 20px; }
.header { display: flex; gap: 12px; margin-bottom: 16px; }
.tab { background: #1877f2; color: #fff; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; }
.tab.ig { background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); }
.metrics { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 16px; }
.m { background: #fff; border-radius: 10px; padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.m-val { font-size: 18px; font-weight: 700; color: #1877f2; }
.m-label { font-size: 10px; color: #65676b; }
.chart-area { background: #fff; border-radius: 10px; padding: 16px; height: 180px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.line-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding-top: 20px; }
.lbar { flex: 1; background: linear-gradient(180deg,#1877f2,#42b72a); border-radius: 4px 4px 0 0; opacity: 0.8; }
.lbar:nth-child(1){height:30%}.lbar:nth-child(2){height:45%}.lbar:nth-child(3){height:55%}.lbar:nth-child(4){height:70%}.lbar:nth-child(5){height:85%}.lbar:nth-child(6){height:100%}
.roas { position: absolute; top: 20px; right: 20px; background: #42b72a; color: #fff; padding: 8px 14px; border-radius: 8px; font-size: 14px; font-weight: 700; }
</style></head><body style="position:relative">
<span class="roas">ROAS 4.2x</span>
<div class="header"><span class="tab">Facebook Ads</span><span class="tab ig">Instagram Ads</span></div>
<div class="metrics"><div class="m"><div class="m-val">₹1.2L</div><div class="m-label">Ad Spend</div></div><div class="m"><div class="m-val">₹5.1L</div><div class="m-label">Revenue</div></div><div class="m"><div class="m-val">2.4K</div><div class="m-label">Conversions</div></div><div class="m"><div class="m-val">₹48</div><div class="m-label">Cost/Conv</div></div></div>
<div class="chart-area"><div class="line-chart"><div class="lbar"></div><div class="lbar"></div><div class="lbar"></div><div class="lbar"></div><div class="lbar"></div><div class="lbar"></div></div></div>
</body></html>`,

  'google-ads-management': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #fff; padding: 20px; font-family: 'Google Sans', Inter, sans-serif; }
.g-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-size: 18px; font-weight: 500; }
.g-logo span:nth-child(1){color:#4285f4} .g-logo span:nth-child(2){color:#ea4335} .g-logo span:nth-child(3){color:#fbbc04} .g-logo span:nth-child(4){color:#4285f4} .g-logo span:nth-child(5){color:#34a853}
.tabs { display: flex; gap: 4px; margin-bottom: 16px; }
.tab { padding: 8px 14px; font-size: 12px; border-radius: 4px; color: #5f6368; }
.tab.active { background: #e8f0fe; color: #1a73e8; font-weight: 600; }
.stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 16px; }
.s { border: 1px solid #dadce0; border-radius: 8px; padding: 14px; }
.s-val { font-size: 20px; font-weight: 500; color: #202124; }
.s-label { font-size: 11px; color: #5f6368; }
.chart { height: 140px; background: #f8f9fa; border-radius: 8px; padding: 16px; display: flex; align-items: flex-end; gap: 6px; }
.cbar { flex: 1; background: #4285f4; border-radius: 2px 2px 0 0; opacity: 0.7; }
.cbar:nth-child(odd){background:#34a853}
</style></head><body>
<div class="g-logo"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span> Ads</div>
<div class="tabs"><span class="tab active">Search</span><span class="tab">Shopping</span><span class="tab">Performance Max</span></div>
<div class="stats"><div class="s"><div class="s-val">12.4K</div><div class="s-label">Clicks</div></div><div class="s"><div class="s-val">3.2%</div><div class="s-label">CTR</div></div><div class="s"><div class="s-val">₹18</div><div class="s-label">Avg CPC</div></div><div class="s"><div class="s-val">486</div><div class="s-label">Conversions</div></div></div>
<div class="chart"><div class="cbar" style="height:40%"></div><div class="cbar" style="height:55%"></div><div class="cbar" style="height:45%"></div><div class="cbar" style="height:70%"></div><div class="cbar" style="height:85%"></div><div class="cbar" style="height:100%"></div></div>
</body></html>`,

  'seo-services': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: #f8fafc; padding: 24px; display: flex; gap: 24px; align-items: center; }
.left { flex: 1; }
.kw { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; }
.kw-rank { background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
.right { flex: 1; background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.graph { height: 100px; display: flex; align-items: flex-end; gap: 6px; margin-top: 12px; }
.gbar { flex: 1; background: linear-gradient(180deg,#fe9b21,#fc6025); border-radius: 4px 4px 0 0; }
.gbar:nth-child(1){height:25%}.gbar:nth-child(2){height:35%}.gbar:nth-child(3){height:50%}.gbar:nth-child(4){height:65%}.gbar:nth-child(5){height:80%}.gbar:nth-child(6){height:100%}
.title { font-size: 13px; font-weight: 700; color: #334155; }
</style></head><body>
<div class="left"><div class="title" style="margin-bottom:12px">🔍 Keyword Rankings</div>
<div class="kw">shopify development india <span class="kw-rank">#3</span></div>
<div class="kw">custom ecommerce website <span class="kw-rank">#5</span></div>
<div class="kw">shopify store design <span class="kw-rank">#2</span></div></div>
<div class="right"><div class="title">Organic Traffic Growth</div><div class="graph"><div class="gbar"></div><div class="gbar"></div><div class="gbar"></div><div class="gbar"></div><div class="gbar"></div><div class="gbar"></div></div></div>
</body></html>`,

  'social-media-marketing': `<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" rel="stylesheet">
<style>${baseStyles}
body { background: linear-gradient(135deg,#fdf2f8,#fce7f3); padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.post { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.post-head { padding: 10px 12px; display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; }
.avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#fe9b21,#fc6025); }
.post-img { height: 100px; background: linear-gradient(135deg,#667eea,#764ba2); }
.post-img.warm { background: linear-gradient(135deg,#fe9b21,#f12a33); }
.engagement { padding: 10px 12px; font-size: 10px; color: #64748b; display: flex; gap: 12px; }
.notif { position: absolute; top: 16px; right: 16px; background: #ef4444; color: #fff; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
</style></head><body style="position:relative">
<span class="notif">+2.4K engagement</span>
<div class="post"><div class="post-head"><div class="avatar"></div>@yourbrand</div><div class="post-img warm"></div><div class="engagement">❤️ 1.2K · 💬 89 · ↗️ Share</div></div>
<div class="post"><div class="post-head"><div class="avatar"></div>@yourbrand</div><div class="post-img"></div><div class="engagement">❤️ 856 · 💬 42 · ↗️ Share</div></div>
<div class="post"><div class="post-head"><div class="avatar"></div>LinkedIn</div><div class="post-img" style="height:80px;background:#0a66c2"></div><div class="engagement">👍 324 · 💬 18</div></div>
<div class="post"><div class="post-head"><div class="avatar"></div>Reels</div><div class="post-img warm" style="height:80px"></div><div class="engagement">▶️ 5.2K views</div></div>
</body></html>`,
};

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const slugs = Object.keys(mockups);

  for (const slug of slugs) {
    const dest = path.join(OUT_DIR, `${slug}.jpg`);
    if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 15000) {
      console.log(`  skip ${slug}.jpg`);
      continue;
    }

    process.stdout.write(`  generating ${slug}.jpg... `);
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
      await page.setContent(mockups[slug], { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: dest, type: 'jpeg', quality: 88, fullPage: false });
      console.log(`ok (${Math.round(fs.statSync(dest).size / 1024)} KB)`);
    } catch (err) {
      console.log(`failed: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\nGenerated ${slugs.length} service images in assets/images/services/`);
}

main();
