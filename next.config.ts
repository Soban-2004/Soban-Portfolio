import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js's own on-screen route indicator (the "N" badge, bottom-left) —
  // dev-only, never rendered in a production build/real deploy, but shows
  // up while running `next dev` locally. Turned off per request; it still
  // surfaces compile/runtime errors regardless of this setting, per Next's
  // own docs — this only hides the route-status badge itself.
  devIndicators: false,
};

export default nextConfig;
