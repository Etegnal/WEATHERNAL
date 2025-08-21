# Weathernal - Hava Durumu Web Sitesi

Modern ve kullanıcı dostu hava durumu web sitesi. Mavi arka plan tasarımı, responsive yapı ve OpenWeatherMap API entegrasyonu ile geliştirilmiştir.

## Özellikler

- 🌤️ **Gerçek Zamanlı Hava Durumu**: OpenWeatherMap API ile güncel veriler
- 🔍 **Şehir Arama**: Türkiye ve dünya şehirlerinde arama yapabilme
- 🌙 **Dark/Light Mode**: Tema değiştirme özelliği
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- 🎨 **Modern UI**: Glassmorphism tasarım stili
- 📊 **Detaylı Bilgiler**: Sıcaklık, hissedilen sıcaklık, rüzgar, nem, görüş mesafesi
- 🌅 **Güneş Bilgileri**: Gün doğumu ve gün batımı saatleri

## Kurulum

1. **Projeyi İndirin**
   ```bash
   git clone [repository-url]
   cd Weathernal
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

## Kullanım

1. **Şehir Arama**: Arama çubuğuna şehir adını yazın ve Enter'a basın veya arama butonuna tıklayın
2. **Tema Değiştirme**: Sağ üstteki ay/güneş ikonuna tıklayarak dark/light mode arasında geçiş yapın
3. **Hava Durumu Bilgileri**: Seçilen şehrin detaylı hava durumu bilgilerini görüntüleyin

## Teknolojiler

- **HTML5**: Semantik yapı
- **CSS3**: Modern stiller ve animasyonlar
- **JavaScript (ES6+)**: Dinamik içerik ve API entegrasyonu
- **OpenWeatherMap API**: Hava durumu verileri
- **Font Awesome**: İkonlar
- **Google Fonts**: Poppins font ailesi

## API Özellikleri

OpenWeatherMap API'si şu verileri sağlar:
- 🌡️ Mevcut sıcaklık
- 🌡️ Hissedilen sıcaklık
- 💨 Rüzgar hızı ve yönü
- 💧 Nem oranı
- 👁️ Görüş mesafesi
- 🌅 Gün doğumu ve gün batımı
- ☁️ Hava durumu açıklaması
- 🎯 Hava durumu ikonları

## Dosya Yapısı

```
Weathernal/
├── index.html          # Ana HTML dosyası
├── styles.css          # CSS stilleri
├── script.js           # JavaScript kodu
├── LOGOERENBEYAZ.png   # Logo dosyası
└── README.md           # Proje dokümantasyonu
```

## Özelleştirme

### Renk Teması Değiştirme
`styles.css` dosyasında gradient renklerini değiştirebilirsiniz:
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Font Değiştirme
Google Fonts'tan yeni font seçebilirsiniz:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Proje Sahibi - [@your_twitter](https://twitter.com/your_twitter)

Proje Linki: [https://github.com/your_username/Weathernal](https://github.com/your_username/Weathernal)
