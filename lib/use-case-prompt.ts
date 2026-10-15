// Use-case builder configs for /prompt-generator-for/*. Formatting lives in lib/prompt-format.ts.

import { FORMATS, formatPrompt, type AspectRatio, type FormatId, type FormattedPrompt } from '@/lib/prompt-format';

export { SDXL_SIZES, type AspectRatio } from '@/lib/prompt-format';

export type UseCaseModelId = FormatId;

export const USE_CASE_MODELS = FORMATS;

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

export type UseCasePromptResult = FormattedPrompt;

function selectedFragments(config: UseCaseBuilderConfig, selections: UseCasePromptState['selections']) {
  return config.groups.flatMap((group) => {
    const chosen = selections[group.id] ?? [];
    return group.options.filter((option) => chosen.includes(option.id)).map((option) => option.value);
  });
}

export function buildUseCasePrompt(config: UseCaseBuilderConfig, state: UseCasePromptState): UseCasePromptResult {
  return formatPrompt({
    format: state.model,
    subject: state.subject,
    tag: config.tag,
    sentence: config.sentence,
    styles: selectedFragments(config, state.selections),
    light: [],
    aspectRatio: state.aspectRatio,
    negative: state.avoid ? config.negatives : [],
    midjourneyNo: state.avoid ? config.midjourneyNo : [],
  });
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
