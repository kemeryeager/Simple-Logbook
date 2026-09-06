import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Search,
  Plus,
  Check,
  Compass,
  MapPin,
  Coffee,
  Utensils,
  Landmark,
  Trees,
  ShoppingBag,
  Building,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react-native';
import ModalSheet from './ModalSheet';
import { geocodeCity, fetchLivePlaces, OSM_CATEGORIES } from '../utils/overpassService';

export default function ExplorePlacesModal({
  visible = false,
  onClose,
  city = '',
  existingPlaceNames = [],
  onAddPlace,
  tripStartDate = '',
  theme,
  t,
  language = 'tr',
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cityCoords, setCityCoords] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  // Detect and geocode city when modal opens
  useEffect(() => {
    if (visible) {
      setAddedIds(new Set());
      const targetCity = city?.trim() || 'Istanbul';
      initCity(targetCity);
    }
  }, [visible, city]);

  const initCity = async (cityName) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const coords = await geocodeCity(cityName);
      if (coords) {
        setCityCoords(coords);
        await loadPlacesForCategory(coords.lat, coords.lon, activeCategory);
      } else {
        setErrorMsg(t('no_guide_results', 'Şehir koordinatları bulunamadı.'));
        setPlaces([]);
      }
    } catch (err) {
      setErrorMsg(t('no_guide_results', 'Mekanlar yüklenirken bir hata oluştu.'));
    } finally {
      setLoading(false);
    }
  };

  const loadPlacesForCategory = async (lat, lon, cat, query = '') => {
    setLoading(true);
    setErrorMsg('');
    try {
      const fetched = await fetchLivePlaces(lat, lon, cat, 4000, query, 5);
      setPlaces(fetched);
    } catch (err) {
      setErrorMsg(t('no_guide_results', 'Canlı harita verisi alınamadı.'));
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (catId) => {
    setActiveCategory(catId);
    if (cityCoords) {
      loadPlacesForCategory(cityCoords.lat, cityCoords.lon, catId, searchQuery);
    }
  };

  const handleSearchCityOrPlaces = async () => {
    if (!searchQuery.trim()) {
      if (cityCoords) {
        loadPlacesForCategory(cityCoords.lat, cityCoords.lon, activeCategory, '');
      }
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      // First attempt to query places in current city matching search
      if (cityCoords) {
        await loadPlacesForCategory(cityCoords.lat, cityCoords.lon, activeCategory, searchQuery.trim());
      } else {
        const coords = await geocodeCity(searchQuery.trim());
        if (coords) {
          setCityCoords(coords);
          await loadPlacesForCategory(coords.lat, coords.lon, activeCategory, '');
        }
      }
    } catch (e) {
      setErrorMsg(t('no_guide_results', 'Arama sonuçları alınamadı.'));
    } finally {
      setLoading(false);
    }
  };

  // Filter places with search query if typed
  const displayedPlaces = useMemo(() => {
    if (!searchQuery.trim()) return places;
    const q = searchQuery.toLowerCase().trim();
    return places.filter((p) => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q));
  }, [places, searchQuery]);

  const isPlaceAdded = (place) => {
    if (addedIds.has(place.id)) return true;
    return existingPlaceNames.some(
      (existing) => existing.toLowerCase().trim() === place.name.toLowerCase().trim()
    );
  };

  const handleAdd = (place) => {
    setAddedIds((prev) => new Set(prev).add(place.id));
    if (onAddPlace) {
      onAddPlace({
        name: place.name,
        category: place.category,
        notes: place.shortDesc,
        date: tripStartDate,
      });
    }
  };

  const getCategoryIcon = (catId, color) => {
    switch (catId) {
      case 'cafe':
        return <Coffee size={14} color={color} strokeWidth={2.2} />;
      case 'restaurant':
        return <Utensils size={14} color={color} strokeWidth={2.2} />;
      case 'history':
      case 'museum':
        return <Landmark size={14} color={color} strokeWidth={2.2} />;
      case 'nature':
        return <Trees size={14} color={color} strokeWidth={2.2} />;
      case 'shopping':
        return <ShoppingBag size={14} color={color} strokeWidth={2.2} />;
      default:
        return <Compass size={14} color={color} strokeWidth={2.2} />;
    }
  };

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title={t('explore_places', 'Rehberden Keşfet')}
      subtitle={cityCoords?.city ? `${cityCoords.city}, ${cityCoords.country}` : t('explore_places_subtitle')}
      theme={theme}
      scrollable={false}
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
            },
          ]}
        >
          <Search size={15} color={theme.textMuted} strokeWidth={2} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder={t('search_destination_placeholder', 'Şehir veya mekan ara...')}
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchCityOrPlaces}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Text style={[styles.clearText, { color: theme.textMuted }]}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Category Pills (Overpass Categories) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsRow}
        >
          {OSM_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => handleCategoryPress(cat.id)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? theme.btnPrimaryBg : theme.btnSecondaryBg,
                    borderColor: isSelected ? theme.btnPrimaryBg : theme.border,
                  },
                ]}
              >
                {getCategoryIcon(
                  cat.id,
                  isSelected ? theme.btnPrimaryText : theme.textSecondary
                )}
                <Text
                  style={[
                    styles.categoryPillText,
                    {
                      color: isSelected ? theme.btnPrimaryText : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {t(cat.key, cat.id)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Live Status / Location Banner */}
        <View style={styles.statusBannerRow}>
          <View style={styles.statusBannerLeft}>
            <MapPin size={13} color={theme.textMuted} strokeWidth={2} />
            <Text style={[styles.statusBannerText, { color: theme.textMuted }]}>
              {cityCoords?.city ? `${cityCoords.city} • OpenStreetMap Canlı Veri` : 'Harita taranıyor...'}
            </Text>
          </View>
          {loading && <ActivityIndicator size="small" color={theme.textPrimary} />}
        </View>

        {/* Content List */}
        {loading && places.length === 0 ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.textPrimary} />
            <Text style={[styles.loadingText, { color: theme.textMuted }]}>
              {t('loading', 'Mekanlar haritadan canlı taranıyor...')}
            </Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.emptyBox}>
            <AlertCircle size={28} color={theme.textMuted} strokeWidth={1.8} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{errorMsg}</Text>
          </View>
        ) : displayedPlaces.length === 0 ? (
          <View style={styles.emptyBox}>
            <Compass size={28} color={theme.textMuted} strokeWidth={1.8} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t('no_guide_results', 'Bu kategoride henüz mekan bulunamadı.')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayedPlaces}
            keyExtractor={(item) => item.id}
            style={styles.placesList}
            contentContainerStyle={styles.placesListContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const added = isPlaceAdded(item);
              return (
                <View
                  style={[
                    styles.placeItemCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.placeItemLeft}>
                    <View style={styles.placeTitleRow}>
                      <Text
                        style={[styles.placeItemName, { color: theme.textPrimary }]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                    </View>
                    {item.shortDesc ? (
                      <Text
                        style={[styles.placeItemDesc, { color: theme.textMuted }]}
                        numberOfLines={2}
                      >
                        {item.shortDesc}
                      </Text>
                    ) : null}
                  </View>

                  <Pressable
                    onPress={() => !added && handleAdd(item)}
                    disabled={added}
                    style={[
                      styles.addRouteBtn,
                      added
                        ? { backgroundColor: theme.btnSecondaryBg, borderColor: theme.border }
                        : { backgroundColor: theme.btnPrimaryBg, borderColor: theme.btnPrimaryBg },
                    ]}
                  >
                    {added ? (
                      <>
                        <Check size={13} color={theme.textMuted} strokeWidth={2.4} />
                        <Text style={[styles.addRouteText, { color: theme.textMuted }]}>
                          {t('added_to_route', 'Eklendi')}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Plus size={13} color={theme.btnPrimaryText} strokeWidth={2.4} />
                        <Text style={[styles.addRouteText, { color: theme.btnPrimaryText }]}>
                          {t('add_to_route', 'Ekle')}
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>
              );
            }}
          />
        )}
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  clearText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  categoryPillsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 12,
  },
  statusBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  statusBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusBannerText: {
    fontSize: 11,
    fontWeight: '500',
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 12,
  },
  emptyBox: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
  },
  placesList: {
    flex: 1,
  },
  placesListContent: {
    gap: 8,
    paddingBottom: 20,
  },
  placeItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  placeItemLeft: {
    flex: 1,
    gap: 3,
  },
  placeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeItemName: {
    fontSize: 13,
    fontWeight: '600',
  },
  placeItemDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  addRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  addRouteText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
