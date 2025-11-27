'use client';

import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({
  children,
  className,
  isSelected = false,
  onClick,
  hoverable = false,
}: CardProps) {
  const Component = onClick || hoverable ? motion.div : 'div';
  
  const baseProps = {
    className: cn(
      'rounded-xl bg-slate-800 border transition-all duration-200',
      isSelected
        ? 'border-violet-500 ring-2 ring-violet-500/20'
        : 'border-slate-700',
      (onClick || hoverable) && 'cursor-pointer hover:border-slate-600',
      className
    ),
    onClick,
  };

  const motionProps = onClick || hoverable
    ? {
        whileHover: { scale: 1.02, y: -2 },
        whileTap: { scale: 0.98 },
      }
    : {};

  return (
    <Component {...baseProps} {...motionProps}>
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('px-4 py-3 border-b border-slate-700', className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-4', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-4 py-3 border-t border-slate-700', className)}>
      {children}
    </div>
  );
}

