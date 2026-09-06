# Simple Logbook (v1.0.0)

Modern, akıcı ve çevrimdışı (offline-first) çalışan kişisel Gezi, Seyahat & Rota Günlüğü mobil uygulaması.

---

## Özellikler

- **Seyahat & Rota Yönetimi:** Seyahat oluşturma, şehir/bölge belirleme, başlangıç ve bitiş tarihleri.
- **İnteraktif Takvim Seçici:** Tarihleri klavyeden girmek yerine ekranda açılan sezgisel görsel takvimden kolayca seçebilme.
- **Gezilecek Yerler & Ziyaret Notları:** Ziyaret edilen yerleri kategorize etme (Doğa, Tarih, Müze, Kafe, Alışveriş vb.), kişisel seyahat notları tutabilme.
- **Bütçe & Harcama Takibi:** Seyahat bütçesi belirleme, dinamik harcama ekleme, bütçe aşım uyarısı ve kalan miktar hesaplaması.
- **8 Küresel Para Birimi:** TRY, USD, EUR, GBP, JPY, CHF, CAD, AUD, CNY desteği ve bütçe düzenleme olanağı.
- **Çoklu Dil Desteği (i18n):** Türkçe (TR), İngilizce (EN), İspanyolca (ES), Almanca (DE), Fransızca (FR), Japonca (JA).
- **Akıllı Tema Sistemi:** Aydınlık (Light), Karanlık (Dark) ve cihaz temasını otomatik izleyen (Auto/System) tema motoru.
- **Aşağı Kaydırarak Kapatma (Swipe-to-Dismiss):** Tüm açılır form pencereleri parmakla üst kısımdan aşağı kaydırılarak akıcı biçimde kapatılabilir.
- **Performans & Optimizasyon:** React.memo, useMemo/useCallback önbellekleme ve FlatList sanallaştırması ile 60/120 FPS akıcı liste deneyimi.

---

## Başlangıç

```bash
# Expo dev server başlatın
npx expo start
```

Expo Go uygulaması ile QR kodu okutarak Android/iOS cihazınızda anında çalıştırabilirsiniz.

---

## Teknolojiler

- **Expo SDK 57**
- **React Native 0.86**
- **React 19**
- **Lucide Icons** (`lucide-react-native`)
- **AsyncStorage** (`@react-native-async-storage/async-storage`)