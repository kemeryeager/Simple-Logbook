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

  const dateText = formatDateRange(trip.startDate, trip.endDate);

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardContent}
        android_ripple={{ color: '#F1F5F9' }}
      >
        {/* Card Header: Title & Delete */}
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {trip.title}
            </Text>
            {trip.city ? (
              <View style={styles.cityRow}>
                <MapPin size={13} color="#0284C7" strokeWidth={2.2} />
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
                pressed && { backgroundColor: '#FFE4E6' },
              ]}
            >
              <Trash2 size={16} color="#94A3B8" strokeWidth={2} />
            </Pressable>
          )}
        </View>

        {/* Date Row */}
        {dateText ? (
          <View style={styles.dateRow}>
            <Calendar size={13} color="#64748B" strokeWidth={2} />
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
              : 'Detayları ve yerleri gör'}
          </Text>
          <View style={styles.chevronWrap}>
            <ChevronRight size={16} color="#0284C7" strokeWidth={2.2} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  footerHint: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  chevronWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
