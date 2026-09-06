import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStoragePackage from '@react-native-async-storage/async-storage';

// Safe AsyncStorage resolver for both Metro bundler and Node/Jest testing
const AsyncStorage =
  AsyncStoragePackage?.default?.default ||
  AsyncStoragePackage?.default ||
  AsyncStoragePackage;

export const SETTINGS_STORAGE_KEY = '@gezi_notlari_app_settings';

// Defensive loader for external translations helper if available
let externalT = null;
try {
  // eslint-disable-next-line global-require
  const trMod = require('../utils/translations');
  externalT = trMod?.t || trMod?.default?.t || null;
} catch (e) {
  // Gracefully fallback to internal TRANSLATIONS
}

/**
 * Modern, polished design tokens for Light and Dark themes.
 * Adheres to the clean, minimalist black-and-white aesthetic.
 */
export const LIGHT_THEME = {
  canvas: '#FAFAFA',
  card: '#FFFFFF',
  cardMuted: '#FAFAFA',
  border: '#E4E4E7',
  borderMuted: '#F4F4F5',
  textPrimary: '#09090B',
  textSecondary: '#52525B',
  textMuted: '#71717A',
  btnPrimaryBg: '#18181B',
  btnPrimaryText: '#FFFFFF',
  btnSecondaryBg: '#F4F4F5',
  btnSecondaryText: '#52525B',
  inputBg: '#FFFFFF',
  statusBarStyle: 'dark',
  statusBarBg: '#FFFFFF',
};

export const DARK_THEME = {
  canvas: '#09090B',
  card: '#18181B',
  cardMuted: '#121214',
  border: '#27272A',
  borderMuted: '#1E1E22',
  textPrimary: '#FAFAFA',
  textSecondary: '#D4D4D8',
  textMuted: '#A1A1AA',
  btnPrimaryBg: '#F4F4F5',
  btnPrimaryText: '#09090B',
  btnSecondaryBg: '#27272A',
  btnSecondaryText: '#D4D4D8',
  inputBg: '#121214',
  statusBarStyle: 'light',
  statusBarBg: '#09090B',
};

export const THEMES = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
};

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

export const VALID_LANGUAGE_CODES = ['tr', 'en', 'es', 'de', 'fr', 'ja'];

export const TRANSLATIONS = {
  tr: {
    // Settings & General
    settings: 'Ayarlar',
    settingsSubtitle: 'Görünüm ve dil tercihleri',
    appearance: 'Görünüm',
    appearanceDesc: 'Uygulama renk teması',
    theme: 'Tema',
    darkMode: 'Karanlık Tema',
    darkModeDesc: 'Gece kullanımı için koyu renk paleti',
    lightMode: 'Aydınlık Tema',
    lightModeDesc: 'Ferah ve aydınlık renk paleti',
    language: 'Dil',
    languageDesc: 'Uygulama arayüz dili',
    active: 'Aktif',
    close: 'Kapat',
    save: 'Kaydet',
    cancel: 'Vazgeç',
    delete: 'Sil',
    edit: 'Düzenle',
    done: 'Tamam',
    confirm: 'Onayla',
    back: 'Geri',

    // Trips
    trips: 'Seyahatler',
    myTrips: 'Seyahatlerim',
    newTrip: 'Yeni Seyahat',
    planTrip: 'Seyahat Planla',
    tripTitle: 'Seyahat Başlığı',
    destination: 'Şehir / Rota',
    startDate: 'Başlangıç Tarihi',
    endDate: 'Bitiş Tarihi',
    budget: 'Bütçe',
    currency: 'Para Birimi',
    search: 'Ara...',
    searchPlaceholder: 'Seyahat veya şehir ara...',
    noTrips: 'Henüz planlanmış seyahat yok',
    noTripsDesc: 'Yeni bir seyahat planlayarak başlayın',
    deleteTripConfirm: 'Bu seyahati silmek istediğinize emin misiniz?',

    // Places
    places: 'Ziyaret Edilen Yerler',
    addPlace: 'Yer Ekle',
    placeName: 'Yer / Mekan Adı',
    notes: 'Notlar',
    category: 'Kategori',
    noPlaces: 'Henüz ziyaret edilen yer eklenmedi',

    // Expenses & Budget
    expenses: 'Harcamalar',
    addExpense: 'Harcama Ekle',
    expenseTitle: 'Harcama Başlığı',
    amount: 'Tutar',
    totalSpent: 'Toplam Harcanan',
    remaining: 'Kalan Bütçe',
    overBudget: 'Bütçe Aşıldı',
    budgetUsed: 'Bütçe Kullanımı',
    noExpenses: 'Henüz harcama kaydı yok',
  },
  en: {
    settings: 'Settings',
    settingsSubtitle: 'Appearance and language preferences',
    appearance: 'Appearance',
    appearanceDesc: 'App color theme',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Dark color palette for night use',
    lightMode: 'Light Mode',
    lightModeDesc: 'Crisp and bright color palette',
    language: 'Language',
    languageDesc: 'App display language',
    active: 'Active',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    done: 'Done',
    confirm: 'Confirm',
    back: 'Back',

    trips: 'Trips',
    myTrips: 'My Trips',
    newTrip: 'New Trip',
    planTrip: 'Plan Trip',
    tripTitle: 'Trip Title',
    destination: 'City / Route',
    startDate: 'Start Date',
    endDate: 'End Date',
    budget: 'Budget',
    currency: 'Currency',
    search: 'Search...',
    searchPlaceholder: 'Search trips or cities...',
    noTrips: 'No trips planned yet',
    noTripsDesc: 'Start by planning a new adventure',
    deleteTripConfirm: 'Are you sure you want to delete this trip?',

    places: 'Visited Places',
    addPlace: 'Add Place',
    placeName: 'Place Name',
    notes: 'Notes',
    category: 'Category',
    noPlaces: 'No visited places added yet',

    expenses: 'Expenses',
    addExpense: 'Add Expense',
    expenseTitle: 'Expense Title',
    amount: 'Amount',
    totalSpent: 'Total Spent',
    remaining: 'Remaining Budget',
    overBudget: 'Over Budget',
    budgetUsed: 'Budget Usage',
    noExpenses: 'No expense records yet',
  },
  es: {
    settings: 'Configuración',
    settingsSubtitle: 'Preferencias de apariencia e idioma',
    appearance: 'Apariencia',
    appearanceDesc: 'Tema de color de la aplicación',
    theme: 'Tema',
    darkMode: 'Modo Oscuro',
    darkModeDesc: 'Paleta de colores oscuros para la noche',
    lightMode: 'Modo Claro',
    lightModeDesc: 'Paleta fresca y luminosa',
    language: 'Idioma',
    languageDesc: 'Idioma de la interfaz',
    active: 'Activo',
    close: 'Cerrar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    done: 'Listo',
    confirm: 'Confirmar',
    back: 'Volver',

    trips: 'Viajes',
    myTrips: 'Mis Viajes',
    newTrip: 'Nuevo Viaje',
    planTrip: 'Planificar Viaje',
    tripTitle: 'Título del Viaje',
    destination: 'Ciudad / Ruta',
    startDate: 'Fecha de Inicio',
    endDate: 'Fecha de Fin',
    budget: 'Presupuesto',
    currency: 'Moneda',
    search: 'Buscar...',
    searchPlaceholder: 'Buscar viajes o ciudades...',
    noTrips: 'Aún no hay viajes planificados',
    noTripsDesc: 'Comienza planificando una nueva aventura',
    deleteTripConfirm: '¿Estás seguro de que deseas eliminar este viaje?',

    places: 'Lugares Visitados',
    addPlace: 'Añadir Lugar',
    placeName: 'Nombre del Lugar',
    notes: 'Notas',
    category: 'Categoría',
    noPlaces: 'Aún no hay lugares añadidos',

    expenses: 'Gastos',
    addExpense: 'Añadir Gasto',
    expenseTitle: 'Título del Gasto',
    amount: 'Monto',
    totalSpent: 'Total Gastado',
    remaining: 'Presupuesto Restante',
    overBudget: 'Presupuesto Superado',
    budgetUsed: 'Uso del Presupuesto',
    noExpenses: 'Aún no hay registros de gastos',
  },
  de: {
    settings: 'Einstellungen',
    settingsSubtitle: 'Erscheinungsbild- und Spracheinstellungen',
    appearance: 'Erscheinungsbild',
    appearanceDesc: 'Farbschema der App',
    theme: 'Design',
    darkMode: 'Dunkelmodus',
    darkModeDesc: 'Dunkle Farbpalette für die Nacht',
    lightMode: 'Hellmodus',
    lightModeDesc: 'Helle und freundliche Farbpalette',
    language: 'Sprache',
    languageDesc: 'App-Anzeigesprache',
    active: 'Aktiv',
    close: 'Schließen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    done: 'Fertig',
    confirm: 'Bestätigen',
    back: 'Zurück',

    trips: 'Reisen',
    myTrips: 'Meine Reisen',
    newTrip: 'Neue Reise',
    planTrip: 'Reise Planen',
    tripTitle: 'Reisetitel',
    destination: 'Stadt / Route',
    startDate: 'Startdatum',
    endDate: 'Enddatum',
    budget: 'Budget',
    currency: 'Währung',
    search: 'Suchen...',
    searchPlaceholder: 'Reisen oder Städte suchen...',
    noTrips: 'Noch keine Reisen geplant',
    noTripsDesc: 'Beginnen Sie mit der Planung eines neuen Abenteuers',
    deleteTripConfirm: 'Möchten Sie diese Reise wirklich löschen?',

    places: 'Besuchte Orte',
    addPlace: 'Ort Hinzufügen',
    placeName: 'Ortsname',
    notes: 'Notizen',
    category: 'Kategorie',
    noPlaces: 'Noch keine besuchten Orte hinzugefügt',

    expenses: 'Ausgaben',
    addExpense: 'Ausgabe Hinzufügen',
    expenseTitle: 'Titel der Ausgabe',
    amount: 'Betrag',
    totalSpent: 'Gesamtausgaben',
    remaining: 'Restbudget',
    overBudget: 'Budget Überschritten',
    budgetUsed: 'Budgetnutzung',
    noExpenses: 'Noch keine Ausgaben erfasst',
  },
  fr: {
    settings: 'Paramètres',
    settingsSubtitle: "Préférences d'apparence et de langue",
    appearance: 'Apparence',
    appearanceDesc: "Thème de couleur de l'application",
    theme: 'Thème',
    darkMode: 'Mode Sombre',
    darkModeDesc: 'Palette de couleurs sombres pour la nuit',
    lightMode: 'Mode Clair',
    lightModeDesc: 'Palette de couleurs claire et nette',
    language: 'Langue',
    languageDesc: "Langue d'affichage",
    active: 'Actif',
    close: 'Fermer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    done: 'Terminé',
    confirm: 'Confirmer',
    back: 'Retour',

    trips: 'Voyages',
    myTrips: 'Mes Voyages',
    newTrip: 'Nouveau Voyage',
    planTrip: 'Planifier un Voyage',
    tripTitle: 'Titre du Voyage',
    destination: 'Ville / Itinéraire',
    startDate: 'Date de Début',
    endDate: 'Date de Fin',
    budget: 'Budget',
    currency: 'Devise',
    search: 'Rechercher...',
    searchPlaceholder: 'Rechercher des voyages ou villes...',
    noTrips: 'Aucun voyage planifié pour le moment',
    noTripsDesc: 'Commencez par planifier une nouvelle aventure',
    deleteTripConfirm: 'Êtes-vous sûr de vouloir supprimer ce voyage ?',

    places: 'Lieux Visités',
    addPlace: 'Ajouter un Lieu',
    placeName: 'Nom du Lieu',
    notes: 'Notes',
    category: 'Catégorie',
    noPlaces: 'Aucun lieu visité ajouté',

    expenses: 'Dépenses',
    addExpense: 'Ajouter une Dépense',
    expenseTitle: 'Titre de la Dépense',
    amount: 'Montant',
    totalSpent: 'Total Dépensé',
    remaining: 'Budget Restant',
    overBudget: 'Budget Dépassé',
    budgetUsed: 'Utilisation du Budget',
    noExpenses: 'Aucune dépense enregistrée',
  },
  ja: {
    settings: '設定',
    settingsSubtitle: '外観と言語の設定',
    appearance: '外観',
    appearanceDesc: 'アプリのカラーテーマ',
    theme: 'テーマ',
    darkMode: 'ダークモード',
    darkModeDesc: '夜間に適したダークカラーパレット',
    lightMode: 'ライトモード',
    lightModeDesc: '明るく清潔感のあるカラーパレット',
    language: '言語',
    languageDesc: 'アプリの表示言語',
    active: '有効',
    close: '閉じる',
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    done: '完了',
    confirm: '確認',
    back: '戻る',

    trips: '旅行',
    myTrips: 'マイトラベル',
    newTrip: '新規旅行',
    planTrip: '旅行を計画',
    tripTitle: '旅行タイトル',
    destination: '都市・ルート',
    startDate: '開始日',
    endDate: '終了日',
    budget: '予算',
    currency: '通貨',
    search: '検索...',
    searchPlaceholder: '旅行や都市を検索...',
    noTrips: '計画された旅行はまだありません',
    noTripsDesc: '新しい旅行を計画して冒険を始めましょう',
    deleteTripConfirm: 'この旅行を削除してもよろしいですか？',

    places: '訪れた場所',
    addPlace: '場所を追加',
    placeName: '場所・スポット名',
    notes: 'メモ',
    category: 'カテゴリー',
    noPlaces: '訪れた場所がまだ登録されていません',

    expenses: '支出',
    addExpense: '支出を追加',
    expenseTitle: '支出名',
    amount: '金額',
    totalSpent: '総支出',
    remaining: '予算の残金',
    overBudget: '予算超過',
    budgetUsed: '予算消化率',
    noExpenses: '支出の記録はまだありません',
  },
};

export const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [themeMode, setThemeMode] = useState('light');
  const [language, setLanguageState] = useState('tr');
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  // Load saved preferences on startup
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (raw && isMounted) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            if (parsed.themeMode === 'light' || parsed.themeMode === 'dark') {
              setThemeMode(parsed.themeMode);
            }
            if (parsed.language && VALID_LANGUAGE_CODES.includes(parsed.language)) {
              setLanguageState(parsed.language);
            }
          }
        }
      } catch (err) {
        console.warn('[SettingsContext] Failed to load settings from storage:', err?.message);
      } finally {
        if (isMounted) {
          setIsSettingsLoaded(true);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Persist helper
  const persistSettings = useCallback(async (newThemeMode, newLanguage) => {
    try {
      const payload = {
        themeMode: newThemeMode,
        language: newLanguage,
      };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('[SettingsContext] Failed to persist settings:', err?.message);
    }
  }, []);

  // Theme controls
  const setTheme = useCallback(
    (mode) => {
      if (mode !== 'light' && mode !== 'dark') return;
      setThemeMode(mode);
      persistSettings(mode, language);
    },
    [language, persistSettings]
  );

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      persistSettings(next, language);
      return next;
    });
  }, [language, persistSettings]);

  // Language controls
  const setLanguage = useCallback(
    (lang) => {
      if (!VALID_LANGUAGE_CODES.includes(lang)) return;
      setLanguageState(lang);
      persistSettings(themeMode, lang);
    },
    [themeMode, persistSettings]
  );

  // Active theme tokens
  const theme = useMemo(() => THEMES[themeMode] || LIGHT_THEME, [themeMode]);
  const isDark = themeMode === 'dark';

  // Translation helper bound to current language
  const t = useCallback(
    (key, paramsOrFallback) => {
      if (!key) return '';

      // 1. Try external translation dictionary if present
      if (typeof externalT === 'function') {
        try {
          const res = externalT(
            key,
            language,
            typeof paramsOrFallback === 'object' ? paramsOrFallback : undefined
          );
          if (res && res !== key) return res;
        } catch (e) {
          // ignore
        }
      }

      // 2. Check internal translation dictionary
      const currentLangDict = TRANSLATIONS[language];
      if (currentLangDict && key in currentLangDict) {
        return currentLangDict[key];
      }
      // Fallback 1: Turkish
      if (TRANSLATIONS.tr && key in TRANSLATIONS.tr) {
        return TRANSLATIONS.tr[key];
      }
      // Fallback 2: English
      if (TRANSLATIONS.en && key in TRANSLATIONS.en) {
        return TRANSLATIONS.en[key];
      }
      return typeof paramsOrFallback === 'string' ? paramsOrFallback : key;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      themeMode,
      theme,
      isDark,
      toggleTheme,
      setTheme,
      language,
      setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
      isSettingsLoaded,
    }),
    [themeMode, theme, isDark, toggleTheme, setTheme, language, setLanguage, t, isSettingsLoaded]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;
