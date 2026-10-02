const { pageShell } = require('../partials/layout');
const { site, escapeHtml, breadcrumbs } = require('../helpers');

const policies = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: `
      <p>At ${site.company.name}, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
      <h2>Information We Collect</h2>
      <p>We collect information you provide directly, such as name, email, phone number, and project details when you contact us through our website forms.</p>
      <h2>How We Use Your Information</h2>
      <p>We use your information to respond to enquiries, provide services, send updates about your project, and improve our website and services.</p>
      <h2>Data Security</h2>
      <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or disclosure.</p>
      <h2>Contact Us</h2>
      <p>If you have questions about this privacy policy, contact us at ${site.company.email} or ${site.company.phone}.</p>`,
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    content: `
      <p>These terms govern your use of the ${site.company.name} website and services.</p>
      <h2>Services</h2>
      <p>We provide web development, Shopify development, mobile app development, and digital marketing services as described on our website.</p>
      <h2>Intellectual Property</h2>
      <p>All website content, designs, and branding are the property of ${site.company.name}. Client project deliverables are transferred upon full payment.</p>
      <h2>Limitation of Liability</h2>
      <p>We are not liable for indirect, incidental, or consequential damages arising from the use of our services or website.</p>
      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of competent jurisdiction.</p>`,
  },
  {
    slug: 'refund-policy',
    title: 'Refund Policy',
    content: `
      <p>At ${site.company.name}, we strive for complete client satisfaction. This policy outlines our refund terms.</p>
      <h2>Project Deposits</h2>
      <p>Initial project deposits are non-refundable once work has commenced. Deposits may be refunded in full if cancelled before work begins.</p>
      <h2>Milestone Payments</h2>
      <p>Payments for completed milestones are non-refundable. If you cancel a project mid-way, you are responsible for payment of all completed work.</p>
      <h2>Maintenance Plans</h2>
      <p>Monthly maintenance plan fees are non-refundable. You may cancel with 30 days written notice.</p>
      <h2>Disputes</h2>
      <p>If you are unsatisfied with our work, contact us within 7 days of delivery. We will work to resolve the issue before any refund consideration.</p>`,
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping Policy',
    content: `
      <p>${site.company.name} provides digital services and does not ship physical products. This policy applies to any physical deliverables that may be part of a project.</p>
      <h2>Digital Deliverables</h2>
      <p>All project deliverables (websites, apps, designs) are delivered digitally via secure channels including email, cloud storage, or direct deployment.</p>
      <h2>Physical Materials</h2>
      <p>If physical materials are included in a project scope, shipping timelines and costs will be communicated and agreed upon before dispatch.</p>
      <h2>Delivery Timeline</h2>
      <p>Digital deliverables are provided according to the project timeline agreed upon in your proposal. We ensure timely delivery of all milestones.</p>`,
  },
  {
    slug: 'cookies-policy',
    title: 'Cookies Policy',
    content: `
      <p>This policy explains how ${site.company.name} uses cookies and similar technologies on our website.</p>
      <h2>What Are Cookies</h2>
      <p>Cookies are small text files stored on your device when you visit our website. They help us improve your experience and analyze site usage.</p>
      <h2>Types of Cookies We Use</h2>
      <p><strong>Essential cookies:</strong> Required for basic website functionality.<br>
      <strong>Analytics cookies:</strong> Help us understand how visitors use our site (Google Analytics).<br>
      <strong>Marketing cookies:</strong> Used to deliver relevant advertisements (Meta Pixel, Google Ads).</p>
      <h2>Managing Cookies</h2>
      <p>You can control cookies through your browser settings. Disabling cookies may affect website functionality.</p>`,
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    content: `
      <p>The information on the ${site.company.name} website is provided for general informational purposes.</p>
      <h2>No Warranty</h2>
      <p>We make no warranties about the completeness, reliability, or accuracy of information on this website. Any action you take based on this information is at your own risk.</p>
      <h2>External Links</h2>
      <p>Our website may contain links to external sites. We are not responsible for the content or practices of linked websites.</p>
      <h2>Results Disclaimer</h2>
      <p>Case study results and testimonials represent individual client experiences. Results may vary and are not guaranteed for all clients.</p>
      <h2>Professional Advice</h2>
      <p>Content on this website does not constitute professional advice. Consult with our team for advice specific to your business situation.</p>`,
  },
];

function policyPage(policy) {
  const depth = 1;

  const body = `
    ${breadcrumbs(depth, [
      { label: 'Home', href: '/' },
      { label: policy.title, href: `/${policy.slug}/` },
    ])}

    <section class="section-padding bg-white">
      <div class="container-custom max-w-3xl">
        <h1 class="text-3xl font-bold text-primary md:text-4xl mb-8">${escapeHtml(policy.title)}</h1>
        <div class="prose prose-lg text-muted space-y-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-8 [&_h2]:mb-3">
          ${policy.content}
        </div>
        <p class="mt-8 text-sm text-muted">Last updated: July 2026</p>
      </div>
    </section>`;

  return pageShell(depth, {
    title: `${policy.title} | Aalphaleo Digital Solution`,
    description: `${policy.title} for ${site.company.name} website and services.`,
    path: `/${policy.slug}/`,
    activePath: '/',
    body,
  });
}

function allPolicyPages() {
  return policies.map(p => ({
    path: `${p.slug}/index.html`,
    html: policyPage(p),
  }));
}

module.exports = { allPolicyPages };
