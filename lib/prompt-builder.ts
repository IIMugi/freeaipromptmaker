// Prompt Builder Logic - Pure functions, no side effects
// Updated: 2025-11-27 - Added new AI models

export type AIModel = 
  | 'midjourney' 
  | 'midjourney-v7'
  | 'stable-diffusion' 
  | 'dall-e' 
  | 'flux'
  | 'flux-pro'
  | 'ideogram'
  | 'leonardo'
  | 'firefly'
  | 'nano-banana'
  | 'recraft'
  | 'gpt4o';

export interface PromptConfig {
  model: AIModel;
  mainConcept: string;
  styles: string[];
  lighting?: string;
  camera?: string;
  aspectRatio?: string;
  stylize?: number;
  chaos?: number;
  quality?: string;
  negativePrompt?: string;
  seed?: number;
  cfg?: number;
}

export interface PromptHistory {
  id: string;
  prompt: string;
  model: AIModel;
  timestamp: string;
}

// Model information for display
export interface ModelInfo {
  id: AIModel;
  name: string;
  description: string;
  icon: string;
  category: 'popular' | 'professional' | 'specialized';
  features: string[];
  supportsNegative: boolean;
  supportsAspectRatio: boolean;
  supportsStylize: boolean;
  supportsChaos: boolean;
}

export const modelInfoList: ModelInfo[] = [
  // Popular Models
  {
    id: 'flux',
    name: 'Flux',
    description: 'Black Forest Labs - Fast & realistic',
    icon: '⚡',
    category: 'popular',
    features: ['Ultra realistic', 'Fast generation', 'Great anatomy'],
    supportsNegative: true,
    supportsAspectRatio: true,
    supportsStylize: false,
    supportsChaos: false,
  },
  {
    id: 'midjourney-v7',
    name: 'Midjourney v7',
    description: 'Latest version - Best quality',
    icon: '🎨',
    category: 'popular',
    features: ['Best artistic quality', 'Personalization', 'Style tuner'],
    supportsNegative: true,
    supportsAspectRatio: true,
    supportsStylize: true,
    supportsChaos: true,
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana Pro',
    description: 'Google Gemini - Text & editing',
    icon: '🍌',
    category: 'popular',
    features: ['Best text rendering', 'Photo editing', '2K resolution'],
    supportsNegative: false,
    supportsAspectRatio: true,
    supportsStylize: false,
    supportsChaos: false,
  },
  {
    id: 'dall-e',
    name: 'DALL-E 3',
    description: 'OpenAI - Natural language',
    icon: '🤖',
    category: 'popular',
    features: ['Natural language', 'ChatGPT integrated', 'Safe outputs'],
    supportsNegative: false,
    supportsAspectRatio: true,
    supportsStylize: false,
    supportsChaos: false,
  },
  // Professional Models
  {
    id: 'midjourney',
    name: 'Midjourney v6',
    description: 'Stable version - Artistic imagery',
    icon: '🖼️',
    category: 'professional',
    features: ['Proven quality', 'Large community', 'Many tutorials'],
    supportsNegative: true,
    supportsAspectRatio: true,
    supportsStylize: true,
    supportsChaos: true,
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion XL',
    description: 'Open source powerhouse',
    icon: '🔥',
    category: 'professional',
    features: ['Open source', 'Local running', 'Full control'],
    supportsNegative: true,
    supportsAspectRatio: true,
    supportsStylize: false,
    supportsChaos: false,
  },
  {
    id: 'flux-pro',
    name: 'Flux Pro',
    description: 'Professional Flux - Higher quality',
    icon: '💎',
    category: 'professional',
    features: ['Higher quality', 'Better coherence', 'Commercial use'],
    supportsNegative: true,
    supportsAspectRatio: true,
    supportsStylize: false,
    supportsChaos: false,
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly 3',
    description: 'Adobe CC - Professional workflow',
    icon: '🔶',
    category: 'professional',
    features: ['Photoshop integrated', 'Commercial safe', 'Style matching'],
    supportsNegative: false,
    supportsAspectRatio: true,
    supportsStylize: false,
    supportsChaos: false,
  },
  // Specialized Models
  {
    id: 'ideogram',
    name: 'Ideogram 2.0',
    description: 'Best for text & typography',
    icon: '✍️',
    category: 'specialized',
    features: ['Perfect text', 'Logos', 'Posters'],
    supportsNegative: true,
    supportsAspectRatio: true,
    supportsStylize: true,
    supportsChaos: false,
  },
  {
    id: 'leonardo',
    name: 'Leonardo.ai',
    description: 'Gaming & character art',
    icon: '🎮',
    category: 'specialized',
    features: ['Game assets', 'Characters', 'Concept art'],
    supportsNegative: true,
    supportsAspectRatio: true,
    supportsStylize: true,
    supportsChaos: false,
  },
  {
    id: 'recraft',
    name: 'Recraft V3',
    description: 'Vectors & icons specialist',
    icon: '📐',
    category: 'specialized',
    features: ['Vector output', 'Icons', 'Illustrations'],
    supportsNegative: false,
    supportsAspectRatio: true,
    supportsStylize: true,
    supportsChaos: false,
  },
  {
    id: 'gpt4o',
    name: 'GPT-4o',
    description: 'ChatGPT native image gen',
    icon: '💬',
    category: 'specialized',
    features: ['Conversational', 'Iterative editing', 'Context aware'],
    supportsNegative: false,
    supportsAspectRatio: true,
    supportsStylize: false,
    supportsChaos: false,
  },
];

// Model-specific parameter formats
const modelFormats: Record<AIModel, {
  aspectRatioPrefix: string;
  stylizePrefix: string;
  chaosPrefix: string;
  qualityPrefix: string;
  negativePrefix: string;
  promptStyle: 'midjourney' | 'stable-diffusion' | 'natural' | 'flux';
}> = {
  'midjourney': {
    aspectRatioPrefix: '--ar',
    stylizePrefix: '--s',
    chaosPrefix: '--chaos',
    qualityPrefix: '--q',
    negativePrefix: '--no',
    promptStyle: 'midjourney',
  },
  'midjourney-v7': {
    aspectRatioPrefix: '--ar',
    stylizePrefix: '--s',
    chaosPrefix: '--chaos',
    qualityPrefix: '--q',
    negativePrefix: '--no',
    promptStyle: 'midjourney',
  },
  'stable-diffusion': {
    aspectRatioPrefix: '',
    stylizePrefix: '',
    chaosPrefix: '',
    qualityPrefix: '',
    negativePrefix: 'Negative prompt:',
    promptStyle: 'stable-diffusion',
  },
  'dall-e': {
    aspectRatioPrefix: '',
    stylizePrefix: '',
    chaosPrefix: '',
    qualityPrefix: '',
    negativePrefix: '',
    promptStyle: 'natural',
  },
  'flux': {
    aspectRatioPrefix: '--ar',
    stylizePrefix: '',
    chaosPrefix: '',
    qualityPrefix: '',
    negativePrefix: '--no',
    promptStyle: 'flux',
  },
  'flux-pro': {
    aspectRatioPrefix: '--ar',
    stylizePrefix: '',
    chaosPrefix: '',
    qualityPrefix: '--quality',
    negativePrefix: '--no',
    promptStyle: 'flux',
  },
  'ideogram': {
    aspectRatioPrefix: '--ar',
    stylizePrefix: '--stylize',
    chaosPrefix: '',
    qualityPrefix: '',
    negativePrefix: '--no',
    promptStyle: 'midjourney',
  },
  'leonardo': {
    aspectRatioPrefix: '',
    stylizePrefix: '',
    chaosPrefix: '',
    qualityPrefix: '',
    negativePrefix: 'Negative:',
    promptStyle: 'stable-diffusion',
  },
  'firefly': {
    aspectRatioPrefix: '',
    stylizePrefix: '',
    chaosPrefix: '',
    qualityPrefix: '',
    negativePrefix: '',
    promptStyle: 'natural',
  },
  'nano-banana': {
    aspectRatioPrefix: '',
    stylizePrefix: '',
    chaosPrefix: '',
    qualityPrefix: '',
    negativePrefix: '',
    promptStyle: 'natural',
  },
  'recraft': {
    aspectRatioPrefix: '--ar',
    stylizePrefix: '--style',
    chaosPrefix: '',
    qualityPrefix: '',
    negativePrefix: '',
    promptStyle: 'midjourney',
  },
  'gpt4o': {
    aspectRatioPrefix: '',
    stylizePrefix: '',
    chaosPrefix: '',
    qualityPrefix: '',
    negativePrefix: '',
    promptStyle: 'natural',
  },
};

/**
 * Build a complete prompt string based on configuration
 */
export function buildPrompt(config: PromptConfig): string {
  const { model, mainConcept, styles, lighting, camera, aspectRatio, stylize, chaos, negativePrompt } = config;
  
  if (!mainConcept.trim()) {
    return '';
  }

  const format = modelFormats[model];
  const parts: string[] = [mainConcept.trim()];
  
  // Add styles
  if (styles.length > 0) {
    parts.push(styles.join(', '));
  }
  
  // Add lighting
  if (lighting) {
    parts.push(lighting);
  }
  
  // Add camera/lens
  if (camera) {
    parts.push(camera);
  }
  
  // Build based on prompt style
  switch (format.promptStyle) {
    case 'midjourney':
      return buildMidjourneyPrompt(parts, format, aspectRatio, stylize, chaos, negativePrompt);
    
    case 'stable-diffusion':
      return buildStableDiffusionPrompt(parts, format, negativePrompt);
    
    case 'flux':
      return buildFluxPrompt(parts, format, aspectRatio, negativePrompt);
    
    case 'natural':
    default:
      return buildNaturalPrompt(parts);
  }
}

function buildMidjourneyPrompt(
  parts: string[],
  format: typeof modelFormats[AIModel],
  aspectRatio?: string,
  stylize?: number,
  chaos?: number,
  negativePrompt?: string
): string {
  if (aspectRatio && format.aspectRatioPrefix) {
    parts.push(`${format.aspectRatioPrefix} ${aspectRatio}`);
  }
  if (stylize !== undefined && format.stylizePrefix) {
    parts.push(`${format.stylizePrefix} ${stylize}`);
  }
  if (chaos !== undefined && chaos > 0 && format.chaosPrefix) {
    parts.push(`${format.chaosPrefix} ${chaos}`);
  }
  if (negativePrompt && format.negativePrefix) {
    parts.push(`${format.negativePrefix} ${negativePrompt}`);
  }
  
  return parts.join(', ').replace(/,\s*--/g, ' --');
}

function buildStableDiffusionPrompt(
  parts: string[],
  format: typeof modelFormats[AIModel],
  negativePrompt?: string
): string {
  let prompt = parts.join(', ');
  if (negativePrompt && format.negativePrefix) {
    prompt += `\n\n${format.negativePrefix} ${negativePrompt}`;
  }
  return prompt;
}

function buildFluxPrompt(
  parts: string[],
  format: typeof modelFormats[AIModel],
  aspectRatio?: string,
  negativePrompt?: string
): string {
  if (aspectRatio && format.aspectRatioPrefix) {
    parts.push(`${format.aspectRatioPrefix} ${aspectRatio}`);
  }
  if (negativePrompt && format.negativePrefix) {
    parts.push(`${format.negativePrefix} ${negativePrompt}`);
  }
  
  return parts.join(', ').replace(/,\s*--/g, ' --');
}

function buildNaturalPrompt(parts: string[]): string {
  // Natural language models work best with flowing descriptions
  return parts.join(', ');
}

/**
 * Get default parameters for a model
 */
export function getModelDefaults(model: AIModel): Partial<PromptConfig> {
  switch (model) {
    case 'midjourney':
    case 'midjourney-v7':
      return {
        aspectRatio: '16:9',
        stylize: 100,
        chaos: 0,
      };
    case 'flux':
    case 'flux-pro':
      return {
        aspectRatio: '16:9',
      };
    case 'stable-diffusion':
    case 'leonardo':
      return {
        aspectRatio: '1024x1024',
      };
    case 'dall-e':
    case 'gpt4o':
      return {
        aspectRatio: '1024x1024',
        quality: 'standard',
      };
    case 'ideogram':
      return {
        aspectRatio: '1:1',
        stylize: 50,
      };
    case 'firefly':
    case 'nano-banana':
      return {
        aspectRatio: '1:1',
      };
    case 'recraft':
      return {
        aspectRatio: '1:1',
        stylize: 100,
      };
    default:
      return {};
  }
}

/**
 * Get model info by ID
 */
export function getModelInfo(model: AIModel): ModelInfo | undefined {
  return modelInfoList.find(m => m.id === model);
}

/**
 * Validate prompt length for model
 */
export function validatePromptLength(prompt: string, model: AIModel): { valid: boolean; message?: string } {
  const limits: Record<AIModel, number> = {
    'midjourney': 6000,
    'midjourney-v7': 6000,
    'stable-diffusion': 300, // tokens, roughly 300 chars
    'dall-e': 4000,
    'flux': 2000,
    'flux-pro': 2000,
    'ideogram': 1000,
    'leonardo': 1000,
    'firefly': 2000,
    'nano-banana': 3000,
    'recraft': 1000,
    'gpt4o': 4000,
  };
  
  const limit = limits[model];
  
  if (model === 'stable-diffusion' && prompt.length > 300) {
    return { valid: false, message: 'Stable Diffusion works best with shorter prompts (~75 tokens)' };
  }
  
  if (prompt.length > limit) {
    return { valid: false, message: `Prompt exceeds ${limit} character limit for ${model}` };
  }
  
  return { valid: true };
}

/**
 * Get models by category
 */
export function getModelsByCategory(category: ModelInfo['category']): ModelInfo[] {
  return modelInfoList.filter(m => m.category === category);
}
