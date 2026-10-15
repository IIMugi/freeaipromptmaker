import { Fragment } from 'react';
import type { Role, Segment } from '@/lib/prompt-format';
import { cn } from '@/lib/utils';

export const ROLE_LABELS: Record<Role, string> = {
  subject: 'Subject',
  style: 'Style',
  light: 'Light and camera',
  param: 'Settings',
  negative: 'Avoid',
};

const ROLE_ORDER: Role[] = ['subject', 'style', 'light', 'param', 'negative'];

/** A formatted prompt with each part marked in its role colour. */
export function Proof({
  segments,
  muted = false,
  className,
}: {
  segments: readonly Segment[];
  muted?: boolean;
  className?: string;
}) {
  return (
    <p className={cn('proof', muted && 'opacity-55', className)}>
      {segments.map((segment, index) =>
        segment.role ? (
          <span key={index} data-role={segment.role}>
            {segment.text}
          </span>
        ) : (
          <Fragment key={index}>{segment.text}</Fragment>
        ),
      )}
    </p>
  );
}

/** Key to the role colours that appear in the given segments. */
export function ProofLegend({ segments, className }: { segments: readonly Segment[]; className?: string }) {
  const present = new Set(segments.map((segment) => segment.role).filter(Boolean));
  const roles = ROLE_ORDER.filter((role) => present.has(role));
  if (roles.length < 2) return null;

  return (
    <ul className={cn('proof flex flex-wrap gap-x-4 gap-y-1 !font-sans text-sm', className)} aria-label="Colour key">
      {roles.map((role) => (
        <li key={role}>
          <span data-role={role}>{ROLE_LABELS[role]}</span>
        </li>
      ))}
    </ul>
  );
}
