# Aalphaleo Website Redesign

Visual redesign only. Every heading, paragraph, label, button, FAQ, testimonial, service description, location page, and blog post stays exactly as it is today. This document covers color, type, layout, and images.

## Goal

A professional agency site that looks like the logo: warm gold-orange to red, charcoal type, and clean surfaces. Photography and product shots should show real Aalphaleo work (stores, websites, apps), not generic stock that fights the brand.

## Content freeze

Do not rewrite, shorten, reorder the meaning of, or invent copy.

Keep as-is:

- Company name, tagline, phone, WhatsApp, emails, and address
- Navigation and footer labels and URLs
- Homepage section headings, body copy, CTAs, FAQs, testimonials, process steps, stats, and service blurbs
- Service pages, about, contact, pricing, industries, gallery, portfolio, case studies, blog, policies, and location pages
- Schema, titles, and meta descriptions unless a later SEO pass is requested separately

Allowed changes are presentation only: color, font, spacing, grid, component shape, and which image sits next to existing text.

## Logo colors

Sampled from `assets/images/logo.png`. The mane and “LEO” are a vertical gold → orange → red gradient. Wordmark greys sit on charcoal.

| Role | Hex | Use |
|---|---|---|
| Gold | `#F8A020` | Gradient start, small highlights |
| Logo orange | `#F87820` | Primary buttons, links, icons, eyebrows |
| Deep orange | `#FC6025` | Button hover, secondary accent |
| Logo red | `#E82038` | Gradient end, rare emphasis only |
| Charcoal | `#29292A` | Headlines, nav, footer text |
| Body grey | `#555555` | Paragraphs |
| Warm paper | `#FFF8F3` | Page background |
| Card | `#FFFFFF` | Cards, forms, raised panels |
| Line | `#F0E6DC` | Borders and dividers |

Primary gradient (buttons, one accent phrase per section, logo echo):

`linear-gradient(180deg, #F8A020 0%, #F87820 48%, #E82038 100%)`

Rules:

- Orange carries the brand. Red is the end of the gradient, not a second theme.
- Do not use purple, teal, or electric orange (`#E85C1A`) as the site accent.
- Dark charcoal text on warm paper. White text only on orange buttons, photo overlays, and the footer.
- One gradient treatment per viewport. Do not paint every heading with the gradient.

## Typography

| Role | Font | Weight |
|---|---|---|
| Headlines | Plus Jakarta Sans | 700 |
| Body | DM Sans | 400–500 |
| Labels / eyebrows | DM Sans | 600, uppercase, tracking 0.14em, logo orange |

Keep existing headline and body strings. Only the typeface, size, and line-height change.

Suggested scale:

- Hero title: clamp(40px, 5.5vw, 72px), line-height 1.05
- Section title: 36–44px
- Body: 17–18px, line-height 1.65
- Buttons: 16px, medium

## Layout

Professional agency layout, not neumorphism and not a near-black recruitment template.

- Max width 1200px, generous vertical rhythm (96–128px between sections)
- Alternate warm paper and white bands so sections are easy to scan
- Cards: white, 16px radius, 1px warm border, soft shadow `0 12px 40px rgb(41 41 42 / 0.06)`
- Buttons: 12px radius. Primary is the logo gradient with white label. Secondary is white with a charcoal border
- Header: sticky, warm paper at 92% opacity, blur, hairline border. Logo left, existing nav center, phone + “Start Your Project” right
- Footer: charcoal `#29292A`, white and warm-grey text, orange links on hover. Logo stays the official file (do not recolor it)

## Images

Use real project and service images already in the repo first. Add new files only when a slot has no matching asset. Do not use decorative background photos behind every section. One strong image per section that needs one.

| Slot | Image | Notes |
|---|---|---|
| Hero | Portfolio collage or a flagship store screenshot (`assets/images/home-hero-showcase.png` or a live store capture) | Right column, rounded frame. No full-bleed dark overlay |
| About | Team or workspace photo if available; otherwise the hero showcase cropped | Beside existing about copy |
| Works | Existing `assets/images/portfolio/*.jpg` | Homepage shows the first projects; missing files fall back to a live thumbnail |
| New portfolio sites | Screenshots for Chutty Nila, Kritikala, Soriq, Skyhook AI Glasses, Healthy She | Save as `assets/images/portfolio/{hostname-with-dashes}.jpg` |
| Services list | `assets/images/services/{slug}.jpg` | Small frame on the right of each service row |
| Gallery | Existing `assets/images/gallery/*.jpg` | Keep the visual feed |
| Industries | Existing `assets/images/industries/*.jpg` | Card media, not backgrounds |
| Process | No photo. Numbered steps only | |
| Testimonials | No stock portraits unless the client supplies them | Quote cards only |
| CTA | No background photo | Warm paper or a thin orange top rule |
| Blog / case studies | Existing post and industry images | |

Image treatment: 16px radius, `object-cover`, warm 1px border. Alt text stays descriptive of the real subject. Do not overlay marketing slogans on photos.

New portfolio screenshots to capture (1440×900, JPG, top of homepage):

- `chuttynila-com.jpg` — https://www.chuttynila.com/
- `kritikala-org.jpg` — https://kritikala.org/
- `soriq-in.jpg` — https://soriq.in/
- `skyhookaiglasses-in.jpg` — https://skyhookaiglasses.in/
- `healthyshe-in.jpg` — https://healthyshe.in/

Ekamrat already has `ekamrat-com.jpg`.

## Homepage (structure unchanged)

Same sections, in the same order, with the same words.

1. **Hero** — Left: eyebrow, tagline, intro, location line, two CTAs. Right: showcase image. No giant watermark word.
2. **Who we are** — Copy on the left, image on the right. Stats sit under this block as four white cards (value in logo orange, existing labels and descriptions).
3. **Mission** — Centered text on warm paper. No image.
4. **Selected works** — Three-column project cards with real screenshots.
5. **Manifesto** — Large type only. One line uses the logo gradient.
6. **Process** — Up to four steps shown on the home page, numbered, no photos.
7. **Services** — Rows: number, title, description, tags, service image, arrow. Hover turns the title orange.
8. **Design gallery** — Existing gallery thumbnails.
9. **Testimonials** — Quote cards, orange stars.
10. **Why choose us** — Icon wells in a light orange tint (`#F87820` at 12% opacity) plus existing titles and descriptions.
11. **FAQ** — Accordion on white. Orange plus icon.
12. **CTA** — Existing heading, paragraph, buttons, and phone line.
13. **Locations + footer** — Unchanged links and city names.

## Other pages

Apply the same tokens everywhere so inner pages match the homepage.

- **Service pages** — Hero is text plus `assets/images/services/{slug}.jpg`. Remaining blocks stay text and cards.
- **About** — Same copy. Replace the empty gradient placeholder with a real image.
- **Portfolio** — Filters and cards unchanged. Every card uses a local screenshot when the file exists.
- **Gallery, blog, industries, pricing, contact, FAQ, policies** — Restyle only. Forms use white fields, warm borders, orange focus ring.
- **Location pages** — Same generated copy. Hero is typographic (no fake city photos).

## Motion

Short and quiet: 200ms color and shadow on hover, fade-up on scroll for sections. No parallax orbs, floating clay shapes, or full-screen dark overlays.

## Build notes

When implementation starts:

1. Set the palette in `tailwind.config.js` and `src/css/input.css`.
2. Swap Google Fonts back to Plus Jakarta Sans + DM Sans.
3. Restyle shared header, footer, buttons, cards, and forms in CSS so all pages inherit it.
4. Adjust homepage markup only to place images beside existing copy.
5. Add the five portfolio screenshots, then run `npm run build`.

Do not edit `build/data/site.js` copy, service data, blog markdown, or location generators for this redesign.
