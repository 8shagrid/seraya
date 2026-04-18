const fs = require('fs');
const path = require('path');

const SOURCE_FILE = process.argv[2] || 'indoinvite-source.html';
const sourcePath = path.resolve(process.cwd(), SOURCE_FILE);

if (!fs.existsSync(sourcePath)) {
  throw new Error(
    `Source file not found: ${sourcePath}\n` +
    'Run this script with a saved Indoinvite HTML source, for example:\n' +
    'node refresh-indoinvite-data.js path\\to\\indoinvite-source.html'
  );
}

const html = fs.readFileSync(sourcePath, 'utf8');

const allTemaMatch = html.match(/const allTema = (\[.*?\]);\s*let debounceTimer/s);
if (!allTemaMatch) {
  throw new Error('Could not find allTema JSON in the source HTML.');
}

const rawThemes = JSON.parse(allTemaMatch[1]);

if (!Array.isArray(rawThemes) || rawThemes.length !== 469) {
  throw new Error(`Expected 469 themes, got ${Array.isArray(rawThemes) ? rawThemes.length : 'invalid data'}.`);
}

const typeOrder = [
  'Elegan',
  'Budaya',
  'Formal',
  'Slide',
  'Simple',
  'Anak',
  'Bunga',
  'Ultah',
  'Gold',
  'Colorful',
  'Wayang',
  'Muslim',
  'Khitanan',
  'Natal'
];

const eventOrder = [
  'Pernikahan',
  'Khitan',
  'Aqiqah',
  'Rapat',
  'Formal',
  'Ultah',
  'Natal',
  'Peresmian'
];

const knownTypeMap = new Map(typeOrder.map(label => [label.toLowerCase(), label]));
const knownEventMap = new Map(eventOrder.map(label => [label.toLowerCase(), label]));
const aliasMap = new Map([
  ['christmas', ['natal']],
  ['baby', ['anak']],
  ['islamic', ['muslim']],
  ['arabic', ['muslim']],
  ['khitanan', ['khitanan', 'khitan']],
  ['khitan', ['khitan']],
  ['aqiqah', ['aqiqah']],
  ['slide', ['slide']],
  ['formal', ['formal']],
  ['simple', ['simple']],
  ['elegan', ['elegan']],
  ['budaya', ['budaya']],
  ['gold', ['gold']],
  ['colorful', ['colorful']],
  ['wayang', ['wayang']],
  ['muslim', ['muslim']],
  ['ultah', ['ultah']],
  ['pernikahan', ['pernikahan']],
  ['rapat', ['rapat']],
  ['peresmian', ['peresmian']],
  ['bunga', ['bunga']]
]);

function unique(values) {
  return [...new Set(values)];
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ');
}

function splitDescription(description) {
  if (!description) return [];
  return unique(
    description
      .split(',')
      .map(part => normalizeText(part).toLowerCase())
      .filter(Boolean)
  );
}

function inferCategoryTokens(name, rawTags) {
  const tokens = new Set(rawTags);
  const nameTokens = normalizeText(name)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  nameTokens.forEach(token => {
    if (knownTypeMap.has(token) || knownEventMap.has(token)) {
      tokens.add(token);
    }

    const aliases = aliasMap.get(token);
    if (aliases) {
      aliases.forEach(alias => tokens.add(alias));
    }
  });

  return [...tokens];
}

function pickOrderedLabels(tokens, labelMap, labelOrder) {
  const tokenSet = new Set(tokens);
  return labelOrder.filter(label => tokenSet.has(label.toLowerCase()));
}

function buildPreviewUrl(id) {
  return `https://katalog.seraya.my.id/s/1952/undangan/${id}?kpd=Bapak%20Budi&contoh=1`;
}

function buildTheme(rawTheme) {
  const rawTags = splitDescription(rawTheme.deskripsi);
  const kategori = inferCategoryTokens(rawTheme.template_name, rawTags);
  const tipe = pickOrderedLabels(kategori, knownTypeMap, typeOrder);
  const acara = pickOrderedLabels(kategori, knownEventMap, eventOrder);

  return {
    id: rawTheme.id,
    name: rawTheme.template_name,
    url: buildPreviewUrl(rawTheme.id),
    thumbnail: rawTheme.live_demo || '',
    kategori,
    acara,
    tipe
  };
}

const themes = rawThemes.map(buildTheme);

const featuredThemeNames = [
  'Customs-Anime',
  'Maso-Rustic',
  'Eternal-Arabic',
  'Eternal-Buildings',
  'Slide-Carousel-JavaBurgundy',
  'Minang-Java',
  'Aesthetic-Symphony',
  'Slide-Floral-C',
  'Customs-Minang',
  'Customs-Batak',
  'Customs-Nias',
  'Customs-Chinese',
  'Customs-Lampung',
  'Customs-Bugis',
  'Customs-Jambi',
  'Customs Mongondow',
  'Honey-Black'
];

function normalizeThemeName(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[-_\s]+/g, ' ');
}

function findThemeByName(name) {
  const normalizedName = normalizeThemeName(name);

  return themes.find(theme => normalizeThemeName(theme.name) === normalizedName)
    || themes.find(theme => normalizeThemeName(theme.name).startsWith(normalizedName))
    || themes.find(theme => normalizeThemeName(theme.name).includes(normalizedName));
}

const featured = featuredThemeNames.map(name => {
  const match = findThemeByName(name);
  if (!match) {
    throw new Error(`Featured theme not found in source data: ${name}`);
  }
  return match;
});

fs.writeFileSync(
  path.resolve(process.cwd(), 'js', 'data', 'themes-data.js'),
  `var THEMES_DATA=${JSON.stringify(themes)};\n`
);

fs.writeFileSync(
  path.resolve(process.cwd(), 'js', 'data', 'featured-themes.js'),
  `window.FEATURED_THEMES=${JSON.stringify(featured)};\n`
);

console.log(`Generated ${themes.length} themes and ${featured.length} featured themes.`);
