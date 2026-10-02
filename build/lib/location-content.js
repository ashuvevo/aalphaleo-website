/**
 * Local SEO content generator — unique copy per city × service combination.
 */

const { getRelatedCities } = require('./cities');

function seed(citySlug, serviceSlug, salt = 0) {
  const s = `${citySlug}:${serviceSlug}:${salt}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick(arr, citySlug, serviceSlug, salt = 0) {
  return arr[seed(citySlug, serviceSlug, salt) % arr.length];
}

function pickMany(arr, count, citySlug, serviceSlug, salt = 0) {
  const copy = [...arr];
  const out = [];
  let s = salt;
  while (out.length < count && copy.length) {
    const idx = seed(citySlug, serviceSlug, s) % copy.length;
    out.push(copy.splice(idx, 1)[0]);
    s++;
  }
  return out;
}

function wordCount(text) {
  return String(text).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function localIndustries(city, service) {
  const base = service.industries || [];
  const regional = {
    maharashtra: ['textile traders', 'auto component suppliers', 'jewelry exporters'],
    delhi: ['wholesale markets', 'government contractors', 'education consultancies'],
    karnataka: ['IT services firms', 'startup founders', 'coffee exporters'],
    'tamil-nadu': ['manufacturing units', 'textile exporters', 'healthcare chains'],
    gujarat: ['diamond merchants', 'chemical manufacturers', 'garment exporters'],
    'uttar-pradesh': ['handicraft sellers', 'agri-product brands', 'distribution networks'],
    telangana: ['pharma marketers', 'real estate developers', 'cloud SaaS teams'],
    'west-bengal': ['tea brands', 'artisan retailers', 'logistics operators'],
    rajasthan: ['handicraft stores', 'tourism operators', 'marble exporters'],
    kerala: ['spice exporters', 'Ayurveda brands', 'tourism hospitality groups'],
  };
  const extra = regional[city.stateSlug] || ['growing SMBs', 'local retailers', 'service providers'];
  return pickMany([...base, ...extra], 5, city.slug, service.slug, 10);
}

function buildMeta(city, service) {
  const pk = service.primaryKeyword.replace('{city}', city.name);
  const metaTitle = `${service.shortTitle} in ${city.name} | ${city.state} | Aalphaleo`;
  const metaDescription = `Hire Aalphaleo for ${pk}. Custom ${service.shortTitle.toLowerCase()} for businesses in ${city.name}, ${city.state}. Free consultation. Call +91 9288621081.`;
  return { metaTitle: metaTitle.slice(0, 60), metaDescription: metaDescription.slice(0, 160), primaryKeyword: pk };
}

function buildFaqs(city, service) {
  const pk = service.primaryKeyword.replace('{city}', city.name);
  const pools = [
    { q: `How much does ${service.shortTitle.toLowerCase()} cost in ${city.name}?`, a: `Pricing depends on scope, integrations, and timeline. Aalphaleo offers transparent quotes after a free discovery call. Most ${city.name} projects start with a clear milestone plan so you know exactly what you are investing in.` },
    { q: `Why choose Aalphaleo for ${pk}?`, a: `We combine custom development, conversion-focused design, and measurable marketing support. ${city.name} businesses work with us because we deliver production-ready solutions—not templates—with dedicated communication and post-launch support.` },
    { q: `How long does a typical project take for ${city.name} clients?`, a: `Timelines vary by complexity. Shopify and website projects often take 4–8 weeks; SEO and ads show initial results within weeks but compound over months. We share a detailed schedule before work begins.` },
    { q: `Do you serve businesses only in ${city.name}?`, a: `We are headquartered in India and serve ${city.name}, across ${city.state}, and clients nationwide. Remote collaboration, WhatsApp updates, and scheduled video calls keep projects smooth.` },
    { q: `Can you help ${city.name} businesses already using another platform?`, a: `Yes. We handle migrations, redesigns, SEO recovery, and ad account restructuring while protecting existing data, rankings, and customer experience wherever possible.` },
    { q: `What industries in ${city.name} do you work with?`, a: `We support D2C brands, local service providers, manufacturers, healthcare, education, real estate, and eCommerce sellers. Our ${service.shortTitle.toLowerCase()} approach adapts to your industry and buyer journey.` },
    { q: `Do you provide ongoing support after launch?`, a: `Absolutely. Maintenance, SEO retainers, ad management, and CRO improvements are available so your ${city.name} business keeps growing after the initial build or campaign setup.` },
    { q: `How do I get started with Aalphaleo in ${city.name}?`, a: `Book a free consultation through our website or WhatsApp us at +91 9288621081. Share your goals, timeline, and current challenges—we will recommend a practical roadmap.` },
  ];
  return pickMany(pools, 8, city.slug, service.slug, 20).map(f => ({
    q: f.q,
    a: `${f.a} We also provide written recommendations, milestone documentation, and optional retainer support so ${city.name} teams stay informed throughout the engagement.`,
  }));
}

function introParagraphs(city, service) {
  const pk = service.primaryKeyword.replace('{city}', city.name);
  const industries = localIndustries(city, service).slice(0, 3).join(', ');
  const openers = [
    `Businesses in ${city.name} are competing online faster than ever. Whether you run a storefront in ${city.state} or sell across India, **${pk}** needs a partner who understands both technology and revenue outcomes—not just deliverables.`,
    `${city.name} has become one of ${city.state}'s active commercial hubs, with ${industries} investing heavily in digital channels. If you are evaluating **${pk}**, you need clarity on scope, ROI, and execution before committing budget.`,
    `From local startups to established ${city.name} brands, the demand for reliable **${pk}** continues to rise. Customers expect fast websites, trustworthy checkout flows, and visible search presence before they buy.`,
    `Companies across ${city.name} tell us the same story: generic templates and disconnected agencies slowed their growth. **${pk}** should accelerate sales, improve trust, and create measurable marketing performance.`,
  ];
  const middles = [
    `Aalphaleo Digital Solution helps ${city.name} businesses build premium digital experiences with custom Shopify development, business websites, SEO, and paid media. We align design, development, and marketing around your KPIs from day one.`,
    `Our team supports ${city.name} clients with discovery workshops, transparent timelines, and production-quality delivery. You get direct access to specialists—not account managers reading scripts.`,
    `We have delivered projects for fashion, beauty, electronics, B2B, and service brands. For ${city.name}, we tailor strategy to local buyer behavior, payment preferences, and competitive positioning in ${city.state}.`,
    `Instead of one-size-fits-all packages, we scope ${service.shortTitle.toLowerCase()} around your catalog size, traffic sources, and growth stage. That keeps investments focused on what moves revenue in ${city.name}.`,
  ];
  const closers = [
    `On this page, you will learn how our ${service.shortTitle.toLowerCase()} works for ${city.name}, what results to expect, and how to start with a free consultation.`,
    `Below, we break down benefits, process, FAQs, and related services so ${city.name} decision-makers can evaluate ${pk} with confidence.`,
    `Read on for a practical overview of how Aalphaleo delivers ${service.shortTitle.toLowerCase()} for organizations in ${city.name} and nearby markets.`,
    `Use this guide to understand our approach, then contact us to discuss a customized plan for your ${city.name} business.`,
  ];
  return [
    pick(openers, city.slug, service.slug, 1),
    pick(middles, city.slug, service.slug, 2),
    pick(openers, city.slug, service.slug, 4),
    pick(middles, city.slug, service.slug, 5),
    pick(closers, city.slug, service.slug, 3),
  ];
}

function whyChooseParagraphs(city, service) {
  const pk = service.primaryKeyword.replace('{city}', city.name);
  return pickMany([
    `**Custom-built, never cookie-cutter.** Your ${city.name} brand deserves a unique experience. We avoid bloated templates that slow pages and confuse shoppers.`,
    `**SEO-first architecture.** Every ${service.shortTitle.toLowerCase()} project includes clean URLs, metadata, schema, and performance foundations so ${city.name} customers can find you organically.`,
    `**Conversion-focused UX.** We design for clarity—strong headlines, trust signals, mobile checkout, and CTAs that match how ${city.state} buyers actually purchase.`,
    `**Transparent communication.** ${city.name} clients receive milestone updates, shared task boards, and direct access to developers and strategists.`,
    `**Full-funnel capability.** From ${pk} to Google Ads, Meta Ads, and SEO retainers, Aalphaleo supports long-term growth—not just a one-time launch.`,
    `**Post-launch partnership.** Maintenance, optimization, and analytics reviews keep your investment working after go-live.`,
  ], 5, city.slug, service.slug, 30);
}

function serviceParagraphs(city, service) {
  const pk = service.primaryKeyword.replace('{city}', city.name);
  const intros = {
    'shopify-development': `${pk} at Aalphaleo means a store engineered for your products, brand, and checkout flow. We build custom Liquid sections, optimize collection filters, and integrate payments popular in ${city.name} including UPI-friendly gateways.`,
    'website-development': `Our ${pk} service delivers fast, responsive business websites with lead-focused layouts. ${city.name} companies get clear service pages, contact funnels, and admin-friendly content structures.`,
    woocommerce: `We customize WooCommerce for ${city.name} merchants who need WordPress flexibility with robust catalog, tax, and shipping rules for ${city.state} operations.`,
    seo: `${pk} begins with technical audits, keyword mapping for ${city.name} search intent, on-page improvements, and content plans that attract qualified traffic.`,
    'google-ads': `We structure Search, Shopping, and Performance Max campaigns targeting buyers in ${city.name} and beyond, with conversion tracking tied to real revenue.`,
    'meta-ads': `Our ${pk} includes pixel setup, creative testing, and retargeting funnels tuned for ${city.name} D2C and lead-gen brands.`,
    'flutter-development': `We build cross-platform Flutter apps for ${city.name} businesses that need mobile ordering, booking, or customer engagement on iOS and Android.`,
    maintenance: `${pk} covers security patches, backups, uptime monitoring, and content updates so ${city.name} sites stay fast and secure.`,
  };
  const deliverables = pickMany(service.deliverables, 4, city.slug, service.slug, 40);
  const body = [
    intros[service.slug] || `Aalphaleo delivers professional ${pk} tailored to ${city.name} business goals.`,
    `Typical deliverables include ${deliverables.slice(0, 2).join(', ')}. We also configure ${deliverables.slice(2).join(', ')} based on your requirements.`,
    `For ${city.name} teams, we run weekly check-ins during active phases and document every change so stakeholders stay aligned. Whether you are launching or optimizing, our ${service.shortTitle.toLowerCase()} process reduces guesswork.`,
    `If you already have analytics or ad accounts, we audit existing setup before making changes—protecting historical data while improving performance for ${city.state} audiences.`,
    `We map user journeys specific to ${city.name}: discovery on Google or social, comparison on mobile, checkout or form submission, and post-purchase follow-up. Each touchpoint receives deliberate UX and tracking so you know what converts.`,
    `Quality assurance includes cross-browser testing, payment test transactions, form validation, and speed checks on real devices common among ${city.state} users before anything goes live.`,
  ];
  return body;
}

function benefitsList(city, service) {
  return pickMany(service.benefits, 6, city.slug, service.slug, 50);
}

function localMarketParagraphs(city, service) {
  const industries = localIndustries(city, service);
  return [
    `**Local market insight for ${city.name}.** ${city.state} buyers often research on mobile, compare prices aggressively, and expect COD or UPI options. Our ${service.shortTitle.toLowerCase()} accounts for these behaviors.`,
    `**Industries we commonly serve in ${city.name}:** ${industries.join(', ')}. Each sector receives tailored page structures, offers, and tracking.`,
    `**Competitive positioning.** We analyze top competitors visible in ${city.name} search results and design differentiation through speed, UX, and messaging—not discount wars alone.`,
    `**Scalable foundation.** As your ${city.name} business grows into new categories or regions, our architecture supports expansion without rebuilding from scratch.`,
  ];
}

function processParagraphs(city, service) {
  return [
    `Our proven process keeps ${city.name} projects on schedule: Discovery → Strategy → Design → Development → QA → Launch → Optimization. Each phase has clear approvals so you always know what happens next.`,
    `During discovery, we document goals, audiences in ${city.state}, integrations, and success metrics. Strategy translates those into sitemap, wireframes, or campaign structure before production begins.`,
    `After launch, we monitor Core Web Vitals, conversions, and search visibility—recommending iterative improvements that compound results for ${city.name} brands.`,
  ];
}

function pricingParagraph(city, service) {
  return `Investment for ${service.shortTitle.toLowerCase()} in ${city.name} depends on scope. Starter engagements suit focused launches; professional packages cover full custom builds with integrations; enterprise scopes add automation and dedicated support. View our [pricing page](/pricing/) or request a custom quote—most ${city.name} clients begin with a free consultation.`;
}

function extendedParagraphs(city, service) {
  const pk = service.primaryKeyword.replace('{city}', city.name);
  const pool = [
    `Search behavior in ${city.name} continues shifting toward mobile-first discovery. When prospects compare vendors for ${pk}, they notice page speed, reviews, and clarity within seconds. Aalphaleo builds assets that pass that quick judgment test while staying aligned with Google quality guidelines.`,
    `Marketing teams in ${city.state} often juggle multiple agencies—one for design, another for ads, another for SEO. That fragmentation creates inconsistent tracking and conflicting priorities. Our ${service.shortTitle.toLowerCase()} model centralizes strategy so ${city.name} stakeholders see one roadmap and one set of KPIs.`,
    `Technical debt slows many ${city.name} websites: unused apps, uncompressed images, duplicate metadata, and broken internal links. We remediate these issues during ${service.shortTitle.toLowerCase()} projects so performance and crawl efficiency improve together—not as afterthoughts.`,
    `Local trust matters. ${city.name} customers look for phone numbers, policy pages, delivery timelines, and authentic brand storytelling. We weave these elements into layout and copy recommendations so visitors feel confident before they contact you.`,
    `Seasonal campaigns—from festivals to annual sales—require flexible CMS sections and ad landing pages. We architect ${service.shortTitle.toLowerCase()} deliverables so ${city.name} teams can launch promotions without developer bottlenecks.`,
    `Analytics discipline separates guesswork from growth. We configure GA4 events, conversion labels, and dashboards that show which ${city.name} channels drive revenue, enabling smarter budget allocation month over month.`,
    `Accessibility and usability are SEO signals and brand signals simultaneously. Keyboard navigation, readable contrast, and descriptive alt text help every user while reinforcing professionalism for ${city.state} audiences.`,
    `Security cannot be optional. SSL, role-based admin access, update cadence, and backup routines are built into our ${service.shortTitle.toLowerCase()} workflow for ${city.name} clients handling customer data and payments.`,
    `Competitors in ${city.name} may already invest in ${pk}. Differentiation comes from sharper positioning, faster experiences, and offers mapped to buyer intent—not merely copying rival layouts.`,
    `Long-term partnerships outperform one-off launches. Many ${city.name} businesses retain Aalphaleo for maintenance, CRO tests, and campaign optimization after the initial ${service.shortTitle.toLowerCase()} engagement—keeping momentum compounding.`,
    `Content supports every stage of the funnel. We help ${city.name} brands publish helpful guides, FAQs, and case-style proof that answer real buyer questions while strengthening topical authority.`,
    `Cross-border ambitions are common among ${city.state} exporters. Our ${service.shortTitle.toLowerCase()} implementations consider multi-currency display, international shipping messaging, and hreflang when relevant.`,
    `Stakeholder alignment prevents rework. We document requirements, wireframes, and acceptance criteria so ${city.name} founders, marketing leads, and operations teams share the same definition of done.`,
    `Post-launch experiments—headline tests, layout tweaks, bid adjustments—turn data into revenue. We establish a test backlog tailored to ${city.name} traffic patterns rather than generic best practices alone.`,
    `Choosing ${pk} is a business decision, not a cosmetic one. Aalphaleo ties every recommendation to measurable outcomes: leads, orders, ROAS, organic sessions, or retention—whatever defines success for your ${city.name} organization.`,
  ];
  return pickMany(pool, 10, city.slug, service.slug, 60);
}

function strategyParagraphs(city, service) {
  const pk = service.primaryKeyword.replace('{city}', city.name);
  const pool = [
    `Before writing a single line of code, we clarify business model, average order value, sales cycle length, and primary acquisition channels for your ${city.name} operation. That context shapes every ${service.shortTitle.toLowerCase()} decision.`,
    `We review competitor SERPs, ad libraries, and social presence in ${city.state} to identify gaps you can own—whether through better product pages, sharper offers, or faster mobile experiences.`,
    `Buyer personas for ${city.name} often blend local trust factors with national brand expectations. We translate those insights into headlines, proof points, and page hierarchy that resonate with your audience.`,
    `Channel mix matters: organic SEO, paid search, Meta retargeting, WhatsApp follow-ups, and email flows should reinforce each other. Our ${pk} roadmap shows how channels connect rather than compete.`,
    `Budget planning includes phased rollout options so ${city.name} SMEs can start lean and scale investment as KPIs improve—avoiding oversized launches that strain cash flow.`,
    `We document KPIs upfront: conversion rate, cost per lead, ROAS, organic impressions, or app downloads. ${city.name} stakeholders receive dashboards aligned to those metrics from week one.`,
    `Risk mitigation covers backup plans for platform migrations, ad account transitions, and DNS changes—critical when ${city.state} businesses cannot afford downtime during peak seasons.`,
    `Training handoffs ensure your ${city.name} team can update products, publish blog posts, or adjust bids confidently after launch, reducing long-term dependency on external support.`,
  ];
  return pickMany(pool, 5, city.slug, service.slug, 70);
}

function implementationParagraphs(city, service) {
  const pk = service.primaryKeyword.replace('{city}', city.name);
  return [
    `Implementation for ${city.name} clients follows documented sprints with demo links at each milestone. You preview progress in staging environments before anything reaches production traffic.`,
    `We integrate tools your team already uses—CRM, ERP, WhatsApp Business API, shipping partners, or accounting software—so ${service.shortTitle.toLowerCase()} fits operational reality in ${city.state}.`,
    `Performance targets include Core Web Vitals in the green, accessible navigation, and structured data validated in Google Rich Results. These technical foundations support ${pk} visibility and user trust.`,
    `Launch day includes search console submission, analytics verification, ad pixel testing, and a rollback checklist. ${city.name} businesses get a structured go-live—not a rushed upload.`,
    `Post-launch, we schedule 30-, 60-, and 90-day reviews to compare actual vs. projected outcomes and prioritize the next optimization backlog for sustained growth in ${city.name}.`,
  ];
}

function conclusionParagraphs(city, service) {
  const pk = service.primaryKeyword.replace('{city}', city.name);
  return [
    `If you are ready to improve ${pk}, Aalphaleo Digital Solution is your partner for strategy, execution, and ongoing optimization in ${city.name}. We combine Shopify expertise, custom development, SEO, and paid media under one roof.`,
    `Book a free consultation to discuss timelines, investment, and expected outcomes. Call **+91 9288621081** or visit **https://www.aalphaleo.com**—**Solving Your Business Problem.**`,
    `Whether you are launching a new venture in ${city.state} or scaling an established brand, our ${service.shortTitle.toLowerCase()} team will help you move from planning to measurable growth with confidence.`,
  ];
}

function imagePrompts(city, service) {
  const pk = service.primaryKeyword.replace('{city}', city.name);
  return {
    hero: `Modern ${service.shortTitle.toLowerCase()} hero banner for ${city.name}, abstract city skyline silhouette, orange gradient (#FE9B21 to #F12A33), dark gray (#29292A), glassmorphism, no text, 16:9`,
    service: `Service illustration for ${pk}, laptop with analytics dashboard, brand orange accents, professional SaaS aesthetic, no text`,
    cta: `Call-to-action banner background, warm orange gradient, subtle geometric shapes, dark contrast, no text, wide format`,
    technology: `Technology stack visualization for ${service.shortTitle}, minimal icons, orange highlights on dark background, no text`,
    local: `Abstract local business growth concept for ${city.name}, ${city.state}, storefront and digital icons, brand colors, no text`,
  };
}

function buildSchema(city, service, faqs, pageUrl) {
  const base = 'https://www.aalphaleo.com';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        name: 'Aalphaleo Digital Solution',
        url: base,
        telephone: '+91 9288621081',
        description: 'Premium Shopify development and digital marketing agency serving businesses in India.',
        areaServed: { '@type': 'City', name: city.name, containedInPlace: { '@type': 'State', name: city.state } },
      },
      {
        '@type': 'Service',
        name: `${service.title} in ${city.name}`,
        description: service.primaryKeyword.replace('{city}', city.name),
        provider: { '@type': 'Organization', name: 'Aalphaleo Digital Solution', url: base },
        areaServed: { '@type': 'City', name: city.name },
        serviceType: service.title,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'Locations', item: `${base}/locations/` },
          { '@type': 'ListItem', position: 3, name: service.title, item: `${base}/locations/${service.folder}/` },
          { '@type': 'ListItem', position: 4, name: city.name, item: `${base}${pageUrl}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}

function generateLocationContent(city, service, blogPosts = []) {
  const fileSlug = `${service.slug}-${city.slug}`;
  const pagePath = `/locations/${service.folder}/${fileSlug}.html`;
  const meta = buildMeta(city, service);
  const faqs = buildFaqs(city, service);
  const h1 = service.h1Template.replace('{city}', city.name);

  const sections = {
    intro: introParagraphs(city, service),
    whyChoose: whyChooseParagraphs(city, service),
    service: serviceParagraphs(city, service),
    localMarket: localMarketParagraphs(city, service),
    process: processParagraphs(city, service),
    pricing: pricingParagraph(city, service),
    benefits: benefitsList(city, service),
    extended: extendedParagraphs(city, service),
    strategy: strategyParagraphs(city, service),
    implementation: implementationParagraphs(city, service),
    conclusion: conclusionParagraphs(city, service),
  };

  const relatedCities = getRelatedCities(city, 6);
  const relatedBlogs = blogPosts
    .filter(b => b.category === service.blogCategory)
    .slice(0, 3);
  const blogLinks = relatedBlogs.length
    ? relatedBlogs
    : blogPosts.slice(0, 3);

  const allText = [
    h1, meta.metaDescription, ...sections.intro, ...sections.whyChoose,
    ...sections.service, ...sections.localMarket, ...sections.process,
    ...sections.strategy, ...sections.implementation,
    sections.pricing, ...sections.benefits, ...sections.extended, ...sections.conclusion,
    ...faqs.map(f => f.q + ' ' + f.a),
  ].join(' ');

  return {
    fileSlug,
    pagePath,
    h1,
    ...meta,
    faqs,
    sections,
    relatedCities,
    relatedBlogs: blogLinks,
    imagePrompts: imagePrompts(city, service),
    schema: buildSchema(city, service, faqs, pagePath),
    wordCount: wordCount(allText),
  };
}

module.exports = {
  generateLocationContent,
  wordCount,
  seed,
};
