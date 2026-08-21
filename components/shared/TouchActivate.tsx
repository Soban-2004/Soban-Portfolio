"use client";

import { useEffect } from "react";

// iOS Safari has a long-standing quirk: it only matches the `:active`
// pseudo-class on an element if that element (or an ancestor) has some kind
// of touch/click listener attached — plain non-form, non-link elements
// like the stat/project/paper cards elsewhere on this site otherwise never
// see `:active` on a tap at all, silently no-opping every `active:` variant
// added as the touch equivalent of their hover lift/glow. One passive,
// no-op, document-level touchstart listener is the standard fix for this:
// its mere presence satisfies iOS's requirement globally, so every
// element's own `active:` Tailwind utilities actually fire, without having
// to wire up a listener on every individual card.
export function TouchActivate() {
  useEffect(() => {
    document.addEventListener("touchstart", () => {}, { passive: true });
  }, []);

  return null;
}
