const { pageShell } = require('../partials/layout');
const {
  site, pageUrl, assetPath, escapeHtml, icon,
  sectionHeading, ctaBanner, breadcrumbs, faqSection,
} = require('../helpers');

function pricingPage() {
  const depth = 1;
  const contactUrl = pageUrl(depth, '/contact/');

  const pricingGroups = site.pricingPlans.map(group => {
    const plans = group.plans.map(p => `
      <div class="card compact-card relative ${p.featured ? '!border-secondary ring-2 ring-orange/20' : ''}" data-aos="fade-up">
        ${p.featured ? '<span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-4 py-1 text-xs font-medium text-white">Most Popular</span>' : ''}
        <h3 class="text-xl font-bold text-primary">${escapeHtml(p.name)}</h3>
        <p class="mt-2 text-3xl font-bold text-orange">${escapeHtml(p.price)}</p>
        <p class="mt-2 text-sm text-muted">${escapeHtml(p.desc)}</p>
        <ul class="mt-6 space-y-3">
          ${p.features.map(f => `<li class="flex items-center gap-2 text-sm text-muted">${icon('check', 'w-4 h-4 text-success shrink-0')} ${escapeHtml(f)}</li>`).join('')}
        </ul>
        <a href="${contactUrl}" class="${p.featured ? 'btn-primary' : 'btn-secondary'} mt-8 w-full text-center">${escapeHtml(p.cta)}</a>
      </div>`).join('');

    return `
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-primary mb-8 text-center">${escapeHtml(group.group)}</h2>
        <div class="grid-cards-3 md:grid-cols-3">${plans}</div>
      </div>`;
  }).join('');

  const pricingFaqs = [
    { q: 'Are these prices fixed?', a: 'Prices are starting points. Final quotes depend on project scope, complexity, and specific requirements discussed during consultation.' },
    { q: 'What payment terms do you offer?', a: 'We typically work with a 50% upfront and 50% on completion model. Enterprise projects may have milestone-based payments.' },
    { q: 'Is support included?', a: 'Yes. All packages include post-launch support. Duration varies by plan — 30 days for Starter, 90 days for Professional, ongoing for Enterprise.' },
    { q: 'Can I upgrade my plan later?', a: 'Absolutely. You can upgrade at any time as your business grows and needs evolve.' },
  ];

  const body = `
    ${breadcrumbs(depth, [{ label: 'Home', href: '/' }, { label: 'Pricing', href: '/pricing/' }])}

    <section class="hero-gradient section-padding">
      <div class="container-custom text-center">
        <div data-aos="fade-up">
          <span class="section-eyebrow">Pricing</span>
          <h1 class="mt-4 text-4xl font-bold text-primary md:text-5xl">Transparent <span class="gradient-text">Pricing Plans</span></h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">Choose the plan that fits your business needs. All plans include premium quality and dedicated support.</p>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">${pricingGroups}</div>
    </section>

    ${faqSection(pricingFaqs, 'pricing-faq')}
    ${ctaBanner(depth, 'Need a Custom Quote?', 'Every business is unique. Contact us for a tailored proposal based on your specific requirements.')}`;

  return pageShell(depth, {
    title: 'Pricing | Aalphaleo Digital Solution',
    description: 'Transparent pricing for Shopify development, custom websites, mobile apps, SEO, and digital marketing services.',
    path: '/pricing/',
    activePath: '/pricing/',
    body,
  });
}

function industriesPage() {
  const depth = 1;

  const industrySections = site.industries.map((ind, i) => `
    <div class="grid gap-8 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''} lg:grid-cols-2" data-aos="fade-up">
      <div class="${i % 2 === 1 ? 'lg:col-start-2' : ''}">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10">
            ${icon(ind.icon, 'w-6 h-6 text-orange')}
          </div>
          <h2 class="text-2xl font-bold text-primary">${escapeHtml(ind.name)}</h2>
        </div>
        <p class="text-muted text-lg mb-4">${escapeHtml(ind.desc)}</p>
        <p class="text-sm text-muted">We understand the unique challenges of the ${escapeHtml(ind.name.toLowerCase())} industry and deliver tailored Shopify and web solutions that drive results.</p>
        <a href="${pageUrl(depth, '/contact/')}" class="btn-text mt-4">Get Started ${icon('arrow-right', 'w-4 h-4')}</a>
      </div>
      <div class="aspect-video overflow-hidden rounded-card shadow-soft ${i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}">
        <img src="${assetPath(depth, `assets/images/industries/${ind.image}`)}" alt="${escapeHtml(ind.name)} industry" class="h-full w-full object-cover transition-transform duration-500 hover:scale-105" width="800" height="450" loading="lazy" decoding="async">
      </div>
    </div>`).join('<div class="my-16 border-t border-border"></div>');

  const body = `
    ${breadcrumbs(depth, [{ label: 'Home', href: '/' }, { label: 'Industries', href: '/industries/' }])}

    <section class="hero-gradient section-padding">
      <div class="container-custom text-center">
        <div data-aos="fade-up">
          <span class="section-eyebrow">Industries</span>
          <h1 class="mt-4 text-4xl font-bold text-primary md:text-5xl">Solutions for <span class="gradient-text">Every Industry</span></h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">Tailored digital solutions for fashion, furniture, beauty, healthcare, and more.</p>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom space-y-0">${industrySections}</div>
    </section>

    ${ctaBanner(depth, 'Don\'t See Your Industry?', 'We work with businesses across all sectors. Contact us to discuss your specific needs.')}`;

  return pageShell(depth, {
    title: 'Industries We Serve | Aalphaleo Digital Solution',
    description: 'Custom Shopify and web development solutions for fashion, furniture, beauty, jewelry, healthcare, food, electronics, and more.',
    path: '/industries/',
    activePath: '/industries/',
    body,
  });
}

function faqPage() {
  const depth = 1;

  const allFaqs = [
    { q: 'What services does Aalphaleo Digital Solution offer?', a: 'We offer custom Shopify development, theme customization, store redesign, migration, maintenance, speed optimization, CRO, SEO, custom websites, WooCommerce, mobile apps, Meta Ads, Google Ads, and social media marketing.' },
    { q: 'How long does a Shopify project take?', a: 'Typical projects take 4-8 weeks depending on complexity. We provide a detailed timeline during the discovery phase.' },
    { q: 'Do you offer free consultations?', a: 'Yes. We offer free 30-minute consultations to understand your requirements and provide recommendations.' },
    { q: 'What is your pricing structure?', a: 'Shopify projects start from ₹49,999. We offer Starter, Professional, and Enterprise packages. Visit our pricing page for details.' },
    { q: 'Do you provide ongoing support?', a: 'Yes. All packages include post-launch support, and we offer dedicated maintenance plans for long-term partnerships.' },
    { q: 'Can you migrate my store to Shopify?', a: 'Absolutely. We handle migrations from WooCommerce, WordPress, Magento, Wix, and other platforms with full SEO preservation.' },
    { q: 'Will my website be mobile-friendly?', a: 'Every project is mobile-first and fully responsive, optimized for all screen sizes and touch interactions.' },
    { q: 'Do you work with international clients?', a: 'Yes. We serve clients globally with remote collaboration, regular updates, and flexible communication channels.' },
    { q: 'What makes Aalphaleo different from other agencies?', a: 'We specialize in fully custom Shopify development with SEO-first architecture, conversion-focused design, and end-to-end digital growth services.' },
    { q: 'How do I get started?', a: 'Book a free consultation through our contact page, WhatsApp us, or call us directly. We respond within 24 hours.' },
  ];

  const body = `
    ${breadcrumbs(depth, [{ label: 'Home', href: '/' }, { label: 'FAQ', href: '/faq/' }])}

    <section class="hero-gradient section-padding">
      <div class="container-custom text-center">
        <div data-aos="fade-up">
          <span class="section-eyebrow">FAQ</span>
          <h1 class="mt-4 text-4xl font-bold text-primary md:text-5xl">Frequently Asked <span class="gradient-text">Questions</span></h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">Find answers to common questions about our services, process, and pricing.</p>
        </div>
      </div>
    </section>

    ${faqSection(allFaqs, 'main-faq')}
    ${ctaBanner(depth, 'Still Have Questions?', 'Our team is ready to help. Reach out and we\'ll respond within 24 hours.')}`;

  return pageShell(depth, {
    title: 'FAQ | Aalphaleo Digital Solution',
    description: 'Frequently asked questions about Aalphaleo Digital Solution services, Shopify development, pricing, and process.',
    path: '/faq/',
    activePath: '/faq/',
    body,
  });
}

module.exports = { pricingPage, industriesPage, faqPage };
