"use client";

// Sets --spot-x / --spot-y CSS custom properties from pointer position,
// paired with the .spotlight class in globals.css. Import and spread the
// returned handler onto any element with className="spotlight ...".

export function useSpotlight() {
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };
  return { onPointerMove };
}
