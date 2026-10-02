#!/usr/bin/env node
/**
 * Generate local SEO location pages via the main build pipeline.
 * Output: out/locations/ + reports/location-generation-report.md
 */
const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const start = Date.now();

console.log('Aalphaleo Local SEO Generator\n');
console.log('Running full build (CSS + location pages)...\n');

try {
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nLocation generation complete in ${elapsed}s`);
  console.log('Report: reports/location-generation-report.md');
} catch (err) {
  console.error('Location generation failed.');
  process.exit(1);
}
