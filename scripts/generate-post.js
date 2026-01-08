#!/usr/bin/env node

/**
 * PromptMaster AI - Auto-Blogger Bot
 * Gemini 2.5 Pro ile otomatik blog yazısı üretir
 * 10 API Key Rotation sistemi ile günde 500 istek kapasitesi
 * 
 * Kullanım: node scripts/generate-post.js
 * Cron: GitHub Actions ile 2 günde bir çalışır
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { GoogleGenAI } from '@google/genai';

// .env.local dosyasını yükle
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// ============================================
// API KEY ROTATION SİSTEMİ
// ============================================

const API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
  process.env.GEMINI_API_KEY_8,
  process.env.GEMINI_API_KEY_9,
  process.env.GEMINI_API_KEY_10,
].filter(Boolean); // undefined olanları çıkar

// Fallback: Tek key varsa onu kullan
if (API_KEYS.length === 0 && process.env.GEMINI_API_KEY) {
  API_KEYS.push(process.env.GEMINI_API_KEY);
}

let currentKeyIndex = 0;
let exhaustedKeys = new Set();

/**
 * Sıradaki kullanılabilir API key'i al
 */
function getNextApiKey() {
  // Tüm key'ler exhausted ise hata ver
  if (exhaustedKeys.size >= API_KEYS.length) {
    throw new Error('❌ Tüm API key\'ler exhausted! Yarın tekrar deneyin.');
  }

  // Exhausted olmayan ilk key'i bul
  let attempts = 0;
  while (attempts < API_KEYS.length) {
    if (!exhaustedKeys.has(currentKeyIndex)) {
      const key = API_KEYS[currentKeyIndex];
      console.log(`🔑 API Key #${currentKeyIndex + 1} kullanılıyor`);
      return key;
    }
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    attempts++;
  }

  throw new Error('❌ Kullanılabilir API key bulunamadı!');
}

/**
 * Mevcut key'i exhausted olarak işaretle ve sonrakine geç
 */
function markKeyExhausted() {
  console.log(`⚠️ API Key #${currentKeyIndex + 1} exhausted, sonrakine geçiliyor...`);
  exhaustedKeys.add(currentKeyIndex);
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
}

/**
 * Gemini API çağrısı yap (retry, exponential backoff ve key rotation ile)
 */
async function callGeminiWithRetry(prompt, maxRetries = 5) {
  let lastError;

  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      const apiKey = getNextApiKey();
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Hızlı & Free tier, blog için ideal
        contents: prompt,
        config: {
          maxOutputTokens: 8000, // Flash da uzun çıktı destekler
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
        },
      });

      return response.text;

    } catch (error) {
      lastError = error;
      const errorMessage = error.message || String(error);

      // Rate limit, quota, veya 503 (UNAVAILABLE) hatası
      if (
        errorMessage.includes('429') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('exhausted') ||
        errorMessage.includes('RESOURCE_EXHAUSTED') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('503') ||
        errorMessage.includes('UNAVAILABLE') ||
        errorMessage.includes('overloaded')
      ) {
        markKeyExhausted();

        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const waitTime = Math.min(1000 * Math.pow(2, retry), 16000);
        console.log(`🔄 Retry ${retry + 1}/${maxRetries} (${waitTime}ms sonra)...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // Diğer hatalar için direkt throw
      throw error;
    }
  }

  throw lastError;
}

// ============================================
// KONFİGÜRASYON
// ============================================

const CONFIG = {
  postsDir: './posts',
  contentPlannerPath: './data/content-planner.json',
};

// ============================================
// UNSPLASH RESİM SİSTEMİ
// ============================================

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

/**
 * Unsplash'tan konu ile ilgili resim al
 */
async function fetchUnsplashImage(topic) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.log('⚠️ UNSPLASH_ACCESS_KEY bulunamadı, varsayılan resim kullanılacak');
    return null;
  }

  try {
    // AI art ile ilgili arama terimleri
    const searchTerms = [
      'ai art',
      'digital art',
      'artificial intelligence',
      'futuristic technology',
      'creative technology',
      'digital creativity',
      'abstract digital',
      'neon lights art'
    ];

    // Rastgele bir terim seç
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(randomTerm)}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      console.log(`⚠️ Unsplash API hatası: ${response.status}`);
      return null;
    }

    const data = await response.json();

    console.log(`📸 Unsplash resmi alındı: ${data.urls.regular}`);
    console.log(`   📷 Fotoğrafçı: ${data.user.name}`);

    return {
      url: data.urls.regular,
      photographer: data.user.name,
      photographerUrl: data.user.links.html,
      unsplashUrl: data.links.html
    };
  } catch (error) {
    console.error('⚠️ Unsplash hatası:', error.message);
    return null;
  }
}

// ============================================
// AI TOPIC GENERATION SYSTEM
// ============================================

const CONTENT_CATEGORIES = [
  'midjourney',
  'stable-diffusion',
  'dall-e',
  'flux',
  'leonardo',
  'prompt-techniques',
  'art-styles',
  'tutorials',
  'comparisons',
  'beginner-guides'
];

const CATEGORY_PROS_CONS = {
  midjourney: {
    pros: [
      'Strong style control with parameters and seeds',
      'High aesthetic quality with minimal post-work',
      'Great for concept art and stylized visuals',
    ],
    cons: [
      'Requires iterative prompting to match intent',
      'Less precise control than node-based workflows',
      'Subscription required for regular use',
    ],
  },
  'stable-diffusion': {
    pros: [
      'Deep control with models, LoRAs, and ControlNet',
      'Can run locally for privacy and cost control',
      'Huge community resources and models',
    ],
    cons: [
      'Setup and tuning take time',
      'Quality varies by model and settings',
      'Hardware needs for fast iteration',
    ],
  },
  'dall-e': {
    pros: [
      'Excellent natural language prompt understanding',
      'Reliable text rendering in images',
      'Simple workflow in ChatGPT',
    ],
    cons: [
      'Less granular style control',
      'Safety filters can limit edge cases',
      'Best access requires a paid plan',
    ],
  },
  leonardo: {
    pros: [
      'Strong for character and game asset workflows',
      'Friendly UI with model presets',
      'Free tier for quick tests',
    ],
    cons: [
      'Token limits for heavy usage',
      'Advanced tools are paid',
      'Model choice impacts consistency',
    ],
  },
  flux: {
    pros: [
      'Photorealistic output with clean anatomy',
      'Fast generation on supported platforms',
      'Open weights variants for flexibility',
    ],
    cons: [
      'Ecosystem still maturing',
      'Availability depends on provider',
      'Prompt tuning still required',
    ],
  },
  'prompt-techniques': {
    pros: [
      'Improves consistency across models',
      'Helps debug why outputs fail',
      'Scales from beginner to advanced',
    ],
    cons: [
      'More structure can reduce spontaneity',
      'Model-specific syntax still varies',
      'Requires iteration to internalize',
    ],
  },
  'art-styles': {
    pros: [
      'Fast way to explore visual directions',
      'Style keywords transfer across tools',
      'Easy to build a reusable style library',
    ],
    cons: [
      'Some styles can look generic',
      'Model bias can overpower niche aesthetics',
      'Needs references for consistent series',
    ],
  },
  tutorials: {
    pros: [
      'Step-by-step reduces trial and error',
      'Examples are easy to copy and adapt',
      'Builds a repeatable workflow',
    ],
    cons: [
      'Steps may change with model updates',
      'Time investment to practice',
      'Some tools or features are paywalled',
    ],
  },
  comparisons: {
    pros: [
      'Clarifies tradeoffs between models',
      'Helps match tool to use case',
      'Saves testing time',
    ],
    cons: [
      'Rapid updates can age quickly',
      'Quality differences can be subjective',
      'Pricing and limits shift often',
    ],
  },
  'beginner-guides': {
    pros: [
      'Low-friction entry points',
      'Covers core concepts quickly',
      'Reduces early mistakes',
    ],
    cons: [
      'Simplifies advanced nuance',
      'Still requires hands-on practice',
      'Model differences still matter',
    ],
  },
  default: {
    pros: [
      'Actionable steps you can apply immediately',
      'Examples reduce trial and error',
      'Works across major image models',
    ],
    cons: [
      'Results vary by model and version',
      'Requires iteration for best quality',
      'Some steps depend on paid tiers',
    ],
  },
};

function inferCategoryFromKeywords(keywords = []) {
  const text = keywords.join(' ').toLowerCase();

  if (text.includes('midjourney')) return 'midjourney';
  if (text.includes('stable diffusion') || text.includes('stable-diffusion') || text.includes('sdxl') || text.includes('controlnet')) {
    return 'stable-diffusion';
  }
  if (text.includes('dall-e') || text.includes('dalle')) return 'dall-e';
  if (text.includes('leonardo')) return 'leonardo';
  if (text.includes('flux')) return 'flux';
  if (text.includes('comparison') || text.includes(' vs ')) return 'comparisons';
  if (text.includes('beginner') || text.includes('first')) return 'beginner-guides';
  if (text.includes('style') || text.includes('painting') || text.includes('pixel') || text.includes('watercolor') || text.includes('anime')) {
    return 'art-styles';
  }
  if (text.includes('prompt') || text.includes('prompting')) return 'prompt-techniques';
  if (text.includes('tutorial') || text.includes('guide') || text.includes('how to')) return 'tutorials';

  return null;
}

function getProsConsForCategory(category, keywords = []) {
  const normalized = (category || '').toLowerCase();
  if (normalized && CATEGORY_PROS_CONS[normalized]) {
    return CATEGORY_PROS_CONS[normalized];
  }

  const inferred = inferCategoryFromKeywords(keywords);
  if (inferred && CATEGORY_PROS_CONS[inferred]) {
    return CATEGORY_PROS_CONS[inferred];
  }

  return CATEGORY_PROS_CONS.default;
}

/**
 * Get all published topics and keywords to avoid duplicates
 */
async function getPublishedTopicsData() {
  try {
    const plannerData = await fs.readFile(CONFIG.contentPlannerPath, 'utf-8');
    const planner = JSON.parse(plannerData);

    const publishedTopics = planner.topics
      .filter(t => t.status === 'published')
      .map(t => ({
        title: t.title,
        keywords: t.keywords || [],
        slug: t.slug
      }));

    const allKeywords = publishedTopics.flatMap(t => t.keywords);
    const allTitles = publishedTopics.map(t => t.title);

    return { publishedTopics, allKeywords, allTitles, planner };
  } catch (error) {
    console.error('⚠️ Error reading published topics:', error.message);
    return { publishedTopics: [], allKeywords: [], allTitles: [], planner: { topics: [] } };
  }
}

/**
 * Generate a new SEO-optimized topic using Gemini
 */
async function generateNewTopic(publishedData) {
  console.log('🧠 AI ile yeni konu üretiliyor...');

  const { allTitles, allKeywords } = publishedData;

  // Rotate through categories
  const categoryIndex = allTitles.length % CONTENT_CATEGORIES.length;
  const suggestedCategory = CONTENT_CATEGORIES[categoryIndex];

  const prompt = `
You are an SEO expert specializing in AI art content. Your task is to generate ONE new blog topic.

PUBLISHED CONTENT (DO NOT REPEAT):
${allTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

USED KEYWORDS (AVOID HEAVY OVERLAP):
${[...new Set(allKeywords)].slice(0, 30).join(', ')}

SUGGESTED CATEGORY FOR THIS POST: ${suggestedCategory}

Generate a NEW blog topic that:
1. Targets high-volume AI art search keywords
2. Does NOT overlap with published content above
3. Has clear search intent (how-to, guide, tips, collection)
4. Is actionable and valuable for AI artists

TOPIC IDEAS BY CATEGORY:
- midjourney: New features, specific techniques, style references
- stable-diffusion: ControlNet, LoRA, model comparisons
- dall-e: ChatGPT integration, prompting secrets
- flux: Speed optimization, quality settings
- leonardo: Character consistency, motion features
- prompt-techniques: Weighting, negative prompts, structure
- art-styles: Specific aesthetics (anime, oil painting, etc.)
- tutorials: Step-by-step guides
- comparisons: Model vs model, feature comparisons
- beginner-guides: Getting started, basics explained

Respond in this EXACT JSON format (no markdown, no code blocks):
{
  "id": "unique-slug-id",
  "title": "Compelling SEO-Optimized Title (50-60 chars)",
  "slug": "url-friendly-slug",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "outline": [
    "Introduction section",
    "Main topic 1",
    "Main topic 2", 
    "Main topic 3",
    "Practical examples",
    "Pro tips",
    "Conclusion with CTA"
  ],
  "category": "${suggestedCategory}"
}
`;

  const response = await callGeminiWithRetry(prompt);

  // Parse JSON from response
  try {
    // Clean up response - remove markdown code blocks if present
    let cleanResponse = response
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    const topic = JSON.parse(cleanResponse);

    // Validate required fields
    if (!topic.id || !topic.title || !topic.slug || !topic.keywords || !topic.outline) {
      throw new Error('Missing required fields in generated topic');
    }

    topic.status = 'pending';
    topic.autoGenerated = true;
    topic.generatedAt = new Date().toISOString();

    console.log(`✅ Yeni konu üretildi: ${topic.title}`);
    return topic;

  } catch (parseError) {
    console.error('❌ Topic JSON parse hatası:', parseError.message);
    console.error('Response was:', response.substring(0, 500));
    throw new Error('Failed to parse generated topic');
  }
}

/**
 * Add new topic to content-planner.json
 */
async function addTopicToPlanner(topic, planner) {
  planner.topics.push(topic);
  planner.lastUpdated = new Date().toISOString().split('T')[0];

  // Track auto-generation stats
  if (!planner.autoGeneration) {
    planner.autoGeneration = {
      enabled: true,
      totalAutoGenerated: 0
    };
  }
  planner.autoGeneration.totalAutoGenerated++;
  planner.autoGeneration.lastGeneratedAt = new Date().toISOString();

  await fs.writeFile(CONFIG.contentPlannerPath, JSON.stringify(planner, null, 2));
  console.log('📝 Konu content-planner.json\'a eklendi');
}

// ============================================
// ANA FONKSİYONLAR
// ============================================

/**
 * Content planner'dan yazılmamış konu seç veya yeni konu üret
 */
async function selectTopic() {
  const publishedData = await getPublishedTopicsData();
  const { planner } = publishedData;

  // First check for pending topics
  const pendingTopic = planner.topics.find(t => t.status === 'pending');

  if (pendingTopic) {
    console.log('📋 Mevcut pending konu bulundu');
    return pendingTopic;
  }

  // No pending topics - generate new one with AI
  console.log('🔄 Pending konu yok, AI ile yeni konu üretiliyor...');

  try {
    const newTopic = await generateNewTopic(publishedData);

    // Add to planner
    await addTopicToPlanner(newTopic, planner);

    return newTopic;
  } catch (error) {
    console.error('❌ Yeni konu üretme hatası:', error.message);
    console.log('✅ Tüm konular yazıldı ve yeni konu üretilemedi!');
    return null;
  }
}

/**
 * Konuyu "published" olarak işaretle
 */
async function markTopicAsPublished(topicId) {
  const plannerData = await fs.readFile(CONFIG.contentPlannerPath, 'utf-8');
  const planner = JSON.parse(plannerData);

  const topic = planner.topics.find(t => t.id === topicId);
  if (topic) {
    topic.status = 'published';
    topic.publishedAt = new Date().toISOString();
  }

  await fs.writeFile(CONFIG.contentPlannerPath, JSON.stringify(planner, null, 2));
}

/**
 * SEO uyumlu blog taslağı oluştur (Gemini 2.5 Pro)
 */
async function generateDraft(topic) {
  console.log(`📝 Taslak yazılıyor: ${topic.title}`);

  const prompt = `
You are an expert AI art blogger writing for PromptMaster AI - a visual prompt generator for Midjourney, DALL-E, and Stable Diffusion.

Write a comprehensive, SEO-optimized blog post about: "${topic.title}"

Target keywords: ${topic.keywords.join(', ')}

Structure the post with:
1. An engaging introduction (2-3 paragraphs) that hooks the reader
2. Main content sections based on this outline:
${topic.outline.map((item, i) => `   ${i + 1}. ${item}`).join('\n')}
3. Practical examples with actual prompts users can copy (use code blocks)
4. Pro tips and best practices
5. A conclusion with a call-to-action to try our Prompt Generator

Requirements:
- Write in a friendly, expert tone - like you're helping a friend
- Include 5-10 actual prompt examples in code blocks that users can copy
- Use markdown formatting (##, ###, **, \`code\`, etc.)
- Target length: 2000-2500 words
- Make it genuinely helpful and actionable
- Include internal link: [Try our Visual Prompt Generator](/)
- Add relevant emoji sparingly for visual interest

CRITICAL - DO NOT:
- Use phrases like "In conclusion", "Let's dive in", "Unleash", "Delve into", "In this article"
- Sound robotic or AI-generated
- Use excessive exclamation marks
- Be overly promotional
- Start paragraphs with "So," or "Now,"
- Use the word "journey" metaphorically

Write the blog post now in markdown format:
`;

  return await callGeminiWithRetry(prompt);
}

/**
 * Taslağı daha doğal, insan tonunda yeniden yaz (Gemini 2.5 Pro)
 */
async function humanizeContent(draft, topic) {
  console.log('🧑 İçerik humanize ediliyor...');

  const prompt = `
You are a professional editor and experienced blogger. Your task is to make this blog post sound more natural and human-written.

Original post:
${draft}

Rewrite guidelines:
1. Add personal touches - phrases like "I've found that...", "In my experience...", "What works for me..."
2. Vary sentence structure - mix short punchy sentences with longer ones
3. Include conversational asides in parentheses where appropriate
4. Remove any remaining AI-ish phrases
5. Add subtle humor or personality where it fits naturally
6. Keep ALL technical accuracy and prompt examples exactly as they are
7. Maintain the same structure, headings, and sections
8. Keep all markdown formatting intact
9. Ensure the internal link to the Prompt Generator remains

The goal: Make this indistinguishable from a post written by an experienced human blogger who genuinely enjoys AI art.

CRITICAL: Do NOT include meta-commentary like "Here is the rewritten post..." or "Of course! Here is...". Start directly with the blog content.

Return ONLY the rewritten post in markdown format (no preamble):
`;

  const response = await callGeminiWithRetry(prompt);

  // Clean up any meta-commentary that might have slipped through
  return response
    .replace(/^(Here is the rewritten blog post.*?\n\n)/i, '')
    .replace(/^(Of course!.*?Here is.*?\n\n)/i, '')
    .replace(/^(_\*\*# )/m, '# ')  // Remove leading _** if present
    .trim();
}

/**
 * MDX dosyası oluştur
 */
async function createMDXFile(content, topic, imageData) {
  const today = new Date().toISOString().split('T')[0];
  const filename = `${today}-${topic.slug}.mdx`;
  const filepath = path.join(CONFIG.postsDir, filename);

  // Image frontmatter kısmı
  const imageFrontmatter = imageData ? `
image: "${imageData.url}"
imageCredit: "${imageData.photographer}"
imageCreditUrl: "${imageData.photographerUrl}"` : '';

  const { pros, cons } = getProsConsForCategory(topic.category, topic.keywords);
  const categoryFrontmatter = topic.category ? `\ncategory: "${topic.category}"` : '';
  const prosFrontmatter = pros.length
    ? `\npros:\n${pros.map((item) => `  - "${item}"`).join('\n')}`
    : '';
  const consFrontmatter = cons.length
    ? `\ncons:\n${cons.map((item) => `  - "${item}"`).join('\n')}`
    : '';

  // Frontmatter ekle
  const frontmatter = `---
title: "${topic.title}"
date: "${today}"
description: "${topic.keywords.slice(0, 3).join(', ')} - A comprehensive guide for AI artists"
tags: [${topic.keywords.map(k => `"${k}"`).join(', ')}]
author: "Free AI Prompt Maker"
readTime: "${Math.ceil(content.split(' ').length / 200)} min read"${categoryFrontmatter}${prosFrontmatter}${consFrontmatter}${imageFrontmatter}
---

`;

  const fullContent = frontmatter + content;

  // posts klasörü yoksa oluştur
  await fs.mkdir(CONFIG.postsDir, { recursive: true });

  // Dosyayı yaz
  await fs.writeFile(filepath, fullContent);

  console.log(`✅ Dosya oluşturuldu: ${filepath}`);
  return filepath;
}

/**
 * Ana fonksiyon
 */
async function main() {
  console.log('🚀 PromptMaster AI Auto-Blogger başlatılıyor...');
  console.log(`📊 ${API_KEYS.length} API key yüklendi\n`);

  // API key kontrolü
  if (API_KEYS.length === 0) {
    console.error('❌ Hiç API key bulunamadı! .env.local dosyasını kontrol edin.');
    process.exit(1);
  }

  try {
    // 1. Konu seç
    const topic = await selectTopic();
    if (!topic) {
      process.exit(0);
    }

    console.log(`📌 Seçilen konu: ${topic.title}\n`);

    // 2. Unsplash'tan resim al
    const imageData = await fetchUnsplashImage(topic);
    if (imageData) {
      console.log('✅ Featured image alındı\n');
    }

    // 3. Taslak oluştur (Gemini 2.5 Pro)
    const draft = await generateDraft(topic);
    console.log('✅ Taslak oluşturuldu\n');

    // 4. Humanize et (Gemini 2.5 Pro)
    const humanizedContent = await humanizeContent(draft, topic);
    console.log('✅ İçerik humanize edildi\n');

    // 5. MDX dosyası oluştur (resim ile)
    const filepath = await createMDXFile(humanizedContent, topic, imageData);

    // 6. Konuyu published olarak işaretle
    await markTopicAsPublished(topic.id);

    console.log('\n🎉 Blog yazısı başarıyla oluşturuldu!');
    console.log(`📄 Dosya: ${filepath}`);
    console.log(`🔑 Kullanılan key sayısı: ${exhaustedKeys.size + 1}`);

  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

// Çalıştır
main();
