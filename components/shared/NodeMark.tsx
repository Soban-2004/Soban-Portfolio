// The site's recurring visual motif — a small node/signal graph
// (IMPLEMENTATION.md §5.1). Static, no animation. Used in the nav wordmark
// and footer — keep total appearances across the site to 4-5 max.

export function NodeMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
        <line x1="7" y1="24" x2="14" y2="12" />
        <line x1="14" y1="12" x2="21" y2="20" />
        <line x1="21" y1="20" x2="26" y2="9" />
      </g>
      <g fill="currentColor">
        <circle cx="7" cy="24" r="3" />
        <circle cx="14" cy="12" r="3" />
        <circle cx="21" cy="20" r="3" />
        <circle cx="26" cy="9" r="3" />
      </g>
    </svg>
  );
}
