const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
const ROOT = path.join(__dirname, '..');

function cleanGeneratedHtml() {
  if (!fs.existsSync(OUT)) return;

  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        if (!fs.readdirSync(fullPath).length) fs.rmdirSync(fullPath);
      } else if (entry.name.endsWith('.html')) {
        fs.unlinkSync(fullPath);
      }
    }
  };

  walk(OUT);
  console.log('  ✓ removed stale generated HTML files');
}

function copyStaticAssets() {
  const assetDirs = [
    { from: 'css', ext: '.css' },
    { from: 'js', ext: '.js' },
  ];

  for (const { from, ext } of assetDirs) {
    const srcDir = path.join(ROOT, 'assets', from);
    const destDir = path.join(OUT, 'assets', from);
    if (!fs.existsSync(srcDir)) continue;

    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
      if (!file.endsWith(ext)) continue;
      fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
      console.log(`  ✓ assets/${from}/${file}`);
    }
  }
}

function copyPhpApi() {
  const srcDir = path.join(ROOT, 'api');
  const destDir = path.join(OUT, 'api');
  if (!fs.existsSync(srcDir)) return;

  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    if (!file.endsWith('.php')) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`  ✓ api/${file}`);
  }
}

function copyTechLogos() {
  const srcDir = path.join(ROOT, 'assets', 'images', 'tech');
  const destDir = path.join(OUT, 'assets', 'images', 'tech');
  if (!fs.existsSync(srcDir)) return;

  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`  ✓ assets/images/tech/${file}`);
  }
}

function copyPortfolioImages() {
  const srcDir = path.join(ROOT, 'assets', 'images', 'portfolio');
  const destDir = path.join(OUT, 'assets', 'images', 'portfolio');
  if (!fs.existsSync(srcDir)) return;

  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`  ✓ assets/images/portfolio/${file}`);
  }
}

function copyIndustryImages() {
  const srcDir = path.join(ROOT, 'assets', 'images', 'industries');
  const destDir = path.join(OUT, 'assets', 'images', 'industries');
  if (!fs.existsSync(srcDir)) return;

  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`  ✓ assets/images/industries/${file}`);
  }
}

function copyGalleryImages() {
  const srcDir = path.join(ROOT, 'assets', 'images', 'gallery');
  const destDir = path.join(OUT, 'assets', 'images', 'gallery');
  if (!fs.existsSync(srcDir)) return;

  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`  ✓ assets/images/gallery/${file}`);
  }
}

function copyBlogImages() {
  const srcDir = path.join(ROOT, 'assets', 'images', 'blog');
  const destDir = path.join(OUT, 'assets', 'images', 'blog');
  if (!fs.existsSync(srcDir)) return;

  fs.mkdirSync(destDir, { recursive: true });
  let count = 0;
  for (const file of fs.readdirSync(srcDir)) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    count++;
  }
  if (count) console.log(`  ✓ assets/images/blog/ (${count} images)`);
}

function copyServiceImages() {
  const srcDir = path.join(ROOT, 'assets', 'images', 'services');
  const destDir = path.join(OUT, 'assets', 'images', 'services');
  if (!fs.existsSync(srcDir)) return;

  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`  ✓ assets/images/services/${file}`);
  }
}

function copyStaticImages() {
  const srcDir = path.join(ROOT, 'assets', 'images');
  const destDir = path.join(OUT, 'assets', 'images');
  if (!fs.existsSync(srcDir)) return;

  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    if (file === 'logo-source.png' || file === 'logo.png') continue;
    if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`  ✓ assets/images/${file}`);
  }
}

function copyFavicon() {
  const src = path.join(ROOT, 'assets', 'images', 'favicon.png');
  if (!fs.existsSync(src)) return;

  const assetDest = path.join(OUT, 'assets', 'images', 'favicon.png');
  const rootDest = path.join(OUT, 'favicon.png');
  fs.mkdirSync(path.dirname(assetDest), { recursive: true });
  fs.copyFileSync(src, assetDest);
  fs.copyFileSync(src, rootDest);
  console.log('  ✓ assets/images/favicon.png');
  console.log('  ✓ favicon.png');
}

function copyLogo() {
  const script = path.join(ROOT, 'scripts', 'make-logo-transparent.py');
  const src = path.join(ROOT, 'assets', 'images', 'logo-source.png');
  const fallbackSrc = path.join(ROOT, 'assets', 'images', 'logo.png');
  const dest = path.join(OUT, 'assets', 'images', 'logo.png');

  if (fs.existsSync(script) && fs.existsSync(src)) {
    try {
      require('child_process').execSync(`python "${script}"`, { stdio: 'inherit' });
    } catch (_) {
      // Fall back to copying existing logo if script fails
    }
  }

  if (!fs.existsSync(dest) && fs.existsSync(fallbackSrc)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(fallbackSrc, dest);
  }

  if (fs.existsSync(dest)) {
    console.log('  ✓ assets/images/logo.png');
  }
}

const { homePage } = require('./pages/home');
const { aboutPage } = require('./pages/about');
const { allServicePages } = require('./pages/services');
const { contactPage } = require('./pages/contact');
const { portfolioPage, caseStudiesPage, allCaseStudyPages } = require('./pages/portfolio');
const { galleryPage } = require('./pages/gallery');
const { pricingPage, industriesPage, faqPage } = require('./pages/misc');
const { blogPage, allBlogPostPages } = require('./pages/blog');
const { allPolicyPages } = require('./pages/policies');
const { allLocationPages, locationsIndexPage, serviceIndexPage } = require('./pages/locations');
const locationServices = require('./data/location-services');
const { loadCities } = require('./lib/cities');

function writePage(relativePath, html, quiet = false) {
  const filePath = path.join(OUT, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, 'utf8');
  if (!quiet) console.log(`  ✓ ${relativePath}`);
}

function generateLocationSitemapEntries(base, lastmod) {
  const cities = loadCities();
  const entries = [
    { path: '/locations/', changefreq: 'weekly', priority: '0.8' },
    ...locationServices.map(s => ({
      path: `/locations/${s.folder}/`,
      changefreq: 'weekly',
      priority: '0.7',
    })),
  ];

  for (const service of locationServices) {
    for (const city of cities) {
      entries.push({
        path: `/locations/${service.folder}/${service.slug}-${city.slug}.html`,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod,
      });
    }
  }

  return entries;
}

function generateLocationReport(stats) {
  const reportDir = path.join(ROOT, 'reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'location-generation-report.md');
  const lines = [
    '# Location Generation Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Summary',
    '',
    `- **Pages Generated:** ${stats.pagesGenerated}`,
    `- **Cities:** ${stats.cities}`,
    `- **Services:** ${stats.services}`,
    `- **Execution Time:** ${stats.executionTimeSec}s`,
    `- **Average Word Count:** ${stats.avgWordCount}`,
    `- **Min Word Count:** ${stats.minWordCount}`,
    `- **Max Word Count:** ${stats.maxWordCount}`,
    `- **Pages Below 1500 Words:** ${stats.belowTarget}`,
    '',
    '## Errors',
    '',
    stats.errors.length ? stats.errors.map(e => `- ${e}`).join('\n') : '- None',
    '',
    '## Warnings',
    '',
    stats.warnings.length ? stats.warnings.map(w => `- ${w}`).join('\n') : '- None',
    '',
    '## Output Structure',
    '',
    '```',
    'out/locations/',
    '  shopify-development/',
    '  website-development/',
    '  woocommerce/',
    '  seo/',
    '  google-ads/',
    '  meta-ads/',
    '  flutter-development/',
    '  maintenance/',
    '```',
    '',
    '## Sample Pages',
    '',
    ...stats.samples.map(s => `- \`${s.path}\` (${s.wordCount} words)`),
    '',
  ];
  fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
  console.log(`  ✓ reports/location-generation-report.md`);
}

function generateSitemap(locationEntries = []) {
  const site = require('./data/site');
  const services = require('./data/services');
  const base = site.company.website.replace(/\/$/, '');
  const lastmod = new Date().toISOString().slice(0, 10);

  const entries = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/about/', changefreq: 'monthly', priority: '0.9' },
    { path: '/contact/', changefreq: 'monthly', priority: '0.9' },
    { path: '/portfolio/', changefreq: 'weekly', priority: '0.9' },
    { path: '/gallery/', changefreq: 'weekly', priority: '0.9' },
    { path: '/case-studies/', changefreq: 'monthly', priority: '0.8' },
    { path: '/industries/', changefreq: 'monthly', priority: '0.8' },
    { path: '/pricing/', changefreq: 'monthly', priority: '0.8' },
    { path: '/blog/', changefreq: 'weekly', priority: '0.8' },
    { path: '/faq/', changefreq: 'monthly', priority: '0.7' },
    ...services.map(s => ({
      path: `/services/${s.slug}/`,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    ...site.caseStudies.map(cs => ({
      path: `/case-studies/${cs.slug}/`,
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...site.blogPosts.map(p => ({
      path: `/blog/${p.slug}/`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: p.date || lastmod,
    })),
    ...locationEntries,
    { path: '/privacy-policy/', changefreq: 'yearly', priority: '0.3' },
    { path: '/terms-and-conditions/', changefreq: 'yearly', priority: '0.3' },
    { path: '/refund-policy/', changefreq: 'yearly', priority: '0.3' },
    { path: '/shipping-policy/', changefreq: 'yearly', priority: '0.3' },
    { path: '/cookies-policy/', changefreq: 'yearly', priority: '0.3' },
    { path: '/disclaimer/', changefreq: 'yearly', priority: '0.3' },
  ];

  const urls = entries.map(entry => {
    const loc = entry.path === '/' ? base : `${base}${entry.path}`;
    const mod = entry.lastmod || lastmod;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${mod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function generateRobots() {
  const site = require('./data/site');
  const base = site.company.website.replace(/\/$/, '');
  return `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
}

console.log('Building Aalphaleo Digital Solution website...\n');

cleanGeneratedHtml();
copyLogo();
copyFavicon();
copyStaticAssets();
copyPhpApi();
copyStaticImages();
copyPortfolioImages();
copyIndustryImages();
copyGalleryImages();
copyServiceImages();
copyBlogImages();
copyTechLogos();

writePage('index.html', homePage());
writePage('about/index.html', aboutPage());
writePage('contact/index.html', contactPage());
writePage('portfolio/index.html', portfolioPage());
writePage('gallery/index.html', galleryPage());
writePage('case-studies/index.html', caseStudiesPage());
writePage('pricing/index.html', pricingPage());
writePage('industries/index.html', industriesPage());
writePage('faq/index.html', faqPage());
writePage('blog/index.html', blogPage());

allServicePages().forEach(p => writePage(p.path, p.html));
allCaseStudyPages().forEach(p => writePage(p.path, p.html));
allBlogPostPages().forEach(p => writePage(p.path, p.html));
allPolicyPages().forEach(p => writePage(p.path, p.html));

console.log('\nGenerating location pages...');
const locationStart = Date.now();
const siteData = require('./data/site');
const locationPages = allLocationPages(siteData.blogPosts);
const locationStats = {
  pagesGenerated: 0,
  cities: loadCities().length,
  services: locationServices.length,
  errors: [],
  warnings: [],
  wordCounts: [],
  samples: [],
};

writePage('locations/index.html', locationsIndexPage());
locationServices.forEach(s => writePage(`locations/${s.folder}/index.html`, serviceIndexPage(s)));

let batch = 0;
for (const page of locationPages) {
  try {
    writePage(page.path, page.html, true);
    locationStats.pagesGenerated++;
    locationStats.wordCounts.push(page.wordCount);
    if (locationStats.samples.length < 8) {
      locationStats.samples.push({ path: page.path, wordCount: page.wordCount });
    }
    batch++;
    if (batch % 500 === 0) console.log(`  … ${batch}/${locationPages.length} location pages`);
  } catch (err) {
    locationStats.errors.push(`${page.path}: ${err.message}`);
  }
}
console.log(`  ✓ locations/ (${locationPages.length} city pages + hub pages)`);

const wc = locationStats.wordCounts;
const avgWordCount = wc.length ? Math.round(wc.reduce((a, b) => a + b, 0) / wc.length) : 0;
const minWordCount = wc.length ? Math.min(...wc) : 0;
const maxWordCount = wc.length ? Math.max(...wc) : 0;
const belowTarget = wc.filter(n => n < 1500).length;
if (belowTarget) {
  locationStats.warnings.push(`${belowTarget} pages are below the 1500-word target`);
}

locationStats.executionTimeSec = ((Date.now() - locationStart) / 1000).toFixed(1);
locationStats.avgWordCount = avgWordCount;
locationStats.minWordCount = minWordCount;
locationStats.maxWordCount = maxWordCount;
locationStats.belowTarget = belowTarget;
generateLocationReport(locationStats);

const lastmod = new Date().toISOString().slice(0, 10);
const base = siteData.company.website.replace(/\/$/, '');
writePage('sitemap.xml', generateSitemap(generateLocationSitemapEntries(base, lastmod)));
writePage('robots.txt', generateRobots());

const pageCount = fs.readdirSync(OUT, { recursive: true }).filter(f => String(f).endsWith('.html')).length;
console.log(`\nBuild complete! ${pageCount} HTML pages generated in out/`);
