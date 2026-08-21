import { Fragment } from "react";

// Wraps number-like tokens (60–70%, 20+, 2,000+) in an accent span — the
// inline bold-highlighted-metric pattern from the Commit Log reference,
// applied to Soban's real bullet text rather than fabricated ones.
const NUMBER_PATTERN = /(~?\d[\d,]*(?:[–-]\d[\d,]*)?\+?%?)/g;

export function highlightNumbers(text: string) {
  // A regex.split() with one capturing group alternates [text, match, text,
  // match, ...] — odd indices are always the captured matches, so there's
  // no need to re-test each part (re-testing a `g`-flagged regex via .test()
  // in a loop is stateful and unreliable; splitting sidesteps that).
  const parts = text.split(NUMBER_PATTERN);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-bold text-accent">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
