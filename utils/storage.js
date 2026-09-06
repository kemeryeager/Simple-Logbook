import AsyncStoragePackage from '@react-native-async-storage/async-storage';

// Safe resolver for both Metro (React Native) and Node.js / Jest environments
const AsyncStorage =
  AsyncStoragePackage?.default?.default ||
  AsyncStoragePackage?.default ||
  AsyncStoragePackage;

export const KEYS = {
  TRIPS: '@gezi_notlari_trips',
  PLACES: '@gezi_notlari_places',
  EXPENSES: '@gezi_notlari_expenses',
};

// Seed sample trip if first time launching for delightful initial experience
export const INITIAL_TRIPS = [
  {
    id: 'sample-trip-1',
    title: 'Ege & Akdeniz Kaçamağı',
    city: 'Antalya, Kaş',
    startDate: '2026-06-15',
    endDate: '2026-06-22',
    budget: 25000,
    currency: '₺',
    createdAt: '2026-06-01T10:00:00.000Z',
  },
];

export const INITIAL_PLACES = [
  {
    id: 'sample-place-1',
    tripId: 'sample-trip-1',
    name: 'Kaputaş Plajı',
    notes: 'Turkuaz deniz ve sabah erken saatte gitmek şart.',
    category: 'Doğa / Plaj',
    date: '2026-06-16',
    createdAt: '2026-06-01T10:05:00.000Z',
  },
  {
    id: 'sample-place-2',
    tripId: 'sample-trip-1',
    name: 'Antik Tiyatro',
    notes: 'Gün batımında harika manzara.',
    category: 'Tarihi Yer',
    date: '2026-06-17',
    createdAt: '2026-06-01T10:10:00.000Z',
  },
];

export const INITIAL_EXPENSES = [
  {
    id: 'sample-expense-1',
    tripId: 'sample-trip-1',
    title: 'Kaş Butik Otel (3 Gece)',
    amount: 10500,
    category: 'Konaklama',
    date: '2026-06-15',
    createdAt: '2026-06-01T10:15:00.000Z',
  },
  {
    id: 'sample-expense-2',
    tripId: 'sample-trip-1',
    title: 'Akşam Yemeği - Balıkçılar',
    amount: 2400,
    category: 'Yeme / İçme',
    date: '2026-06-16',
    createdAt: '2026-06-01T10:20:00.000Z',
  },
];

// --- UTILITIES & PARSING ---

/**
 * Safe JSON parser that never throws and returns fallback on corruption.
 */
export const safeJsonParse = (jsonString, fallback = []) => {
  if (!jsonString || typeof jsonString !== 'string') return fallback;
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      return fallback;
    }
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn('Storage JSON parse warning, using fallback:', err?.message);
    return fallback;
  }
};

/**
 * Generate a collision-resistant unique ID.
 */
export const generateId = (prefix = 'item') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Parses numeric budget/amount values safely.
 * Non-numeric strings, negatives, and NaN become 0 (or clamped positive).
 */
export const safeNumber = (val, fallback = 0, allowNegative = false) => {
  if (val === null || val === undefined || val === '') return fallback;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, '.'));
  if (isNaN(num) || !isFinite(num)) return fallback;
  return allowNegative ? num : Math.max(0, num);
};

// --- STATS & BUDGET CALCULATIONS ---

/**
 * Synchronous pure function for budget calculations with zero-division guard.
 *
 * @param {Array} expenses - Array of expense objects
 * @param {number|string} tripBudget - Total budget allocated for the trip
 * @returns {Object} { totalSpent, remaining, percent, clampedPercent, expenseCount, isOverBudget }
 */
export const calculateBudgetStats = (expenses = [], tripBudget = 0) => {
  const safeBudget = safeNumber(tripBudget, 0, false);
  const expenseList = Array.isArray(expenses) ? expenses : [];

  const rawSpent = expenseList.reduce((sum, item) => {
    const amt = safeNumber(item?.amount, 0, false);
    return sum + amt;
  }, 0);

  // Guard against float precision issues like 0.1 + 0.2 = 0.30000000000000004
  const totalSpent = Math.round((rawSpent + Number.EPSILON) * 100) / 100;
  const remaining = Math.round((safeBudget - totalSpent + Number.EPSILON) * 100) / 100;

  // Zero-division guard: if budget <= 0, percent is 0
  const percent = safeBudget > 0 ? Math.round((totalSpent / safeBudget) * 100) : 0;
  const clampedPercent = Math.min(Math.max(percent, 0), 100);
  const isOverBudget = safeBudget > 0 && totalSpent > safeBudget;

  return {
    totalSpent,
    remaining,
    percent,
    clampedPercent,
    expenseCount: expenseList.length,
    isOverBudget,
  };
};

// --- DATE & FORMATTING HELPERS ---

export const TURKISH_MONTHS = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
];

export const TURKISH_MONTHS_FULL = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

/**
 * Format a single date string (YYYY-MM-DD or ISO string) to Turkish format (e.g. '15 Haz 2026')
 */
export const formatDate = (dateStr, options = { fullMonth: false }) => {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = cleanStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(monthIdx) || isNaN(day) || monthIdx < 0 || monthIdx > 11) return dateStr;

  const monthList = options.fullMonth ? TURKISH_MONTHS_FULL : TURKISH_MONTHS;
  return `${day} ${monthList[monthIdx]} ${year}`;
};

/**
 * Format start and end date range into a clean human-readable string.
 * Example: '15 - 22 Haz 2026' or '28 Ara 2026 - 4 Oca 2027'
 */
export const formatDateRange = (start, end) => {
  if (!start && !end) return '';

  const parse = (d) => {
    if (!d || typeof d !== 'string') return null;
    const clean = d.includes('T') ? d.split('T')[0] : d;
    const parts = clean.split('-');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[2], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[0];
    if (isNaN(day) || isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return null;
    return { day, monthIndex, month: TURKISH_MONTHS[monthIndex], year };
  };

  const s = parse(start);
  const e = parse(end);

  if (s && e) {
    if (s.year === e.year) {
      if (s.monthIndex === e.monthIndex) {
        if (s.day === e.day) return `${s.day} ${s.month} ${s.year}`;
        return `${s.day} - ${e.day} ${s.month} ${s.year}`;
      }
      return `${s.day} ${s.month} - ${e.day} ${e.month} ${s.year}`;
    }
    return `${s.day} ${s.month} ${s.year} - ${e.day} ${e.month} ${e.year}`;
  }

  if (s) return `${s.day} ${s.month} ${s.year}`;
  if (e) return `${e.day} ${e.month} ${e.year}`;
  return start || end || '';
};

/**
 * Formats a currency amount with Turkish thousand separator and currency symbol.
 */
export const formatCurrency = (amount, currency = '₺') => {
  const num = safeNumber(amount, 0, true);
  return `${num.toLocaleString('tr-TR')} ${currency}`;
};

// --- SORTING HELPERS ---

/**
 * Sort trips by date (startDate, falling back to createdAt).
 * @param {Array} trips
 * @param {'desc'|'asc'} order - Default 'desc' (upcoming / newest first)
 */
export const sortTripsByDate = (trips = [], order = 'desc') => {
  if (!Array.isArray(trips)) return [];
  return [...trips].sort((a, b) => {
    const dateA = a.startDate || a.createdAt || '';
    const dateB = b.startDate || b.createdAt || '';
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    const comp = dateA.localeCompare(dateB);
    return order === 'desc' ? -comp : comp;
  });
};

/**
 * Sort places by date chronologically.
 * @param {Array} places
 * @param {'asc'|'desc'} order - Default 'asc' (Day 1, Day 2 order)
 */
export const sortPlacesByDate = (places = [], order = 'asc') => {
  if (!Array.isArray(places)) return [];
  return [...places].sort((a, b) => {
    const dateA = a.date || a.createdAt || '';
    const dateB = b.date || b.createdAt || '';
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    const comp = dateA.localeCompare(dateB);
    return order === 'asc' ? comp : -comp;
  });
};

/**
 * Sort expenses by date.
 * @param {Array} expenses
 * @param {'desc'|'asc'} order - Default 'desc' (most recent expenses first)
 */
export const sortExpensesByDate = (expenses = [], order = 'desc') => {
  if (!Array.isArray(expenses)) return [];
  return [...expenses].sort((a, b) => {
    const dateA = a.date || a.createdAt || '';
    const dateB = b.date || b.createdAt || '';
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    const comp = dateA.localeCompare(dateB);
    return order === 'desc' ? -comp : comp;
  });
};

// --- VALIDATION HELPERS ---

/**
 * Validates a Trip object according to CONTEXT.md requirements.
 */
export const validateTrip = (trip) => {
  const errors = [];
  if (!trip || typeof trip !== 'object') {
    return { isValid: false, errors: ['Geçersiz seyahat verisi.'] };
  }
  if (!trip.title || !String(trip.title).trim()) {
    errors.push('Seyahat başlığı zorunludur.');
  }
  if (trip.budget !== undefined && trip.budget !== null) {
    const b = safeNumber(trip.budget, 0, false);
    if (isNaN(b) || b < 0) {
      errors.push('Bütçe 0 veya daha büyük bir sayı olmalıdır.');
    }
  }
  if (trip.startDate && trip.endDate) {
    if (trip.startDate > trip.endDate) {
      errors.push('Bitiş tarihi, başlangıç tarihinden önce olamaz.');
    }
  }
  return { isValid: errors.length === 0, errors };
};

/**
 * Validates a Place object according to CONTEXT.md requirements.
 */
export const validatePlace = (place) => {
  const errors = [];
  if (!place || typeof place !== 'object') {
    return { isValid: false, errors: ['Geçersiz yer verisi.'] };
  }
  if (!place.tripId || !String(place.tripId).trim()) {
    errors.push('Gezilecek yerin bir seyahatle (tripId) ilişkili olması gerekir.');
  }
  if (!place.name || !String(place.name).trim()) {
    errors.push('Yer / mekan adı zorunludur.');
  }
  return { isValid: errors.length === 0, errors };
};

/**
 * Validates an Expense object according to CONTEXT.md requirements.
 */
export const validateExpense = (expense) => {
  const errors = [];
  if (!expense || typeof expense !== 'object') {
    return { isValid: false, errors: ['Geçersiz harcama verisi.'] };
  }
  if (!expense.tripId || !String(expense.tripId).trim()) {
    errors.push('Harcamanın bir seyahatle (tripId) ilişkili olması gerekir.');
  }
  if (!expense.title || !String(expense.title).trim()) {
    errors.push('Harcama başlığı zorunludur.');
  }
  const rawAmt = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount);
  if (isNaN(rawAmt) || rawAmt <= 0) {
    errors.push("Harcama tutarı 0'dan büyük geçerli bir sayı olmalıdır.");
  }
  return { isValid: errors.length === 0, errors };
};

// --- TRIPS CRUD ---

export const getTrips = async () => {
  try {
    const json = await AsyncStorage.getItem(KEYS.TRIPS);
    if (json === null) {
      // First launch seed
      await AsyncStorage.multiSet([
        [KEYS.TRIPS, JSON.stringify(INITIAL_TRIPS)],
        [KEYS.PLACES, JSON.stringify(INITIAL_PLACES)],
        [KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES)],
      ]);
      return sortTripsByDate(INITIAL_TRIPS, 'desc');
    }
    const trips = safeJsonParse(json, []);
    return sortTripsByDate(trips, 'desc');
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
};

export const getTripById = async (tripId) => {
  try {
    if (!tripId) return null;
    const trips = await getTrips();
    return trips.find((t) => String(t.id) === String(tripId)) || null;
  } catch (error) {
    console.error('Error fetching trip by id:', error);
    return null;
  }
};

export const saveTrip = async (trip) => {
  try {
    if (!trip || typeof trip !== 'object') {
      throw new Error('Geçersiz seyahat verisi.');
    }
    const trips = await getTrips();
    const id = trip.id ? String(trip.id) : generateId('trip');
    const existingIndex = trips.findIndex((t) => String(t.id) === id);
    const existing = existingIndex >= 0 ? trips[existingIndex] : {};

    const normalizedTrip = {
      ...existing,
      ...trip,
      id,
      title: String(trip.title !== undefined ? trip.title : (existing.title || '')).trim(),
      city: String(trip.city !== undefined ? trip.city : (existing.city || '')).trim(),
      startDate: trip.startDate !== undefined ? trip.startDate : (existing.startDate || ''),
      endDate: trip.endDate !== undefined ? trip.endDate : (existing.endDate || ''),
      budget: safeNumber(trip.budget !== undefined ? trip.budget : existing.budget, 0, false),
      currency: trip.currency || existing.currency || '₺',
      createdAt: existing.createdAt || trip.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedTrips;
    if (existingIndex >= 0) {
      updatedTrips = [...trips];
      updatedTrips[existingIndex] = normalizedTrip;
    } else {
      updatedTrips = [normalizedTrip, ...trips];
    }

    await AsyncStorage.setItem(KEYS.TRIPS, JSON.stringify(updatedTrips));
    return normalizedTrip;
  } catch (error) {
    console.error('Error saving trip:', error);
    throw error;
  }
};

export const deleteTrip = async (tripId) => {
  try {
    if (!tripId) return false;
    const targetId = String(tripId);

    const trips = await getTrips();
    const updatedTrips = trips.filter((t) => String(t.id) !== targetId);

    // Cascade delete places and expenses associated with this trip
    const allPlaces = await getAllPlaces();
    const updatedPlaces = allPlaces.filter((p) => String(p.tripId) !== targetId);

    const allExpenses = await getAllExpenses();
    const updatedExpenses = allExpenses.filter((e) => String(e.tripId) !== targetId);

    // Atomic multiSet persist to ensure offline data integrity
    await AsyncStorage.multiSet([
      [KEYS.TRIPS, JSON.stringify(updatedTrips)],
      [KEYS.PLACES, JSON.stringify(updatedPlaces)],
      [KEYS.EXPENSES, JSON.stringify(updatedExpenses)],
    ]);

    return true;
  } catch (error) {
    console.error('Error deleting trip with cascade:', error);
    throw error;
  }
};

// --- PLACES CRUD ---

export const getAllPlaces = async () => {
  try {
    const json = await AsyncStorage.getItem(KEYS.PLACES);
    return safeJsonParse(json, []);
  } catch (error) {
    console.error('Error fetching all places:', error);
    return [];
  }
};

export const getPlaces = async (tripId) => {
  try {
    if (!tripId) return [];
    const places = await getAllPlaces();
    const filtered = places.filter((p) => String(p.tripId) === String(tripId));
    return sortPlacesByDate(filtered, 'asc');
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

export const savePlace = async (place) => {
  try {
    if (!place || typeof place !== 'object') {
      throw new Error('Geçersiz yer verisi.');
    }
    const places = await getAllPlaces();
    const id = place.id ? String(place.id) : generateId('place');
    const existingIndex = places.findIndex((p) => String(p.id) === id);
    const existing = existingIndex >= 0 ? places[existingIndex] : {};

    const normalizedPlace = {
      ...existing,
      ...place,
      id,
      tripId: String(place.tripId || existing.tripId || ''),
      name: String(place.name !== undefined ? place.name : (existing.name || '')).trim(),
      notes: String(place.notes !== undefined ? place.notes : (existing.notes || '')).trim(),
      category: place.category || existing.category || 'Diğer',
      date: place.date !== undefined ? place.date : (existing.date || ''),
      createdAt: existing.createdAt || place.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedPlaces;
    if (existingIndex >= 0) {
      updatedPlaces = [...places];
      updatedPlaces[existingIndex] = normalizedPlace;
    } else {
      updatedPlaces = [normalizedPlace, ...places];
    }

    await AsyncStorage.setItem(KEYS.PLACES, JSON.stringify(updatedPlaces));
    return normalizedPlace;
  } catch (error) {
    console.error('Error saving place:', error);
    throw error;
  }
};

export const deletePlace = async (placeId) => {
  try {
    if (!placeId) return false;
    const targetId = String(placeId);
    const places = await getAllPlaces();
    const updated = places.filter((p) => String(p.id) !== targetId);
    await AsyncStorage.setItem(KEYS.PLACES, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error deleting place:', error);
    throw error;
  }
};

// --- EXPENSES CRUD ---

export const getAllExpenses = async () => {
  try {
    const json = await AsyncStorage.getItem(KEYS.EXPENSES);
    return safeJsonParse(json, []);
  } catch (error) {
    console.error('Error fetching all expenses:', error);
    return [];
  }
};

export const getExpenses = async (tripId) => {
  try {
    if (!tripId) return [];
    const expenses = await getAllExpenses();
    const filtered = expenses.filter((e) => String(e.tripId) === String(tripId));
    return sortExpensesByDate(filtered, 'desc');
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
};

export const saveExpense = async (expense) => {
  try {
    if (!expense || typeof expense !== 'object') {
      throw new Error('Geçersiz harcama verisi.');
    }
    const expenses = await getAllExpenses();
    const id = expense.id ? String(expense.id) : generateId('expense');
    const existingIndex = expenses.findIndex((e) => String(e.id) === id);
    const existing = existingIndex >= 0 ? expenses[existingIndex] : {};

    const rawAmount = expense.amount !== undefined ? expense.amount : existing.amount;
    const safeAmt = Math.round(safeNumber(rawAmount, 0, false) * 100) / 100;

    const normalizedExpense = {
      ...existing,
      ...expense,
      id,
      tripId: String(expense.tripId || existing.tripId || ''),
      title: String(expense.title !== undefined ? expense.title : (existing.title || '')).trim(),
      amount: safeAmt,
      category: expense.category || existing.category || 'Diğer',
      date: expense.date !== undefined ? expense.date : (existing.date || ''),
      createdAt: existing.createdAt || expense.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedExpenses;
    if (existingIndex >= 0) {
      updatedExpenses = [...expenses];
      updatedExpenses[existingIndex] = normalizedExpense;
    } else {
      updatedExpenses = [normalizedExpense, ...expenses];
    }

    await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(updatedExpenses));
    return normalizedExpense;
  } catch (error) {
    console.error('Error saving expense:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    if (!expenseId) return false;
    const targetId = String(expenseId);
    const expenses = await getAllExpenses();
    const updated = expenses.filter((e) => String(e.id) !== targetId);
    await AsyncStorage.setItem(KEYS.EXPENSES, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// --- STATS HELPER ---

export const getTripStats = async (tripId, tripBudget = 0) => {
  try {
    if (!tripId) {
      return calculateBudgetStats([], tripBudget);
    }
    const expenses = await getExpenses(tripId);
    return calculateBudgetStats(expenses, tripBudget);
  } catch (error) {
    console.error('Error computing trip stats:', error);
    return {
      totalSpent: 0,
      remaining: safeNumber(tripBudget, 0, false),
      percent: 0,
      clampedPercent: 0,
      expenseCount: 0,
      isOverBudget: false,
    };
  }
};

// --- DATA MANAGEMENT / TEST HELPERS ---

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([KEYS.TRIPS, KEYS.PLACES, KEYS.EXPENSES]);
    return true;
  } catch (error) {
    console.error('Error clearing all storage data:', error);
    return false;
  }
};

export const resetToSampleData = async () => {
  try {
    await AsyncStorage.multiSet([
      [KEYS.TRIPS, JSON.stringify(INITIAL_TRIPS)],
      [KEYS.PLACES, JSON.stringify(INITIAL_PLACES)],
      [KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES)],
    ]);
    return true;
  } catch (error) {
    console.error('Error resetting to sample data:', error);
    return false;
  }
};
