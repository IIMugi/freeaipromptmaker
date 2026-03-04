import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
    children: ReactNode;
    variant?: 'cyan' | 'violet' | 'amber' | 'rose' | 'default';
    size?: 'sm' | 'md';
    icon?: ReactNode;
    className?: string;
}

const variantStyles = {
    cyan: 'border-[var(--accent-primary-strong)] bg-gradient-to-r from-[var(--accent-primary-soft)] to-transparent text-[var(--accent-primary)] shadow-[0_0_15px_-3px_var(--accent-primary-soft)] backdrop-blur-md',
    violet: 'border-[var(--accent-violet-soft)] bg-gradient-to-r from-[var(--accent-violet-soft)] to-transparent text-[var(--accent-violet)] shadow-[0_0_15px_-3px_var(--accent-violet-soft)] backdrop-blur-md',
    amber: 'border-[var(--accent-amber-soft)] bg-gradient-to-r from-[var(--accent-amber-soft)] to-transparent text-[var(--accent-amber)] shadow-[0_0_15px_-3px_var(--accent-amber-soft)] backdrop-blur-md',
    rose: 'border-[var(--accent-rose-soft)] bg-gradient-to-r from-[var(--accent-rose-soft)] to-transparent text-[var(--accent-rose)] shadow-[0_0_15px_-3px_var(--accent-rose-soft)] backdrop-blur-md',
    default: 'border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] backdrop-blur-md',
};

const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
};

export function Badge({
    children,
    variant = 'cyan',
    size = 'md',
    icon,
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-[0.14em]',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {icon}
            {children}
        </span>
    );
}
