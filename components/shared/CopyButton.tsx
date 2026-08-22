"use client";

// A small inline copy-to-clipboard control, meant to sit right after a
// piece of text someone's actually going to want to paste (an email
// address, a phone number) rather than read and retype. The mailto:/tel:
// link next to it still works exactly as before — this doesn't replace
// that, it's a faster path for the more common case (copy it, paste it
// somewhere) that used to mean select-and-copy by hand.

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable or permission denied (rare, but real —
      // some browser/embed contexts block it) — the link right next to
      // this button is still a working fallback, so this just quietly
      // does nothing rather than showing a broken "copied" state.
    }
  };

  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <button
        type="button"
        onClick={onClick}
        aria-label={`Copy ${label}`}
        className="inline-flex items-center text-muted transition-colors duration-150 hover:text-accent active:text-accent"
      >
        {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
      </button>
      {/* aria-live, not just a visual swap — a screen reader user firing
          this from the button itself has no other cue that anything
          happened. role="status" pairs with aria-live="polite" here since
          this is a minor confirmation, not an urgent alert. */}
      <span role="status" aria-live="polite" className="font-mono text-[10px] text-accent">
        {copied ? "✓ copied" : ""}
      </span>
    </span>
  );
}
