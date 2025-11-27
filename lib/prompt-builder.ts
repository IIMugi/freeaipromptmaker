// Prompt Builder Logic - Pure functions, no side effects

export type AIModel = 'midjourney' | 'stable-diffusion' | 'dall-e';

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
}

export interface PromptHistory {
  id: string;
  prompt: string;
  model: AIModel;
  timestamp: string;
}

// Model-specific parameter formats
const modelFormats: Record<AIModel, {
  aspectRatioPrefix: string;
  stylizePrefix: string;
  chaosPrefix: string;
  qualityPrefix: string;
  negativePrefix: string;
}> = {
  'midjourney': {
    aspectRatioPrefix: '--ar',
    stylizePrefix: '--s',
    chaosPrefix: '--chaos',
    qualityPrefix: '--q',
    negativePrefix: '--no',
  },
  'stable-diffusion': {
    aspectRatioPrefix: '', // SDXL uses resolution instead
    stylizePrefix: '', // Uses CFG scale
    chaosPrefix: '', // Uses seed variation
    qualityPrefix: '',
    negativePrefix: 'Negative prompt:',
  },
  'dall-e': {
    aspectRatioPrefix: '', // DALL-E uses size parameter
    stylizePrefix: '',
    chaosPrefix: '',
    qualityPrefix: '',
    negativePrefix: '', // DALL-E doesn't support negative prompts
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
  
  // Model-specific parameters
  const format = modelFormats[model];
  
  if (model === 'midjourney') {
    // Midjourney-specific parameters
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
  } else if (model === 'stable-diffusion') {
    // Stable Diffusion format - negative prompt on separate line
    let prompt = parts.join(', ');
    if (negativePrompt) {
      prompt += `\n\n${format.negativePrefix} ${negativePrompt}`;
    }
    return prompt;
  }
  // DALL-E doesn't need special formatting
  
  return parts.join(', ').replace(/,\s*--/g, ' --');
}

/**
 * Get default parameters for a model
 */
export function getModelDefaults(model: AIModel): Partial<PromptConfig> {
  switch (model) {
    case 'midjourney':
      return {
        aspectRatio: '16:9',
        stylize: 100,
        chaos: 0,
      };
    case 'stable-diffusion':
      return {
        aspectRatio: '1024x1024',
      };
    case 'dall-e':
      return {
        aspectRatio: '1024x1024',
        quality: 'standard',
      };
    default:
      return {};
  }
}

/**
 * Validate prompt length for model
 */
export function validatePromptLength(prompt: string, model: AIModel): { valid: boolean; message?: string } {
  const limits: Record<AIModel, number> = {
    'midjourney': 6000,
    'stable-diffusion': 75, // tokens, roughly 300 chars
    'dall-e': 4000,
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

