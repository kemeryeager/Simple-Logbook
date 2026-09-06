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
import { formatCurrency } from './BudgetProgress';

const getExpenseCategoryConfig = (category) => {
  const cat = (category || '').toLowerCase();

  if (cat.includes('konaklama') || cat.includes('otel') || cat.includes('pansiyon')) {
    return {
      Icon: Hotel,
      color: '#4F46E5',
      bg: '#EEF2FF',
      label: 'Konaklama',
    };
  }
  if (cat.includes('ulaşım') || cat.includes('uçak') || cat.includes('bilet') || cat.includes('taksi') || cat.includes('benzin')) {
    return {
      Icon: Plane,
      color: '#0284C7',
      bg: '#E0F2FE',
      label: 'Ulaşım',
    };
  }
  if (cat.includes('yeme') || cat.includes('içme') || cat.includes('yemek') || cat.includes('kafe') || cat.includes('restoran')) {
    return {
      Icon: Utensils,
      color: '#D97706',
      bg: '#FEF3C7',
      label: 'Yeme / İçme',
    };
  }
  if (cat.includes('aktivite') || cat.includes('tur') || cat.includes('müze') || cat.includes('eğlence')) {
    return {
      Icon: Camera,
      color: '#059669',
      bg: '#DCFCE7',
      label: 'Aktivite',
    };
  }
  if (cat.includes('alışveriş') || cat.includes('hediye') || cat.includes('market')) {
    return {
      Icon: ShoppingBag,
      color: '#9333EA',
      bg: '#F3E8FF',
      label: 'Alışveriş',
    };
  }

  return {
    Icon: Wallet,
    color: '#475569',
    bg: '#F1F5F9',
    label: category || 'Diğer',
  };
};

export default function ExpenseCard({
  expense,
  currency = '₺',
  onDelete,
  onPress,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const config = getExpenseCategoryConfig(expense.category);
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
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
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
          <Text style={styles.title} numberOfLines={1}>
            {expense.title}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.categoryLabel, { color: config.color }]}>
              {config.label}
            </Text>

            {expense.date ? (
              <>
                <Text style={styles.metaDot}>•</Text>
                <View style={styles.dateRow}>
                  <Calendar size={11} color="#94A3B8" strokeWidth={2} />
                  <Text style={styles.dateText}>{expense.date}</Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        {/* Right Info: Amount & Delete Button */}
        <View style={styles.rightCol}>
          <Text style={styles.amountText}>
            -{formatCurrency(expense.amount, currency)}
          </Text>

          {onDelete && (
            <Pressable
              onPress={() => onDelete(expense.id)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.deleteBtn,
                pressed && { backgroundColor: '#FFE4E6' },
              ]}
            >
              <Trash2 size={15} color="#94A3B8" strokeWidth={2} />
            </Pressable>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1.5,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaDot: {
    marginHorizontal: 5,
    color: '#CBD5E1',
    fontSize: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  deleteBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
});
