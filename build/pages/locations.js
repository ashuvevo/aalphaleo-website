const { pageShell } = require('../partials/layout');
const {
  site, pageUrl, escapeHtml, icon,
  sectionHeading, ctaBanner, breadcrumbs, faqSection, processTimeline,
} = require('../helpers');
const locationServices = require('../data/location-services');
const { loadCities } = require('../lib/cities');
const { generateLocationContent } = require('../lib/location-content');

// Location files are two directories below the output root:
// out/locations/<service>/<service>-<city>.html
const DEPTH = 2;

function renderParagraphs(paragraphs) {
  return paragraphs.map(p => {
    const html = p
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-orange hover:text-secondary underline">$1</a>');
    return `<p class="mb-4 leading-relaxed text-muted">${html}</p>`;
  }).join('');
}

function locationPage(city, service, content) {
  const relatedServiceCards = locationServices
    .filter(s => s.slug !== service.slug)
    .slice(0, 3)
    .map(s => `
      <a href="${pageUrl(DEPTH, `/locations/${s.folder}/${s.slug}-${city.slug}.html`)}" class="card compact-card group">
        <h3 class="font-semibold text-primary group-hover:text-orange transition-colors">${escapeHtml(s.title)} in ${escapeHtml(city.name)}</h3>
        <span class="btn-text mt-2 text-sm">Learn More ${icon('arrow-right', 'w-4 h-4')}</span>
      </a>`).join('');

  const relatedCityCards = content.relatedCities.map(c => `
    <a href="${pageUrl(DEPTH, `/locations/${service.folder}/${service.slug}-${c.slug}.html`)}" class="card compact-card group">
      <h3 class="font-semibold text-primary group-hover:text-orange transition-colors">${escapeHtml(service.title)} in ${escapeHtml(c.name)}</h3>
      <p class="mt-1 text-xs text-muted">${escapeHtml(c.state)}</p>
    </a>`).join('');

  const blogCards = content.relatedBlogs.map(b => `
    <a href="${pageUrl(DEPTH, `/blog/${b.slug}/`)}" class="card compact-card group">
      <span class="badge text-xs mb-2">${escapeHtml(b.category.replace('-', ' '))}</span>
      <h3 class="font-semibold text-primary group-hover:text-orange transition-colors">${escapeHtml(b.title)}</h3>
    </a>`).join('');

  const benefitItems = content.sections.benefits.map(b =>
    `<li class="flex items-start gap-2 text-muted">${icon('check-circle', 'w-5 h-5 text-success shrink-0 mt-0.5')} ${escapeHtml(b)}</li>`
  ).join('');

  const industryBadges = site.industries.slice(0, 6).map(i =>
    `<span class="badge">${escapeHtml(i.name)}</span>`
  ).join('');

  const imagePromptComments = `<!--
Image Prompts (no text in images):
Hero: ${content.imagePrompts.hero}
Service: ${content.imagePrompts.service}
CTA: ${content.imagePrompts.cta}
Technology: ${content.imagePrompts.technology}
Local: ${content.imagePrompts.local}
-->`;

  const body = `
    ${imagePromptComments}
    ${breadcrumbs(DEPTH, [
      { label: 'Home', href: '/' },
      { label: 'Locations', href: '/locations/' },
      { label: service.title, href: `/locations/${service.folder}/` },
      { label: city.name, href: content.pagePath },
    ], { includeSchema: false })}

    <section class="hero-gradient section-padding">
      <div class="container-custom">
        <div class="max-w-4xl" data-aos="fade-up">
          <span class="section-eyebrow">${escapeHtml(city.state)}</span>
          <h1 class="mt-4 text-4xl font-bold leading-tight text-primary md:text-5xl">${escapeHtml(content.h1)}</h1>
          <p class="mt-6 text-lg text-muted">${escapeHtml(content.metaDescription)}</p>
          <div class="mt-8 flex flex-wrap gap-4">
            <a href="${pageUrl(DEPTH, '/contact/')}" class="btn-primary">Book Free Consultation</a>
            <a href="${pageUrl(DEPTH, service.servicePath)}" class="btn-secondary">View ${escapeHtml(service.shortTitle)} Service</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom max-w-4xl">
        <div class="location-content" data-aos="fade-up">
          <h2 class="text-2xl font-bold text-primary mb-4">Local Introduction</h2>
          ${renderParagraphs(content.sections.intro)}
          ${renderParagraphs(content.sections.extended.slice(0, 2))}
        </div>
      </div>
    </section>

    <section class="section-padding bg-bg">
      <div class="container-custom max-w-4xl">
        <h2 class="text-2xl font-bold text-primary mb-6" data-aos="fade-up">Why Choose Aalphaleo in ${escapeHtml(city.name)}</h2>
        <div class="space-y-4" data-aos="fade-up">
          ${renderParagraphs(content.sections.whyChoose)}
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom max-w-4xl">
        <h2 class="text-2xl font-bold text-primary mb-6" data-aos="fade-up">Our ${escapeHtml(service.title)} Services</h2>
        <div data-aos="fade-up">
          ${renderParagraphs(content.sections.service)}
          ${renderParagraphs(content.sections.strategy)}
          ${renderParagraphs(content.sections.extended.slice(2, 6))}
        </div>
      </div>
    </section>

    <section class="section-padding bg-bg">
      <div class="container-custom max-w-4xl">
        <h2 class="text-2xl font-bold text-primary mb-6" data-aos="fade-up">Key Benefits</h2>
        <ul class="grid gap-3 sm:grid-cols-2" data-aos="fade-up">${benefitItems}</ul>
      </div>
    </section>

    ${processTimeline()}

    <section class="section-padding bg-bg">
      <div class="container-custom max-w-4xl">
        <h2 class="text-2xl font-bold text-primary mb-6" data-aos="fade-up">Implementation Approach</h2>
        <div data-aos="fade-up">
          ${renderParagraphs(content.sections.implementation)}
          ${renderParagraphs(content.sections.extended.slice(6, 10))}
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom max-w-4xl">
        <h2 class="text-2xl font-bold text-primary mb-6" data-aos="fade-up">${escapeHtml(city.name)} Market &amp; Industries</h2>
        <div data-aos="fade-up">
          ${renderParagraphs(content.sections.localMarket)}
          <div class="mt-6 flex flex-wrap gap-2">${industryBadges}</div>
        </div>
      </div>
    </section>

    <section class="section-padding bg-bg">
      <div class="container-custom max-w-4xl">
        <h2 class="text-2xl font-bold text-primary mb-6" data-aos="fade-up">Portfolio Highlights</h2>
        <p class="mb-6 text-muted" data-aos="fade-up">We have built high-performing Shopify stores and business websites for brands across India. Explore our work and imagine what we can deliver for ${escapeHtml(city.name)}.</p>
        <a href="${pageUrl(DEPTH, '/portfolio/')}" class="btn-secondary" data-aos="fade-up">View Portfolio ${icon('arrow-right', 'w-4 h-4')}</a>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom max-w-4xl text-center" data-aos="fade-up">
        <h2 class="text-2xl font-bold text-primary mb-4">Client Testimonials</h2>
        <p class="text-muted mb-6">Trusted by businesses across India for Shopify development, websites, SEO, and digital marketing.</p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          ${[1, 2, 3].map(n => `
            <div class="card compact-card text-left">
              <div class="mb-2 flex gap-1">${icon('star', 'w-4 h-4 text-amber-400')}${icon('star', 'w-4 h-4 text-amber-400')}${icon('star', 'w-4 h-4 text-amber-400')}${icon('star', 'w-4 h-4 text-amber-400')}${icon('star', 'w-4 h-4 text-amber-400')}</div>
              <p class="text-sm text-muted">Professional team with excellent communication and measurable results.</p>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section-padding bg-bg">
      <div class="container-custom max-w-4xl" data-aos="fade-up">
        <h2 class="text-2xl font-bold text-primary mb-4">Pricing Overview</h2>
        ${renderParagraphs([content.sections.pricing])}
      </div>
    </section>

    ${faqSection(content.faqs, `${content.fileSlug}-faq`, { includeSchema: false })}

    <section class="section-padding bg-bg">
      <div class="container-custom">
        ${sectionHeading('Related Services', `More Services in ${city.name}`)}
        <div class="grid-cards-3 md:grid-cols-3">${relatedServiceCards}</div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        ${sectionHeading('Nearby Cities', `${service.title} in ${city.state}`)}
        <div class="grid-cards-3 md:grid-cols-3">${relatedCityCards}</div>
      </div>
    </section>

    ${content.relatedBlogs.length ? `
    <section class="section-padding bg-bg">
      <div class="container-custom">
        ${sectionHeading('Helpful Resources', 'Related Blog Articles')}
        <div class="grid-cards-3 md:grid-cols-3">${blogCards}</div>
      </div>
    </section>` : ''}

    <section class="section-padding bg-white">
      <div class="container-custom max-w-4xl">
        ${renderParagraphs(content.sections.conclusion)}
      </div>
    </section>

    ${ctaBanner(DEPTH, `Ready for ${service.shortTitle} in ${city.name}?`, `Contact Aalphaleo Digital Solution today. Solving Your Business Problem.`)}

    <script type="application/ld+json">${JSON.stringify(content.schema)}</script>`;

  return pageShell(DEPTH, {
    title: content.metaTitle,
    description: content.metaDescription,
    path: content.pagePath,
    activePath: '/locations/',
    body,
  });
}

function allLocationPages(blogPosts = []) {
  const cities = loadCities();
  const pages = [];

  for (const city of cities) {
    for (const service of locationServices) {
      const content = generateLocationContent(city, service, blogPosts);
      pages.push({
        path: `locations/${service.folder}/${content.fileSlug}.html`,
        html: locationPage(city, service, content),
        city: city.slug,
        service: service.slug,
        wordCount: content.wordCount,
      });
    }
  }

  return pages;
}

function locationsIndexPage() {
  const depth = 1;
  const cities = loadCities().slice(0, 12);
  const serviceCards = locationServices.map(s => `
    <a href="${pageUrl(depth, `/locations/${s.folder}/`)}" class="card compact-card group">
      <h2 class="text-lg font-semibold text-primary group-hover:text-orange transition-colors">${escapeHtml(s.title)}</h2>
      <p class="mt-2 text-sm text-muted">Local landing pages across India</p>
      <span class="btn-text mt-3 text-sm">Browse ${escapeHtml(s.title)} ${icon('arrow-right', 'w-4 h-4')}</span>
    </a>`).join('');

  const cityLinks = cities.map(c =>
    `<a href="${pageUrl(depth, `/locations/shopify-development/shopify-development-${c.slug}.html`)}" class="badge hover:border-orange hover:text-orange">${escapeHtml(c.name)}</a>`
  ).join('');

  const body = `
    ${breadcrumbs(depth, [{ label: 'Home', href: '/' }, { label: 'Locations', href: '/locations/' }])}
    <section class="hero-gradient section-padding">
      <div class="container-custom text-center">
        <span class="section-eyebrow">Local SEO</span>
        <h1 class="mt-4 text-4xl font-bold text-primary md:text-5xl">Digital Services Across <span class="gradient-text">India</span></h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">Find Aalphaleo Digital Solution services in your city — Shopify development, websites, SEO, Google Ads, Meta Ads, Flutter apps, and maintenance.</p>
      </div>
    </section>
    <section class="section-padding bg-white">
      <div class="container-custom">
        ${sectionHeading('Services by Location', 'Browse by Service')}
        <div class="grid-cards-3 lg:grid-cols-4">${serviceCards}</div>
      </div>
    </section>
    <section class="section-padding bg-bg">
      <div class="container-custom text-center">
        ${sectionHeading('', 'Popular Cities')}
        <div class="flex flex-wrap justify-center gap-3">${cityLinks}</div>
      </div>
    </section>
    ${ctaBanner(depth, 'Need Help Choosing?', 'Contact us for a free consultation tailored to your city and business goals.')}`;

  return pageShell(depth, {
    title: 'Locations | Aalphaleo Digital Solution',
    description: 'Find Shopify development, website development, SEO, Google Ads, Meta Ads, and app development services in cities across India.',
    path: '/locations/',
    activePath: '/locations/',
    body,
  });
}

function serviceIndexPage(service) {
  const depth = 2;
  const cities = loadCities().slice(0, 24);
  const cityCards = cities.map(c => `
    <a href="${pageUrl(depth, `/locations/${service.folder}/${service.slug}-${c.slug}.html`)}" class="card compact-card group">
      <h3 class="font-semibold text-primary group-hover:text-orange transition-colors">${escapeHtml(service.title)} in ${escapeHtml(c.name)}</h3>
      <p class="mt-1 text-xs text-muted">${escapeHtml(c.state)}</p>
    </a>`).join('');

  const body = `
    ${breadcrumbs(depth, [
      { label: 'Home', href: '/' },
      { label: 'Locations', href: '/locations/' },
      { label: service.title, href: `/locations/${service.folder}/` },
    ])}
    <section class="hero-gradient section-padding">
      <div class="container-custom text-center">
        <span class="section-eyebrow">Local SEO</span>
        <h1 class="mt-4 text-4xl font-bold text-primary md:text-5xl">${escapeHtml(service.title)} Across India</h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">Find ${escapeHtml(service.shortTitle.toLowerCase())} services in cities nationwide. Aalphaleo Digital Solution — Solving Your Business Problem.</p>
        <a href="${pageUrl(depth, service.servicePath)}" class="btn-primary mt-8 inline-flex">View Main Service Page</a>
      </div>
    </section>
    <section class="section-padding bg-white">
      <div class="container-custom">
        ${sectionHeading('Browse by City', `${service.title} by Location`)}
        <div class="grid-cards-3 lg:grid-cols-4">${cityCards}</div>
        <p class="mt-8 text-center text-sm text-muted">500+ cities available — use search or contact us for your location.</p>
      </div>
    </section>
    ${ctaBanner(depth, `Need ${service.shortTitle}?`, 'Book a free consultation with Aalphaleo Digital Solution.')}`;

  return pageShell(depth, {
    title: `${service.title} by City | Aalphaleo Digital Solution`,
    description: `Find ${service.shortTitle.toLowerCase()} services in cities across India. Local landing pages for businesses seeking Aalphaleo Digital Solution.`,
    path: `/locations/${service.folder}/`,
    activePath: '/locations/',
    body,
  });
}

module.exports = { locationPage, allLocationPages, locationsIndexPage, serviceIndexPage };
