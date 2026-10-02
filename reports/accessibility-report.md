# Accessibility Report

## Rating: Good — 86/100

## Verified strengths

- Semantic `header`, `main`, `nav`, `footer`, article, heading, button, and list structures are present in shared templates.
- Navigation landmarks have labels, including main and mobile navigation.
- Mobile menu controls expose `aria-label` and `aria-expanded`.
- The shared stylesheet provides a visible `:focus-visible` outline.
- Final crawl found **0 images without alt attributes**.
- Decorative service background imagery is intentionally empty-alt and `aria-hidden`.
- Cookie controls, accordions, and gallery lightbox include accessible state/label handling.

## Remaining manual-test items

- Perform keyboard-only testing for menu, mega menu, gallery modal, filters, accordions, and cookie dialog after deployment.
- Verify focus trapping in the cookie dialog and gallery lightbox with NVDA, VoiceOver, or JAWS.
- Use Lighthouse/axe on real rendered pages to test color contrast across hover/gradient states and externally loaded components.
- Ensure placeholder social destinations are either replaced with verified profiles or removed; they create confusing keyboard stops.

## Safe improvements applied

- Added image dimensions to gallery lightbox markup to reduce visual instability.
- Kept meaningful image alt text and lazy loading across generated templates.
- Added `aria-invalid`, error focus, and `role="alert"` feedback to the contact form. A real submission endpoint remains required before it can receive enquiries.

## Mobile

The site uses responsive utility breakpoints and a dedicated mobile menu. Validate touch target sizes and horizontal overflow on representative 320 px and 375 px devices during release QA.
