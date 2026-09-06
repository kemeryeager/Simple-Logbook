/**
 * Simple Logbook - Internationalization (i18n) Dictionary & Helpers
 * Supports 6 languages:
 *  - tr: Türkçe (Default)
 *  - en: English
 *  - es: Español
 *  - de: Deutsch
 *  - fr: Français
 *  - ja: 日本語
 */

export const DEFAULT_LANGUAGE = 'tr';

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ja', name: '日本語', nativeName: '日本語', flag: '🇯🇵' },
];

export const MONTH_NAMES_SHORT = {
  tr: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  fr: ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
  ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
};

export const PLACE_CATEGORY_KEYS = [
  'place_cat_nature',
  'place_cat_history',
  'place_cat_museum',
  'place_cat_cafe',
  'place_cat_shopping',
  'place_cat_other',
];

export const EXPENSE_CATEGORY_KEYS = [
  'expense_cat_stay',
  'expense_cat_transit',
  'expense_cat_food',
  'expense_cat_activity',
  'expense_cat_shopping',
  'expense_cat_other',
];

export const translations = {
  // ==========================================
  // TÜRKÇE (tr) - Default
  // ==========================================
  tr: {
    // App Branding
    app_name: 'Simple Logbook',
    app_tagline: 'Gezi & Seyahat Not Defteri',

    // Navigation & Actions
    new_trip: 'Yeni Seyahat',
    edit_trip: 'Seyahati Düzenle',
    delete_trip: 'Seyahati Sil',
    save: 'Kaydet',
    cancel: 'Vazgeç',
    edit: 'Düzenle',
    update: 'Güncelle',
    search_placeholder: 'Seyahat veya şehir ara...',
    search_empty_title: 'Aramanıza Uygun Rota Bulunamadı',
    search_empty_subtitle: 'Arama kriterlerinize uygun bir seyahat kaydı bulunamadı.',
    no_trips_title: 'Henüz Bir Seyahat Eklenmedi',
    no_trips_subtitle: 'Yeni bir seyahat rotası oluşturun, bütçenizi ve ziyaret yerlerinizi kolayca takip edin.',
    planned_routes: 'Planlanan Rotalar',
    routes_count: '{count} rota',
    settings: 'Ayarlar',
    back: 'Geri',

    // Tabs & Empty States
    places_tab: 'Gezilecek Yerler',
    expenses_tab: 'Harcamalar',
    add_place: 'Yer Ekle',
    add_expense: 'Harcama Ekle',
    no_places_title: 'Henüz Gezi Noktası Eklenmedi',
    no_places_subtitle: 'Ziyaret etmek istediğiniz plaj, müze veya kafeleri ekleyin.',
    no_expenses_title: 'Henüz Harcama Kaydı Yok',
    no_expenses_subtitle: 'Konaklama, yeme-içme veya seyahat harcamalarınızı kaydedin.',

    // Budget & Stats
    budget_status: 'Bütçe Durumu',
    target_budget: 'Hedef Bütçe',
    spent: 'Harcanan',
    remaining: 'Kalan',
    over_budget: 'Aşım',
    spent_percent: '%{percent} Harcandı',
    edit_budget: 'Bütçeyi Düzenle',
    edit_budget_subtitle: 'Bu seyahat için hedef bütçeyi ve geçerli para birimini güncelleyin',
    currency: 'Para Birimi',

    // Categories (Places)
    place_cat_all: 'Tümü',
    place_cat_nature: 'Doğa / Plaj',
    place_cat_history: 'Tarihi Yer',
    place_cat_museum: 'Müze / Kültür',
    place_cat_cafe: 'Kafe & Restoran',
    place_cat_shopping: 'Alışveriş',
    place_cat_other: 'Diğer',

    // Categories (Expenses)
    expense_cat_all: 'Tümü',
    expense_cat_stay: 'Konaklama',
    expense_cat_transit: 'Ulaşım',
    expense_cat_food: 'Yeme / İçme',
    expense_cat_activity: 'Aktivite',
    expense_cat_shopping: 'Alışveriş',
    expense_cat_other: 'Diğer',

    // Form Fields & Validation
    trip_title: 'Seyahat Başlığı',
    destination_city: 'Gidilecek Şehir',
    start_date: 'Başlangıç Tarihi',
    end_date: 'Bitiş Tarihi',
    place_name: 'Mekan / Yer Adı',
    place_notes: 'Notlar & İpuçları',
    visit_date: 'Ziyaret Tarihi',
    expense_title: 'Harcama Başlığı',
    expense_amount: 'Tutar',
    expense_date: 'Harcama Tarihi',
    required_field: 'Zorunlu alan',
    error_title_req: 'Lütfen seyahatiniz için bir başlık girin.',
    error_amount_req: "Harcama tutarı 0'dan büyük geçerli bir sayı olmalıdır.",
    error_place_name_req: 'Lütfen yer veya mekan adı girin.',
    confirm_delete_trip_title: 'Seyahati Sil',
    confirm_delete_trip_msg: '"{title}" seyahatini ve bu seyahate ait tüm not ve harcamaları silmek istediğinizden emin misiniz?',
    confirm_delete_place_title: 'Yeri Sil',
    confirm_delete_place_msg: 'Bu gezi noktasını silmek istediğinizden emin misiniz?',
    confirm_delete_expense_title: 'Harcamayı Sil',
    confirm_delete_expense_msg: 'Bu harcama kaydını silmek istediğinizden emin misiniz?',

    // Settings Keys
    settings_title: 'Ayarlar',
    appearance: 'Görünüm',
    dark_mode: 'Karanlık Mod',
    dark_mode_desc: 'Gözlerinizi dinlendiren koyu tema renkleri',
    language: 'Dil',
    select_language: 'Dil Seçimi',

    // Additional UI Extras
    plan_new_trip: 'Yeni Seyahat Planla',
    delete: 'Sil',
    error_generic: 'Hata',
    success_generic: 'Başarılı',
    error_trip_save: 'Seyahat kaydedilirken bir sorun oluştu.',
    error_trip_delete: 'Seyahat silinemedi.',
    error_place_save: 'Ziyaret yeri kaydedilemedi.',
    error_place_delete: 'Yer silinemedi.',
    error_expense_save: 'Harcama kaydedilemedi.',
    error_expense_delete: 'Harcama silinemedi.',
    error_budget_invalid: 'Lütfen geçerli ve 0 veya üzeri bir bütçe girin.',
    error_budget_update: 'Bütçe güncellenirken bir hata oluştu.',
    placeholder_trip_title: 'Örn: Ege & Akdeniz Kaçamağı',
    placeholder_city: 'Örn: Antalya, Kaş',
    placeholder_budget: 'Örn: 25000',
    placeholder_place_name: 'Örn: Kaputaş Plajı',
    placeholder_place_notes: 'Örn: Sabah erken saatte gitmek şart...',
    placeholder_expense_title: 'Örn: Otel Konaklaması',
    placeholder_expense_amount: 'Örn: 1500',
    modal_new_trip_title: 'Yeni Seyahat Planla',
    modal_new_trip_subtitle: 'Rotanızı belirleyin ve bütçenizi kontrol altında tutun',
    modal_add_place_title: 'Yeni Gezi Noktası Ekle',
    modal_add_place_subtitle: 'Görmek istediğiniz yeri ve seyahat notlarınızı kaydedin',
    modal_add_expense_title: 'Yeni Harcama Ekle',
    modal_add_expense_subtitle: 'Bütçenizi takip etmek için harcama kaydı girin',
    modal_edit_budget_title: 'Bütçe & Para Birimini Düzenle',
    budget_exceeded_badge: 'Bütçe Aşıldı (%{percent})',
    budget_spent_badge: '%{percent} Harcandı',
  },

  // ==========================================
  // ENGLISH (en)
  // ==========================================
  en: {
    // App Branding
    app_name: 'Simple Logbook',
    app_tagline: 'Travel & Route Diary',

    // Navigation & Actions
    new_trip: 'New Trip',
    edit_trip: 'Edit Trip',
    delete_trip: 'Delete Trip',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    update: 'Update',
    search_placeholder: 'Search trip or city...',
    search_empty_title: 'No Matching Routes Found',
    search_empty_subtitle: 'No trip records match your search criteria.',
    no_trips_title: 'No Trips Added Yet',
    no_trips_subtitle: 'Create a new trip route to easily track your budget and places to visit.',
    planned_routes: 'Planned Routes',
    routes_count: '{count} routes',
    settings: 'Settings',
    back: 'Back',

    // Tabs & Empty States
    places_tab: 'Places to Visit',
    expenses_tab: 'Expenses',
    add_place: 'Add Place',
    add_expense: 'Add Expense',
    no_places_title: 'No Places Added Yet',
    no_places_subtitle: 'Add beaches, museums, or cafes you would like to visit.',
    no_expenses_title: 'No Expenses Recorded Yet',
    no_expenses_subtitle: 'Record your accommodation, dining, or transport expenses.',

    // Budget & Stats
    budget_status: 'Budget Status',
    target_budget: 'Target Budget',
    spent: 'Spent',
    remaining: 'Remaining',
    over_budget: 'Over Budget',
    spent_percent: '{percent}% Spent',
    edit_budget: 'Edit Budget',
    edit_budget_subtitle: 'Update target budget and currency for this trip',
    currency: 'Currency',

    // Categories (Places)
    place_cat_all: 'All',
    place_cat_nature: 'Nature / Beach',
    place_cat_history: 'Historical Site',
    place_cat_museum: 'Museum / Culture',
    place_cat_cafe: 'Cafe & Restaurant',
    place_cat_shopping: 'Shopping',
    place_cat_other: 'Other',

    // Categories (Expenses)
    expense_cat_all: 'All',
    expense_cat_stay: 'Accommodation',
    expense_cat_transit: 'Transportation',
    expense_cat_food: 'Food & Dining',
    expense_cat_activity: 'Activities',
    expense_cat_shopping: 'Shopping',
    expense_cat_other: 'Other',

    // Form Fields & Validation
    trip_title: 'Trip Title',
    destination_city: 'Destination City',
    start_date: 'Start Date',
    end_date: 'End Date',
    place_name: 'Place / Venue Name',
    place_notes: 'Notes & Tips',
    visit_date: 'Visit Date',
    expense_title: 'Expense Title',
    expense_amount: 'Amount',
    expense_date: 'Expense Date',
    required_field: 'Required field',
    error_title_req: 'Please enter a title for your trip.',
    error_amount_req: 'Expense amount must be a valid number greater than 0.',
    error_place_name_req: 'Please enter a place or venue name.',
    confirm_delete_trip_title: 'Delete Trip',
    confirm_delete_trip_msg: 'Are you sure you want to delete "{title}" and all related places and expenses?',
    confirm_delete_place_title: 'Delete Place',
    confirm_delete_place_msg: 'Are you sure you want to delete this place?',
    confirm_delete_expense_title: 'Delete Expense',
    confirm_delete_expense_msg: 'Are you sure you want to delete this expense record?',

    // Settings Keys
    settings_title: 'Settings',
    appearance: 'Appearance',
    dark_mode: 'Dark Mode',
    dark_mode_desc: 'Eye-friendly dark theme colors',
    language: 'Language',
    select_language: 'Select Language',

    // Additional UI Extras
    plan_new_trip: 'Plan New Trip',
    delete: 'Delete',
    error_generic: 'Error',
    success_generic: 'Success',
    error_trip_save: 'An error occurred while saving the trip.',
    error_trip_delete: 'Trip could not be deleted.',
    error_place_save: 'Place could not be saved.',
    error_place_delete: 'Place could not be deleted.',
    error_expense_save: 'Expense could not be saved.',
    error_expense_delete: 'Expense could not be deleted.',
    error_budget_invalid: 'Please enter a valid budget of 0 or greater.',
    error_budget_update: 'An error occurred while updating the budget.',
    placeholder_trip_title: 'e.g. Mediterranean Coastal Escape',
    placeholder_city: 'e.g. Antalya, Kas',
    placeholder_budget: 'e.g. 25000',
    placeholder_place_name: 'e.g. Kaputas Beach',
    placeholder_place_notes: 'e.g. Best to go early in the morning...',
    placeholder_expense_title: 'e.g. Hotel Stay (3 Nights)',
    placeholder_expense_amount: 'e.g. 1500',
    modal_new_trip_title: 'Plan New Trip',
    modal_new_trip_subtitle: 'Set your route and keep your budget in control',
    modal_add_place_title: 'Add New Place',
    modal_add_place_subtitle: 'Save places you want to see and travel notes',
    modal_add_expense_title: 'Add New Expense',
    modal_add_expense_subtitle: 'Enter expense details to track your budget',
    modal_edit_budget_title: 'Edit Budget & Currency',
    budget_exceeded_badge: 'Over Budget ({percent}%)',
    budget_spent_badge: '{percent}% Spent',
  },

  // ==========================================
  // ESPAÑOL (es)
  // ==========================================
  es: {
    // App Branding
    app_name: 'Simple Logbook',
    app_tagline: 'Cuaderno de Viajes y Rutas',

    // Navigation & Actions
    new_trip: 'Nuevo viaje',
    edit_trip: 'Editar viaje',
    delete_trip: 'Eliminar viaje',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    update: 'Actualizar',
    search_placeholder: 'Buscar viaje o ciudad...',
    search_empty_title: 'No se encontraron rutas',
    search_empty_subtitle: 'No hay registros de viaje que coincidan con tu búsqueda.',
    no_trips_title: 'Aún no has añadido viajes',
    no_trips_subtitle: 'Crea una nueva ruta de viaje para controlar fácilmente tu presupuesto y visitas.',
    planned_routes: 'Rutas planificadas',
    routes_count: '{count} rutas',
    settings: 'Ajustes',
    back: 'Atrás',

    // Tabs & Empty States
    places_tab: 'Lugares a visitar',
    expenses_tab: 'Gastos',
    add_place: 'Añadir lugar',
    add_expense: 'Añadir gasto',
    no_places_title: 'Sin lugares añadidos',
    no_places_subtitle: 'Añade playas, museos o cafés que quieras visitar.',
    no_expenses_title: 'Sin gastos registrados',
    no_expenses_subtitle: 'Registra tus gastos de alojamiento, comida o transporte.',

    // Budget & Stats
    budget_status: 'Estado del presupuesto',
    target_budget: 'Presupuesto objetivo',
    spent: 'Gastado',
    remaining: 'Restante',
    over_budget: 'Excedido',
    spent_percent: '{percent}% gastado',
    edit_budget: 'Editar presupuesto',
    edit_budget_subtitle: 'Actualiza el presupuesto objetivo y la moneda para este viaje',
    currency: 'Moneda',

    // Categories (Places)
    place_cat_all: 'Todos',
    place_cat_nature: 'Naturaleza / Playa',
    place_cat_history: 'Lugar histórico',
    place_cat_museum: 'Museo / Cultura',
    place_cat_cafe: 'Café y Restaurante',
    place_cat_shopping: 'Compras',
    place_cat_other: 'Otro',

    // Categories (Expenses)
    expense_cat_all: 'Todos',
    expense_cat_stay: 'Alojamiento',
    expense_cat_transit: 'Transporte',
    expense_cat_food: 'Comida y Bebida',
    expense_cat_activity: 'Actividades',
    expense_cat_shopping: 'Compras',
    expense_cat_other: 'Otro',

    // Form Fields & Validation
    trip_title: 'Título del viaje',
    destination_city: 'Ciudad de destino',
    start_date: 'Fecha de inicio',
    end_date: 'Fecha de fin',
    place_name: 'Nombre del lugar',
    place_notes: 'Notas y consejos',
    visit_date: 'Fecha de visita',
    expense_title: 'Concepto del gasto',
    expense_amount: 'Importe',
    expense_date: 'Fecha del gasto',
    required_field: 'Campo obligatorio',
    error_title_req: 'Por favor, introduce un título para tu viaje.',
    error_amount_req: 'El importe del gasto debe ser un número válido mayor a 0.',
    error_place_name_req: 'Por favor, introduce el nombre del lugar.',
    confirm_delete_trip_title: 'Eliminar viaje',
    confirm_delete_trip_msg: '¿Estás seguro de que deseas eliminar "{title}" y todos sus lugares y gastos asociados?',
    confirm_delete_place_title: 'Eliminar lugar',
    confirm_delete_place_msg: '¿Estás seguro de que deseas eliminar este lugar?',
    confirm_delete_expense_title: 'Eliminar gasto',
    confirm_delete_expense_msg: '¿Estás seguro de que deseas eliminar este registro de gasto?',

    // Settings Keys
    settings_title: 'Ajustes',
    appearance: 'Apariencia',
    dark_mode: 'Modo oscuro',
    dark_mode_desc: 'Colores oscuros para descansar la vista',
    language: 'Idioma',
    select_language: 'Seleccionar idioma',

    // Additional UI Extras
    plan_new_trip: 'Planificar nuevo viaje',
    delete: 'Eliminar',
    error_generic: 'Error',
    success_generic: 'Éxito',
    error_trip_save: 'Ocurrió un error al guardar el viaje.',
    error_trip_delete: 'No se pudo eliminar el viaje.',
    error_place_save: 'No se pudo guardar el lugar.',
    error_place_delete: 'No se pudo eliminar el lugar.',
    error_expense_save: 'No se pudo guardar el gasto.',
    error_expense_delete: 'No se pudo eliminar el gasto.',
    error_budget_invalid: 'Por favor, introduce un presupuesto válido mayor o igual a 0.',
    error_budget_update: 'Ocurrió un error al actualizar el presupuesto.',
    placeholder_trip_title: 'Ej.: Escapada por el Mediterráneo',
    placeholder_city: 'Ej.: Antalya, Kas',
    placeholder_budget: 'Ej.: 25000',
    placeholder_place_name: 'Ej.: Playa de Kaputas',
    placeholder_place_notes: 'Ej.: Es mejor ir temprano en la mañana...',
    placeholder_expense_title: 'Ej.: Hotel boutique (3 noches)',
    placeholder_expense_amount: 'Ej.: 1500',
    modal_new_trip_title: 'Planificar nuevo viaje',
    modal_new_trip_subtitle: 'Define tu ruta y mantén tu presupuesto bajo control',
    modal_add_place_title: 'Añadir nuevo lugar',
    modal_add_place_subtitle: 'Guarda los lugares que deseas visitar y tus notas de viaje',
    modal_add_expense_title: 'Añadir nuevo gasto',
    modal_add_expense_subtitle: 'Introduce los detalles del gasto para controlar tu presupuesto',
    modal_edit_budget_title: 'Editar presupuesto y moneda',
    budget_exceeded_badge: 'Presupuesto excedido ({percent}%)',
    budget_spent_badge: '{percent}% gastado',
  },

  // ==========================================
  // DEUTSCH (de)
  // ==========================================
  de: {
    // App Branding
    app_name: 'Simple Logbook',
    app_tagline: 'Reise- & Routentagebuch',

    // Navigation & Actions
    new_trip: 'Neue Reise',
    edit_trip: 'Reise bearbeiten',
    delete_trip: 'Reise löschen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    update: 'Aktualisieren',
    search_placeholder: 'Reise oder Stadt suchen...',
    search_empty_title: 'Keine passenden Routen gefunden',
    search_empty_subtitle: 'Keine Reiseeinträge entsprechen Ihren Suchkriterien.',
    no_trips_title: 'Noch keine Reisen hinzugefügt',
    no_trips_subtitle: 'Erstellen Sie eine neue Route, um Budget und Ausflugsziele im Blick zu behalten.',
    planned_routes: 'Geplante Routen',
    routes_count: '{count} Routen',
    settings: 'Einstellungen',
    back: 'Zurück',

    // Tabs & Empty States
    places_tab: 'Sehenswürdigkeiten',
    expenses_tab: 'Ausgaben',
    add_place: 'Ort hinzufügen',
    add_expense: 'Ausgabe hinzufügen',
    no_places_title: 'Noch keine Orte hinzugefügt',
    no_places_subtitle: 'Fügen Sie Strände, Museen oder Cafés hinzu, die Sie besuchen möchten.',
    no_expenses_title: 'Noch keine Ausgaben erfasst',
    no_expenses_subtitle: 'Erfassen Sie Ausgaben für Unterkunft, Verpflegung oder Anreise.',

    // Budget & Stats
    budget_status: 'Budgetstatus',
    target_budget: 'Zielbudget',
    spent: 'Ausgegeben',
    remaining: 'Verbleibend',
    over_budget: 'Überschritten',
    spent_percent: '{percent}% ausgegeben',
    edit_budget: 'Budget bearbeiten',
    edit_budget_subtitle: 'Zielbudget und Währung für diese Reise aktualisieren',
    currency: 'Währung',

    // Categories (Places)
    place_cat_all: 'Alle',
    place_cat_nature: 'Natur / Strand',
    place_cat_history: 'Historischer Ort',
    place_cat_museum: 'Museum / Kultur',
    place_cat_cafe: 'Café & Restaurant',
    place_cat_shopping: 'Einkaufen',
    place_cat_other: 'Sonstiges',

    // Categories (Expenses)
    expense_cat_all: 'Alle',
    expense_cat_stay: 'Unterkunft',
    expense_cat_transit: 'Transport',
    expense_cat_food: 'Essen & Trinken',
    expense_cat_activity: 'Aktivitäten',
    expense_cat_shopping: 'Einkaufen',
    expense_cat_other: 'Sonstiges',

    // Form Fields & Validation
    trip_title: 'Reisetitel',
    destination_city: 'Zielstadt',
    start_date: 'Startdatum',
    end_date: 'Enddatum',
    place_name: 'Name des Ortes',
    place_notes: 'Notizen & Tipps',
    visit_date: 'Besuchsdatum',
    expense_title: 'Ausgabenbezeichnung',
    expense_amount: 'Betrag',
    expense_date: 'Ausgabendatum',
    required_field: 'Pflichtfeld',
    error_title_req: 'Bitte geben Sie einen Titel für Ihre Reise ein.',
    error_amount_req: 'Der Ausgabenbetrag muss eine gültige Zahl größer als 0 sein.',
    error_place_name_req: 'Bitte geben Sie den Namen des Ortes ein.',
    confirm_delete_trip_title: 'Reise löschen',
    confirm_delete_trip_msg: 'Möchten Sie die Reise "{title}" und alle zugehörigen Orte und Ausgaben wirklich löschen?',
    confirm_delete_place_title: 'Ort löschen',
    confirm_delete_place_msg: 'Möchten Sie diesen Ort wirklich löschen?',
    confirm_delete_expense_title: 'Ausgabe löschen',
    confirm_delete_expense_msg: 'Möchten Sie diesen Ausgabeneintrag wirklich löschen?',

    // Settings Keys
    settings_title: 'Einstellungen',
    appearance: 'Erscheinungsbild',
    dark_mode: 'Dunkelmodus',
    dark_mode_desc: 'Augenschonendes dunkles Farbschema',
    language: 'Sprache',
    select_language: 'Sprache auswählen',

    // Additional UI Extras
    plan_new_trip: 'Neue Reise planen',
    delete: 'Löschen',
    error_generic: 'Fehler',
    success_generic: 'Erfolg',
    error_trip_save: 'Beim Speichern der Reise ist ein Fehler aufgetreten.',
    error_trip_delete: 'Die Reise konnte nicht gelöscht werden.',
    error_place_save: 'Der Ort konnte nicht gespeichert werden.',
    error_place_delete: 'Der Ort konnte nicht gelöscht werden.',
    error_expense_save: 'Die Ausgabe konnte nicht gespeichert werden.',
    error_expense_delete: 'Die Ausgabe konnte nicht gelöscht werden.',
    error_budget_invalid: 'Bitte geben Sie ein gültiges Budget von 0 oder mehr ein.',
    error_budget_update: 'Beim Aktualisieren des Budgets ist ein Fehler aufgetreten.',
    placeholder_trip_title: 'z.B. Mittelmeer-Kurztrip',
    placeholder_city: 'z.B. Antalya, Kas',
    placeholder_budget: 'z.B. 25000',
    placeholder_place_name: 'z.B. Kaputas Strand',
    placeholder_place_notes: 'z.B. Am besten früh am Morgen hingehen...',
    placeholder_expense_title: 'z.B. Hotelunterkunft (3 Nächte)',
    placeholder_expense_amount: 'z.B. 1500',
    modal_new_trip_title: 'Neue Reise planen',
    modal_new_trip_subtitle: 'Legen Sie Ihre Route fest und behalten Sie Ihr Budget im Griff',
    modal_add_place_title: 'Neuen Ort hinzufügen',
    modal_add_place_subtitle: 'Speichern Sie Sehenswürdigkeiten und Ihre Reisenotizen',
    modal_add_expense_title: 'Neue Ausgabe hinzufügen',
    modal_add_expense_subtitle: 'Geben Sie Ausgaben ein, um Ihr Budget im Auge zu behalten',
    modal_edit_budget_title: 'Budget & Währung bearbeiten',
    budget_exceeded_badge: 'Budget überschritten ({percent}%)',
    budget_spent_badge: '{percent}% ausgegeben',
  },

  // ==========================================
  // FRANÇAIS (fr)
  // ==========================================
  fr: {
    // App Branding
    app_name: 'Simple Logbook',
    app_tagline: "Carnet de Voyage & d'Itinéraires",

    // Navigation & Actions
    new_trip: 'Nouveau voyage',
    edit_trip: 'Modifier le voyage',
    delete_trip: 'Supprimer le voyage',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    update: 'Mettre à jour',
    search_placeholder: 'Rechercher un voyage ou une ville...',
    search_empty_title: 'Aucun itinéraire trouvé',
    search_empty_subtitle: 'Aucun enregistrement de voyage ne correspond à vos critères.',
    no_trips_title: 'Aucun voyage ajouté pour l’instant',
    no_trips_subtitle: 'Créez un nouvel itinéraire pour suivre facilement votre budget et vos visites.',
    planned_routes: 'Itinéraires planifiés',
    routes_count: '{count} itinéraires',
    settings: 'Paramètres',
    back: 'Retour',

    // Tabs & Empty States
    places_tab: 'Lieux à visiter',
    expenses_tab: 'Dépenses',
    add_place: 'Ajouter un lieu',
    add_expense: 'Ajouter une dépense',
    no_places_title: 'Aucun lieu ajouté',
    no_places_subtitle: 'Ajoutez les plages, musées ou cafés que vous souhaitez visiter.',
    no_expenses_title: 'Aucune dépense enregistrée',
    no_expenses_subtitle: 'Notez vos dépenses d’hébergement, de repas ou de transport.',

    // Budget & Stats
    budget_status: 'État du budget',
    target_budget: 'Budget prévu',
    spent: 'Dépensé',
    remaining: 'Restant',
    over_budget: 'Dépassé',
    spent_percent: '{percent} % dépensé',
    edit_budget: 'Modifier le budget',
    edit_budget_subtitle: 'Mettez à jour le budget prévu et la devise de ce voyage',
    currency: 'Devise',

    // Categories (Places)
    place_cat_all: 'Tous',
    place_cat_nature: 'Nature / Plage',
    place_cat_history: 'Site historique',
    place_cat_museum: 'Musée / Culture',
    place_cat_cafe: 'Café & Restaurant',
    place_cat_shopping: 'Shopping',
    place_cat_other: 'Autre',

    // Categories (Expenses)
    expense_cat_all: 'Tous',
    expense_cat_stay: 'Hébergement',
    expense_cat_transit: 'Transport',
    expense_cat_food: 'Restauration',
    expense_cat_activity: 'Activités',
    expense_cat_shopping: 'Shopping',
    expense_cat_other: 'Autre',

    // Form Fields & Validation
    trip_title: 'Titre du voyage',
    destination_city: 'Ville de destination',
    start_date: 'Date de début',
    end_date: 'Date de fin',
    place_name: 'Nom du lieu',
    place_notes: 'Notes & Conseils',
    visit_date: 'Date de visite',
    expense_title: 'Libellé de la dépense',
    expense_amount: 'Montant',
    expense_date: 'Date de la dépense',
    required_field: 'Champ obligatoire',
    error_title_req: 'Veuillez saisir un titre pour votre voyage.',
    error_amount_req: 'Le montant de la dépense doit être un nombre valide supérieur à 0.',
    error_place_name_req: 'Veuillez saisir le nom d’un lieu.',
    confirm_delete_trip_title: 'Supprimer le voyage',
    confirm_delete_trip_msg: 'Êtes-vous sûr de vouloir supprimer "{title}" ainsi que toutes ses notes et dépenses ?',
    confirm_delete_place_title: 'Supprimer le lieu',
    confirm_delete_place_msg: 'Êtes-vous sûr de vouloir supprimer ce lieu ?',
    confirm_delete_expense_title: 'Supprimer la dépense',
    confirm_delete_expense_msg: 'Êtes-vous sûr de vouloir supprimer cette dépense ?',

    // Settings Keys
    settings_title: 'Paramètres',
    appearance: 'Apparence',
    dark_mode: 'Mode sombre',
    dark_mode_desc: 'Thème sombre reposant pour les yeux',
    language: 'Langue',
    select_language: 'Choisir la langue',

    // Additional UI Extras
    plan_new_trip: 'Planifier un voyage',
    delete: 'Supprimer',
    error_generic: 'Erreur',
    success_generic: 'Succès',
    error_trip_save: 'Une erreur est survenue lors de l’enregistrement du voyage.',
    error_trip_delete: 'Impossible de supprimer le voyage.',
    error_place_save: 'Impossible d’enregistrer le lieu.',
    error_place_delete: 'Impossible de supprimer le lieu.',
    error_expense_save: 'Impossible d’enregistrer la dépense.',
    error_expense_delete: 'Impossible de supprimer la dépense.',
    error_budget_invalid: 'Veuillez saisir un budget valide supérieur ou égal à 0.',
    error_budget_update: 'Une erreur est survenue lors de la mise à jour du budget.',
    placeholder_trip_title: 'Ex. : Échappée en Méditerranée',
    placeholder_city: 'Ex. : Antalya, Kas',
    placeholder_budget: 'Ex. : 25000',
    placeholder_place_name: 'Ex. : Plage de Kaputas',
    placeholder_place_notes: 'Ex. : Y aller tôt le matin...',
    placeholder_expense_title: 'Ex. : Nuitée d’hôtel (3 nuits)',
    placeholder_expense_amount: 'Ex. : 1500',
    modal_new_trip_title: 'Planifier un voyage',
    modal_new_trip_subtitle: 'Définissez votre itinéraire et gardez le contrôle sur votre budget',
    modal_add_place_title: 'Ajouter un nouveau lieu',
    modal_add_place_subtitle: 'Enregistrez les lieux à visiter et vos notes de voyage',
    modal_add_expense_title: 'Ajouter une dépense',
    modal_add_expense_subtitle: 'Saisissez vos dépenses pour suivre votre budget',
    modal_edit_budget_title: 'Modifier le budget & la devise',
    budget_exceeded_badge: 'Budget dépassé ({percent} %)',
    budget_spent_badge: '{percent} % dépensé',
  },

  // ==========================================
  // 日本語 (ja)
  // ==========================================
  ja: {
    // App Branding
    app_name: 'Simple Logbook',
    app_tagline: '旅行＆ルートノート',

    // Navigation & Actions
    new_trip: '新しい旅行',
    edit_trip: '旅行を編集',
    delete_trip: '旅行を削除',
    save: '保存',
    cancel: 'キャンセル',
    edit: '編集',
    update: '更新',
    search_placeholder: '旅行や都市を検索...',
    search_empty_title: '一致するルートが見つかりません',
    search_empty_subtitle: '検索条件に一致する旅行記録がありません。',
    no_trips_title: 'まだ旅行が追加されていません',
    no_trips_subtitle: '新しい旅行ルートを作成し、予算や訪問先をスマートに管理しましょう。',
    planned_routes: '計画されたルート',
    routes_count: '{count} 件のルート',
    settings: '設定',
    back: '戻る',

    // Tabs & Empty States
    places_tab: '観光スポット',
    expenses_tab: '支出',
    add_place: '場所を追加',
    add_expense: '支出を追加',
    no_places_title: 'まだ観光スポットが追加されていません',
    no_places_subtitle: '訪れたいビーチ、博物館、カフェなどを追加しましょう。',
    no_expenses_title: 'まだ支出記録がありません',
    no_expenses_subtitle: '宿泊費、飲食費、交通費などの出費を記録しましょう。',

    // Budget & Stats
    budget_status: '予算状況',
    target_budget: '目標予算',
    spent: '使用額',
    remaining: '残り',
    over_budget: '予算超過',
    spent_percent: '{percent}% 消化',
    edit_budget: '予算を編集',
    edit_budget_subtitle: 'この旅行の目標予算と通貨を更新します',
    currency: '通貨',

    // Categories (Places)
    place_cat_all: 'すべて',
    place_cat_nature: '自然・ビーチ',
    place_cat_history: '歴史的名所',
    place_cat_museum: '博物館・文化',
    place_cat_cafe: 'カフェ＆レストラン',
    place_cat_shopping: 'ショッピング',
    place_cat_other: 'その他',

    // Categories (Expenses)
    expense_cat_all: 'すべて',
    expense_cat_stay: '宿泊',
    expense_cat_transit: '交通',
    expense_cat_food: '飲食',
    expense_cat_activity: 'アクティビティ',
    expense_cat_shopping: 'ショッピング',
    expense_cat_other: 'その他',

    // Form Fields & Validation
    trip_title: '旅行タイトル',
    destination_city: '目的地の都市',
    start_date: '開始日',
    end_date: '終了日',
    place_name: 'スポット・施設名',
    place_notes: 'メモ・ヒント',
    visit_date: '訪問日',
    expense_title: '支出の項目名',
    expense_amount: '金額',
    expense_date: '支出日',
    required_field: '必須項目',
    error_title_req: '旅行のタイトルを入力してください。',
    error_amount_req: '支出金額は0より大きい有効な数値を入力してください。',
    error_place_name_req: '場所または施設名を入力してください。',
    confirm_delete_trip_title: '旅行を削除',
    confirm_delete_trip_msg: '「{title}」と、関連するすべての場所や支出を削除してもよろしいですか？',
    confirm_delete_place_title: '場所を削除',
    confirm_delete_place_msg: 'この観光スポットを削除してもよろしいですか？',
    confirm_delete_expense_title: '支出を削除',
    confirm_delete_expense_msg: 'この支出記録を削除してもよろしいですか？',

    // Settings Keys
    settings_title: '設定',
    appearance: '外観',
    dark_mode: 'ダークモード',
    dark_mode_desc: '目に優しいダークカラーのテーマ',
    language: '言語',
    select_language: '言語を選択',

    // Additional UI Extras
    plan_new_trip: '新しい旅行を計画',
    delete: '削除',
    error_generic: 'エラー',
    success_generic: '成功',
    error_trip_save: '旅行の保存中にエラーが発生しました。',
    error_trip_delete: '旅行を削除できませんでした。',
    error_place_save: 'スポットを保存できませんでした。',
    error_place_delete: 'スポットを削除できませんでした。',
    error_expense_save: '支出を保存できませんでした。',
    error_expense_delete: '支出を削除できませんでした。',
    error_budget_invalid: '0以上の有効な予算を入力してください。',
    error_budget_update: '予算の更新中にエラーが発生しました。',
    placeholder_trip_title: '例: エーゲ海・地中海の旅',
    placeholder_city: '例: アンタルヤ、カシュ',
    placeholder_budget: '例: 25000',
    placeholder_place_name: '例: カプタシュビーチ',
    placeholder_place_notes: '例: 早朝に行くのがおすすめ...',
    placeholder_expense_title: '例: ホテル宿泊（3泊）',
    placeholder_expense_amount: '例: 1500',
    modal_new_trip_title: '新しい旅行を計画',
    modal_new_trip_subtitle: 'ルートを決めて予算をしっかり管理しましょう',
    modal_add_place_title: '新しいスポットを追加',
    modal_add_place_subtitle: '訪れたい場所や旅行メモを記録しましょう',
    modal_add_expense_title: '新しい支出を追加',
    modal_add_expense_subtitle: '予算を管理するために支出を記録しましょう',
    modal_edit_budget_title: '予算と通貨を編集',
    budget_exceeded_badge: '予算超過 ({percent}%)',
    budget_spent_badge: '{percent}% 消化',
  },
};

/**
 * Returns translated string for a given key and language.
 * Falls back to Turkish ('tr') or English ('en') if missing in requested language.
 * Supports placeholder interpolation, e.g. {count}, {title}, {percent}.
 *
 * @param {string} key - Translation key
 * @param {string} [lang='tr'] - Language code
 * @param {Object} [params={}] - Interpolation dictionary
 * @returns {string}
 */
export const t = (key, lang = 'tr', params = {}) => {
  if (!key) return '';
  const code = (lang || 'tr').toLowerCase().split(/[-_]/)[0];
  const langDict = translations[code] || translations.tr;

  let text = langDict?.[key];
  if (text === undefined) {
    text = translations.tr?.[key] ?? translations.en?.[key] ?? key;
  }

  if (typeof text === 'string' && params && typeof params === 'object') {
    return Object.keys(params).reduce((acc, paramKey) => {
      const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
      return acc.replace(regex, String(params[paramKey]));
    }, text);
  }

  return text;
};

/**
 * Helper to check if a language code is supported.
 */
export const isSupportedLanguage = (code) => {
  if (!code) return false;
  const normalized = code.toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === normalized);
};

/**
 * Category translation helper for Places.
 * Accepts category key or legacy Turkish name and returns localized name.
 */
export const translatePlaceCategory = (categoryOrKey, lang = 'tr') => {
  if (!categoryOrKey) return t('place_cat_other', lang);

  // If already a key
  if (categoryOrKey.startsWith('place_cat_')) {
    return t(categoryOrKey, lang);
  }

  const raw = String(categoryOrKey).toLowerCase();
  if (raw === 'tümü' || raw === 'all' || raw === 'todos' || raw === 'alle' || raw === 'tous' || raw === 'すべて') {
    return t('place_cat_all', lang);
  }
  if (raw.includes('doğa') || raw.includes('plaj') || raw.includes('nature') || raw.includes('beach')) {
    return t('place_cat_nature', lang);
  }
  if (raw.includes('tarih') || raw.includes('historic')) {
    return t('place_cat_history', lang);
  }
  if (raw.includes('müze') || raw.includes('kültür') || raw.includes('museum') || raw.includes('culture')) {
    return t('place_cat_museum', lang);
  }
  if (raw.includes('kafe') || raw.includes('restoran') || raw.includes('cafe') || raw.includes('restaurant')) {
    return t('place_cat_cafe', lang);
  }
  if (raw.includes('alışveriş') || raw.includes('shopping')) {
    return t('place_cat_shopping', lang);
  }

  return t('place_cat_other', lang);
};

/**
 * Category translation helper for Expenses.
 * Accepts category key or legacy Turkish name and returns localized name.
 */
export const translateExpenseCategory = (categoryOrKey, lang = 'tr') => {
  if (!categoryOrKey) return t('expense_cat_other', lang);

  // If already a key
  if (categoryOrKey.startsWith('expense_cat_')) {
    return t(categoryOrKey, lang);
  }

  const raw = String(categoryOrKey).toLowerCase();
  if (raw === 'tümü' || raw === 'all' || raw === 'todos' || raw === 'alle' || raw === 'tous' || raw === 'すべて') {
    return t('expense_cat_all', lang);
  }
  if (raw.includes('konaklama') || raw.includes('hotel') || raw.includes('stay') || raw.includes('alojamiento') || raw.includes('unterkunft')) {
    return t('expense_cat_stay', lang);
  }
  if (raw.includes('ulaşım') || raw.includes('transit') || raw.includes('transport')) {
    return t('expense_cat_transit', lang);
  }
  if (raw.includes('yeme') || raw.includes('içme') || raw.includes('food') || raw.includes('dining') || raw.includes('repas')) {
    return t('expense_cat_food', lang);
  }
  if (raw.includes('aktivite') || raw.includes('activity') || raw.includes('actividad') || raw.includes('aktivität')) {
    return t('expense_cat_activity', lang);
  }
  if (raw.includes('alışveriş') || raw.includes('shopping') || raw.includes('compras') || raw.includes('einkaufen')) {
    return t('expense_cat_shopping', lang);
  }

  return t('expense_cat_other', lang);
};

/**
 * Formats date range according to language and locale conventions.
 */
export const formatDateRange = (start, end, lang = 'tr') => {
  if (!start && !end) return '';
  const code = (lang || 'tr').toLowerCase().split(/[-_]/)[0];
  const months = MONTH_NAMES_SHORT[code] || MONTH_NAMES_SHORT.tr;

  const parse = (d) => {
    if (!d || typeof d !== 'string') return null;
    const parts = d.split('-');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[2], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[0];
    return { day, month: months[monthIndex] || parts[1], year, monthIndex };
  };

  const s = parse(start);
  const e = parse(end);

  if (code === 'ja') {
    if (s && e) {
      if (s.year === e.year) {
        if (s.monthIndex === e.monthIndex) {
          return `${s.year}年${s.month}${s.day}日 - ${e.day}日`;
        }
        return `${s.year}年${s.month}${s.day}日 - ${e.month}${e.day}日`;
      }
      return `${s.year}年${s.month}${s.day}日 - ${e.year}年${e.month}${e.day}日`;
    }
    if (s) return `${s.year}年${s.month}${s.day}日`;
    if (e) return `${e.year}年${e.month}${e.day}日`;
    return start || end || '';
  }

  if (s && e) {
    if (s.year === e.year) {
      if (s.month === e.month) {
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
 * Formats a currency amount with proper thousand separator and currency symbol.
 */
export const formatCurrency = (amount, currency = '₺', lang = 'tr') => {
  const num = Number(amount) || 0;
  const code = (lang || 'tr').toLowerCase().split(/[-_]/)[0];

  const localeMap = {
    tr: 'tr-TR',
    en: 'en-US',
    es: 'es-ES',
    de: 'de-DE',
    fr: 'fr-FR',
    ja: 'ja-JP',
  };
  const locale = localeMap[code] || 'tr-TR';
  const formatted = num.toLocaleString(locale);

  // In English / Japanese symbols like $, £, ¥ often appear before the number
  if (currency === '$' || currency === '£' || currency === '¥' || currency === 'C$' || currency === 'A$') {
    return `${currency}${formatted}`;
  }

  return `${formatted} ${currency}`;
};

export default {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  MONTH_NAMES_SHORT,
  PLACE_CATEGORY_KEYS,
  EXPENSE_CATEGORY_KEYS,
  translations,
  t,
  isSupportedLanguage,
  translatePlaceCategory,
  translateExpenseCategory,
  formatDateRange,
  formatCurrency,
};
