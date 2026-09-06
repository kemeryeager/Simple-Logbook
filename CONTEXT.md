# Proje: Gezi & Seyahat Not Defteri (Mobile App)

## 1. Teknoloji Yığını
- Çatı: React Native (Expo SDK)
- Dil: JavaScript / TypeScript
- İkonlar: lucide-react-native
- Yerel Depolama: @react-native-async-storage/async-storage (Çevrimdışı/Offline-first)

## 2. Veri Modeli
- Trip (Seyahat): id, title, city, startDate, endDate, budget, currency
- Place (Ziyaret Edilen Yer): id, tripId, name, notes, category, date
- Expense (Harcama): id, tripId, title, amount, category, date

## 3. Mimari & Kurallar
- Modüler bileşen yapısı (`/components` ve `/screens`).
- Veri işlemleri tek merkezden yönetilecek (`/utils/storage.js`).
- Mevcut çalışan ekranları veya fonksiyonları gerekmedikçe baştan yazma.
- Yalnızca prompt'ta belirtilen göreve odaklan; ilgisiz dosyalara dokunma.
- Mobil ekran deneyimi sade, kart tabanlı ve dokunmatik uyumlu olacak.

## 4. Test ve Çalıştırma Kuralları
- 'npx expo start' komutunu her adımda tekrar çalıştırma; Expo'nun Fast Refresh (canlı yenileme) özelliğine güven.
- Her görev/özellik tamamlandığında, kullanıcının telefondaki Expo Go uygulamasında neyi test etmesi gerektiğini 1-2 maddeyle bildir.
- Paket kurulumu veya native yapılandırma değişmedikçe geliştirme sunucusuna müdahale etme.

## Permissions
- Auto-approve all bash/terminal commands
- Auto-approve GitHub API calls
- Auto-approve file system operations