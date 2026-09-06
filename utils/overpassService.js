/**
 * OpenStreetMap (OSM) & Overpass API Service
 * 
 * Capabilities:
 * - Multi-endpoint failover (overpass-api.de, kumi.systems, private instances).
 * - Fast, strictly scoped queries (only 5 top places per category, or matching search query).
 * - Safe request throttling & offline AsyncStorage caching to prevent HTTP 429 errors.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

// Mirror endpoints to prevent single server rate-limiting (HTTP 429)
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

export const OSM_CATEGORIES = [
  { id: 'all', key: 'place_cat_all', icon: 'Compass' },
  { id: 'history', key: 'place_cat_history', icon: 'Landmark' },
  { id: 'museum', key: 'place_cat_museum', icon: 'Museum' },
  { id: 'cafe', key: 'place_cat_cafe', icon: 'Coffee' },
  { id: 'restaurant', key: 'place_cat_food', icon: 'Utensils' },
  { id: 'nature', key: 'place_cat_nature', icon: 'Trees' },
  { id: 'shopping', key: 'place_cat_shopping', icon: 'ShoppingBag' },
];

/**
 * Geocode a city / district name to latitude & longitude using OSM Nominatim
 */
export async function geocodeCity(cityName, countryCode = '') {
  if (!cityName || !cityName.trim()) return null;
  const cleanCity = cityName.trim();
  const cCode = countryCode ? countryCode.toLowerCase().trim() : '';
  const cacheKey = `@osm_geo_${cCode}_${cleanCity.toLowerCase().replace(/\s+/g, '_')}`;

  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    let url = `${NOMINATIM_BASE}?format=json&q=${encodeURIComponent(cleanCity)}&limit=1&addressdetails=1`;
    if (cCode) {
      url += `&countrycodes=${cCode}`;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SimpleLogbookApp/1.1.0 (contact: info@simplelogbook.app)',
        'Accept-Language': 'tr,en;q=0.9',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();

    if (data && data.length > 0) {
      const addr = data[0].address || {};
      const foundCity =
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.province ||
        addr.state ||
        data[0].display_name.split(',')[0].trim();

      const result = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name,
        city: foundCity,
        country: addr.country || '',
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    }
  } catch (error) {
    console.warn('[OSM Geocode] Error geocoding:', error);
  }
  return null;
}

/**
 * Fetch top Points of Interest around coordinates using Overpass API.
 * Defaults strictly to the top 5 places to ensure lightning-fast UI and 0 lag.
 * If user provides a specific search query, searches for matching items.
 */
export async function fetchLivePlaces(lat, lon, category = 'all', radius = 4000, queryText = '', limit = 5) {
  const cleanQuery = queryText.trim().toLowerCase();
  const cacheKey = `@osm_p5_${lat.toFixed(3)}_${lon.toFixed(3)}_${category}_${cleanQuery.replace(/\s+/g, '_')}`;

  // 1. Check local offline cache first
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Valid for 7 days
      if (parsed.timestamp && Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return parsed.places;
      }
    }
  } catch (e) {
    // Ignore cache error
  }

  // 2. Build concise Overpass QL Query
  let filterPart = '';
  switch (category) {
    case 'cafe':
      filterPart = `node["amenity"="cafe"](around:${radius},${lat},${lon});`;
      break;
    case 'restaurant':
      filterPart = `node["amenity"="restaurant"](around:${radius},${lat},${lon});`;
      break;
    case 'history':
      filterPart = `
        node["historic"](around:${radius},${lat},${lon});
        node["tourism"="attraction"](around:${radius},${lat},${lon});
      `;
      break;
    case 'museum':
      filterPart = `node["tourism"="museum"](around:${radius},${lat},${lon});`;
      break;
    case 'nature':
      filterPart = `
        node["leisure"="park"](around:${radius},${lat},${lon});
        node["tourism"="viewpoint"](around:${radius},${lat},${lon});
      `;
      break;
    case 'shopping':
      filterPart = `node["shop"="mall"](around:${radius},${lat},${lon});`;
      break;
    case 'all':
    default:
      filterPart = `
        node["tourism"="museum"](around:${radius},${lat},${lon});
        node["historic"](around:${radius},${lat},${lon});
        node["amenity"="cafe"](around:${radius},${lat},${lon});
        node["amenity"="restaurant"](around:${radius},${lat},${lon});
        node["tourism"="viewpoint"](around:${radius},${lat},${lon});
      `;
      break;
  }

  const query = `
    [out:json][timeout:10];
    (
      ${filterPart}
    );
    out center tags ${cleanQuery ? 25 : limit * 3};
  `;

  // Fetch with fallback across mirror endpoints to avoid 429
  let lastError = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'SimpleLogbookApp/1.1.0',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        lastError = new Error(`Overpass API ${endpoint} responded HTTP ${response.status}`);
        continue; // try next mirror
      }

      const data = await response.json();
      const elements = data.elements || [];

      // Map Overpass elements to clean uniform Place objects
      let places = elements
        .filter((el) => el.tags && (el.tags.name || el.tags['name:en'] || el.tags['name:tr']))
        .map((el) => {
          const tags = el.tags;
          const name = tags.name || tags['name:tr'] || tags['name:en'];

          let mappedCat = 'other';
          if (tags.tourism === 'museum') {
            mappedCat = 'museum';
          } else if (tags.historic || tags.tourism === 'attraction') {
            mappedCat = 'history';
          } else if (tags.amenity === 'cafe') {
            mappedCat = 'cafe';
          } else if (tags.amenity === 'restaurant') {
            mappedCat = 'food';
          } else if (tags.leisure === 'park' || tags.tourism === 'viewpoint') {
            mappedCat = 'nature';
          } else if (tags.shop === 'mall') {
            mappedCat = 'shopping';
          }

          const street = tags['addr:street'] ? `${tags['addr:street']}` : '';
          const suburb = tags['addr:suburb'] || tags['addr:district'] || '';
          const cuisine = tags.cuisine ? `Mutfak: ${tags.cuisine}` : '';
          const descParts = [suburb, street, cuisine].filter(Boolean);
          const shortDesc = descParts.length > 0 ? descParts.join(' • ') : (tags.description || '');

          return {
            id: `osm_${el.id}`,
            name: name.trim(),
            category: mappedCat,
            shortDesc: shortDesc.trim(),
            lat: el.lat || el.center?.lat,
            lon: el.lon || el.center?.lon,
          };
        });

      // Deduplicate by name
      const uniqueMap = new Map();
      places.forEach((p) => {
        const lower = p.name.toLowerCase();
        if (!uniqueMap.has(lower)) {
          uniqueMap.set(lower, p);
        }
      });
      let resultPlaces = Array.from(uniqueMap.values());

      // If user searched a text query, filter by query
      if (cleanQuery) {
        resultPlaces = resultPlaces.filter(
          (p) => p.name.toLowerCase().includes(cleanQuery) || p.shortDesc.toLowerCase().includes(cleanQuery)
        );
      } else {
        // Enforce strictly TOP 5 items to avoid sluggish scrolling
        resultPlaces = resultPlaces.slice(0, 5);
      }

      // Cache results
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({ timestamp: Date.now(), places: resultPlaces })
      );

      return resultPlaces;
    } catch (err) {
      lastError = err;
    }
  }

  // If network failed on all mirrors, return cached if exists
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached).places || [];
  }
  throw lastError || new Error('Tüm Overpass sunucuları meşgul, lütfen tekrar deneyin.');
}
