'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { Clock3, Copy, Eye, SlidersHorizontal, Sparkles } from 'lucide-react';
import { TextArea, Badge, SectionShell } from '@/components/UI';
import { ModelSelector } from './ModelSelector';
import { StyleCards } from './StyleCards';
import { LightingCamera } from './LightingCamera';
import { ParameterSliders } from './ParameterSliders';
import { LivePreview } from './LivePreview';
import { usePromptBuilder } from '@/lib/hooks/usePromptBuilder';
import { cn } from '@/lib/utils';
import { GeneratorErrorBoundary } from './GeneratorErrorBoundary';

export function PromptBuilder() {
  const searchParams = useSearchParams();
  const prefilledConcept = searchParams.get('q')?.trim() || '';

  const { state, computed, actions } = usePromptBuilder(prefilledConcept);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Keyboard shortcut to show history
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const paletteShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (!paletteShortcut) return;

      event.preventDefault();
      actions.setShowHistory((prev: boolean) => !prev);
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [actions]);

  const openPreview = (withHistory = false) => {
    if (withHistory) actions.setShowHistory(true);
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <GeneratorErrorBoundary>
      <div className="mx-auto max-w-7xl space-y-8 pb-32 lg:pb-0">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] border border-[var(--border-default)] bg-[var(--surface-base)]/80 px-6 py-8 md:px-10 md:py-10 shadow-[var(--shadow-card)]">
          <div className="relative z-10 max-w-3xl">
            <Badge variant="cyan" size="sm" icon={<Sparkles className="h-3.5 w-3.5" />}>
              Generator Workspace
            </Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
              Quick draft first, precision controls second.
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
              <span className="font-mono text-[var(--accent-primary)] rounded-md border border-[var(--border-default)] bg-[var(--surface-sunken)] px-1.5 py-0.5">Ctrl/⌘ + K</span> opens History. Switch Quick/Pro modes based on how deep you want to tune syntax.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => actions.setMode('quick')}
                className={cn(
                  'rounded-full border px-4 py-2 transition-all duration-200 font-medium',
                  state.mode === 'quick'
                    ? 'border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] shadow-[var(--shadow-glow)]'
                    : 'border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                )}
              >
                Quick Mode
              </button>
              <button
                type="button"
                onClick={() => actions.setMode('pro')}
                className={cn(
                  'rounded-full border px-4 py-2 transition-all duration-200 font-medium',
                  state.mode === 'pro'
                    ? 'border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] shadow-[var(--shadow-glow)]'
                    : 'border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                )}
              >
                Pro Mode
              </button>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-sunken)] px-3 py-2 text-[var(--text-secondary)]">
                12 AI models
              </span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-sunken)] px-3 py-2 text-[var(--text-secondary)]">
                Live syntax translation
              </span>
            </div>
          </div>
        </section>

        <AnimateHint text={state.modelSwitchHint} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SectionShell>
              <ModelSelector
                selected={state.model}
                onChange={actions.handleModelChange}
                mainConcept={state.mainConcept}
                quickMode={state.mode === 'quick'}
              />
            </SectionShell>

            <SectionShell className="space-y-4">
              <h2 className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.14em]">Main Concept</h2>
              <TextArea
                value={state.mainConcept}
                onChange={(e) => actions.setMainConcept(e.target.value)}
                placeholder="Example: cinematic portrait of a neon street chef, rain-soaked alley, dramatic rim light"
                rows={4}
                className="bg-[var(--surface-sunken)] focus:border-[var(--accent-primary-strong)] focus:ring-[var(--accent-primary-strong)]"
              />
            </SectionShell>

            <SectionShell>
              <StyleCards
                selectedStyles={state.selectedStyles}
                onToggleStyle={actions.handleToggleStyle}
                onClearStyles={actions.handleClearStyles}
                quickMode={state.mode === 'quick'}
              />
            </SectionShell>

            {state.mode === 'pro' ? (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 overflow-hidden">
                <SectionShell>
                  <LightingCamera
                    lighting={state.lighting}
                    camera={state.camera}
                    onLightingChange={actions.setLighting}
                    onCameraChange={actions.setCamera}
                  />
                </SectionShell>

                <SectionShell>
                  <ParameterSliders
                    model={state.model}
                    aspectRatio={state.aspectRatio}
                    stylize={state.stylize}
                    chaos={state.chaos}
                    onAspectRatioChange={actions.setAspectRatio}
                    onStylizeChange={actions.setStylize}
                    onChaosChange={actions.setChaos}
                  />
                </SectionShell>

                {computed.supportsNegativePrompt && (
                  <SectionShell className="space-y-4">
                    <h2 className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.14em]">Negative Prompt</h2>
                    <TextArea
                      value={state.negativePrompt}
                      onChange={(e) => actions.setNegativePrompt(e.target.value)}
                      placeholder="Example: blurry, low detail, warped hands, text artifacts, oversaturated skin"
                      rows={3}
                      className="bg-[var(--surface-sunken)] focus:border-[var(--accent-primary-strong)] focus:ring-[var(--accent-primary-strong)]"
                    />
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Use negative constraints to remove artifacts and lock visual consistency.
                    </p>
                  </SectionShell>
                )}
              </motion.div>
            ) : (
              <SectionShell>
                <p className="text-sm text-[var(--text-secondary)]">
                  Quick Mode is active. Switch to Pro Mode for camera controls, advanced parameters, and
                  negative prompt filters.
                </p>
              </SectionShell>
            )}
          </motion.div>

          <motion.aside
            ref={previewRef}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg-dense)] p-5 md:p-6 shadow-[var(--shadow-card)] backdrop-blur-xl">
              <LivePreview
                prompt={computed.generatedPrompt}
                model={state.model}
                history={state.history}
                draft={computed.draft}
                scores={{
                  outputConfidence: computed.outputConfidence,
                  syntaxQuality: computed.syntaxQuality,
                  validationMessage: computed.promptValidation.valid ? undefined : computed.promptValidation.message,
                }}
                showHistory={state.showHistory}
                copyVariantState={state.copyVariantState}
                onShowHistoryChange={actions.setShowHistory}
                onCopyVariant={actions.handleCopyVariant}
                onClearHistory={actions.handleClearHistory}
                onLoadFromHistory={actions.handleLoadFromHistory}
                onDuplicateHistory={actions.handleDuplicateHistory}
                onToggleFavorite={actions.handleToggleFavorite}
                onTogglePinned={actions.handleTogglePinned}
                onRemixHistory={actions.handleRemixHistory}
              />
            </div>
          </motion.aside>
        </div>

        {/* Mobile sticky bottom toolbar */}
        <div className="fixed inset-x-4 bottom-4 z-50 lg:hidden safe-bottom">
          <div className="glass-1 rounded-2xl p-2 shadow-[var(--shadow-nav)]">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => openPreview(false)}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-overlay)] active:scale-95"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                type="button"
                onClick={() => actions.handleCopyVariant('prompt')}
                disabled={!computed.generatedPrompt}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)] text-xs font-medium text-[var(--accent-primary)] transition-all hover:bg-[var(--accent-primary-strong)] active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              <button
                type="button"
                onClick={() => openPreview(true)}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-overlay)] active:scale-95"
              >
                <Clock3 className="h-4 w-4" />
                History
              </button>
            </div>
          </div>
        </div>
      </div>
    </GeneratorErrorBoundary>
  );
}

function AnimateHint({ text }: { text: string }) {
  if (!text) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent-primary)] shadow-[var(--shadow-glow)]"
    >
      <SlidersHorizontal className="h-4 w-4" />
      {text}
    </motion.div>
  );
}
