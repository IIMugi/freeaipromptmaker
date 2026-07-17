import type { AIModel } from '@/lib/prompt-builder';

export interface PromptUseCase {
  slug: string;
  title: string;
  intent: string;
  intro: string;
  samplePrompts: string[];
  negatives: string[];
  keywords: string[];
}

export const promptUseCases: PromptUseCase[] = [
  {
    slug: 'anime',
    title: 'Anime',
    intent: 'Draft anime character and scene prompts using subject, style, color, and composition terms.',
    intro: 'Use the examples as editable starting points, then compare outputs in the model interface you choose.',
    samplePrompts: [
      'anime protagonist, dynamic pose, sunset backlight, cinematic framing, detailed line art',
      'slice of life cafe scene, warm palette, shallow depth of field, soft bloom',
      'futuristic anime city, rain reflections, dramatic perspective, neon highlights',
      'magical girl transformation sequence, sparkle effects, radiant aura, pastel gradient sky',
      'samurai standoff at dawn, ink wash aesthetic, wind-blown sakura petals, wide-angle composition',
    ],
    negatives: ['blurry eyes', 'distorted hands', 'extra limbs', 'muddy colors'],
    keywords: ['anime prompt generator ai', 'anime ai art prompts', 'anime character prompt'],
  },
  {
    slug: 'logos',
    title: 'Logos',
    intent: 'Draft logo and brand-mark prompts for typography, symbols, and icon concepts.',
    intro: 'Use the examples for early visual exploration, then recreate selected concepts in a suitable design tool.',
    samplePrompts: [
      'minimal geometric logo for fintech app, flat vector, white background',
      'wordmark logo for AI startup, modern sans-serif, high contrast',
      'symbol + wordmark combo, clean negative space, scalable icon style',
      'abstract wave logo for ocean conservation nonprofit, blue gradient, circular form',
      'monogram logo combining letters A and M, gold foil effect, luxury aesthetic',
    ],
    negatives: ['photorealistic texture', 'complex gradients', 'illegible text', 'busy background'],
    keywords: ['ai logo prompt generator', 'logo prompt builder', 'typography prompt generator'],
  },
  {
    slug: 'product-photography',
    title: 'Product Photography',
    intent: 'Draft product-photography prompts with explicit lighting, material, background, and composition terms.',
    intro: 'Use the examples to describe product-image concepts, then review generated details before any commercial use.',
    samplePrompts: [
      'premium sneaker product shot, studio softbox lighting, reflective floor, 85mm lens',
      'perfume bottle hero shot, moody gradient background, rim light, macro detail',
      'smartwatch floating shot, clean shadow, minimal modern composition',
      'artisan coffee bag packaging shot, rustic wood surface, natural window light, lifestyle staging',
      'wireless earbuds hero image, tech-minimal aesthetic, subtle reflection, high-key lighting',
    ],
    negatives: ['cluttered scene', 'low detail', 'overexposed highlights', 'warped proportions'],
    keywords: ['product photography ai prompt generator', 'ecommerce image prompt', 'ad shot ai prompt'],
  },
  {
    slug: 'youtube-thumbnails',
    title: 'YouTube Thumbnails',
    intent: 'Draft thumbnail prompts with a focal subject, contrast, and reserved space for separately added text.',
    intro: 'Use the examples to explore thumbnail compositions, then inspect the result at its actual display size.',
    samplePrompts: [
      'bold youtube thumbnail, expressive face close-up, high contrast lighting, empty text area',
      'tech review thumbnail style, clean split layout, neon accent glow, sharp subject',
      'tutorial thumbnail, simple background, dominant focal point, dynamic angle',
      'reaction thumbnail, exaggerated surprise expression, bold color pop background, vignette edges',
      'before and after split composition, dramatic transformation, side-by-side comparison layout',
    ],
    negatives: ['tiny text', 'flat contrast', 'busy composition', 'unclear subject'],
    keywords: ['youtube thumbnail ai prompt generator', 'thumbnail prompt builder', 'thumbnail composition prompt'],
  },
  {
    slug: 'cinematic-portraits',
    title: 'Cinematic Portraits',
    intent: 'Draft portrait prompts with subject, lens, lighting, framing, and mood terms.',
    intro: 'Use the examples as starting points and record how each model interprets photographic vocabulary.',
    samplePrompts: [
      'cinematic portrait, rain reflections, 50mm lens, teal-orange grade, dramatic rim light',
      'editorial portrait, moody side light, textured background, high detail skin',
      'night portrait, neon signage bokeh, shallow depth of field, film grain',
      'vintage film portrait, Kodak Portra 400 color science, soft window light, grain texture',
      'dramatic chiaroscuro portrait, Rembrandt lighting, dark background, painterly quality',
    ],
    negatives: ['plastic skin', 'low detail', 'oversaturated tones', 'bad anatomy'],
    keywords: ['cinematic prompt generator', 'portrait ai prompt', 'film style prompt builder'],
  },
  {
    slug: 'real-estate-interiors',
    title: 'Real Estate Interiors',
    intent: 'Draft interior prompts for layout concepts, staging ideas, and architectural presentation.',
    intro: 'Describe lighting, lens framing, surfaces, and room geometry, then manually check structural details.',
    samplePrompts: [
      'luxury modern living room, wide-angle 24mm, natural window light, editorial real estate style',
      'minimal Scandinavian kitchen interior, soft daylight, clean surfaces, high realism',
      'cozy bedroom interior, warm ambient lighting, balanced composition, lifestyle staging',
      'spa-like bathroom, marble surfaces, brass fixtures, diffused natural light, luxury aesthetic',
      'open-plan loft apartment, industrial-modern design, floor-to-ceiling windows, golden hour',
    ],
    negatives: ['warped perspective', 'broken geometry', 'heavy noise', 'clutter'],
    keywords: ['real estate ai prompt generator', 'interior design prompt builder', 'architecture interior prompt'],
  },
  {
    slug: 'fashion-editorial',
    title: 'Fashion Editorial',
    intent: 'Draft fashion-image prompts with art direction, palette, setting, and styling terms.',
    intro: 'Use the examples for visual concepts and review garments, faces, hands, branding, and rights manually.',
    samplePrompts: [
      'high-fashion editorial, dramatic studio lighting, monochrome palette, 85mm lens',
      'streetwear campaign shot, urban backdrop, dynamic pose, bold color accent',
      'luxury fashion portrait, minimal set design, soft shadows, magazine cover style',
      'avant-garde fashion editorial, surreal set design, bold geometric shapes, high contrast',
      'resort collection lookbook, golden hour beach, flowing fabric movement, 135mm compression',
    ],
    negatives: ['awkward anatomy', 'low detail fabric', 'flat light', 'busy background'],
    keywords: ['fashion ai prompt generator', 'editorial photo prompt', 'lookbook prompt builder'],
  },
  {
    slug: 'food-photography',
    title: 'Food Photography',
    intent: 'Draft food-photography prompts with plating, surface, light, camera, and setting terms.',
    intro: 'Use the examples for image concepts, then verify ingredients, portions, packaging, and required disclosures.',
    samplePrompts: [
      'gourmet burger ad shot, dramatic side light, steam detail, dark moody background',
      'fresh pasta close-up, natural light, rustic table setup, shallow depth of field',
      'dessert product hero image, clean composition, vibrant garnish detail',
      'sushi platter overhead flat lay, minimalist plating, negative space, editorial food style',
      'pour shot of espresso into ceramic cup, motion freeze, rich crema detail, coffee shop atmosphere',
    ],
    negatives: ['plastic texture', 'muted colors', 'blurry garnish', 'overprocessed look'],
    keywords: ['food photography ai prompt', 'restaurant prompt generator', 'menu image prompt'],
  },
  {
    slug: 'game-concepts',
    title: 'Game Concepts',
    intent: 'Draft concept-art prompts for environments, props, characters, and interface-independent ideation.',
    intro: 'Separate subject, silhouette, setting, palette, and viewpoint so each can be tested independently.',
    samplePrompts: [
      'fantasy game environment concept, ancient ruins, volumetric light shafts, epic scale',
      'sci-fi character concept sheet, front and side view, armor details, neutral backdrop',
      'stylized weapon concept, clean orthographic presentation, high detail materials',
      'underwater alien biome concept, bioluminescent flora, deep blue palette, exploration mood',
      'post-apocalyptic marketplace, bustling NPCs, narrative detail, painterly concept art style',
    ],
    negatives: ['inconsistent style', 'low readability', 'messy silhouette', 'bad perspective'],
    keywords: ['game concept prompt generator', 'character concept ai prompt', 'environment concept prompt'],
  },
  {
    slug: 'pixel-art',
    title: 'Pixel Art',
    intent: 'Draft pixel-art prompts with canvas-scale references, palette limits, subject, and viewing angle.',
    intro: 'Use the examples for exploration, then inspect pixel placement and redraw production assets as needed.',
    samplePrompts: [
      'retro pixel art city street, 16-bit palette, side view composition',
      'pixel art character sprite, idle pose, transparent background, game-ready',
      'isometric pixel tavern interior, cozy lighting, handcrafted detail',
      'pixel art forest tileset, modular design, consistent palette, RPG Maker compatible',
      'pixel art boss character, attack animation keyframe, 64x64 sprite, dark fantasy theme',
    ],
    negatives: ['smooth gradients', 'photorealism', 'anti-aliased blur', 'inconsistent pixel size'],
    keywords: ['pixel art ai prompt generator', 'retro prompt builder', 'sprite prompt generator'],
  },
  {
    slug: 'fantasy-scenes',
    title: 'Fantasy Scenes',
    intent: 'Draft fantasy prompts with setting, scale, atmosphere, subjects, and narrative details.',
    intro: 'Use the examples as modular starting points and test setting, subject, and lighting changes separately.',
    samplePrompts: [
      'ancient dragon temple in misty mountains, cinematic scale, glowing runes',
      'fantasy village at dusk, warm lantern light, detailed worldbuilding',
      'mage duel in stormy ruins, dynamic energy effects, dramatic composition',
      'floating sky islands connected by ancient bridges, aerial perspective, volumetric clouds',
      'enchanted forest with bioluminescent flora, mystical atmosphere, soft particle effects',
    ],
    negatives: ['flat composition', 'muddy lighting', 'low detail faces', 'artifacting'],
    keywords: ['fantasy ai prompt generator', 'worldbuilding prompt', 'epic scene prompt'],
  },
  {
    slug: 'architecture',
    title: 'Architecture',
    intent: 'Draft architectural prompts for concept boards, massing studies, and rendering exploration.',
    intro: 'Describe structure, viewpoint, light, and materials, then have qualified reviewers verify feasibility and accuracy.',
    samplePrompts: [
      'futuristic museum architecture, golden hour exterior, ultra clean lines',
      'modern villa facade, tropical landscaping, editorial architecture style',
      'brutalist civic building concept, cloudy dramatic sky, wide-angle framing',
      'parametric facade design, biomimetic structure, sunset glass reflections, 24mm tilt-shift',
      'sustainable campus building, green roof, cross-section diagram view, presentation rendering',
    ],
    negatives: ['warped geometry', 'inconsistent perspective', 'plastic materials', 'low detail'],
    keywords: ['architecture ai prompt generator', 'building render prompt', 'architectural concept prompt'],
  },
];

export const modelDisplayNames: Record<AIModel, string> = {
  flux: 'Flux',
  'flux-pro': 'Flux Pro',
  'midjourney-v7': 'Midjourney v7',
  midjourney: 'Midjourney v6',
  'stable-diffusion': 'Stable Diffusion XL',
  'dall-e': 'DALL-E 3',
  'nano-banana': 'Nano Banana Pro',
  firefly: 'Adobe Firefly 3',
  ideogram: 'Ideogram 2.0',
  leonardo: 'Leonardo.ai',
  recraft: 'Recraft V3',
  gpt4o: 'GPT-4o',
};


export function getPromptUseCase(slug: string) {
  return promptUseCases.find((item) => item.slug === slug);
}

export function getAllPromptUseCaseSlugs() {
  return promptUseCases.map((item) => item.slug);
}

export function getAllModelSlugs() {
  return Object.keys(modelDisplayNames) as AIModel[];
}

export function getRelatedPromptUseCases(slug: string, limit = 4) {
  return promptUseCases
    .filter((item) => item.slug !== slug)
    .slice(0, Math.max(1, limit));
}
