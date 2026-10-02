#!/usr/bin/env node
/**
 * Validates blog library and reports publish readiness.
 * Blogs are loaded at build time from blogs/ — run `npm run build` to publish.
 */
const { getBlogPosts, getBlogCategories } = require('../build/lib/blogs');

const posts = getBlogPosts();
const categories = getBlogCategories();

console.log('\nBlog Publish Status');
console.log('===================');
console.log(`Articles ready: ${posts.length}`);
console.log(`Categories:     ${categories.length - 1}`);
console.log('\nBy category:');

const byCat = {};
for (const p of posts) {
  byCat[p.category] = (byCat[p.category] || 0) + 1;
}
Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([cat, n]) => {
  console.log(`  ${cat}: ${n}`);
});

const missingFaqs = posts.filter(p => !p.faqs.length).length;
if (missingFaqs) console.log(`\nWarning: ${missingFaqs} posts without parsed FAQs`);

console.log('\nRun `npm run build` to publish all articles to out/blog/\n');
