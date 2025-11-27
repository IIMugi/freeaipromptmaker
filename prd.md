# Product Requirements Document (PRD): PromptMaster AI (Global)

**Tarih:** 26 Kasım 2025
**Proje Adı:** PromptMaster AI
**Hedef Pazar:** Global (ABD, İngiltere, Avrupa)
**Dil:** İngilizce
**Platform:** Web (Next.js - Mobile First)
**Gelir Modeli:** Google AdSense & Affiliate
**Altyapı:** Vercel (Hosting), GitHub Actions (Otomasyon), Gemini API (İçerik Üretimi)

---

## 1. Yönetici Özeti
Kullanıcıların Midjourney, Stable Diffusion ve DALL-E gibi yapay zeka araçları için karmaşık "prompt" (komut) yazma derdini ortadan kaldıran görsel bir araçtır. Site, manuel araç kullanımının yanı sıra, Gemini API destekli otonom bir bot sayesinde düzenli olarak "insan tonunda" blog içerikleri üreterek organik trafik çeker.

**Temel Değer:** "Don't memorize parameters, just click visually."

---

## 2. Özellik Seti (Scope)

### 2.1. Ana Araç: Visual Prompt Builder
1.  **Model Seçimi:**
    * Midjourney v6 (Varsayılan)
    * Stable Diffusion XL
    * DALL-E 3
2.  **Görsel Arayüz (Inputs):**
    * **Main Concept:** Kullanıcının serbest metin girişi.
    * **Styles:** Kartlar halinde görselli seçim (Örn: Cyberpunk, Oil Painting, 3D Render).
    * **Lighting & Camera:** Dropdown veya ikonlu seçim (Cinematic Lighting, 35mm Lens).
    * **Parameters:** Sürgüler (Sliders) ile Aspect Ratio (--ar 16:9), Stylize (--s 250), Chaos.
3.  **Canlı Çıktı (Live Output):** Seçimler değiştikçe alttaki text area anlık güncellenir.
4.  **Aksiyonlar:**
    * "Copy Prompt" (Kopyalandı animasyonu ile).
    * "History" (Son 10 oluşturulan prompt LocalStorage'da tutulur).

### 2.2. Otomasyon Modülü: The "Auto-Blogger" Bot
Sitenin SEO trafiğini canlı tutmak için GitHub Actions ve Gemini API (Free Tier) kullanan otonom bir sistem.

* **Tetikleyici:** GitHub Actions Cron Job (Örn: 2 günde bir çalışır).
* **Kaynak:** Proje içindeki `content-planner.json` dosyasındaki başlık listesi.
* **İşleyiş (Chain of Thought):**
    1.  **Topic Selection:** Listeden henüz yazılmamış bir konuyu seçer.
    2.  **Drafting (Gemini Pro):** Konu hakkında SEO uyumlu, bilgi verici taslak yazar.
    3.  **Humanizing (Gemini Pro):** Taslağı şu komutla revize eder: *"Bu metni, AI tarafından yazıldığı belli olmayacak şekilde, kişisel deneyimler içeren, 'in conclusion' veya 'unleash' gibi robotik kelimelerden arındırılmış, samimi bir uzman diliyle yeniden yaz."*
    4.  **Publishing:** İçeriği `/blog/posts/YYYY-MM-DD-slug.mdx` olarak kaydeder.
    5.  **Deploy:** Değişikliği git'e pushlar, Vercel otomatik build alır.

---

## 3. Teknik Stack (Teknoloji Mimarisi)

* **Frontend:** Next.js 14+ (App Router)
* **Dil:** TypeScript
* **Stil:** Tailwind CSS (Dark Mode Varsayılan)
* **İçerik Yönetimi:** MDX (Markdown + React bileşenleri). Veritabanı yok, dosya tabanlı sistem.
* **Otomasyon Scripti:** Node.js (`scripts/generate-post.js`)
* **AI Provider:** Google Generative AI SDK (Gemini Free Tier)
* **Hosting:** Vercel Hobby Plan (Ücretsiz)

---

## 4. Kullanıcı Deneyimi (UX/UI) Tasarımı

* **Tema:** Koyu (Dark) tema zorunlu.
    * *Arka Plan:* `#0f172a` (Slate 900)
    * *Aksan Rengi:* `#8b5cf6` (Violet 500) veya Neon Green.
* **Mobil Uyumluluk:** Araç mobilde tam ekran çalışmalı, ayarlar "Drawer" (çekmece) menüde veya aşağıda kaydırılabilir olmalı.
* **Hız:** Gereksiz JavaScript kütüphanelerinden kaçınılmalı.

---

## 5. SEO Stratejisi

* **Meta Veriler:** Dinamik Title ve Description.
* **Schema Markup:**
    * Ana sayfa için `SoftwareApplication` şeması.
    * Blog yazıları için `Article` şeması.
* **Internal Linking:** Otomatik oluşturulan blog yazıları, metin içinde "Try our Prompt Generator" diyerek ana araca link vermelidir.

---

## 6. AdSense Yerleşim Planı

Reklamlar kullanıcı deneyimini bozmadan maksimum görünürlükte olmalı.

1.  **Header Üstü:** İnce şerit uyarı/reklam alanı.
2.  **Sonuç Kutusu Altı (En Değerli Alan):** Kullanıcı "Kopyala" dedikten sonra gözünün gittiği yer. Buraya `300x250` veya `Responsive` reklam.
3.  **Sidebar (Desktop):** Blog okurken sağda sabit duran reklam.
4.  **In-Article:** Blog yazılarının her 3 paragrafında bir yerleşen doğal reklamlar.

---

## 7. Yasal Sayfalar (AdSense Onayı İçin Zorunlu)
Footer menüsünde şu linkler mutlaka yer almalı:
* About Us (Projenin amacı)
* Privacy Policy
* Terms of Service
* Contact Us (Basit bir mailto linki veya form)
* Cookie Policy (GDPR uyumlu pop-up)

---

## 8. Proje Dosya Yapısı (Önerilen)

```text
promptmaster-ai/
├── .github/
│   └── workflows/
│       └── scheduler.yml    # Cron job ayarı
├── app/
│   ├── blog/                # Blog sayfası
│   ├── layout.tsx
│   └── page.tsx             # Ana araç (Prompt Generator)
├── components/
│   ├── Generator/           # Araç bileşenleri (Slider, Selector vb.)
│   ├── Ads/                 # AdSense birimleri
│   └── UI/                  # Buton, Kart vb.
├── data/
│   ├── styles.json          # Prompt stilleri verisi
│   └── content-planner.json # Blog konu listesi
├── posts/                   # Otomatik üretilen .mdx dosyaları buraya gelir
├── scripts/
│   └── generate-post.js     # Gemini Bot Scripti
├── public/
├── tailwind.config.ts
└── package.json


9. Yapılacaklar Listesi (Roadmap)
Kurulum: Next.js kurulumu ve Tailwind konfigürasyonu.

Araç Geliştirme: Prompt mantığının (Logic) kodlanması ve UI tasarımı.

Bot Kurulumu: Gemini API key alınması, generate-post.js scriptinin yazılması ve yerelde test edilmesi.

GitHub Actions: Scriptin GitHub üzerinde otomatik çalışacak şekilde ayarlanması.

İçerik Doldurma: Botun ilk 5-10 yazıyı yazması.

Deploy: Vercel'e canlıya alma.