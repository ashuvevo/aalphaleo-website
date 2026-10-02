const { pageShell } = require('../partials/layout');
const {
  site, pageUrl, escapeHtml, icon,
  ctaBanner, breadcrumbs,
  getShopifyGalleryItems, galleryCard, galleryLightboxMarkup,
} = require('../helpers');

function galleryPage() {
  const depth = 1;
  const items = getShopifyGalleryItems();

  const filterButtons = site.galleryFilters.map(f =>
    `<button class="filter-btn rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:border-orange hover:text-orange ${f.id === 'all' ? 'bg-brand-gradient text-white border-orange' : 'bg-white text-primary'}" data-filter="${f.id}">${escapeHtml(f.label)}</button>`
  ).join('');

  const cards = items.map((item, i) => galleryCard(depth, item, Math.min(i * 40, 320))).join('');

  const body = `
    ${breadcrumbs(depth, [{ label: 'Home', href: '/' }, { label: 'Gallery', href: '/gallery/' }])}

    <section class="hero-gradient section-padding">
      <div class="container-custom text-center">
        <div data-aos="fade-up">
          <span class="section-eyebrow">Design Gallery</span>
          <h1 class="mt-4 text-4xl font-bold text-primary md:text-5xl">Shopify <span class="gradient-text">Homepage Designs</span></h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">Browse custom Shopify homepage design concepts — hero banners, product grids, and conversion-focused layouts across fashion, beauty, footwear, and e-commerce.</p>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="mb-8 flex flex-wrap justify-center gap-3" data-filter-bar>${filterButtons}</div>
        <div class="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4" data-filter-grid>${cards}</div>
      </div>
    </section>

    ${galleryLightboxMarkup()}
    ${ctaBanner(depth, 'Want a Homepage Like These?', 'Let\'s design a custom Shopify storefront that converts visitors into customers.')}`;

  return pageShell(depth, {
    title: 'Shopify Homepage Design Gallery | Aalphaleo Digital Solution',
    description: 'Browse custom Shopify homepage design concepts — fashion, beauty, footwear, and e-commerce layouts by Aalphaleo Digital Solution.',
    path: '/gallery/',
    activePath: '/gallery/',
    body,
  });
}

module.exports = { galleryPage };
