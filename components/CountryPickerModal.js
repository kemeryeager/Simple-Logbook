import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { Search, Globe, Check, Sparkles, X } from 'lucide-react-native';
import ModalSheet from './ModalSheet';
import {
  WORLD_COUNTRIES,
  POPULAR_COUNTRIES,
  searchCountries,
} from '../utils/geoService';

export default function CountryPickerModal({
  visible = false,
  onClose,
  selectedCountryCode = '',
  onSelectCountry,
  theme,
  t,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    return searchCountries(searchQuery);
  }, [searchQuery]);

  const handleSelect = (country) => {
    if (onSelectCountry) {
      onSelectCountry(country);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title={t('select_country', 'Ülke Seçin')}
      subtitle={t('select_country_subtitle', 'Seyahatinizin gerçekleşeceği ülkeyi belirleyin')}
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
            placeholder={t('search_country', 'Ülke ara (örn: Türkiye, İtalya)...')}
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

        {/* Quick Popular Country Chips */}
        {searchQuery.length === 0 && (
          <View style={styles.popularSection}>
            <View style={styles.popularHeader}>
              <Sparkles size={12} color={theme.textMuted} strokeWidth={2.2} />
              <Text style={[styles.popularTitle, { color: theme.textMuted }]}>
                {t('popular_countries', 'Popüler Ülkeler')}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularScroll}
            >
              {POPULAR_COUNTRIES.slice(0, 8).map((country) => {
                const isSelected = selectedCountryCode === country.code;
                return (
                  <Pressable
                    key={country.code}
                    onPress={() => handleSelect(country)}
                    style={[
                      styles.popularChip,
                      {
                        backgroundColor: isSelected ? theme.btnPrimaryBg : theme.btnSecondaryBg,
                        borderColor: isSelected ? theme.btnPrimaryBg : theme.border,
                      },
                    ]}
                  >
                    <Text style={styles.chipFlag}>{country.flag}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? theme.btnPrimaryText : theme.textPrimary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {country.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Full Countries List */}
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.code}
          style={styles.countriesList}
          contentContainerStyle={styles.countriesListContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selectedCountryCode === item.code;
            return (
              <Pressable
                onPress={() => handleSelect(item)}
                style={({ pressed }) => [
                  styles.countryRow,
                  {
                    backgroundColor: isSelected ? theme.btnSecondaryBg : theme.card,
                    borderColor: theme.border,
                  },
                  pressed && { opacity: 0.75 },
                ]}
              >
                <View style={styles.countryRowLeft}>
                  <Text style={styles.flagText}>{item.flag}</Text>
                  <View style={styles.countryNames}>
                    <Text style={[styles.countryName, { color: theme.textPrimary }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.countryNameEn, { color: theme.textMuted }]}>
                      {item.nameEn} ({item.code})
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: theme.btnPrimaryBg }]}>
                    <Check size={13} color={theme.btnPrimaryText} strokeWidth={2.6} />
                  </View>
                )}
              </Pressable>
            );
          }}
        />
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
  popularSection: {
    gap: 6,
  },
  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 2,
  },
  popularTitle: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  popularScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
  },
  chipFlag: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 12,
  },
  countriesList: {
    flex: 1,
  },
  countriesListContent: {
    gap: 6,
    paddingBottom: 20,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  countryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  flagText: {
    fontSize: 20,
  },
  countryNames: {
    flex: 1,
    gap: 2,
  },
  countryName: {
    fontSize: 13,
    fontWeight: '600',
  },
  countryNameEn: {
    fontSize: 11,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
