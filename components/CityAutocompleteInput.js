import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import { X, Sparkles, Check } from 'lucide-react-native';
import destinationsModule, {
  searchDestinations as namedSearchDestinations,
  getAllDestinations as namedGetAllDestinations,
} from '../data/destinations';

// Safe resolver supporting ES modules, Metro bundler and CommonJS
const searchDestinations =
  namedSearchDestinations ||
  destinationsModule?.searchDestinations ||
  destinationsModule?.default?.searchDestinations;

const getAllDestinations =
  namedGetAllDestinations ||
  destinationsModule?.getAllDestinations ||
  destinationsModule?.default?.getAllDestinations;

const POPULAR_CITY_IDS = ['istanbul-tr', 'rome-it', 'paris-fr', 'tokyo-jp', 'antalya-tr'];

/**
 * CityAutocompleteInput
 *
 * Polished, high-performance offline city autocomplete input matching the
 * Simple Logbook minimalist design system.
 *
 * Props:
 * - value: string
 * - onChangeText: (text: string) => void
 * - placeholder: string
 * - theme: Theme object
 * - t: Translation function (key: string) => string
 * - containerStyle?: ViewStyle
 */
export default function CityAutocompleteInput({
  value = '',
  onChangeText,
  placeholder,
  theme,
  t,
  containerStyle,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownDismissed, setDropdownDismissed] = useState(false);
  const blurTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Load curated popular destination suggestions
  const popularCities = useMemo(() => {
    try {
      const all = typeof getAllDestinations === 'function' ? getAllDestinations() : [];
      if (!Array.isArray(all) || all.length === 0) return [];

      const matched = POPULAR_CITY_IDS.map((id) => all.find((d) => d.id === id)).filter(Boolean);
      if (matched.length >= 4) {
        return matched;
      }
      return all.slice(0, 5);
    } catch {
      return [];
    }
  }, []);

  // Filter live matching cities based on input text
  const searchResults = useMemo(() => {
    const query = (value || '').trim();
    if (!query) return [];
    if (typeof searchDestinations !== 'function') return [];
    try {
      return searchDestinations(query, 6);
    } catch {
      return [];
    }
  }, [value]);

  const isQueryEmpty = !(value || '').trim();

  // Show dropdown when focused and not manually dismissed
  const showDropdown =
    isFocused &&
    !dropdownDismissed &&
    ((isQueryEmpty && popularCities.length > 0) || (!isQueryEmpty && searchResults.length > 0));

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setDropdownDismissed(false);
    setIsFocused(true);
  };

  const handleBlur = () => {
    // 200ms delay ensures taps on dropdown items or chips register before unmounting
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleTextChange = (text) => {
    if (dropdownDismissed) {
      setDropdownDismissed(false);
    }
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleSelect = (item) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    const formatted = `${item.city}, ${item.country}`;
    if (onChangeText) {
      onChangeText(formatted);
    }
    setDropdownDismissed(true);
    setIsFocused(false);
    Keyboard.dismiss();
    inputRef.current?.blur();
  };

  const handleClear = () => {
    if (onChangeText) {
      onChangeText('');
    }
    setDropdownDismissed(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={[styles.rootContainer, containerStyle]}>
      {/* Input Box */}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme?.inputBg || '#FFFFFF',
            borderColor: isFocused
              ? theme?.textPrimary || '#18181B'
              : theme?.border || '#E4E4E7',
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={[
            styles.textInput,
            {
              color: theme?.textPrimary || '#09090B',
            },
          ]}
          placeholder={placeholder || (t ? t('placeholder_city') : 'Örn: Antalya, Kaş')}
          placeholderTextColor={theme?.textMuted || '#71717A'}
          value={value}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={() => {
            setDropdownDismissed(true);
            setIsFocused(false);
          }}
        />

        {Boolean(value && value.length > 0) && (
          <Pressable
            onPress={handleClear}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.clearBtn}
            accessibilityLabel="Clear city input"
          >
            <X size={14} color={theme?.textMuted || '#71717A'} strokeWidth={2.2} />
          </Pressable>
        )}
      </View>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme?.card || '#FFFFFF',
              borderColor: theme?.border || '#E4E4E7',
            },
          ]}
        >
          {isQueryEmpty ? (
            /* Quick Popular Cities Chips */
            <View style={styles.quickSection}>
              <View
                style={[
                  styles.quickHeader,
                  { borderBottomColor: theme?.borderMuted || theme?.border || '#F4F4F5' },
                ]}
              >
                <Sparkles size={12} color={theme?.textMuted || '#71717A'} strokeWidth={2} />
                <Text style={[styles.quickHeaderTitle, { color: theme?.textMuted || '#71717A' }]}>
                  {t ? t('popular_cities_badge') || 'Popüler Şehirler' : 'Popüler Şehirler'}
                </Text>
              </View>
              <View style={styles.chipsRow}>
                {popularCities.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSelect(item)}
                    style={({ pressed }) => [
                      styles.chip,
                      {
                        backgroundColor: theme?.cardMuted || theme?.btnSecondaryBg || '#F4F4F5',
                        borderColor: theme?.border || '#E4E4E7',
                      },
                      pressed && {
                        backgroundColor: theme?.border || '#E4E4E7',
                        opacity: 0.8,
                      },
                    ]}
                  >
                    <Text style={styles.chipFlag}>{item.flag}</Text>
                    <Text
                      style={[
                        styles.chipCity,
                        { color: theme?.textPrimary || '#09090B' },
                      ]}
                      numberOfLines={1}
                    >
                      {item.city}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            /* Live Filtered Search Results */
            <ScrollView
              style={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {searchResults.map((item, index) => {
                const isSelected =
                  value &&
                  (value.trim().toLowerCase() === `${item.city}, ${item.country}`.toLowerCase() ||
                    value.trim().toLowerCase() === item.city.toLowerCase());

                return (
                  <Pressable
                    key={item.id || `${item.city}-${index}`}
                    onPress={() => handleSelect(item)}
                    style={({ pressed }) => [
                      styles.resultItem,
                      index > 0 && {
                        borderTopWidth: StyleSheet.hairlineWidth,
                        borderTopColor: theme?.borderMuted || theme?.border || '#F4F4F5',
                      },
                      pressed && {
                        backgroundColor: theme?.cardMuted || theme?.btnSecondaryBg || '#F4F4F5',
                      },
                    ]}
                  >
                    <Text style={styles.resultFlag}>{item.flag || '📍'}</Text>
                    <View style={styles.resultDetails}>
                      <Text
                        style={[
                          styles.resultCity,
                          { color: theme?.textPrimary || '#09090B' },
                        ]}
                        numberOfLines={1}
                      >
                        {item.city}
                        <Text style={[styles.resultCountry, { color: theme?.textMuted || '#71717A' }]}>
                          {', ' + item.country}
                        </Text>
                      </Text>
                    </View>
                    {isSelected && (
                      <Check
                        size={14}
                        color={theme?.textPrimary || '#09090B'}
                        strokeWidth={2.4}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    position: 'relative',
    zIndex: 100,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingRight: 6,
  },
  clearBtn: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  // Popular Cities Section
  quickSection: {
    padding: 8,
  },
  quickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 4,
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  quickHeaderTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipFlag: {
    fontSize: 13,
  },
  chipCity: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Filtered Results List
  resultsList: {
    maxHeight: 210,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  resultFlag: {
    fontSize: 16,
  },
  resultDetails: {
    flex: 1,
  },
  resultCity: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultCountry: {
    fontSize: 12,
    fontWeight: '400',
  },
});
