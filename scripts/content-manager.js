#!/usr/bin/env node

/**
 * Free AI Prompt Maker - Akıllı İçerik Yöneticisi
 * 
 * Özellikler:
 * - Yazılan tüm konuları takip eder
 * - Aynı konuyu tekrar yazmaz
 * - Yeni konu önerileri üretir (Gemini ile)
 * - Günde 1 post atar
 * - İçerik çeşitliliği sağlar
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
// API KEY ROTATION
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
].filter(Boolean);

let currentKeyIndex = 0;
let exhaustedKeys = new Set();

function getNextApiKey() {
  if (exhaustedKeys.size >= API_KEYS.length) {
    throw new Error('❌ Tüm API key\'ler exhausted!');
  }
  
  let attempts = 0;
  while (attempts < API_KEYS.length) {
    if (!exhaustedKeys.has(currentKeyIndex)) {
      return API_KEYS[currentKeyIndex];
    }
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    attempts++;
  }
  
  throw new Error('❌ Kullanılabilir API key bulunamadı!');
}

function markKeyExhausted() {
  exhaustedKeys.add(currentKeyIndex);
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
}

async function callGemini(prompt, maxRetries = 3) {
  let lastError;
  
  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      const apiKey = getNextApiKey();
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          maxOutputTokens: 8000,
          temperature: 0.8,
        },
      });
      
      return response.text;
    } catch (error) {
      lastError = error;
      const errorMessage = error.message || String(error);
      
      if (errorMessage.includes('429') || errorMessage.includes('quota') || 
          errorMessage.includes('exhausted') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        markKeyExhausted();
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

// ============================================
// İÇERİK YÖNETİM SİSTEMİ
// ============================================

const CONTENT_HISTORY_PATH = './data/content-history.json';
const CONTENT_PLANNER_PATH = './data/content-planner.json';
const POSTS_DIR = './posts';

// İçerik kategorileri - çeşitlilik için
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

/**
 * İçerik geçmişini yükle veya oluştur
 */
async function loadContentHistory() {
  try {
    const data = await fs.readFile(CONTENT_HISTORY_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Dosya yoksa yeni oluştur
    const initialHistory = {
      publishedTopics: [],
      publishedTitles: [],
      publishedKeywords: [],
      lastCategory: null,
      totalPosts: 0,
      lastPublishDate: null,
      categoryRotation: 0
    };
    await fs.writeFile(CONTENT_HISTORY_PATH, JSON.stringify(initialHistory, null, 2));
    return initialHistory;
  }
}

/**
 * İçerik geçmişini kaydet
 */
async function saveContentHistory(history) {
  await fs.writeFile(CONTENT_HISTORY_PATH, JSON.stringify(history, null, 2));
}

/**
 * Bugün zaten post atıldı mı kontrol et
 */
function alreadyPostedToday(history) {
  if (!history.lastPublishDate) return false;
  
  const today = new Date().toISOString().split('T')[0];
  const lastDate = history.lastPublishDate.split('T')[0];
  
  return today === lastDate;
}

/**
 * Sıradaki kategoriyi seç (rotasyon ile çeşitlilik)
 */
function getNextCategory(history) {
  const index = history.categoryRotation % CONTENT_CATEGORIES.length;
  return CONTENT_CATEGORIES[index];
}

/**
 * Gemini ile yeni konu önerisi al
 */
async function generateNewTopic(history, category) {
  console.log(`🧠 Yeni konu üretiliyor (Kategori: ${category})...`);
  
  const publishedTitles = history.publishedTitles.slice(-50).join('\n- ');
  const publishedKeywords = [...new Set(history.publishedKeywords)].slice(-100).join(', ');
  
  const prompt = `
You are an SEO expert for a free AI art prompt generator website called Free AI Prompt Maker (freeaipromptmaker.com).

Generate ONE new blog post topic for the category: "${category}"

IMPORTANT - These topics have ALREADY been written, DO NOT suggest anything similar:
${publishedTitles ? `- ${publishedTitles}` : '(No posts yet)'}

Already used keywords (avoid repetition): ${publishedKeywords || '(none yet)'}

Requirements for the new topic:
1. Must be unique and NOT similar to any already published topic
2. Should target high-volume SEO keywords for AI art
3. Must be actionable and provide real value
4. Should include specific examples users can try
5. Category focus: ${category}

Respond in this exact JSON format (no markdown, just JSON):
{
  "title": "Your SEO-Optimized Title Here",
  "slug": "url-friendly-slug-here",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "outline": [
    "Section 1 title",
    "Section 2 title",
    "Section 3 title",
    "Section 4 title",
    "Section 5 title"
  ],
  "category": "${category}",
  "difficulty": "beginner|intermediate|advanced",
  "estimatedReadTime": "X min"
}
`;

  const response = await callGemini(prompt);
  
  // JSON parse et
  try {
    // Markdown code block varsa temizle
    let jsonStr = response.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }
    
    const topic = JSON.parse(jsonStr);
    topic.id = `auto-${Date.now()}`;
    topic.status = 'pending';
    topic.generatedAt = new Date().toISOString();
    
    return topic;
  } catch (error) {
    console.error('❌ JSON parse hatası:', error.message);
    console.log('Raw response:', response);
    throw new Error('Konu JSON olarak parse edilemedi');
  }
}

/**
 * Blog yazısı oluştur
 */
async function generateBlogPost(topic, history) {
  console.log(`📝 Blog yazısı yazılıyor: ${topic.title}`);
  
  // Önceki yazılardan örnekler (benzerlikten kaçınmak için)
  const recentTitles = history.publishedTitles.slice(-10).join(', ');
  
  const draftPrompt = `
You are an expert AI art blogger for Free AI Prompt Maker (freeaipromptmaker.com).

Write a comprehensive blog post about: "${topic.title}"

Target keywords: ${topic.keywords.join(', ')}
Difficulty level: ${topic.difficulty || 'intermediate'}

CRITICAL: These are recent posts - your writing style and examples MUST be different:
${recentTitles}

Structure based on this outline:
${topic.outline.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Requirements:
- 2000-2500 words
- Include 8-12 copyable prompt examples in code blocks
- Be practical and actionable
- Natural, conversational tone
- Include [Try our Free AI Prompt Maker](/) link
- Use relevant emoji sparingly

DO NOT:
- Use "In conclusion", "Let's dive in", "Unleash", "Delve into"
- Start with "Welcome to" or "In this article"
- Sound robotic
- Repeat examples from previous posts

Write in markdown:
`;

  const draft = await callGemini(draftPrompt);
  console.log('✅ Taslak oluşturuldu');
  
  // Humanize
  console.log('🧑 Humanize ediliyor...');
  const humanizePrompt = `
Rewrite this blog post to sound more natural and human:

${draft}

Guidelines:
- Add personal touches ("I've found...", "In my experience...")
- Vary sentence structure
- Keep ALL technical content and examples exactly as is
- Keep markdown formatting
- Maintain the internal link to Prompt Generator

Return the rewritten post:
`;

  const humanized = await callGemini(humanizePrompt);
  console.log('✅ Humanize edildi');
  
  return humanized;
}

/**
 * MDX dosyası oluştur
 */
async function saveBlogPost(content, topic) {
  const today = new Date().toISOString().split('T')[0];
  const filename = `${today}-${topic.slug}.mdx`;
  const filepath = path.join(POSTS_DIR, filename);
  
  const frontmatter = `---
title: "${topic.title}"
date: "${today}"
description: "${topic.keywords.slice(0, 3).join(', ')} - A comprehensive guide"
tags: [${topic.keywords.map(k => `"${k}"`).join(', ')}]
author: "Free AI Prompt Maker"
category: "${topic.category}"
difficulty: "${topic.difficulty || 'intermediate'}"
readTime: "${topic.estimatedReadTime || '10 min'}"
---

`;

  await fs.mkdir(POSTS_DIR, { recursive: true });
  await fs.writeFile(filepath, frontmatter + content);
  
  console.log(`✅ Dosya kaydedildi: ${filepath}`);
  return filepath;
}

/**
 * Ana fonksiyon
 */
async function main() {
  console.log('🚀 Free AI Prompt Maker - Akıllı İçerik Yöneticisi');
  console.log(`📊 ${API_KEYS.length} API key yüklendi\n`);
  
  if (API_KEYS.length === 0) {
    console.error('❌ API key bulunamadı!');
    process.exit(1);
  }
  
  try {
    // 1. Geçmişi yükle
    const history = await loadContentHistory();
    console.log(`📚 Toplam yayınlanmış: ${history.totalPosts} post`);
    
    // 2. Bugün zaten post atıldı mı?
    if (alreadyPostedToday(history)) {
      console.log('✅ Bugün zaten bir post yayınlandı. Yarın tekrar deneyin.');
      process.exit(0);
    }
    
    // 3. Sıradaki kategori
    const category = getNextCategory(history);
    console.log(`📂 Kategori: ${category}`);
    
    // 4. Yeni konu üret
    const topic = await generateNewTopic(history, category);
    console.log(`📌 Yeni konu: ${topic.title}\n`);
    
    // 5. Blog yazısı oluştur
    const content = await generateBlogPost(topic, history);
    
    // 6. Kaydet
    const filepath = await saveBlogPost(content, topic);
    
    // 7. Geçmişi güncelle
    history.publishedTopics.push(topic.id);
    history.publishedTitles.push(topic.title);
    history.publishedKeywords.push(...topic.keywords);
    history.lastCategory = category;
    history.totalPosts += 1;
    history.lastPublishDate = new Date().toISOString();
    history.categoryRotation += 1;
    
    await saveContentHistory(history);
    
    console.log('\n🎉 Başarılı!');
    console.log(`📄 Dosya: ${filepath}`);
    console.log(`📊 Toplam post: ${history.totalPosts}`);
    console.log(`📂 Sonraki kategori: ${CONTENT_CATEGORIES[(history.categoryRotation) % CONTENT_CATEGORIES.length]}`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

main();

