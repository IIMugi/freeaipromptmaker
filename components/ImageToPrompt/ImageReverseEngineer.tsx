'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Copy, ImageUp, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/UI';
import { copyToClipboard, cn } from '@/lib/utils';
import { detectImageType, MAX_IMAGE_FILE_SIZE } from '@/lib/image-upload';
import { trackProductEvent } from '@/lib/analytics';

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

type AnalysisState = 'idle' | 'validating' | 'uploading' | 'success' | 'unavailable' | 'error';

export function ImageReverseEngineer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [state, setState] = useState<AnalysisState>('idle');
  const [result, setResult] = useState<ReversePromptResult | null>(null);
  const [message, setMessage] = useState('');
  const [copyState, setCopyState] = useState<'prompt' | 'bundle' | null>(null);

  const busy = state === 'validating' || state === 'uploading';
  const canAnalyze = Boolean(selectedFile) && !busy;
  const tokenBadges = useMemo(() => {
    if (!result) return [];
    return [
      result.styleDna.subject,
      result.styleDna.mood,
      result.styleDna.lighting,
      result.styleDna.palette,
    ].filter(Boolean);
  }, [result]);

  const resetResult = () => {
    setResult(null);
    setMessage('');
    setState('idle');
    setCopyState(null);
  };

  const handleFile = (file: File | null) => {
    resetResult();
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      trackProductEvent('image_upload_rejected', { reason: 'type' });
      setState('error');
      setMessage('Only PNG, JPG, and WEBP images are supported.');
      return;
    }
    if (file.size > MAX_IMAGE_FILE_SIZE) {
      trackProductEvent('image_upload_rejected', { reason: 'size' });
      setState('error');
      setMessage('Maximum file size is 8MB.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl('');
    resetResult();
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;
    setResult(null);
    setMessage('Checking the selected image…');
    setState('validating');

    const detectedType = detectImageType(new Uint8Array(await selectedFile.arrayBuffer()));
    if (!detectedType || detectedType !== selectedFile.type) {
      trackProductEvent('image_upload_rejected', { reason: 'signature' });
      trackProductEvent('image_analysis_failed', { reason: 'validation' });
      setState('error');
      setMessage('The file contents do not match a supported image format.');
      return;
    }

    setState('uploading');
    setMessage('Sending the image for analysis…');
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/image-to-prompt', { method: 'POST', body: formData });
      const payload = (await response.json().catch(() => null)) as
        | { code?: string; data?: ReversePromptResult }
        | null;

      if (response.status === 503 || payload?.code === 'analysis_unavailable') {
        trackProductEvent('image_analysis_failed', { reason: 'unavailable' });
        setState('unavailable');
        setMessage('Image analysis is currently unavailable. Your selected file is preserved.');
        return;
      }
      if (!response.ok || !payload?.data) {
        trackProductEvent('image_analysis_failed', {
          reason: response.status === 400 ? 'validation' : 'provider',
        });
        setState('error');
        setMessage('Image analysis failed. Please check the file and try again.');
        return;
      }

      setResult(payload.data);
      trackProductEvent('image_analysis_succeeded', {});
      setState('success');
      setMessage('Image analysis completed.');
    } catch {
      trackProductEvent('image_analysis_failed', { reason: 'provider' });
      setState('error');
      setMessage('Image analysis could not be reached. Please try again.');
    }
  };

  const handleCopy = async (variant: 'prompt' | 'bundle') => {
    if (state !== 'success' || !result) return;
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
            2,
          );
    if (await copyToClipboard(output)) setCopyState(variant);
  };

  const handleShare = () => {
    if (state !== 'success' || !result) return;
    const shareUrl = `${window.location.origin}/image-to-prompt`;
    const text = `Image prompt created with Free AI Prompt Maker:\n\n${result.prompt}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 md:pt-12">
      <section className="section-shell rounded-3xl p-6 sm:p-8 md:p-10">
        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Optional vision analysis
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">Image to prompt</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              When analysis is configured, upload a supported image to request a prompt, negative
              prompt, and variations from the vision provider. No result is fabricated when the
              provider is unavailable.
            </p>

            <div
              className={cn(
                'mt-6 rounded-2xl border-2 border-dashed p-6 transition',
                isDragging ? 'border-cyan-300/60 bg-cyan-300/10' : 'border-white/15 bg-[#0d182b]/70',
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
              <label htmlFor="image-analysis-upload" className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-100">
                  <ImageUp className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm text-slate-200">Drop image or click to upload</span>
                <span className="text-xs text-slate-400">PNG, JPG, WEBP up to 8MB</span>
              </label>
              <input
                id="image-analysis-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => handleFile(event.target.files?.[0] || null)}
              />
            </div>

            {message ? (
              <p
                role="status"
                className={cn(
                  'mt-3 rounded-lg border px-3 py-2 text-sm',
                  state === 'error'
                    ? 'border-rose-300/30 bg-rose-300/10 text-rose-100'
                    : 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100',
                )}
              >
                {message}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={analyzeImage}
                disabled={!canAnalyze}
                icon={busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              >
                {busy
                  ? state === 'validating'
                    ? 'Validating…'
                    : 'Analyzing…'
                  : state === 'unavailable' || state === 'error'
                    ? 'Try analysis again'
                    : 'Analyze image'}
              </Button>
              <Button variant="secondary" onClick={reset} disabled={busy || !selectedFile}>
                Reset
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Preview</p>
            <div className="relative mt-3 min-h-[320px] overflow-hidden rounded-xl border border-white/12 bg-[#0a1325]">
              {previewUrl ? (
                <Image src={previewUrl} alt="Selected image preview" fill unoptimized className="object-contain" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
                  Selected image preview will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {state === 'success' && result ? (
        <section className="section-shell mt-8 rounded-3xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-white">Analysis result</h2>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => handleCopy('prompt')} icon={<Copy className="h-4 w-4" />}>
                {copyState === 'prompt' ? 'Copied' : 'Copy prompt'}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleCopy('bundle')}>
                {copyState === 'bundle' ? 'Copied' : 'Copy bundle'}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleShare}>Share on X</Button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[...tokenBadges, ...result.styleDna.styleTags].map((token) => (
              <span key={token} className="rounded-full border border-cyan-300/35 bg-cyan-300/12 px-3 py-1 text-xs text-cyan-100">
                {token}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/12 bg-[#0d182b]/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Prompt</p>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-sm text-white">{result.prompt}</pre>
            </div>
            <div className="rounded-2xl border border-white/12 bg-[#0d182b]/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Negative prompt</p>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-sm text-slate-200">{result.negativePrompt}</pre>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/12 bg-[#0d182b]/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Variations</p>
            <ul className="mt-2 space-y-2">
              {result.remixes.map((remix) => (
                <li key={remix} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100">
                  {remix}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
