// Options for the home page prompt generator. `value` is the text that goes into the prompt.

export interface PromptOption {
  id: string;
  label: string;
  value: string;
}

export interface StyleCategory {
  id: string;
  label: string;
  options: readonly PromptOption[];
}

export const STYLE_CATEGORIES: readonly StyleCategory[] = [
  {
    id: 'art',
    label: 'Art',
    options: [
      { id: 'oil-painting', label: 'Oil painting', value: 'oil painting, visible brushstrokes' },
      { id: 'watercolor', label: 'Watercolor', value: 'watercolor painting, soft bleeding edges, paper texture' },
      { id: 'ink', label: 'Ink drawing', value: 'ink drawing, cross-hatching' },
      { id: 'ukiyo-e', label: 'Ukiyo-e', value: 'ukiyo-e woodblock print, flat colour, bold outlines' },
      { id: 'anime', label: 'Anime', value: 'anime illustration, clean line art, cel shading' },
      { id: 'pixel-art', label: 'Pixel art', value: 'pixel art, limited palette, 16-bit' },
      { id: '3d-render', label: '3D render', value: '3D render, soft global illumination' },
      { id: 'surreal', label: 'Surreal', value: 'surrealist painting, dreamlike, impossible scale' },
      { id: 'minimalist', label: 'Minimalist', value: 'minimalist, flat shapes, generous negative space' },
      { id: 'pop-art', label: 'Pop art', value: 'pop art, bold flat colours, halftone dots' },
      { id: 'cyberpunk', label: 'Cyberpunk', value: 'cyberpunk, neon signs, rain-slick streets' },
      { id: 'steampunk', label: 'Steampunk', value: 'steampunk, brass and copper machinery, Victorian details' },
    ],
  },
  {
    id: 'photo',
    label: 'Photo',
    options: [
      { id: 'portrait', label: 'Portrait', value: 'portrait photograph, shallow depth of field' },
      { id: 'landscape', label: 'Landscape', value: 'landscape photograph, wide view' },
      { id: 'street', label: 'Street', value: 'candid street photograph' },
      { id: 'product', label: 'Product', value: 'product photograph, clean studio backdrop' },
      { id: 'fashion', label: 'Fashion', value: 'fashion editorial photograph' },
      { id: 'macro', label: 'Macro', value: 'macro photograph, extreme close-up' },
      { id: 'film', label: '35mm film', value: '35mm film photograph, natural grain' },
      { id: 'documentary', label: 'Documentary', value: 'documentary photograph, natural moment' },
    ],
  },
  {
    id: 'mood',
    label: 'Mood',
    options: [
      { id: 'dramatic', label: 'Dramatic', value: 'dramatic, high contrast' },
      { id: 'dreamy', label: 'Dreamy', value: 'dreamy, soft glow' },
      { id: 'dark', label: 'Dark and moody', value: 'dark and moody, deep shadows' },
      { id: 'vibrant', label: 'Vibrant', value: 'vibrant, saturated colours' },
      { id: 'nostalgic', label: 'Nostalgic', value: 'nostalgic, faded warm tones' },
      { id: 'calm', label: 'Calm', value: 'calm, serene, muted palette' },
      { id: 'eerie', label: 'Eerie', value: 'eerie, unsettling stillness' },
      { id: 'playful', label: 'Playful', value: 'playful, whimsical' },
    ],
  },
];

export const LIGHTING_OPTIONS: readonly PromptOption[] = [
  { id: 'golden-hour', label: 'Golden hour', value: 'golden hour light' },
  { id: 'blue-hour', label: 'Blue hour', value: 'blue hour light' },
  { id: 'overcast', label: 'Overcast', value: 'soft overcast light' },
  { id: 'window', label: 'Window light', value: 'soft window light' },
  { id: 'studio', label: 'Studio softbox', value: 'studio softbox lighting' },
  { id: 'cinematic', label: 'Cinematic', value: 'cinematic lighting' },
  { id: 'chiaroscuro', label: 'Hard shadows', value: 'chiaroscuro, hard shadows' },
  { id: 'backlit', label: 'Backlit', value: 'backlit, rim light' },
  { id: 'neon', label: 'Neon', value: 'neon light' },
  { id: 'volumetric', label: 'Light rays', value: 'volumetric light rays' },
];

export const CAMERA_OPTIONS: readonly PromptOption[] = [
  { id: '24mm', label: 'Wide 24mm', value: '24mm wide-angle lens' },
  { id: '35mm', label: '35mm', value: '35mm lens' },
  { id: '50mm', label: '50mm', value: '50mm lens, f/1.8' },
  { id: '85mm', label: 'Portrait 85mm', value: '85mm portrait lens' },
  { id: 'macro', label: 'Macro', value: '100mm macro lens' },
  { id: 'low-angle', label: 'Low angle', value: 'low-angle shot' },
  { id: 'overhead', label: 'Overhead', value: 'overhead flat-lay shot' },
  { id: 'aerial', label: 'Aerial', value: 'aerial drone shot' },
  { id: 'tilt-shift', label: 'Tilt-shift', value: 'tilt-shift lens, miniature effect' },
];

/** Terms offered by "Add common fixes" for models with a negative prompt. */
export const COMMON_NEGATIVES = ['blurry', 'lowres', 'watermark', 'text', 'extra fingers', 'deformed hands'];

export const EXAMPLE_SUBJECTS = [
  'a lighthouse keeper on a stormy cliff',
  'a red fox asleep in fresh snow',
  'a tiny bakery on a rainy Paris street',
  'a robot gardener tending tomatoes',
];

export const ALL_STYLES: readonly PromptOption[] = STYLE_CATEGORIES.flatMap((category) => category.options);
