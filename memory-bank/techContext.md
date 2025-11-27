# Tech Context: Free AI Prompt Maker

## 🛠 Teknoloji Stack

### Core
| Paket | Versiyon | Açıklama |
|-------|----------|----------|
| Next.js | 16.0.5 | React framework (App Router) |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS |

### Dependencies
| Paket | Versiyon | Kullanım |
|-------|----------|----------|
| motion | 12.4.7 | Animasyonlar |
| lucide-react | 0.468.0 | İkonlar |
| clsx | 2.1.1 | Class birleştirme |
| @google/genai | 1.30.0 | Gemini AI SDK |
| gray-matter | 4.0.3 | MDX frontmatter parse |
| remark | 15.0.1 | Markdown işleme |
| remark-html | 16.0.1 | Markdown → HTML |
| dotenv | 17.2.3 | Environment variables |

---

## 🔐 Environment Variables

### .env.local (Lokal Geliştirme)
```env
# Vercel (otomatik eklendi)
VERCEL_OIDC_TOKEN=...

# Site
NEXT_PUBLIC_SITE_URL=https://freeaipromptmaker.com

# Gemini API Keys (10 adet, rotation için)
GEMINI_API_KEY_1=AIzaSy...
GEMINI_API_KEY_2=AIzaSy...
...
GEMINI_API_KEY_10=AIzaSy...

# AdSense (onay sonrası)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=

# Google Search Console
NEXT_PUBLIC_GOOGLE_VERIFICATION=6DR-MOyyqAl2J1RMrINk3G2xaTkn8BX0q4Sc9DvyV1Y
```

### GitHub Secrets (Production Auto-Blogger için)
```
GEMINI_API_KEY_1 through GEMINI_API_KEY_10
```

---

## 🌐 DNS Yapılandırması

### Google Domains → Vercel
| Kayıt | Tür | Değer |
|-------|-----|-------|
| @ | A | 76.76.21.21 |
| www | CNAME | cname.vercel-dns.com |
| @ | TXT | google-site-verification=6DR-MOyyqAl2J1RMrINk3G2xaTkn8BX0q4Sc9DvyV1Y |

---

## 📦 Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "daily-content": "node scripts/content-manager.js"
}
```

---

## 🤖 Auto-Blogger Sistemi

### API Key Rotation
- 10 Gemini API key
- Model: `gemini-2.5-pro`
- Free Tier Limits: 2 RPM, 50 RPD
- Exhausted key otomatik skip

### Content Management
```
data/content-history.json
├── publishedTopics[]     # Yazılan konu ID'leri
├── publishedTitles[]     # Yazılan başlıklar
├── publishedKeywords[]   # Kullanılan keywordler
├── lastCategory          # Son kategori
├── totalPosts            # Toplam post sayısı
├── lastPublishDate       # Son yayın tarihi
└── categoryRotation      # Kategori rotasyon sayacı
```

### Kategori Rotasyonu
```javascript
const CONTENT_CATEGORIES = [
  'midjourney',
  'stable-diffusion', 
  'dall-e',
  'prompt-techniques',
  'art-styles',
  'tutorials',
  'comparisons',
  'tips-tricks',
  'use-cases',
  'trending'
];
```

---

## 🔄 GitHub Actions

### daily-content.yml
- **Schedule:** Her gün 06:00 UTC
- **Trigger:** Manuel dispatch da mümkün
- **Steps:**
  1. Checkout repo
  2. Setup Node.js 20
  3. Install dependencies
  4. Run `npm run daily-content`
  5. Commit & push (eğer yeni post varsa)

---

## 📁 Önemli Dosyalar

### Konfigürasyon
- `next.config.ts` - Next.js config
- `tailwind.config.ts` - Yok (CSS-based Tailwind 4)
- `tsconfig.json` - TypeScript config
- `postcss.config.mjs` - PostCSS config

### SEO
- `app/sitemap.ts` - Dinamik sitemap
- `app/robots.ts` - Crawler kuralları
- `app/layout.tsx` - Schema.org, meta tags

### Blog
- `posts/*.mdx` - Blog içerikleri
- `lib/blog.ts` - Blog utilities
- `app/blog/[slug]/page.tsx` - Dinamik post sayfası

---

## 🚀 Deploy

### Vercel
- **Project:** n1sche
- **Team:** korays-projects-25e89661
- **Build:** `next build`
- **Node:** 24.x
- **Region:** Washington D.C. (iad1)

### Domains
- freeaipromptmaker.com → Production
- www.freeaipromptmaker.com → Production
- n1sche.vercel.app → Vercel default

---

## 🐛 Bilinen Sorunlar

### 1. GitHub Push Credential
- **Sorun:** `emirluffy` kullanıcısı cache'de kalmış
- **Çözüm:** Windows Credential Manager'dan temizle

### 2. Blog Post Intro
- **Sorun:** Gemini "Here is the rewritten..." ile başlıyor
- **Çözüm:** content-manager.js'de regex ile temizle (TODO)

---

## 📅 Son Güncelleme
**Tarih:** 2025-11-27
