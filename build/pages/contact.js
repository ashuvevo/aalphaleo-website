const { pageShell, logo } = require('../partials/layout');
const {
  site, pageUrl, escapeHtml, icon,
  sectionHeading, ctaBanner, breadcrumbs, faqSection,
} = require('../helpers');

function contactPage() {
  const depth = 1;

  const contactFaqs = [
    { q: 'How quickly will you respond to my enquiry?', a: 'We respond to all enquiries within 24 hours on business days, often much sooner.' },
    { q: 'Do you offer free consultations?', a: 'Yes. We offer free 30-minute consultations to understand your project requirements and provide recommendations.' },
    { q: 'What information should I include in my enquiry?', a: 'Tell us about your business, project goals, timeline, and budget range. The more detail, the better we can help.' },
    { q: 'Do you work with international clients?', a: 'Yes. We serve clients globally with remote collaboration and flexible communication.' },
  ];

  const body = `
    ${breadcrumbs(depth, [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }])}

    <section class="hero-gradient section-padding">
      <div class="container-custom text-center">
        <div data-aos="fade-up">
          <div class="mb-8 flex justify-center">${logo(depth, { heightClass: 'h-16' })}</div>
          <span class="section-eyebrow">Contact Us</span>
          <h1 class="mt-4 text-4xl font-bold text-primary md:text-5xl">Let's Start Your <span class="gradient-text">Next Project</span></h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-muted">Ready to build something great? Get in touch and we'll respond within 24 hours.</p>
        </div>
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="grid gap-12 lg:grid-cols-5">
          <div class="lg:col-span-3" data-aos="fade-right">
            <h2 class="text-2xl font-bold text-primary mb-6">Send Us a Message</h2>
            <form class="contact-form space-y-5" novalidate data-recipient="${escapeHtml(site.company.contactFormEmail)}" data-form-endpoint="/api/contact.php">
              <div class="grid grid-cols-2 gap-3 sm:gap-5">
                <div>
                  <label for="name" class="label-field">Full Name *</label>
                  <input type="text" id="name" name="name" class="input-field" required placeholder="Your name">
                </div>
                <div>
                  <label for="email" class="label-field">Email Address *</label>
                  <input type="email" id="email" name="email" class="input-field" required placeholder="you@company.com">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 sm:gap-5">
                <div>
                  <label for="phone" class="label-field">Phone Number</label>
                  <input type="tel" id="phone" name="phone" class="input-field" placeholder="+91 XXXXX XXXXX">
                </div>
                <div>
                  <label for="service" class="label-field">Service Interested In</label>
                  <select id="service" name="service" class="input-field">
                    <option value="">Select a service</option>
                    <option value="shopify-development">Custom Shopify Development</option>
                    <option value="shopify-redesign">Shopify Redesign</option>
                    <option value="custom-website">Custom Website</option>
                    <option value="woocommerce">WooCommerce</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="seo">SEO Services</option>
                    <option value="meta-ads">Meta Ads</option>
                    <option value="google-ads">Google Ads</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label for="message" class="label-field">Project Details *</label>
                <textarea id="message" name="message" rows="5" class="input-field resize-none" required placeholder="Tell us about your project..."></textarea>
              </div>
              <input type="text" name="_honeypot" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">
              <button type="submit" class="btn-primary">Send Message</button>
              <div class="form-success hidden rounded-card bg-success/10 p-4 text-success" role="status" aria-live="polite">
                ${icon('check-circle', 'w-5 h-5 inline')} Thank you! We'll get back to you within 24 hours.
              </div>
              <div class="form-error hidden rounded-card bg-red-50 p-4 text-red-600" role="alert">
                Please fill in all required fields correctly, or email ${escapeHtml(site.company.contactFormEmail)} directly.
              </div>
              <div class="form-submit-error hidden rounded-card bg-red-50 p-4 text-red-600" role="alert">
                Something went wrong sending your message. Please try again or email ${escapeHtml(site.company.contactFormEmail)}.
              </div>
            </form>
          </div>
          <div class="grid grid-cols-2 gap-3 sm:gap-6 lg:col-span-2 lg:grid-cols-1" data-aos="fade-left">
            <div class="card compact-card">
              ${icon('phone', 'w-6 h-6 text-orange mb-3')}
              <h3 class="font-semibold text-primary">Phone / WhatsApp</h3>
              <a href="tel:${site.company.phone.replace(/\s/g, '')}" class="mt-2 block text-muted hover:text-orange">${site.company.phone}</a>
            </div>
            <div class="card compact-card">
              ${icon('mail', 'w-6 h-6 text-orange mb-3')}
              <h3 class="font-semibold text-primary">Email</h3>
              <a href="mailto:${site.company.contactFormEmail}" class="mt-2 block text-muted hover:text-orange">${site.company.contactFormEmail}</a>
              <p class="mt-1 text-xs text-muted">Form submissions are delivered here.</p>
            </div>
            <div class="card compact-card">
              ${icon('clock', 'w-6 h-6 text-orange mb-3')}
              <h3 class="font-semibold text-primary">Business Hours</h3>
              <p class="mt-2 text-sm text-muted">Mon – Sat: 9:00 AM – 7:00 PM IST<br>Sunday: Closed</p>
            </div>
            <a href="https://wa.me/${site.company.whatsapp}?text=Hi%20Aalphaleo%2C%20I%27d%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" class="btn-primary col-span-2 w-full text-center lg:col-span-1">
              ${icon('message-circle')} Chat on WhatsApp
            </a>
            <div class="card compact-card col-span-2 aspect-video flex items-center justify-center bg-bg lg:col-span-1">
              ${icon('map-pin', 'w-8 h-8 text-muted')}
              <span class="sr-only">Map placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${faqSection(contactFaqs, 'contact-faq')}
    ${ctaBanner(depth, 'Ready to Grow Your Business?', 'Contact Aalphaleo Digital Solution today and take the first step toward digital success.')}`;

  return pageShell(depth, {
    title: 'Contact Us | Aalphaleo Digital Solution',
    description: 'Get in touch with Aalphaleo Digital Solution for custom Shopify development, web design, mobile apps, SEO, and digital marketing services.',
    path: '/contact/',
    activePath: '/contact/',
    body,
  });
}

module.exports = { contactPage };
