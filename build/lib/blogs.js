const fs = require('fs');
const path = require('path');
const { markdownToHtml } = require('./markdown');

const BLOGS_DIR_CANDIDATES = [
  path.join(__dirname, '..', '..', 'docs', 'blogs'),
  path.join(__dirname, '..', '..', 'blogs'),
];
const BLOGS_DIR = BLOGS_DIR_CANDIDATES.find(dir => fs.existsSync(dir)) || BLOGS_DIR_CANDIDATES[0];
const BLOG_IMAGES_DIR = path.join(__dirname, '..', '..', 'assets', 'images', 'blog');

const CATEGORY_LABELS = {
  shopify: 'Shopify',
  'website-development': 'Web Development',
  seo: 'SEO',
  'google-ads': 'Google Ads',
  'meta-ads': 'Meta Ads',
  'mobile-app': 'Mobile App',
  'business-growth': 'Business Growth',
  ecommerce: 'eCommerce',
  'case-studies': 'Case Studies',
};

const PUBLISH_CUTOFF_SECTIONS = [
  '## Call to Action',
  '## Internal Linking Suggestions',
  '## External References',
  '## Image Prompts',
  '## JSON-LD Schema Recommendation',
];

let cache = null;

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  let currentKey = null;
  let listKey = null;

  for (const line of match[1].split('\n')) {
    if (/^\s*-\s+/.test(line) && listKey) {
      meta[listKey].push(line.replace(/^\s*-\s+/, '').replace(/^["']|["']$/g, '').trim());
      continue;
    }

    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;

    currentKey = kv[1];
    const value = kv[2].trim();

    if (value === '') {
      meta[currentKey] = [];
      listKey = currentKey;
      continue;
    }

    listKey = null;
    meta[currentKey] = value.replace(/^["']|["']$/g, '');
  }

  return { meta, body: match[2] };
}

function stripLeadingH1(body) {
  return body.replace(/^#\s+.+\n+/, '');
}

function extractPublishBody(body) {
  let content = stripLeadingH1(body);
  for (const section of PUBLISH_CUTOFF_SECTIONS) {
    const idx = content.indexOf(section);
    if (idx !== -1) content = content.slice(0, idx);
  }
  return content.replace(/\n---\s*$/, '').trim();
}

function extractFaqs(body) {
  const match = body.match(/## Frequently Asked Questions\r?\n([\s\S]*?)(?=\r?\n## [^#]|$)/);
  if (!match) return [];

  const faqs = [];
  const re = /###\s+(.+?)\r?\n+\r?\n([\s\S]*?)(?=\r?\n###\s+|\r?\n##\s+|$)/g;
  let m;
  while ((m = re.exec(match[1])) !== null) {
    faqs.push({
      q: m[1].trim(),
      a: m[2].trim().replace(/\n+/g, ' '),
    });
  }
  return faqs;
}

function extractSchemaJson(body) {
  const match = body.match(/## JSON-LD Schema Recommendation\r?\n+\r?\n```json\r?\n([\s\S]*?)```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function blogFeaturedImagePath(slug) {
  const file = path.join(BLOG_IMAGES_DIR, `${slug}.jpg`);
  return fs.existsSync(file) ? `assets/images/blog/${slug}.jpg` : '';
}

function loadAllBlogs() {
  if (cache) return cache;

  const posts = [];
  if (!fs.existsSync(BLOGS_DIR)) {
    cache = posts;
    return cache;
  }

  for (const category of fs.readdirSync(BLOGS_DIR)) {
    const dir = path.join(BLOGS_DIR, category);
    if (!fs.statSync(dir).isDirectory()) continue;

    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { meta, body } = parseFrontMatter(raw);
      const publishBody = extractPublishBody(body);
      const faqs = extractFaqs(body);
      const schema = extractSchemaJson(body);

      posts.push({
        slug: meta.slug || file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),
        title: meta.title || 'Untitled',
        metaTitle: meta.meta_title || meta.title,
        metaDescription: meta.meta_description || '',
        category: meta.category || category,
        date: meta.published_date || '2026-01-01',
        lastUpdated: meta.last_updated || meta.published_date || '2026-01-01',
        displayDate: formatDisplayDate(meta.published_date),
        excerpt: meta.meta_description || publishBody.slice(0, 160).replace(/\s+/g, ' ').trim(),
        readingTime: meta.reading_time || '8 min read',
        primaryKeyword: meta.primary_keyword || '',
        author: meta.author || 'Aalphaleo Digital Solution',
        featuredImage: blogFeaturedImagePath(meta.slug || file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')) || meta.featured_image || '',
        featuredImageAlt: meta.featured_image_alt || meta.title,
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        faqs,
        schema,
        html: markdownToHtml(publishBody),
        sourceFile: path.join(category, file),
      });
    }
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));
  cache = posts;
  return posts;
}

function getBlogPosts() {
  return loadAllBlogs().map(post => ({
    slug: post.slug,
    title: post.title,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    category: post.category,
    date: post.date,
    lastUpdated: post.lastUpdated,
    displayDate: post.displayDate,
    excerpt: post.excerpt,
    readingTime: post.readingTime,
    primaryKeyword: post.primaryKeyword,
    author: post.author,
    featuredImage: post.featuredImage,
    featuredImageAlt: post.featuredImageAlt,
    tags: post.tags,
    faqs: post.faqs,
    schema: post.schema,
    html: post.html,
  }));
}

function getBlogPostBySlug(slug) {
  return loadAllBlogs().find(p => p.slug === slug) || null;
}

function getBlogCategories() {
  return [
    { id: 'all', label: 'All' },
    ...Object.entries(CATEGORY_LABELS).map(([id, label]) => ({ id, label })),
  ];
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category.replace(/-/g, ' ');
}

module.exports = {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogCategories,
  getCategoryLabel,
  loadAllBlogs,
  blogFeaturedImagePath,
};
