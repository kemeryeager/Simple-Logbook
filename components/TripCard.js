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

export const formatDateRange = (start, end) => {
  if (!start && !end) return '';
  const months = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
  ];

  const parse = (d) => {
    if (!d || typeof d !== 'string') return null;
    const parts = d.split('-');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[2], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[0];
    return { day, month: months[monthIndex] || parts[1], year };
  };

  const s = parse(start);
  const e = parse(end);

  if (s && e) {
    if (s.year === e.year) {
      if (s.month === e.month) {
        return `${s.day} - ${e.day} ${s.month} ${s.year}`;
      }
      return `${s.day} ${s.month} - ${e.day} ${e.month} ${s.year}`;
    }
    return `${s.day} ${s.month} ${s.year} - ${e.day} ${e.month} ${e.year}`;
  }

  if (s) return `${s.day} ${s.month} ${s.year}`;
  if (e) return `${e.day} ${e.month} ${e.year}`;
  return start || end || '';
};

export default function TripCard({
  trip,
  stats = { totalSpent: 0, percent: 0 },
  onPress,
  onDelete,
}) {
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

  const dateText = formatDateRange(trip.startDate, trip.endDate);

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardContent}
        android_ripple={{ color: '#F4F4F5' }}
      >
        {/* Card Header: Title & Delete */}
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {trip.title}
            </Text>
            {trip.city ? (
              <View style={styles.cityRow}>
                <MapPin size={12} color="#71717A" strokeWidth={2} />
                <Text style={styles.cityText} numberOfLines={1}>
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
              style={({ pressed }) => [
                styles.deleteBtn,
                pressed && { backgroundColor: '#FEE2E2' },
              ]}
            >
              <Trash2 size={15} color="#A1A1AA" strokeWidth={1.8} />
            </Pressable>
          )}
        </View>

        {/* Date Row */}
        {dateText ? (
          <View style={styles.dateRow}>
            <Calendar size={12} color="#71717A" strokeWidth={2} />
            <Text style={styles.dateText}>{dateText}</Text>
          </View>
        ) : null}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Compact Budget Progress */}
        <BudgetProgress
          compact
          budget={trip.budget || 0}
          totalSpent={stats?.totalSpent || 0}
          currency={trip.currency || '₺'}
        />

        {/* Card Footer: Detail Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerHint}>
            {stats?.expenseCount
              ? `${stats.expenseCount} harcama kaydı`
              : 'Detayları ve notları gör'}
          </Text>
          <View style={styles.chevronWrap}>
            <ChevronRight size={14} color="#18181B" strokeWidth={2.4} />
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
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
    color: '#09090B',
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
    color: '#52525B',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F5',
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
    color: '#71717A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F4F4F5',
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  footerHint: {
    fontSize: 11,
    fontWeight: '500',
    color: '#71717A',
  },
  chevronWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
