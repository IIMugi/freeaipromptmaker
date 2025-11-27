'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, History, Trash2 } from 'lucide-react';
import { Button } from '@/components/UI';
import { ResultAd } from '@/components/Ads';
import { copyToClipboard } from '@/lib/utils';
import type { PromptHistory } from '@/lib/prompt-builder';

interface LivePreviewProps {
  prompt: string;
  history: PromptHistory[];
  onSaveToHistory: () => void;
  onClearHistory: () => void;
  onLoadFromHistory: (prompt: string) => void;
}

export function LivePreview({
  prompt,
  history,
  onSaveToHistory,
  onClearHistory,
  onLoadFromHistory,
}: LivePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    
    const success = await copyToClipboard(prompt);
    if (success) {
      setCopied(true);
      onSaveToHistory();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Generated Prompt
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          icon={<History className="w-4 h-4" />}
        >
          History ({history.length})
        </Button>
      </div>

      {/* Live Preview Box */}
      <motion.div
        layout
        className="relative min-h-[120px] p-4 bg-slate-800 rounded-xl border border-slate-700"
      >
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
          <p className="text-slate-500 italic">
            Start typing your main concept to generate a prompt...
          </p>
        )}
      </motion.div>

      {/* Copy Button */}
      <div className="flex gap-3">
        <Button
          variant={copied ? 'success' : 'primary'}
          size="lg"
          className="flex-1"
          onClick={handleCopy}
          disabled={!prompt}
          icon={copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        >
          {copied ? 'Copied!' : 'Copy Prompt'}
        </Button>
      </div>

      {/* SEO Uyumlu Reklam Alanı - Copy sonrası en değerli alan */}
      {copied && <ResultAd />}

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white">Recent Prompts</h4>
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearHistory}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="text-sm text-slate-500">No prompts saved yet</p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {history.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => onLoadFromHistory(item.prompt)}
                      className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <p className="text-sm text-white line-clamp-2 font-mono">
                        {item.prompt}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </motion.button>
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
