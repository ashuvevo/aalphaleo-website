const fs = require('fs');
const path = require('path');

function cookieConsentMarkup() {
  const file = path.join(__dirname, '..', '..', 'components', 'cookie-modal.html');
  return fs.readFileSync(file, 'utf8');
}

module.exports = { cookieConsentMarkup };
