# Internal Linking Report

## Rating: Excellent — 96/100

## Final static crawl

| Check | Result |
|---|---:|
| Generated HTML pages | 4,143 |
| Resolved internal links | All checked links |
| Broken internal links | 0 |
| Sitemap/page coverage | 4,143 / 4,143 |
| Duplicate canonicals | 0 |

## Architecture

- Header links expose core commercial pages and service groups.
- Footer links expose company, service, resource, policy, and location areas.
- Breadcrumbs give hierarchy to service, blog, policy, and city/service pages.
- Location pages link to relevant services, nearby cities, related blog content, portfolio, pricing, and contact.
- Blog posts link to related articles, services, and conversion CTAs.

## Remediated issue

The prior location-depth calculation generated paths that resolved outside the `out/` root. Correcting the depth in `build/pages/locations.js` restored all location assets and links. The complete final crawl reports zero broken internal links.

## Ongoing recommendations

- Add contextual links from priority blog articles to the most relevant service and location pages.
- Use Search Console’s Links report to identify high-value orphan candidates after Google has recrawled the deployed build.
- Keep city hubs curated; footer city pills should remain a limited discovery route, not a link farm.
- Replace social `#` destinations with verified links or remove them.
