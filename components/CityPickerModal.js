import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Search, MapPin, Check, Sparkles, X, AlertCircle } from 'lucide-react-native';
import ModalSheet from './ModalSheet';
import {
  getPopularCitiesForCountry,
  searchCitiesInCountryOSM,
} from '../utils/geoService';

export default function CityPickerModal({
  visible = false,
  onClose,
  country = null, // { code, name, flag }
  selectedCity = '',
  onSelectCity,
  theme,
  t,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [osmResults, setOsmResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Popular curated cities for this selected country
  const popularCities = useMemo(() => {
    if (!country?.code) return [];
    return getPopularCitiesForCountry(country.code);
  }, [country]);

  // When search query changes, trigger scoped OSM Nominatim search
  useEffect(() => {
    if (!country?.code || !searchQuery.trim() || searchQuery.trim().length < 2) {
      setOsmResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchCitiesInCountryOSM(searchQuery.trim(), country.code, 10);
        setOsmResults(results);
      } catch (err) {
        console.warn('OSM search error:', err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, country]);

  const handleSelect = (cityName) => {
    if (onSelectCity) {
      onSelectCity(cityName);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title={country ? `${country.flag} ${t('select_city', 'Şehir / İlçe Seçin')}` : t('select_city', 'Şehir / İlçe Seçin')}
      subtitle={country ? `${country.name} içerisindeki rotanızı belirleyin` : ''}
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
            placeholder={
              country
                ? `${country.name} içinde şehir veya ilçe ara...`
                : t('search_city', 'Şehir ara...')
            }
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {loading && <ActivityIndicator size="small" color={theme.textPrimary} />}
          {searchQuery.length > 0 && !loading && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={14} color={theme.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Quick Popular Cities for this country */}
        {searchQuery.length === 0 && popularCities.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={12} color={theme.textMuted} strokeWidth={2.2} />
              <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                {country?.name} — {t('popular_cities', 'Popüler Turistik Şehirler')}
              </Text>
            </View>
            <View style={styles.chipsWrap}>
              {popularCities.map((cityName) => {
                const isSelected = selectedCity.toLowerCase() === cityName.toLowerCase();
                return (
                  <Pressable
                    key={cityName}
                    onPress={() => handleSelect(cityName)}
                    style={[
                      styles.cityChip,
                      {
                        backgroundColor: isSelected ? theme.btnPrimaryBg : theme.btnSecondaryBg,
                        borderColor: isSelected ? theme.btnPrimaryBg : theme.border,
                      },
                    ]}
                  >
                    <MapPin
                      size={12}
                      color={isSelected ? theme.btnPrimaryText : theme.textMuted}
                      strokeWidth={2}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? theme.btnPrimaryText : theme.textPrimary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {cityName}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Live OpenStreetMap Search Results */}
        {searchQuery.trim().length >= 2 ? (
          <View style={styles.resultsWrap}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted, marginBottom: 4 }]}>
              OpenStreetMap Arama Sonuçları ({country?.code})
            </Text>
            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="small" color={theme.textPrimary} />
                <Text style={[styles.statusText, { color: theme.textMuted }]}>
                  {country?.name} haritası taranıyor...
                </Text>
              </View>
            ) : osmResults.length === 0 ? (
              <View style={styles.centerBox}>
                <AlertCircle size={24} color={theme.textMuted} strokeWidth={1.8} />
                <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                  "{searchQuery}" ile eşleşen şehir bulunamadı.
                </Text>
                {/* Fallback to allow custom city name */}
                <Pressable
                  onPress={() => handleSelect(searchQuery.trim())}
                  style={[styles.customCityBtn, { backgroundColor: theme.btnPrimaryBg }]}
                >
                  <Text style={[styles.customCityBtnText, { color: theme.btnPrimaryText }]}>
                    "{searchQuery.trim()}" Olarak Ekle
                  </Text>
                </Pressable>
              </View>
            ) : (
              <FlatList
                data={osmResults}
                keyExtractor={(item) => item.id}
                style={styles.resultsList}
                contentContainerStyle={styles.resultsListContent}
                renderItem={({ item }) => {
                  const isSelected = selectedCity.toLowerCase() === item.name.toLowerCase();
                  return (
                    <Pressable
                      onPress={() => handleSelect(item.name)}
                      style={({ pressed }) => [
                        styles.cityRow,
                        {
                          backgroundColor: isSelected ? theme.btnSecondaryBg : theme.card,
                          borderColor: theme.border,
                        },
                        pressed && { opacity: 0.75 },
                      ]}
                    >
                      <View style={styles.cityRowLeft}>
                        <MapPin size={15} color={theme.textPrimary} strokeWidth={2} />
                        <View style={styles.cityRowText}>
                          <Text style={[styles.cityName, { color: theme.textPrimary }]}>
                            {item.name}
                          </Text>
                          {item.subtitle ? (
                            <Text style={[styles.citySubtitle, { color: theme.textMuted }]} numberOfLines={1}>
                              {item.subtitle}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                      {isSelected && (
                        <View style={[styles.checkCircle, { backgroundColor: theme.btnPrimaryBg }]}>
                          <Check size={12} color={theme.btnPrimaryText} strokeWidth={2.6} />
                        </View>
                      )}
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        ) : null}
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
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  resultsWrap: {
    flex: 1,
    gap: 6,
  },
  resultsList: {
    flex: 1,
  },
  resultsListContent: {
    gap: 6,
    paddingBottom: 20,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    borderWidth: 1,
  },
  cityRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  cityRowText: {
    flex: 1,
    gap: 2,
  },
  cityName: {
    fontSize: 13,
    fontWeight: '600',
  },
  citySubtitle: {
    fontSize: 11,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBox: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 12,
  },
  customCityBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  customCityBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
