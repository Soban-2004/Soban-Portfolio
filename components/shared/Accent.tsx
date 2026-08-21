import type { ReactNode } from "react";

// Inline accent-color span for bicolor headlines (Commit Log reference) —
// e.g. <h2>SYS_<Accent>STATS</Accent></h2>. Used sparingly, only on the
// section-name display headings.
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-accent">{children}</span>;
}
