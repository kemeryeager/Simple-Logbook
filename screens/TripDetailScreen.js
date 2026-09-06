import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  Pressable,
  RefreshControl,
  Alert,
  Platform,
  StatusBar as RNStatusBar,
  Animated,
} from 'react-native';
import {
  ArrowLeft,
  Trash2,
  MapPin,
  Calendar,
  Wallet,
  Plus,
  Compass,
  CreditCard,
  X,
  Sparkles,
} from 'lucide-react-native';
import BudgetProgress from '../components/BudgetProgress';
import PlaceCard from '../components/PlaceCard';
import ExpenseCard from '../components/ExpenseCard';
import ModalSheet from '../components/ModalSheet';
import { formatDateRange } from '../components/TripCard';
import {
  getPlaces,
  savePlace,
  deletePlace,
  getExpenses,
  saveExpense,
  deleteExpense,
  getTripStats,
  deleteTrip,
} from '../utils/storage';

const PLACE_CATEGORIES = [
  'Doğa / Plaj',
  'Tarihi Yer',
  'Müze / Kültür',
  'Kafe & Restoran',
  'Alışveriş',
  'Diğer',
];

const EXPENSE_CATEGORIES = [
  'Konaklama',
  'Ulaşım',
  'Yeme / İçme',
  'Aktivite',
  'Alışveriş',
  'Diğer',
];

export default function TripDetailScreen({ trip, onBack, onTripDeleted }) {
  const [activeTab, setActiveTab] = useState('places'); // 'places' | 'expenses'
  const [places, setPlaces] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ totalSpent: 0, remaining: 0, percent: 0, expenseCount: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [selectedPlaceCategory, setSelectedPlaceCategory] = useState('Tümü');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('Tümü');

  // Add Place Modal State
  const [isPlaceModalVisible, setIsPlaceModalVisible] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [placeCategory, setPlaceCategory] = useState(PLACE_CATEGORIES[0]);
  const [placeNotes, setPlaceNotes] = useState('');
  const [placeDate, setPlaceDate] = useState('');
  const [placeError, setPlaceError] = useState('');

  // Add Expense Modal State
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseError, setExpenseError] = useState('');

  // FAB scale animation
  const fabScale = useRef(new Animated.Value(1)).current;

  const loadTripData = useCallback(async () => {
    if (!trip?.id) return;
    try {
      const [placesData, expensesData, statsData] = await Promise.all([
        getPlaces(trip.id),
        getExpenses(trip.id),
        getTripStats(trip.id, trip.budget),
      ]);
      setPlaces(placesData);
      setExpenses(expensesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading trip detail:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [trip?.id, trip?.budget]);

  useEffect(() => {
    loadTripData();
  }, [loadTripData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTripData();
  };

  // Place Handlers
  const handleOpenAddPlace = () => {
    setPlaceName('');
    setPlaceCategory(PLACE_CATEGORIES[0]);
    setPlaceNotes('');
    setPlaceDate(trip.startDate || new Date().toISOString().split('T')[0]);
    setPlaceError('');
    setIsPlaceModalVisible(true);
  };

  const handleSavePlace = async () => {
    if (!placeName.trim()) {
      setPlaceError('Lütfen yer veya mekan adı girin.');
      return;
    }

    try {
      await savePlace({
        tripId: trip.id,
        name: placeName.trim(),
        category: placeCategory,
        notes: placeNotes.trim(),
        date: placeDate.trim(),
      });
      setIsPlaceModalVisible(false);
      await loadTripData();
    } catch (err) {
      setPlaceError('Ziyaret yeri kaydedilemedi.');
    }
  };

  const handleDeletePlace = (placeId) => {
    Alert.alert(
      'Yeri Sil',
      'Bu gezi noktasını silmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlace(placeId);
              await loadTripData();
            } catch (err) {
              Alert.alert('Hata', 'Yer silinemedi.');
            }
          },
        },
      ]
    );
  };

  // Expense Handlers
  const handleOpenAddExpense = () => {
    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseCategory(EXPENSE_CATEGORIES[0]);
    setExpenseDate(trip.startDate || new Date().toISOString().split('T')[0]);
    setExpenseError('');
    setIsExpenseModalVisible(true);
  };

  const handleSaveExpense = async () => {
    if (!expenseTitle.trim()) {
      setExpenseError('Lütfen harcama başlığı girin.');
      return;
    }
    const parsedAmount = parseFloat(expenseAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setExpenseError('Lütfen geçerli bir tutar girin.');
      return;
    }

    try {
      await saveExpense({
        tripId: trip.id,
        title: expenseTitle.trim(),
        amount: parsedAmount,
        category: expenseCategory,
        date: expenseDate.trim(),
      });
      setIsExpenseModalVisible(false);
      await loadTripData();
    } catch (err) {
      setExpenseError('Harcama kaydedilemedi.');
    }
  };

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      'Harcamayı Sil',
      'Bu harcama kaydını silmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expenseId);
              await loadTripData();
            } catch (err) {
              Alert.alert('Hata', 'Harcama silinemedi.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteCurrentTrip = () => {
    Alert.alert(
      'Seyahati Sil',
      `"${trip.title}" seyahatini ve tüm verilerini silmek istediğinizden emin misiniz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrip(trip.id);
              if (onTripDeleted) {
                onTripDeleted(trip.id);
              } else if (onBack) {
                onBack();
              }
            } catch (err) {
              Alert.alert('Hata', 'Seyahat silinemedi.');
            }
          },
        },
      ]
    );
  };

  const handleFabPressIn = () => {
    Animated.spring(fabScale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handleFabPressOut = () => {
    Animated.spring(fabScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  // Filtered lists
  const filteredPlaces = places.filter((p) => {
    if (selectedPlaceCategory === 'Tümü') return true;
    return p.category === selectedPlaceCategory;
  });

  const filteredExpenses = expenses.filter((e) => {
    if (selectedExpenseCategory === 'Tümü') return true;
    return e.category === selectedExpenseCategory;
  });

  const dateSpan = formatDateRange(trip.startDate, trip.endDate);
  const statusBarPadding = Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 12;

  return (
    <View style={[styles.container, { paddingTop: statusBarPadding }]}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { backgroundColor: '#E2E8F0' },
          ]}
        >
          <ArrowLeft size={20} color="#0F172A" strokeWidth={2.4} />
        </Pressable>

        <View style={styles.navTitleWrap}>
          <Text style={styles.navTitle} numberOfLines={1}>
            {trip.title}
          </Text>
          {trip.city ? (
            <View style={styles.navCityRow}>
              <MapPin size={12} color="#0284C7" strokeWidth={2.2} />
              <Text style={styles.navCityText} numberOfLines={1}>
                {trip.city}
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={handleDeleteCurrentTrip}
          hitSlop={8}
          style={({ pressed }) => [
            styles.deleteTripBtn,
            pressed && { backgroundColor: '#FFE4E6' },
          ]}
        >
          <Trash2 size={18} color="#94A3B8" strokeWidth={2} />
        </Pressable>
      </View>

      <FlatList
        data={activeTab === 'places' ? filteredPlaces : filteredExpenses}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0284C7"
            colors={['#0284C7']}
          />
        }
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={
          <View>
            {/* Dates Card if available */}
            {dateSpan ? (
              <View style={styles.dateBanner}>
                <Calendar size={14} color="#0284C7" strokeWidth={2.2} />
                <Text style={styles.dateBannerText}>{dateSpan}</Text>
              </View>
            ) : null}

            {/* Budget Progress Card */}
            <View style={styles.budgetSection}>
              <BudgetProgress
                budget={trip.budget || 0}
                totalSpent={stats.totalSpent}
                currency={trip.currency || '₺'}
              />
            </View>

            {/* Segmented Tab Switcher */}
            <View style={styles.tabSwitcher}>
              <Pressable
                onPress={() => setActiveTab('places')}
                style={[
                  styles.tabButton,
                  activeTab === 'places' && styles.tabButtonActive,
                ]}
              >
                <Compass
                  size={16}
                  color={activeTab === 'places' ? '#0284C7' : '#64748B'}
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'places' && styles.tabButtonTextActive,
                  ]}
                >
                  Gezilecek Yerler
                </Text>
                <View
                  style={[
                    styles.tabBadge,
                    activeTab === 'places' && styles.tabBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      activeTab === 'places' && styles.tabBadgeTextActive,
                    ]}
                  >
                    {places.length}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('expenses')}
                style={[
                  styles.tabButton,
                  activeTab === 'expenses' && styles.tabButtonActive,
                ]}
              >
                <Wallet
                  size={16}
                  color={activeTab === 'expenses' ? '#0284C7' : '#64748B'}
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'expenses' && styles.tabButtonTextActive,
                  ]}
                >
                  Harcamalar
                </Text>
                <View
                  style={[
                    styles.tabBadge,
                    activeTab === 'expenses' && styles.tabBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      activeTab === 'expenses' && styles.tabBadgeTextActive,
                    ]}
                  >
                    {expenses.length}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Horizontal Category Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryFiltersContainer}
            >
              {activeTab === 'places'
                ? ['Tümü', ...PLACE_CATEGORIES].map((cat) => {
                    const isSelected = selectedPlaceCategory === cat;
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setSelectedPlaceCategory(cat)}
                        style={[
                          styles.filterPill,
                          isSelected && styles.filterPillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterPillText,
                            isSelected && styles.filterPillTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    );
                  })
                : ['Tümü', ...EXPENSE_CATEGORIES].map((cat) => {
                    const isSelected = selectedExpenseCategory === cat;
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setSelectedExpenseCategory(cat)}
                        style={[
                          styles.filterPill,
                          isSelected && styles.filterPillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterPillText,
                            isSelected && styles.filterPillTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    );
                  })}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => {
          if (activeTab === 'places') {
            return (
              <PlaceCard
                place={item}
                onDelete={handleDeletePlace}
              />
            );
          }
          return (
            <ExpenseCard
              expense={item}
              currency={trip.currency || '₺'}
              onDelete={handleDeleteExpense}
            />
          );
        }}
        ListEmptyComponent={
          !loading && (
            <View style={styles.tabEmptyContainer}>
              <View style={styles.tabEmptyIconWrap}>
                {activeTab === 'places' ? (
                  <Compass size={32} color="#0284C7" strokeWidth={1.8} />
                ) : (
                  <CreditCard size={32} color="#0284C7" strokeWidth={1.8} />
                )}
              </View>
              <Text style={styles.tabEmptyTitle}>
                {activeTab === 'places'
                  ? selectedPlaceCategory !== 'Tümü'
                    ? `Bu kategoride kayıtlı yer yok`
                    : 'Henüz Gezilecek Yer Eklenmedi'
                  : selectedExpenseCategory !== 'Tümü'
                  ? `Bu kategoride harcama yok`
                  : 'Henüz Harcama Kaydı Yok'}
              </Text>
              <Text style={styles.tabEmptySubtitle}>
                {activeTab === 'places'
                  ? 'Görmek istediğiniz plaj, müze veya restoranları ekleyin ve notlar alın.'
                  : 'Seyahatiniz süresince yaptığınız harcamaları kaydederek bütçenizi kontrol edin.'}
              </Text>

              <Pressable
                onPress={activeTab === 'places' ? handleOpenAddPlace : handleOpenAddExpense}
                style={styles.tabEmptyBtn}
              >
                <Plus size={16} color="#0284C7" strokeWidth={2.4} />
                <Text style={styles.tabEmptyBtnText}>
                  {activeTab === 'places' ? 'Ziyaret Yeri Ekle' : 'Harcama Ekle'}
                </Text>
              </Pressable>
            </View>
          )
        }
      />

      {/* Floating Action Button */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <Pressable
          onPress={activeTab === 'places' ? handleOpenAddPlace : handleOpenAddExpense}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          style={styles.fabButton}
        >
          <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.fabText}>
            {activeTab === 'places' ? 'Yer Ekle' : 'Harcama Ekle'}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Add Place Modal Sheet */}
      <ModalSheet
        visible={isPlaceModalVisible}
        onClose={() => setIsPlaceModalVisible(false)}
        title="Yeni Ziyaret Yeri Ekle"
        subtitle="Rotanıza yeni bir durak ve seyahat notu ekleyin"
      >
        <View style={styles.modalForm}>
          {placeError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{placeError}</Text>
            </View>
          ) : null}

          {/* Place Name */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              Yer / Mekan Adı <Text style={styles.star}>*</Text>
            </Text>
            <TextInput
              style={styles.formInput}
              placeholder="Örn: Kaputaş Plajı veya Galata Kulesi"
              placeholderTextColor="#94A3B8"
              value={placeName}
              onChangeText={(t) => {
                setPlaceName(t);
                if (placeError) setPlaceError('');
              }}
            />
          </View>

          {/* Category Chips Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Kategori</Text>
            <View style={styles.categoryGrid}>
              {PLACE_CATEGORIES.map((cat) => {
                const isSelected = placeCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setPlaceCategory(cat)}
                    style={[
                      styles.categoryChoiceChip,
                      isSelected && styles.categoryChoiceChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChoiceText,
                        isSelected && styles.categoryChoiceTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Seyahat Notları & İpuçları</Text>
            <TextInput
              style={[styles.formInput, styles.notesInput]}
              placeholder="Örn: Sabah 09:00 öncesi gitmek sakin oluyor. Girişte müze kart geçerli."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={placeNotes}
              onChangeText={setPlaceNotes}
            />
          </View>

          {/* Date */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Ziyaret Tarihi</Text>
            <TextInput
              style={styles.formInput}
              placeholder="YYYY-AA-GG"
              placeholderTextColor="#94A3B8"
              value={placeDate}
              onChangeText={setPlaceDate}
            />
          </View>

          {/* Buttons */}
          <View style={styles.modalActions}>
            <Pressable
              onPress={() => setIsPlaceModalVisible(false)}
              style={styles.modalCancelBtn}
            >
              <Text style={styles.modalCancelText}>Vazgeç</Text>
            </Pressable>
            <Pressable
              onPress={handleSavePlace}
              style={styles.modalSaveBtn}
            >
              <Text style={styles.modalSaveText}>Yeri Kaydet</Text>
            </Pressable>
          </View>
        </View>
      </ModalSheet>

      {/* Add Expense Modal Sheet */}
      <ModalSheet
        visible={isExpenseModalVisible}
        onClose={() => setIsExpenseModalVisible(false)}
        title="Yeni Harcama Ekle"
        subtitle="Bütçe takibiniz için harcama detayını kaydedin"
      >
        <View style={styles.modalForm}>
          {expenseError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{expenseError}</Text>
            </View>
          ) : null}

          {/* Expense Title */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              Harcama Başlığı <Text style={styles.star}>*</Text>
            </Text>
            <TextInput
              style={styles.formInput}
              placeholder="Örn: Akşam Yemeği veya Tekne Turu"
              placeholderTextColor="#94A3B8"
              value={expenseTitle}
              onChangeText={(t) => {
                setExpenseTitle(t);
                if (expenseError) setExpenseError('');
              }}
            />
          </View>

          {/* Amount */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              Tutar ({trip.currency || '₺'}) <Text style={styles.star}>*</Text>
            </Text>
            <TextInput
              style={styles.formInput}
              placeholder="Örn: 850"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={expenseAmount}
              onChangeText={(t) => {
                setExpenseAmount(t);
                if (expenseError) setExpenseError('');
              }}
            />
          </View>

          {/* Category Chips Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Harcama Kategorisi</Text>
            <View style={styles.categoryGrid}>
              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = expenseCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setExpenseCategory(cat)}
                    style={[
                      styles.categoryChoiceChip,
                      isSelected && styles.categoryChoiceChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChoiceText,
                        isSelected && styles.categoryChoiceTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Date */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Harcama Tarihi</Text>
            <TextInput
              style={styles.formInput}
              placeholder="YYYY-AA-GG"
              placeholderTextColor="#94A3B8"
              value={expenseDate}
              onChangeText={setExpenseDate}
            />
          </View>

          {/* Buttons */}
          <View style={styles.modalActions}>
            <Pressable
              onPress={() => setIsExpenseModalVisible(false)}
              style={styles.modalCancelBtn}
            >
              <Text style={styles.modalCancelText}>Vazgeç</Text>
            </Pressable>
            <Pressable
              onPress={handleSaveExpense}
              style={styles.modalSaveBtn}
            >
              <Text style={styles.modalSaveText}>Harcamayı Kaydet</Text>
            </Pressable>
          </View>
        </View>
      </ModalSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitleWrap: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  navCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  navCityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
  },
  deleteTripBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 90,
  },
  dateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 14,
  },
  dateBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  budgetSection: {
    marginBottom: 16,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 10,
    borderRadius: 11,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  tabBadge: {
    backgroundColor: '#CBD5E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  tabBadgeActive: {
    backgroundColor: '#E0F2FE',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  tabBadgeTextActive: {
    color: '#0284C7',
  },
  categoryFiltersContainer: {
    paddingVertical: 4,
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  tabEmptyContainer: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  tabEmptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  tabEmptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  tabEmptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  tabEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabEmptyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Modal Forms
  modalForm: {
    gap: 16,
  },
  errorBanner: {
    backgroundColor: '#FFE4E6',
    borderLeftWidth: 4,
    borderLeftColor: '#E11D48',
    padding: 10,
    borderRadius: 8,
  },
  errorBannerText: {
    color: '#9F1239',
    fontSize: 13,
    fontWeight: '500',
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  star: {
    color: '#E11D48',
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChoiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChoiceChipSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  categoryChoiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChoiceTextSelected: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  modalSaveBtn: {
    flex: 2,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#0284C7',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
