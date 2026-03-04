'use client';

import { Slider, Select } from '@/components/UI';
import stylesData from '@/data/styles.json';
import { getModelInfo, type AIModel } from '@/lib/prompt-builder';

interface ParameterSlidersProps {
  model: AIModel;
  aspectRatio: string;
  stylize: number;
  chaos: number;
  onAspectRatioChange: (value: string) => void;
  onStylizeChange: (value: number) => void;
  onChaosChange: (value: number) => void;
}

export function ParameterSliders({
  model,
  aspectRatio,
  stylize,
  chaos,
  onAspectRatioChange,
  onStylizeChange,
  onChaosChange,
}: ParameterSlidersProps) {
  const modelInfo = getModelInfo(model);

  const aspectRatioOptions = stylesData.aspectRatios.map((ar) => ({
    value: ar.value,
    label: `${ar.name} (${ar.value})`,
  }));

  const supportsAspectRatio = modelInfo?.supportsAspectRatio ?? true;
  const supportsStylize = modelInfo?.supportsStylize ?? false;
  const supportsChaos = modelInfo?.supportsChaos ?? false;

  const modelTips: Partial<Record<AIModel, string>> = {
    'stable-diffusion': 'Tip: Stable Diffusion uses resolution semantics. Ratio presets are normalized for you.',
    'dall-e': 'Tip: DALL-E responds best to natural language, contextual prompt descriptions.',
    flux: 'Tip: Flux is strong at photorealism and human anatomy consistency.',
    'flux-pro': 'Tip: Flux Pro improves detail retention and prompt adherence.',
    'nano-banana': 'Tip: Nano Banana is useful for text-in-image and edit-first workflows.',
    ideogram: 'Tip: Ideogram is optimized for text and layout-driven generations.',
    leonardo: 'Tip: Leonardo is tuned for characters, assets, and concept art workflows.',
    firefly: 'Tip: Firefly is trained on licensed content and business-safe pipelines.',
    recraft: 'Tip: Recraft is strong for vector-style outputs, icons, and illustrations.',
    gpt4o: 'Tip: GPT-4o works best with iterative conversational refinements.',
    'midjourney-v7': 'Tip: Midjourney v7 improves anatomy, style coherence, and detail quality.',
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Parameters</h2>

      <div className="space-y-6">
        {supportsAspectRatio && (
          <Select
            label="Aspect Ratio"
            value={aspectRatio}
            options={aspectRatioOptions}
            onChange={onAspectRatioChange}
          />
        )}

        {supportsStylize && (
          <>
            <Slider
              label="Stylize"
              value={stylize}
              min={0}
              max={1000}
              step={50}
              onChange={onStylizeChange}
            />
            <p className="text-xs text-slate-400 -mt-2">Lower values are literal. Higher values are more artistic.</p>
          </>
        )}

        {supportsChaos && (
          <>
            <Slider
              label="Chaos"
              value={chaos}
              min={0}
              max={100}
              step={5}
              onChange={onChaosChange}
            />
            <p className="text-xs text-slate-400 -mt-2">Higher chaos creates more variation per generation.</p>
          </>
        )}

        {modelTips[model] && (
          <div className="rounded-lg border border-white/12 bg-[#101a2b]/80 p-3">
            <p className="text-sm text-slate-300">{modelTips[model]}</p>
          </div>
        )}

        {modelInfo && (
          <div className="flex flex-wrap gap-2 pt-1">
            {modelInfo.features.map((feature) => (
              <span key={feature} className="rounded-md bg-[#1a2742] px-2 py-1 text-xs text-slate-300">
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
