const fs = require('fs');
const path = require('path');

const dest = path.join(__dirname, '..', 'assets', 'images', 'tech');
const icons = ['shopify', 'html5', 'css3', 'javascript', 'tailwindcss', 'woocommerce', 'flutter', 'meta'];
const colors = {
  shopify: '96BF48',
  html5: 'E34F26',
  css3: '1572B6',
  javascript: 'F7DF1E',
  tailwindcss: '06B6D4',
  woocommerce: '96588A',
  flutter: '02569B',
  meta: '0467DF',
};

(async () => {
  for (const name of icons) {
    const url = `https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/${name}.svg`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log('skip', name, res.status);
      continue;
    }
    let svg = await res.text();
    svg = svg.replace('<svg ', '<svg role="img" aria-hidden="true" ');
    svg = svg.replace(/fill="#[^"]*"/, `fill="#${colors[name]}"`);
    if (!svg.includes('fill=')) {
      svg = svg.replace('<path ', `<path fill="#${colors[name]}" `);
    }
    const file = name === 'meta' ? 'meta-ads.svg' : `${name}.svg`;
    fs.writeFileSync(path.join(dest, file), svg);
    console.log('ok', file);
  }
})();
