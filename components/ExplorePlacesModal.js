import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  Search,
  X,
  Plus,
  Check,
  MapPin,
  Compass,
  Camera,
  Coffee,
  Utensils,
  ShoppingBag,
  Sparkles,
} from 'lucide-react-native';
import ModalSheet from './ModalSheet';
import { translatePlaceCategory } from '../utils/translations';
import {
  getAllDestinations,
  findCityByQuery,
  searchDestinations,
} from '../data/destinations';

/**
 * Maps place category string from destinations data to standard storage key.
 */
const toCategoryKey = (cat) => {
  if (!cat) return 'place_cat_other';
  if (cat.startsWith('place_cat_')) return cat;
  const key = `place_cat_${cat}`;
  if (
    [
      'place_cat_nature',
      'place_cat_history',
      'place_cat_museum',
      'place_cat_cafe',
      'place_cat_shopping',
      'place_cat_other',
    ].includes(key)
  ) {
    return key;
  }
  return cat;
};

/**
 * Returns icon, accent colors, and localized label for place categories.
 */
const getCategoryBadgeConfig = (category, isDark, language) => {
  const cat = (category || '').toLowerCase();
  const label = translatePlaceCategory(category, language);

  if (
    cat.includes('doğa') ||
    cat.includes('plaj') ||
    cat.includes('deniz') ||
    cat.includes('nature') ||
    cat.includes('beach')
  ) {
    return {
      Icon: Compass,
      color: isDark ? '#2DD4BF' : '#0D9488',
      bg: isDark ? '#134E4A4D' : '#CCFBF1',
      label,
    };
  }
  if (
    cat.includes('tarih') ||
    cat.includes('antik') ||
    cat.includes('kale') ||
    cat.includes('history') ||
    cat.includes('historic')
  ) {
    return {
      Icon: Camera,
      color: isDark ? '#FBBF24' : '#D97706',
      bg: isDark ? '#78350F4D' : '#FEF3C7',
      label,
    };
  }
  if (
    cat.includes('müze') ||
    cat.includes('kültür') ||
    cat.includes('sanat') ||
    cat.includes('museum') ||
    cat.includes('culture')
  ) {
    return {
      Icon: Camera,
      color: isDark ? '#A78BFA' : '#7C3AED',
      bg: isDark ? '#4C1D954D' : '#EDE9FE',
      label,
    };
  }
  if (
    cat.includes('kafe') ||
    cat.includes('restoran') ||
    cat.includes('yeme') ||
    cat.includes('kahve') ||
    cat.includes('cafe') ||
    cat.includes('restaurant')
  ) {
    return {
      Icon: cat.includes('kahve') || cat.includes('kafe') || cat.includes('cafe') ? Coffee : Utensils,
      color: isDark ? '#FB923C' : '#EA580C',
      bg: isDark ? '#7C2D124D' : '#FFEDD5',
      label,
    };
  }
  if (
    cat.includes('alışveriş') ||
    cat.includes('avm') ||
    cat.includes('çarşı') ||
    cat.includes('shopping')
  ) {
    return {
      Icon: ShoppingBag,
      color: isDark ? '#38BDF8' : '#0284C7',
      bg: isDark ? '#0C4A6E4D' : '#E0F2FE',
      label,
    };
  }

  return {
    Icon: MapPin,
    color: isDark ? '#A1A1AA' : '#475569',
    bg: isDark ? '#27272A' : '#F1F5F9',
    label,
  };
};

/**
 * Fuzzy check if a place name is already in existing places list.
 */
const isPlaceAlreadyAdded = (nameToCheck, existingNames = [], locallyAddedNames = new Set()) => {
  if (!nameToCheck) return false;
  if (locallyAddedNames.has(nameToCheck)) return true;
  if (!Array.isArray(existingNames) || existingNames.length === 0) return false;

  const normalize = (str) =>
    String(str || '')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const target = normalize(nameToCheck);
  const targetClean = target.replace(/\(.*?\)/g, '').trim();

  return existingNames.some((existing) => {
    const norm = normalize(existing);
    if (norm === target) return true;
    const normClean = norm.replace(/\(.*?\)/g, '').trim();
    return normClean === targetClean || (normClean.length > 3 && targetClean.includes(normClean));
  });
};

export default function ExplorePlacesModal({
  visible = false,
  onClose,
  city = '',
  existingPlaceNames = [],
  onAddPlace,
  tripStartDate,
  theme,
  t,
  language = 'tr',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [locallyAddedNames, setLocallyAddedNames] = useState(() => new Set());

  const isDark =
    theme?.canvas === '#09090B' ||
    (theme?.card && (theme.card.includes('#18181B') || theme.card.includes('#121214')));

  const allDestinations = useMemo(() => getAllDestinations(), []);

  // Identify matching city from trip's city string
  const matchedCity = useMemo(() => {
    if (!city) return null;
    return findCityByQuery(city);
  }, [city]);

  // Synchronize initial selected city and state when modal opens
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setLocallyAddedNames(new Set());
      if (matchedCity) {
        setSelectedCityId(matchedCity.id);
      } else if (allDestinations.length > 0) {
        setSelectedCityId(allDestinations[0].id);
      }
    }
  }, [visible, matchedCity, allDestinations]);

  // City list with matched city prioritized at the beginning
  const sortedDestinations = useMemo(() => {
    if (!matchedCity) return allDestinations;
    const rest = allDestinations.filter((d) => d.id !== matchedCity.id);
    return [matchedCity, ...rest];
  }, [matchedCity, allDestinations]);

  // Active city object
  const activeCity = useMemo(() => {
    if (selectedCityId) {
      const found = allDestinations.find((d) => d.id === selectedCityId);
      if (found) return found;
    }
    return matchedCity || allDestinations[0] || null;
  }, [selectedCityId, matchedCity, allDestinations]);

  // Search results filtering
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedPlaces = [];
    const seenPlaceKeys = new Set();

    // 1. Search matching destinations by city / country / tags
    const matchedCities = searchDestinations(q, 10);
    const matchedCityIds = new Set(matchedCities.map((c) => c.id));

    // 2. Collect matching places across all curated destinations
    for (const dest of allDestinations) {
      const isCityMatched = matchedCityIds.has(dest.id);
      const destCityNorm = dest.city.toLowerCase();
      const destCountryNorm = dest.country.toLowerCase();

      for (const place of dest.popularPlaces) {
        const placeNameNorm = place.name.toLowerCase();
        const descNorm = (place.shortDesc || '').toLowerCase();
        const tagsNorm = (place.tags || []).join(' ').toLowerCase();

        const matchesQuery =
          isCityMatched ||
          placeNameNorm.includes(q) ||
          descNorm.includes(q) ||
          tagsNorm.includes(q) ||
          destCityNorm.includes(q) ||
          destCountryNorm.includes(q);

        if (matchesQuery) {
          const key = `${dest.id}__${place.name}`;
          if (!seenPlaceKeys.has(key)) {
            seenPlaceKeys.add(key);
            matchedPlaces.push({
              ...place,
              cityName: dest.city,
              countryName: dest.country,
              flag: dest.flag,
            });
          }
        }
      }
    }

    return matchedPlaces;
  }, [searchQuery, allDestinations]);

  // Handle adding place to trip
  const handleAddPlacePress = useCallback(
    (place) => {
      setLocallyAddedNames((prev) => {
        const next = new Set(prev);
        next.add(place.name);
        return next;
      });

      if (typeof onAddPlace === 'function') {
        onAddPlace({
          name: place.name,
          category: toCategoryKey(place.category),
          notes: place.shortDesc || '',
          date: tripStartDate || undefined,
        });
      }
    },
    [onAddPlace, tripStartDate]
  );

  // Safe translation helper
  const translate = useCallback(
    (key, fallback, params) => {
      if (typeof t === 'function') {
        const res = t(key, params);
        if (res && res !== key) return res;
      }
      return fallback;
    },
    [t]
  );

  const placesToDisplay = searchResults !== null ? searchResults : activeCity?.popularPlaces || [];

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title={translate('explore_places', 'Gezilecek Yerler Rehberi')}
      subtitle={
        matchedCity && !searchQuery.trim()
          ? translate('suggested_places_for', `${matchedCity.city} için Önerilen Yerler`, {
              city: matchedCity.city,
            })
          : translate('explore_places_subtitle', 'Popüler yerleri inceleyin ve rotanıza ekleyin')
      }
      theme={theme}
    >
      <View style={styles.modalContentWrapper}>
        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme?.inputBg || (isDark ? '#18181B' : '#F4F4F5'),
              borderColor: theme?.border || '#E4E4E7',
            },
          ]}
        >
          <Search size={16} color={theme?.textMuted || '#71717A'} strokeWidth={2.2} />
          <TextInput
            style={[
              styles.searchInput,
              { color: theme?.textPrimary || (isDark ? '#FAFAFA' : '#09090B') },
            ]}
            placeholder={translate(
              'search_destination_placeholder',
              'Şehir, ülke veya yer ara...'
            )}
            placeholderTextColor={theme?.textMuted || '#71717A'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              hitSlop={8}
              style={({ pressed }) => [styles.clearSearchBtn, pressed && { opacity: 0.6 }]}
            >
              <X size={14} color={theme?.textMuted || '#71717A'} strokeWidth={2.4} />
            </Pressable>
          )}
        </View>

        {/* City Filter Pills (Visible when not actively searching) */}
        {!searchQuery.trim() && (
          <View style={styles.cityPillsSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cityPillsScroll}
            >
              {sortedDestinations.map((dest) => {
                const isSelected = activeCity?.id === dest.id;
                const isTripCity = matchedCity?.id === dest.id;

                return (
                  <Pressable
                    key={dest.id}
                    onPress={() => setSelectedCityId(dest.id)}
                    style={({ pressed }) => [
                      styles.cityChip,
                      {
                        backgroundColor: isSelected
                          ? theme?.btnPrimaryBg || '#18181B'
                          : theme?.card || '#FFFFFF',
                        borderColor: isSelected
                          ? theme?.btnPrimaryBg || '#18181B'
                          : theme?.border || '#E4E4E7',
                      },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={styles.cityChipFlag}>{dest.flag}</Text>
                    <Text
                      style={[
                        styles.cityChipText,
                        {
                          color: isSelected
                            ? theme?.btnPrimaryText || '#FFFFFF'
                            : theme?.textSecondary || '#52525B',
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {dest.city}
                    </Text>
                    {isTripCity && (
                      <View
                        style={[
                          styles.tripCityTag,
                          {
                            backgroundColor: isSelected
                              ? isDark
                                ? '#27272A'
                                : '#3F3F46'
                              : isDark
                              ? '#14532D'
                              : '#DCFCE7',
                          },
                        ]}
                      >
                        <Sparkles
                          size={10}
                          color={isSelected ? '#FFFFFF' : isDark ? '#4ADE80' : '#16A34A'}
                          strokeWidth={2.4}
                        />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          {searchQuery.trim() ? (
            <Text style={[styles.sectionTitle, { color: theme?.textPrimary || '#09090B' }]}>
              {`${translate('search', 'Arama')} (${placesToDisplay.length})`}
            </Text>
          ) : (
            <View style={styles.cityInfoRow}>
              <Text style={styles.cityInfoFlag}>{activeCity?.flag}</Text>
              <Text style={[styles.sectionTitle, { color: theme?.textPrimary || '#09090B' }]}>
                {`${activeCity?.city}, ${activeCity?.country}`}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  { backgroundColor: isDark ? '#27272A' : '#F4F4F5' },
                ]}
              >
                <Text style={[styles.countBadgeText, { color: theme?.textMuted || '#71717A' }]}>
                  {translate(
                    'curated_places_count',
                    `${placesToDisplay.length} popüler nokta`,
                    { count: placesToDisplay.length }
                  )}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Places List */}
        {placesToDisplay.length === 0 ? (
          <View style={styles.emptySearchState}>
            <View
              style={[
                styles.emptyIconCircle,
                { backgroundColor: theme?.btnSecondaryBg || (isDark ? '#27272A' : '#F4F4F5') },
              ]}
            >
              <Search size={24} color={theme?.textMuted || '#71717A'} strokeWidth={1.8} />
            </View>
            <Text style={[styles.emptySearchTitle, { color: theme?.textPrimary || '#09090B' }]}>
              {translate('no_guide_results', 'Eşleşen şehir veya yer bulunamadı')}
            </Text>
            <Text style={[styles.emptySearchSubtitle, { color: theme?.textMuted || '#71717A' }]}>
              {translate('search_empty_subtitle', 'Farklı bir arama terimi deneyebilirsiniz')}
            </Text>
          </View>
        ) : (
          <View style={styles.placesList}>
            {placesToDisplay.map((place) => {
              const badge = getCategoryBadgeConfig(place.category, isDark, language);
              const BadgeIcon = badge.Icon;
              const isAdded = isPlaceAlreadyAdded(
                place.name,
                existingPlaceNames,
                locallyAddedNames
              );

              return (
                <View
                  key={place.id || `${place.name}__${place.category}`}
                  style={[
                    styles.placeCard,
                    {
                      backgroundColor: theme?.card || '#FFFFFF',
                      borderColor: theme?.border || '#E4E4E7',
                    },
                  ]}
                >
                  {/* Card Header Row */}
                  <View style={styles.placeCardHeader}>
                    <View style={styles.placeCardTitleWrap}>
                      <Text
                        style={[
                          styles.placeCardTitle,
                          { color: theme?.textPrimary || '#09090B' },
                        ]}
                      >
                        {place.name}
                      </Text>
                      {place.cityName && (
                        <View style={styles.placeCityRow}>
                          <Text style={styles.placeCityFlag}>{place.flag}</Text>
                          <Text
                            style={[
                              styles.placeCityText,
                              { color: theme?.textMuted || '#71717A' },
                            ]}
                          >
                            {place.cityName}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Category Pill */}
                    <View style={[styles.categoryBadge, { backgroundColor: badge.bg }]}>
                      <BadgeIcon size={11} color={badge.color} strokeWidth={2.2} />
                      <Text style={[styles.categoryBadgeText, { color: badge.color }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  {/* Short Description */}
                  {place.shortDesc ? (
                    <Text
                      style={[
                        styles.placeDesc,
                        { color: theme?.textSecondary || '#52525B' },
                      ]}
                    >
                      {place.shortDesc}
                    </Text>
                  ) : null}

                  {/* Action Button Row */}
                  <View style={styles.placeActionRow}>
                    <Pressable
                      onPress={() => handleAddPlacePress(place)}
                      disabled={isAdded}
                      style={({ pressed }) => [
                        styles.addBtn,
                        isAdded
                          ? [
                              styles.addBtnDisabled,
                              {
                                backgroundColor:
                                  theme?.btnSecondaryBg || (isDark ? '#27272A' : '#F4F4F5'),
                                borderColor: theme?.border || '#E4E4E7',
                              },
                            ]
                          : [
                              styles.addBtnActive,
                              {
                                backgroundColor: theme?.btnPrimaryBg || '#18181B',
                              },
                            ],
                        pressed && !isAdded && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                      ]}
                    >
                      {isAdded ? (
                        <>
                          <Check
                            size={14}
                            color={isDark ? '#4ADE80' : '#16A34A'}
                            strokeWidth={2.5}
                          />
                          <Text
                            style={[
                              styles.addBtnText,
                              { color: isDark ? '#4ADE80' : '#16A34A', fontWeight: '600' },
                            ]}
                          >
                            {translate('added_to_route', 'Eklendi')}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Plus
                            size={14}
                            color={theme?.btnPrimaryText || '#FFFFFF'}
                            strokeWidth={2.5}
                          />
                          <Text
                            style={[
                              styles.addBtnText,
                              {
                                color: theme?.btnPrimaryText || '#FFFFFF',
                                fontWeight: '700',
                              },
                            ]}
                          >
                            {translate('add_to_route', 'Rotama Ekle')}
                          </Text>
                        </>
                      )}
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  modalContentWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  cityPillsSection: {
    marginBottom: 14,
  },
  cityPillsScroll: {
    paddingRight: 8,
    gap: 8,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  cityChipFlag: {
    fontSize: 13,
    marginRight: 6,
  },
  cityChipText: {
    fontSize: 13,
  },
  tripCityTag: {
    marginLeft: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  cityInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  cityInfoFlag: {
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 4,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  placesList: {
    gap: 12,
  },
  placeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  placeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  placeCardTitleWrap: {
    flex: 1,
  },
  placeCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  placeCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 4,
  },
  placeCityFlag: {
    fontSize: 11,
  },
  placeCityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  placeDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  placeActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  addBtnActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addBtnDisabled: {
    borderWidth: 1,
  },
  addBtnText: {
    fontSize: 12,
  },
  emptySearchState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptySearchTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySearchSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
