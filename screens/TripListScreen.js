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
  Sparkles,
} from 'lucide-react-native';
import TripCard from '../components/TripCard';
import ModalSheet from '../components/ModalSheet';
import { getTrips, saveTrip, deleteTrip, getTripStats, WORLD_CURRENCIES } from '../utils/storage';

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

      await saveTrip(newTripData);
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

  const statusBarPadding = Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 12;

  return (
    <View style={[styles.container, { paddingTop: statusBarPadding }]}>
      {/* App Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandingCol}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Compass size={18} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <Text style={styles.appName}>RotaDefteri</Text>
          </View>
          <Text style={styles.appTagline}>Gezi & Seyahat Not Defteri</Text>
        </View>

        <Pressable
          onPress={handleOpenAddModal}
          style={({ pressed }) => [
            styles.headerAddBtn,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Plus size={15} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.headerAddText}>Yeni Seyahat</Text>
        </Pressable>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <Search size={16} color="#A1A1AA" strokeWidth={2} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Seyahat veya şehir ara..."
            placeholderTextColor="#A1A1AA"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8} style={styles.clearSearchBtn}>
              <X size={14} color="#71717A" />
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
            tintColor="#18181B"
            colors={['#18181B']}
          />
        }
        ListHeaderComponent={
          filteredTrips.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderTitle}>Planlanan Rotalar</Text>
              <Text style={styles.listHeaderBadge}>{filteredTrips.length} rota</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Compass size={32} color="#71717A" strokeWidth={1.8} />
              </View>
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'Aramanıza Uygun Rota Bulunamadı' : 'Henüz Bir Seyahat Eklenmedi'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `"${searchQuery}" ile eşleşen bir seyahat kaydı bulunamadı.`
                  : 'Yeni bir seyahat rotası oluşturun, bütçenizi ve ziyaret yerlerinizi kolayca takip edin.'}
              </Text>
              <Pressable
                onPress={handleOpenAddModal}
                style={styles.emptyActionButton}
              >
                <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
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
            <Plus size={18} color="#FFFFFF" strokeWidth={2.4} />
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
              placeholderTextColor="#A1A1AA"
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
              <MapPin size={13} color="#71717A" strokeWidth={2} />
              <Text style={styles.inputLabel}>Şehir veya Rota</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: Antalya, Kaş - Kalkan"
              placeholderTextColor="#A1A1AA"
              value={city}
              onChangeText={setCity}
            />
          </View>

          {/* Dates Row */}
          <View style={styles.rowTwoCols}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
              <View style={styles.labelRow}>
                <Calendar size={13} color="#71717A" strokeWidth={2} />
                <Text style={styles.inputLabel}>Başlangıç</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-AA-GG"
                placeholderTextColor="#A1A1AA"
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
              <View style={styles.labelRow}>
                <Calendar size={13} color="#71717A" strokeWidth={2} />
                <Text style={styles.inputLabel}>Bitiş</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-AA-GG"
                placeholderTextColor="#A1A1AA"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>

          {/* Budget Input */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Wallet size={13} color="#71717A" strokeWidth={2} />
              <Text style={styles.inputLabel}>Hedef Bütçe</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: 30000"
              placeholderTextColor="#A1A1AA"
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
            />
          </View>

          {/* Currency Selector Chips (Top 8 Currencies + TRY) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Para Birimi</Text>
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
    backgroundColor: '#FAFAFA',
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
    backgroundColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#09090B',
    letterSpacing: -0.4,
  },
  appTagline: {
    fontSize: 11,
    fontWeight: '500',
    color: '#71717A',
    marginTop: 1,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#18181B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  headerAddText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
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
    color: '#09090B',
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
    color: '#71717A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listHeaderBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#52525B',
    backgroundColor: '#F4F4F5',
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
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#18181B',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
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
