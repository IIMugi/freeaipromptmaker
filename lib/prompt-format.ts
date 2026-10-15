// The one prompt formatter used by every builder on the site. Pure functions, no side effects.
// Each format returns the prompt both as text and as role-marked segments for the proof view.
// SDXL sizes mirror the table in posts/2026-05-17-master-sdxl-prompting-guide.mdx.

export type FormatId = 'midjourney' | 'sdxl' | 'flux' | 'chat';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5' | '3:2' | '2:3';

export type Role = 'subject' | 'style' | 'light' | 'param' | 'negative';

/** A run of prompt text. Segments without a role are separators. */
export interface Segment {
  text: string;
  role?: Role;
}

export interface PromptFormat {
  id: FormatId;
  label: string;
  /** Tab label. */
  short: string;
  /** Models the format is written for, shown under the tab. */
  models: string;
  analyticsModel: 'midjourney' | 'stable-diffusion' | 'flux' | 'gpt4o';
  negativeField: boolean;
}

export const FORMATS: readonly PromptFormat[] = [
  { id: 'midjourney', label: 'Midjourney', short: 'Midjourney', models: 'Midjourney web and Discord', analyticsModel: 'midjourney', negativeField: true },
  { id: 'sdxl', label: 'Stable Diffusion XL', short: 'SDXL', models: 'Automatic1111, Forge, ComfyUI', analyticsModel: 'stable-diffusion', negativeField: true },
  { id: 'flux', label: 'Flux', short: 'Flux', models: 'Flux dev, schnell and pro', analyticsModel: 'flux', negativeField: false },
  { id: 'chat', label: 'ChatGPT / Gemini', short: 'ChatGPT / Gemini', models: 'GPT Image, Nano Banana', analyticsModel: 'gpt4o', negativeField: false },
];

export const ASPECT_RATIOS: readonly AspectRatio[] = ['1:1', '16:9', '9:16', '4:5', '3:2', '2:3'];

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

/** Midjourney's default --stylize value. The flag is only written when it differs. */
export const MIDJOURNEY_DEFAULT_STYLIZE = 100;

export interface PromptInput {
  format: FormatId;
  subject: string;
  /** Leading keyword for keyword-style prompts, e.g. "pixel art". */
  tag?: string;
  /** Sentence opener for natural-language prompts, e.g. "Pixel art of". */
  sentence?: string;
  styles: readonly string[];
  /** Lighting and camera fragments. */
  light: readonly string[];
  aspectRatio: AspectRatio;
  /** Terms for a separate negative prompt field. */
  negative: readonly string[];
  /** Single words for Midjourney --no. Defaults to `negative`. */
  midjourneyNo?: readonly string[];
  stylize?: number;
  chaos?: number;
}

export interface FormattedPrompt {
  prompt: string;
  segments: Segment[];
  negative: string;
  negativeSegments: Segment[];
  settings: string;
  note: string;
}

const NOTES: Record<FormatId, string> = {
  midjourney: 'Paste into Midjourney. --no reads each word separately, so it works best with single words.',
  sdxl: 'Works in Automatic1111, Forge, ComfyUI and other SDXL apps. Put the second box in the Negative prompt field.',
  flux: 'Flux has no standard negative prompt field, so describe what you want instead of what to avoid.',
  chat: 'Paste into ChatGPT or Gemini. Ask for changes in plain words afterwards, for example “make the background darker”.',
};

export function cleanSubject(text: string) {
  return text.trim().replace(/\s+/g, ' ').replace(/[.,;\s]+$/, '');
}

function cleanList(items: readonly string[] | undefined) {
  return (items ?? []).map((item) => item.trim()).filter(Boolean);
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Joins role-marked parts with a separator segment between them. */
function joinSegments(parts: Segment[], separator = ', '): Segment[] {
  return parts.flatMap((part, index) => (index === 0 ? [part] : [{ text: separator }, part]));
}

export function segmentsToText(segments: readonly Segment[]) {
  return segments.map((segment) => segment.text).join('');
}

export function formatPrompt(input: PromptInput): FormattedPrompt {
  const subject = cleanSubject(input.subject);
  const styles = cleanList(input.styles);
  const light = cleanList(input.light);
  const negative = cleanList(input.negative);
  const tag = input.tag?.trim();

  if (!subject) {
    return { prompt: '', segments: [], negative: '', negativeSegments: [], settings: '', note: 'Describe your subject to build a prompt.' };
  }

  const detailParts: Segment[] = [
    ...styles.map((text): Segment => ({ text, role: 'style' })),
    ...light.map((text): Segment => ({ text, role: 'light' })),
  ];

  const keywordSegments = () =>
    joinSegments([
      ...(tag ? [{ text: tag, role: 'style' } as Segment] : []),
      { text: subject, role: 'subject' },
      ...detailParts,
    ]);

  const sentenceSegments = (): Segment[] => {
    const opener = input.sentence?.trim();
    const lead: Segment[] = opener
      ? [{ text: capitalize(opener), role: 'style' }, { text: ' ' }, { text: subject, role: 'subject' }]
      : [{ text: capitalize(subject), role: 'subject' }];
    return [...lead, ...detailParts.flatMap((part) => [{ text: ', ' }, part]), { text: '.' }];
  };

  const result = (segments: Segment[], negativeSegments: Segment[] = [], settings = ''): FormattedPrompt => ({
    prompt: segmentsToText(segments),
    segments,
    negative: segmentsToText(negativeSegments),
    negativeSegments,
    settings,
    note: NOTES[input.format],
  });

  switch (input.format) {
    case 'midjourney': {
      const params: Segment[] = [{ text: `--ar ${input.aspectRatio}`, role: 'param' }];
      if (input.stylize !== undefined && input.stylize !== MIDJOURNEY_DEFAULT_STYLIZE) {
        params.push({ text: `--s ${input.stylize}`, role: 'param' });
      }
      if (input.chaos !== undefined && input.chaos > 0) params.push({ text: `--chaos ${input.chaos}`, role: 'param' });
      const no = input.midjourneyNo ? cleanList(input.midjourneyNo) : negative;
      if (no.length > 0) params.push({ text: `--no ${no.join(', ')}`, role: 'negative' });
      return result([...keywordSegments(), ...params.flatMap((param) => [{ text: ' ' }, param])]);
    }
    case 'sdxl':
      return result(
        keywordSegments(),
        joinSegments(negative.map((text): Segment => ({ text, role: 'negative' }))),
        `Size: ${SDXL_SIZES[input.aspectRatio]}`,
      );
    case 'flux':
      return result(sentenceSegments(), [], `Aspect ratio: ${input.aspectRatio} (set it in your app)`);
    case 'chat':
      return result([...sentenceSegments(), { text: ' ' }, { text: ASPECT_PHRASES[input.aspectRatio], role: 'param' }]);
  }
}

export function getFormat(id: FormatId) {
  return FORMATS.find((format) => format.id === id)!;
}

export function isFormatId(value: unknown): value is FormatId {
  return FORMATS.some((format) => format.id === value);
}

export function isAspectRatio(value: unknown): value is AspectRatio {
  return ASPECT_RATIOS.includes(value as AspectRatio);
}
