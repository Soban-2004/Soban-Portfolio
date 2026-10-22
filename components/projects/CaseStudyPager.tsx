import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects } from "@/lib/content";

const caseStudies = projects.filter((project) => project.caseStudyRoute);

export function CaseStudyPager({ currentId }: { currentId: string }) {
  const currentIndex = caseStudies.findIndex((project) => project.id === currentId);
  if (currentIndex === -1 || caseStudies.length < 2) return null;

  const previous = caseStudies[(currentIndex - 1 + caseStudies.length) % caseStudies.length];
  const next = caseStudies[(currentIndex + 1) % caseStudies.length];

  return (
    <nav aria-label="More case studies" className="mt-20 grid gap-3 border-t border-surface-border pt-8 sm:grid-cols-2">
      <Link
        href={previous.caseStudyRoute!}
        transitionTypes={["nav-back"]}
        className="group flex min-h-[88px] flex-col justify-center rounded-lg border border-surface-border px-5 py-4 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-muted">
          <ArrowLeft size={13} className="transition-transform duration-200 group-hover:-translate-x-1" /> Previous project
        </span>
        <span className="mt-2 text-sm font-semibold text-foreground">{previous.name}</span>
      </Link>
      <Link
        href={next.caseStudyRoute!}
        transitionTypes={["nav-forward"]}
        className="group flex min-h-[88px] flex-col items-end justify-center rounded-lg border border-surface-border px-5 py-4 text-right transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-muted">
          Next project <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
        <span className="mt-2 text-sm font-semibold text-foreground">{next.name}</span>
      </Link>
    </nav>
  );
}
