# Technical Context: PromptMaster AI

## 🛠️ Teknoloji Stack

### Core
| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| Next.js | 14.x+ | Framework (App Router) |
| React | 18.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 3.x | Styling |

### Yardımcı
| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| Framer Motion | Animasyonlar |
| MDX | Blog içerikleri |
| Lucide React | İkonlar |
| clsx/cn | Class merging |

### Backend/Infra
| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| Vercel | Hosting |
| GitHub Actions | CI/CD & Otomasyon |
| Gemini API | AI İçerik Üretimi |

---

## 📦 Package.json Yapısı

```json
{
  "name": "promptmaster-ai",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "generate-post": "node scripts/generate-post.js"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.0.0",
    "@next/mdx": "^14.0.0",
    "@mdx-js/react": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "@google/generative-ai": "^0.1.0"
  }
}
```

---

## ⚙️ Konfigürasyon Dosyaları

### next.config.js
```javascript
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    domains: [],
  },
};

export default withMDX(nextConfig);
```

### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a',
        },
        violet: {
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🌍 Environment Variables

```bash
# .env.local (Asla commit'leme!)
GEMINI_API_KEY=your_api_key_here

# .env.example (Repo'da olabilir)
GEMINI_API_KEY=
```

---

## 🔗 API Endpoints (Olası Genişleme)

```
/api/
├── prompt/history   # GET: Kullanıcı geçmişi (opsiyonel)
└── generate         # POST: AI prompt önerisi (opsiyonel)
```

---

## 📊 Performance Hedefleri

| Metrik | Hedef |
|--------|-------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |

