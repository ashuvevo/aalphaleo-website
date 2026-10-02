const { marked } = require('marked');

marked.setOptions({
  gfm: true,
  breaks: false,
});

function stripLeadingH1Html(html) {
  return html.replace(/^<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');
}

function markdownToHtml(markdown) {
  let html = marked.parse(markdown).trim();
  html = stripLeadingH1Html(html);
  html = html.replace(/<table/g, '<div class="my-6 overflow-x-auto"><table');
  html = html.replace(/<\/table>/g, '</table></div>');
  return html;
}

module.exports = { markdownToHtml };
