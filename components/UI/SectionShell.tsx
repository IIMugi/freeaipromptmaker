import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionShellProps {
    children: ReactNode;
    className?: string;
    as?: 'section' | 'div' | 'aside';
    hover?: boolean;
}

export function SectionShell({
    children,
    className,
    as: Component = 'div',
    hover = true,
}: SectionShellProps) {
    return (
        <Component
            className={cn(
                'relative overflow-hidden rounded-[2rem] p-6 md:p-8 glass-2 border-[0.5px] border-[var(--border-strong)] transition-all duration-500 hover:shadow-[var(--shadow-glow)] hover:border-[var(--accent-primary-strong)] group',
                hover && 'hover:-translate-y-1',
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            {children}
        </Component>
    );
}
