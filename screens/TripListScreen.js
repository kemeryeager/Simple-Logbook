import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import {
  Compass,
  Search,
  Plus,
  X,
  MapPin,
  Calendar,
  Wallet,
  Sparkles,
} from 'lucide-react-native';
import TripCard from '../components/TripCard';
import ModalSheet from '../components/ModalSheet';
import { getTrips, saveTrip, deleteTrip, getTripStats } from '../utils/storage';

const CURRENCY_OPTIONS = ['₺', '$', '€', '£'];

export default function TripListScreen({ onSelectTrip }) {
  const [trips, setTrips] = useState([]);
  const [tripStats, setTripStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('₺');
  const [formError, setFormError] = useState('');

  // FAB scale animation
  const fabScale = React.useRef(new Animated.Value(1)).current;

  const loadData = useCallback(async () => {
    try {
      const tripList = await getTrips();
      setTrips(tripList);

      // Load stats for each trip
      const statsMap = {};
      await Promise.all(
        tripList.map(async (t) => {
          const stats = await getTripStats(t.id, t.budget);
          statsMap[t.id] = stats;
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
    // Prefill default dates
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
      setFormError('Lütfen seyahatiniz için bir başlık girin.');
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

      const saved = await saveTrip(newTripData);
      setIsAddModalVisible(false);
      await loadData();
    } catch (error) {
      setFormError('Seyahat kaydedilirken bir sorun oluştu.');
    }
  };

  const handleDeleteTrip = (trip) => {
    Alert.alert(
      'Seyahati Sil',
      `"${trip.title}" seyahatini ve bu seyahate ait tüm not ve harcamaları silmek istediğinizden emin misiniz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrip(trip.id);
              await loadData();
            } catch (err) {
              Alert.alert('Hata', 'Seyahat silinemedi.');
            }
          },
        },
      ]
    );
  };

  const filteredTrips = trips.filter((t) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchTitle = t.title?.toLowerCase().includes(query);
    const matchCity = t.city?.toLowerCase().includes(query);
    return matchTitle || matchCity;
  });

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

  const statusBarPadding = Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 12;

  return (
    <View style={[styles.container, { paddingTop: statusBarPadding }]}>
      {/* App Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandingCol}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Compass size={22} color="#0284C7" strokeWidth={2.4} />
            </View>
            <Text style={styles.appName}>RotaDefteri</Text>
          </View>
          <Text style={styles.appTagline}>Gezi & Seyahat Not Defteri</Text>
        </View>

        <Pressable
          onPress={handleOpenAddModal}
          style={styles.headerAddBtn}
          android_ripple={{ color: '#E0F2FE' }}
        >
          <Plus size={18} color="#0284C7" strokeWidth={2.4} />
          <Text style={styles.headerAddText}>Yeni</Text>
        </Pressable>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <Search size={18} color="#94A3B8" strokeWidth={2} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Seyahat veya şehir ara..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8} style={styles.clearSearchBtn}>
              <X size={15} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Trip List or Empty State */}
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            stats={tripStats[item.id]}
            onPress={() => onSelectTrip(item)}
            onDelete={handleDeleteTrip}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          filteredTrips.length === 0 && styles.listContentEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0284C7"
            colors={['#0284C7']}
          />
        }
        ListHeaderComponent={
          filteredTrips.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderTitle}>Planlanan Rotalar</Text>
              <Text style={styles.listHeaderBadge}>{filteredTrips.length} seyahat</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Sparkles size={36} color="#0284C7" strokeWidth={1.8} />
              </View>
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'Aramanıza Uygun Rota Bulunamadı' : 'Henüz Bir Seyahat Eklenmedi'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `"${searchQuery}" ile eşleşen bir seyahat kaydı bulunamadı. Aramanızı değiştirebilir veya yeni bir rota ekleyebilirsiniz.`
                  : 'Yeni bir seyahat rotası oluşturun, ziyaret edeceğiniz yerleri ve bütçenizi kolayca takip edin.'}
              </Text>
              <Pressable
                onPress={handleOpenAddModal}
                style={styles.emptyActionButton}
              >
                <Plus size={18} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.emptyActionText}>Yeni Seyahat Planla</Text>
              </Pressable>
            </View>
          )
        }
      />

      {/* Floating Action Button */}
      {filteredTrips.length > 0 && (
        <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
          <Pressable
            onPress={handleOpenAddModal}
            onPressIn={handleFabPressIn}
            onPressOut={handleFabPressOut}
            style={styles.fabButton}
          >
            <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.fabText}>Seyahat Ekle</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Add Trip Modal Sheet */}
      <ModalSheet
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        title="Yeni Seyahat Planla"
        subtitle="Rotanızı belirleyin ve bütçenizi kontrol altında tutun"
      >
        <View style={styles.formContainer}>
          {formError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Seyahat Başlığı <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: Ege & Akdeniz Kaçamağı"
              placeholderTextColor="#94A3B8"
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
              <MapPin size={14} color="#0284C7" strokeWidth={2} />
              <Text style={styles.inputLabel}>Şehir veya Rota</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: Antalya, Kaş - Kalkan"
              placeholderTextColor="#94A3B8"
              value={city}
              onChangeText={setCity}
            />
          </View>

          {/* Dates Row */}
          <View style={styles.rowTwoCols}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <View style={styles.labelRow}>
                <Calendar size={14} color="#64748B" strokeWidth={2} />
                <Text style={styles.inputLabel}>Başlangıç</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-AA-GG"
                placeholderTextColor="#94A3B8"
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <View style={styles.labelRow}>
                <Calendar size={14} color="#64748B" strokeWidth={2} />
                <Text style={styles.inputLabel}>Bitiş</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-AA-GG"
                placeholderTextColor="#94A3B8"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>

          {/* Budget & Currency */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Wallet size={14} color="#059669" strokeWidth={2} />
              <Text style={styles.inputLabel}>Hedef Bütçe</Text>
            </View>
            <View style={styles.budgetRow}>
              <TextInput
                style={[styles.textInput, styles.budgetInput]}
                placeholder="25000"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={budget}
                onChangeText={setBudget}
              />

              {/* Currency Selector Chips */}
              <View style={styles.currencyChips}>
                {CURRENCY_OPTIONS.map((curr) => {
                  const isSelected = currency === curr;
                  return (
                    <Pressable
                      key={curr}
                      onPress={() => setCurrency(curr)}
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
                        {curr}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Modal Action Buttons */}
          <View style={styles.modalButtonsRow}>
            <Pressable
              onPress={() => setIsAddModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </Pressable>

            <Pressable
              onPress={handleSaveTrip}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Seyahati Kaydet</Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
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
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  headerAddText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginBottom: 12,
    marginTop: 4,
  },
  listHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listHeaderBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
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
    paddingHorizontal: 36,
    paddingVertical: 40,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
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

  // Modal Form Styles
  formContainer: {
    gap: 16,
  },
  errorBox: {
    backgroundColor: '#FFE4E6',
    borderLeftWidth: 4,
    borderLeftColor: '#E11D48',
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#9F1239',
    fontSize: 13,
    fontWeight: '500',
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  requiredStar: {
    color: '#E11D48',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
  rowTwoCols: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  budgetInput: {
    flex: 1,
  },
  currencyChips: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
  },
  currencyChip: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 9,
  },
  currencyChipSelected: {
    backgroundColor: '#0284C7',
  },
  currencyChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  currencyChipTextSelected: {
    color: '#FFFFFF',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#0284C7',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
