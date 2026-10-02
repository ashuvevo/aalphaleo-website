const { pageShell } = require('../partials/layout');
const {
  site, pageUrl, assetPath, escapeHtml, icon,
  sectionHeading, ctaBanner, breadcrumbs, statsSection, processTimeline,
} = require('../helpers');

function aboutPage() {
  const depth = 1;
  const contactUrl = pageUrl(depth, '/contact/');

  const valueCards = site.values.map((v, i) => `
    <div class="card compact-card text-center" data-aos="fade-up" data-aos-delay="${i * 50}">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10">
        ${icon(v.icon, 'w-6 h-6 text-orange')}
      </div>
      <h3 class="mb-2 font-semibold text-primary">${escapeHtml(v.title)}</h3>
      <p class="text-sm text-muted">${escapeHtml(v.desc)}</p>
    </div>`).join('');

  const whyItems = [
    'Custom Shopify specialists', 'Conversion-focused design', 'SEO-ready architecture',
    'Fast performance', 'Responsive development', 'Dedicated support', 'Long-term partnership',
  ].map(w => `<li class="flex items-center gap-2 text-muted">${icon('check-circle', 'w-5 h-5 text-success shrink-0')} ${escapeHtml(w)}</li>`).join('');

  const techGroups = [
    { title: 'Development', items: ['Shopify', 'HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Liquid', 'WooCommerce', 'Flutter'] },
    { title: 'Marketing', items: ['Google Ads', 'Meta Ads', 'GA4', 'GTM', 'Search Console'] },
  ].map(g => `
    <div class="card compact-card" data-aos="fade-up">
      <h3 class="mb-4 font-semibold text-primary">${escapeHtml(g.title)}</h3>
      <div class="flex flex-wrap gap-2">
        ${g.items.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join('')}
      </div>
    </div>`).join('');

  const industryList = site.industries.map(i => escapeHtml(i.name)).join(', ');

  const body = `
    ${breadcrumbs(depth, [{ label: 'Home', href: '/' }, { label: 'About', href: '/about/' }])}

    <section class="hero-gradient section-padding">
      <div class="container-custom">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div data-aos="fade-right">
            <span class="section-eyebrow">About Us</span>
            <h1 class="mt-4 text-4xl font-bold leading-tight text-primary md:text-5xl">Building Digital Experiences That <span class="gradient-text">Drive Business Growth</span></h1>
            <p class="mt-6 text-lg text-muted">Aalphaleo Digital Solution helps startups, growing brands, and enterprises create premium Shopify stores, business websites, mobile applications, and digital marketing campaigns that generate measurable results.</p>
            <div class="mt-8 flex flex-wrap gap-4">
              <a href="${contactUrl}" class="btn-primary">Book Free Consultation</a>
              <a href="${pageUrl(depth, '/services/shopify-development/')}" class="btn-secondary">View Our Services</a>
            </div>
          </div>
          <div class="hero-showcase" data-aos="fade-left">
            <img src="${assetPath(depth, 'assets/images/home-hero-showcase.png')}" alt="Aalphaleo Digital Solution project showcase" width="960" height="720" loading="eager" decoding="async">
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom max-w-3xl text-center">
        <div data-aos="fade-up">
          <span class="section-eyebrow">Our Story</span>
          <h2 class="section-title">Who We Are</h2>
          <p class="section-desc mx-auto mt-4">Aalphaleo Digital Solution was founded with one goal: help businesses succeed online through high-quality development and digital marketing. We combine design, technology, and strategy to create websites that are fast, scalable, user-friendly, and built for long-term growth.</p>
        </div>
      </div>
    </section>

    <section class="section-padding bg-bg">
      <div class="container-custom">
        <div class="grid-cards-2 md:grid-cols-2">
          <div class="card compact-card" data-aos="fade-up">
            ${icon('target', 'w-8 h-8 text-orange mb-4')}
            <h2 class="text-xl font-bold text-primary mb-3 sm:text-2xl">Our Mission</h2>
            <p class="text-sm text-muted sm:text-base">Deliver premium digital solutions that combine beautiful design, robust development, and measurable marketing performance.</p>
          </div>
          <div class="card compact-card" data-aos="fade-up" data-aos-delay="100">
            ${icon('eye', 'w-8 h-8 text-secondary mb-4')}
            <h2 class="text-xl font-bold text-primary mb-3 sm:text-2xl">Our Vision</h2>
            <p class="text-sm text-muted sm:text-base">Become one of India's most trusted Shopify development and digital growth agencies by consistently delivering exceptional customer experiences.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        ${sectionHeading('Core Values', 'What We Stand For')}
        <div class="grid-cards-3">${valueCards}</div>
      </div>
    </section>

    <section class="section-padding bg-bg">
      <div class="container-custom">
        <div class="grid gap-12 lg:grid-cols-2 items-center">
          <div data-aos="fade-right">
            <span class="section-eyebrow">Why Choose Us</span>
            <h2 class="section-title">Your Trusted Digital Partner</h2>
            <ul class="mt-6 space-y-3">${whyItems}</ul>
          </div>
          <div class="card" data-aos="fade-left">
            <h3 class="text-lg font-semibold text-primary mb-4">Team Philosophy</h3>
            <p class="text-muted">We believe every project is a partnership. Our goal is not just to launch websites but to help clients grow their businesses through thoughtful design, technical excellence, and ongoing optimization.</p>
          </div>
        </div>
      </div>
    </section>

    ${processTimeline()}

    <section class="section-padding bg-white">
      <div class="container-custom">
        ${sectionHeading('Technologies', 'Tools & Platforms We Use')}
        <div class="grid-cards-2 md:grid-cols-2">${techGroups}</div>
      </div>
    </section>

    <section class="section-padding bg-bg">
      <div class="container-custom text-center">
        <div data-aos="fade-up">
          <span class="section-eyebrow">Industries</span>
          <h2 class="section-title">Industries We Serve</h2>
          <p class="section-desc mx-auto mt-4">${industryList}, and more.</p>
          <a href="${pageUrl(depth, '/industries/')}" class="btn-secondary mt-6">Explore Industries</a>
        </div>
      </div>
    </section>

    ${statsSection()}
    ${ctaBanner(depth, 'Let\'s Build Something Great Together', 'Whether you need a custom Shopify store, business website, mobile application, or digital marketing strategy, we\'re ready to help.', 'Start Your Project', 'Contact Us')}`;

  return pageShell(depth, {
    title: 'About Aalphaleo Digital Solution | Shopify Development Experts',
    description: 'Learn about Aalphaleo Digital Solution, our mission, values, expertise, and how we help businesses grow with premium Shopify development and digital marketing.',
    path: '/about/',
    activePath: '/about/',
    body,
  });
}

module.exports = { aboutPage };
