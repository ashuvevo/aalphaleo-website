const fs = require('fs');
const path = require('path');

const CITIES_FILE = path.join(__dirname, '..', 'data', 'cities.json');

let cache = null;

function loadCities() {
  if (cache) return cache;
  cache = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));
  return cache;
}

function getCityBySlug(slug) {
  return loadCities().find(c => c.slug === slug) || null;
}

function getRelatedCities(city, limit = 6) {
  return loadCities()
    .filter(c => c.stateSlug === city.stateSlug && c.slug !== city.slug)
    .slice(0, limit);
}

function getAllCities() {
  return loadCities();
}

module.exports = {
  loadCities,
  getCityBySlug,
  getRelatedCities,
  getAllCities,
};
