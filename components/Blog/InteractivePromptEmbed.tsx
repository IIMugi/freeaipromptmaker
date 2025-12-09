'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

interface InteractivePromptEmbedProps {
  prompt: string;
  model?: string;
  description?: string;
}

/**
 * Interactive Prompt Embed
 * SEO: Rich snippet preview, engagement signal
 * Conversion: Blog → Generator funnel
 */
export function InteractivePromptEmbed({ 
  prompt, 
  model = 'Flux',
  description 
}: InteractivePromptEmbedProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt);
    if (success) {
      setCopied(true);
      trackEvent({
        action: 'copy_prompt_from_blog',
        category: 'engagement',
        label: model,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInGenerator = () => {
    trackEvent({
      action: 'open_in_generator',
      category: 'conversion',
      label: model,
    });
    // Prompt'u query param olarak generator'a gönder
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(`/?prompt=${encodedPrompt}`, '_blank');
  };

  return (
    <div className="my-6 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-900/10 to-purple-900/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 bg-violet-500/10 border-b border-violet-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-violet-300 font-semibold uppercase tracking-wider">
            Example Prompt
          </span>
          {model && (
            <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs">
              {model}
            </span>
          )}
        </div>
      </div>

      {/* Prompt Content */}
      <div className="p-4 bg-slate-900/40">
        {description && (
          <p className="text-sm text-slate-400 mb-3 italic">{description}</p>
        )}
        <code className="block text-sm text-slate-100 font-mono whitespace-pre-wrap break-words">
          {prompt}
        </code>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800 flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
          aria-label={copied ? 'Prompt copied' : 'Copy prompt'}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
        <button
          onClick={handleOpenInGenerator}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
          aria-label="Open in prompt generator"
        >
          <ExternalLink className="w-4 h-4" />
          Try in Generator
        </button>
      </div>
    </div>
  );
}

