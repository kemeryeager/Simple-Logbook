# Simple Logbook ✈️📖

[![Release](https://img.shields.io/github/v/release/kemeryeager/Simple-Logbook?color=blue&label=Latest%20Release)](https://github.com/kemeryeager/Simple-Logbook/releases/latest)
[![Version](https://img.shields.io/badge/Version-v1.1.0-blue.svg)](https://github.com/kemeryeager/Simple-Logbook)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-orange.svg)](#)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020.svg?logo=expo)](https://expo.dev)

A modern, blazing-fast, privacy-first, and **offline-capable** travel diary & route logbook for Android and iOS. Built with a clean human-designed aesthetic, Simple Logbook empowers you to plan journeys, organize places of interest with personal notes, track multi-currency budgets, and navigate real-world destinations across the globe.

---

## 🎯 Design Philosophy & Principles

- **Human-Centric & Anti-AI-Slop**: No fake automated recommendations, bloated algorithms, or noisy generic badges. You are the curator of your own travels.
- **100% Privacy & Offline-First**: All data, trips, places, and budgets are persisted locally on your device via AsyncStorage. Zero tracking, zero telemetry, no account registration required.
- **Minimalist Aesthetic**: Fluid micro-interactions, responsive bottom sheets, and an adaptive slate/zinc color palette crafted for clarity in both bright daylight and dark environments.

---

## 📥 Download Standalone APK

You can directly download the latest standalone Android APK (`.apk`) from the **[Releases](https://github.com/kemeryeager/Simple-Logbook/releases/latest)** page:

* **[Download Simple-Logbook-v1.1.0.apk](https://github.com/kemeryeager/Simple-Logbook/releases/download/v1.1.0/Simple-Logbook-v1.1.0.apk)**

> *Install and launch instantly on any modern Android device — works anywhere in the world without an internet connection.*

---

## ✨ Key Features (v1.1.0)

### 🌍 Global Destinations & Smart Geo Infrastructure
- **Two-Step Country & City Picker**: Select your destination country from an alphabetized, searchable directory of 170+ world countries, then pick from all official cities and districts strictly within that country.
- **Prefix-First Smart Search**: Search ranks destinations intuitively — typing `b` prioritizes cities starting with "B", `bu` prioritizes "Bu..." (e.g., Bursa, Burgas, Budapest) instead of arbitrary substrings.
- **Diacritic-Insensitive Search**: Handles international and Turkish diacritics seamlessly (`İ/i`, `I/ı`, `ğ`, `ü`, `ş`, `ö`, `ç`).
- **Offline Geo Cache**: Downloaded city/district databases are cached locally on your device for instant offline access.
- **Custom Location Support**: Add any unlisted village, district, or custom spot with a single tap.

### 🌐 Deep Multi-Language Localization (i18n)
- Native UI localization across **6 languages**:
  - 🇹🇷 **Türkçe** (Default)
  - 🇬🇧 **English**
  - 🇪🇸 **Español**
  - 🇩🇪 **Deutsch**
  - 🇫🇷 **Français**
  - 🇯🇵 **日本語**
- **Dynamic Country Name Localization**: Country names automatically display in the active language (e.g., *Germany* displays as *Almanya* in Turkish, *Deutschland* in German, *Allemagne* in French, *Alemania* in Spanish, and *ドイツ* in Japanese).
- Context-aware localized placeholders and status indicators tailored to the selected country and language.

### 🗺️ Route, Places & Travel Notes
- Organize trips with destination country, city/district, customizable dates, and currency.
- Log places of interest categorized by type (Nature, History, Museum, Cafe & Dining, Shopping, Other).
- Interactive visual date picker for setting trip dates without manual keyboard inputs.

### 💰 Budget & Multi-Currency Expense Tracker
- Set trip budgets and log categorized expenses (Accommodation, Transit, Food & Dining, Activity, Shopping, Other).
- Real-time animated progress bars with color-coded budget warnings (Safe, 80% Warning, Over-Budget).
- Built-in formatting for **9 global currencies**: `₺ TRY`, `$ USD`, `€ EUR`, `£ GBP`, `¥ JPY`, `CHF`, `C$ CAD`, `A$ AUD`, and `CN¥ CNY`.

### 🌓 Adaptive Theming & Tactile UX
- Light Mode, Dark Mode, and automatic System Follower with high-contrast tokens.
- Fluid bottom sheets with tactile swipe-to-dismiss PanResponder gestures on both Android and iOS.
- Micro-interactions with spring animations on cards and interactive buttons.

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **[React Native 0.86](https://reactnative.dev/)** | Core mobile UI framework |
| **[Expo SDK 57](https://docs.expo.dev/)** | Runtime environment, build tooling & modules |
| **[React 19](https://react.dev/)** | Modern state & component model |
| **[AsyncStorage](https://github.com/react-native-async-storage/async-storage)** | Offline-first client-side data persistence |
| **[Lucide React Native](https://lucide.dev/)** | Clean, minimalist vector iconography |
| **[React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)** | Edge-to-edge layout & system insets |

---

## 🚀 Getting Started (Development)

### Prerequisites
- Node.js (v18 or higher recommended)
- [Expo Go](https://expo.dev/client) app on your physical phone, or an Android/iOS emulator.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kemeryeager/Simple-Logbook.git
   cd Simple-Logbook
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on your device:**
   - **Android**: Open **Expo Go** and scan the QR code displayed in your terminal.
   - **iOS**: Scan the QR code using your phone's native Camera app to launch in Expo Go.

---

## 📦 Building Standalone Binaries

The project is pre-configured with EAS Build (`eas.json`). To build an Android APK:

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build Android APK (preview profile)
eas build -p android --profile preview
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.