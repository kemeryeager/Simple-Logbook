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
  FileText,
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
  updateTrip,
  WORLD_CURRENCIES,
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

export default function TripDetailScreen({
  trip,
  onBack,
  onTripDeleted,
  onTripUpdated,
}) {
  const [currentTrip, setCurrentTrip] = useState(trip);
  const [activeTab, setActiveTab] = useState('places'); // 'places' | 'expenses'
  const [places, setPlaces] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ totalSpent: 0, remaining: 0, percent: 0, expenseCount: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [selectedPlaceCategory, setSelectedPlaceCategory] = useState('Tümü');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('Tümü');

  // Edit Budget Modal State
  const [isEditBudgetModalVisible, setIsEditBudgetModalVisible] = useState(false);
  const [editBudgetAmount, setEditBudgetAmount] = useState(String(currentTrip?.budget || ''));
  const [editCurrency, setEditCurrency] = useState(currentTrip?.currency || '₺');
  const [editBudgetError, setEditBudgetError] = useState('');

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

  // Sync currentTrip when prop changes
  useEffect(() => {
    if (trip) {
      setCurrentTrip(trip);
    }
  }, [trip]);

  const loadTripData = useCallback(async (targetTrip = currentTrip) => {
    if (!targetTrip?.id) return;
    try {
      const [placesData, expensesData, statsData] = await Promise.all([
        getPlaces(targetTrip.id),
        getExpenses(targetTrip.id),
        getTripStats(targetTrip.id, targetTrip.budget),
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
  }, [currentTrip]);

  useEffect(() => {
    loadTripData();
  }, [loadTripData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTripData();
  };

  // Edit Budget Handlers
  const handleOpenEditBudget = () => {
    setEditBudgetAmount(String(currentTrip?.budget || ''));
    setEditCurrency(currentTrip?.currency || '₺');
    setEditBudgetError('');
    setIsEditBudgetModalVisible(true);
  };

  const handleSaveBudget = async () => {
    const rawBudget = parseFloat(editBudgetAmount);
    if (isNaN(rawBudget) || rawBudget < 0) {
      setEditBudgetError('Lütfen geçerli ve 0 veya üzeri bir bütçe girin.');
      return;
    }

    try {
      const updated = await updateTrip(currentTrip.id, {
        budget: rawBudget,
        currency: editCurrency || '₺',
      });
      setCurrentTrip(updated);
      setIsEditBudgetModalVisible(false);
      if (onTripUpdated) {
        onTripUpdated(updated);
      }
      await loadTripData(updated);
    } catch (err) {
      setEditBudgetError('Bütçe güncellenirken bir hata oluştu.');
    }
  };

  // Place Handlers
  const handleOpenAddPlace = () => {
    setPlaceName('');
    setPlaceCategory(PLACE_CATEGORIES[0]);
    setPlaceNotes('');
    setPlaceDate(currentTrip.startDate || new Date().toISOString().split('T')[0]);
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
        tripId: currentTrip.id,
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
    setExpenseDate(currentTrip.startDate || new Date().toISOString().split('T')[0]);
    setExpenseError('');
    setIsExpenseModalVisible(true);
  };

  const handleSaveExpense = async () => {
    if (!expenseTitle.trim()) {
      setExpenseError('Lütfen harcama başlığı girin.');
      return;
    }
    const rawAmt = parseFloat(expenseAmount);
    if (isNaN(rawAmt) || rawAmt <= 0) {
      setExpenseError("Harcama tutarı 0'dan büyük geçerli bir sayı olmalıdır.");
      return;
    }

    try {
      await saveExpense({
        tripId: currentTrip.id,
        title: expenseTitle.trim(),
        amount: rawAmt,
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
      `"${currentTrip.title}" seyahatini ve bağlı tüm verileri silmek istediğinizden emin misiniz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrip(currentTrip.id);
              if (onTripDeleted) onTripDeleted(currentTrip.id);
            } catch (err) {
              Alert.alert('Hata', 'Seyahat silinemedi.');
            }
          },
        },
      ]
    );
  };

  // Filtered Lists
  const filteredPlaces = places.filter((p) => {
    if (selectedPlaceCategory === 'Tümü') return true;
    return (p.category || '').toLowerCase() === selectedPlaceCategory.toLowerCase();
  });

  const filteredExpenses = expenses.filter((e) => {
    if (selectedExpenseCategory === 'Tümü') return true;
    return (e.category || '').toLowerCase() === selectedExpenseCategory.toLowerCase();
  });

  const handleFabPressIn = () => {
    Animated.spring(fabScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 60,
      bounciness: 3,
    }).start();
  };

  const handleFabPressOut = () => {
    Animated.spring(fabScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 60,
      bounciness: 3,
    }).start();
  };

  const dateSpan = formatDateRange(currentTrip.startDate, currentTrip.endDate);
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
            pressed && { backgroundColor: '#E4E4E7' },
          ]}
        >
          <ArrowLeft size={18} color="#09090B" strokeWidth={2.4} />
        </Pressable>

        <View style={styles.navTitleWrap}>
          <Text style={styles.navTitle} numberOfLines={1}>
            {currentTrip.title}
          </Text>
          {currentTrip.city ? (
            <View style={styles.navCityRow}>
              <MapPin size={11} color="#71717A" strokeWidth={2} />
              <Text style={styles.navCityText} numberOfLines={1}>
                {currentTrip.city}
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={handleDeleteCurrentTrip}
          hitSlop={8}
          style={({ pressed }) => [
            styles.deleteTripBtn,
            pressed && { backgroundColor: '#FEE2E2' },
          ]}
        >
          <Trash2 size={16} color="#A1A1AA" strokeWidth={2} />
        </Pressable>
      </View>

      <FlatList
        data={activeTab === 'places' ? filteredPlaces : filteredExpenses}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#18181B"
            colors={['#18181B']}
          />
        }
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={
          <View>
            {/* Dates banner if available */}
            {dateSpan ? (
              <View style={styles.dateBanner}>
                <Calendar size={13} color="#71717A" strokeWidth={2} />
                <Text style={styles.dateBannerText}>{dateSpan}</Text>
              </View>
            ) : null}

            {/* Budget Progress Card with Edit Action */}
            <View style={styles.budgetSection}>
              <BudgetProgress
                budget={currentTrip.budget || 0}
                totalSpent={stats.totalSpent}
                currency={currentTrip.currency || '₺'}
                onEditBudget={handleOpenEditBudget}
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
                  size={15}
                  color={activeTab === 'places' ? '#FFFFFF' : '#71717A'}
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
                  size={15}
                  color={activeTab === 'expenses' ? '#FFFFFF' : '#71717A'}
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
                          styles.filterChip,
                          isSelected && styles.filterChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            isSelected && styles.filterChipTextActive,
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
                          styles.filterChip,
                          isSelected && styles.filterChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            isSelected && styles.filterChipTextActive,
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
                onDelete={() => handleDeletePlace(item.id)}
              />
            );
          }
          return (
            <ExpenseCard
              expense={item}
              currency={currentTrip.currency || '₺'}
              onDelete={() => handleDeleteExpense(item.id)}
            />
          );
        }}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                {activeTab === 'places' ? (
                  <Compass size={28} color="#71717A" strokeWidth={1.8} />
                ) : (
                  <CreditCard size={28} color="#71717A" strokeWidth={1.8} />
                )}
              </View>
              <Text style={styles.emptyTitle}>
                {activeTab === 'places'
                  ? 'Henüz Gezi Noktası Eklenmedi'
                  : 'Henüz Harcama Kaydı Yok'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'places'
                  ? 'Ziyaret etmek istediğiniz plaj, müze veya kafeleri ekleyin.'
                  : 'Konaklama, yeme-içme veya seyahat harcamalarınızı kaydedin.'}
              </Text>
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
          <Plus size={17} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.fabText}>
            {activeTab === 'places' ? 'Yer Ekle' : 'Harcama Ekle'}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Edit Budget & Currency Modal */}
      <ModalSheet
        visible={isEditBudgetModalVisible}
        onClose={() => setIsEditBudgetModalVisible(false)}
        title="Bütçe & Para Birimini Düzenle"
        subtitle="Bu seyahat için hedef bütçeyi ve geçerli para birimini güncelleyin"
      >
        <View style={styles.formContainer}>
          {editBudgetError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{editBudgetError}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Wallet size={13} color="#71717A" strokeWidth={2} />
              <Text style={styles.inputLabel}>Hedef Bütçe</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: 35000"
              placeholderTextColor="#A1A1AA"
              keyboardType="numeric"
              value={editBudgetAmount}
              onChangeText={(text) => {
                setEditBudgetAmount(text);
                if (editBudgetError) setEditBudgetError('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Para Birimi</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.currencyScroll}
            >
              {WORLD_CURRENCIES.map((item) => {
                const isSelected = editCurrency === item.symbol;
                return (
                  <Pressable
                    key={item.code}
                    onPress={() => setEditCurrency(item.symbol)}
                    style={[
                      styles.currencyChip,
                      isSelected && styles.currencyChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyChipText,
                        isSelected && styles.currencyChipTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.modalButtonsRow}>
            <Pressable
              onPress={() => setIsEditBudgetModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </Pressable>

            <Pressable
              onPress={handleSaveBudget}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Güncelle</Text>
            </Pressable>
          </View>
        </View>
      </ModalSheet>

      {/* Add Place Modal */}
      <ModalSheet
        visible={isPlaceModalVisible}
        onClose={() => setIsPlaceModalVisible(false)}
        title="Yeni Gezi Noktası Ekle"
        subtitle="Ziyaret edeceğiniz yerleri ve rotanızı not edin"
      >
        <View style={styles.formContainer}>
          {placeError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{placeError}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Yer / Mekan Adı <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: Kaputaş Plajı, Antik Tiyatro"
              placeholderTextColor="#A1A1AA"
              value={placeName}
              onChangeText={(text) => {
                setPlaceName(text);
                if (placeError) setPlaceError('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kategori</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPillsScroll}
            >
              {PLACE_CATEGORIES.map((cat) => {
                const isSelected = placeCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setPlaceCategory(cat)}
                    style={[
                      styles.categoryPill,
                      isSelected && styles.categoryPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        isSelected && styles.categoryPillTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Calendar size={13} color="#71717A" strokeWidth={2} />
              <Text style={styles.inputLabel}>Ziyaret Tarihi</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="YYYY-AA-GG"
              placeholderTextColor="#A1A1AA"
              value={placeDate}
              onChangeText={setPlaceDate}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <FileText size={13} color="#71717A" strokeWidth={2} />
              <Text style={styles.inputLabel}>Gezi Notları (İsteğe Bağlı)</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.textAreaInput]}
              placeholder="Giriş ücreti, en iyi saatler, yanına alman gerekenler..."
              placeholderTextColor="#A1A1AA"
              multiline
              numberOfLines={3}
              value={placeNotes}
              onChangeText={setPlaceNotes}
            />
          </View>

          <View style={styles.modalButtonsRow}>
            <Pressable
              onPress={() => setIsPlaceModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </Pressable>

            <Pressable
              onPress={handleSavePlace}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Yeri Kaydet</Text>
            </Pressable>
          </View>
        </View>
      </ModalSheet>

      {/* Add Expense Modal */}
      <ModalSheet
        visible={isExpenseModalVisible}
        onClose={() => setIsExpenseModalVisible(false)}
        title="Yeni Harcama Kaydı"
        subtitle="Bütçenizi kontrol etmek için seyahat giderlerinizi ekleyin"
      >
        <View style={styles.formContainer}>
          {expenseError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{expenseError}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Harcama Başlığı <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: Otel Konaklama, Akşam Yemeği"
              placeholderTextColor="#A1A1AA"
              value={expenseTitle}
              onChangeText={(text) => {
                setExpenseTitle(text);
                if (expenseError) setExpenseError('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Wallet size={13} color="#71717A" strokeWidth={2} />
              <Text style={styles.inputLabel}>
                Tutar ({currentTrip.currency || '₺'}) <Text style={styles.requiredStar}>*</Text>
              </Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: 2400"
              placeholderTextColor="#A1A1AA"
              keyboardType="numeric"
              value={expenseAmount}
              onChangeText={(text) => {
                setExpenseAmount(text);
                if (expenseError) setExpenseError('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Harcama Kategorisi</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPillsScroll}
            >
              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = expenseCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setExpenseCategory(cat)}
                    style={[
                      styles.categoryPill,
                      isSelected && styles.categoryPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        isSelected && styles.categoryPillTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Calendar size={13} color="#71717A" strokeWidth={2} />
              <Text style={styles.inputLabel}>Harcama Tarihi</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="YYYY-AA-GG"
              placeholderTextColor="#A1A1AA"
              value={expenseDate}
              onChangeText={setExpenseDate}
            />
          </View>

          <View style={styles.modalButtonsRow}>
            <Pressable
              onPress={() => setIsExpenseModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </Pressable>

            <Pressable
              onPress={handleSaveExpense}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Harcamayı Kaydet</Text>
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
    backgroundColor: '#FAFAFA',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F5',
  },
  navTitleWrap: {
    flex: 1,
    marginHorizontal: 12,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B',
    letterSpacing: -0.2,
  },
  navCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  navCityText: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '500',
  },
  deleteTripBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F5',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  dateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  dateBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525B',
  },
  budgetSection: {
    marginBottom: 14,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#18181B',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717A',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#E4E4E7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tabBadgeActive: {
    backgroundColor: '#27272A',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#52525B',
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  categoryFiltersContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  filterChipActive: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#52525B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#71717A',
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#18181B',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal Form Styles
  formContainer: {
    gap: 14,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    padding: 8,
    borderRadius: 6,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '500',
  },
  inputGroup: {
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3F3F46',
  },
  requiredStar: {
    color: '#DC2626',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#09090B',
  },
  textAreaInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  categoryPillsScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  categoryPillSelected: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#52525B',
  },
  categoryPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  currencyScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  currencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  currencyChipSelected: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  currencyChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525B',
  },
  currencyChipTextSelected: {
    color: '#FFFFFF',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F4F4F5',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#52525B',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#18181B',
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
