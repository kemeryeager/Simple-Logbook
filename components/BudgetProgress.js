import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { Wallet, AlertCircle, CheckCircle2, Pencil } from 'lucide-react-native';
import { useSettings } from '../contexts/SettingsContext';
import { formatCurrency as formatCurrencyWithLocale } from '../utils/translations';

// Export formatCurrency for backward compatibility
export const formatCurrency = (amount, currency = '₺', lang = 'tr') => {
  return formatCurrencyWithLocale(amount, currency, lang);
};

function BudgetProgress({
  budget = 0,
  totalSpent = 0,
  currency = '₺',
  compact = false,
  onEditBudget,
  style,
}) {
  const { theme, t, isDark, language } = useSettings();
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

  // Themed colors
  const barColor = isOver
    ? '#E11D48'
    : isWarning
    ? '#D97706'
    : theme.btnPrimaryBg;

  const badgeBg = isOver
    ? isDark
      ? '#4C0519'
      : '#FFE4E6'
    : isWarning
    ? isDark
      ? '#451A03'
      : '#FEF3C7'
    : theme.btnSecondaryBg;

  const badgeTextColor = isOver
    ? isDark
      ? '#FECDD3'
      : '#9F1239'
    : isWarning
    ? isDark
      ? '#FDE68A'
      : '#92400E'
    : theme.textSecondary;

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const formattedSpent = formatCurrency(safeSpent, currency, language);
  const formattedBudget = formatCurrency(safeBudget, currency, language);

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <View style={styles.compactHeader}>
          <Text style={[styles.compactSpentText, { color: theme.textPrimary }]}>
            {formattedSpent}
            <Text style={[styles.compactBudgetText, { color: theme.textMuted }]}>
              {' '}
              / {formattedBudget}
            </Text>
          </Text>
          <View style={[styles.badgePill, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              %{percent}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.compactTrack,
            { backgroundColor: isDark ? '#27272A' : '#F4F4F5' },
          ]}
        >
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
    <View
      style={[
        styles.fullCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <View style={[styles.iconCircle, { backgroundColor: theme.btnSecondaryBg }]}>
            <Wallet size={16} color={theme.textPrimary} strokeWidth={2} />
          </View>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            {t('budget_status')}
          </Text>
        </View>

        <View style={styles.headerRightActions}>
          <View style={[styles.badgePill, { backgroundColor: badgeBg }]}>
            {isOver ? (
              <AlertCircle size={12} color={badgeTextColor} style={{ marginRight: 4 }} />
            ) : (
              <CheckCircle2 size={12} color={badgeTextColor} style={{ marginRight: 4 }} />
            )}
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {isOver
                ? t('budget_exceeded_badge', { percent })
                : t('budget_spent_badge', { percent })}
            </Text>
          </View>

          {onEditBudget && (
            <Pressable
              onPress={onEditBudget}
              style={({ pressed }) => [
                styles.editBudgetBtn,
                { backgroundColor: theme.btnSecondaryBg },
                pressed && { opacity: 0.75 },
              ]}
              hitSlop={8}
            >
              <Pencil size={13} color={theme.textSecondary} strokeWidth={2.2} />
              <Text style={[styles.editBudgetBtnText, { color: theme.textSecondary }]}>
                {t('edit')}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Progress Track */}
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: isDark ? '#27272A' : '#F4F4F5' },
        ]}
      >
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
      <View
        style={[
          styles.statsGrid,
          {
            backgroundColor: theme.cardMuted,
            borderColor: theme.borderMuted,
          },
        ]}
      >
        <View style={styles.statColumn}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>
            {t('target_budget')}
          </Text>
          <Text style={[styles.statValueBold, { color: theme.textPrimary }]}>
            {formattedBudget}
          </Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

        <View style={styles.statColumn}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>
            {t('spent')}
          </Text>
          <Text
            style={[
              styles.statValueBold,
              { color: isOver ? '#E11D48' : theme.textPrimary },
            ]}
          >
            {formattedSpent}
          </Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

        <View style={styles.statColumn}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>
            {isOver ? t('over_budget') : t('remaining')}
          </Text>
          <Text
            style={[
              styles.statValueBold,
              {
                color: isOver
                  ? '#E11D48'
                  : isDark
                  ? '#4ADE80'
                  : '#15803D',
              },
            ]}
          >
            {formatCurrency(Math.abs(remaining), currency, language)}
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
  },
  compactBudgetText: {
    fontSize: 12,
    fontWeight: '500',
  },
  compactTrack: {
    height: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  compactBar: {
    height: '100%',
    borderRadius: 999,
  },

  // Full Card Styles
  fullCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editBudgetBtnText: {
    fontSize: 11,
    fontWeight: '600',
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
    borderRadius: 12,
    borderWidth: 1,
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
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValueBold: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default React.memo(BudgetProgress);
