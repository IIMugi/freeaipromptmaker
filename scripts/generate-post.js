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
 * Gemini API çağrısı yap (retry ve key rotation ile)
 */
async function callGeminiWithRetry(prompt, maxRetries = 3) {
  let lastError;
  
  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      const apiKey = getNextApiKey();
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // En güçlü model
        contents: prompt,
        config: {
          maxOutputTokens: 8000, // 2.5 Pro daha uzun çıktı destekler
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
        },
      });
      
      return response.text;
      
    } catch (error) {
      lastError = error;
      const errorMessage = error.message || String(error);
      
      // Rate limit veya quota hatası
      if (
        errorMessage.includes('429') || 
        errorMessage.includes('quota') || 
        errorMessage.includes('exhausted') ||
        errorMessage.includes('RESOURCE_EXHAUSTED') ||
        errorMessage.includes('rate limit')
      ) {
        markKeyExhausted();
        console.log(`🔄 Retry ${retry + 1}/${maxRetries}...`);
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
// ANA FONKSİYONLAR
// ============================================

/**
 * Content planner'dan yazılmamış konu seç
 */
async function selectTopic() {
  const plannerData = await fs.readFile(CONFIG.contentPlannerPath, 'utf-8');
  const planner = JSON.parse(plannerData);
  
  const pendingTopic = planner.topics.find(t => t.status === 'pending');
  
  if (!pendingTopic) {
    console.log('✅ Tüm konular yazıldı!');
    return null;
  }
  
  return pendingTopic;
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

Return the rewritten post in markdown format:
`;

  return await callGeminiWithRetry(prompt);
}

/**
 * MDX dosyası oluştur
 */
async function createMDXFile(content, topic) {
  const today = new Date().toISOString().split('T')[0];
  const filename = `${today}-${topic.slug}.mdx`;
  const filepath = path.join(CONFIG.postsDir, filename);
  
  // Frontmatter ekle
  const frontmatter = `---
title: "${topic.title}"
date: "${today}"
description: "${topic.keywords.slice(0, 3).join(', ')} - A comprehensive guide for AI artists"
tags: [${topic.keywords.map(k => `"${k}"`).join(', ')}]
author: "PromptMaster AI Team"
readTime: "${Math.ceil(content.split(' ').length / 200)} min read"
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
    
    // 2. Taslak oluştur (Gemini 2.5 Pro)
    const draft = await generateDraft(topic);
    console.log('✅ Taslak oluşturuldu\n');
    
    // 3. Humanize et (Gemini 2.5 Pro)
    const humanizedContent = await humanizeContent(draft, topic);
    console.log('✅ İçerik humanize edildi\n');
    
    // 4. MDX dosyası oluştur
    const filepath = await createMDXFile(humanizedContent, topic);
    
    // 5. Konuyu published olarak işaretle
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
