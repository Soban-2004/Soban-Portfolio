"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // The adjacent mail/phone link remains available when clipboard access is blocked.
    }
  };

  return (
    <span className="inline-flex items-center align-middle">
      <button
        type="button"
        onClick={onClick}
        aria-label={`Copy ${label}`}
        className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-accent/10 hover:text-accent active:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${label} copied` : ""}
      </span>
      <span className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2">
        <span
          aria-hidden={!copied}
          className={`t-toast block whitespace-nowrap rounded-md border border-accent/50 bg-surface px-4 py-3 font-mono text-xs font-bold uppercase tracking-wide text-accent shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)] ${copied ? "is-open" : ""}`}
        >
          ✓ {label} copied
        </span>
      </span>
    </span>
  );
}
