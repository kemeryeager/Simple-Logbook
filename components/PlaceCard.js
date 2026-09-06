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

const getCategoryConfig = (category) => {
  const cat = (category || '').toLowerCase();

  if (cat.includes('doğa') || cat.includes('plaj') || cat.includes('deniz')) {
    return {
      Icon: Compass,
      color: '#0D9488',
      bg: '#CCFBF1',
      label: category || 'Doğa / Plaj',
    };
  }
  if (cat.includes('tarih') || cat.includes('antik') || cat.includes('kale')) {
    return {
      Icon: Camera,
      color: '#D97706',
      bg: '#FEF3C7',
      label: category || 'Tarihi Yer',
    };
  }
  if (cat.includes('müze') || cat.includes('kültür') || cat.includes('sanat')) {
    return {
      Icon: Camera,
      color: '#7C3AED',
      bg: '#EDE9FE',
      label: category || 'Müze / Kültür',
    };
  }
  if (cat.includes('kafe') || cat.includes('restoran') || cat.includes('yeme') || cat.includes('kahve')) {
    return {
      Icon: cat.includes('kahve') || cat.includes('kafe') ? Coffee : Utensils,
      color: '#EA580C',
      bg: '#FFEDD5',
      label: category || 'Kafe & Restoran',
    };
  }
  if (cat.includes('alışveriş') || cat.includes('avm') || cat.includes('çarşı')) {
    return {
      Icon: ShoppingBag,
      color: '#0284C7',
      bg: '#E0F2FE',
      label: category || 'Alışveriş',
    };
  }

  return {
    Icon: MapPin,
    color: '#475569',
    bg: '#F1F5F9',
    label: category || 'Genel Gezi',
  };
};

export default function PlaceCard({ place, onDelete, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const config = getCategoryConfig(place.category);
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
              <View style={styles.dateChip}>
                <Calendar size={11} color="#64748B" strokeWidth={2} />
                <Text style={styles.dateChipText}>{place.date}</Text>
              </View>
            ) : null}

            {onDelete && (
              <Pressable
                onPress={() => onDelete(place.id)}
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
        </View>

        {/* Place Name */}
        <Text style={styles.placeName}>{place.name}</Text>

        {/* Notes (Travel notebook style) */}
        {place.notes ? (
          <View style={styles.notesBox}>
            <Text style={styles.notesText}>{place.notes}</Text>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
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
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dateChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#71717A',
  },
  deleteBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F5',
  },
  placeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    lineHeight: 21,
    marginBottom: 4,
  },
  notesBox: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderLeftWidth: 2.5,
    borderLeftColor: '#18181B',
  },
  notesText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#52525B',
  },
});
