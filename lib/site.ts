export const SITE = {
  name: 'Free AI Prompt Maker',
  origin: process.env.NEXT_PUBLIC_SITE_URL || 'https://freeaipromptmaker.com',
  description: 'Build and copy structured prompts for supported image-generation tools.',
  social: {
    github: 'https://github.com/IIMugi/freeaipromptmaker',
  },
} as const;

export const READINESS = {
  adsEnabled: false,
  imageAnalysisConfigured: Boolean(process.env.GEMINI_API_KEY),
} as const;
