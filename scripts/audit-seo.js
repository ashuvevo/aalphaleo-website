#!/usr/bin/env node
/**
 * Static SEO audit for the generated Aalphaleo website.
 * Usage: node scripts/audit-seo.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const REPORTS = path.join(ROOT, 'reports');
const BASE = 'https://www.aalphaleo.com';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function decode(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function first(html, regex) {
  const match = html.match(regex);
  return match ? decode(match[1].trim()) : '';
}

function all(html, regex) {
  return [...html.matchAll(regex)].map(match => match[1]);
}

function textContent(html) {
  return decode(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function pageUrl(relative) {
  if (relative === 'index.html') return `${BASE}/`;
  return `${BASE}/${relative.replace(/index\.html$/, '')}`;
}

function targetExists(fromRelative, rawHref) {
  const href = decode(rawHref).trim();
  if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:|https?:\/\/)/i.test(href)) return null;
  const clean = href.split(/[?#]/)[0];
  const normalized = clean.startsWith('/')
    ? clean.replace(/^\/+/, '')
    : path.posix.normalize(path.posix.join(path.posix.dirname(fromRelative), clean));
  const candidates = [];
  if (!normalized || normalized === '.') candidates.push('index.html');
  else {
    candidates.push(normalized);
    if (normalized.endsWith('/')) candidates.push(`${normalized}index.html`);
    if (!path.posix.extname(normalized)) candidates.push(`${normalized}/index.html`);
  }
  return candidates.some(candidate => fs.existsSync(path.join(OUT, candidate)));
}

function increment(map, key, relative) {
  if (!key) return;
  if (!map[key]) map[key] = [];
  map[key].push(relative);
}

function duplicateGroups(map) {
  return Object.entries(map)
    .filter(([, pages]) => pages.length > 1)
    .map(([value, pages]) => ({ value, count: pages.length, pages: pages.slice(0, 12) }));
}

function audit() {
  const htmlFiles = walk(OUT).filter(file => file.endsWith('.html'));
  const pages = [];
  const titleMap = {};
  const descriptionMap = {};
  const canonicalMap = {};
  const contentMap = {};
  const brokenLinks = [];
  const missingRobotsPages = [];
  const incompleteImageDimensionPages = [];
  const stats = {
    pages: htmlFiles.length,
    missingTitle: 0,
    missingDescription: 0,
    missingCanonical: 0,
    missingH1: 0,
    multipleH1: 0,
    missingRobotsMeta: 0,
    missingOg: 0,
    missingTwitter: 0,
    missingBreadcrumb: 0,
    invalidJsonLd: 0,
    missingImageAlt: 0,
    missingImageDimensions: 0,
    lazyImageCandidates: 0,
    placeholderLinks: 0,
    headingSkips: 0,
  };

  for (const file of htmlFiles) {
    const relative = path.relative(OUT, file).split(path.sep).join('/');
    const html = fs.readFileSync(file, 'utf8');
    const title = first(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = first(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i)
      || first(html, /<meta\s+content=["']([^"']*)["']\s+name=["']description["'][^>]*>/i);
    const canonical = first(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i);
    const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map(match => Number(match[1]));
    const h1Count = headings.filter(level => level === 1).length;
    const headingSkips = headings.some((level, index) => index && level > headings[index - 1] + 1);
    const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map(match => match[1]);
    const jsonBlocks = all(html, /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    const links = all(html, /<(?:a|link)\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi);
    const text = textContent(html);
    const hash = crypto.createHash('sha256').update(text).digest('hex');

    if (!title) stats.missingTitle++;
    if (!description) stats.missingDescription++;
    if (!canonical) stats.missingCanonical++;
    if (!h1Count) stats.missingH1++;
    if (h1Count > 1) stats.multipleH1++;
    if (!/<meta\s+name=["']robots["']/i.test(html)) {
      stats.missingRobotsMeta++;
      missingRobotsPages.push(relative);
    }
    if (!/<meta\s+property=["']og:(?:title|description|image)["']/i.test(html)) stats.missingOg++;
    if (!/<meta\s+name=["']twitter:card["']/i.test(html)) stats.missingTwitter++;
    if (!/BreadcrumbList/.test(html)) stats.missingBreadcrumb++;
    if (headingSkips) stats.headingSkips++;

    for (const block of jsonBlocks) {
      try { JSON.parse(block.trim()); } catch { stats.invalidJsonLd++; }
    }
    for (const attrs of images) {
      if (!/\balt=["'][^"']*["']/i.test(attrs)) stats.missingImageAlt++;
      if (!/\bwidth=["']\d+["']/i.test(attrs) || !/\bheight=["']\d+["']/i.test(attrs)) {
        stats.missingImageDimensions++;
        incompleteImageDimensionPages.push(relative);
      }
      if (!/\bloading=["']lazy["']/i.test(attrs)) stats.lazyImageCandidates++;
    }
    for (const href of links) {
      if (href === '#') stats.placeholderLinks++;
      if (targetExists(relative, href) === false) brokenLinks.push({ page: relative, href });
    }

    increment(titleMap, title, relative);
    increment(descriptionMap, description, relative);
    increment(canonicalMap, canonical, relative);
    increment(contentMap, hash, relative);
    pages.push({
      path: relative,
      url: pageUrl(relative),
      title,
      titleLength: title.length,
      descriptionLength: description.length,
      canonical,
      h1Count,
      headings,
      imageCount: images.length,
      schemaBlocks: jsonBlocks.length,
      wordCount: text ? text.split(/\s+/).length : 0,
    });
  }

  const sitemap = path.join(OUT, 'sitemap.xml');
  const robots = path.join(OUT, 'robots.txt');
  const sitemapUrls = fs.existsSync(sitemap)
    ? all(fs.readFileSync(sitemap, 'utf8'), /<loc>([^<]+)<\/loc>/g)
    : [];
  const sitemapLocs = sitemapUrls.length;
  const sitemapPathSet = new Set(sitemapUrls.map(url => {
    const parsed = new URL(url);
    if (parsed.pathname === '/') return 'index.html';
    const relative = parsed.pathname.replace(/^\//, '');
    return relative.endsWith('.html') ? relative : `${relative}index.html`;
  }));
  const pagesMissingFromSitemap = pages
    .map(page => page.path)
    .filter(relative => !sitemapPathSet.has(relative));

  return {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    stats: {
      ...stats,
      sitemapLocs,
      robotsExists: fs.existsSync(robots),
      brokenInternalLinks: brokenLinks.length,
      pagesMissingFromSitemap: pagesMissingFromSitemap.length,
      duplicateTitles: duplicateGroups(titleMap),
      duplicateDescriptions: duplicateGroups(descriptionMap),
      duplicateCanonicals: duplicateGroups(canonicalMap),
      duplicateTextContent: duplicateGroups(contentMap),
    },
    brokenLinks: brokenLinks.slice(0, 250),
    missingRobotsPages,
    incompleteImageDimensionPages,
    pagesMissingFromSitemap,
    pages,
  };
}

fs.mkdirSync(REPORTS, { recursive: true });
const result = audit();
fs.writeFileSync(path.join(REPORTS, 'seo-audit-data.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify({
  pages: result.stats.pages,
  sitemapLocs: result.stats.sitemapLocs,
  brokenInternalLinks: result.stats.brokenInternalLinks,
  missingRobotsMeta: result.stats.missingRobotsMeta,
  duplicateTitles: result.stats.duplicateTitles.length,
  invalidJsonLd: result.stats.invalidJsonLd,
}, null, 2));
