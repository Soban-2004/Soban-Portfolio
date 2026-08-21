import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/shared/BrandIcons";
import { TagChip } from "@/components/shared/TagChip";
import { TerminalPanel } from "@/components/shared/TerminalPanel";
import { Reveal } from "@/components/shared/Reveal";
import type { Project } from "@/lib/content";

export type ProjectVariant = "flagship" | "alert" | "standard";

const CONTAINER: Record<ProjectVariant, string> = {
  flagship: "border-accent bg-accent text-background",
  alert: "border-critical bg-background",
  standard: "border-surface-border bg-background",
};

export function ProjectCard({
  project,
  category,
  variant = "standard",
  terminalLines,
  className = "",
  fixedHeight = false,
}: {
  project: Project;
  category: string;
  variant?: ProjectVariant;
  terminalLines?: string[];
  className?: string;
  // Used by the horizontal scroll-slide (all four project variants need to
  // be the exact same footprint so the slide track doesn't jump in height
  // card to card). The stacked fallback layout doesn't need this — natural
  // height reads fine when cards are just listed vertically.
  fixedHeight?: boolean;
}) {
  const isFlagship = variant === "flagship";
  const linkHref = project.caseStudyRoute ?? project.githubUrl ?? "#";
  const isInternal = !!project.caseStudyRoute;
  const mutedText = isFlagship ? "text-background/70" : "text-muted";

  const cardClassName = `scroll-mt-24 flex flex-col rounded-md border p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_36px_-12px_rgba(62,207,142,0.45)] active:-translate-y-1 active:shadow-[0_12px_36px_-12px_rgba(62,207,142,0.45)] sm:p-6 ${CONTAINER[variant]} ${isFlagship ? "hover:border-accent-soft active:border-accent-soft" : "hover:border-accent/60 active:border-accent/60"} ${fixedHeight ? "h-[480px]" : ""} ${className}`;

  const content = (
    <>
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
        <p className={`font-mono text-xs uppercase tracking-wide ${mutedText}`}>{category}</p>
        <div className="flex flex-wrap justify-end gap-1.5">
          {project.techTags.slice(0, 3).map((tag, i) => (
            <TagChip key={tag} label={tag} filled={!isFlagship && i === 0} onLight={isFlagship} />
          ))}
        </div>
      </div>

      {/* Card chrome (padding/title/description/image area/fixed height)
          sized down ~20% across the board per feedback — footer buttons
          and tags kept at their existing size since those are touch
          targets (min-h-11), not just decorative scale. */}
      <h3
        className={`mt-3 line-clamp-2 shrink-0 text-3xl uppercase leading-tight sm:text-4xl ${isFlagship ? "text-background" : "text-foreground"}`}
      >
        {project.name}
      </h3>
      {/* shrink-0 + min-h reserving the full 4-line clamp height: inside a
          fixed-height flex column (the pinned slider's fixedHeight cards),
          a longer description (fitnova, the agentic RAG chatbot) pushed
          total content past the card height, and a flex item with
          overflow:hidden (line-clamp sets that) is exactly the one flexbox
          is allowed to shrink below its content size — so it was losing
          part of its 4th line to the squeeze instead of the image/footer
          giving way. Reserving the height up front stops that. */}
      <p className={`mt-2 line-clamp-4 min-h-[5rem] shrink-0 max-w-2xl text-pretty text-sm ${mutedText}`}>
        {project.description}
      </p>

      <div className="mt-4 flex h-40 shrink-0 max-w-md items-center justify-center overflow-hidden">
        {project.screenshot ? (
          <div className="h-full w-full overflow-hidden rounded-md border border-surface-border">
            <Image
              src={project.screenshot.src}
              alt={project.screenshot.alt}
              width={project.screenshot.width}
              height={project.screenshot.height}
              className="h-full w-full object-cover"
              sizes="480px"
            />
          </div>
        ) : terminalLines ? (
          <div className="w-full max-w-lg">
            <TerminalPanel title={`${project.id}.log`} accent={variant === "alert" ? "border-critical" : "border-surface-border"}>
              {terminalLines.map((line) => (
                <p key={line} className="font-mono text-xs text-success">
                  {line}
                </p>
              ))}
            </TerminalPanel>
          </div>
        ) : (
          <div className="grid w-full grid-cols-2 gap-3">
            <div className={`rounded-md border p-3 ${isFlagship ? "border-background/30" : "border-surface-border"}`}>
              <p className={`font-mono text-xl font-black ${isFlagship ? "text-background" : "text-accent"}`}>
                {project.headlineStat.value}
              </p>
              <p className={`mt-0.5 font-mono text-[10px] uppercase ${mutedText}`}>{project.headlineStat.label}</p>
            </div>
            <div className={`rounded-md border p-3 ${isFlagship ? "border-background/30" : "border-surface-border"}`}>
              <p className={`font-mono text-xl font-black ${isFlagship ? "text-background" : "text-foreground"}`}>
                {project.techTags.length}
              </p>
              <p className={`mt-0.5 font-mono text-[10px] uppercase ${mutedText}`}>Technologies</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5">
        {isInternal ? (
          <Link
            href={linkHref}
            className={`underline-hover inline-flex min-h-11 items-center gap-1.5 font-mono text-sm font-medium ${isFlagship ? "text-background" : "text-accent"}`}
          >
            VIEW_CASE_STUDY <ArrowUpRight size={14} />
          </Link>
        ) : (
          <a
            href={linkHref}
            className={`underline-hover inline-flex min-h-11 items-center gap-1.5 font-mono text-sm font-medium ${isFlagship ? "text-background" : "text-accent"}`}
          >
            VIEW_REPO <ArrowUpRight size={14} />
          </a>
        )}
        {project.liveUrl && (
          // A filled pill at rest, red/critical (per explicit prior
          // request); hover/tap inverts to an outlined pill — transparent
          // fill, critical border + text — the same "opposite colors on
          // hover" treatment as HIRE()/CONTACT() elsewhere on the site.
          // border-2 border-critical stays constant across both states so
          // the swap is a pure fill/text-color flip, not a shape change.
          <a
            href={project.liveUrl}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-critical bg-critical px-3 py-1.5 font-mono text-sm font-bold uppercase tracking-wide text-background transition-colors duration-150 hover:bg-transparent hover:text-critical active:bg-transparent active:text-critical"
          >
            LIVE_LINK <ExternalLink size={14} />
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            aria-label={`${project.name} on GitHub`}
            className={`ml-auto flex h-11 w-11 items-center justify-center ${mutedText} transition-colors duration-150 hover:opacity-70`}
          >
            <GitHubIcon size={18} />
          </a>
        )}
      </div>
    </>
  );

  // Reveal (scroll-triggered fade+rise) only wraps the stacked/mobile
  // layout. The pinned desktop slider's cards are inside a `sticky`
  // horizontally scroll-jacked track — they don't scroll into view
  // vertically the way a normal card does, and already get their own
  // Framer Motion scale/opacity treatment tied to slide index, so
  // stacking a second scroll-triggered animation on top of that would be
  // fighting a system that doesn't apply here rather than complementing it.
  if (fixedHeight) {
    return (
      <article id={project.id} className={cardClassName}>
        {content}
      </article>
    );
  }

  return (
    <Reveal as="article" id={project.id} className={cardClassName} y={20}>
      {content}
    </Reveal>
  );
}
