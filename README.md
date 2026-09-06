# Simple Logbook ✈️📖

[![Release](https://img.shields.io/github/v/release/kemeryeager/Simple-Logbook?color=blue&label=Latest%20Release)](https://github.com/kemeryeager/Simple-Logbook/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-orange.svg)](#)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020.svg?logo=expo)](https://expo.dev)

A modern, fast, privacy-focused, and **offline-first** travel diary & route planner mobile application. Designed to organize trips, log visited spots with custom notes, manage expenses in real time, and work seamlessly without an internet connection.

---

## 📥 Download Standalone APK

You can directly download the latest standalone Android APK (`.apk`) from the **[Releases](https://github.com/kemeryeager/Simple-Logbook/releases/latest)** page:

* **[Download Simple-Logbook-v1.0.0.apk](https://github.com/kemeryeager/Simple-Logbook/releases/download/v1.0.0/Simple-Logbook-v1.0.0.apk)**

> *No account or external cloud setup needed — install and run instantly on your Android phone.*

---

## ✨ Key Features

- **🗺️ Trip & Route Management:** Easily create trips with destination cities, customizable dates, and route overviews.
- **📅 Interactive Visual Calendar Picker:** Pick trip and entry dates effortlessly using an on-screen calendar modal without manual keyboard inputs.
- **📍 Places & Travel Notes:** Log places of interest categorized by type (Nature, History, Museum, Cafe, Shopping, etc.) with personal notes.
- **💰 Budget & Expense Tracker:** Set a trip budget, track spending in real time with automated progress bars and remaining balance alerts.
- **💱 8 Global Currencies:** Built-in support for `TRY (₺)`, `USD ($)`, `EUR (€)`, `GBP (£)`, `JPY (¥)`, `CHF`, `CAD`, `AUD`, and `CNY`.
- **🌐 Multilingual Support (i18n):** Native localized interface supporting **6 languages**:
  - 🇺🇸 English
  - 🇹🇷 Turkish (Türkçe)
  - 🇪🇸 Spanish (Español)
  - 🇩🇪 German (Deutsch)
  - 🇫🇷 French (Français)
  - 🇯🇵 Japanese (日本語)
- **🌓 Adaptive Theme Engine:** Supports Light Mode, Dark Mode, and an automatic System theme follower with smooth color transitions.
- **👆 Gesture-Driven Bottom Sheets:** Swipe-to-dismiss gesture support on all modal sheets for a fluid, tactile mobile feel.
- **⚡ High Performance & Lightweight:** Built with `React.memo`, callback memoization, and virtualized lists (`FlatList`) ensuring a silky 60/120 FPS experience with negligible battery and memory overhead (~40 MB RAM).

---

## 🛠️ Tech Stack & Architecture

| Technology | Role |
| :--- | :--- |
| **[React Native 0.86](https://reactnative.dev/)** | Core mobile UI framework |
| **[Expo SDK 57](https://docs.expo.dev/)** | Runtime environment, build tooling & modules |
| **[React 19](https://react.dev/)** | Modern state & component model |
| **[AsyncStorage](https://github.com/react-native-async-storage/async-storage)** | Offline-first, client-side data persistence |
| **[Lucide React Native](https://lucide.dev/)** | Crisp, vector-based iconography |

---

## 🚀 Getting Started (Development)

To run the project locally on your development machine:

### Prerequisites
- Node.js (v18 or higher recommended)
- [Expo Go](https://expo.dev/client) app installed on your physical mobile device, or an Android/iOS simulator.

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

4. **Scan the QR code:**
   - On **Android**: Open the **Expo Go** app and scan the QR code displayed in your terminal.
   - On **iOS**: Open the native Camera app and tap the prompt to open in Expo Go.

---

## 📦 Building Standalone Binaries

The project is pre-configured with EAS Build (`eas.json`). To build your own standalone APK:

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