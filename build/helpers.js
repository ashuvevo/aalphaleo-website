const site = require('./data/site');
const fs = require('fs');
const path = require('path');

function assetPath(depth, pathStr) {
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  return `${prefix}${pathStr}`;
}

function portfolioSlug(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').replace(/\./g, '-');
  } catch {
    return 'portfolio-project';
  }
}

function portfolioPreviewSrc(depth, project) {
  const slug = portfolioSlug(project.url);
  const relative = `assets/images/portfolio/${slug}.jpg`;
  const localPath = path.join(__dirname, '..', 'assets', 'images', 'portfolio', `${slug}.jpg`);
  if (fs.existsSync(localPath)) {
    return assetPath(depth, relative);
  }
  return `https://image.thum.io/get/width/800/crop/450/noanimate/${encodeURIComponent(project.url)}`;
}

function portfolioPreviewImage(depth, project) {
  const src = portfolioPreviewSrc(depth, project);
  const fallback = `https://image.thum.io/get/width/800/crop/450/noanimate/${encodeURIComponent(project.url)}`;
  return `<img src="${src}" alt="${escapeHtml(project.title)} homepage preview" class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" width="800" height="450" loading="lazy" decoding="async" onerror="if(this.dataset.fb!=='1'){this.dataset.fb='1';this.src='${fallback}';}">`;
}

function pageUrl(depth, href) {
  if (!href || href.startsWith('#') || href.startsWith('http')) return href;
  if (href === '/') {
    return depth === 0 ? './' : '../'.repeat(depth).replace(/\/$/, '') || './';
  }
  const relative = href.startsWith('/') ? href.slice(1) : href;
  return depth === 0 ? relative : `${'../'.repeat(depth)}${relative}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function icon(name, cls = 'w-5 h-5') {
  return `<i data-lucide="${name}" class="${cls}" aria-hidden="true"></i>`;
}

function stars(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    `<i data-lucide="star" class="w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-border'}" aria-hidden="true"></i>`
  ).join('');
}

function sectionHeading(eyebrow, title, desc = '', center = true) {
  const align = center ? 'text-center mx-auto' : '';
  const eyebrowHtml = eyebrow
    ? `<span class="section-eyebrow">${escapeHtml(eyebrow)}</span>`
    : '';
  return `
    <div class="mb-12 ${align}" data-aos="fade-up">
      ${eyebrowHtml}
      <h2 class="section-title ${center ? 'mx-auto' : ''}">${title}</h2>
      ${desc ? `<p class="section-desc ${center ? 'mx-auto' : ''}">${escapeHtml(desc)}</p>` : ''}
    </div>`;
}

function serviceImagePath(depth, slug) {
  return assetPath(depth, `assets/images/services/${slug}.jpg`);
}

function serviceShowcaseSection(depth, {
  eyebrow,
  title,
  description,
  href,
  slug,
  iconName,
  features,
  reverse = false,
  ctaLabel = 'Explore Service',
}) {
  const imageSrc = serviceImagePath(depth, slug);
  const serviceUrl = pageUrl(depth, href);
  const reverseClass = reverse ? 'service-showcase__grid--reverse' : '';
  const featureItems = features.map(f => `
    <div class="service-showcase__feature" data-aos="fade-up">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange/10">
        ${icon(f.icon || 'check', 'w-4 h-4 text-orange')}
      </div>
      <div>
        <p class="text-sm font-semibold text-primary">${escapeHtml(f.title)}</p>
        <p class="mt-0.5 text-xs text-muted sm:text-sm">${escapeHtml(f.desc)}</p>
      </div>
    </div>`).join('');

  return `
    <section class="service-showcase section-padding ${reverse ? 'bg-bg' : 'bg-white'}" aria-label="${escapeHtml(title)}">
      <div class="container-custom">
        <div class="service-showcase__grid ${reverseClass}">
          <div class="service-showcase__visual" data-aos="${reverse ? 'fade-left' : 'fade-right'}">
            <div class="service-showcase__image-wrap">
              <img src="${imageSrc}" alt="${escapeHtml(title)} — ${escapeHtml(site.company.name)}" class="service-showcase__image" width="960" height="640" loading="lazy" decoding="async">
            </div>
          </div>
          <div class="service-showcase__content" data-aos="${reverse ? 'fade-right' : 'fade-left'}">
            <span class="section-eyebrow">${escapeHtml(eyebrow)}</span>
            <h2 class="section-title mt-2">${title}</h2>
            <p class="section-desc !mx-0 mt-4">${escapeHtml(description)}</p>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">${featureItems}</div>
            <a href="${serviceUrl}" class="btn-primary mt-8">
              ${icon(iconName, 'w-5 h-5')} ${escapeHtml(ctaLabel)}
            </a>
          </div>
        </div>
      </div>
    </section>`;
}

function aboutPreviewSection(depth) {
  const aboutUrl = pageUrl(depth, '/about/');
  const contactUrl = pageUrl(depth, '/contact/');
  return `
    <section class="about-editorial section-padding bg-bg" aria-label="About Aalphaleo">
      <div class="container-custom">
        <div class="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <span class="section-eyebrow">About Us</span>
          <h2 class="section-title mt-2">Built for Businesses That Want to <span class="gradient-text">Grow Online</span></h2>
          <p class="mt-5 text-lg leading-relaxed text-muted">${escapeHtml(site.company.name)} helps brands launch and scale with custom Shopify stores, high-performance websites, mobile apps, and data-driven marketing.</p>
          <p class="mt-4 text-muted">We combine strategy, design, and engineering to solve real business problems — not just deliver pretty pages. Every project is tailored, conversion-focused, and built for long-term growth.</p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <a href="${aboutUrl}" class="btn-primary">Learn About Us</a>
            <a href="${contactUrl}" class="btn-secondary">Start Your Project</a>
          </div>
        </div>
      </div>
    </section>`;
}

function ctaBanner(depth, heading, copy, primaryLabel = 'Start Your Project', secondaryLabel = 'WhatsApp Us') {
  const contactUrl = pageUrl(depth, '/contact/');
  const waUrl = `https://wa.me/${site.company.whatsapp}?text=Hi%20Aalphaleo%2C%20I%27d%20like%20to%20discuss%20a%20project.`;
  const phoneHref = `tel:${site.company.phone.replace(/\s/g, '')}`;
  return `
    <section class="cta-premium" aria-label="Call to action">
      <div class="container-custom">
        <div class="neu-cta" data-aos="fade-up">
          <span class="badge-glass mb-4">Let's Work Together</span>
          <h2 class="section-title-lg">${escapeHtml(heading)}</h2>
          <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">${escapeHtml(copy)}</p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="${contactUrl}" class="btn-primary">${escapeHtml(primaryLabel)}</a>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary">${icon('message-circle', 'w-5 h-5')} ${escapeHtml(secondaryLabel)}</a>
          </div>
          <p class="mt-6 text-sm text-muted">
            Call / WhatsApp:
            <a href="${phoneHref}" class="font-medium text-accent hover:text-accent-light">${site.company.phone}</a>
          </p>
        </div>
      </div>
    </section>`;
}

function breadcrumbs(depth, items, { includeSchema = true } = {}) {
  const crumbs = items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast) return `<li class="text-muted" aria-current="page">${escapeHtml(item.label)}</li>`;
    return `<li><a href="${pageUrl(depth, item.href)}" class="text-orange hover:text-secondary hover:underline">${escapeHtml(item.label)}</a></li>`;
  }).join('<li aria-hidden="true" class="text-muted">/</li>');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${site.company.website}${item.href}`,
    })),
  };

  return `
    <nav aria-label="Breadcrumb" class="bg-bg py-3">
      <div class="container-custom">
        <ol class="flex flex-wrap items-center gap-2 text-sm">${crumbs}</ol>
      </div>
    </nav>
    ${includeSchema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ''}`;
}

function faqSection(faqs, id = 'faq', { includeSchema = true } = {}) {
  const items = faqs.map((f, i) => `
    <div class="faq-item mb-4" data-aos="fade-up" data-aos-delay="${i * 50}">
      <button class="faq-trigger flex w-full items-center justify-between py-5 text-left font-medium text-primary" aria-expanded="false" aria-controls="${id}-panel-${i}">
        <span>${escapeHtml(f.q)}</span>
        ${icon('chevron-down', 'w-5 h-5 shrink-0 transition-transform duration-300')}
      </button>
      <div id="${id}-panel-${i}" class="faq-panel hidden pb-5 text-muted" role="region">
        <p>${escapeHtml(f.a)}</p>
      </div>
    </div>`).join('');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return `
    <section class="section-padding bg-bg border-t border-border" id="${id}">
      <div class="container-custom max-w-3xl">
        ${sectionHeading('FAQ', 'Frequently Asked Questions', 'Got questions? We have answers.')}
        <div>${items}</div>
      </div>
    </section>
    ${includeSchema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ''}`;
}

function statsSection() {
  const items = site.stats.map((s, i) => `
    <div class="stats-card" data-aos="fade-up" data-aos-delay="${i * 100}">
      <div class="stats-icon">${icon(s.icon, 'w-6 h-6')}</div>
      <div class="stats-value">
        <span class="counter gradient-text" data-target="${s.value}" data-suffix="${escapeHtml(s.suffix)}">0${escapeHtml(s.suffix)}</span>
      </div>
      <p class="stats-label">${escapeHtml(s.label)}</p>
    </div>`).join('');

  return `
    <section class="stats-section section-padding" aria-label="Statistics">
      <div class="container-custom relative">
        <div class="stats-grid">${items}</div>
      </div>
    </section>`;
}

function galleryPreviewSrc(depth, item) {
  return assetPath(depth, `assets/images/gallery/${item.slug}.jpg`);
}

function galleryPreviewImage(depth, item) {
  const src = galleryPreviewSrc(depth, item);
  return `<img src="${src}" alt="${escapeHtml(item.title)} homepage design concept" class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" width="1280" height="900" loading="lazy" decoding="async">`;
}

function getShopifyGalleryItems() {
  return (site.shopifyGalleryDesigns || []).map(item => ({
    ...item,
    galleryCategory: item.category,
  }));
}

function galleryCard(depth, item, delay = 0) {
  const src = galleryPreviewSrc(depth, item);
  const contactUrl = `${pageUrl(depth, '/contact/')}?design=${encodeURIComponent(item.slug)}`;
  return `
    <article class="gallery-item group overflow-hidden rounded-card border border-border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift" data-category="${item.galleryCategory}" data-aos="fade-up" data-aos-delay="${delay}">
      <button type="button" class="gallery-trigger block w-full cursor-zoom-in text-left" data-gallery-src="${escapeHtml(src)}" data-gallery-title="${escapeHtml(item.title)}" data-gallery-style="${escapeHtml(item.style)}" data-gallery-url="${escapeHtml(contactUrl)}" aria-label="Preview ${escapeHtml(item.title)} homepage design">
        <div class="relative aspect-[4/3] overflow-hidden bg-border">
          ${galleryPreviewImage(depth, item)}
          <div class="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-all duration-300 group-hover:bg-primary/45 group-hover:opacity-100">
            ${icon('zoom-in', 'w-8 h-8 text-white drop-shadow')}
          </div>
        </div>
        <div class="p-3 sm:p-4">
          <span class="badge text-[10px] sm:text-xs">${escapeHtml(item.label)}</span>
          <h3 class="mt-1.5 text-sm font-semibold text-primary sm:mt-2 sm:text-base">${escapeHtml(item.title)}</h3>
          <p class="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">${escapeHtml(item.style)}</p>
        </div>
      </button>
    </article>`;
}

function galleryLightboxMarkup() {
  return `
    <div id="gallery-lightbox" class="gallery-lightbox hidden" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Shopify design preview">
      <div class="gallery-lightbox-backdrop" data-gallery-close tabindex="-1"></div>
      <div class="gallery-lightbox-panel" role="document">
        <button type="button" class="gallery-lightbox-close" data-gallery-close aria-label="Close preview">${icon('x', 'w-5 h-5')}</button>
        <div class="gallery-lightbox-image-wrap">
          <img id="gallery-lightbox-img" src="" alt="" class="gallery-lightbox-image" width="1280" height="900">
        </div>
        <div class="gallery-lightbox-meta">
          <div>
            <p id="gallery-lightbox-style" class="text-sm font-medium text-orange"></p>
            <h3 id="gallery-lightbox-title" class="text-xl font-bold text-primary"></h3>
          </div>
          <a id="gallery-lightbox-link" href="#" class="btn-text shrink-0">Get Similar Design ${icon('arrow-right', 'w-4 h-4')}</a>
        </div>
      </div>
    </div>`;
}

function gallerySection(depth) {
  const items = getShopifyGalleryItems();
  const featuredItems = (site.galleryFeatured || [])
    .map(slug => items.find(i => i.slug === slug))
    .filter(Boolean)
    .slice(0, 8);
  const cards = featuredItems.map((item, i) => galleryCard(depth, item, i * 60)).join('');
  const galleryUrl = pageUrl(depth, '/gallery/');

  return `
    <section class="section-padding bg-bg" aria-label="Shopify design gallery">
      <div class="container-custom">
        ${sectionHeading('Design Gallery', 'Shopify Homepage Designs', 'Explore custom homepage concepts — hero layouts, product grids, and conversion-focused UI for fashion, beauty, and e-commerce.')}
        <div class="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">${cards}</div>
        <div class="mt-8 text-center">
          <a href="${galleryUrl}" class="btn-secondary">View Full Design Gallery</a>
        </div>
      </div>
    </section>
    ${galleryLightboxMarkup()}`;
}

function processTimeline() {
  const items = site.processSteps.map((s, i) => `
    <div class="process-step shrink-0 md:shrink" data-aos="fade-up" data-aos-delay="${i * 60}">
      <div class="process-step__num">${s.step}</div>
      <h3 class="mb-1.5 text-sm font-semibold text-primary sm:text-base">${escapeHtml(s.title)}</h3>
      <p class="max-w-[180px] text-xs leading-relaxed text-muted sm:text-sm">${escapeHtml(s.desc)}</p>
    </div>`).join('');

  return `
    <section class="section-padding bg-bg">
      <div class="container-custom">
        ${sectionHeading('Our Process', 'How We Work', 'A proven process from discovery to growth — designed to deliver clarity, quality, and measurable results.')}
        <div class="process-track">
          <div class="process-scroll">${items}</div>
        </div>
      </div>
    </section>`;
}

function whatsappButton() {
  return `
    <a href="https://wa.me/${site.company.whatsapp}?text=Hi%20Aalphaleo%2C%20I%27d%20like%20to%20discuss%20a%20project."
       class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lift"
       target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
      ${icon('message-circle', 'w-6 h-6')}
    </a>`;
}

function footerLocationsSection(depth) {
  const { loadCities } = require('./lib/cities');
  const locationServices = require('./data/location-services');
  const featuredCities = loadCities().filter(c => c.tier === 1).slice(0, 16);

  const cityLinks = featuredCities.map(city => `
    <a href="${pageUrl(depth, `/locations/shopify-development/shopify-development-${city.slug}.html`)}"
       class="footer-location-pill">${escapeHtml(city.name)}</a>`).join('');

  const serviceLinks = locationServices.map(service => `
    <li>
      <a href="${pageUrl(depth, `/locations/${service.folder}/`)}"
         class="text-sm text-muted transition-colors hover:text-accent">
        ${escapeHtml(service.title)}
      </a>
    </li>`).join('');

  return `
    <section class="bg-bg" aria-label="Locations we serve">
      <div class="container-custom py-10 md:py-12">
        <div class="mx-auto max-w-3xl text-center">
          <span class="section-eyebrow">Locations</span>
          <h2 class="text-2xl font-bold text-primary md:text-3xl">Digital Services Across India</h2>
          <p class="mt-3 text-sm text-muted md:text-base">Shopify development, websites, SEO, Google Ads, Meta Ads, Flutter apps, and maintenance in 500+ cities nationwide.</p>
        </div>
        <div class="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div class="lg:col-span-3">
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Popular Cities</h3>
            <div class="flex flex-wrap gap-2">${cityLinks}</div>
          </div>
          <div class="lg:col-span-2">
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Services by Location</h3>
            <ul class="grid grid-cols-2 gap-x-4 gap-y-2.5">${serviceLinks}</ul>
          </div>
        </div>
        <div class="mt-8 text-center">
          <a href="${pageUrl(depth, '/locations/')}" class="btn-secondary">
            View All Locations ${icon('arrow-right', 'w-4 h-4')}
          </a>
        </div>
      </div>
    </section>`;
}

module.exports = {
  site,
  assetPath,
  pageUrl,
  escapeHtml,
  icon,
  stars,
  sectionHeading,
  ctaBanner,
  breadcrumbs,
  faqSection,
  statsSection,
  processTimeline,
  whatsappButton,
  portfolioSlug,
  portfolioPreviewSrc,
  portfolioPreviewImage,
  galleryPreviewSrc,
  galleryPreviewImage,
  getShopifyGalleryItems,
  galleryCard,
  gallerySection,
  serviceImagePath,
  serviceShowcaseSection,
  aboutPreviewSection,
  galleryLightboxMarkup,
  footerLocationsSection,
};
