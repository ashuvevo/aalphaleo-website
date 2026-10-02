const { pageShell } = require('../partials/layout');
const {
  site, pageUrl, assetPath, escapeHtml, icon, stars,
  ctaBanner, faqSection, serviceImagePath,
  portfolioPreviewImage, getShopifyGalleryItems,
} = require('../helpers');

function archEyebrow(text) {
  return `<span class="arch-eyebrow">${escapeHtml(text)}</span>`;
}

function homePage() {
  const depth = 0;
  const contactUrl = pageUrl(depth, '/contact/');
  const portfolioUrl = pageUrl(depth, '/portfolio/');
  const galleryUrl = pageUrl(depth, '/gallery/');

  const statCards = site.stats.map((s, i) => `
    <div class="neu-stat" data-aos="fade-up" data-aos-delay="${i * 80}">
      <p class="arch-stat__value"><span class="counter" data-target="${s.value}" data-suffix="${escapeHtml(s.suffix)}">0${escapeHtml(s.suffix)}</span></p>
      <p class="arch-stat__label">${escapeHtml(s.label)}</p>
      <p class="arch-stat__desc">${escapeHtml(
        i === 0 ? 'Shopify, web, app & marketing projects delivered.' :
        i === 1 ? 'Years building digital products for growing brands.' :
        i === 2 ? 'Trusted partnerships with proven results.' :
        'Dedicated support when your business needs it.',
      )}</p>
    </div>`).join('');

  const workCards = site.portfolioProjects.slice(0, 9).map((p, i) => `
    <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="arch-work-card" data-aos="fade-up" data-aos-delay="${(i % 3) * 80}">
      <div class="arch-work-card__media">
        ${portfolioPreviewImage(depth, p)}
      </div>
      <div class="arch-work-card__body">
        <p class="arch-work-card__tags">${escapeHtml(p.tech)}</p>
        <h3 class="arch-work-card__title">${escapeHtml(p.title)}</h3>
      </div>
    </a>`).join('');

  const processSteps = site.processSteps.slice(0, 4).map((s, i) => `
    <div class="arch-process-step" data-aos="fade-up" data-aos-delay="${i * 80}">
      <span class="arch-process__ghost" aria-hidden="true">${escapeHtml(s.step)}</span>
      <p class="arch-process__num">${escapeHtml(s.step)}</p>
      <h3 class="arch-process__title">${escapeHtml(s.title)}</h3>
      <p class="arch-process__desc">${escapeHtml(s.desc)}</p>
    </div>`).join('');

  const flagshipServices = [
    {
      num: '01',
      title: 'Shopify Development',
      desc: 'Custom Shopify stores built for conversions — unique UI, Liquid development, and performance-focused architecture for D2C brands.',
      slug: 'shopify-development',
      href: '/services/shopify-development/',
      tags: 'eCommerce · Custom Stores',
    },
    {
      num: '02',
      title: 'Custom Website Development',
      desc: 'Modern business websites with premium UX, responsive layouts, and SEO-ready foundations that build trust and generate leads.',
      slug: 'custom-website-development',
      href: '/services/custom-website-development/',
      tags: 'Web Design · Development',
    },
    {
      num: '03',
      title: 'WooCommerce Development',
      desc: 'WordPress-powered eCommerce stores with custom themes, product management, and scalable shopping experiences.',
      slug: 'woocommerce-development',
      href: '/services/woocommerce-development/',
      tags: 'WordPress · eCommerce',
    },
    {
      num: '04',
      title: 'Mobile App Development',
      desc: 'Cross-platform Flutter apps with polished interfaces, smooth performance, and scalable product architecture.',
      slug: 'mobile-app-development',
      href: '/services/mobile-app-development/',
      tags: 'Flutter · iOS & Android',
    },
    {
      num: '05',
      title: 'SEO Services',
      desc: 'Technical, on-page, and content SEO strategies that improve visibility, organic traffic, and long-term search growth.',
      slug: 'seo-services',
      href: '/services/seo-services/',
      tags: 'Organic Growth · Search',
    },
    {
      num: '06',
      title: 'Google Ads Management',
      desc: 'Search, Shopping, and Performance Max campaigns optimized for qualified traffic and measurable ROI.',
      slug: 'google-ads-management',
      href: '/services/google-ads-management/',
      tags: 'PPC · Google Ads',
    },
    {
      num: '07',
      title: 'Meta Ads Management',
      desc: 'Facebook and Instagram ad campaigns designed to reach the right audience and drive profitable conversions.',
      slug: 'meta-ads-management',
      href: '/services/meta-ads-management/',
      tags: 'Meta Ads · Social',
    },
    {
      num: '08',
      title: 'Social Media Marketing',
      desc: 'Content, creatives, and social strategies that build brand presence and support consistent lead generation.',
      slug: 'social-media-marketing',
      href: '/services/social-media-marketing/',
      tags: 'Social · Content',
    },
  ];

  const serviceRows = flagshipServices.map((s, i) => `
    <a href="${pageUrl(depth, s.href)}" class="arch-service-row" data-aos="fade-up" data-aos-delay="${(i % 2) * 60}">
      <p class="arch-service-row__num">${s.num}</p>
      <div>
        <h3 class="arch-service-row__title">${escapeHtml(s.title)}</h3>
        <p class="arch-service-row__desc">${escapeHtml(s.desc)}</p>
        <p class="arch-service-row__tags">${escapeHtml(s.tags)}</p>
      </div>
      <div class="arch-service-row__image">
        <img src="${serviceImagePath(depth, s.slug)}" alt="${escapeHtml(s.title)}" width="720" height="450" loading="lazy" decoding="async">
      </div>
      <span class="arch-service-row__arrow" aria-hidden="true">→</span>
    </a>`).join('');

  const galleryItems = getShopifyGalleryItems().slice(0, 8);
  const visualFeed = galleryItems.map((item, i) => `
    <a href="${galleryUrl}" class="arch-visual-item" data-aos="fade-up" data-aos-delay="${(i % 4) * 50}">
      <img src="${assetPath(depth, `assets/images/gallery/${item.slug}.jpg`)}" alt="${escapeHtml(item.title)} design concept" width="600" height="600" loading="lazy" decoding="async">
    </a>`).join('');

  const testimonialCards = site.testimonials.map((t, i) => `
    <div class="arch-testimonial" data-aos="fade-up" data-aos-delay="${i * 80}">
      <div class="mb-4 flex gap-0.5">${stars(t.rating)}</div>
      <p class="arch-testimonial__quote">"${escapeHtml(t.text)}"</p>
      <p class="arch-testimonial__author">${escapeHtml(t.name)}</p>
      <p class="arch-testimonial__role">${escapeHtml(t.role)}, ${escapeHtml(t.company)}</p>
    </div>`).join('');

  const strengthCards = site.whyChooseUs.slice(0, 6).map((f, i) => `
    <div class="arch-strength" data-aos="fade-up" data-aos-delay="${i * 50}">
      <div class="icon-well mb-1">
        ${icon(f.icon, 'w-5 h-5 text-accent')}
      </div>
      <h3 class="arch-strength__title">${escapeHtml(f.title)}</h3>
      <p class="arch-strength__desc">${escapeHtml(f.desc)}</p>
    </div>`).join('');

  const homeFaqs = [
    { q: 'Why choose custom Shopify development over a theme?', a: 'Custom development gives you a unique brand identity, better performance, tailored functionality, and higher conversion rates compared to generic themes.' },
    { q: 'How long does a Shopify project take?', a: 'Typical projects take 4-8 weeks depending on complexity. We provide a detailed timeline during the discovery phase.' },
    { q: 'Do you provide ongoing support after launch?', a: 'Yes. We offer maintenance plans with bug fixes, updates, performance monitoring, and dedicated support.' },
    { q: 'Can you migrate my existing store to Shopify?', a: 'Absolutely. We handle full migrations from WooCommerce, WordPress, Magento, Wix, and other platforms with SEO preservation.' },
    { q: 'Do you work with international clients?', a: 'Yes. We serve clients globally with remote collaboration, regular updates, and flexible communication channels.' },
    { q: 'Will my website be mobile-friendly and SEO-ready?', a: 'Every project we build is mobile-first, performance optimized, and structured for search visibility from day one.' },
  ];

  const heroImage = assetPath(depth, 'assets/images/home-hero-showcase.png');

  const body = `
    <section class="arch-hero" aria-label="Introduction">
      <div class="container-custom">
        <div class="grid items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div data-hero-content>
            <p class="section-eyebrow">Digital Agency · ${escapeHtml(site.company.address)}</p>
            <h1 class="arch-hero__title mt-6">
              ${escapeHtml(site.company.tagline.replace('.', ''))}
            </h1>
            <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              We design and build high-performance Shopify stores, custom websites, mobile apps, and digital marketing systems that help businesses grow online.
            </p>
            <div class="arch-hero__meta">
              <span>Based in ${escapeHtml(site.company.address)}</span>
              <span aria-hidden="true">·</span>
              <span>Available worldwide</span>
            </div>
            <div class="mt-10 flex flex-wrap gap-4">
              <a href="${contactUrl}" class="btn-primary">Start Your Project</a>
              <a href="#works" class="btn-secondary">See Featured Works</a>
            </div>
          </div>
          <div class="hero-showcase" data-aos="fade-left">
            <img src="${heroImage}" alt="Aalphaleo portfolio showcase of Shopify storefronts" width="960" height="720" loading="eager" fetchpriority="high" decoding="async">
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="arch-section bg-white">
      <div class="container-custom">
        <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-aos="fade-up">
            ${archEyebrow('Who we are!')}
            <h2 class="arch-display mt-2">A digital agency committed to blending strategy, design, and development.</h2>
            <p class="arch-body mt-6">
              ${escapeHtml(site.company.name)} builds high-performance Shopify stores, custom websites, mobile apps, and marketing systems that help businesses grow online — with premium UI, measurable results, and long-term partnership.
            </p>
            <a href="${contactUrl}" class="btn-primary mt-8">${icon('mail', 'w-5 h-5')} Start Your Project</a>
          </div>
          <div class="hero-showcase" data-aos="fade-up">
            <img src="${heroImage}" alt="Selected Aalphaleo digital projects" width="960" height="720" loading="lazy" decoding="async">
          </div>
        </div>
        <div class="arch-stat-grid mt-14 md:mt-16">${statCards}</div>
      </div>
    </section>

    <section class="arch-section">
      <div class="container-custom max-w-4xl text-center" data-aos="fade-up">
        ${archEyebrow('Mission')}
        <h2 class="arch-display mt-4">Growth through design, development &amp; strategy.</h2>
        <p class="arch-body mx-auto mt-6">
          We help brands stand out with custom digital experiences — from Shopify storefronts and business websites to apps, SEO, and paid campaigns that turn traffic into revenue.
        </p>
      </div>
    </section>

    <section id="works" class="arch-section">
      <div class="container-custom">
        <div class="mb-12 max-w-3xl" data-aos="fade-up">
          ${archEyebrow('Selected works')}
          <h2 class="arch-display mt-2">Work that speaks louder</h2>
          <p class="arch-body mt-4">Discover projects where strategy, design, and development come together to help brands grow across eCommerce, web, and mobile.</p>
        </div>
        <div class="arch-work-grid">${workCards}</div>
        <div class="mt-10 text-center">
          <a href="${portfolioUrl}" class="btn-secondary">View Full Portfolio ${icon('arrow-right', 'w-4 h-4')}</a>
        </div>
      </div>
    </section>

    <section class="arch-section py-20 md:py-28 lg:py-32">
      <div class="container-custom arch-manifesto text-center" data-aos="fade-up">
        <p class="arch-manifesto__line">Building digital products</p>
        <p class="arch-manifesto__line mt-2"><span class="gradient-text">with strategy and craft</span></p>
        <p class="arch-manifesto__line mt-2">one project at a time.</p>
      </div>
    </section>

    <section id="process" class="arch-section">
      <div class="container-custom">
        <div class="mb-12 max-w-3xl" data-aos="fade-up">
          ${archEyebrow('Our approach & process')}
          <h2 class="arch-display mt-2">Creative approach</h2>
          <p class="arch-body mt-4">A proven process from discovery to launch — designed to reduce risk, maintain clarity, and deliver premium results.</p>
        </div>
        <div class="arch-process-grid">${processSteps}</div>
        <div class="mt-12">
          <a href="#services" class="btn-secondary">Explore Services ${icon('arrow-down-right', 'w-5 h-5')}</a>
        </div>
      </div>
    </section>

    <section id="services" class="arch-section">
      <div class="container-custom">
        <div class="mb-8 max-w-3xl" data-aos="fade-up">
          ${archEyebrow('Services we provide')}
          <h2 class="arch-display mt-2">Complete digital solutions</h2>
          <p class="arch-body mt-4">Shopify, websites, WooCommerce, mobile apps, SEO, Google Ads, Meta Ads, and social media — tailored to your business goals.</p>
        </div>
        <div class="arch-service-list">${serviceRows}</div>
      </div>
    </section>

    <section class="arch-section">
      <div class="container-custom">
        <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between" data-aos="fade-up">
          <div>
            ${archEyebrow('Visual feed')}
            <h2 class="arch-display mt-2">Design gallery</h2>
            <p class="arch-body mt-3 max-w-xl">Shopify homepage concepts and eCommerce UI explorations across fashion, beauty, and lifestyle brands.</p>
          </div>
          <a href="${galleryUrl}" class="btn-secondary shrink-0">View Full Gallery</a>
        </div>
        <div class="arch-visual-grid">${visualFeed}</div>
      </div>
    </section>

    <section class="arch-section arch-section--surface">
      <div class="container-custom">
        <div class="mb-10 max-w-2xl" data-aos="fade-up">
          ${archEyebrow('Client testimonials')}
          <h2 class="arch-display mt-2">What our clients say</h2>
        </div>
        <div class="grid gap-8 md:grid-cols-2">${testimonialCards}</div>
      </div>
    </section>

    <section class="arch-section">
      <div class="container-custom">
        <div class="mb-10 max-w-2xl" data-aos="fade-up">
          ${archEyebrow('Why choose us')}
          <h2 class="arch-display mt-2">Built for brands that want to grow</h2>
        </div>
        <div class="arch-strength-grid">${strengthCards}</div>
      </div>
    </section>

    ${faqSection(homeFaqs, 'home-faq')}
    ${ctaBanner(depth, 'Ready to Grow Your Business Online?', 'Contact Aalphaleo Digital Solution today — let\'s build a fast, modern, conversion-focused digital presence for your brand.', 'Start Your Project', 'WhatsApp Us')}`;

  return pageShell(depth, {
    title: 'Custom Shopify Website Development | Aalphaleo Digital Solution',
    description: 'Premium Shopify website development, custom web development, WooCommerce, mobile apps, SEO and digital marketing services.',
    path: '/',
    activePath: '/',
    body,
    overlayHeader: true,
    anchorNav: true,
    darkOverlay: false,
  });
}

module.exports = { homePage };
