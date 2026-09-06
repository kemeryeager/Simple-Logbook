/**
 * Geographic Service
 * 
 * Capabilities:
 * - Comprehensive list of world countries sorted alphabetically.
 * - Live fetch of all cities & districts for any selected country from API with local cache.
 * - Prefix-first search ranking: typing 'b' prioritizes cities starting with 'B', 'bu' prioritizes 'Bu...', etc.
 * - Turkish and international diacritic-insensitive normalization (İ/i, I/ı, ğ, ü, ş, ö, ç).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Full list of world countries (ISO 3166-1 alpha-2) sorted alphabetically
export const WORLD_COUNTRIES = [
  { code: 'AF', name: 'Afganistan', nameEn: 'Afghanistan', flag: '🇦🇫' },
  { code: 'DE', name: 'Almanya', nameEn: 'Germany', flag: '🇩🇪' },
  { code: 'US', name: 'Amerika Birleşik Devletleri', nameEn: 'United States', flag: '🇺🇸' },
  { code: 'AD', name: 'Andorra', nameEn: 'Andorra', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', nameEn: 'Angola', flag: '🇦🇴' },
  { code: 'AG', name: 'Antigua ve Barbuda', nameEn: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: 'AR', name: 'Arjantin', nameEn: 'Argentina', flag: '🇦🇷' },
  { code: 'AL', name: 'Arnavutluk', nameEn: 'Albania', flag: '🇦🇱' },
  { code: 'AU', name: 'Avustralya', nameEn: 'Australia', flag: '🇦🇺' },
  { code: 'AT', name: 'Avusturya', nameEn: 'Austria', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaycan', nameEn: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahamalar', nameEn: 'Bahamas', flag: '🇧🇸' },
  { code: 'BH', name: 'Bahreyn', nameEn: 'Bahrain', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladeş', nameEn: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbados', nameEn: 'Barbados', flag: '🇧🇧' },
  { code: 'BY', name: 'Belarus', nameEn: 'Belarus', flag: '🇧🇾' },
  { code: 'BE', name: 'Belçika', nameEn: 'Belgium', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belize', nameEn: 'Belize', flag: '🇧🇿' },
  { code: 'BJ', name: 'Benin', nameEn: 'Benin', flag: '🇧🇯' },
  { code: 'AE', name: 'Birleşik Arap Emirlikleri', nameEn: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', name: 'Birleşik Krallık', nameEn: 'United Kingdom', flag: '🇬🇧' },
  { code: 'BO', name: 'Bolivya', nameEn: 'Bolivia', flag: '🇧🇴' },
  { code: 'BA', name: 'Bosna-Hersek', nameEn: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BW', name: 'Botsvana', nameEn: 'Botswana', flag: '🇧🇼' },
  { code: 'BR', name: 'Brezilya', nameEn: 'Brazil', flag: '🇧🇷' },
  { code: 'BN', name: 'Brunei', nameEn: 'Brunei', flag: '🇧🇳' },
  { code: 'BG', name: 'Bulgaristan', nameEn: 'Bulgaria', flag: '🇧🇬' },
  { code: 'BF', name: 'Burkina Faso', nameEn: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', nameEn: 'Burundi', flag: '🇧🇮' },
  { code: 'BT', name: 'Butan', nameEn: 'Bhutan', flag: '🇧🇹' },
  { code: 'CV', name: 'Cape Verde', nameEn: 'Cape Verde', flag: '🇨🇻' },
  { code: 'DZ', name: 'Cezayir', nameEn: 'Algeria', flag: '🇩🇿' },
  { code: 'DJ', name: 'Cibuti', nameEn: 'Djibouti', flag: '🇩🇯' },
  { code: 'TD', name: 'Çad', nameEn: 'Chad', flag: '🇹🇩' },
  { code: 'CZ', name: 'Çekya', nameEn: 'Czech Republic', flag: '🇨🇿' },
  { code: 'CN', name: 'Çin', nameEn: 'China', flag: '🇨🇳' },
  { code: 'DK', name: 'Danimarka', nameEn: 'Denmark', flag: '🇩🇰' },
  { code: 'DO', name: 'Dominik Cumhuriyeti', nameEn: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'DM', name: 'Dominika', nameEn: 'Dominica', flag: '🇩🇲' },
  { code: 'EC', name: 'Ekvador', nameEn: 'Ecuador', flag: '🇪🇨' },
  { code: 'GQ', name: 'Ekvator Ginesi', nameEn: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'SV', name: 'El Salvador', nameEn: 'El Salvador', flag: '🇸🇻' },
  { code: 'ID', name: 'Endonezya', nameEn: 'Indonesia', flag: '🇮🇩' },
  { code: 'ER', name: 'Eritre', nameEn: 'Eritrea', flag: '🇪🇷' },
  { code: 'AM', name: 'Ermenistan', nameEn: 'Armenia', flag: '🇦🇲' },
  { code: 'EE', name: 'Estonya', nameEn: 'Estonia', flag: '🇪🇪' },
  { code: 'ET', name: 'Etiyopya', nameEn: 'Ethiopia', flag: '🇪🇹' },
  { code: 'MA', name: 'Fas', nameEn: 'Morocco', flag: '🇲🇦' },
  { code: 'FJ', name: 'Fiji', nameEn: 'Fiji', flag: '🇫🇯' },
  { code: 'PH', name: 'Filipinler', nameEn: 'Philippines', flag: '🇵🇭' },
  { code: 'FI', name: 'Finlandiya', nameEn: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'Fransa', nameEn: 'France', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabon', nameEn: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambiya', nameEn: 'Gambia', flag: '🇬🇲' },
  { code: 'GH', name: 'Gana', nameEn: 'Ghana', flag: '🇬🇭' },
  { code: 'GN', name: 'Gine', nameEn: 'Guinea', flag: '🇬🇳' },
  { code: 'GT', name: 'Guatemala', nameEn: 'Guatemala', flag: '🇬🇹' },
  { code: 'GY', name: 'Guyana', nameEn: 'Guyana', flag: '🇬🇾' },
  { code: 'ZA', name: 'Güney Afrika', nameEn: 'South Africa', flag: '🇿🇦' },
  { code: 'KR', name: 'Güney Kore', nameEn: 'South Korea', flag: '🇰🇷' },
  { code: 'GE', name: 'Gürcistan', nameEn: 'Georgia', flag: '🇬🇪' },
  { code: 'HT', name: 'Haiti', nameEn: 'Haiti', flag: '🇭🇹' },
  { code: 'HR', name: 'Hırvatistan', nameEn: 'Croatia', flag: '🇭🇷' },
  { code: 'IN', name: 'Hindistan', nameEn: 'India', flag: '🇮🇳' },
  { code: 'NL', name: 'Hollanda', nameEn: 'Netherlands', flag: '🇳🇱' },
  { code: 'HN', name: 'Honduras', nameEn: 'Honduras', flag: '🇭🇳' },
  { code: 'HK', name: 'Hong Kong', nameEn: 'Hong Kong', flag: '🇭🇰' },
  { code: 'IQ', name: 'Irak', nameEn: 'Iraq', flag: '🇮🇶' },
  { code: 'IR', name: 'İran', nameEn: 'Iran', flag: '🇮🇷' },
  { code: 'IE', name: 'İrlanda', nameEn: 'Ireland', flag: '🇮🇪' },
  { code: 'ES', name: 'İspanya', nameEn: 'Spain', flag: '🇪🇸' },
  { code: 'IL', name: 'İsrail', nameEn: 'Israel', flag: '🇮🇱' },
  { code: 'SE', name: 'İsveç', nameEn: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'İsviçre', nameEn: 'Switzerland', flag: '🇨🇭' },
  { code: 'IT', name: 'İtalya', nameEn: 'Italy', flag: '🇮🇹' },
  { code: 'IS', name: 'İzlanda', nameEn: 'Iceland', flag: '🇮🇸' },
  { code: 'JM', name: 'Jamaika', nameEn: 'Jamaica', flag: '🇯🇲' },
  { code: 'JP', name: 'Japonya', nameEn: 'Japan', flag: '🇯🇵' },
  { code: 'KH', name: 'Kamboçya', nameEn: 'Cambodia', flag: '🇰🇭' },
  { code: 'CM', name: 'Kamerun', nameEn: 'Cameroon', flag: '🇨🇲' },
  { code: 'CA', name: 'Kanada', nameEn: 'Canada', flag: '🇨🇦' },
  { code: 'ME', name: 'Karadağ', nameEn: 'Montenegro', flag: '🇲🇪' },
  { code: 'QA', name: 'Katar', nameEn: 'Qatar', flag: '🇶🇦' },
  { code: 'KZ', name: 'Kazakistan', nameEn: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenya', nameEn: 'Kenya', flag: '🇰🇪' },
  { code: 'CY', name: 'Kıbrıs', nameEn: 'Cyprus', flag: '🇨🇾' },
  { code: 'KG', name: 'Kırgızistan', nameEn: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'CO', name: 'Kolombiya', nameEn: 'Colombia', flag: '🇨🇴' },
  { code: 'KM', name: 'Komorlar', nameEn: 'Comoros', flag: '🇰🇲' },
  { code: 'CG', name: 'Kongo', nameEn: 'Congo', flag: '🇨🇬' },
  { code: 'CR', name: 'Kosta Rika', nameEn: 'Costa Rica', flag: '🇨🇷' },
  { code: 'KW', name: 'Kuveyt', nameEn: 'Kuwait', flag: '🇰🇼' },
  { code: 'KP', name: 'Kuzey Kore', nameEn: 'North Korea', flag: '🇰🇵' },
  { code: 'MK', name: 'Kuzey Makedonya', nameEn: 'North Macedonia', flag: '🇲🇰' },
  { code: 'CU', name: 'Küba', nameEn: 'Cuba', flag: '🇨🇺' },
  { code: 'LA', name: 'Laos', nameEn: 'Laos', flag: '🇱🇦' },
  { code: 'LV', name: 'Letonya', nameEn: 'Latvia', flag: '🇱🇻' },
  { code: 'LR', name: 'Liberya', nameEn: 'Liberia', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya', nameEn: 'Libya', flag: '🇱🇾' },
  { code: 'LI', name: 'Lihtenştayn', nameEn: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LT', name: 'Litvanya', nameEn: 'Lithuania', flag: '🇱🇹' },
  { code: 'LB', name: 'Lübnan', nameEn: 'Lebanon', flag: '🇱🇧' },
  { code: 'LU', name: 'Lüksemburg', nameEn: 'Luxembourg', flag: '🇱🇺' },
  { code: 'HU', name: 'Macaristan', nameEn: 'Hungary', flag: '🇭🇺' },
  { code: 'MG', name: 'Madagaskar', nameEn: 'Madagascar', flag: '🇲🇬' },
  { code: 'MY', name: 'Malezya', nameEn: 'Malaysia', flag: '🇲🇾' },
  { code: 'MV', name: 'Maldivler', nameEn: 'Maldives', flag: '🇲🇻' },
  { code: 'ML', name: 'Mali', nameEn: 'Mali', flag: '🇲🇱' },
  { code: 'MT', name: 'Malta', nameEn: 'Malta', flag: '🇲🇹' },
  { code: 'MU', name: 'Mauritius', nameEn: 'Mauritius', flag: '🇲🇺' },
  { code: 'MX', name: 'Meksika', nameEn: 'Mexico', flag: '🇲🇽' },
  { code: 'EG', name: 'Mısır', nameEn: 'Egypt', flag: '🇪🇬' },
  { code: 'MD', name: 'Moldova', nameEn: 'Moldova', flag: '🇲🇩' },
  { code: 'MC', name: 'Monako', nameEn: 'Monaco', flag: '🇲🇨' },
  { code: 'MR', name: 'Moritanya', nameEn: 'Mauritania', flag: '🇲🇷' },
  { code: 'MZ', name: 'Mozambik', nameEn: 'Mozambique', flag: '🇲🇿' },
  { code: 'MM', name: 'Myanmar', nameEn: 'Myanmar', flag: '🇲🇲' },
  { code: 'NA', name: 'Namibya', nameEn: 'Namibia', flag: '🇳🇦' },
  { code: 'NP', name: 'Nepal', nameEn: 'Nepal', flag: '🇳🇵' },
  { code: 'NE', name: 'Nijer', nameEn: 'Niger', flag: '🇳🇪' },
  { code: 'NG', name: 'Nijerya', nameEn: 'Nigeria', flag: '🇳🇬' },
  { code: 'NI', name: 'Nikaragua', nameEn: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NO', name: 'Norveç', nameEn: 'Norway', flag: '🇳🇴' },
  { code: 'CF', name: 'Orta Afrika Cumhuriyeti', nameEn: 'Central African Republic', flag: '🇨🇫' },
  { code: 'UZ', name: 'Özbekistan', nameEn: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'PK', name: 'Pakistan', nameEn: 'Pakistan', flag: '🇵🇰' },
  { code: 'PA', name: 'Panama', nameEn: 'Panama', flag: '🇵🇦' },
  { code: 'PG', name: 'Papua Yeni Gine', nameEn: 'Papua New Guinea', flag: '🇵🇬' },
  { code: 'PY', name: 'Paraguay', nameEn: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', nameEn: 'Peru', flag: '🇵🇪' },
  { code: 'PL', name: 'Polonya', nameEn: 'Poland', flag: '🇵🇱' },
  { code: 'PT', name: 'Portekiz', nameEn: 'Portugal', flag: '🇵🇹' },
  { code: 'RO', name: 'Romanya', nameEn: 'Romania', flag: '🇷🇴' },
  { code: 'RW', name: 'Ruanda', nameEn: 'Rwanda', flag: '🇷🇼' },
  { code: 'RU', name: 'Rusya', nameEn: 'Russia', flag: '🇷🇺' },
  { code: 'SN', name: 'Senegal', nameEn: 'Senegal', flag: '🇸🇳' },
  { code: 'SC', name: 'Seyşeller', nameEn: 'Seychelles', flag: '🇸🇨' },
  { code: 'RS', name: 'Sırbistan', nameEn: 'Serbia', flag: '🇷🇸' },
  { code: 'SL', name: 'Sierra Leone', nameEn: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SG', name: 'Singapur', nameEn: 'Singapore', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovakya', nameEn: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenya', nameEn: 'Slovenia', flag: '🇸🇮' },
  { code: 'SO', name: 'Somali', nameEn: 'Somalia', flag: '🇸🇴' },
  { code: 'LK', name: 'Sri Lanka', nameEn: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'SD', name: 'Sudan', nameEn: 'Sudan', flag: '🇸🇩' },
  { code: 'SR', name: 'Surinam', nameEn: 'Suriname', flag: '🇸🇷' },
  { code: 'SY', name: 'Suriye', nameEn: 'Syria', flag: '🇸🇾' },
  { code: 'SA', name: 'Suudi Arabistan', nameEn: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'CL', name: 'Şili', nameEn: 'Chile', flag: '🇨🇱' },
  { code: 'TJ', name: 'Tacikistan', nameEn: 'Tajikistan', flag: '🇹🇯' },
  { code: 'TZ', name: 'Tanzanya', nameEn: 'Tanzania', flag: '🇹🇿' },
  { code: 'TH', name: 'Tayland', nameEn: 'Thailand', flag: '🇹🇭' },
  { code: 'TW', name: 'Tayvan', nameEn: 'Taiwan', flag: '🇹🇼' },
  { code: 'TG', name: 'Togo', nameEn: 'Togo', flag: '🇹🇬' },
  { code: 'TO', name: 'Tonga', nameEn: 'Tonga', flag: '🇹🇴' },
  { code: 'TT', name: 'Trinidad ve Tobago', nameEn: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'TN', name: 'Tunus', nameEn: 'Tunisia', flag: '🇹🇳' },
  { code: 'TR', name: 'Türkiye', nameEn: 'Turkey', flag: '🇹🇷' },
  { code: 'TM', name: 'Türkmenistan', nameEn: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'UG', name: 'Uganda', nameEn: 'Uganda', flag: '🇺🇬' },
  { code: 'UA', name: 'Ukrayna', nameEn: 'Ukraine', flag: '🇺🇦' },
  { code: 'OM', name: 'Umman', nameEn: 'Oman', flag: '🇴🇲' },
  { code: 'UY', name: 'Uruguay', nameEn: 'Uruguay', flag: '🇺🇾' },
  { code: 'JO', name: 'Ürdün', nameEn: 'Jordan', flag: '🇯🇴' },
  { code: 'VE', name: 'Venezuela', nameEn: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', nameEn: 'Vietnam', flag: '🇻🇳' },
  { code: 'YE', name: 'Yemen', nameEn: 'Yemen', flag: '🇾🇪' },
  { code: 'NZ', name: 'Yeni Zelanda', nameEn: 'New Zealand', flag: '🇳🇿' },
  { code: 'GR', name: 'Yunanistan', nameEn: 'Greece', flag: '🇬🇷' },
  { code: 'ZM', name: 'Zambiya', nameEn: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabve', nameEn: 'Zimbabwe', flag: '🇿🇼' },
].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

/**
 * Normalizes text for search: lowercases and removes accents/diacritics
 * e.g.  Bursa -> bursa, İzmir -> izmir, Kadıköy -> kadikoy, Çankaya -> cankaya
 */
export function normalizeSearchText(text = '') {
  return String(text || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i');
}

const displayNamesCache = {};

/**
 * Returns the localized country name according to the active app language (e.g. 'de', 'en', 'fr', 'es', 'ja', 'tr').
 */
export function getCountryNameInLang(country, lang = 'tr') {
  if (!country) return '';
  const code = country.code;
  if (!code) return country.name || '';

  const targetLang = (lang || 'tr').toLowerCase();

  if (!displayNamesCache[targetLang]) {
    try {
      displayNamesCache[targetLang] = new Intl.DisplayNames([targetLang], { type: 'region' });
    } catch (e) {
      displayNamesCache[targetLang] = null;
    }
  }

  if (displayNamesCache[targetLang]) {
    try {
      const localized = displayNamesCache[targetLang].of(code);
      if (localized) return localized;
    } catch (e) {}
  }

  return targetLang === 'tr' ? country.name : (country.nameEn || country.name);
}

/**
 * Filter countries by search query with active language support:
 * - Each country displays its localized name at the top.
 * - English name and ISO code are preserved below.
 * - Prioritizes countries whose localized name, English name, or ISO code starts with query.
 * - Sorted alphabetically by the localized name in the active language.
 */
export function searchCountries(query = '', lang = 'tr') {
  const list = WORLD_COUNTRIES.map((c) => ({
    ...c,
    displayName: getCountryNameInLang(c, lang),
  }));

  list.sort((a, b) => a.displayName.localeCompare(b.displayName, lang));

  if (!query || !query.trim()) {
    return list;
  }

  const q = normalizeSearchText(query);
  const startsWithList = [];
  const containsList = [];

  for (const country of list) {
    const normDisplayName = normalizeSearchText(country.displayName);
    const normEn = normalizeSearchText(country.nameEn);
    const normCode = country.code.toLowerCase();

    if (normCode === q || normDisplayName.startsWith(q) || normEn.startsWith(q)) {
      startsWithList.push(country);
    } else if (normDisplayName.includes(q) || normEn.includes(q)) {
      containsList.push(country);
    }
  }

  return [...startsWithList, ...containsList];
}

/**
 * Find country object by code or name
 */
export function findCountry(codeOrName) {
  if (!codeOrName) return null;
  const q = normalizeSearchText(codeOrName);
  return (
    WORLD_COUNTRIES.find(
      (c) =>
        c.code.toLowerCase() === q ||
        normalizeSearchText(c.name) === q ||
        normalizeSearchText(c.nameEn) === q
    ) || null
  );
}

/**
 * Fetch all cities and districts for a country from API.
 * Uses AsyncStorage to cache results locally.
 * 
 * @param {object|string} countryObj Country object or code/name
 * @returns {Promise<string[]>} Alphabetically sorted array of city/district names
 */
export async function fetchAllCitiesForCountry(countryObj) {
  if (!countryObj) return [];

  const country = typeof countryObj === 'object' ? countryObj : findCountry(countryObj);
  if (!country) return [];

  const cCode = country.code.toUpperCase();
  const cacheKey = '@geo_cities_v2_' + cCode;

  try {
    // 1. Check local cache
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[GeoService] Cache read error:', err);
  }

  // 2. Fetch from API
  try {
    // For Turkey, the API returns 1847 cities and districts when query is lowercase 'turkey'
    const queryName = cCode === 'TR' ? 'turkey' : country.nameEn;

    const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: queryName }),
    });

    if (res.ok) {
      const data = await res.json();
      const rawCities = data.data || [];

      if (Array.isArray(rawCities) && rawCities.length > 0) {
        // Clean and deduplicate suffix like İlçesi, İlçe, District
        const cleanName = (name) =>
          String(name || '')
            .replace(/\s+(İlçesi|İlçe|ilçesi|ilçe|District|Province|Municipality)$/i, '')
            .trim();

        const uniqueSet = new Set();
        for (const raw of rawCities) {
          const cleaned = cleanName(raw);
          if (cleaned) {
            uniqueSet.add(cleaned);
          }
        }

        const sorted = Array.from(uniqueSet).sort((a, b) => a.localeCompare(b, 'tr'));

        // Save to cache
        try {
          await AsyncStorage.setItem(cacheKey, JSON.stringify(sorted));
        } catch (e) {
          // non-critical
        }

        return sorted;
      }
    }
  } catch (apiErr) {
    console.warn('[GeoService] API fetch error:', apiErr);
  }

  return [];
}

/**
 * Filter list of city strings by prefix ranking:
 * 1. Cities whose name STARTS WITH the search query (alphabetically sorted)
 * 2. Cities whose name CONTAINS the search query (alphabetically sorted)
 * 
 * @param {string[]} cities List of city names
 * @param {string} query Search input
 * @returns {string[]} Filtered and ranked city names
 */
export function filterAndRankCities(cities = [], query = '') {
  if (!Array.isArray(cities) || cities.length === 0) return [];
  if (!query || !query.trim()) {
    return cities;
  }

  const q = normalizeSearchText(query);
  const startsWithList = [];
  const containsList = [];

  for (const city of cities) {
    const norm = normalizeSearchText(city);
    if (norm.startsWith(q)) {
      startsWithList.push(city);
    } else if (norm.includes(q)) {
      containsList.push(city);
    }
  }

  startsWithList.sort((a, b) => a.localeCompare(b, 'tr'));
  containsList.sort((a, b) => a.localeCompare(b, 'tr'));

  return [...startsWithList, ...containsList];
}
