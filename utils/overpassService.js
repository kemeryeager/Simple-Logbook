/**
 * OpenStreetMap (OSM) & Overpass API Service
 * 
 * Provides 100% free, unlimited live POI (Points of Interest) data for any city in the world:
 * - Cafes, Restaurants, Historical Monuments, Museums, Parks, Viewpoints, and Markets.
 * - Automatic Geocoding via OSM Nominatim.
 * - Offline AsyncStorage caching to ensure offline accessibility after initial fetch.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const OVERPASS_BASE = 'https://overpass-api.de/api/interpreter';

// Supported Categories mapped to Overpass QL filters
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
 * Geocode a city name to latitude & longitude using OSM Nominatim
 */
export async function geocodeCity(cityName) {
  if (!cityName || !cityName.trim()) return null;
  const cleanCity = cityName.trim();
  const cacheKey = `@osm_geo_${cleanCity.toLowerCase().replace(/\s+/g, '_')}`;

  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const url = `${NOMINATIM_BASE}?format=json&q=${encodeURIComponent(cleanCity)}&limit=1&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SimpleLogbookApp/1.1.0 (contact: info@simplelogbook.app)',
        'Accept-Language': 'tr,en;q=0.9',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();

    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name,
        city: data[0].address?.city || data[0].address?.town || data[0].address?.province || cleanCity,
        country: data[0].address?.country || '',
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    }
  } catch (error) {
    console.warn('[OSM Geocode] Error geocoding city:', error);
  }
  return null;
}

/**
 * Fetch Points of Interest around coordinates using Overpass API
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @param {string} category Category ID ('all', 'cafe', 'restaurant', 'history', 'museum', 'nature', 'shopping')
 * @param {number} radius Radius in meters (default: 6000m / 6km)
 */
export async function fetchLivePlaces(lat, lon, category = 'all', radius = 6000) {
  const cacheKey = `@osm_places_${lat.toFixed(3)}_${lon.toFixed(3)}_${category}`;

  // 1. Check local offline cache first
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Cache valid for 7 days
      if (parsed.timestamp && Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return parsed.places;
      }
    }
  } catch (e) {
    // Ignore cache read errors
  }

  // 2. Build Overpass QL Query based on category
  let filterPart = '';
  switch (category) {
    case 'cafe':
      filterPart = `
        node["amenity"="cafe"](around:${radius},${lat},${lon});
        node["amenity"="fast_food"](around:${radius},${lat},${lon});
      `;
      break;
    case 'restaurant':
      filterPart = `
        node["amenity"="restaurant"](around:${radius},${lat},${lon});
        node["amenity"="food_court"](around:${radius},${lat},${lon});
      `;
      break;
    case 'history':
      filterPart = `
        node["historic"](around:${radius},${lat},${lon});
        way["historic"](around:${radius},${lat},${lon});
        node["tourism"="attraction"](around:${radius},${lat},${lon});
      `;
      break;
    case 'museum':
      filterPart = `
        node["tourism"="museum"](around:${radius},${lat},${lon});
        way["tourism"="museum"](around:${radius},${lat},${lon});
        node["amenity"="arts_centre"](around:${radius},${lat},${lon});
      `;
      break;
    case 'nature':
      filterPart = `
        node["leisure"="park"](around:${radius},${lat},${lon});
        way["leisure"="park"](around:${radius},${lat},${lon});
        node["tourism"="viewpoint"](around:${radius},${lat},${lon});
        node["natural"="beach"](around:${radius},${lat},${lon});
      `;
      break;
    case 'shopping':
      filterPart = `
        node["shop"="mall"](around:${radius},${lat},${lon});
        node["amenity"="marketplace"](around:${radius},${lat},${lon});
        way["shop"="mall"](around:${radius},${lat},${lon});
      `;
      break;
    case 'all':
    default:
      filterPart = `
        node["tourism"="museum"](around:${radius},${lat},${lon});
        node["tourism"="attraction"](around:${radius},${lat},${lon});
        node["historic"](around:${radius},${lat},${lon});
        node["amenity"="cafe"](around:${radius},${lat},${lon});
        node["amenity"="restaurant"](around:${radius},${lat},${lon});
        node["tourism"="viewpoint"](around:${radius},${lat},${lon});
        node["leisure"="park"](around:${radius},${lat},${lon});
      `;
      break;
  }

  const query = `
    [out:json][timeout:15];
    (
      ${filterPart}
    );
    out center tags 40;
  `;

  try {
    const response = await fetch(OVERPASS_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SimpleLogbookApp/1.1.0',
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    const elements = data.elements || [];

    // Map Overpass elements to clean uniform Place objects
    const places = elements
      .filter((el) => el.tags && (el.tags.name || el.tags['name:en'] || el.tags['name:tr']))
      .map((el) => {
        const tags = el.tags;
        const name = tags.name || tags['name:tr'] || tags['name:en'];

        // Determine mapped category
        let mappedCat = 'other';
        if (tags.tourism === 'museum' || tags.amenity === 'arts_centre') {
          mappedCat = 'museum';
        } else if (tags.historic || tags.tourism === 'attraction' || tags.historic === 'monument') {
          mappedCat = 'history';
        } else if (tags.amenity === 'cafe') {
          mappedCat = 'cafe';
        } else if (tags.amenity === 'restaurant' || tags.amenity === 'food_court') {
          mappedCat = 'food';
        } else if (tags.leisure === 'park' || tags.tourism === 'viewpoint' || tags.natural) {
          mappedCat = 'nature';
        } else if (tags.shop === 'mall' || tags.amenity === 'marketplace') {
          mappedCat = 'shopping';
        }

        // Build concise description / address
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
          tags: tags,
        };
      });

    // Remove duplicates by name
    const uniqueMap = new Map();
    places.forEach((p) => {
      const lower = p.name.toLowerCase();
      if (!uniqueMap.has(lower)) {
        uniqueMap.set(lower, p);
      }
    });
    const uniquePlaces = Array.from(uniqueMap.values());

    // Cache results
    await AsyncStorage.setItem(
      cacheKey,
      JSON.stringify({ timestamp: Date.now(), places: uniquePlaces })
    );

    return uniquePlaces;
  } catch (error) {
    console.warn('[Overpass API] Fetch error:', error);
    // If network fails, return cached data even if expired
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached).places || [];
    }
    throw error;
  }
}
