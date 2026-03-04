'use client';

import dynamic from 'next/dynamic';

export const PromptGalleryLazy = dynamic(() => import('./PromptGallery').then((mod) => mod.PromptGallery), {
    ssr: false,
    loading: () => (
        <div className="animate-pulse rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] h-[400px] w-full" />
    ),
});
