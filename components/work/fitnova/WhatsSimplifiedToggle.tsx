"use client";

// "What's real vs. simplified" (IMPLEMENTATION.md §4.3) — honest engineering
// communication straight from the FitNova README, not spin. Simple
// disclosure, no animation dependency for comprehension.

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ITEMS = [
  "Advisor identity is asserted metadata, not a verified voiceprint — nothing cross-checks that the voice on a call actually matches the named advisor.",
  "Audio storage is local disk plus a durable Backblaze B2 backup, not local-disk-only — but Render's filesystem is still ephemeral, and B2 itself is best-effort (any failure just leaves the backup field null and the call proceeds as if it wasn't there).",
  "The SSE broadcaster and the in-memory upload-progress map are both single-process — fine on a single Render instance, but neither survives running more than one.",
  "There's no real telephony adapter yet — the Upload page is a deliberate stand-in for what a telephony webhook would do automatically.",
  "Score history before deployment week is clearly-flagged synthetic seed data (source_system=\"seed_backfill\"), not real call history — random noise around each call's real score, not an invented trend.",
];

export function WhatsSimplifiedToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-amber/25 bg-amber/5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="font-mono text-sm font-medium text-amber">What&apos;s real vs. what&apos;s simplified</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-amber transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="space-y-2.5 px-5 pb-5">
          {ITEMS.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-muted">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
