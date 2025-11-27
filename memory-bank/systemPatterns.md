# System Patterns: PromptMaster AI

## 🏗️ Mimari Genel Bakış

```
┌─────────────────────────────────────────────────┐
│                    FRONTEND                      │
│              (Next.js App Router)                │
├─────────────────────────────────────────────────┤
│  app/                                            │
│  ├── page.tsx (Prompt Generator)                 │
│  ├── blog/                                       │
│  │   ├── page.tsx (Blog listing)                 │
│  │   └── [slug]/page.tsx (Blog post)             │
│  └── (legal pages)                               │
├─────────────────────────────────────────────────┤
│  components/                                     │
│  ├── Generator/ (Prompt Builder UI)              │
│  ├── Ads/ (AdSense components)                   │
│  └── UI/ (Shared components)                     │
├─────────────────────────────────────────────────┤
│  data/ (Static JSON configs)                     │
│  posts/ (MDX blog posts)                         │
└─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────┐
│                  AUTOMATION                      │
│            (GitHub Actions + Gemini)             │
├─────────────────────────────────────────────────┤
│  .github/workflows/scheduler.yml                 │
│  scripts/generate-post.js                        │
│  ├── 1. Topic Selection                          │
│  ├── 2. Content Drafting (Gemini)                │
│  ├── 3. Humanizing (Gemini)                      │
│  └── 4. MDX Publishing                           │
└─────────────────────────────────────────────────┘
```

---

## 📁 Dosya Yapısı Patternleri

### Component Pattern
```
components/
├── Generator/
│   ├── index.ts          # Barrel export
│   ├── PromptBuilder.tsx # Ana container
│   ├── ModelSelector.tsx # Model dropdown
│   ├── StyleCards.tsx    # Görsel kartlar
│   ├── ParameterSliders.tsx
│   ├── LivePreview.tsx
│   └── types.ts          # TypeScript types
```

### Page Pattern (App Router)
```typescript
// app/blog/[slug]/page.tsx

// Metadata (Server-side)
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return { title: post.title, description: post.excerpt };
}

// Static generation
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Page component
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  return <Article post={post} />;
}
```

---

## 🔄 State Management Patterns

### Local State (useState)
```typescript
// Prompt builder state
const [selectedModel, setSelectedModel] = useState<Model>('midjourney');
const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
const [parameters, setParameters] = useState<Parameters>(defaultParams);
```

### LocalStorage Persistence
```typescript
// History pattern
const [history, setHistory] = useLocalStorage<Prompt[]>('prompt-history', []);

const saveToHistory = (prompt: string) => {
  setHistory(prev => [
    { id: Date.now(), prompt, timestamp: new Date().toISOString() },
    ...prev.slice(0, 9) // Keep last 10
  ]);
};
```

---

## 🎨 Styling Patterns

### Tailwind Class Organization
```tsx
<button className={cn(
  // Base
  "px-4 py-2 rounded-lg font-medium",
  // Colors
  "bg-violet-600 text-white",
  // States
  "hover:bg-violet-500 active:bg-violet-700",
  // Transitions
  "transition-colors duration-200",
  // Disabled
  "disabled:opacity-50 disabled:cursor-not-allowed"
)}>
```

### Conditional Classes
```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "p-4 rounded-lg",
  isActive && "ring-2 ring-violet-500",
  isDisabled && "opacity-50"
)} />
```

---

## 📡 Data Flow Patterns

### Prompt Generation Flow
```
User Input → State Update → Compute Prompt → Display Preview
     │                                              │
     └──────────────────────────────────────────────┘
                    (Real-time)
```

### Blog Content Flow
```
content-planner.json → Gemini API → Humanize → MDX File → Static Generation
```

---

## 🔧 Utility Patterns

### Prompt Builder Logic
```typescript
// lib/prompt-builder.ts
export function buildPrompt(config: PromptConfig): string {
  const parts: string[] = [config.mainConcept];
  
  if (config.styles.length > 0) {
    parts.push(config.styles.join(', '));
  }
  
  if (config.lighting) {
    parts.push(config.lighting);
  }
  
  // Model-specific parameters
  if (config.model === 'midjourney') {
    if (config.aspectRatio) parts.push(`--ar ${config.aspectRatio}`);
    if (config.stylize) parts.push(`--s ${config.stylize}`);
    if (config.chaos) parts.push(`--chaos ${config.chaos}`);
  }
  
  return parts.join(' ');
}
```

