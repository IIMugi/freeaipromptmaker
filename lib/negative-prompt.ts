// Negative prompt lists used by /negative-prompt-generator.
// Terms mirror the verified guide posts/2025-11-29-stable-diffusion-negative-prompts-guide.mdx
// and posts/2026-02-22-master-leonardo-ai-negative-prompts.mdx; update them together.

export type NegativeModelId = 'sd15' | 'sdxl' | 'illustrious' | 'pony' | 'leonardo' | 'midjourney' | 'flux';

export type NegativeCategoryId =
  | 'photo'
  | 'anime'
  | 'text'
  | 'portrait'
  | 'landscape'
  | 'product'
  | 'graphic'
  | 'sfw';

export interface NegativeModel {
  id: NegativeModelId;
  label: string;
  base: readonly string[];
  format: 'list' | 'midjourney' | 'unsupported';
  note: string;
}

export interface NegativeCategory {
  id: NegativeCategoryId;
  label: string;
  terms: readonly string[];
}

export interface NegativePromptResult {
  supported: boolean;
  terms: string[];
  text: string;
  note: string;
}

const split = (list: string) => list.split(',').map((term) => term.trim()).filter(Boolean);

export const NEGATIVE_MODELS: readonly NegativeModel[] = [
  {
    id: 'sd15',
    label: 'SD 1.5',
    base: split(
      'lowres, worst quality, low quality, normal quality, jpeg artifacts, blurry, bad anatomy, bad hands, extra fingers, missing fingers, fused fingers, extra limbs, deformed, disfigured, cropped, out of frame, watermark, signature, text, username',
    ),
    format: 'list',
    note: 'SD 1.5 checkpoints are more prone to anatomy and quality problems, so a longer list is common.',
  },
  {
    id: 'sdxl',
    label: 'SDXL',
    base: split(
      'lowres, blurry, jpeg artifacts, watermark, signature, text, deformed, bad anatomy, extra fingers, cropped, out of frame',
    ),
    format: 'list',
    note: 'SDXL needs far fewer quality tags than SD 1.5. If an image already looks clean, an empty negative prompt is fine.',
  },
  {
    id: 'illustrious',
    label: 'Illustrious XL',
    base: split(
      'worst quality, comic, multiple views, bad quality, low quality, lowres, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, greyscale, signature, twitter username, jpeg artifacts, 2koma, 4koma, guro, extra digits, fewer digits',
    ),
    format: 'list',
    note: 'Base list from the Illustrious XL model card. Remove "monochrome, greyscale" for black-and-white images.',
  },
  {
    id: 'pony',
    label: 'Pony V6 XL',
    base: [],
    format: 'list',
    note: 'The Pony model card says it does not need negative prompts in most cases. Put "score_9, score_8_up, score_7_up, score_6_up, score_5_up, score_4_up" at the start of the positive prompt instead, and add categories here only for problems you see.',
  },
  {
    id: 'leonardo',
    label: 'Leonardo',
    base: split(
      'blurry, low quality, lowres, jpeg artifacts, out of focus, overexposed, underexposed, watermark, signature, text, logo',
    ),
    format: 'list',
    note: 'Only some Leonardo models have a negative prompt (Phoenix, Ideogram 3.0, Kino XL, Anime XL and other older presets). Turn it on under Advanced Settings.',
  },
  {
    id: 'midjourney',
    label: 'Midjourney',
    base: [],
    format: 'midjourney',
    note: 'Add the --no parameter at the end of your prompt. Each word is read separately, so "--no modern clothing" removes "modern" and "clothing".',
  },
  {
    id: 'flux',
    label: 'Flux',
    base: [],
    format: 'unsupported',
    note: 'Flux has no standard negative prompt. Describe what you want instead: "clean white background" rather than excluding "clutter", "an empty street" rather than excluding "people".',
  },
];

export const NEGATIVE_CATEGORIES: readonly NegativeCategory[] = [
  {
    id: 'photo',
    label: 'Realistic photo',
    terms: split('cartoon, anime, illustration, painting, drawing, 3d render, cgi, plastic skin, airbrushed, oversaturated'),
  },
  {
    id: 'anime',
    label: 'Anime / illustration',
    terms: split(
      'worst quality, low quality, lowres, bad anatomy, bad hands, extra digits, fewer digits, jpeg artifacts, signature, watermark, username, blurry, photorealistic, 3d',
    ),
  },
  {
    id: 'portrait',
    label: 'Portraits and hands',
    terms: split(
      'asymmetrical eyes, cross-eyed, deformed iris, bad teeth, extra fingers, fused fingers, malformed hands, bad anatomy, double face, plastic skin, airbrushed',
    ),
  },
  {
    id: 'text',
    label: 'No text or watermark',
    terms: split('text, watermark, signature, logo, caption, username, artist name, letters, words'),
  },
  {
    id: 'landscape',
    label: 'Landscapes and buildings',
    terms: split(
      'people, person, crowd, cars, power lines, signs, text, tilted horizon, distorted perspective, warped lines, oversaturated, lowres',
    ),
  },
  {
    id: 'product',
    label: 'Product photo',
    terms: split(
      'cluttered background, dust, scratches, fingerprints, harsh reflections, distorted label, misspelled text, watermark, lowres, blurry',
    ),
  },
  {
    id: 'graphic',
    label: 'Logo / flat graphic',
    terms: split('photograph, photorealistic, 3d render, gradient, shadow, texture, noise, cluttered, extra text, misspelled text, watermark'),
  },
  {
    id: 'sfw',
    label: 'Safe for work',
    terms: split('nsfw, nude, naked, explicit, suggestive, cleavage, lingerie, underwear'),
  },
];

export function buildNegativePrompt(
  modelId: NegativeModelId,
  categoryIds: readonly NegativeCategoryId[],
): NegativePromptResult {
  const model = NEGATIVE_MODELS.find((candidate) => candidate.id === modelId) ?? NEGATIVE_MODELS[1];
  if (model.format === 'unsupported') {
    return { supported: false, terms: [], text: '', note: model.note };
  }

  const selected = new Set(categoryIds);
  const terms: string[] = [];
  const seen = new Set<string>();
  const add = (term: string) => {
    const key = term.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    terms.push(term);
  };

  model.base.forEach(add);
  for (const category of NEGATIVE_CATEGORIES) {
    if (selected.has(category.id)) category.terms.forEach(add);
  }

  const list = terms.join(', ');
  const text = model.format === 'midjourney' && list ? `--no ${list}` : list;
  return { supported: true, terms, text, note: model.note };
}
