import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  FileText,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BudgetProgress from '../components/BudgetProgress';
import PlaceCard from '../components/PlaceCard';
import ExpenseCard from '../components/ExpenseCard';
import ModalSheet from '../components/ModalSheet';
import DatePickerModal from '../components/DatePickerModal';
import { useSettings } from '../contexts/SettingsContext';
import {
  formatDateRange,
  translatePlaceCategory,
  translateExpenseCategory,
} from '../utils/translations';
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
  'place_cat_nature',
  'place_cat_history',
  'place_cat_museum',
  'place_cat_cafe',
  'place_cat_shopping',
  'place_cat_other',
];

const EXPENSE_CATEGORIES = [
  'expense_cat_stay',
  'expense_cat_transit',
  'expense_cat_food',
  'expense_cat_activity',
  'expense_cat_shopping',
  'expense_cat_other',
];

export default function TripDetailScreen({
  trip,
  onBack,
  onTripDeleted,
  onTripUpdated,
}) {
  const insets = useSafeAreaInsets();
  const { theme, t, isDark, language } = useSettings();
  const [currentTrip, setCurrentTrip] = useState(trip);
  const [activeTab, setActiveTab] = useState('places'); // 'places' | 'expenses'
  const [places, setPlaces] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ totalSpent: 0, remaining: 0, percent: 0, expenseCount: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters ('all' or category key)
  const [selectedPlaceCategory, setSelectedPlaceCategory] = useState('all');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('all');

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

  // Date Picker State ('place' | 'expense' | null)
  const [datePickerTarget, setDatePickerTarget] = useState(null);

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
      setEditBudgetError(t('error_budget_invalid'));
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
      setEditBudgetError(t('error_budget_update'));
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
      setPlaceError(t('error_place_name_req'));
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
      setPlaceError(t('error_place_save'));
    }
  };

  const handleDeletePlace = useCallback(
    (placeId) => {
      Alert.alert(
        t('confirm_delete_place_title'),
        t('confirm_delete_place_msg'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('delete'),
            style: 'destructive',
            onPress: async () => {
              try {
                await deletePlace(placeId);
                await loadTripData();
              } catch (err) {
                Alert.alert(t('error_generic'), t('error_place_delete'));
              }
            },
          },
        ]
      );
    },
    [t, loadTripData]
  );

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
      setExpenseError(t('error_title_req'));
      return;
    }
    const rawAmt = parseFloat(expenseAmount);
    if (isNaN(rawAmt) || rawAmt <= 0) {
      setExpenseError(t('error_amount_req'));
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
      setExpenseError(t('error_expense_save'));
    }
  };

  const handleDeleteExpense = useCallback(
    (expenseId) => {
      Alert.alert(
        t('confirm_delete_expense_title'),
        t('confirm_delete_expense_msg'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('delete'),
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteExpense(expenseId);
                await loadTripData();
              } catch (err) {
                Alert.alert(t('error_generic'), t('error_expense_delete'));
              }
            },
          },
        ]
      );
    },
    [t, loadTripData]
  );

  const handleDeleteCurrentTrip = () => {
    Alert.alert(
      t('confirm_delete_trip_title'),
      t('confirm_delete_trip_msg', { title: currentTrip.title }),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrip(currentTrip.id);
              if (onTripDeleted) onTripDeleted(currentTrip.id);
            } catch (err) {
              Alert.alert(t('error_generic'), t('error_trip_delete'));
            }
          },
        },
      ]
    );
  };

  // Filtered Lists supporting both category keys and legacy Turkish strings
  const filteredPlaces = useMemo(() => {
    if (selectedPlaceCategory === 'all') return places;
    return places.filter((p) => {
      return (
        p.category === selectedPlaceCategory ||
        translatePlaceCategory(p.category, 'en') === translatePlaceCategory(selectedPlaceCategory, 'en')
      );
    });
  }, [places, selectedPlaceCategory]);

  const filteredExpenses = useMemo(() => {
    if (selectedExpenseCategory === 'all') return expenses;
    return expenses.filter((e) => {
      return (
        e.category === selectedExpenseCategory ||
        translateExpenseCategory(e.category, 'en') === translateExpenseCategory(selectedExpenseCategory, 'en')
      );
    });
  }, [expenses, selectedExpenseCategory]);

  const renderDetailItem = useCallback(
    ({ item }) => {
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
    },
    [activeTab, currentTrip.currency, handleDeletePlace, handleDeleteExpense]
  );

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

  const dateSpan = formatDateRange(currentTrip.startDate, currentTrip.endDate, language);
  const topSafeArea = Math.max(insets.top, Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 12);
  const bottomSafeArea = Math.max(insets.bottom, 16);

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas, paddingTop: topSafeArea }]}>
      {/* Top Navigation Bar */}
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: theme.card,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Pressable
          onPress={onBack}
          hitSlop={8}
          accessibilityLabel={t('back')}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: theme.btnSecondaryBg },
            pressed && { opacity: 0.8 },
          ]}
        >
          <ArrowLeft size={18} color={theme.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.navTitleWrap}>
          <Text style={[styles.navTitle, { color: theme.textPrimary }]} numberOfLines={1}>
            {currentTrip.title}
          </Text>
          {(currentTrip.city || currentTrip.country) ? (
            <View style={styles.navCityRow}>
              <MapPin size={11} color={theme.textMuted} strokeWidth={2} />
              <Text style={[styles.navCityText, { color: theme.textMuted }]} numberOfLines={1}>
                {currentTrip.city ? currentTrip.city : ''}
                {currentTrip.city && currentTrip.country ? ' • ' : ''}
                {currentTrip.country ? currentTrip.country : ''}
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={handleDeleteCurrentTrip}
          hitSlop={8}
          accessibilityLabel={t('delete')}
          style={({ pressed }) => [
            styles.deleteTripBtn,
            { backgroundColor: theme.btnSecondaryBg },
            pressed && { backgroundColor: isDark ? '#450A0A' : '#FEE2E2' },
          ]}
        >
          <Trash2 size={16} color={isDark ? '#F87171' : '#A1A1AA'} strokeWidth={2} />
        </Pressable>
      </View>

      <FlatList
        data={activeTab === 'places' ? filteredPlaces : filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={renderDetailItem}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textPrimary}
            colors={[theme.textPrimary]}
          />
        }
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: bottomSafeArea + 80 },
        ]}
        ListHeaderComponent={
          <View>
            {/* Dates banner if available */}
            {dateSpan ? (
              <View
                style={[
                  styles.dateBanner,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Calendar size={13} color={theme.textMuted} strokeWidth={2} />
                <Text style={[styles.dateBannerText, { color: theme.textSecondary }]}>
                  {dateSpan}
                </Text>
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
            <View
              style={[
                styles.tabSwitcher,
                {
                  backgroundColor: theme.btnSecondaryBg,
                  borderColor: theme.border,
                },
              ]}
            >
              <Pressable
                onPress={() => setActiveTab('places')}
                style={[
                  styles.tabButton,
                  activeTab === 'places' && [
                    styles.tabButtonActive,
                    { backgroundColor: theme.btnPrimaryBg },
                  ],
                ]}
              >
                <Compass
                  size={15}
                  color={activeTab === 'places' ? theme.btnPrimaryText : theme.textMuted}
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    {
                      color: activeTab === 'places' ? theme.btnPrimaryText : theme.textMuted,
                      fontWeight: activeTab === 'places' ? '700' : '600',
                    },
                  ]}
                >
                  {t('places_tab')}
                </Text>
                <View
                  style={[
                    styles.tabBadge,
                    {
                      backgroundColor: activeTab === 'places' ? (isDark ? '#27272A' : '#3F3F46') : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      {
                        color: activeTab === 'places' ? '#FFFFFF' : theme.textMuted,
                      },
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
                  activeTab === 'expenses' && [
                    styles.tabButtonActive,
                    { backgroundColor: theme.btnPrimaryBg },
                  ],
                ]}
              >
                <Wallet
                  size={15}
                  color={activeTab === 'expenses' ? theme.btnPrimaryText : theme.textMuted}
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    {
                      color: activeTab === 'expenses' ? theme.btnPrimaryText : theme.textMuted,
                      fontWeight: activeTab === 'expenses' ? '700' : '600',
                    },
                  ]}
                >
                  {t('expenses_tab')}
                </Text>
                <View
                  style={[
                    styles.tabBadge,
                    {
                      backgroundColor: activeTab === 'expenses' ? (isDark ? '#27272A' : '#3F3F46') : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      {
                        color: activeTab === 'expenses' ? '#FFFFFF' : theme.textMuted,
                      },
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
              {activeTab === 'places' ? (
                <>
                  {/* All Category Pill */}
                  <Pressable
                    onPress={() => setSelectedPlaceCategory('all')}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: selectedPlaceCategory === 'all' ? theme.btnPrimaryBg : theme.card,
                        borderColor: selectedPlaceCategory === 'all' ? theme.btnPrimaryBg : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: selectedPlaceCategory === 'all' ? theme.btnPrimaryText : theme.textSecondary,
                          fontWeight: selectedPlaceCategory === 'all' ? '700' : '500',
                        },
                      ]}
                    >
                      {t('place_cat_all')}
                    </Text>
                  </Pressable>

                  {/* Individual Place Categories */}
                  {PLACE_CATEGORIES.map((catKey) => {
                    const isSelected = selectedPlaceCategory === catKey;
                    return (
                      <Pressable
                        key={catKey}
                        onPress={() => setSelectedPlaceCategory(catKey)}
                        style={[
                          styles.filterChip,
                          {
                            backgroundColor: isSelected ? theme.btnPrimaryBg : theme.card,
                            borderColor: isSelected ? theme.btnPrimaryBg : theme.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            {
                              color: isSelected ? theme.btnPrimaryText : theme.textSecondary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {t(catKey)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </>
              ) : (
                <>
                  {/* All Expense Category Pill */}
                  <Pressable
                    onPress={() => setSelectedExpenseCategory('all')}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: selectedExpenseCategory === 'all' ? theme.btnPrimaryBg : theme.card,
                        borderColor: selectedExpenseCategory === 'all' ? theme.btnPrimaryBg : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: selectedExpenseCategory === 'all' ? theme.btnPrimaryText : theme.textSecondary,
                          fontWeight: selectedExpenseCategory === 'all' ? '700' : '500',
                        },
                      ]}
                    >
                      {t('expense_cat_all')}
                    </Text>
                  </Pressable>

                  {/* Individual Expense Categories */}
                  {EXPENSE_CATEGORIES.map((catKey) => {
                    const isSelected = selectedExpenseCategory === catKey;
                    return (
                      <Pressable
                        key={catKey}
                        onPress={() => setSelectedExpenseCategory(catKey)}
                        style={[
                          styles.filterChip,
                          {
                            backgroundColor: isSelected ? theme.btnPrimaryBg : theme.card,
                            borderColor: isSelected ? theme.btnPrimaryBg : theme.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            {
                              color: isSelected ? theme.btnPrimaryText : theme.textSecondary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {t(catKey)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </>
              )}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: theme.btnSecondaryBg }]}>
                {activeTab === 'places' ? (
                  <Compass size={28} color={theme.textMuted} strokeWidth={1.8} />
                ) : (
                  <CreditCard size={28} color={theme.textMuted} strokeWidth={1.8} />
                )}
              </View>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                {activeTab === 'places'
                  ? t('no_places_title')
                  : t('no_expenses_title')}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                {activeTab === 'places'
                  ? t('no_places_subtitle')
                  : t('no_expenses_subtitle')}
              </Text>
            </View>
          )
        }
      />

      {/* Floating Action Button (Dynamically positioned above system navigation bar) */}
      <Animated.View
        style={[
          styles.fabContainer,
          { bottom: bottomSafeArea + 12, transform: [{ scale: fabScale }] },
        ]}
      >
        <Pressable
          onPress={activeTab === 'places' ? handleOpenAddPlace : handleOpenAddExpense}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          style={[styles.fabButton, { backgroundColor: theme.btnPrimaryBg }]}
        >
          <Plus size={17} color={theme.btnPrimaryText} strokeWidth={2.4} />
          <Text style={[styles.fabText, { color: theme.btnPrimaryText }]}>
            {activeTab === 'places' ? t('add_place') : t('add_expense')}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Edit Budget & Currency Modal */}
      <ModalSheet
        visible={isEditBudgetModalVisible}
        onClose={() => setIsEditBudgetModalVisible(false)}
        title={t('modal_edit_budget_title')}
        subtitle={t('edit_budget_subtitle')}
        theme={theme}
      >
        <View style={styles.formContainer}>
          {editBudgetError ? (
            <View
              style={[
                styles.errorBox,
                {
                  backgroundColor: isDark ? '#450A0A' : '#FEE2E2',
                  borderLeftColor: '#DC2626',
                },
              ]}
            >
              <Text style={[styles.errorText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
                {editBudgetError}
              </Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Wallet size={13} color={theme.textMuted} strokeWidth={2} />
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {t('target_budget')}
              </Text>
            </View>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                },
              ]}
              placeholder={t('placeholder_budget')}
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
              value={editBudgetAmount}
              onChangeText={(text) => {
                setEditBudgetAmount(text);
                if (editBudgetError) setEditBudgetError('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              {t('currency')}
            </Text>
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
                      {
                        backgroundColor: isSelected ? theme.btnPrimaryBg : theme.btnSecondaryBg,
                        borderColor: isSelected ? theme.btnPrimaryBg : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyChipText,
                        {
                          color: isSelected ? theme.btnPrimaryText : theme.textSecondary,
                        },
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
              style={[styles.cancelButton, { backgroundColor: theme.btnSecondaryBg }]}
            >
              <Text style={[styles.cancelButtonText, { color: theme.btnSecondaryText }]}>
                {t('cancel')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSaveBudget}
              style={[styles.saveButton, { backgroundColor: theme.btnPrimaryBg }]}
            >
              <Text style={[styles.saveButtonText, { color: theme.btnPrimaryText }]}>
                {t('update')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ModalSheet>

      {/* Add Place Modal */}
      <ModalSheet
        visible={isPlaceModalVisible}
        onClose={() => setIsPlaceModalVisible(false)}
        title={t('modal_add_place_title')}
        subtitle={t('modal_add_place_subtitle')}
        theme={theme}
      >
        <View style={styles.formContainer}>
          {placeError ? (
            <View
              style={[
                styles.errorBox,
                {
                  backgroundColor: isDark ? '#450A0A' : '#FEE2E2',
                  borderLeftColor: '#DC2626',
                },
              ]}
            >
              <Text style={[styles.errorText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
                {placeError}
              </Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              {t('place_name')} <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                },
              ]}
              placeholder={t('placeholder_place_name')}
              placeholderTextColor={theme.textMuted}
              value={placeName}
              onChangeText={(text) => {
                setPlaceName(text);
                if (placeError) setPlaceError('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              {t('category')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPillsScroll}
            >
              {PLACE_CATEGORIES.map((catKey) => {
                const isSelected = placeCategory === catKey;
                return (
                  <Pressable
                    key={catKey}
                    onPress={() => setPlaceCategory(catKey)}
                    style={[
                      styles.categoryPill,
                      {
                        backgroundColor: isSelected ? theme.btnPrimaryBg : theme.btnSecondaryBg,
                        borderColor: isSelected ? theme.btnPrimaryBg : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        {
                          color: isSelected ? theme.btnPrimaryText : theme.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {t(catKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Calendar size={13} color={theme.textMuted} strokeWidth={2} />
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {t('visit_date')}
              </Text>
            </View>
            <Pressable
              onPress={() => setDatePickerTarget('place')}
              style={({ pressed }) => [
                styles.dateSelectBtn,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                },
                pressed && { opacity: 0.75 },
              ]}
            >
              <Text
                style={[
                  styles.dateSelectBtnText,
                  { color: placeDate ? theme.textPrimary : theme.textMuted },
                ]}
                numberOfLines={1}
              >
                {placeDate || 'YYYY-MM-DD'}
              </Text>
              <Calendar size={14} color={theme.textMuted} strokeWidth={1.8} />
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <FileText size={13} color={theme.textMuted} strokeWidth={2} />
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {t('place_notes')}
              </Text>
            </View>
            <TextInput
              style={[
                styles.textInput,
                styles.textAreaInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                },
              ]}
              placeholder={t('placeholder_place_notes')}
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={3}
              value={placeNotes}
              onChangeText={setPlaceNotes}
            />
          </View>

          <View style={styles.modalButtonsRow}>
            <Pressable
              onPress={() => setIsPlaceModalVisible(false)}
              style={[styles.cancelButton, { backgroundColor: theme.btnSecondaryBg }]}
            >
              <Text style={[styles.cancelButtonText, { color: theme.btnSecondaryText }]}>
                {t('cancel')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSavePlace}
              style={[styles.saveButton, { backgroundColor: theme.btnPrimaryBg }]}
            >
              <Text style={[styles.saveButtonText, { color: theme.btnPrimaryText }]}>
                {t('save')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ModalSheet>

      {/* Add Expense Modal */}
      <ModalSheet
        visible={isExpenseModalVisible}
        onClose={() => setIsExpenseModalVisible(false)}
        title={t('modal_add_expense_title')}
        subtitle={t('modal_add_expense_subtitle')}
        theme={theme}
      >
        <View style={styles.formContainer}>
          {expenseError ? (
            <View
              style={[
                styles.errorBox,
                {
                  backgroundColor: isDark ? '#450A0A' : '#FEE2E2',
                  borderLeftColor: '#DC2626',
                },
              ]}
            >
              <Text style={[styles.errorText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
                {expenseError}
              </Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              {t('expense_title')} <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                },
              ]}
              placeholder={t('placeholder_expense_title')}
              placeholderTextColor={theme.textMuted}
              value={expenseTitle}
              onChangeText={(text) => {
                setExpenseTitle(text);
                if (expenseError) setExpenseError('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Wallet size={13} color={theme.textMuted} strokeWidth={2} />
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {t('expense_amount')} ({currentTrip.currency || '₺'}) <Text style={styles.requiredStar}>*</Text>
              </Text>
            </View>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                },
              ]}
              placeholder={t('placeholder_expense_amount')}
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
              value={expenseAmount}
              onChangeText={(text) => {
                setExpenseAmount(text);
                if (expenseError) setExpenseError('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              {t('category')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPillsScroll}
            >
              {EXPENSE_CATEGORIES.map((catKey) => {
                const isSelected = expenseCategory === catKey;
                return (
                  <Pressable
                    key={catKey}
                    onPress={() => setExpenseCategory(catKey)}
                    style={[
                      styles.categoryPill,
                      {
                        backgroundColor: isSelected ? theme.btnPrimaryBg : theme.btnSecondaryBg,
                        borderColor: isSelected ? theme.btnPrimaryBg : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        {
                          color: isSelected ? theme.btnPrimaryText : theme.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {t(catKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Calendar size={13} color={theme.textMuted} strokeWidth={2} />
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {t('expense_date')}
              </Text>
            </View>
            <Pressable
              onPress={() => setDatePickerTarget('expense')}
              style={({ pressed }) => [
                styles.dateSelectBtn,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                },
                pressed && { opacity: 0.75 },
              ]}
            >
              <Text
                style={[
                  styles.dateSelectBtnText,
                  { color: expenseDate ? theme.textPrimary : theme.textMuted },
                ]}
                numberOfLines={1}
              >
                {expenseDate || 'YYYY-MM-DD'}
              </Text>
              <Calendar size={14} color={theme.textMuted} strokeWidth={1.8} />
            </Pressable>
          </View>

          <View style={styles.modalButtonsRow}>
            <Pressable
              onPress={() => setIsExpenseModalVisible(false)}
              style={[styles.cancelButton, { backgroundColor: theme.btnSecondaryBg }]}
            >
              <Text style={[styles.cancelButtonText, { color: theme.btnSecondaryText }]}>
                {t('cancel')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSaveExpense}
              style={[styles.saveButton, { backgroundColor: theme.btnPrimaryBg }]}
            >
              <Text style={[styles.saveButtonText, { color: theme.btnPrimaryText }]}>
                {t('save')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ModalSheet>

      {/* Date Picker Modal for Place / Expense Date */}
      <DatePickerModal
        visible={datePickerTarget !== null}
        onClose={() => setDatePickerTarget(null)}
        title={datePickerTarget === 'place' ? t('visit_date') : t('expense_date')}
        selectedDate={datePickerTarget === 'place' ? placeDate : expenseDate}
        onSelectDate={(selected) => {
          if (datePickerTarget === 'place') {
            setPlaceDate(selected);
          } else if (datePickerTarget === 'expense') {
            setExpenseDate(selected);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitleWrap: {
    flex: 1,
    marginHorizontal: 12,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
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
    fontWeight: '500',
  },
  deleteTripBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  dateBannerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  budgetSection: {
    marginBottom: 14,
  },
  tabSwitcher: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13,
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
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
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 18,
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
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal Form Styles
  formContainer: {
    gap: 14,
  },
  errorBox: {
    borderLeftWidth: 3,
    padding: 8,
    borderRadius: 6,
  },
  errorText: {
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
  },
  requiredStar: {
    color: '#DC2626',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  dateSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateSelectBtnText: {
    fontSize: 13,
    fontWeight: '500',
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
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 12,
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
    borderWidth: 1,
  },
  currencyChipText: {
    fontSize: 12,
    fontWeight: '600',
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
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
