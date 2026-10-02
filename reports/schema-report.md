# Structured Data Report

## Rating: Good — 90/100

## Validation

The generated-site crawler parsed all JSON-LD script blocks successfully: **0 invalid JSON-LD blocks**.

## Implemented structured data

| Type | Coverage |
|---|---|
| Organization + ContactPoint | Shared site shell |
| WebPage + WebSite reference | Shared site shell |
| BreadcrumbList | All hierarchical pages; home is intentionally excluded |
| Service | Service and location pages |
| LocalBusiness | Location pages |
| FAQPage | FAQ, service, blog, and location templates where FAQs exist |
| BlogPosting | Blog articles |

## Improvements applied

- Added Organization `@id`, logo, email, ContactPoint, language, and service-area data.
- Added shared WebPage/WebSite references to establish a consistent entity graph.
- Retained page-specific Service, LocalBusiness, BreadcrumbList, FAQPage, and BlogPosting markup.
- Removed duplicate FAQPage and BreadcrumbList blocks from blog and location templates; representative output now emits one of each.

## Recommendations

- Validate representative URLs in Google Rich Results Test after deployment; syntax validation does not guarantee eligibility.
- Only add Review/AggregateRating markup when ratings are independently sourced, visible on-page, and compliant with Google rich-result policies.
- Add `PostalAddress` only after publishing a real, customer-contactable business address. Do not invent city-level addresses for location landing pages.
- Add author Person schema to blog articles after author profiles and verifiable credentials are published.
- Use distinct `image` fields for article/service entities when social and editorial image assets are available.
