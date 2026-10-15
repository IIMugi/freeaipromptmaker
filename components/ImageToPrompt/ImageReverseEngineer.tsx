'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/Builder/CopyButton';
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
        setMessage('Image analysis is currently unavailable. You can describe the image in the prompt generator instead.');
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

  const bundle = result
    ? JSON.stringify(
        {
          prompt: result.prompt,
          negativePrompt: result.negativePrompt,
          remixes: result.remixes,
          styleDna: result.styleDna,
        },
        null,
        2,
      )
    : '';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <header className="max-w-3xl pb-8 pt-10 sm:pt-14">
        <h1 className="font-display text-[clamp(2.4rem,5.5vw,3.75rem)] text-ink">Image to prompt</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2 sm:text-xl">
          Upload an image to get a prompt that describes it, a negative prompt and a few variations.
        </p>
      </header>

      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,6fr)]">
        <div>
          <div
            className={cn(
              'rounded-panel border-2 border-dashed p-8 transition-colors',
              isDragging ? 'border-accent bg-accent-wash' : 'border-line-strong bg-surface',
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
            <label
              htmlFor="image-analysis-upload"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"
            >
              <ImageUp className="h-7 w-7 text-accent" aria-hidden="true" />
              <span className="font-semibold text-ink">Drop image or click to upload</span>
              <span className="text-sm text-ink-3">PNG, JPG or WEBP, up to 8 MB</span>
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
                'mt-4 rounded-control border-l-4 px-4 py-3 text-[0.95rem]',
                state === 'error'
                  ? 'border-danger bg-danger-wash text-ink'
                  : state === 'unavailable'
                    ? 'border-warn bg-warn-wash text-ink'
                    : 'border-line-strong bg-sunken text-ink-2',
              )}
            >
              {message}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {state === 'unavailable' ? (
              <Link
                href="/"
                className="inline-flex min-h-11 items-center rounded-control bg-accent px-5 font-semibold text-on-accent hover:bg-accent-hover"
              >
                Describe it in the prompt generator
              </Link>
            ) : (
              <button
                type="button"
                onClick={analyzeImage}
                disabled={!canAnalyze}
                className="inline-flex min-h-11 items-center gap-2 rounded-control bg-accent px-5 font-semibold text-on-accent hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-45"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {busy ? (state === 'validating' ? 'Checking…' : 'Analyzing…') : 'Analyze image'}
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              disabled={busy || !selectedFile}
              className="inline-flex min-h-11 items-center rounded-control border border-line-strong px-5 font-semibold text-ink hover:border-accent disabled:cursor-not-allowed disabled:opacity-45"
            >
              Remove image
            </button>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-panel border border-line bg-sunken">
          {previewUrl ? (
            <Image src={previewUrl} alt="Selected image preview" fill unoptimized className="object-contain" />
          ) : (
            <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-ink-3">
              Your image appears here.
            </p>
          )}
        </div>
      </div>

      {state === 'success' && result ? (
        <section aria-labelledby="analysis-title" className="mt-16 border-t-2 border-ink pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="analysis-title" className="font-display text-[clamp(1.75rem,3.4vw,2.4rem)] text-ink">
              Analysis result
            </h2>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={result.prompt} label="Copy prompt" copiedLabel="Prompt copied" variant="primary" />
              <CopyButton text={bundle} label="Copy everything as JSON" copiedLabel="JSON copied" />
            </div>
          </div>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Detected style">
            {[...tokenBadges, ...result.styleDna.styleTags].map((token) => (
              <li key={token} className="rounded-control bg-sunken px-2.5 py-1 text-sm text-role-style">
                {token}
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-semibold text-ink">Prompt</h3>
              <p className="proof mt-2">{result.prompt}</p>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Negative prompt</h3>
              <p className="proof mt-2">
                <span data-role="negative">{result.negativePrompt}</span>
              </p>
            </div>
          </div>

          <h3 className="mt-8 font-semibold text-ink">Variations</h3>
          <ul className="mt-2 border-t border-line">
            {result.remixes.map((remix) => (
              <li key={remix} className="border-b border-line py-3 font-mono text-[0.9rem] text-ink">
                {remix}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
