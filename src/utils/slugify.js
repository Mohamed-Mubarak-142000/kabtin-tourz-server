const crypto = require('crypto');

// Basic Arabic -> Latin transliteration map (common letters).
// This is intentionally simple — good enough to produce readable,
// URL-safe slugs from Arabic titles without pulling in a dependency.
const ARABIC_MAP = {
  'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a', 'ء': 'a',
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h',
  'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't',
  'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h',
  'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'h', 'ئ': 'e',
  'ؤ': 'o', 'لا': 'la',
};

function transliterate(input) {
  return input
    .split('')
    .map((ch) => ARABIC_MAP[ch] ?? ch)
    .join('');
}

/**
 * Generates a URL-safe slug from a title. Handles Arabic input via
 * transliteration. If the result would be empty (e.g. only symbols,
 * or characters outside our transliteration map that also get stripped),
 * falls back to a short random URL-safe id so we never produce an
 * empty/duplicate slug.
 */
function slugify(title) {
  const base = transliterate(String(title || '').toLowerCase().trim());

  const slug = base
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug) return slug;

  return `trip-${crypto.randomBytes(4).toString('hex')}`;
}

module.exports = { slugify };
