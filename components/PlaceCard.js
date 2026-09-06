import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import {
  Compass,
  Utensils,
  Coffee,
  ShoppingBag,
  Camera,
  MapPin,
  Calendar,
  Trash2,
} from 'lucide-react-native';
import { useSettings } from '../contexts/SettingsContext';
import { translatePlaceCategory } from '../utils/translations';

const getCategoryConfig = (category, isDark, language) => {
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

function PlaceCard({ place, onDelete, onPress }) {
  const { theme, t, isDark, language } = useSettings();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const config = getCategoryConfig(place.category, isDark, language);
  const IconComponent = config.Icon;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      speed: 50,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 50,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={() => onPress && onPress(place)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardContent}
      >
        {/* Top meta row: Category badge & Actions */}
        <View style={styles.topRow}>
          <View style={[styles.categoryBadge, { backgroundColor: config.bg }]}>
            <IconComponent size={13} color={config.color} strokeWidth={2.2} />
            <Text style={[styles.categoryText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>

          <View style={styles.rightActions}>
            {place.date ? (
              <View style={[styles.dateChip, { backgroundColor: theme.btnSecondaryBg }]}>
                <Calendar size={11} color={theme.textMuted} strokeWidth={2} />
                <Text style={[styles.dateChipText, { color: theme.textMuted }]}>
                  {place.date}
                </Text>
              </View>
            ) : null}

            {onDelete && (
              <Pressable
                onPress={() => onDelete(place.id)}
                hitSlop={8}
                accessibilityLabel={t('delete')}
                style={({ pressed }) => [
                  styles.deleteBtn,
                  { backgroundColor: theme.btnSecondaryBg },
                  pressed && { backgroundColor: isDark ? '#450A0A' : '#FFE4E6' },
                ]}
              >
                <Trash2 size={15} color={isDark ? '#F87171' : '#94A3B8'} strokeWidth={2} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Place Name */}
        <Text style={[styles.placeName, { color: theme.textPrimary }]}>
          {place.name}
        </Text>

        {/* Notes (Travel notebook style) */}
        {place.notes ? (
          <View
            style={[
              styles.notesBox,
              {
                backgroundColor: theme.cardMuted,
                borderLeftColor: isDark ? theme.border : theme.btnPrimaryBg,
              },
            ]}
          >
            <Text style={[styles.notesText, { color: theme.textSecondary }]}>
              {place.notes}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dateChipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  deleteBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeName: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 4,
  },
  notesBox: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 2.5,
  },
  notesText: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export default React.memo(PlaceCard);
