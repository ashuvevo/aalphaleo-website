# Core Web Vitals Review

## Rating: Average — 74/100

## What was measured

A local browser load of the homepage recorded approximately 680 ms DOM Content Loaded and 944 ms load completion. These values are local-development observations only; they are not field Core Web Vitals and cannot predict CrUX values.

| Metric | Local observation | Status |
|---|---:|---|
| DOM Content Loaded | ~680 ms | Good locally |
| Load event | ~944 ms | Good locally |
| Render-blocking local scripts | Deferred | Improved |
| Cumulative Layout Shift | Not field-measurable locally | Needs RUM/CrUX |
| LCP | Not field-measurable locally | Needs RUM/CrUX |
| INP | Not field-measurable locally | Needs RUM/CrUX |
| TTFB | Host/CDN dependent | Needs live synthetic test |

## Improvements applied

- Deferred shared JavaScript resources.
- Restricted Swiper CSS/JS to pages that render a testimonial carousel.
- Added preconnect hints for Google Fonts, jsDelivr, and unpkg.
- Confirmed intrinsic dimensions on generated `img` elements.

## Remaining performance risks

- Every carousel page loads Lucide, GSAP, AOS, Swiper, Google Tag Manager, GA4, and Microsoft Clarity. Third-party script execution can affect INP and LCP, especially on mobile.
- Public Hostinger responses showed `x-hcdn-cache-status: DYNAMIC` for HTML and did not expose a cache policy. Enable appropriate edge caching for immutable assets and short HTML revalidation.
- Generated assets total approximately 58.5 MB of JPEG files. Images are lazy-loaded where non-critical, but responsive `srcset`/WebP or AVIF variants are not yet implemented.
- Google Fonts remain third-party CSS/font requests. Self-hosting WOFF2 with `font-display: swap` would reduce dependency and improve resilience.

## Recommended production measurement

1. Run PageSpeed Insights on the home page, a service page, a blog post, and a location page after deployment.
2. Monitor Search Console Core Web Vitals and Chrome UX Report data for mobile.
3. Use a real-user monitoring tool to observe LCP element, INP interactions, and CLS per route type.
