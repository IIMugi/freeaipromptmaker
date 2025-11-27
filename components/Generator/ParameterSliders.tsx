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

  // Get model capabilities
  const supportsAspectRatio = modelInfo?.supportsAspectRatio ?? true;
  const supportsStylize = modelInfo?.supportsStylize ?? false;
  const supportsChaos = modelInfo?.supportsChaos ?? false;

  // Model-specific tips
  const modelTips: Partial<Record<AIModel, string>> = {
    'stable-diffusion': '💡 SD uses resolution instead of aspect ratio. We convert automatically.',
    'dall-e': '💡 DALL-E 3 uses natural language. Keep your prompt descriptive!',
    'flux': '⚡ Flux excels at photorealistic images and human anatomy.',
    'flux-pro': '💎 Flux Pro offers higher quality and better prompt adherence.',
    'nano-banana': '🍌 Nano Banana Pro is great for text in images and photo editing.',
    'ideogram': '✍️ Ideogram is the best for text and typography in images.',
    'leonardo': '🎮 Leonardo specializes in game assets and character design.',
    'firefly': '🔶 Firefly is trained on licensed content - safe for commercial use.',
    'recraft': '📐 Recraft can output vector formats - great for icons and logos.',
    'gpt4o': '💬 GPT-4o allows conversational image creation and iteration.',
    'midjourney-v7': '🎨 MJ v7 has improved anatomy, hands, and text rendering.',
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        Parameters
      </h3>
      
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
            <div className="text-xs text-slate-500 -mt-2">
              Lower = more literal, Higher = more artistic
            </div>
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
            <div className="text-xs text-slate-500 -mt-2">
              Higher values produce more varied results
            </div>
          </>
        )}

        {/* Model-specific tip */}
        {modelTips[model] && (
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400">
              {modelTips[model]}
            </p>
          </div>
        )}

        {/* Show supported features */}
        {modelInfo && (
          <div className="flex flex-wrap gap-2 pt-2">
            {modelInfo.features.map((feature, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-md"
              >
                ✓ {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
