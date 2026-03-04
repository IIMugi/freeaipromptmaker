'use client';

import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, CopyPlus, History, Pin, Sparkles, Star, Trash2, Wand2 } from 'lucide-react';
import { Button } from '@/components/UI';
import { cn } from '@/lib/utils';
import type { AIModel, PromptHistory } from '@/lib/prompt-builder';

export type CopyVariant = 'prompt' | 'with-negative' | 'json';

interface PromptDraft {
  subject: string;
  style: string;
  camera: string;
  negative: string;
  modelSyntax: string;
}

interface PromptScores {
  outputConfidence: number;
  syntaxQuality: number;
  validationMessage?: string;
}

interface LivePreviewProps {
  prompt: string;
  model: AIModel;
  history: PromptHistory[];
  draft: PromptDraft;
  scores: PromptScores;
  showHistory: boolean;
  copyVariantState: CopyVariant | null;
  onShowHistoryChange: (value: boolean) => void;
  onCopyVariant: (variant: CopyVariant) => void;
  onClearHistory: () => void;
  onLoadFromHistory: (prompt: string) => void;
  onDuplicateHistory: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePinned: (id: string) => void;
  onRemixHistory: (id: string) => void;
}

export function LivePreview({
  prompt,
  model,
  history,
  draft,
  scores,
  showHistory,
  copyVariantState,
  onShowHistoryChange,
  onCopyVariant,
  onClearHistory,
  onLoadFromHistory,
  onDuplicateHistory,
  onToggleFavorite,
  onTogglePinned,
  onRemixHistory,
}: LivePreviewProps) {
  const sortedHistory = [...history].sort((a, b) => {
    const pinnedDiff = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
    if (pinnedDiff !== 0) return pinnedDiff;

    const favoriteDiff = Number(Boolean(b.favorite)) - Number(Boolean(a.favorite));
    if (favoriteDiff !== 0) return favoriteDiff;

    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-slate-200 uppercase tracking-wider">Prompt Draft</h3>
          <p className="text-xs text-slate-400 mt-1">Live syntax mode: {model}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShowHistoryChange(!showHistory)}
          icon={<History className="w-4 h-4" aria-hidden="true" />}
          aria-label={showHistory ? 'Hide prompt history' : `Show prompt history (${history.length} items)`}
          aria-expanded={showHistory}
        >
          History ({history.length})
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ScoreCard label="Output Confidence" value={scores.outputConfidence} tone="cyan" />
        <ScoreCard label="Syntax Quality" value={scores.syntaxQuality} tone="emerald" />
      </div>

      {scores.validationMessage && (
        <p className="rounded-lg border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
          {scores.validationMessage}
        </p>
      )}

      <div className="rounded-xl border border-white/12 bg-[#0f1d35]/90 p-3 space-y-2">
        <DraftRow label="Subject" value={draft.subject} />
        <DraftRow label="Style" value={draft.style} />
        <DraftRow label="Camera" value={draft.camera} />
        <DraftRow label="Negative" value={draft.negative} />
        <DraftRow label="Model Syntax" value={draft.modelSyntax} highlight />
      </div>

      <motion.div layout className="relative min-h-[120px] p-4 bg-[#0d1a30] rounded-xl border border-white/12">
        {prompt ? (
          <motion.p
            key={prompt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white font-mono text-sm leading-relaxed whitespace-pre-wrap"
          >
            {prompt}
          </motion.p>
        ) : (
          <p className="text-slate-500 italic">Start typing your concept to generate a prompt instantly...</p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Button
          variant={copyVariantState === 'prompt' ? 'success' : 'primary'}
          size="sm"
          onClick={() => onCopyVariant('prompt')}
          disabled={!prompt}
          icon={copyVariantState === 'prompt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          aria-label="Copy prompt to clipboard"
        >
          {copyVariantState === 'prompt' ? 'Copied' : 'Copy'}
        </Button>

        <Button
          variant={copyVariantState === 'with-negative' ? 'success' : 'secondary'}
          size="sm"
          onClick={() => onCopyVariant('with-negative')}
          disabled={!prompt}
          icon={copyVariantState === 'with-negative' ? <Check className="w-4 h-4" /> : <CopyPlus className="w-4 h-4" />}
          aria-label="Copy prompt and negative prompt"
        >
          Copy + Neg
        </Button>

        <Button
          variant={copyVariantState === 'json' ? 'success' : 'secondary'}
          size="sm"
          onClick={() => onCopyVariant('json')}
          disabled={!prompt}
          icon={copyVariantState === 'json' ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          aria-label="Copy prompt as JSON payload"
        >
          Copy JSON
        </Button>
      </div>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-[#0d1a30]/80 rounded-xl border border-white/12">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white">Prompt History</h4>
                {sortedHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearHistory}
                    icon={<Trash2 className="w-4 h-4" aria-hidden="true" />}
                    aria-label="Clear all prompt history"
                  >
                    Clear
                  </Button>
                )}
              </div>

              {sortedHistory.length === 0 ? (
                <p className="text-sm text-slate-400">No prompts saved yet.</p>
              ) : (
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {sortedHistory.map((item, index) => (
                    <div key={item.id} className="rounded-lg border border-white/10 bg-[#12223d] p-3">
                      <button
                        type="button"
                        onClick={() => onLoadFromHistory(item.prompt)}
                        className="w-full text-left"
                        aria-label={`Load saved prompt ${index + 1}`}
                      >
                        <p className="text-sm text-white line-clamp-2 font-mono">{item.prompt}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </button>

                      <div className="mt-2 flex items-center gap-2">
                        <HistoryActionButton
                          active={Boolean(item.pinned)}
                          icon={<Pin className="w-3.5 h-3.5" />}
                          label={item.pinned ? 'Unpin prompt' : 'Pin prompt'}
                          onClick={() => onTogglePinned(item.id)}
                        />
                        <HistoryActionButton
                          active={Boolean(item.favorite)}
                          icon={<Star className="w-3.5 h-3.5" />}
                          label={item.favorite ? 'Remove favorite' : 'Mark favorite'}
                          onClick={() => onToggleFavorite(item.id)}
                        />
                        <HistoryActionButton
                          icon={<Copy className="w-3.5 h-3.5" />}
                          label="Duplicate prompt"
                          onClick={() => onDuplicateHistory(item.id)}
                        />
                        <HistoryActionButton
                          icon={<Wand2 className="w-3.5 h-3.5" />}
                          label="Remix prompt"
                          onClick={() => onRemixHistory(item.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DraftRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2',
        highlight && 'border-cyan-300/35 bg-cyan-300/10'
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <p className="text-xs text-slate-100 mt-1">{value}</p>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'cyan' | 'emerald';
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-white/10">
          <div
            className={cn('h-1.5 rounded-full', tone === 'cyan' ? 'bg-cyan-300' : 'bg-emerald-300')}
            style={{ width: `${clamped}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-100">{clamped}</span>
      </div>
    </div>
  );
}

function HistoryActionButton({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs transition',
        active
          ? 'border-cyan-300/45 bg-cyan-300/15 text-cyan-100'
          : 'border-white/15 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]'
      )}
    >
      {icon}
    </button>
  );
}
