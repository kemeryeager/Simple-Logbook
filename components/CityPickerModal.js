import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Search, MapPin, Check, X, AlertCircle } from 'lucide-react-native';
import ModalSheet from './ModalSheet';
import {
  fetchAllCitiesForCountry,
  filterAndRankCities,
} from '../utils/geoService';

export default function CityPickerModal({
  visible = false,
  onClose,
  country = null, // { code, name, flag, nameEn }
  selectedCity = '',
  onSelectCity,
  theme,
  t,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all cities and districts for the country when opened
  useEffect(() => {
    if (!visible || !country?.code) {
      setSearchQuery('');
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetchAllCitiesForCountry(country)
      .then((cities) => {
        if (isMounted) {
          setAllCities(cities || []);
        }
      })
      .catch((err) => {
        console.warn('Error fetching cities:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [visible, country]);

  // Ranked and filtered cities
  const displayedCities = useMemo(() => {
    return filterAndRankCities(allCities, searchQuery);
  }, [allCities, searchQuery]);

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
                : t('search_city', 'Şehir veya ilçe ara...')
            }
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={14} color={theme.textMuted} />
            </Pressable>
          )}
        </View>

        {/* City and District List */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="small" color={theme.textPrimary} />
            <Text style={[styles.statusText, { color: theme.textMuted }]}>
              {country?.name} şehir ve ilçeleri yükleniyor...
            </Text>
          </View>
        ) : displayedCities.length === 0 ? (
          <View style={styles.centerBox}>
            <AlertCircle size={24} color={theme.textMuted} strokeWidth={1.8} />
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              {searchQuery.trim()
                ? `"${searchQuery}" ile eşleşen şehir veya ilçe bulunamadı.`
                : 'Şehir ve ilçe listesi bulunamadı.'}
            </Text>
            {searchQuery.trim().length > 0 && (
              <Pressable
                onPress={() => handleSelect(searchQuery.trim())}
                style={[styles.customCityBtn, { backgroundColor: theme.btnPrimaryBg }]}
              >
                <Text style={[styles.customCityBtnText, { color: theme.btnPrimaryText }]}>
                  "{searchQuery.trim()}" Olarak Ekle
                </Text>
              </Pressable>
            )}
          </View>
        ) : (
          <FlatList
            data={displayedCities}
            keyExtractor={(item, index) => `${item}_${index}`}
            style={styles.resultsList}
            contentContainerStyle={styles.resultsListContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isSelected = selectedCity.toLowerCase() === item.toLowerCase();
              return (
                <Pressable
                  onPress={() => handleSelect(item)}
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
                    <Text style={[styles.cityName, { color: theme.textPrimary }]}>
                      {item}
                    </Text>
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
    paddingVertical: 10,
    borderRadius: 9,
    borderWidth: 1,
  },
  cityRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  cityName: {
    fontSize: 13,
    fontWeight: '600',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBox: {
    paddingVertical: 36,
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
    marginTop: 6,
  },
  customCityBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
