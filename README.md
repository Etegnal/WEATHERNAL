# Weathernal - Hava Durumu Web Sitesi

Modern ve kullanıcı dostu hava durumu web sitesi. Glassmorphism tasarımı, responsive yapı ve OpenWeatherMap API entegrasyonu ile geliştirilmiştir.

## 🌟 Özellikler

### 🔍 **Gelişmiş Arama Sistemi**
- **Autocomplete**: Yazmaya başladığınızda şehir önerileri
- **Gerçek Zamanlı Arama**: Anında sonuçlar
- **Dünya Çapında**: Türkiye ve dünya şehirlerinde arama

### 🌡️ **Sıcaklık Birimi Dönüştürme**
- **Celsius/Fahrenheit**: Tek tıkla birim değiştirme
- **Tüm Veriler**: Sıcaklık, hissedilen sıcaklık, tahmin ve büyük şehirler
- **Hafıza**: Tercih local storage'da saklanır

### 🌍 **Çoklu Dil Desteği**
- **Türkçe/İngilizce**: Tam sayfa çeviri
- **Dinamik İçerik**: Tarih, saat, hava durumu açıklamaları
- **Otomatik Hafıza**: Dil tercihi kaydedilir

### 📊 **Detaylı Hava Durumu Bilgileri**
- **Temel Veriler**: Sıcaklık, hissedilen sıcaklık, rüzgar, nem, görüş
- **Hava Kalitesi**: AQI (Air Quality Index) değerleri
- **UV İndeksi**: Güneş ışınları yoğunluğu
- **Güneş Bilgileri**: Doğuş/batış saatleri ve gündüz süresi

### 🌅 **Görsel Güneş Yolu**
- **Dinamik Konum**: Güneşin güncel saatteki pozisyonu
- **Görsel Tasarım**: Güzel animasyonlu güneş yolu
- **Gerçek Zamanlı**: Saat değiştikçe pozisyon güncellenir

### 📈 **Saatlik Tahmin Grafiği**
- **24 Saatlik Veri**: Güncel saatten başlayarak
- **Çizgi Grafik**: Canvas API ile çizilen interaktif grafik
- **Gerçek Zamanlı**: Her dakika güncellenen veriler
- **Responsive**: Mobilde de mükemmel görünüm

### 🏙️ **Büyük Şehirler Hava Durumu**
- **Anlık Veriler**: Roma, İstanbul, Paris, London
- **Kompakt Tasarım**: Küçük kutucuklar halinde
- **Otomatik Güncelleme**: Her 5 dakikada bir yenilenir
- **Birim Dönüşümü**: C/F değişikliğine uyumlu

### 📱 **Mobil Responsive Tasarım**
- **Hamburger Menü**: Mobilde kompakt header
- **Optimize Layout**: Mobilde dikey düzen
- **Touch Friendly**: Dokunmatik cihazlar için optimize
- **Adaptif Boyutlar**: Tüm ekran boyutlarına uyum

### 🎨 **Modern UI/UX**
- **Glassmorphism**: Şeffaf cam efekti
- **Dark/Light Mode**: Tema değiştirme
- **Smooth Animasyonlar**: Yumuşak geçişler
- **Modern İkonlar**: Font Awesome entegrasyonu

## 🚀 Kurulum

1. **Projeyi İndirin**
   ```bash
   git clone https://github.com/Etegnal/WEATHERNAL.git
   cd WEATHERNAL
   ```

2. **OpenWeatherMap API Anahtarı Alın**
   - [OpenWeatherMap](https://openweathermap.org/) sitesine gidin
   - Ücretsiz hesap oluşturun
   - API Keys bölümünden anahtarınızı alın

3. **API Anahtarını Ekleyin**
   - `script.js` dosyasını açın
   - `YOUR_API_KEY_HERE` yerine API anahtarınızı yazın:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

4. **Projeyi Çalıştırın**
   - `index.html` dosyasını web tarayıcınızda açın
   - Veya local server kullanın:
   ```bash
   python -m http.server 8000
   # veya
   npx serve .
   ```

## 📖 Kullanım

### 🔍 **Şehir Arama**
1. Arama çubuğuna şehir adını yazmaya başlayın
2. Autocomplete önerilerinden birini seçin
3. Veya Enter'a basın/arama butonuna tıklayın

### 🌡️ **Sıcaklık Birimi Değiştirme**
- Sağ üstteki C/F butonuna tıklayın
- Tüm sıcaklık verileri otomatik dönüşür

### 🌍 **Dil Değiştirme**
- C/F butonunun yanındaki TR/EN butonuna tıklayın
- Tüm sayfa içeriği seçilen dile çevrilir

### 📱 **Mobil Kullanım**
- Hamburger menü butonuna tıklayın
- Tema, dil ve sıcaklık birimi ayarlarına erişin
- Menü dışına tıklayarak kapatın

### 🌙 **Tema Değiştirme**
- Sağ üstteki ay/güneş ikonuna tıklayın
- Dark/Light mode arasında geçiş yapın

## 🛠️ Teknolojiler

- **HTML5**: Semantik yapı ve modern elementler
- **CSS3**: Flexbox, Grid, Animasyonlar, Media Queries
- **JavaScript (ES6+)**: Async/Await, Fetch API, Local Storage
- **OpenWeatherMap API**: Current Weather, Forecast, Air Quality
- **Canvas API**: Saatlik tahmin grafiği
- **Font Awesome**: Modern ikonlar
- **Google Fonts**: Poppins font ailesi

## 📡 API Özellikleri

OpenWeatherMap API'si şu verileri sağlar:

### 🌡️ **Temel Hava Durumu**
- Mevcut sıcaklık (Celsius/Fahrenheit)
- Hissedilen sıcaklık
- Rüzgar hızı ve yönü
- Nem oranı
- Görüş mesafesi
- Atmosfer basıncı

### 🌅 **Güneş Bilgileri**
- Gün doğumu ve gün batımı saatleri
- Gündüz süresi hesaplaması
- UV indeksi (hesaplanmış)

### 🌬️ **Hava Kalitesi**
- AQI (Air Quality Index) değeri
- Hava kalitesi seviyesi (İyi, Orta, Kötü, vb.)

### 📊 **Tahmin Verileri**
- 5 günlük hava durumu tahmini
- 3 saatlik aralıklarla detaylı veriler
- Saatlik interpolasyon ile 1 saatlik veriler

## 📁 Dosya Yapısı

```
Weathernal/
├── index.html          # Ana HTML dosyası
├── styles.css          # CSS stilleri ve responsive tasarım
├── script.js           # JavaScript kodu ve API entegrasyonu
├── LOGOERENBEYAZ.png   # Logo dosyası
└── README.md           # Proje dokümantasyonu
```

## 🎨 Özelleştirme

### Renk Teması Değiştirme
`styles.css` dosyasında gradient renklerini değiştirebilirsiniz:
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

body.dark-mode {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}
```

### Büyük Şehirler Listesi
`script.js` dosyasında şehir listesini değiştirebilirsiniz:
```javascript
const majorCities = ['Roma', 'Istanbul', 'Paris', 'London'];
```

### Dil Çevirileri
`script.js` dosyasındaki `translations` objesini düzenleyebilirsiniz:
```javascript
const translations = {
    tr: { /* Türkçe çeviriler */ },
    en: { /* İngilizce çeviriler */ }
};
```

## 📱 Responsive Breakpoints

- **Desktop**: 1200px ve üzeri
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: 480px altı

## 🔧 Özellik Detayları

### Autocomplete Sistemi
- Debouncing ile API çağrı optimizasyonu
- Z-index yönetimi ile katman kontrolü
- Klavye navigasyonu desteği
- Dışarı tıklama ile kapanma

### Saatlik Grafik
- Canvas API ile çizim
- Linear interpolation ile veri doldurma
- Responsive boyutlandırma
- Gerçek zamanlı güncelleme

### Hamburger Menü
- CSS transform animasyonları
- İkon değişimi (bars ↔ times)
- Dışarı tıklama ile kapanma
- Sadece mobilde görünür

## 🌐 Canlı Demo

Projeyi canlı olarak görüntüleyebilirsiniz:
[GitHub Pages Linki](https://etegnal.github.io/WEATHERNAL/)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje Sahibi - [@Etegnal](https://github.com/Etegnal)

Proje Linki: [https://github.com/Etegnal/WEATHERNAL](https://github.com/Etegnal/WEATHERNAL)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
