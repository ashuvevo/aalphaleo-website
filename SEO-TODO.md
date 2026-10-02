# SEO TODO

## Critical

| Issue | Affected scope | Reason | Recommended fix | Estimated impact |
|---|---|---|---|---|
| Production build is not yet deployed | Public website | The public host response predates the remediated local build | Deploy the freshly generated `out/` directory and request re-crawl in Search Console | High |

## High

| Issue | Affected scope | Reason | Recommended fix | Estimated impact |
|---|---|---|---|---|
| Missing security headers | Hostinger/CDN | HSTS, nosniff, clickjacking, referrer, and permissions controls were not observed | Configure headers in CDN/Hostinger; test CSP in report-only mode first | High |
| No verified field CWV | Production traffic | Local timing is not CrUX or real-user data | Run PageSpeed Insights and monitor Search Console CWV by template type | High |
| Image formats are JPEG/PNG only | 164 generated images | Responsive next-gen images can lower LCP and transfer size | Add WebP/AVIF + `srcset` generation for large visual assets | High |

## Medium

| Issue | Affected scope | Reason | Recommended fix | Estimated impact |
|---|---|---|---|---|
| Third-party execution budget | Shared layout/GTM | Multiple animation, icon, analytics, and session-recording scripts can affect INP | Audit GTM, delay non-essential tags, self-host or bundle pinned dependencies | Medium |
| E-E-A-T signals need strengthening | Blog and local pages | Programmatic city pages need verifiable local experience/trust evidence | Add author bios, editorial policy, real testimonials, and city-specific proof to priority pages | Medium |
| Generic social images | Shared layout | Logo-only OG/Twitter imagery reduces share quality | Generate service/article/social images and pass page-specific image metadata | Medium |
| Placeholder social links | Footer | `#` destinations are poor UX and can be interpreted as incomplete | Add verified profile URLs or remove the icons | Medium |

## Low

| Issue | Affected scope | Reason | Recommended fix | Estimated impact |
|---|---|---|---|---|
| Fonts are third-party | Shared layout | Extra request/availability dependency | Self-host WOFF2 with `font-display: swap` | Low |
| Browserslist database warning | Build environment | Compatibility data is stale | Run `npx update-browserslist-db@latest` in a controlled dependency update | Low |
| Redirect/404 policy not versioned | Host configuration | Static source contains no redirect map/custom 404 | Add Hostinger redirect rules and a custom 404 page | Low |
