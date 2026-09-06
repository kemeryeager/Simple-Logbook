import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Wallet, AlertCircle, CheckCircle2 } from 'lucide-react-native';

export const formatCurrency = (amount, currency = '₺') => {
  const num = Number(amount) || 0;
  return `${num.toLocaleString('tr-TR')} ${currency}`;
};

export default function BudgetProgress({
  budget = 0,
  totalSpent = 0,
  currency = '₺',
  compact = false,
  style,
}) {
  const safeBudget = Number(budget) || 0;
  const safeSpent = Number(totalSpent) || 0;
  const remaining = safeBudget - safeSpent;
  const percent = safeBudget > 0 ? Math.round((safeSpent / safeBudget) * 100) : 0;
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  // Animated width percentage
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedPercent,
      duration: 650,
      useNativeDriver: false, // width percentage requires JS layout driver
    }).start();
  }, [clampedPercent]);

  // Color selection based on budget consumption
  const isOver = safeBudget > 0 && safeSpent > safeBudget;
  const isWarning = safeBudget > 0 && percent >= 80 && !isOver;

  const barColor = isOver ? '#E11D48' : isWarning ? '#D97706' : '#0284C7';
  const badgeBg = isOver ? '#FFE4E6' : isWarning ? '#FEF3C7' : '#E0F2FE';
  const badgeTextColor = isOver ? '#9F1239' : isWarning ? '#92400E' : '#0369A1';

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <View style={styles.compactHeader}>
          <Text style={styles.compactSpentText}>
            {formatCurrency(safeSpent, currency)}
            <Text style={styles.compactBudgetText}> / {formatCurrency(safeBudget, currency)}</Text>
          </Text>
          <View style={[styles.badgePill, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              %{percent}
            </Text>
          </View>
        </View>

        <View style={styles.compactTrack}>
          <Animated.View
            style={[
              styles.compactBar,
              {
                width: widthInterpolate,
                backgroundColor: barColor,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.fullCard, style]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Wallet size={18} color="#0284C7" strokeWidth={2.2} />
          </View>
          <Text style={styles.cardTitle}>Bütçe Durumu</Text>
        </View>

        <View style={[styles.badgePill, { backgroundColor: badgeBg }]}>
          {isOver ? (
            <AlertCircle size={13} color={badgeTextColor} style={{ marginRight: 4 }} />
          ) : (
            <CheckCircle2 size={13} color={badgeTextColor} style={{ marginRight: 4 }} />
          )}
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>
            {isOver ? `Bütçe Aşıldı (%${percent})` : `%${percent} Harcandı`}
          </Text>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: widthInterpolate,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>

      {/* Stats Breakdown Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Toplam Bütçe</Text>
          <Text style={styles.statValueBold}>{formatCurrency(safeBudget, currency)}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Harcanan</Text>
          <Text style={[styles.statValueBold, { color: barColor }]}>
            {formatCurrency(safeSpent, currency)}
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>{isOver ? 'Aşım Tutarı' : 'Kalan'}</Text>
          <Text
            style={[
              styles.statValueBold,
              { color: isOver ? '#E11D48' : '#059669' },
            ]}
          >
            {formatCurrency(Math.abs(remaining), currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Compact Styles
  compactContainer: {
    width: '100%',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  compactSpentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  compactBudgetText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  compactTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  compactBar: {
    height: '100%',
    borderRadius: 999,
  },

  // Full Card Styles
  fullCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 3,
  },
  statValueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
});
