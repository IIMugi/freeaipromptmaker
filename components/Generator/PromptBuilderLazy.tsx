'use client';

import dynamic from 'next/dynamic';

export const PromptBuilderLazy = dynamic(() => import('./PromptBuilder').then((mod) => mod.PromptBuilder), {
    ssr: false,
    loading: () => (
        <div className="animate-pulse rounded-[2rem] border border-[var(--border-default)] bg-[var(--surface-base)]/50 h-[600px] w-full" />
    ),
});
