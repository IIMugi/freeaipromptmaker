# PromptMaster AI - Agent Instructions

## 🚨 KRİTİK KURALLAR (MUTLAKA UYULMALI)

### 1. Context7 Kullanımı (ZORUNLU)
Herhangi bir kütüphane veya framework kullanmadan önce **mutlaka** Context7 ile güncel dokümantasyon çek:

```
1. mcp_context7_resolve-library-id → Library ID al
2. mcp_context7_get-library-docs → Güncel API docs çek
```

**Asla eski bilgilerle kod yazma!** Next.js, React, Tailwind vs. hepsi için güncel docs kontrol et.

### 2. Browser Test (ZORUNLU)
Her özellik implementasyonu sonrası **@Browser** ile test yap:

```
1. browser_navigate → Sayfaya git
2. browser_snapshot → Elementleri kontrol et
3. browser_click/type → Etkileşim
4. browser_console_messages → Hata kontrolü
```

### 3. Maksimum Verimlilik
- **Bir session'da yazabileceğin kadar çok kod yaz**
- Gereksiz onay bekleme
- Paralel tool calls kullan
- Tüm dosyaları tek seferde oluştur

---

## 📋 Proje Bilgileri

**Proje:** PromptMaster AI
**Amaç:** AI art araçları için görsel prompt builder
**Stack:** Next.js 14+, TypeScript, Tailwind CSS
**Tema:** Dark mode (#0f172a), Violet accent (#8b5cf6)

---

## 🎨 Kod Stili

### TypeScript
- Strict mode, `any` kullanma
- Interface'ler için `I` prefix kullanma
- Props interface'lerini component ile aynı dosyada tut

### React
- Fonksiyonel componentler (class yok)
- Named exports tercih et
- Custom hooks `use` prefix'i ile

### Tailwind
- Inline style kullanma
- `cn()` utility ile class birleştir
- Mobile-first responsive

### Dosya İsimlendirme
- Components: PascalCase (`PromptBuilder.tsx`)
- Utilities: camelCase (`buildPrompt.ts`)
- Configs: lowercase (`tailwind.config.ts`)

---

## 📁 Dosya Yapısı

```
app/                    # Next.js pages
├── page.tsx           # Ana sayfa (Prompt Generator)
├── blog/              # Blog sayfaları
└── (legal)/           # Yasal sayfalar

components/
├── Generator/         # Prompt builder bileşenleri
├── Ads/              # AdSense bileşenleri
└── UI/               # Genel UI (Button, Card vs.)

data/                  # Static JSON
posts/                 # MDX blog yazıları
scripts/               # Otomasyon scriptleri
lib/                   # Utility fonksiyonlar
```

---

## 🔧 Önemli Patternler

### State Management
```typescript
// LocalStorage hook kullan
const [history, setHistory] = useLocalStorage<Prompt[]>('history', []);
```

### Prompt Building
```typescript
// Pure function, side effect yok
const prompt = buildPrompt({ model, styles, params });
```

### Error Handling
```typescript
try {
  // risky operation
} catch (error) {
  console.error('[ComponentName]', error);
  // graceful fallback
}
```

---

## 📚 Memory Bank

Projenin durumunu `memory-bank/` klasöründe takip et:
- `activeContext.md` → Şu anki odak
- `progress.md` → İlerleme durumu

Her session başında bu dosyaları oku!

