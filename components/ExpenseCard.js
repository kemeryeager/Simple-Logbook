import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import {
  Hotel,
  Plane,
  Utensils,
  Camera,
  ShoppingBag,
  Wallet,
  Calendar,
  Trash2,
} from 'lucide-react-native';
import { useSettings } from '../contexts/SettingsContext';
import {
  translateExpenseCategory,
  formatCurrency,
} from '../utils/translations';

const getExpenseCategoryConfig = (category, isDark, language) => {
  const cat = (category || '').toLowerCase();
  const label = translateExpenseCategory(category, language);

  if (
    cat.includes('konaklama') ||
    cat.includes('otel') ||
    cat.includes('pansiyon') ||
    cat.includes('stay') ||
    cat.includes('hotel')
  ) {
    return {
      Icon: Hotel,
      color: isDark ? '#818CF8' : '#4F46E5',
      bg: isDark ? '#312E814D' : '#EEF2FF',
      label,
    };
  }
  if (
    cat.includes('ulaşım') ||
    cat.includes('uçak') ||
    cat.includes('bilet') ||
    cat.includes('taksi') ||
    cat.includes('benzin') ||
    cat.includes('transit') ||
    cat.includes('transport')
  ) {
    return {
      Icon: Plane,
      color: isDark ? '#38BDF8' : '#0284C7',
      bg: isDark ? '#0C4A6E4D' : '#E0F2FE',
      label,
    };
  }
  if (
    cat.includes('yeme') ||
    cat.includes('içme') ||
    cat.includes('yemek') ||
    cat.includes('kafe') ||
    cat.includes('restoran') ||
    cat.includes('food') ||
    cat.includes('dining')
  ) {
    return {
      Icon: Utensils,
      color: isDark ? '#FBBF24' : '#D97706',
      bg: isDark ? '#78350F4D' : '#FEF3C7',
      label,
    };
  }
  if (
    cat.includes('aktivite') ||
    cat.includes('tur') ||
    cat.includes('müze') ||
    cat.includes('eğlence') ||
    cat.includes('activity')
  ) {
    return {
      Icon: Camera,
      color: isDark ? '#34D399' : '#059669',
      bg: isDark ? '#064E3B4D' : '#DCFCE7',
      label,
    };
  }
  if (
    cat.includes('alışveriş') ||
    cat.includes('hediye') ||
    cat.includes('market') ||
    cat.includes('shopping')
  ) {
    return {
      Icon: ShoppingBag,
      color: isDark ? '#C084FC' : '#9333EA',
      bg: isDark ? '#581C874D' : '#F3E8FF',
      label,
    };
  }

  return {
    Icon: Wallet,
    color: isDark ? '#A1A1AA' : '#475569',
    bg: isDark ? '#27272A' : '#F1F5F9',
    label,
  };
};

function ExpenseCard({
  expense,
  currency = '₺',
  onDelete,
  onPress,
}) {
  const { theme, t, isDark, language } = useSettings();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const config = getExpenseCategoryConfig(expense.category, isDark, language);
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
        onPress={() => onPress && onPress(expense)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardContent}
      >
        {/* Category Icon */}
        <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
          <IconComponent size={20} color={config.color} strokeWidth={2.2} />
        </View>

        {/* Middle Info */}
        <View style={styles.infoCol}>
          <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
            {expense.title}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.categoryLabel, { color: config.color }]}>
              {config.label}
            </Text>

            {expense.date ? (
              <>
                <Text style={[styles.metaDot, { color: theme.border }]}>•</Text>
                <View style={styles.dateRow}>
                  <Calendar size={11} color={theme.textMuted} strokeWidth={2} />
                  <Text style={[styles.dateText, { color: theme.textMuted }]}>
                    {expense.date}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        {/* Right Info: Amount & Delete Button */}
        <View style={styles.rightCol}>
          <Text style={[styles.amountText, { color: theme.textPrimary }]}>
            -{formatCurrency(expense.amount, currency, language)}
          </Text>

          {onDelete && (
            <Pressable
              onPress={() => onDelete(expense.id)}
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
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaDot: {
    marginHorizontal: 5,
    fontSize: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 5,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
  },
  deleteBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(ExpenseCard);
