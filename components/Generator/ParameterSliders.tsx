'use client';

import { Slider, Select } from '@/components/UI';
import stylesData from '@/data/styles.json';
import type { AIModel } from '@/lib/prompt-builder';

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
  const aspectRatioOptions = stylesData.aspectRatios.map((ar) => ({
    value: ar.value,
    label: `${ar.name} (${ar.value})`,
  }));

  // Sadece Midjourney için stylize ve chaos göster
  const showMidjourneyParams = model === 'midjourney';

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        Parameters
      </h3>
      
      <div className="space-y-6">
        <Select
          label="Aspect Ratio"
          value={aspectRatio}
          options={aspectRatioOptions}
          onChange={onAspectRatioChange}
        />

        {showMidjourneyParams && (
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

        {model === 'stable-diffusion' && (
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400">
              💡 Stable Diffusion uses different parameters. Aspect ratio is converted to resolution.
            </p>
          </div>
        )}

        {model === 'dall-e' && (
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400">
              💡 DALL-E 3 uses natural language. Keep your prompt descriptive!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

