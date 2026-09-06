import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { MapPin, Calendar, ChevronRight, Trash2 } from 'lucide-react-native';
import BudgetProgress from './BudgetProgress';
import { useSettings } from '../contexts/SettingsContext';
import { formatDateRange as formatWithLocale } from '../utils/translations';

// Keep export for backward compatibility
export const formatDateRange = (start, end, lang = 'tr') => {
  return formatWithLocale(start, end, lang);
};

export default function TripCard({
  trip,
  stats = { totalSpent: 0, percent: 0 },
  onPress,
  onDelete,
}) {
  const { theme, t, isDark, language } = useSettings();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      speed: 60,
      bounciness: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 60,
      bounciness: 3,
      useNativeDriver: true,
    }).start();
  };

  const dateText = formatDateRange(trip.startDate, trip.endDate, language);

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
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardContent}
        android_ripple={{ color: theme.btnSecondaryBg }}
      >
        {/* Card Header: Title & Delete */}
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
              {trip.title}
            </Text>
            {trip.city ? (
              <View style={styles.cityRow}>
                <MapPin size={12} color={theme.textMuted} strokeWidth={2} />
                <Text style={[styles.cityText, { color: theme.textSecondary }]} numberOfLines={1}>
                  {trip.city}
                </Text>
              </View>
            ) : null}
          </View>

          {onDelete && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                onDelete(trip);
              }}
              hitSlop={8}
              accessibilityLabel={t('delete')}
              style={({ pressed }) => [
                styles.deleteBtn,
                { backgroundColor: theme.btnSecondaryBg },
                pressed && { backgroundColor: isDark ? '#450A0A' : '#FEE2E2' },
              ]}
            >
              <Trash2 size={15} color={isDark ? '#F87171' : '#A1A1AA'} strokeWidth={1.8} />
            </Pressable>
          )}
        </View>

        {/* Date Row */}
        {dateText ? (
          <View style={styles.dateRow}>
            <Calendar size={12} color={theme.textMuted} strokeWidth={2} />
            <Text style={[styles.dateText, { color: theme.textMuted }]}>{dateText}</Text>
          </View>
        ) : null}

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.borderMuted }]} />

        {/* Compact Budget Progress */}
        <BudgetProgress
          compact
          budget={trip.budget || 0}
          totalSpent={stats?.totalSpent || 0}
          currency={trip.currency || '₺'}
        />

        {/* Card Footer: Detail Link */}
        <View style={[styles.footerRow, { borderTopColor: theme.borderMuted }]}>
          <Text style={[styles.footerHint, { color: theme.textMuted }]}>
            {stats?.expenseCount
              ? `${stats.expenseCount} ${t('expenses').toLowerCase()}`
              : t('places_tab')}
          </Text>
          <View style={[styles.chevronWrap, { backgroundColor: theme.btnSecondaryBg }]}>
            <ChevronRight size={14} color={theme.textPrimary} strokeWidth={2.4} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  footerHint: {
    fontSize: 11,
    fontWeight: '500',
  },
  chevronWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
