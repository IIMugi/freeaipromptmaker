// A proof strip: three lines of a prompt, each marked in its role colour.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden="true" focusable="false">
      <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="6" fill="var(--accent)" />
      <rect x="6" y="8" width="16" height="2.6" rx="1.3" fill="var(--on-accent)" />
      <rect x="6" y="12.7" width="11" height="2.6" rx="1.3" fill="var(--on-accent)" opacity="0.75" />
      <rect x="6" y="17.4" width="7" height="2.6" rx="1.3" fill="var(--on-accent)" opacity="0.5" />
    </svg>
  );
}
