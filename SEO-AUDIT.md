# SEO Audit — Aalphaleo Digital Solution

Audit date: 18 July 2026  
Scope: source, build pipeline, generated static site, 4,143 generated HTML pages, and public response headers from `https://www.aalphaleo.com`.

## Overall score: 83/100 — Good

The generated build now passes the static crawl checks: every generated HTML page has one title, one meta description, one canonical, one H1, robots directives, Open Graph/Twitter tags, parseable JSON-LD, and no broken internal links. The largest remaining limitations are production deployment configuration and third-party JavaScript.

| Area | Rating | Score | Evidence |
|---|---:|---:|---|
| Technical SEO | Good | 88 | Valid robots/sitemap; 0 broken internal links after remediation |
| On-page SEO | Good | 91 | 0 duplicate titles/descriptions; 0 missing H1s |
| Performance | Average | 72 | Global third-party libraries/analytics still add client work |
| Accessibility | Good | 86 | Landmarks, labels, focus styling, alt coverage; manual screen-reader testing remains |
| Mobile | Good | 88 | Responsive utility classes and responsive navigation present |
| Core Web Vitals | Average | 74 | Local load was fast; field CWV requires CrUX/Search Console |
| Schema | Good | 90 | Organization/WebPage, Breadcrumb, FAQ, Service, LocalBusiness, BlogPosting coverage |
| Internal linking | Excellent | 96 | 0 broken internal links in 4,143-page crawl |
| Security | Average | 62 | HTTPS/CSP upgrade directive present; key response headers absent |
| Content | Good | 84 | 100 blog posts and 4,000 location pages; local-template similarity needs ongoing quality review |
| Indexability | Excellent | 97 | 0 missing canonicals/robots in final build; 1:1 sitemap/page coverage |
| Crawlability | Excellent | 96 | `robots.txt` allows crawling and names the sitemap |

## Remediations completed

- Corrected the location-page relative depth from 3 to 2. This repaired local asset and navigation paths for all 4,000 location pages.
- Added default index/follow robots directives with Google preview controls.
- Added Organization contact details and WebPage/WebSite JSON-LD to the shared page shell.
- Added resource connection hints, deferred non-critical scripts, and loaded Swiper only on pages that render its carousel.
- Eliminated the one duplicate document title.
- Added missing intrinsic dimensions to the gallery lightbox image.
- Added a pre-build cleanup step for stale generated HTML. This removed six orphan blog files that were neither in source nor the sitemap.
- Restored eight runtime JavaScript files to `assets/js/`, so a fresh build no longer depends on stale files already present in `out/`.
- Removed duplicate FAQPage and BreadcrumbList markup from location and blog templates; representative pages now emit one of each.
- Replaced the contact form’s false success simulation with accessible validation and direct email/phone guidance until a real form endpoint is configured.
- Added `scripts/audit-seo.js`, a repeatable static crawler that validates metadata, schema JSON, headings, image attributes, sitemap coverage, duplicate metadata, and local link targets.

## Final generated-site validation

| Check | Result |
|---|---:|
| Generated HTML pages | 4,143 |
| Sitemap URLs | 4,143 |
| Broken internal links | 0 |
| Missing title/description/canonical/H1 | 0 / 0 / 0 / 0 |
| Duplicate titles/descriptions/canonicals | 0 / 0 / 0 |
| Invalid JSON-LD blocks | 0 |
| Missing image alt attributes | 0 |
| Missing image dimensions | 0 |
| Missing robots meta | 0 |

Detailed evidence is available in `reports/seo-audit-data.json` and the reports in `reports/`.
