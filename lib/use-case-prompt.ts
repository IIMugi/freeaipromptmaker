// Prompt formatting for the /prompt-generator-for/* builders. Pure functions, no side effects.
// SDXL sizes mirror the table in posts/2026-05-17-master-sdxl-prompting-guide.mdx.

export type UseCaseModelId = 'midjourney' | 'sdxl' | 'flux' | 'chat';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5' | '3:2' | '2:3';

export interface UseCaseModel {
  id: UseCaseModelId;
  label: string;
  analyticsModel: 'midjourney' | 'stable-diffusion' | 'flux' | 'gpt4o';
}

export const USE_CASE_MODELS: readonly UseCaseModel[] = [
  { id: 'midjourney', label: 'Midjourney', analyticsModel: 'midjourney' },
  { id: 'sdxl', label: 'Stable Diffusion XL', analyticsModel: 'stable-diffusion' },
  { id: 'flux', label: 'Flux', analyticsModel: 'flux' },
  { id: 'chat', label: 'ChatGPT / Gemini', analyticsModel: 'gpt4o' },
];

export const SDXL_SIZES: Record<AspectRatio, string> = {
  '1:1': '1024 × 1024',
  '16:9': '1344 × 768',
  '9:16': '768 × 1344',
  '4:5': '896 × 1152',
  '3:2': '1216 × 832',
  '2:3': '832 × 1216',
};

const ASPECT_PHRASES: Record<AspectRatio, string> = {
  '1:1': 'Square 1:1 format.',
  '16:9': 'Wide 16:9 landscape format.',
  '9:16': 'Tall 9:16 vertical format.',
  '4:5': 'Vertical 4:5 format.',
  '3:2': 'Landscape 3:2 format.',
  '2:3': 'Vertical 2:3 format.',
};

export interface BuilderOption {
  id: string;
  label: string;
  /** Prompt fragment added when the option is selected. */
  value: string;
}

export interface BuilderGroup {
  id: string;
  label: string;
  multiple: boolean;
  options: readonly BuilderOption[];
}

export interface UseCaseBuilderConfig {
  subjectLabel: string;
  defaultSubject: string;
  /** Leading tag for keyword-style prompts, e.g. "pixel art". */
  tag: string;
  /** Sentence opener for natural-language prompts, e.g. "Pixel art of". */
  sentence: string;
  groups: readonly BuilderGroup[];
  defaults: Readonly<Record<string, readonly string[]>>;
  aspectRatios: readonly AspectRatio[];
  /** Terms for the SDXL negative prompt field. */
  negatives: readonly string[];
  /** Single words for Midjourney --no, which reads every word separately. */
  midjourneyNo: readonly string[];
}

export interface UseCasePromptState {
  model: UseCaseModelId;
  subject: string;
  selections: Readonly<Record<string, readonly string[]>>;
  aspectRatio: AspectRatio;
  avoid: boolean;
}

export interface UseCasePromptResult {
  prompt: string;
  negative: string;
  settings: string;
  note: string;
}

function selectedFragments(config: UseCaseBuilderConfig, selections: UseCasePromptState['selections']) {
  return config.groups.flatMap((group) => {
    const chosen = selections[group.id] ?? [];
    return group.options.filter((option) => chosen.includes(option.id)).map((option) => option.value);
  });
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function buildUseCasePrompt(config: UseCaseBuilderConfig, state: UseCasePromptState): UseCasePromptResult {
  const subject = state.subject.trim().replace(/\s+/g, ' ').replace(/[.,;\s]+$/, '');
  const fragments = selectedFragments(config, state.selections);

  if (!subject) {
    return { prompt: '', negative: '', settings: '', note: 'Describe your subject to build a prompt.' };
  }

  switch (state.model) {
    case 'midjourney': {
      const params = [`--ar ${state.aspectRatio}`];
      if (state.avoid && config.midjourneyNo.length > 0) params.push(`--no ${config.midjourneyNo.join(', ')}`);
      return {
        prompt: `${[config.tag, subject, ...fragments].join(', ')} ${params.join(' ')}`,
        negative: '',
        settings: '',
        note: 'Paste into Midjourney. --no reads each word separately, so it only lists single words.',
      };
    }
    case 'sdxl':
      return {
        prompt: [config.tag, subject, ...fragments].join(', '),
        negative: state.avoid ? config.negatives.join(', ') : '',
        settings: `Size: ${SDXL_SIZES[state.aspectRatio]}`,
        note: 'Works in Automatic1111, Forge, ComfyUI and other SDXL apps. Put the second box in the Negative prompt field.',
      };
    case 'flux':
      return {
        prompt: `${capitalize(`${config.sentence} ${subject}`)}${fragments.length ? `, ${fragments.join(', ')}` : ''}.`,
        negative: '',
        settings: `Aspect ratio: ${state.aspectRatio} (set it in your app)`,
        note: 'Flux has no standard negative prompt field, so describe what you want instead of what to avoid.',
      };
    case 'chat':
      return {
        prompt: `${capitalize(`${config.sentence} ${subject}`)}${fragments.length ? `, ${fragments.join(', ')}` : ''}. ${ASPECT_PHRASES[state.aspectRatio]}`,
        negative: '',
        settings: '',
        note: 'Paste into ChatGPT or Gemini. Ask for changes in plain words afterwards, for example “make the background darker”.',
      };
  }
}

/** Initial selections from the config defaults, limited to options that exist. */
export function defaultSelections(config: UseCaseBuilderConfig): Record<string, string[]> {
  return Object.fromEntries(
    config.groups.map((group) => {
      const ids = new Set(group.options.map((option) => option.id));
      return [group.id, (config.defaults[group.id] ?? []).filter((id) => ids.has(id))];
    }),
  );
}
