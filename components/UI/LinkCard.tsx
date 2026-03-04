import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkCardProps {
    href: string;
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
}

export function LinkCard({ href, children, icon, className }: LinkCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                'group flex items-center justify-between rounded-xl border-[0.5px] border-[var(--border-default)] bg-black/40 px-5 py-3.5 text-[var(--text-primary)] transition-all duration-300 backdrop-blur-md',
                'hover:border-[var(--accent-primary-strong)] hover:shadow-[0_0_15px_-3px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 hover:bg-black/60',
                className
            )}
        >
            <span className="font-medium tracking-wide">{children}</span>
            {icon || <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors" />}
        </Link>
    );
}
