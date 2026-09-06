import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { Wallet, AlertCircle, CheckCircle2, Pencil } from 'lucide-react-native';

export const formatCurrency = (amount, currency = '₺') => {
  const num = Number(amount) || 0;
  // Format with thousand separator
  const formatted = num.toLocaleString('tr-TR');
  // Position currency symbol cleanly
  return `${formatted} ${currency}`;
};

export default function BudgetProgress({
  budget = 0,
  totalSpent = 0,
  currency = '₺',
  compact = false,
  onEditBudget,
  style,
}) {
  const safeBudget = Number(budget) || 0;
  const safeSpent = Number(totalSpent) || 0;
  const remaining = safeBudget - safeSpent;
  const percent = safeBudget > 0 ? Math.round((safeSpent / safeBudget) * 100) : 0;
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedPercent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [clampedPercent]);

  const isOver = safeBudget > 0 && safeSpent > safeBudget;
  const isWarning = safeBudget > 0 && percent >= 80 && !isOver;

  // Modern, refined color scheme
  const barColor = isOver ? '#E11D48' : isWarning ? '#D97706' : '#18181B';
  const badgeBg = isOver ? '#FFE4E6' : isWarning ? '#FEF3C7' : '#F4F4F5';
  const badgeTextColor = isOver ? '#9F1239' : isWarning ? '#92400E' : '#27272A';

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
            <Wallet size={16} color="#18181B" strokeWidth={2} />
          </View>
          <Text style={styles.cardTitle}>Bütçe Durumu</Text>
        </View>

        <View style={styles.headerRightActions}>
          <View style={[styles.badgePill, { backgroundColor: badgeBg }]}>
            {isOver ? (
              <AlertCircle size={12} color={badgeTextColor} style={{ marginRight: 4 }} />
            ) : (
              <CheckCircle2 size={12} color={badgeTextColor} style={{ marginRight: 4 }} />
            )}
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {isOver ? `Bütçe Aşıldı (%${percent})` : `%${percent} Harcandı`}
            </Text>
          </View>

          {onEditBudget && (
            <Pressable
              onPress={onEditBudget}
              style={({ pressed }) => [
                styles.editBudgetBtn,
                pressed && { backgroundColor: '#E4E4E7' },
              ]}
              hitSlop={8}
            >
              <Pencil size={13} color="#52525B" strokeWidth={2.2} />
              <Text style={styles.editBudgetBtnText}>Düzenle</Text>
            </Pressable>
          )}
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
          <Text style={styles.statLabel}>Hedef Bütçe</Text>
          <Text style={styles.statValueBold}>{formatCurrency(safeBudget, currency)}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Harcanan</Text>
          <Text style={[styles.statValueBold, { color: isOver ? '#E11D48' : '#09090B' }]}>
            {formatCurrency(safeSpent, currency)}
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>{isOver ? 'Aşım' : 'Kalan'}</Text>
          <Text
            style={[
              styles.statValueBold,
              { color: isOver ? '#E11D48' : '#15803D' },
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
    color: '#09090B',
  },
  compactBudgetText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#71717A',
  },
  compactTrack: {
    height: 5,
    backgroundColor: '#F4F4F5',
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    letterSpacing: -0.2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBudgetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editBudgetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#52525B',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F4F4F5',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F4F4F5',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E4E4E7',
  },
  statLabel: {
    fontSize: 11,
    color: '#71717A',
    fontWeight: '500',
    marginBottom: 2,
  },
  statValueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#09090B',
  },
});
