let tumEtkinlikler = [];
const konteyner = document.getElementById('kartlar-konteyner');
const mesajAlani = document.getElementById('mesaj-alani');
const aramaKutusu = document.getElementById('arama-kutusu');
const filtreButonlari = document.querySelectorAll('.filtre-btn');
const form = document.getElementById('oneri-formu');
const formMesaj = document.getElementById('form-mesaj');

// API'den Veri Çekme (D2 Yönergesi)
async function etkinlikleriGetir() {
    try {
        const response = await fetch('/api/etkinlikler');
        if (!response.ok) throw new Error('Sunucu hatası: ' + response.status);
        
        tumEtkinlikler = await response.json();
        mesajAlani.style.display = 'none';
        listeyiGuncelle();
    } catch (hata) {
        mesajAlani.textContent = 'Etkinlikler yüklenirken bir hata oluştu: ' + hata.message;
        mesajAlani.style.color = 'red';
    }
}

// Kart Çizimi (C1 Yönergesi)
function kartOlustur(etkinlik) {
    const kart = document.createElement('article');
    kart.className = 'kart';

    const baslik = document.createElement('h3');
    baslik.textContent = etkinlik.baslik;

    const tarih = document.createElement('p');
    const trTarih = new Date(etkinlik.tarih).toLocaleDateString("tr-TR");
    tarih.textContent = '📅 ' + trTarih;

    const yer = document.createElement('p');
    yer.textContent = '📍 ' + etkinlik.yer;

    const kontenjan = document.createElement('p');
    kontenjan.textContent = '👥 Kontenjan: ' + etkinlik.kontenjan;

    const etiket = document.createElement('span');
    etiket.className = 'etiket';
    etiket.textContent = etkinlik.tur.toUpperCase();

    kart.appendChild(baslik);
    kart.appendChild(tarih);
    kart.appendChild(yer);
    kart.appendChild(kontenjan);
    kart.appendChild(etiket);

    return kart;
}

// Filtreleme ve Arama (C2 Yönergesi)
function listeyiGuncelle() {
    const aktifFiltre = document.querySelector('.filtre-btn.secili').dataset.tur;
    const aramaMetni = aramaKutusu.value.toLowerCase();

    // Hem kategori hem metin araması birlikte
    const filtrelenmis = tumEtkinlikler.filter(e => {
        const turUyuyorMu = (aktifFiltre === 'tumu' || e.tur === aktifFiltre);
        const metinUyuyorMu = e.baslik.toLowerCase().includes(aramaMetni);
        return turUyuyorMu && metinUyuyorMu;
    });

    konteyner.innerHTML = ''; // Önceki kartları temizle

    if (filtrelenmis.length === 0) {
        konteyner.innerHTML = '<p>Aramanıza uygun etkinlik yok.</p>';
        return;
    }

    filtrelenmis.forEach(e => {
        konteyner.appendChild(kartOlustur(e));
    });
}

// Olay Dinleyicileri
aramaKutusu.addEventListener('input', listeyiGuncelle);

filtreButonlari.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filtreButonlari.forEach(b => b.classList.remove('secili'));
        e.target.classList.add('secili');
        listeyiGuncelle();
    });
});

// Form Doğrulama (C3 Yönergesi)
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini durdur
    
    const ad = document.getElementById('f-ad').value.trim();
    const tarih = document.getElementById('f-tarih').value;
    const eposta = document.getElementById('f-eposta').value.trim();
    
    formMesaj.className = 'form-mesaj hata';
    
    if (ad.length < 5) {
        formMesaj.textContent = 'Etkinlik adı en az 5 karakter olmalıdır.';
        return;
    }
    
    if (!tarih) {
        formMesaj.textContent = 'Geçerli bir tarih seçmelisiniz.';
        return;
    }
    
    const secilenTarih = new Date(tarih);
    const bugun = new Date();
    bugun.setHours(0,0,0,0);
    
    if (secilenTarih < bugun) {
        formMesaj.textContent = 'Tarih geçmiş bir gün olamaz.';
        return;
    }
    
    const epostaRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!epostaRegex.test(eposta)) {
        formMesaj.textContent = 'Geçerli bir e-posta adresi giriniz.';
        return;
    }
    
    // Her şey doğruysa
    formMesaj.className = 'form-mesaj basari';
    formMesaj.textContent = 'Öneriniz başarıyla alındı. Teşekkürler!';
    form.reset();
});

// Sayfa yüklendiğinde veriyi çek
etkinlikleriGetir();
