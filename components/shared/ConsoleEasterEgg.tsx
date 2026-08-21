"use client";

// Tasteful, optional console easter egg (IMPLEMENTATION.md §4.9). Never
// surfaced in the UI, doesn't affect layout or interaction.

import { useEffect } from "react";

export function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(
      "%c  o---o---o---o  \n retrieve reason verify act",
      "color:#3ECF8E;font-family:monospace;"
    );
    console.log(
      "%c// this console.log passed schema validation. unlike some LLM outputs.",
      "color:#96A395;font-family:monospace;"
    );
  }, []);

  return null;
}
