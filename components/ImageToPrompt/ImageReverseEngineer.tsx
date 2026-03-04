'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Copy, ImageUp, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/UI';
import { copyToClipboard, cn } from '@/lib/utils';

interface ReversePromptResult {
  styleDna: {
    subject: string;
    lighting: string;
    lens: string;
    mood: string;
    palette: string;
    styleTags: string[];
  };
  prompt: string;
  negativePrompt: string;
  remixes: string[];
}

const maxFileSize = 8 * 1024 * 1024;

export function ImageReverseEngineer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReversePromptResult | null>(null);
  const [error, setError] = useState('');
  const [analysisNote, setAnalysisNote] = useState('');
  const [copyState, setCopyState] = useState<'prompt' | 'bundle' | null>(null);

  const accept = 'image/png,image/jpeg,image/webp';

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const canAnalyze = Boolean(selectedFile) && !isLoading;

  const tokenBadges = useMemo(() => {
    if (!result) return [];
    return [
      result.styleDna.subject,
      result.styleDna.mood,
      result.styleDna.lighting,
      result.styleDna.palette,
    ].filter(Boolean);
  }, [result]);

  const handleFile = (file: File | null) => {
    setError('');
    setResult(null);
    setAnalysisNote('');
    if (!file) return;

    const validType = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type);
    if (!validType) {
      setError('Only PNG, JPG, and WEBP images are supported.');
      return;
    }

    if (file.size > maxFileSize) {
      setError('Maximum file size is 8MB.');
      return;
    }

    setSelectedFile(file);
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError('');
    setAnalysisNote('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/image-to-prompt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Image analysis failed.');
      }

      const payload = (await response.json()) as {
        data: ReversePromptResult;
        degraded?: boolean;
        reason?: string;
      };
      setResult(payload.data);

      if (payload.degraded) {
        setAnalysisNote(
          'Vision model is unavailable in this environment. Showing a smart fallback draft you can still remix.'
        );
      }
    } catch (analysisError) {
      console.error('[ImageReverseEngineer]', analysisError);
      setError(analysisError instanceof Error ? analysisError.message : 'Unexpected analysis error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (variant: 'prompt' | 'bundle') => {
    if (!result) return;

    const output =
      variant === 'prompt'
        ? result.prompt
        : JSON.stringify(
            {
              prompt: result.prompt,
              negativePrompt: result.negativePrompt,
              remixes: result.remixes,
              styleDna: result.styleDna,
            },
            null,
            2
          );

    const copied = await copyToClipboard(output);
    if (!copied) return;

    setCopyState(variant);
    setTimeout(() => setCopyState(null), 1800);
  };

  const handleShare = async () => {
    if (!result) return;

    const shareText = `Reverse engineered this image into prompt DNA with Free AI Prompt Maker:\n\n${result.prompt}`;
    const shareUrl = `${window.location.origin}/image-to-prompt`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 md:pt-12">
      <section className="section-shell rounded-3xl p-6 sm:p-8 md:p-10">
        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              Viral Feature
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
              Image-to-Prompt Reverse Engineer
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              Upload any image. We extract subject, lighting, lens, mood, and style DNA, then generate
              a ready prompt, negative prompt, and 3 remix variants.
            </p>

            <div
              className={cn(
                'mt-6 rounded-2xl border-2 border-dashed p-6 transition',
                isDragging
                  ? 'border-cyan-300/60 bg-cyan-300/10'
                  : 'border-white/15 bg-[#0d182b]/70'
              )}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFile(event.dataTransfer.files?.[0] || null);
              }}
            >
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-100">
                  <ImageUp className="h-5 w-5" />
                </span>
                <span className="text-sm text-slate-200">Drop image or click to upload</span>
                <span className="text-xs text-slate-400">PNG, JPG, WEBP up to 8MB</span>
                <input
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(event) => handleFile(event.target.files?.[0] || null)}
                />
              </label>
            </div>

            {error && (
              <p className="mt-3 rounded-lg border border-rose-300/30 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            )}
            {analysisNote && (
              <p className="mt-3 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
                {analysisNote}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={analyzeImage}
                disabled={!canAnalyze}
                icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              >
                {isLoading ? 'Analyzing...' : 'Reverse Engineer Prompt'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedFile(null);
                  setResult(null);
                  setError('');
                }}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Preview</p>
            <div className="mt-3 relative min-h-[320px] overflow-hidden rounded-xl border border-white/12 bg-[#0a1325]">
              {previewUrl ? (
                <Image src={previewUrl} alt="Uploaded style reference" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
                  Uploaded image preview will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {result && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-shell mt-8 rounded-3xl p-6 md:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-white">Style DNA</h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleCopy('prompt')}
                icon={<Copy className="h-4 w-4" />}
                variant={copyState === 'prompt' ? 'success' : 'primary'}
              >
                {copyState === 'prompt' ? 'Copied' : 'Copy Prompt'}
              </Button>
              <Button
                size="sm"
                onClick={() => handleCopy('bundle')}
                icon={<Copy className="h-4 w-4" />}
                variant={copyState === 'bundle' ? 'success' : 'secondary'}
              >
                {copyState === 'bundle' ? 'Copied' : 'Copy Bundle'}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleShare}>
                Share on X
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tokenBadges.map((token) => (
              <span
                key={token}
                className="rounded-full border border-cyan-300/35 bg-cyan-300/12 px-3 py-1 text-xs text-cyan-100"
              >
                {token}
              </span>
            ))}
            {result.styleDna.styleTags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/12 bg-[#0d182b]/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Prompt</p>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-sm text-white">{result.prompt}</pre>
            </div>
            <div className="rounded-2xl border border-white/12 bg-[#0d182b]/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Negative Prompt</p>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-sm text-slate-200">{result.negativePrompt}</pre>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/12 bg-[#0d182b]/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Remix Variations</p>
            <div className="mt-2 space-y-2">
              {result.remixes.map((remix, index) => (
                <button
                  key={remix}
                  type="button"
                  onClick={() => copyToClipboard(remix)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/[0.08]"
                >
                  <span className="text-cyan-200">Variation {index + 1}:</span> {remix}
                </button>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
