# Project Context: Simple Logbook (v1.1.0)

> **Quick Summary:** Fast, offline-first personal travel diary, itinerary planner, and budget tracker mobile application built with React Native & Expo SDK 57. Features a built-in curated destinations directory (39 world cities & 240+ attractions), dynamic city autocomplete, one-tap route planning, 6-language i18n, adaptive theming (Light/Dark/System), swipe-to-dismiss gesture modals, and an interactive calendar picker.

---

## 1. Core Tech Stack & Dependencies
- **Runtime & Tooling:** Expo SDK 57 (`npx expo start`), React Native 0.86, React 19.
- **Persistence:** `@react-native-async-storage/async-storage` (100% offline-first, client-side).
- **Safe Area Management:** `react-native-safe-area-context` (Adapts to all screen aspect ratios, iOS notch/home bar, and Android 3-button navigation).
- **Icons:** `lucide-react-native` (Only use Lucide icons; never install or mix other icon sets).
- **Build System:** Expo Application Services (EAS Build) via `eas.json` (`preview` profile for Android `.apk`).
- **Package Identifier:** `com.kemeryeager.simplelogbook` (Android), Slug: `simple-logbook`.
- **Repository:** `https://github.com/kemeryeager/Simple-Logbook` (Public).

---

## 2. Project Architecture & File Map

```text
├── App.js                         # Root entry wrapped in SafeAreaProvider & SettingsProvider
├── app.json                       # Expo config (v1.1.0), package name & EAS projectId
├── eas.json                       # Build configurations (preview profile creates standalone APK)
├── contexts/
│   └── SettingsContext.js         # Theme management (Light/Dark/System), active language, token dictionary
├── utils/
│   ├── storage.js                 # Centralized CRUD for Trips, Places, Expenses & Currency Helpers
│   ├── translations.js            # 6-language dictionary (en, tr, es, de, fr, ja) & `t(key, lang)` helper
│   └── overpassService.js         # Live OpenStreetMap & Overpass API engine with offline caching
├── components/
│   ├── ModalSheet.js              # Bottom sheet modal with PanResponder swipe-to-dismiss & keyboard safety
│   ├── DatePickerModal.js         # Interactive visual monthly calendar picker (no manual date typing)
│   ├── ExplorePlacesModal.js      # Live OSM places explorer (Cafes, Restaurants, Museums, Parks) + One-tap Add
│   ├── SettingsModal.js           # Appearance (Light/Dark/System) & Language switcher sheet
│   ├── BudgetProgress.js          # Real-time animated budget progress bar with multi-currency alerts
│   ├── TripCard.js                # Memoized route card with dates, city badge & deletion
│   ├── PlaceCard.js               # Visited spot card with category badge, notes & date
│   └── ExpenseCard.js             # Expense item card with category icon & formatted currency
└── screens/
    ├── TripListScreen.js          # Main screen: trip list, search filter, new trip modal, settings trigger
    └── TripDetailScreen.js        # Detail screen: places vs expenses tabs, live guide trigger, budget header
```

---

## 3. Data Models & Storage Schema (`utils/storage.js`)

All operations are asynchronous and persist into AsyncStorage:

- **Trip:**
  - `id`: `string` (UUID/timestamp)
  - `title`: `string` (e.g., "Paris Vacation")
  - `city`: `string` (e.g., "Paris, France")
  - `startDate`: `string` (`YYYY-MM-DD`)
  - `endDate`: `string` (`YYYY-MM-DD`)
  - `budget`: `number` (Default: `0`)
  - `currency`: `string` (Supported: `TRY`, `USD`, `EUR`, `GBP`, `JPY`, `CHF`, `CAD`, `AUD`, `CNY`)

- **Place:**
  - `id`: `string`
  - `tripId`: `string` (Foreign key to Trip)
  - `name`: `string` (e.g., "Eiffel Tower")
  - `notes`: `string` (Optional travel notes)
  - `category`: `string` (`nature`, `history`, `museum`, `cafe`, `shopping`, `other`)
  - `date`: `string` (`YYYY-MM-DD`)

- **Expense:**
  - `id`: `string`
  - `tripId`: `string` (Foreign key to Trip)
  - `title`: `string` (e.g., "Dinner at Bistro")
  - `amount`: `number`
  - `category`: `string` (`stay`, `transit`, `food`, `activity`, `shopping`, `other`)
  - `date`: `string` (`YYYY-MM-DD`)

*Cascade Deletion Rule:* Deleting a `Trip` automatically cascades and purges all related `Places` and `Expenses`.

---

## 4. Design System, Theming & i18n Rules

1. **Theme Consumption:**
   - Always consume `useSettings()` from `contexts/SettingsContext.js`:
     ```javascript
     const { theme, themeMode, isDark, setTheme, language, setLanguage, t } = useSettings();
     ```
   - Never hardcode background or text colors (e.g. avoid `#ffffff`, `#000000`). Always use theme tokens: `theme.canvas`, `theme.card`, `theme.textPrimary`, `theme.textSecondary`, `theme.border`, `theme.btnPrimaryBg`, etc.
   - Theme options: `'light'`, `'dark'`, `'system'`. In `'system'` mode, the app listens to the device's native Appearance.

2. **Internationalization (i18n):**
   - Never render raw user-facing strings directly in components.
   - Always retrieve strings via `t('translation_key')`.
   - If adding a new feature with new UI text, update all 6 language blocks in `utils/translations.js` (`en`, `tr`, `es`, `de`, `fr`, `ja`).

3. **User Interaction & Polish:**
   - All modal dialogs must use `ModalSheet` with animated entry and swipe-down-to-dismiss gesture support.
   - Date inputs must use `DatePickerModal` rather than plain text inputs.
   - Use `useMemo`, `useCallback`, and `React.memo` where appropriate to keep FlatList scrolling fluid (60-120 FPS on budget devices).

---

## 5. Development & Deployment Guidelines

- **Development Server:** Run `npx expo start`. Do not restart or kill the dev server on minor code edits; rely on Expo's Fast Refresh.
- **Standalone Build (APK):** Generated using `eas build -p android --profile preview`.
- **Version Bumping:** When releasing updates, increment the version in both `package.json` and `app.json` (e.g., `1.0.0` -> `1.0.1`), then publish tag `v1.0.1` on GitHub with the new `.apk` binary.
- **Scope Discipline:** Focus strictly on the user's requested feature or bug fix. Do not unnecessarily rewrite or refactor unrelated stable files.
- **Auto-approved Operations:** File edits, reading files, and standard git/npm shell commands.