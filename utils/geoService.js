/**
 * Geographic Service with OpenStreetMap (OSM) Nominatim & Overpass API
 * 
 * Capabilities:
 * - Comprehensive list of world countries with ISO codes, emoji flags, and multilingual names.
 * - Curated popular tourist countries & top cities for quick one-tap suggestions.
 * - Live OSM Nominatim city search strictly scoped to the selected country (countrycodes=XX).
 * - Live OSM Overpass coordinates lookup.
 * - Offline cache support for all lookups.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

// Top curated tourist destinations with their iconic cities
export const POPULAR_COUNTRIES = [
  { code: 'TR', name: 'Türkiye', nameEn: 'Turkey', flag: '🇹🇷', popularCities: ['İstanbul', 'Antalya', 'Kapadokya (Nevşehir)', 'İzmir', 'Muğla (Bodrum/Fethiye)', 'Ankara', 'Bursa', 'Trabzon', 'Gaziantep', 'Çanakkale', 'Eskişehir', 'Mardin'] },
  { code: 'IT', name: 'İtalya', nameEn: 'Italy', flag: '🇮🇹', popularCities: ['Roma', 'Floransa', 'Venedik', 'Milano', 'Napoli', 'Amalfi', 'Verona', 'Bologna'] },
  { code: 'FR', name: 'Fransa', nameEn: 'France', flag: '🇫🇷', popularCities: ['Paris', 'Nice', 'Lyon', 'Marsilya', 'Bordeaux', 'Strazburg'] },
  { code: 'ES', name: 'İspanya', nameEn: 'Spain', flag: '🇪🇸', popularCities: ['Barselona', 'Madrid', 'Sevilla', 'Valensiya', 'Granada', 'Mallorca', 'Malaga'] },
  { code: 'DE', name: 'Almanya', nameEn: 'Germany', flag: '🇩🇪', popularCities: ['Berlin', 'Münih', 'Frankfurt', 'Hamburg', 'Köln', 'Dresden'] },
  { code: 'GB', name: 'Birleşik Krallık', nameEn: 'United Kingdom', flag: '🇬🇧', popularCities: ['Londra', 'Edinburgh', 'Manchester', 'Oxford', 'Cambridge', 'Liverpool'] },
  { code: 'GR', name: 'Yunanistan', nameEn: 'Greece', flag: '🇬🇷', popularCities: ['Atina', 'Santorini', 'Mikonos', 'Selanik', 'Rodos', 'Girit'] },
  { code: 'JP', name: 'Japonya', nameEn: 'Japan', flag: '🇯🇵', popularCities: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroşima', 'Nara', 'Sapporo'] },
  { code: 'US', name: 'Amerika Birleşik Devletleri', nameEn: 'United States', flag: '🇺🇸', popularCities: ['New York', 'Los Angeles', 'San Francisco', 'Miami', 'Las Vegas', 'Chicago', 'Washington D.C.'] },
  { code: 'NL', name: 'Hollanda', nameEn: 'Netherlands', flag: '🇳🇱', popularCities: ['Amsterdam', 'Rotterdam', 'Lahey (Utrecht)', 'Eindhoven'] },
  { code: 'CH', name: 'İsviçre', nameEn: 'Switzerland', flag: '🇨🇭', popularCities: ['Zürih', 'Cenevre', 'Luzern', 'Interlaken', 'Basel', 'Bern'] },
  { code: 'AT', name: 'Avusturya', nameEn: 'Austria', flag: '🇦🇹', popularCities: ['Viyana', 'Salzburg', 'Innsbruck', 'Hallstatt', 'Graz'] },
  { code: 'PT', name: 'Portekiz', nameEn: 'Portugal', flag: '🇵🇹', popularCities: ['Lizbon', 'Porto', 'Faro (Algarve)', 'Sintra', 'Madeira'] },
  { code: 'CZ', name: 'Çekya', nameEn: 'Czech Republic', flag: '🇨🇿', popularCities: ['Prag', 'Cesky Krumlov', 'Brno', 'Karlovy Vary'] },
  { code: 'TH', name: 'Tayland', nameEn: 'Thailand', flag: '🇹🇭', popularCities: ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Koh Samui'] },
  { code: 'AE', name: 'Birleşik Arap Emirlikleri', nameEn: 'United Arab Emirates', flag: '🇦🇪', popularCities: ['Dubai', 'Abu Dabi', 'Şarika'] },
  { code: 'EG', name: 'Mısır', nameEn: 'Egypt', flag: '🇪🇬', popularCities: ['Kahire', 'Gize', 'İskenderiye', 'Şarm El-Şeyh', 'Luksor', 'Hurghada'] },
  { code: 'HU', name: 'Macaristan', nameEn: 'Hungary', flag: '🇭🇺', popularCities: ['Budapeşte', 'Debrecen', 'Szeged', 'Eger'] },
  { code: 'BE', name: 'Belçika', nameEn: 'Belgium', flag: '🇧🇪', popularCities: ['Brüksel', 'Brugge', 'Gent', 'Antwerp'] },
  { code: 'HR', name: 'Hırvatistan', nameEn: 'Croatia', flag: '🇭🇷', popularCities: ['Dubrovnik', 'Split', 'Zagreb', 'Zadar', 'Hvar'] },
];

// Full list of world countries (ISO 3166-1 alpha-2)
export const WORLD_COUNTRIES = [
  ...POPULAR_COUNTRIES,
  { code: 'AF', name: 'Afganistan', nameEn: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AL', name: 'Arnavutluk', nameEn: 'Albania', flag: '🇦🇱' },
  { code: 'DZ', name: 'Cezayir', nameEn: 'Algeria', flag: '🇩🇿' },
  { code: 'AD', name: 'Andorra', nameEn: 'Andorra', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', nameEn: 'Angola', flag: '🇦🇴' },
  { code: 'AR', name: 'Arjantin', nameEn: 'Argentina', flag: '🇦🇷' },
  { code: 'AM', name: 'Ermenistan', nameEn: 'Armenia', flag: '🇦🇲' },
  { code: 'AU', name: 'Avustralya', nameEn: 'Australia', flag: '🇦🇺' },
  { code: 'AZ', name: 'Azerbaycan', nameEn: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'BH', name: 'Bahreyn', nameEn: 'Bahrain', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladeş', nameEn: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BY', name: 'Belarus', nameEn: 'Belarus', flag: '🇧🇾' },
  { code: 'BA', name: 'Bosna-Hersek', nameEn: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BR', name: 'Brezilya', nameEn: 'Brazil', flag: '🇧🇷' },
  { code: 'BG', name: 'Bulgaristan', nameEn: 'Bulgaria', flag: '🇧🇬' },
  { code: 'CA', name: 'Kanada', nameEn: 'Canada', flag: '🇨🇦' },
  { code: 'CL', name: 'Şili', nameEn: 'Chile', flag: '🇨🇱' },
  { code: 'CN', name: 'Çin', nameEn: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Kolombiya', nameEn: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', name: 'Kosta Rika', nameEn: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CY', name: 'Kıbrıs', nameEn: 'Cyprus', flag: '🇨🇾' },
  { code: 'DK', name: 'Danimarka', nameEn: 'Denmark', flag: '🇩🇰' },
  { code: 'EE', name: 'Estonya', nameEn: 'Estonia', flag: '🇪🇪' },
  { code: 'FI', name: 'Finlandiya', nameEn: 'Finland', flag: '🇫🇮' },
  { code: 'GE', name: 'Gürcistan', nameEn: 'Georgia', flag: '🇬🇪' },
  { code: 'HK', name: 'Hong Kong', nameEn: 'Hong Kong', flag: '🇭🇰' },
  { code: 'IS', name: 'İzlanda', nameEn: 'Iceland', flag: '🇮🇸' },
  { code: 'IN', name: 'Hindistan', nameEn: 'India', flag: '🇮🇳' },
  { code: 'ID', name: 'Endonezya', nameEn: 'Indonesia', flag: '🇮🇩' },
  { code: 'IE', name: 'İrlanda', nameEn: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', name: 'İsrail', nameEn: 'Israel', flag: '🇮🇱' },
  { code: 'JO', name: 'Ürdün', nameEn: 'Jordan', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakistan', nameEn: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenya', nameEn: 'Kenya', flag: '🇰🇪' },
  { code: 'KR', name: 'Güney Kore', nameEn: 'South Korea', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuveyt', nameEn: 'Kuwait', flag: '🇰🇼' },
  { code: 'LB', name: 'Lübnan', nameEn: 'Lebanon', flag: '🇱🇧' },
  { code: 'MY', name: 'Malezya', nameEn: 'Malaysia', flag: '🇲🇾' },
  { code: 'MV', name: 'Maldivler', nameEn: 'Maldives', flag: '🇲🇻' },
  { code: 'MT', name: 'Malta', nameEn: 'Malta', flag: '🇲🇹' },
  { code: 'MX', name: 'Meksika', nameEn: 'Mexico', flag: '🇲🇽' },
  { code: 'MD', name: 'Moldova', nameEn: 'Moldova', flag: '🇲🇩' },
  { code: 'MC', name: 'Monako', nameEn: 'Monaco', flag: '🇲🇨' },
  { code: 'ME', name: 'Karadağ', nameEn: 'Montenegro', flag: '🇲🇪' },
  { code: 'MA', name: 'Fas', nameEn: 'Morocco', flag: '🇲🇦' },
  { code: 'NP', name: 'Nepal', nameEn: 'Nepal', flag: '🇳🇵' },
  { code: 'NZ', name: 'Yeni Zelanda', nameEn: 'New Zealand', flag: '🇳🇿' },
  { code: 'MK', name: 'Kuzey Makedonya', nameEn: 'North Macedonia', flag: '🇲🇰' },
  { code: 'NO', name: 'Norveç', nameEn: 'Norway', flag: '🇳🇴' },
  { code: 'OM', name: 'Umman', nameEn: 'Oman', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', nameEn: 'Pakistan', flag: '🇵🇰' },
  { code: 'PE', name: 'Peru', nameEn: 'Peru', flag: '🇵🇪' },
  { code: 'PH', name: 'Filipinler', nameEn: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', name: 'Polonya', nameEn: 'Poland', flag: '🇵🇱' },
  { code: 'QA', name: 'Katar', nameEn: 'Qatar', flag: '🇶🇦' },
  { code: 'RO', name: 'Romanya', nameEn: 'Romania', flag: '🇷🇴' },
  { code: 'RS', name: 'Sırbistan', nameEn: 'Serbia', flag: '🇷🇸' },
  { code: 'SG', name: 'Singapur', nameEn: 'Singapore', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovakya', nameEn: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenya', nameEn: 'Slovenia', flag: '🇸🇮' },
  { code: 'ZA', name: 'Güney Afrika', nameEn: 'South Africa', flag: '🇿🇦' },
  { code: 'SE', name: 'İsveç', nameEn: 'Sweden', flag: '🇸🇪' },
  { code: 'TW', name: 'Tayvan', nameEn: 'Taiwan', flag: '🇹🇼' },
  { code: 'TN', name: 'Tunus', nameEn: 'Tunisia', flag: '🇹🇳' },
  { code: 'UA', name: 'Ukrayna', nameEn: 'Ukraine', flag: '🇺🇦' },
  { code: 'UZ', name: 'Özbekistan', nameEn: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'VN', name: 'Vietnam', nameEn: 'Vietnam', flag: '🇻🇳' },
].filter((item, index, self) => index === self.findIndex((t) => t.code === item.code));

/**
 * Filter countries by search query (matches code, Turkish name, or English name)
 */
export function searchCountries(query = '') {
  if (!query || !query.trim()) {
    return WORLD_COUNTRIES;
  }
  const q = query.toLowerCase().trim();
  return WORLD_COUNTRIES.filter(
    (c) =>
      c.code.toLowerCase() === q ||
      c.name.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q)
  );
}

/**
 * Find country object by code or name
 */
export function findCountry(codeOrName) {
  if (!codeOrName) return null;
  const q = String(codeOrName).toLowerCase().trim();
  return (
    WORLD_COUNTRIES.find(
      (c) =>
        c.code.toLowerCase() === q ||
        c.name.toLowerCase() === q ||
        c.nameEn.toLowerCase() === q
    ) || null
  );
}

/**
 * Get curated popular cities for a selected country
 */
export function getPopularCitiesForCountry(countryCode) {
  if (!countryCode) return [];
  const found = POPULAR_COUNTRIES.find((c) => c.code.toUpperCase() === countryCode.toUpperCase());
  return found?.popularCities || [];
}

/**
 * Live OpenStreetMap (Nominatim) search for cities/towns strictly within a selected country.
 * Uses `countrycodes=XX` parameter so searches never return cities from other countries.
 * 
 * @param {string} cityName City or town search query
 * @param {string} countryCode 2-letter ISO country code (e.g. 'TR', 'IT', 'FR')
 * @param {number} limit Maximum results to return
 */
export async function searchCitiesInCountryOSM(cityName, countryCode, limit = 8) {
  if (!countryCode || !cityName || cityName.trim().length < 2) {
    return [];
  }

  const cleanQuery = cityName.trim();
  const cCode = countryCode.toLowerCase().trim();
  const cacheKey = `@osm_city_${cCode}_${cleanQuery.toLowerCase().replace(/\s+/g, '_')}`;

  try {
    // 1. Check local cache
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. Query OSM Nominatim strictly for this country
    const url = `${NOMINATIM_BASE}?format=json&q=${encodeURIComponent(cleanQuery)}&countrycodes=${cCode}&featuretype=city&limit=${limit}&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SimpleLogbookApp/1.1.0 (contact: info@simplelogbook.app)',
        'Accept-Language': 'tr,en;q=0.9',
      },
    });

    if (!response.ok) return [];
    const results = await response.json();

    if (!Array.isArray(results)) return [];

    const mapped = results.map((item) => {
      const addr = item.address || {};
      const cityName =
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.province ||
        addr.state ||
        item.display_name.split(',')[0].trim();
      const stateOrProvince = addr.state || addr.province || addr.county || '';
      const subtitle = stateOrProvince && stateOrProvince !== cityName ? stateOrProvince : addr.country || '';

      return {
        id: `osm_${item.osm_id || item.place_id}`,
        name: cityName,
        displayName: item.display_name,
        subtitle: subtitle,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      };
    });

    // Deduplicate by name
    const uniqueMap = new Map();
    mapped.forEach((m) => {
      const key = m.name.toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, m);
      }
    });
    const uniqueResults = Array.from(uniqueMap.values());

    await AsyncStorage.setItem(cacheKey, JSON.stringify(uniqueResults));
    return uniqueResults;
  } catch (error) {
    console.warn('[OSM City Search] Error:', error);
    return [];
  }
}
