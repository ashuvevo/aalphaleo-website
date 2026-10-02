const services = require('../data/services');
const { pageShell } = require('../partials/layout');
const {
  pageUrl, escapeHtml, icon,
  sectionHeading, ctaBanner, breadcrumbs, faqSection, processTimeline,
} = require('../helpers');

function servicePage(service, depth = 2) {
  const contactUrl = pageUrl(depth, '/contact/');
  const relatedServices = service.related.map(slug => {
    const s = services.find(x => x.slug === slug);
    return s ? { title: s.title, href: `/services/${s.slug}/` } : null;
  }).filter(Boolean);

  const highlightBadges = service.highlights.map(h =>
    `<span class="badge">${icon('check-circle', 'w-4 h-4 text-success')} ${escapeHtml(h)}</span>`
  ).join('');

  const audienceItems = service.audience.map(a =>
    `<li class="flex items-center gap-2 text-muted">${icon('check', 'w-4 h-4 text-orange shrink-0')} ${escapeHtml(a)}</li>`
  ).join('');

  const problemCards = service.problems.map((p, i) => `
    <div class="card compact-card" data-aos="fade-up" data-aos-delay="${i * 50}">
      ${icon('alert-circle', 'w-5 h-5 text-secondary mb-2')}
      <p class="text-sm text-primary font-medium">${escapeHtml(p)}</p>
    </div>`).join('');

  const includeSections = Object.entries(service.includes).map(([title, items]) => `
    <div class="card compact-card" data-aos="fade-up">
      <h3 class="mb-4 font-semibold text-primary">${escapeHtml(title)}</h3>
      <ul class="space-y-2">
        ${items.map(item => `<li class="flex items-center gap-2 text-sm text-muted">${icon('check', 'w-4 h-4 text-success shrink-0')} ${escapeHtml(item)}</li>`).join('')}
      </ul>
    </div>`).join('');

  const relatedCards = relatedServices.map(r => `
    <a href="${pageUrl(depth, r.href)}" class="card compact-card group">
      <h3 class="font-semibold text-primary group-hover:text-orange transition-colors">${escapeHtml(r.title)}</h3>
      <span class="btn-text mt-2">Learn More ${icon('arrow-right', 'w-4 h-4')}</span>
    </a>`).join('');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.heroDesc,
    provider: { '@type': 'Organization', name: 'Aalphaleo Digital Solution' },
  };

  const body = `
    ${breadcrumbs(depth, [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services/shopify-development/' },
      { label: service.title, href: `/services/${service.slug}/` },
    ])}

    <section class="hero-gradient section-padding">
      <div class="container-custom">
        <div class="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <span class="section-eyebrow">${escapeHtml(service.keyword)}</span>
          <h1 class="mt-4 text-4xl font-bold leading-tight text-primary md:text-5xl">${escapeHtml(service.h1)}</h1>
          <p class="mt-6 text-lg text-muted">${escapeHtml(service.heroDesc)}</p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <a href="${contactUrl}" class="btn-primary">${escapeHtml(service.cta)}</a>
            <a href="${pageUrl(depth, '/portfolio/')}" class="btn-secondary">View Portfolio</a>
          </div>
          <div class="mt-8 flex flex-wrap justify-center gap-3">${highlightBadges}</div>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="grid gap-12 lg:grid-cols-2">
          <div data-aos="fade-right">
            ${sectionHeading('Who This Is For', 'Ideal For', '', false)}
            <ul class="space-y-3">${audienceItems}</ul>
          </div>
          <div data-aos="fade-left">
            ${sectionHeading('Problems We Solve', 'Common Challenges', '', false)}
            <div class="grid grid-cols-2 gap-3 sm:gap-4">${problemCards}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding bg-bg">
      <div class="container-custom max-w-3xl text-center">
        <div data-aos="fade-up">
          <span class="section-eyebrow">Our Solution</span>
          <h2 class="section-title">How We Help</h2>
          <p class="section-desc mx-auto mt-4">${escapeHtml(service.solution)}</p>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        ${sectionHeading('What\'s Included', 'Deliverables', 'Everything you need for a successful project.')}
        <div class="grid-cards-2 md:grid-cols-2">${includeSections}</div>
      </div>
    </section>

    ${processTimeline()}

    <section class="section-padding bg-bg">
      <div class="container-custom">
        ${sectionHeading('Why Aalphaleo', 'Why Choose Us', 'What sets us apart from the competition.')}
        <div class="grid-cards-3">
          <div class="card compact-card text-center" data-aos="fade-up">
            ${icon('code-2', 'w-8 h-8 text-orange mx-auto mb-3')}
            <h3 class="font-semibold text-primary">Custom-Coded</h3>
            <p class="text-sm text-muted mt-2">Purpose-built solutions, never cookie-cutter templates.</p>
          </div>
          <div class="card compact-card text-center" data-aos="fade-up" data-aos-delay="50">
            ${icon('search', 'w-8 h-8 text-orange mx-auto mb-3')}
            <h3 class="font-semibold text-primary">SEO-First</h3>
            <p class="text-sm text-muted mt-2">Built with search visibility as a foundation.</p>
          </div>
          <div class="card compact-card text-center" data-aos="fade-up" data-aos-delay="100">
            ${icon('headphones', 'w-8 h-8 text-orange mx-auto mb-3')}
            <h3 class="font-semibold text-primary">Dedicated Support</h3>
            <p class="text-sm text-muted mt-2">Long-term partnership with responsive support.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        ${sectionHeading('Related Services', 'Explore More', 'Complementary services to accelerate your growth.')}
        <div class="grid-cards-3">${relatedCards}</div>
      </div>
    </section>

    ${faqSection(service.faq, `${service.slug}-faq`)}
    ${ctaBanner(depth, `Ready to Get Started with ${service.title}?`, 'Book a free consultation and let\'s discuss how we can help your business grow.', service.cta)}

    <script type="application/ld+json">${JSON.stringify(schema)}</script>`;

  return pageShell(depth, {
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}/`,
    activePath: `/services/${service.slug}/`,
    body,
  });
}

function allServicePages() {
  return services.map(s => ({
    path: `services/${s.slug}/index.html`,
    html: servicePage(s, 2),
  }));
}

module.exports = { servicePage, allServicePages };
