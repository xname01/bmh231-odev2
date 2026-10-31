# BMH231 Web Programlama - Ödev 2 (Kampüs Etkinlik Panosu)

Bu proje, Yozgat Bozok Üniversitesi kampüs etkinliklerini listeleyen, filtreleyen ve asenkron veri çeken bir web uygulamasıdır.

## Kurulum ve Çalıştırma
1. Repoyu bilgisayarınıza indirin: `git clone https://github.com/xname01/bmh231-odev2.git`
2. Klasöre girin: `cd bmh231-odev2`
3. Sunucuyu başlatın: `npm start` (veya `node sunucu.js`)
4. Tarayıcıda `http://localhost:3000` adresine gidin.

## API Uç Noktaları
| Yöntem | Uç Nokta | Açıklama |
|---|---|---|
| GET | `/api/etkinlikler` | Tüm etkinlikleri JSON olarak döner |
| GET | `/api/etkinlikler?tur=atolye` | Sadece atölye etkinliklerini döner |
| GET | `/api/etkinlikler/:id` | Belirtilen ID'ye sahip etkinliği döner |
