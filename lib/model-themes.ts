/**
 * Unified model color/theme map
 * Single source of truth consumed by ModelSelector, PromptGallery, and other components
 */

import type { AIModel } from '@/lib/prompt-builder';

export interface ModelTheme {
    gradient: string;
    badgeBg: string;
    badgeText: string;
}

export const modelThemes: Record<string, ModelTheme> = {
    'midjourney-v7': {
        gradient: 'from-violet-300 to-fuchsia-300',
        badgeBg: 'bg-pink-500/20',
        badgeText: 'text-pink-300',
    },
    midjourney: {
        gradient: 'from-violet-400 to-indigo-400',
        badgeBg: 'bg-pink-500/20',
        badgeText: 'text-pink-300',
    },
    flux: {
        gradient: 'from-cyan-300 to-blue-400',
        badgeBg: 'bg-yellow-500/20',
        badgeText: 'text-yellow-300',
    },
    'flux-pro': {
        gradient: 'from-cyan-300 to-emerald-300',
        badgeBg: 'bg-amber-500/20',
        badgeText: 'text-amber-300',
    },
    'dall-e': {
        gradient: 'from-amber-300 to-orange-300',
        badgeBg: 'bg-green-500/20',
        badgeText: 'text-green-300',
    },
    'stable-diffusion': {
        gradient: 'from-emerald-300 to-teal-300',
        badgeBg: 'bg-orange-500/20',
        badgeText: 'text-orange-300',
    },
    'nano-banana': {
        gradient: 'from-yellow-300 to-lime-300',
        badgeBg: 'bg-yellow-400/20',
        badgeText: 'text-yellow-200',
    },
    firefly: {
        gradient: 'from-rose-300 to-orange-300',
        badgeBg: 'bg-red-500/20',
        badgeText: 'text-red-300',
    },
    ideogram: {
        gradient: 'from-pink-300 to-rose-300',
        badgeBg: 'bg-blue-500/20',
        badgeText: 'text-blue-300',
    },
    leonardo: {
        gradient: 'from-blue-300 to-indigo-300',
        badgeBg: 'bg-purple-500/20',
        badgeText: 'text-purple-300',
    },
    recraft: {
        gradient: 'from-emerald-300 to-cyan-300',
        badgeBg: 'bg-cyan-500/20',
        badgeText: 'text-cyan-300',
    },
    gpt4o: {
        gradient: 'from-slate-300 to-slate-100',
        badgeBg: 'bg-emerald-500/20',
        badgeText: 'text-emerald-300',
    },
};

export function getModelTheme(model: string): ModelTheme {
    return modelThemes[model] || {
        gradient: 'from-slate-300 to-slate-400',
        badgeBg: 'bg-slate-700',
        badgeText: 'text-slate-300',
    };
}
