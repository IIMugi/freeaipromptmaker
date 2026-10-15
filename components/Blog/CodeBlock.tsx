'use client';

import { useRef, useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { trackProductEvent } from '@/lib/analytics';
import { copyToClipboard } from '@/lib/utils';

export function CodeBlock({ children }: { children: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.textContent?.replace(/\n$/, '') ?? '';
    if (!text || !(await copyToClipboard(text))) return;
    setCopied(true);
    trackProductEvent('guide_snippet_copied', {});
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <button
        type="button"
        className="code-copy-button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      >
        {copied ? <Check className="w-3.5 h-3.5" aria-hidden /> : <Copy className="w-3.5 h-3.5" aria-hidden />}
        <span aria-hidden>{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <pre ref={preRef} className="code-block" tabIndex={0}>
        {children}
      </pre>
    </div>
  );
}
