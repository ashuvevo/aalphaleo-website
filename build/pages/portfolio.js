const { pageShell } = require('../partials/layout');
const {
  site, pageUrl, escapeHtml, icon,
  sectionHeading, ctaBanner, breadcrumbs,
  portfolioPreviewImage,
} = require('../helpers');

function portfolioPage() {
  const depth = 1;
  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'shopify', label: 'Shopify Websites' },
    { id: 'website', label: 'Custom Websites' },
    { id: 'app', label: 'Mobile Apps' },
  ];

  const filterButtons = filters.map(f =>
    `<button class="filter-btn rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:border-orange hover:text-orange ${f.id === 'all' ? 'bg-brand-gradient text-white border-orange' : 'bg-white text-primary'}" data-filter="${f.id}">${escapeHtml(f.label)}</button>`
  ).join('');

  const projectCards = site.portfolioProjects.map((p, i) => `
    <article class="portfolio-item card overflow-hidden !p-0 group" data-category="${p.category}" data-aos="fade-up" data-aos-delay="${Math.min(i * 50, 300)}">
      <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="block h-full">
        <div class="aspect-video overflow-hidden bg-border">
          ${portfolioPreviewImage(depth, p)}
        </div>
        <div class="p-3 sm:p-5">
          <div class="flex items-center gap-2 mb-2">
            <span class="badge text-xs">${escapeHtml(p.industry)}</span>
            <span class="badge text-xs">${escapeHtml(p.tech)}</span>
          </div>
          <h3 class="font-semibold text-primary group-hover:text-orange transition-colors">${escapeHtml(p.title)}</h3>
          <p class="mt-2 inline-flex items-center gap-1 text-sm font-medium text-orange">
            Visit Live Site ${icon('external-link', 'w-4 h-4')}
          </p>
        </div>
      </a>
    </article>`).join('');

  const body = `
    ${breadcrumbs(depth, [{ label: 'Home', href: '/' }, { label: 'Portfolio', href: '/portfolio/' }])}

    <section class="hero-gradient section-padding">
      <div class="container-custom text-center">
        <div data-aos="fade-up">
          <span class="section-eyebrow">Our Work</span>
          <h1 class="mt-4 text-4xl font-bold text-primary md:text-5xl">Portfolio of <span class="gradient-text">Successful Projects</span></h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">Explore our live Shopify stores and custom business websites built for brands across India and worldwide.</p>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="mb-8 flex flex-wrap justify-center gap-3" data-filter-bar>${filterButtons}</div>
        <div class="grid-cards-3" data-filter-grid>${projectCards}</div>
      </div>
    </section>

    ${ctaBanner(depth, 'Want Results Like These?', 'Let\'s discuss your project and create something exceptional together.')}`;

  return pageShell(depth, {
    title: 'Portfolio | Aalphaleo Digital Solution',
    description: 'View our portfolio of live Shopify stores and custom business websites built by Aalphaleo Digital Solution.',
    path: '/portfolio/',
    activePath: '/portfolio/',
    body,
  });
}

function caseStudiesPage() {
  const depth = 1;

  const cards = site.caseStudies.map((cs, i) => `
    <article class="card compact-card" data-aos="fade-up" data-aos-delay="${i * 80}">
      <span class="badge">${escapeHtml(cs.industry)}</span>
      <h2 class="mt-3 text-xl font-bold text-primary">${escapeHtml(cs.title)}</h2>
      <div class="mt-4 space-y-3 text-sm">
        <p class="text-muted"><strong class="text-primary">Challenge:</strong> ${escapeHtml(cs.challenge)}</p>
        <p class="text-muted"><strong class="text-primary">Solution:</strong> ${escapeHtml(cs.solution)}</p>
        <p class="text-muted"><strong class="text-primary">Result:</strong> ${escapeHtml(cs.result)}</p>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        ${cs.metrics.map(m => `<span class="badge text-xs !bg-success/10 !text-success !border-success/20">${escapeHtml(m)}</span>`).join('')}
      </div>
      <a href="${pageUrl(depth, `/case-studies/${cs.slug}/`)}" class="btn-text mt-4">Read Full Case Study ${icon('arrow-right', 'w-4 h-4')}</a>
    </article>`).join('');

  const body = `
    ${breadcrumbs(depth, [{ label: 'Home', href: '/' }, { label: 'Case Studies', href: '/case-studies/' }])}

    <section class="hero-gradient section-padding">
      <div class="container-custom text-center">
        <div data-aos="fade-up">
          <span class="section-eyebrow">Case Studies</span>
          <h1 class="mt-4 text-4xl font-bold text-primary md:text-5xl">Real Results, <span class="gradient-text">Real Impact</span></h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">Challenge → Strategy → Development → Results. See how we help businesses grow.</p>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="grid-cards-3 lg:grid-cols-3">${cards}</div>
      </div>
    </section>

    ${ctaBanner(depth, 'Ready to Be Our Next Success Story?', 'Let\'s discuss your goals and create a strategy that delivers measurable results.')}`;

  return pageShell(depth, {
    title: 'Case Studies | Aalphaleo Digital Solution',
    description: 'Read our case studies showcasing measurable results from Shopify development, redesign, SEO, and digital marketing projects.',
    path: '/case-studies/',
    activePath: '/case-studies/',
    body,
  });
}

function caseStudyDetailPage(cs) {
  const depth = 2;

  const body = `
    ${breadcrumbs(depth, [
      { label: 'Home', href: '/' },
      { label: 'Case Studies', href: '/case-studies/' },
      { label: cs.title, href: `/case-studies/${cs.slug}/` },
    ])}

    <section class="hero-gradient section-padding">
      <div class="container-custom">
        <div data-aos="fade-up">
          <span class="badge mb-4">${escapeHtml(cs.industry)}</span>
          <h1 class="text-4xl font-bold text-primary md:text-5xl">${escapeHtml(cs.title)}</h1>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom max-w-3xl">
        <div class="space-y-8">
          <div data-aos="fade-up">
            <h2 class="text-2xl font-bold text-primary mb-3">The Challenge</h2>
            <p class="text-muted text-lg">${escapeHtml(cs.challenge)}</p>
          </div>
          <div data-aos="fade-up">
            <h2 class="text-2xl font-bold text-primary mb-3">Our Strategy & Solution</h2>
            <p class="text-muted text-lg">${escapeHtml(cs.solution)}</p>
          </div>
          <div data-aos="fade-up">
            <h2 class="text-2xl font-bold text-primary mb-3">The Results</h2>
            <p class="text-muted text-lg mb-6">${escapeHtml(cs.result)}</p>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              ${cs.metrics.map(m => `
                <div class="card text-center !bg-success/5 !border-success/20">
                  <p class="text-lg font-bold text-success">${escapeHtml(m)}</p>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    ${ctaBanner(depth, 'Want Similar Results?', 'Book a free consultation and let\'s create a strategy for your business.')}`;

  return pageShell(depth, {
    title: `${cs.title} | Case Study | Aalphaleo Digital Solution`,
    description: cs.result,
    path: `/case-studies/${cs.slug}/`,
    activePath: '/case-studies/',
    body,
  });
}

function allCaseStudyPages() {
  return site.caseStudies.map(cs => ({
    path: `case-studies/${cs.slug}/index.html`,
    html: caseStudyDetailPage(cs),
  }));
}

module.exports = { portfolioPage, caseStudiesPage, caseStudyDetailPage, allCaseStudyPages };
