const { pageShell } = require('../partials/layout');
const {
  site, pageUrl, assetPath, escapeHtml, icon,
  sectionHeading, ctaBanner, breadcrumbs, faqSection,
} = require('../helpers');
const { getCategoryLabel } = require('../lib/blogs');

function categoryLabel(category) {
  return getCategoryLabel(category);
}

function blogFeaturedImage(depth, post, { eager = false } = {}) {
  if (!post.featuredImage) {
    return `<div class="blog-card-media aspect-video bg-gradient-to-br from-orange/10 to-secondary/10 flex items-center justify-center">${icon('file-text', 'w-10 h-10 text-orange/40')}</div>`;
  }
  const src = assetPath(depth, post.featuredImage);
  const alt = escapeHtml(post.featuredImageAlt || post.title);
  const loading = eager ? 'eager' : 'lazy';
  return `<div class="blog-card-media aspect-video overflow-hidden bg-border">
    <img src="${src}" alt="${alt}" class="h-full w-full object-cover" width="1280" height="720" loading="${loading}" decoding="async">
  </div>`;
}

function blogPage() {
  const depth = 1;

  const filterButtons = site.blogCategories.map(c =>
    `<button class="filter-btn rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:border-orange hover:text-orange ${c.id === 'all' ? 'bg-brand-gradient text-white border-orange' : 'bg-white text-primary'}" data-filter="${c.id}">${escapeHtml(c.label)}</button>`
  ).join('');

  const blogCards = site.blogPosts.map((post, i) => `
    <article class="blog-item card compact-card overflow-hidden !p-0" data-category="${post.category}" data-aos="fade-up" data-aos-delay="${Math.min(i * 30, 300)}">
      ${blogFeaturedImage(depth, post)}
      <div class="p-3 sm:p-5 flex flex-1 flex-col">
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <span class="badge text-xs">${escapeHtml(categoryLabel(post.category))}</span>
          <span class="text-xs text-muted">${escapeHtml(post.displayDate || post.date)}</span>
          <span class="text-xs text-muted">${escapeHtml(post.readingTime || '')}</span>
        </div>
        <h2 class="text-base font-semibold text-primary hover:text-orange transition-colors sm:text-lg">
          <a href="${pageUrl(depth, `/blog/${post.slug}/`)}">${escapeHtml(post.title)}</a>
        </h2>
        <p class="mt-2 text-sm text-muted line-clamp-3">${escapeHtml(post.excerpt)}</p>
        <a href="${pageUrl(depth, `/blog/${post.slug}/`)}" class="btn-text mt-3 text-sm">Read More ${icon('arrow-right', 'w-4 h-4')}</a>
      </div>
    </article>`).join('');

  const body = `
    ${breadcrumbs(depth, [{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog/' }])}

    <section class="hero-gradient section-padding">
      <div class="container-custom text-center">
        <div data-aos="fade-up">
          <span class="section-eyebrow">Blog</span>
          <h1 class="mt-4 text-4xl font-bold text-primary md:text-5xl">Insights & <span class="gradient-text">Resources</span></h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">Expert articles on Shopify, SEO, digital marketing, web development, and business growth.</p>
          <p class="mt-3 text-sm text-muted">${site.blogPosts.length} articles</p>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="mb-8 flex flex-wrap justify-center gap-3" data-filter-bar>${filterButtons}</div>
        <div class="grid-cards-3" data-filter-grid>${blogCards}</div>
      </div>
    </section>

    ${ctaBanner(depth, 'Ready to Grow Your Business?', 'Turn insights into action. Contact us to discuss your project.')}`;

  return pageShell(depth, {
    title: 'Blog | Aalphaleo Digital Solution',
    description: 'Expert articles on Shopify development, SEO, Google Ads, Meta Ads, web development, and business growth strategies.',
    path: '/blog/',
    activePath: '/blog/',
    body,
  });
}

function buildSchemaScript(post, faqs) {
  const base = site.company.website.replace(/\/$/, '');
  const url = `${base}/blog/${post.slug}/`;

  const graph = post.schema && post.schema['@graph']
    ? post.schema['@graph']
    : [
        {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.metaDescription || post.excerpt,
          author: { '@type': 'Organization', name: post.author || site.company.name },
          publisher: {
            '@type': 'Organization',
            name: site.company.name,
            url: base,
          },
          datePublished: post.date,
          dateModified: post.lastUpdated || post.date,
          mainEntityOfPage: url,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${base}/blog/` },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
          ],
        },
      ];

  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

function blogPostPage(post) {
  const depth = 2;
  const documentTitle = post.slug === 'shopify-speed-optimization'
    ? 'Shopify Speed Optimization Guide | Aalphaleo'
    : (post.metaTitle || `${post.title} | Aalphaleo Digital Solution Blog`);

  const relatedPosts = site.blogPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const fallbackRelated = site.blogPosts
    .filter(p => p.slug !== post.slug && !relatedPosts.includes(p))
    .slice(0, 3 - relatedPosts.length);

  const allRelated = [...relatedPosts, ...fallbackRelated].slice(0, 3);

  const relatedCards = allRelated.map(p => `
    <a href="${pageUrl(depth, `/blog/${p.slug}/`)}" class="card compact-card group overflow-hidden !p-0">
      ${blogFeaturedImage(depth, p)}
      <div class="p-4">
        <span class="badge text-xs mb-2">${escapeHtml(categoryLabel(p.category))}</span>
        <h3 class="font-semibold text-primary group-hover:text-orange transition-colors">${escapeHtml(p.title)}</h3>
      </div>
    </a>`).join('');

  const postFaqs = post.faqs && post.faqs.length
    ? post.faqs
    : [
        { q: `How can ${categoryLabel(post.category).toLowerCase()} help my business?`, a: 'Implementing the strategies discussed in this article can significantly improve your online presence, drive more traffic, and increase conversions.' },
        { q: 'Can Aalphaleo help implement these strategies?', a: 'Yes. Our team specializes in executing these strategies for businesses. Book a free consultation to discuss your needs.' },
      ];

  const body = `
    ${breadcrumbs(depth, [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog/' },
      { label: post.title, href: `/blog/${post.slug}/` },
    ], { includeSchema: false })}

    <article>
      <section class="hero-gradient section-padding">
        <div class="container-custom max-w-3xl">
          <div data-aos="fade-up">
            <span class="badge mb-4">${escapeHtml(categoryLabel(post.category))}</span>
            <h1 class="text-3xl font-bold text-primary md:text-4xl lg:text-5xl">${escapeHtml(post.title)}</h1>
            <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>Published ${escapeHtml(post.displayDate || post.date)}</span>
              ${post.readingTime ? `<span>${escapeHtml(post.readingTime)}</span>` : ''}
              <span>By ${escapeHtml(post.author || site.company.name)}</span>
            </div>
          </div>
          <div class="mt-8 overflow-hidden rounded-card shadow-lift" data-aos="fade-up" data-aos-delay="100">
            ${blogFeaturedImage(depth, post, { eager: true })}
          </div>
        </div>
      </section>

      <section class="section-padding bg-white">
        <div class="container-custom max-w-3xl">
          <div class="blog-content" data-aos="fade-up">
            ${post.html}
          </div>

          <div class="mt-12 flex flex-wrap gap-4">
            <a href="${pageUrl(depth, '/contact/')}" class="btn-primary">Book Free Consultation</a>
            <a href="${pageUrl(depth, '/services/shopify-development/')}" class="btn-secondary">Our Shopify Services</a>
          </div>
        </div>
      </section>

      ${faqSection(postFaqs, `${post.slug}-faq`, { includeSchema: false })}

      ${allRelated.length ? `
      <section class="section-padding bg-bg">
        <div class="container-custom">
          ${sectionHeading('Related Articles', 'Continue Reading')}
          <div class="grid-cards-3 md:grid-cols-3">${relatedCards}</div>
        </div>
      </section>` : ''}
    </article>

    ${ctaBanner(depth, 'Ready to Take Action?', 'Let\'s discuss how we can help implement these strategies for your business.')}
    ${buildSchemaScript(post, postFaqs)}`;

  return pageShell(depth, {
    title: documentTitle,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}/`,
    activePath: '/blog/',
    body,
  });
}

function allBlogPostPages() {
  return site.blogPosts.map(post => ({
    path: `blog/${post.slug}/index.html`,
    html: blogPostPage(post),
  }));
}

module.exports = { blogPage, blogPostPage, allBlogPostPages };
