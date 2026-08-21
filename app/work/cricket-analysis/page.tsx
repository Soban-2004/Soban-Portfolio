import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GitHubIcon } from "@/components/shared/BrandIcons";
import { Button } from "@/components/shared/Button";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { ArchitectureDiagram, type DiagramNode } from "@/components/shared/ArchitectureDiagram";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "End-to-End Cricket Data Analysis — Soban Shankar",
  description:
    "How ICC Men's T20 World Cup 2024 data was scraped, processed, and turned into a 7-page interactive Power BI dashboard — the earliest project in the portfolio, not an AI system.",
};

const project = projects.find((p) => p.id === "cricket-analysis")!;

// Not a RAG/LLM pipeline like the other case studies — a plain data
// pipeline, kept in the same page structure for consistency. Genuinely the
// earliest, least AI-flavored project here; presented as such.
const PIPELINE: DiagramNode[] = [
  { id: "scrape", label: "Scrape — ESPN Cricinfo", detail: "ICC Men's T20 World Cup 2024 match data scraped with BeautifulSoup." },
  { id: "process", label: "Process — Pandas", detail: "Raw match statistics cleaned and analyzed with Python + Pandas." },
  { id: "dashboard", label: "Dashboard — Power BI", detail: "Assembled into a 7-page interactive dashboard: Overall Tournament Analysis, Player Analysis (Openers, Middle Order, Finishers, All-Rounders, Bowlers), and a data-driven \"Final 11 (Best XI)\" of the tournament." },
];

const GALLERY: { src: string; alt: string; width: number; height: number }[] = [
  { src: "/projects/cricket-overall.png", alt: "Overall Tournament Analysis dashboard page", width: 1186, height: 669 },
  { src: "/projects/cricket-bowlers.png", alt: "Bowler performance analysis dashboard page", width: 959, height: 539 },
  { src: "/projects/cricket-middle-order.png", alt: "Middle-order batter analysis dashboard page", width: 964, height: 539 },
  { src: "/projects/cricket-final-11.png", alt: "Data-driven Final 11 (Best XI) dashboard page", width: 957, height: 540 },
];

export default function CricketAnalysisPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <ScrollProgress />
      <Link
        href="/#project=cricket-analysis"
        className="inline-flex min-h-11 items-center gap-1.5 font-mono text-sm text-muted transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to work
      </Link>

      <p className="mt-8 font-mono text-sm text-accent-soft">Case Study — Earlier Work</p>
      <h1 className="font-display-3d mt-2 text-balance text-2xl leading-[1.4] text-foreground sm:text-3xl">
        End-to-End Cricket Data Analysis
      </h1>
      <p className="mt-3 font-mono text-sm text-muted">{project.period}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.githubUrl && (
          <Button href={project.githubUrl} variant="secondary">
            <GitHubIcon size={16} /> GitHub
          </Button>
        )}
      </div>

      {/* 1. Overview */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Overview</h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
          The earliest project in this portfolio — no LLMs, no retrieval, just a real end-to-end data pipeline:
          scrape, clean, analyze, and turn match data into a dashboard someone could actually use to argue about
          who deserved a place in the tournament&apos;s best XI. Included as range, not as the AI focus.
        </p>
      </section>

      {/* 2. Architecture */}
      <section className="mt-16">
        <h2 className="font-mono text-sm text-accent-soft">Architecture</h2>
        <p className="mt-4 text-muted">Raw match pages in, a 7-page interactive dashboard out.</p>
        <div className="mt-8">
          <ArchitectureDiagram nodes={PIPELINE} />
        </div>
      </section>

      {/* 3. Dashboard gallery */}
      <section className="mt-8">
        <h2 className="font-mono text-sm text-accent-soft">Dashboard Pages</h2>
        <p className="mt-4 text-muted">4 of the 7 pages, straight from the actual Power BI file.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {GALLERY.map((shot) => (
            <div key={shot.src} className="overflow-hidden rounded-md border border-surface-border">
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                className="h-auto w-full"
                sizes="(min-width: 640px) 340px, 100vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Tech stack */}
      <section className="mt-16 border-t border-surface-border pt-10">
        <h2 className="font-mono text-sm text-accent-soft">Tech Stack</h2>
        <p className="mt-4 font-mono text-sm text-muted">{project.techTags.join(" · ")}</p>
      </section>
    </main>
  );
}
