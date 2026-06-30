// ============================================================
//  İÇERİK MERKEZİ
//  Sitedeki tüm metin/veri buradan düzenlenir.
//  • CV'den gelen GERÇEK veriler kullanıldı.
//  • [TASLAK] etiketli alanlar yer tutucudur — gerçeğiyle değiştir.
// ============================================================

export const brand = {
  name: "Yiğit Yetişken", // marka adı (logo + üst başlık)
  fullName: "Yiğitcan Yetişken", // resmi tam ad (Hakkımda'da)
  role: "Fitness & Kişisel Antrenör",
  tagline: "Disiplin. Performans. Dönüşüm.",
  phoneDisplay: "0543 885 90 43",
  phoneIntl: "905438859043",
  email: "yigitcan_112@hotmail.com",
  instagram: "yigityetisken",
  instagramUrl: "https://instagram.com/yigityetisken",
  location: "Kütahya · Online Koçluk",
};

export const whatsappUrl = (
  msg = "Merhaba Yiğit, koçluk paketleri hakkında bilgi almak istiyorum."
) => `https://wa.me/${brand.phoneIntl}?text=${encodeURIComponent(msg)}`;

export const nav = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımda", href: "/hakkimda" },
  { label: "Üyelik", href: "/uyelik" },
];

// ---------- ANA SAYFA / HERO ----------
export const hero = {
  kicker: "Kişisel Antrenör · Kütahya & Online",
  titleLines: ["FORMUN", "TESADÜF", "DEĞİL"],
  subtitle:
    "Sahada geçen 15 yıl tek bir amaca odaklandı: senin fiziksel dönüşümün. Kanıtlanmış disiplin, ölçülebilir sonuç.",
  ctaPrimary: "Hemen Başla",
  ctaSecondary: "Paketleri Gör",
};

// ---------- İSTATİSTİKLER (CV'den, gerçek) ----------
export const stats = [
  { value: "15+", label: "Yıl Saha Deneyimi" },
  { value: "04", label: "Uzmanlık Disiplini" },
  { value: "07", label: "Profesyonel Kurum" },
  { value: "MSc", label: "Spor Bilimleri (Y. Lisans)" },
];

// ---------- DİSİPLİNLER (CV'den, gerçek) — Hakkımda'da detaylı ----------
export const disciplines = [
  {
    no: "01",
    title: "Fitness & Kişisel Antrenörlük",
    desc: "Hedefe özel kuvvet, kondisyon ve vücut kompozisyonu programları. Bireysel takip, ölçülebilir ilerleme.",
    tags: ["Kuvvet", "Kondisyon", "Vücut Kompozisyonu"],
  },
  {
    no: "02",
    title: "Futbol & Kaleci Antrenörlüğü",
    desc: "Fenerbahçe ve Altınordu altyapılarında edinilen profesyonel saha tecrübesi; teknik ve fiziksel gelişim.",
    tags: ["Altyapı", "Kaleci", "Performans"],
  },
  {
    no: "03",
    title: "Tenis",
    desc: "Üniversite ihtisası ve aktif kort eğitmenliği; teknik, taktik ve oyun kondisyonu.",
    tags: ["Teknik", "Kort", "Kondisyon"],
  },
  {
    no: "04",
    title: "Yüzme",
    desc: "Spor kulübü eğitmenliği deneyimiyle teknik gelişim ve dayanıklılık çalışması.",
    tags: ["Teknik", "Dayanıklılık"],
  },
];

// ---------- HAKKIMDA — biyografi (CV'den, gerçek) ----------
export const about = {
  lead:
    "9 yaşında futbolla başlayan, yaklaşık 15 yıl aktif sporculukla süren bir hikâye. Bugün bu birikimi, bireylerin fiziksel gelişimine profesyonel bir disiplinle aktarıyorum.",
  paragraphs: [
    "9 yaşında futbol branşıyla başladığım spor hayatımda yaklaşık 15 yıl aktif futbol geçmişine sahibim. Aktif sporculuk dönemimin ardından futbol, fitness, tenis ve yüzme branşlarında baş antrenör ve yardımcı antrenör olarak çeşitli kurumlarda görev aldım; ayrıca beden eğitimi öğretmeni olarak çalışma deneyimi edindim.",
    "Günümüzde aktif olarak fitness, tenis ve futbol sporlarıyla ilgilenmeye devam ediyorum. Sporcu gelişimi, fiziksel performans, disiplinli çalışma ve sağlıklı yaşam alanlarında kendimi sürekli geliştirmeyi hedefliyorum.",
    "Çalışkan, dürüst, sorumluluk sahibi ve ekip çalışmasına uyumlu bir yapım var. Edindiğim sporculuk ve antrenörlük deneyimini, bireylerin fiziksel gelişimine katkı sağlayacak profesyonel bir yaklaşımla kullanmayı amaçlıyorum.",
  ],
};

// ---------- DENEYİM (CV'den, gerçek) ----------
export const experience = [
  { period: "2026 — Devam", role: "Freelance Personal Trainer", org: "Bağımsız", place: "Kütahya", current: true },
  { period: "2024 — 2026", role: "Fitness Eğitmeni / Personal Trainer", org: "Tolga Geçim Fitness Center", place: "Kütahya" },
  { period: "2024 — 2025", role: "Beden Eğitimi Öğretmeni", org: "Girne Koleji", place: "Kütahya" },
  { period: "2022 — 2026", role: "Tenis Eğitmeni (Freelance)", org: "Bağımsız", place: "Kütahya" },
  { period: "2021 — 2022", role: "Yüzme Eğitmeni", org: "Adens Spor Kulübü", place: "Kütahya" },
  { period: "2020 — 2021", role: "Fitness Eğitmeni / Personal Trainer", org: "King of Gym", place: "Mersin" },
  { period: "2019 — 2020", role: "Kaleci & Futbol Antrenörü", org: "Altınordu Futbol Okulları", place: "Kütahya" },
  { period: "2017 — 2019", role: "Altyapı & Kaleci Antrenörü", org: "Fenerbahçe Futbol Okulları", place: "Kütahya" },
];

// ---------- EĞİTİM (CV'den, gerçek) ----------
export const education = [
  { period: "2025 — Devam", title: "Spor Bilimleri Fakültesi — Yüksek Lisans", org: "Dumlupınar Üniversitesi" },
  { period: "2024 — 2025", title: "Eğitim Fakültesi — Formasyon Eğitimi", org: "Dumlupınar Üniversitesi" },
  { period: "2017 — 2024", title: "Spor Bilimleri / Spor Yöneticiliği — Lisans (Kort Tenis İhtisası)", org: "Kütahya Dumlupınar Üniversitesi" },
];

// ---------- SERTİFİKALAR (CV'den, gerçek) ----------
export const certifications = [
  { year: "2026", title: "Fitness Eğitmenliği", org: "Türkiye Vücut Geliştirme, Fitness ve Bilek Güreşi Federasyonu" },
  { year: "2022", title: "Personal Trainer Eğitimi", org: "İstanbul Gedik Üniversitesi" },
  { year: "2022", title: "Futbol Scoutluğu — Temel Seviye", org: "PSFA · Foundation Phase Scouting" },
];

// ---------- DİLLER (CV'den, gerçek) ----------
export const languages = [
  { lang: "İngilizce", level: "B1" },
  { lang: "Almanca", level: "A2" },
];

// ---------- PAKET ÖNİZLEME (model tipleri gerçek; fiyat sonra) ----------
export const packagesPreview = [
  { no: "01", title: "Online Koçluk", desc: "Uzaktan, kişiye özel antrenman ve beslenme takibi; düzenli kontrol.", note: "3 & 6 Aylık" },
  { no: "02", title: "Birebir Antrenman", desc: "Yüz yüze, birebir seans bazlı çalışma; teknik ve form üzerine yoğunlaşma.", note: "Seans / Paket" },
  { no: "03", title: "Program Paketleri", desc: "Belirli süreli, tek seferlik ve hedef odaklı hazır programlar.", note: "8 / 12 Hafta" },
];

// ---------- DÖNÜŞÜMLER (görseller sonra eklenecek) ----------
export const transformations = [
  { label: "[TASLAK] Dönüşüm 01", caption: "Görsel eklenecek — önce/sonra" },
  { label: "[TASLAK] Dönüşüm 02", caption: "Görsel eklenecek — önce/sonra" },
  { label: "[TASLAK] Dönüşüm 03", caption: "Görsel eklenecek — önce/sonra" },
];

// ---------- DANIŞAN YORUMLARI ([TASLAK] — gerçeğiyle değiştir) ----------
export const testimonials = [
  { quote: "[TASLAK YORUM] Programa başladığımdan beri hem formum hem disiplinim tamamen değişti. Takip ve geri bildirim kusursuz.", name: "[Danışan Adı]", result: "[Sonuç / Süre]" },
  { quote: "[TASLAK YORUM] Daha önce çok denedim ama ilk kez sürdürülebilir bir sistem oturttum. Sonuçlar ölçülebilir.", name: "[Danışan Adı]", result: "[Sonuç / Süre]" },
  { quote: "[TASLAK YORUM] Birebir seanslarda tekniğe verdiği önem fark yaratıyor. Profesyonel ve motive edici.", name: "[Danışan Adı]", result: "[Sonuç / Süre]" },
];

// ---------- SSS (taslak — düzenlenebilir) ----------
export const faq = [
  { q: "Online koçluk nasıl işliyor?", a: "Hedeflerini ve mevcut durumunu değerlendirdikten sonra sana özel antrenman ve beslenme planı hazırlanır. İlerlemeni düzenli aralıklarla birlikte takip eder, planı gerektikçe güncelleriz." },
  { q: "Hiç spor geçmişim yok, başlayabilir miyim?", a: "Kesinlikle. Programlar seviyene göre kurgulanır; sıfırdan başlayanlar için temel hareket kalıpları ve kademeli yüklenme önceliklidir." },
  { q: "Beslenme takibi dahil mi?", a: "Online koçluk paketlerinde antrenmanın yanı sıra hedefe uygun beslenme yönlendirmesi de yer alır. Detaylar pakete göre değişir." },
  { q: "Birebir antrenmanlar nerede yapılıyor?", a: "Yüz yüze seanslar için lokasyon ve uygunluk WhatsApp üzerinden netleştirilir. Online koçluk ise tüm Türkiye'den katılıma açıktır." },
  { q: "Ödeme ve başlangıç nasıl oluyor?", a: "Şu an başvurular WhatsApp ve başvuru formu üzerinden alınıyor. Sana en uygun paketi birlikte belirleyip süreci başlatıyoruz." },
];

export const closingCta = {
  kicker: "Bir sonraki versiyonun seni bekliyor",
  title: "BUGÜN BAŞLA",
  desc: "İlk adımı at; hedefine giden planı birlikte kuralım.",
};
