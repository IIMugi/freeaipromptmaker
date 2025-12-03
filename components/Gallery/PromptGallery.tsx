'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Copy, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/lib/hooks';
import featuredPromptsData from '@/data/featured-prompts.json';

interface FeaturedPrompt {
  id: string;
  title: string;
  prompt: string;
  model: string;
  category: string;
  imageUrl: string;
  author: string;
  likes: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const modelColors: Record<string, string> = {
  'midjourney-v7': 'bg-pink-500/20 text-pink-300',
  'midjourney': 'bg-pink-500/20 text-pink-300',
  'flux': 'bg-yellow-500/20 text-yellow-300',
  'flux-pro': 'bg-amber-500/20 text-amber-300',
  'dall-e': 'bg-green-500/20 text-green-300',
  'stable-diffusion': 'bg-orange-500/20 text-orange-300',
  'nano-banana': 'bg-yellow-400/20 text-yellow-200',
  'leonardo': 'bg-purple-500/20 text-purple-300',
  'ideogram': 'bg-blue-500/20 text-blue-300',
  'firefly': 'bg-red-500/20 text-red-300',
  'recraft': 'bg-cyan-500/20 text-cyan-300',
  'gpt4o': 'bg-emerald-500/20 text-emerald-300',
};

const categoryGradients: Record<string, string> = {
  'fantasy': 'from-purple-600/40 to-pink-600/40',
  'sci-fi': 'from-cyan-600/40 to-blue-600/40',
  'character': 'from-amber-600/40 to-red-600/40',
  'nature': 'from-green-600/40 to-emerald-600/40',
  'lifestyle': 'from-orange-600/40 to-yellow-600/40',
};

const categoryEmojis: Record<string, string> = {
  'fantasy': '🧙✨🐉',
  'sci-fi': '🚀🌌🤖',
  'character': '👤⚔️🎭',
  'nature': '🌿🌸🌊',
  'lifestyle': '☕🏠🎨',
};

export function PromptGallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedPrompts, setLikedPrompts] = useLocalStorage<string[]>('liked-prompts', []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const prompts = featuredPromptsData.prompts as FeaturedPrompt[];
  const categories = featuredPromptsData.categories as Category[];
  
  const filteredPrompts = selectedCategory === 'all' 
    ? prompts 
    : prompts.filter(p => p.category === selectedCategory);
  
  // Sort by likes + user liked status
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    const aLiked = likedPrompts.includes(a.id) ? 1 : 0;
    const bLiked = likedPrompts.includes(b.id) ? 1 : 0;
    return (b.likes + bLiked * 100) - (a.likes + aLiked * 100);
  });

  const handleLike = (id: string) => {
    setLikedPrompts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleCopy = async (prompt: string, id: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-violet-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Top Community Prompts
          </h2>
        </div>
        <p className="text-slate-300">
          Get inspired by prompts created by our community
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8" role="group" aria-label="Filter prompts by category">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            aria-pressed={selectedCategory === cat.id}
            aria-label={`Filter by ${cat.name} category`}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategory === cat.id
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            )}
          >
            <span className="mr-1.5" aria-hidden="true">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Prompts Grid */}
      <div 
        key={selectedCategory} 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedPrompts.map((prompt, index) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            index={index}
            isLiked={likedPrompts.includes(prompt.id)}
            isCopied={copiedId === prompt.id}
            onLike={() => handleLike(prompt.id)}
            onCopy={() => handleCopy(prompt.prompt, prompt.id)}
          />
        ))}
      </div>
    </section>
  );
}

interface PromptCardProps {
  prompt: FeaturedPrompt;
  index: number;
  isLiked: boolean;
  isCopied: boolean;
  onLike: () => void;
  onCopy: () => void;
}

function PromptCard({ prompt, index, isLiked, isCopied, onLike, onCopy }: PromptCardProps) {
  const gradient = categoryGradients[prompt.category] || 'from-slate-600/40 to-slate-700/40';
  const emojis = categoryEmojis[prompt.category] || '✨';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-violet-500/50 transition-all duration-300"
    >
      {/* Image Placeholder with Gradient */}
      <div className={cn(
        'h-40 bg-gradient-to-br flex items-center justify-center text-4xl',
        gradient
      )}>
        <span className="opacity-50">{emojis}</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Model */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-lg leading-tight">
            {prompt.title}
          </h3>
          <span className={cn(
            'text-xs px-2 py-1 rounded-full flex-shrink-0',
            modelColors[prompt.model] || 'bg-slate-700 text-slate-300'
          )}>
            {prompt.model.replace('-', ' ')}
          </span>
        </div>

        {/* Prompt Preview */}
        <p className="text-sm text-slate-300 line-clamp-3">
          {prompt.prompt}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          {/* Like Button */}
          <button
            onClick={onLike}
            aria-label={isLiked ? `Unlike ${prompt.title}` : `Like ${prompt.title}`}
            aria-pressed={isLiked}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200',
              isLiked
                ? 'bg-red-500/20 text-red-400'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            )}
          >
            <Heart 
              className={cn('w-4 h-4', isLiked && 'fill-current')} 
              aria-hidden="true"
            />
            <span className="text-sm font-medium">
              {prompt.likes + (isLiked ? 1 : 0)}
            </span>
          </button>

          {/* Copy Button */}
          <button
            onClick={onCopy}
            aria-label={isCopied ? 'Prompt copied!' : `Copy ${prompt.title} prompt`}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200',
              isCopied
                ? 'bg-green-500/20 text-green-400'
                : 'bg-violet-600/20 text-violet-300 hover:bg-violet-600/30'
            )}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

