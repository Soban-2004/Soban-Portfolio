import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Bungee, Press_Start_2P } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/sections/Footer";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { TouchActivate } from "@/components/shared/TouchActivate";
import { identity } from "@/lib/content";

// "Terminal Signal" theme, four tiers now: Press Start 2P (a genuine 8-bit
// pixel/arcade-terminal face) for the handful of big showpiece headlines,
// pushed into a chunky "coming out of the screen" bulge via a stacked
// text-shadow utility (.font-display-3d in globals.css) — the glyphs
// themselves are flat pixels, the 3D reads through layered shadow depth;
// flat Bungee for smaller headings where the pixel face would turn to mud;
// JetBrains Mono for data/tags/UI chrome; Inter for body prose.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const bungee = Bungee({
  variable: "--font-bungee",
  weight: "400",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
});

const siteUrl = "https://sobanshankar.vercel.app"; // update once a final domain is chosen

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Soban Shankar — AI Engineer",
  description:
    "AI Engineer building production-grade agentic RAG systems, multi-agent orchestration, and retrieval pipelines.",
  openGraph: {
    title: "Soban Shankar — AI Engineer",
    description:
      "AI Engineer building production-grade agentic RAG systems, multi-agent orchestration, and retrieval pipelines.",
    url: siteUrl,
    siteName: "Soban Shankar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soban Shankar — AI Engineer",
    description:
      "AI Engineer building production-grade agentic RAG systems, multi-agent orchestration, and retrieval pipelines.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: identity.role,
  url: siteUrl,
  sameAs: [identity.github, identity.linkedin],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${bungee.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LoadingScreen />
        <AmbientBackground />
        <TouchActivate />
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <CommandPalette />
        <Script
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Vercel Web Analytics — page views + visitor counts, viewable in
            the Vercel dashboard under the project's Analytics tab. Purely
            a beacon on route change (no cookies, nothing rendered), so it
            has no visual/layout footprint here. Only actually collects
            data once this is deployed on Vercel with Analytics enabled for
            the project (a free toggle in the dashboard) — it's a no-op
            locally and on any other host. */}
        <Analytics />
      </body>
    </html>
  );
}
