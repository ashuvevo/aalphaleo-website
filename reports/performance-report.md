# Performance Report

## Rating: Average — 72/100

## Asset inventory

| Asset type | Files | Approximate size |
|---|---:|---:|
| JPEG | 164 | 58.5 MB |
| PNG | 3 | 614 KB |
| CSS | 2 | 51 KB |
| Local JS | 11 | 29 KB |
| SVG | 12 | 11 KB |

## What improved

- JavaScript scripts in the shared layout are deferred.
- Swiper is conditionally loaded only when the page contains a testimonial carousel.
- Non-critical images use `loading="lazy"` and carry intrinsic dimensions.
- Fonts and CDN origins have preconnect hints.

## Remaining highest-impact work

1. Generate WebP/AVIF derivatives and responsive `srcset` for portfolio, gallery, blog, and service imagery.
2. Self-host and subset Inter/Poppins with `font-display: swap`.
3. Audit third-party tags through GTM; remove unused tags and delay non-essential analytics until consent.
4. Pin remote library versions and bundle only the icon/animation features actually used.
5. Add long-lived immutable caching for hashed images, CSS, and JS at the CDN.

## Lighthouse expectations

No Lighthouse score can be honestly guaranteed without a production run under controlled network/device conditions. The code changes reduce parser blocking and unused carousel loading, but field LCP/INP depend on Hostinger response times, CDN caching, tag execution, device class, and page images.
