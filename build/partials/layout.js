const { site, assetPath, pageUrl, escapeHtml, icon, footerLocationsSection } = require('../helpers');
const { cookieConsentMarkup } = require('./cookie-consent');
const fs = require('fs');
const path = require('path');

function assetVersion(relativePath) {
  const filePath = path.join(__dirname, '..', '..', 'out', relativePath);
  if (!fs.existsSync(filePath)) return '';
  return `?v=${Math.floor(fs.statSync(filePath).mtimeMs)}`;
}

function logo(depth, { heightClass = 'h-12', extraClass = '' } = {}) {
  const src = assetPath(depth, 'assets/images/logo.png');
  return `<img src="${src}" alt="${escapeHtml(site.company.name)}" class="logo-img ${heightClass} ${extraClass}" width="220" height="52">`;
}

function googleConsentModeDefault() {
  const expiryDays = site.analytics?.consentExpiryDays || 180;
  return `<!-- Google Consent Mode v2 -->
<script>
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  'ad_storage':'denied',
  'analytics_storage':'denied',
  'ad_user_data':'denied',
  'ad_personalization':'denied',
  'functionality_storage':'denied',
  'personalization_storage':'denied',
  'security_storage':'granted',
  'wait_for_update':500
});
(function(){
  try{
    var raw=localStorage.getItem('cookieConsent');
    if(!raw)return;
    var c=JSON.parse(raw);
    var exp=${expiryDays}*86400000;
    if(!c.timestamp||Date.now()-new Date(c.timestamp).getTime()>=exp)return;
    gtag('consent','update',{
      'analytics_storage':c.analytics?'granted':'denied',
      'ad_storage':c.marketing?'granted':'denied',
      'ad_user_data':c.marketing?'granted':'denied',
      'ad_personalization':c.marketing?'granted':'denied',
      'functionality_storage':c.preferences?'granted':'denied',
      'personalization_storage':c.preferences?'granted':'denied'
    });
  }catch(e){}
})();
</script>
<!-- End Google Consent Mode v2 -->`;
}

function googleTagManagerHead() {
  const gtmId = site.analytics?.gtmId;
  if (!gtmId) return '';

  return `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');</script>
<!-- End Google Tag Manager -->`;
}

function googleTagManagerBody() {
  const gtmId = site.analytics?.gtmId;
  if (!gtmId) return '';

  return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
}

function consentConfigScript() {
  const a = site.analytics || {};
  return `<script>
window.AalphaleoConsentConfig={
  ga4MeasurementId:${JSON.stringify(a.ga4MeasurementId || '')},
  metaPixelId:${JSON.stringify(a.metaPixelId || '')},
  clarityProjectId:${JSON.stringify(a.clarityProjectId || '')},
  expiryDays:${a.consentExpiryDays || 180}
};
</script>`;
}

function head(depth, { title, description, path = '/', body = '' }) {
  const css = assetPath(depth, 'assets/css/main.css') + assetVersion('assets/css/main.css');
  const cookieCss = assetPath(depth, 'assets/css/cookie-consent.css') + assetVersion('assets/css/cookie-consent.css');
  const logoUrl = assetPath(depth, 'assets/images/logo.png');
  const faviconUrl = assetPath(depth, 'assets/images/favicon.png');
  const logoAbsolute = logoUrl.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
  const canonical = `${site.company.website}${path === '/' ? '' : path}`;
  const needsSwiper = body.includes('testimonial-swiper');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${googleConsentModeDefault()}
  ${googleTagManagerHead()}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${escapeHtml(site.company.name)}">
  <meta property="og:image" content="${site.company.website}/${logoAbsolute}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${site.company.website}/${logoAbsolute}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="preconnect" href="https://unpkg.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  ${needsSwiper ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">' : ''}
  <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
  <link rel="stylesheet" href="${css}">
  <link rel="stylesheet" href="${cookieCss}">
  <link rel="icon" type="image/png" href="${faviconUrl}">
  <link rel="apple-touch-icon" href="${faviconUrl}">
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.company.website}/#organization`,
        name: site.company.name,
        url: site.company.website,
        logo: `${site.company.website}/assets/images/logo.png`,
        telephone: site.company.phone,
        email: site.company.email,
        description: site.company.tagline,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: site.company.phone,
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi'],
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${site.company.website}/#website`,
          url: site.company.website,
          name: site.company.name,
        },
        about: { '@id': `${site.company.website}/#organization` },
      },
    ],
  })}</script>
</head>`;
}

function scripts(depth, body = '') {
  const js = assetPath(depth, 'assets/js/');
  const needsSwiper = body.includes('testimonial-swiper');
  return `
  ${consentConfigScript()}
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" defer></script>
  ${needsSwiper ? '<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>' : ''}
  <script src="${js}utils.js" defer></script>
  <script src="${js}navigation.js" defer></script>
  <script src="${js}accordion.js" defer></script>
  <script src="${js}counters.js" defer></script>
  <script src="${js}forms.js" defer></script>
  ${needsSwiper ? `<script src="${js}sliders.js" defer></script>` : ''}
  <script src="${js}animations.js" defer></script>
  <script src="${js}parallax.js" defer></script>
  <script src="${js}filters.js" defer></script>
  <script src="${js}gallery.js" defer></script>
  <script src="${js}main.js" defer></script>
  <script src="${js}cookie-consent.js" defer></script>`;
}

function header(depth, activePath = '/', { overlay = false, anchorNav = false, darkOverlay = false } = {}) {
  const headerClass = [
    'site-header',
    overlay ? 'site-header--overlay' : 'site-header--solid border-b border-border',
    darkOverlay ? 'site-header--dark-overlay' : '',
  ].filter(Boolean).join(' ');

  const contactUrl = pageUrl(depth, '/contact/');
  const homeUrl = pageUrl(depth, '/');

  const anchorLinks = [
    { label: 'About', href: '#about' },
    { label: 'Works', href: '#works' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: pageUrl(depth, '/contact/') },
  ];

  let navItems;
  if (anchorNav) {
    navItems = anchorLinks.map(item => {
      const cls = 'site-header__link';
      return `<li><a href="${item.href}" class="${cls}">${escapeHtml(item.label)}</a></li>`;
    }).join('');
  } else {
    navItems = site.nav.map(item => {
      const href = pageUrl(depth, item.href);
      const isActive = activePath === item.href || (item.mega && activePath.startsWith('/services/'));
      const cls = isActive ? 'site-header__link is-active' : 'site-header__link';

      if (item.mega) {
        const groups = site.serviceGroups.map(g => `
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">${escapeHtml(g.title)}</p>
          <ul class="space-y-2">
            ${g.items.map(s => `<li><a href="${pageUrl(depth, s.href)}" class="block text-sm text-primary transition-colors hover:text-orange">${escapeHtml(s.label)}</a></li>`).join('')}
          </ul>
        </div>`).join('');

        return `
        <li class="relative group">
          <button class="${cls} flex items-center gap-1" aria-haspopup="true" aria-expanded="false" data-mega-trigger>
            Services ${icon('chevron-down', 'w-4 h-4')}
          </button>
          <div class="mega-menu invisible absolute left-1/2 top-full z-50 mt-3 w-[720px] -translate-x-1/2 rounded-card p-6 opacity-0 shadow-lift transition-all duration-300 group-hover:visible group-hover:opacity-100" data-mega-menu>
            <div class="grid grid-cols-3 gap-6">${groups}</div>
          </div>
        </li>`;
      }

      return `<li><a href="${href}" class="${cls}">${escapeHtml(item.label)}</a></li>`;
    }).join('');
  }

  let mobileLinks;
  if (anchorNav) {
    mobileLinks = anchorLinks.map(item =>
      `<li><a href="${item.href}" class="block py-3 text-xl font-medium text-primary hover:text-accent">${escapeHtml(item.label)}</a></li>`
    ).join('');
  } else {
    mobileLinks = site.nav.map(item => {
      if (item.mega) {
        const allServices = site.serviceGroups.flatMap(g =>
          g.items.map(s => `<li><a href="${pageUrl(depth, s.href)}" class="block py-2 text-lg text-muted hover:text-accent">${escapeHtml(s.label)}</a></li>`)
        ).join('');
        return `<li class="py-2"><p class="text-sm font-semibold uppercase tracking-wider text-muted">Services</p><ul class="mt-2 pl-4">${allServices}</ul></li>`;
      }
      return `<li><a href="${pageUrl(depth, item.href)}" class="block py-3 text-xl font-medium text-primary hover:text-accent">${escapeHtml(item.label)}</a></li>`;
    }).join('');
  }

  return `
  <header class="${headerClass}" data-header>
    <div class="container-custom">
      <div class="site-header__inner">
        <a href="${homeUrl}" class="flex items-center py-2 pr-4" aria-label="${escapeHtml(site.company.name)} home" style="min-height: 3rem;">
          ${logo(depth, { heightClass: 'h-12' })}
        </a>
        <nav class="hidden lg:block" aria-label="Main navigation">
          <ul class="flex items-center gap-8">${navItems}</ul>
        </nav>
        <div class="hidden lg:flex items-center gap-4">
          <a href="tel:${site.company.phone.replace(/\s/g, '')}" class="text-sm font-medium text-primary hover:text-orange">${site.company.phone}</a>
          <a href="${contactUrl}" class="btn-primary text-sm !py-2.5 !px-5">Start Your Project</a>
        </div>
        <button class="mobile-toggle lg:hidden" aria-label="Open menu" aria-expanded="false" data-mobile-toggle>
          ${icon('menu', 'w-5 h-5')}
        </button>
      </div>
    </div>
    <div class="mobile-menu hidden" data-mobile-menu aria-hidden="true">
      <div class="mobile-menu__panel flex h-full flex-col">
        <div class="flex items-center justify-between p-6">
          <span class="font-heading text-xl font-bold text-primary">Menu</span>
          <button class="mobile-toggle" aria-label="Close menu" data-mobile-close>
            ${icon('x', 'w-5 h-5')}
          </button>
        </div>
        <nav class="flex-1 overflow-y-auto px-6" aria-label="Mobile navigation">
          <ul>${mobileLinks}</ul>
        </nav>
        <div class="p-6">
          <a href="${contactUrl}" class="btn-primary w-full text-center">Start Your Project</a>
        </div>
      </div>
    </div>
  </header>`;
}

function footer(depth) {
  const linkGroup = (title, links) => `
    <div>
      <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">${escapeHtml(title)}</h3>
      <ul class="space-y-2.5">
        ${links.map(l => {
          if (l.preferences) {
            return `<li><button type="button" class="cookie-footer-link text-sm text-muted hover:text-accent transition-colors" data-cookie-preferences aria-haspopup="dialog">${escapeHtml(l.label)}</button></li>`;
          }
          return `<li><a href="${pageUrl(depth, l.href)}" class="text-sm text-muted hover:text-accent transition-colors">${escapeHtml(l.label)}</a></li>`;
        }).join('')}
      </ul>
    </div>`;

  const contactUrl = pageUrl(depth, '/contact/');
  const homeUrl = pageUrl(depth, '/');

  return `
  <footer class="site-footer" role="contentinfo">
    ${footerLocationsSection(depth)}
    <div class="container-custom section-padding pb-8">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-5">
        <div class="col-span-2 lg:col-span-2">
          <a href="${homeUrl}" class="inline-block py-2 mb-4" aria-label="${escapeHtml(site.company.name)}">
            ${logo(depth, { heightClass: 'h-14' })}
          </a>
          <p class="mb-6 max-w-sm text-sm text-muted">${escapeHtml(site.company.tagline)} Premium Shopify development and digital growth agency helping businesses succeed online.</p>
          <div class="space-y-2 text-sm text-muted">
            <p>${icon('phone', 'w-4 h-4 inline')} <a href="tel:${site.company.phone.replace(/\s/g, '')}" class="hover:text-accent">${site.company.phone}</a></p>
            <p>${icon('mail', 'w-4 h-4 inline')} <a href="mailto:${site.company.email}" class="hover:text-accent">${site.company.email}</a></p>
          </div>
        </div>
        ${linkGroup('Company', site.footerLinks.company)}
        ${linkGroup('Services', site.footerLinks.services)}
        ${linkGroup('Resources', site.footerLinks.resources)}
        ${linkGroup('Policies', site.footerLinks.policies)}
      </div>
      <div class="mt-12 footer-premium-cta">
        <div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div class="text-center md:text-left">
            <h3 class="text-lg font-semibold text-primary">Ready to grow your business online?</h3>
            <p class="text-sm text-muted">Contact ${escapeHtml(site.company.name)} today.</p>
          </div>
          <a href="${contactUrl}" class="btn-primary shrink-0">Start Your Project</a>
        </div>
      </div>
      <div class="mt-8 flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
        <p class="text-sm text-muted">&copy; ${new Date().getFullYear()} ${escapeHtml(site.company.name)}. All Rights Reserved.</p>
        <div class="flex gap-4">
          <a href="#" class="icon-well-raised h-11 w-11" aria-label="Facebook">${icon('facebook', 'w-5 h-5')}</a>
          <a href="#" class="icon-well-raised h-11 w-11" aria-label="Instagram">${icon('instagram', 'w-5 h-5')}</a>
          <a href="#" class="icon-well-raised h-11 w-11" aria-label="LinkedIn">${icon('linkedin', 'w-5 h-5')}</a>
          <a href="#" class="icon-well-raised h-11 w-11" aria-label="Twitter">${icon('twitter', 'w-5 h-5')}</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function pageShell(depth, { title, description, path, activePath, body, extraScripts = '', overlayHeader = false, anchorNav = false, darkOverlay = false }) {
  const { whatsappButton } = require('../helpers');
  const bodyClass = overlayHeader ? 'home-page' : 'pt-20';
  return `${head(depth, { title, description, path, body })}
<body class="${bodyClass}">
  ${googleTagManagerBody()}
  ${header(depth, activePath, { overlay: overlayHeader, anchorNav, darkOverlay })}
  <main>${body}</main>
  ${footer(depth)}
  ${cookieConsentMarkup()}
  ${whatsappButton()}
  ${scripts(depth, body)}
  ${extraScripts}
</body>
</html>`;
}

module.exports = { head, header, footer, scripts, pageShell, logo };
