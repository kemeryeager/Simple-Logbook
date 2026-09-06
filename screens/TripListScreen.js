import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  RefreshControl,
  Alert,
  Platform,
  StatusBar as RNStatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import {
  Compass,
  Search,
  Plus,
  X,
  MapPin,
  Calendar,
  Wallet,
  Settings,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TripCard from '../components/TripCard';
import ModalSheet from '../components/ModalSheet';
import SettingsModal from '../components/SettingsModal';
import DatePickerModal from '../components/DatePickerModal';
import { useSettings } from '../contexts/SettingsContext';
import { getTrips, saveTrip, deleteTrip, getTripStats, WORLD_CURRENCIES } from '../utils/storage';

export default function TripListScreen({ onSelectTrip }) {
  const insets = useSafeAreaInsets();
  const { theme, t, isDark } = useSettings();
  const [trips, setTrips] = useState([]);
  const [tripStats, setTripStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Add Trip Modal State
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('₺');
  const [formError, setFormError] = useState('');

  // Date Picker State ('start' | 'end' | null)
  const [datePickerTarget, setDatePickerTarget] = useState(null);

  // FAB scale animation
  const fabScale = useRef(new Animated.Value(1)).current;

  const loadData = useCallback(async () => {
    try {
      const tripList = await getTrips();
      setTrips(tripList);

      // Load stats for each trip
      const statsMap = {};
      await Promise.all(
        tripList.map(async (item) => {
          const stats = await getTripStats(item.id, item.budget);
          statsMap[item.id] = stats;
        })
      );
      setTripStats(statsMap);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleOpenAddModal = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    setTitle('');
    setCity('');
    setStartDate(todayStr);
    setEndDate(nextWeekStr);
    setBudget('');
    setCurrency('₺');
    setFormError('');
    setIsAddModalVisible(true);
  };

  const handleSaveTrip = async () => {
    if (!title.trim()) {
      setFormError(t('error_title_req'));
      return;
    }

    try {
      const newTripData = {
        title: title.trim(),
        city: city.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        budget: parseFloat(budget) || 0,
        currency: currency || '₺',
      };

      await saveTrip(newTripData);
      setIsAddModalVisible(false);
      await loadData();
    } catch (error) {
      setFormError(t('error_trip_save'));
    }
  };

  const handleDeleteTrip = useCallback(
    (trip) => {
      Alert.alert(
        t('confirm_delete_trip_title'),
        t('confirm_delete_trip_msg', { title: trip.title }),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('delete'),
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteTrip(trip.id);
                await loadData();
              } catch (err) {
                Alert.alert(t('error_generic'), t('error_trip_delete'));
              }
            },
          },
        ]
      );
    },
    [t, loadData]
  );

  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return trips;
    const query = searchQuery.toLowerCase().trim();
    return trips.filter((item) => {
      const matchTitle = item.title?.toLowerCase().includes(query);
      const matchCity = item.city?.toLowerCase().includes(query);
      return matchTitle || matchCity;
    });
  }, [trips, searchQuery]);

  const renderTripItem = useCallback(
    ({ item }) => (
      <TripCard
        trip={item}
        stats={tripStats[item.id]}
        onPress={() => onSelectTrip(item)}
        onDelete={handleDeleteTrip}
      />
    ),
    [tripStats, onSelectTrip, handleDeleteTrip]
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

  const topSafeArea = Math.max(insets.top, Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 12);
  const bottomSafeArea = Math.max(insets.bottom, 16);

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas, paddingTop: topSafeArea }]}>
      {/* App Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandingCol}>
          <View style={styles.logoRow}>
            <View style={[styles.logoIcon, { backgroundColor: theme.btnPrimaryBg }]}>
              <Compass size={18} color={theme.btnPrimaryText} strokeWidth={2.4} />
            </View>
            <Text style={[styles.appName, { color: theme.textPrimary }]}>{t('app_name')}</Text>
          </View>
          <Text style={[styles.appTagline, { color: theme.textMuted }]}>{t('app_tagline')}</Text>
        </View>

        <View style={styles.topBarActions}>
          {/* Settings Button */}
          <Pressable
            onPress={() => setIsSettingsOpen(true)}
            accessibilityLabel={t('settings')}
            style={({ pressed }) => [
              styles.headerSettingsBtn,
              {
                backgroundColor: theme.btnSecondaryBg,
                borderColor: theme.border,
              },
              pressed && { opacity: 0.75 },
            ]}
          >
            <Settings size={18} color={theme.textPrimary} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchBarContainer,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Search size={16} color={theme.textMuted} strokeWidth={2} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder={t('search_placeholder')}
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8} style={styles.clearSearchBtn}>
              <X size={14} color={theme.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Trip List or Empty State */}
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderTripItem}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomSafeArea + 80 },
          filteredTrips.length === 0 && styles.listContentEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textPrimary}
            colors={[theme.textPrimary]}
          />
        }
        ListHeaderComponent={
          filteredTrips.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={[styles.listHeaderTitle, { color: theme.textMuted }]}>
                {t('planned_routes')}
              </Text>
              <Text
                style={[
                  styles.listHeaderBadge,
                  {
                    color: theme.textSecondary,
                    backgroundColor: theme.btnSecondaryBg,
                  },
                ]}
              >
                {t('routes_count', { count: filteredTrips.length })}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          searchQuery.trim().length > 0 ? (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: theme.btnSecondaryBg }]}>
                <Search size={28} color={theme.textMuted} strokeWidth={1.8} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                {t('search_empty_title')}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                {t('search_empty_subtitle', { query: searchQuery })}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: theme.btnSecondaryBg }]}>
                <Compass size={32} color={theme.textMuted} strokeWidth={1.8} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                {t('no_trips_title')}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                {t('no_trips_subtitle')}
              </Text>
              <Pressable
                onPress={handleOpenAddModal}
                style={[styles.emptyActionButton, { backgroundColor: theme.btnPrimaryBg }]}
              >
                <Plus size={16} color={theme.btnPrimaryText} strokeWidth={2.4} />
                <Text style={[styles.emptyActionText, { color: theme.btnPrimaryText }]}>
                  {t('plan_new_trip')}
                </Text>
              </Pressable>
            </View>
          )
        }
      />

      {/* Floating Action Button (Dynamically placed above system navigation bar) */}
      <Animated.View
        style={[
          styles.fabContainer,
          { bottom: bottomSafeArea + 12, transform: [{ scale: fabScale }] },
        ]}
      >
        <Pressable
          onPress={handleOpenAddModal}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          style={[styles.fabButton, { backgroundColor: theme.btnPrimaryBg }]}
        >
          <Plus size={18} color={theme.btnPrimaryText} strokeWidth={2.4} />
          <Text style={[styles.fabText, { color: theme.btnPrimaryText }]}>
            {t('new_trip')}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Settings Modal */}
      <SettingsModal
        visible={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Add Trip Modal Sheet */}
      <ModalSheet
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        title={t('modal_new_trip_title')}
        subtitle={t('modal_new_trip_subtitle')}
        theme={theme}
      >
        <View style={styles.formContainer}>
          {formError ? (
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
                {formError}
              </Text>
            </View>
          ) : null}

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              {t('trip_title')} <Text style={styles.requiredStar}>*</Text>
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
              placeholder={t('placeholder_trip_title')}
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (formError) setFormError('');
              }}
            />
          </View>

          {/* City / Destination */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MapPin size={13} color={theme.textMuted} strokeWidth={2} />
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {t('destination_city')}
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
              placeholder={t('placeholder_city')}
              placeholderTextColor={theme.textMuted}
              value={city}
              onChangeText={setCity}
            />
          </View>

          {/* Dates Row */}
          <View style={styles.rowTwoCols}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
              <View style={styles.labelRow}>
                <Calendar size={13} color={theme.textMuted} strokeWidth={2} />
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  {t('start_date')}
                </Text>
              </View>
              <Pressable
                onPress={() => setDatePickerTarget('start')}
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
                    { color: startDate ? theme.textPrimary : theme.textMuted },
                  ]}
                  numberOfLines={1}
                >
                  {startDate || 'YYYY-MM-DD'}
                </Text>
                <Calendar size={14} color={theme.textMuted} strokeWidth={1.8} />
              </Pressable>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
              <View style={styles.labelRow}>
                <Calendar size={13} color={theme.textMuted} strokeWidth={2} />
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  {t('end_date')}
                </Text>
              </View>
              <Pressable
                onPress={() => setDatePickerTarget('end')}
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
                    { color: endDate ? theme.textPrimary : theme.textMuted },
                  ]}
                  numberOfLines={1}
                >
                  {endDate || 'YYYY-MM-DD'}
                </Text>
                <Calendar size={14} color={theme.textMuted} strokeWidth={1.8} />
              </Pressable>
            </View>
          </View>

          {/* Budget Input */}
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
              value={budget}
              onChangeText={setBudget}
            />
          </View>

          {/* Currency Selector Chips */}
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
                const isSelected = currency === item.symbol;
                return (
                  <Pressable
                    key={item.code}
                    onPress={() => setCurrency(item.symbol)}
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

          {/* Modal Action Buttons */}
          <View style={styles.modalButtonsRow}>
            <Pressable
              onPress={() => setIsAddModalVisible(false)}
              style={[styles.cancelButton, { backgroundColor: theme.btnSecondaryBg }]}
            >
              <Text style={[styles.cancelButtonText, { color: theme.btnSecondaryText }]}>
                {t('cancel')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSaveTrip}
              style={[styles.saveButton, { backgroundColor: theme.btnPrimaryBg }]}
            >
              <Text style={[styles.saveButtonText, { color: theme.btnPrimaryText }]}>
                {t('save')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ModalSheet>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={datePickerTarget !== null}
        onClose={() => setDatePickerTarget(null)}
        title={datePickerTarget === 'start' ? t('start_date') : t('end_date')}
        selectedDate={datePickerTarget === 'start' ? startDate : endDate}
        onSelectDate={(selected) => {
          if (datePickerTarget === 'start') {
            setStartDate(selected);
          } else if (datePickerTarget === 'end') {
            setEndDate(selected);
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  brandingCol: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  appTagline: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSettingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 4,
  },
  listHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listHeaderBadge: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  listContent: {
    paddingBottom: 90,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyActionText: {
    fontSize: 13,
    fontWeight: '600',
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
  rowTwoCols: {
    flexDirection: 'row',
    alignItems: 'center',
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
