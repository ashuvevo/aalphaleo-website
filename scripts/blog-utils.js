const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPICS_DIR = path.join(ROOT, 'blog-system', 'topics');
const BLOGS_DIR = path.join(ROOT, 'docs', 'blogs');
const PROGRESS_FILE = path.join(BLOGS_DIR, 'progress.json');
const LOG_FILE = path.join(ROOT, 'logs', 'generation.log');

const CATEGORIES = [
  'shopify', 'website-development', 'seo', 'google-ads', 'meta-ads',
  'mobile-app', 'business-growth', 'ecommerce', 'case-studies',
];

const SERVICES = {
  shopify: [
    { label: 'Custom Shopify Development', href: '/services/shopify-development/' },
    { label: 'Shopify Store Redesign', href: '/services/shopify-redesign/' },
    { label: 'Shopify SEO Services', href: '/services/shopify-seo/' },
  ],
  'website-development': [
    { label: 'Custom Website Development', href: '/services/custom-website-development/' },
    { label: 'Shopify Development', href: '/services/shopify-development/' },
    { label: 'WooCommerce Development', href: '/services/woocommerce-development/' },
  ],
  seo: [
    { label: 'SEO Services', href: '/services/seo-services/' },
    { label: 'Shopify SEO', href: '/services/shopify-seo/' },
    { label: 'Custom Website Development', href: '/services/custom-website-development/' },
  ],
  'google-ads': [
    { label: 'Google Ads Management', href: '/services/google-ads-management/' },
    { label: 'Shopify CRO', href: '/services/shopify-cro/' },
    { label: 'SEO Services', href: '/services/seo-services/' },
  ],
  'meta-ads': [
    { label: 'Meta Ads Management', href: '/services/meta-ads-management/' },
    { label: 'Social Media Marketing', href: '/services/social-media-marketing/' },
    { label: 'Google Ads Management', href: '/services/google-ads-management/' },
  ],
  'mobile-app': [
    { label: 'Mobile App Development', href: '/services/mobile-app-development/' },
    { label: 'Custom Website Development', href: '/services/custom-website-development/' },
    { label: 'Shopify Development', href: '/services/shopify-development/' },
  ],
  'business-growth': [
    { label: 'SEO Services', href: '/services/seo-services/' },
    { label: 'Meta Ads Management', href: '/services/meta-ads-management/' },
    { label: 'Google Ads Management', href: '/services/google-ads-management/' },
  ],
  ecommerce: [
    { label: 'Custom Shopify Development', href: '/services/shopify-development/' },
    { label: 'Shopify CRO', href: '/services/shopify-cro/' },
    { label: 'WooCommerce Development', href: '/services/woocommerce-development/' },
  ],
  'case-studies': [
    { label: 'Shopify Development', href: '/services/shopify-development/' },
    { label: 'Shopify Redesign', href: '/services/shopify-redesign/' },
    { label: 'Shopify SEO', href: '/services/shopify-seo/' },
  ],
};

function ensureDirs() {
  fs.mkdirSync(path.join(ROOT, 'logs'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
  CATEGORIES.forEach(c => fs.mkdirSync(path.join(BLOGS_DIR, c), { recursive: true }));
}

function parseTopicFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath, '.md');
  const idMatch = filename.match(/^(\d+)-(.+)$/);
  const id = idMatch ? parseInt(idMatch[1], 10) : 0;
  const slugFromFile = idMatch ? idMatch[2] : filename;
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slugFromFile.replace(/-/g, ' ');
  const urlMatch = raw.match(/## Suggested URL\s*\n\s*\n(\/[^\n]+)/);
  const suggestedUrl = urlMatch ? urlMatch[1].trim() : `/${slugFromFile}/`;
  const slug = suggestedUrl.replace(/^\//, '').replace(/\/$/, '');
  const primaryKeyword = title.toLowerCase().replace(/guide|checklist|tips|template|blueprint/gi, '').trim();
  const secondaryKeywords = deriveSecondaryKeywords(slug, title);
  const category = categorize(slug, title, id);
  const template = pickTemplate(slug, id);
  const isCornerstone = id === 100 || slug.includes('blueprint');
  return { id, title, slug, slugFromFile, primaryKeyword, secondaryKeywords, category, template, isCornerstone, filePath };
}

function deriveSecondaryKeywords(slug, title) {
  const base = title.split(' ').slice(0, 4).join(' ').toLowerCase();
  const extras = [];
  if (slug.includes('shopify')) extras.push('Shopify store', 'eCommerce India', 'online store development');
  if (slug.includes('seo')) extras.push('search engine optimization', 'organic traffic', 'Google rankings');
  if (slug.includes('google-ads')) extras.push('PPC advertising', 'Google Shopping', 'ROAS optimization');
  if (slug.includes('meta')) extras.push('Facebook ads', 'Instagram ads', 'social media advertising');
  if (slug.includes('website')) extras.push('web design', 'business website', 'responsive design');
  if (extras.length === 0) extras.push('digital marketing', 'business growth', 'Aalphaleo Digital Solution');
  return [base, ...extras.slice(0, 4)];
}

function categorize(slug, title, id) {
  if (id === 100 || slug.includes('case-study') || slug.includes('blueprint')) return 'case-studies';
  if (/google-ads|seo-vs-google|performance-max|shopping-campaign/.test(slug)) return 'google-ads';
  if (/meta-ads|meta-pixel|facebook-ads|instagram-ads/.test(slug)) return 'meta-ads';
  if (/flutter|business-app|mobile-commerce|mobile-app/.test(slug)) return 'mobile-app';
  if (/shopify|woocommerce-vs|theme|migration|cro-tips|shopify-apps|shopify-security|shopify-maintenance|shopify-plus|liquid|store-redesign|best-shopify/.test(slug)) return 'shopify';
  if (/seo|sitemap|robot|schema-markup|canonical|breadcrumb|keyword-research|on-page|off-page|technical-seo|local-seo|voice-search|ai-seo|core-web-vitals|product-page|collection-page|homepage-seo|faq-seo|search-console|analytics-4|tag-manager|clarity|jewelry-store-seo/.test(slug)) return 'seo';
  if (/ecommerce|online-store|d2c|fashion-ecommerce|beauty-brand|furniture-ecommerce|payment-gateway|shipping|headless|omnichannel|trust-signals|conversion-tips|start-an-online|cost-in-india|future-of-ecommerce|m-commerce/.test(slug)) return 'ecommerce';
  if (/website|web-design|landing-page|corporate|portfolio-website|responsive|tailwind|ui-ux|redesign|launch-checklist|startup|b2b|b2c|restaurant|healthcare|education|travel|manufacturing|local-business|performance|cdn|image-optimization|webp|lazy-loading|javascript-performance|ssl|security-checklist|maintenance-checklist|contact-page|typography|color-psychology|logo-design|modern-web-design|ux-mistakes/.test(slug)) return 'website-development';
  return 'business-growth';
}

function pickTemplate(slug, id) {
  if (id === 100 || slug.includes('blueprint')) return 'cornerstone';
  if (slug.includes('case-study')) return 'case-study';
  if (slug.includes('checklist') || slug.includes('maintenance')) return 'checklist';
  if (slug.includes('-vs-') || slug.includes('vs-')) return 'comparison';
  return 'guide';
}

function wordCount(text) {
  return text.replace(/---[\s\S]*?---/g, '').replace(/[#>*\[\]()|`\-|]/g, ' ').split(/\s+/).filter(Boolean).length;
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return { total_topics: 100, completed: 0, remaining: 100, completed_files: [], current_topic: null, last_generated: null };
  }
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
}

function saveProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

function appendLog(entry) {
  const line = `[${new Date().toISOString()}] ${entry}\n`;
  fs.appendFileSync(LOG_FILE, line);
}

function getAllTopics() {
  return fs.readdirSync(TOPICS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => path.join(TOPICS_DIR, f));
}

function relatedBlogSlugs(allTopics, current, count = 5) {
  return allTopics
    .filter(t => t.slug !== current.slug && t.category === current.category)
    .slice(0, count)
    .map(t => t.slug);
}

function publishedDate(id) {
  const d = new Date('2026-01-15T00:00:00');
  d.setDate(d.getDate() + id);
  return d.toISOString().split('T')[0];
}

function metaTitle(title) {
  let mt = `${title} | Aalphaleo Digital Solution`;
  if (mt.length > 60) mt = `${title.slice(0, 40)}… | Aalphaleo`;
  return mt.slice(0, 60);
}

function metaDescription(title, keyword) {
  const desc = `Learn ${keyword} with expert strategies from Aalphaleo Digital Solution. Actionable tips for Shopify, SEO, and digital growth in India.`;
  return desc.slice(0, 160);
}

module.exports = {
  ROOT, BLOGS_DIR, PROGRESS_FILE, LOG_FILE, CATEGORIES, SERVICES,
  ensureDirs, parseTopicFile, wordCount, loadProgress, saveProgress, appendLog,
  getAllTopics, relatedBlogSlugs, publishedDate, metaTitle, metaDescription,
};
