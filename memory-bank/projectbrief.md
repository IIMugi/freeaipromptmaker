# Project Brief: Free AI Prompt Maker

## 🌐 CANLI SİTE: https://freeaipromptmaker.com

---

## 📋 Proje Özeti

**Free AI Prompt Maker**, Midjourney, DALL-E 3 ve Stable Diffusion için görsel prompt oluşturucu web uygulamasıdır. Kullanıcılar karmaşık prompt sözdizimini ezberlemeden, görsel arayüz üzerinden profesyonel promptlar oluşturabilir.

---

## 🎯 Temel Özellikler

### 1. Visual Prompt Builder (ANA ÖZELLİK)
- Model seçimi (Midjourney v6, SDXL, DALL-E 3)
- 12 Art Style + 6 Photography Style + 6 Mood
- Lighting & Camera ayarları
- Aspect Ratio, Stylize, Chaos parametreleri
- Canlı prompt önizleme
- One-click kopyalama
- LocalStorage ile geçmiş

### 2. Blog Sistemi
- MDX tabanlı blog postları
- Otomatik içerik üretimi (Gemini AI)
- SEO optimizeli
- Kategori rotasyonu

### 3. Auto-Blogger Bot
- 10 Gemini API key rotation
- Günde 1 post limiti
- Konu tekrarı önleme
- Humanize edilmiş içerik
- GitHub Actions ile otomasyon

---

## 🛠 Teknoloji Stack

| Kategori | Teknoloji |
|----------|-----------|
| Framework | Next.js 16.0.5 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |
| AI | Google Gemini 2.5 Pro |
| Hosting | Vercel |
| Domain | Google Domains |
| CI/CD | GitHub Actions |

---

## 🎨 Tasarım

- **Tema:** Dark Mode Only
- **Arka Plan:** #0f172a (Slate 900)
- **Aksan:** #8b5cf6 (Violet 500)
- **Font:** System fonts
- **Responsive:** Mobile-first

---

## 📁 Dosya Yapısı

```
freeaipromptmaker/
├── app/                    # Next.js pages
│   ├── page.tsx           # Ana sayfa (Generator)
│   ├── blog/              # Blog sayfaları
│   ├── (legal)/           # Yasal sayfalar
│   ├── sitemap.ts         # Dinamik sitemap
│   └── robots.ts          # SEO kuralları
├── components/
│   ├── Generator/         # Prompt builder
│   ├── Ads/              # AdSense
│   ├── UI/               # Genel UI
│   └── Layout/           # Header, Footer
├── data/
│   ├── styles.json       # Prompt stilleri
│   ├── content-planner.json
│   └── content-history.json
├── posts/                 # MDX blog yazıları
├── scripts/
│   └── content-manager.js # Auto-blogger
├── lib/                   # Utilities
├── memory-bank/          # AI context
└── .github/workflows/    # CI/CD
```

---

## 🔗 Önemli Linkler

| Kaynak | URL |
|--------|-----|
| Canlı Site | https://freeaipromptmaker.com |
| GitHub Repo | https://github.com/IIMugi/freeaipromptmaker |
| Vercel Dashboard | https://vercel.com/korays-projects-25e89661/n1sche |
| Search Console | https://search.google.com/search-console |

---

## 📊 Mevcut Durum

- ✅ Site canlı ve çalışıyor
- ✅ 2 blog post yayında
- ✅ SEO yapılandırılmış
- ✅ Google Search Console doğrulanmış
- ⏳ GitHub push beklemede
- ⏳ AdSense başvurusu (post sayısı artınca)

---

## 👤 Hedef Kitle

1. **AI Art Meraklıları** - Prompt yazma konusunda yeni
2. **Dijital Sanatçılar** - Hızlı prompt üretmek isteyen
3. **Content Creator'lar** - Görsel içerik üretenler
4. **Hobi Kullanıcıları** - Eğlence amaçlı AI art

---

## 💰 Gelir Modeli

1. **Google AdSense** - Ana gelir kaynağı
   - Header banner
   - Result area (copy sonrası)
   - Blog sidebar
   - In-article reklamlar

2. **Potansiyel Gelecek:**
   - Premium templates
   - API erişimi
   - Sponsorlu içerik
