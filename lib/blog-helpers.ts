/**
 * Blog helper utilities — extracted from blog/[slug]/page.tsx
 */

import type { BlogPost } from '@/lib/blog';

export const PROS_CONS_BY_TOPIC: Record<string, { pros: string[]; cons: string[] }> = {
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
    video: {
        pros: [
            'Adds motion storytelling fast',
            'Great for short-form concepts',
            'Pairs well with image workflows',
        ],
        cons: [
            'Render times and credit limits',
            'Motion control is less precise',
            'Artifacts are common in long clips',
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

export function guessProsConsCategory(post: BlogPost) {
    const text = `${post.category || ''} ${post.slug} ${post.title} ${post.tags.join(' ')}`.toLowerCase();

    if (text.includes('midjourney')) return 'midjourney';
    if (
        text.includes('stable diffusion') ||
        text.includes('stable-diffusion') ||
        text.includes('sdxl') ||
        text.includes('controlnet')
    ) {
        return 'stable-diffusion';
    }
    if (text.includes('dall-e') || text.includes('dalle')) return 'dall-e';
    if (text.includes('leonardo')) return 'leonardo';
    if (text.includes('flux')) return 'flux';
    if (text.includes('comparison') || text.includes(' vs ')) return 'comparisons';
    if (text.includes('beginner') || text.includes('first')) return 'beginner-guides';
    if (
        text.includes('style') ||
        text.includes('painting') ||
        text.includes('pixel') ||
        text.includes('watercolor') ||
        text.includes('anime')
    ) {
        return 'art-styles';
    }
    if (text.includes('prompt') || text.includes('prompting')) return 'prompt-techniques';
    if (text.includes('tutorial') || text.includes('guide') || text.includes('how to')) return 'tutorials';
    if (text.includes('video') || text.includes('motion')) return 'video';

    return null;
}

export function getProsCons(post: BlogPost) {
    const pros = Array.isArray(post.pros) ? post.pros.filter((item) => typeof item === 'string') : [];
    const cons = Array.isArray(post.cons) ? post.cons.filter((item) => typeof item === 'string') : [];

    if (pros.length || cons.length) {
        return { pros, cons };
    }

    const categoryKey = guessProsConsCategory(post);
    if (categoryKey && PROS_CONS_BY_TOPIC[categoryKey]) {
        return PROS_CONS_BY_TOPIC[categoryKey];
    }

    return PROS_CONS_BY_TOPIC.default;
}
