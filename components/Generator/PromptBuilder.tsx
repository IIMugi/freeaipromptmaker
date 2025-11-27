'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { TextArea } from '@/components/UI';
import { ModelSelector } from './ModelSelector';
import { StyleCards, getStyleValues } from './StyleCards';
import { LightingCamera } from './LightingCamera';
import { ParameterSliders } from './ParameterSliders';
import { LivePreview } from './LivePreview';
import { buildPrompt, getModelDefaults, type AIModel, type PromptHistory } from '@/lib/prompt-builder';
import { useLocalStorage } from '@/lib/hooks';
import { generateId } from '@/lib/utils';

export function PromptBuilder() {
  // Model state
  const [model, setModel] = useState<AIModel>('midjourney');
  
  // Prompt content state
  const [mainConcept, setMainConcept] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [lighting, setLighting] = useState('');
  const [camera, setCamera] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  
  // Parameters state
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [stylize, setStylize] = useState(100);
  const [chaos, setChaos] = useState(0);
  
  // History (persisted to localStorage)
  const [history, setHistory] = useLocalStorage<PromptHistory[]>('prompt-history', []);

  // Model değiştiğinde varsayılan değerleri ayarla
  const handleModelChange = (newModel: AIModel) => {
    setModel(newModel);
    const defaults = getModelDefaults(newModel);
    if (defaults.aspectRatio) setAspectRatio(defaults.aspectRatio);
    if (defaults.stylize !== undefined) setStylize(defaults.stylize);
    if (defaults.chaos !== undefined) setChaos(defaults.chaos);
  };

  // Style toggle
  const handleToggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  };

  // Generate prompt
  const generatedPrompt = useMemo(() => {
    return buildPrompt({
      model,
      mainConcept,
      styles: getStyleValues(selectedStyles),
      lighting,
      camera,
      aspectRatio,
      stylize,
      chaos,
      negativePrompt,
    });
  }, [model, mainConcept, selectedStyles, lighting, camera, aspectRatio, stylize, chaos, negativePrompt]);

  // Save to history
  const handleSaveToHistory = () => {
    if (!generatedPrompt) return;
    
    const newEntry: PromptHistory = {
      id: generateId(),
      prompt: generatedPrompt,
      model,
      timestamp: new Date().toISOString(),
    };
    
    setHistory((prev) => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
  };

  // Load from history
  const handleLoadFromHistory = (prompt: string) => {
    // Parse prompt and set main concept
    // For simplicity, just set it as main concept
    setMainConcept(prompt);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-violet-500" />
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">
            Free AI Prompt Maker
          </h1>
        </div>
        <p className="text-slate-400 text-lg">
          Create stunning AI art prompts visually - 100% free!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Model Selector */}
          <ModelSelector selected={model} onChange={handleModelChange} />

          {/* Main Concept Input */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Main Concept
            </h3>
            <TextArea
              value={mainConcept}
              onChange={(e) => setMainConcept(e.target.value)}
              placeholder="Describe your image... e.g., A mystical forest with glowing mushrooms"
              rows={3}
            />
          </div>

          {/* Style Cards */}
          <StyleCards
            selectedStyles={selectedStyles}
            onToggleStyle={handleToggleStyle}
          />

          {/* Lighting & Camera */}
          <LightingCamera
            lighting={lighting}
            camera={camera}
            onLightingChange={setLighting}
            onCameraChange={setCamera}
          />

          {/* Parameter Sliders */}
          <ParameterSliders
            model={model}
            aspectRatio={aspectRatio}
            stylize={stylize}
            chaos={chaos}
            onAspectRatioChange={setAspectRatio}
            onStylizeChange={setStylize}
            onChaosChange={setChaos}
          />

          {/* Negative Prompt (for SD) */}
          {model === 'stable-diffusion' && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Negative Prompt
              </h3>
              <TextArea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What to avoid... e.g., blurry, low quality, distorted"
                rows={2}
              />
            </div>
          )}
        </motion.div>

        {/* Right Column - Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:sticky lg:top-8 lg:self-start"
        >
          <div className="glass rounded-2xl p-6 space-y-6">
            <LivePreview
              prompt={generatedPrompt}
              history={history}
              onSaveToHistory={handleSaveToHistory}
              onClearHistory={handleClearHistory}
              onLoadFromHistory={handleLoadFromHistory}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

