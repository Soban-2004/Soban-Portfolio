"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/shared/BrandIcons";
import { TagChip } from "@/components/shared/TagChip";
import { TerminalPanel } from "@/components/shared/TerminalPanel";
import { Reveal } from "@/components/shared/Reveal";
import type { Project } from "@/lib/content";

export type ProjectVariant = "flagship" | "alert" | "info" | "standard";

// Four real project cards, four distinct border colors — pulled entirely
// from tokens already in the palette (globals.css), not new colors: accent
// (flagship, FitNova), critical (alert, Flipkart — the "latency" story),
// success/cyan (info, AI Resume Matcher) and amber (standard, Cricket
// Analysis). standard used to share the same near-invisible
// border-surface-border as a "plain" default; now every card reads as its
// own clearly bordered, clearly distinct block instead of two of them
// blending into a generic gray.
const CONTAINER: Record<ProjectVariant, string> = {
  flagship: "border-accent bg-accent text-background",
  alert: "border-critical bg-background",
  info: "border-success bg-background",
  standard: "border-amber bg-background",
};

// Hover/active border + glow shadow now stay within each card's own color
// family instead of every non-flagship card converging on green on hover
// (the old shared "hover:border-accent/60" — a red card hovering to a
// green border read as a mismatch once each variant had its own identity).
const HOVER_BORDER: Record<ProjectVariant, string> = {
  flagship: "hover:border-accent-soft active:border-accent-soft",
  alert: "hover:border-critical/70 active:border-critical/70",
  info: "hover:border-success/70 active:border-success/70",
  standard: "hover:border-amber/70 active:border-amber/70",
};

const HOVER_SHADOW: Record<ProjectVariant, string> = {
  flagship: "hover:shadow-[0_12px_36px_-12px_rgba(62,207,142,0.45)] active:shadow-[0_12px_36px_-12px_rgba(62,207,142,0.45)]",
  alert: "hover:shadow-[0_12px_36px_-12px_rgba(255,59,110,0.45)] active:shadow-[0_12px_36px_-12px_rgba(255,59,110,0.45)]",
  info: "hover:shadow-[0_12px_36px_-12px_rgba(77,184,217,0.45)] active:shadow-[0_12px_36px_-12px_rgba(77,184,217,0.45)]",
  standard: "hover:shadow-[0_12px_36px_-12px_rgba(224,166,62,0.45)] active:shadow-[0_12px_36px_-12px_rgba(224,166,62,0.45)]",
};

// Card-chip-only abbreviations — content.ts's techTags stay full-form
// (that's what the case study pages' own "Tech Stack" line renders, where
// the spelled-out acronym is genuinely useful, and what the "N
// Technologies" stat count is derived from) — this just swaps in a
// shorter label at the one spot, the compact 3-chip row on the card
// itself, that's actually tight on space. Falls through to the original
// string for anything not listed here.
const CARD_TAG_LABEL: Record<string, string> = {
  "RAG (Retrieval-Augmented Generation)": "RAG",
  "MCP (Model Context Protocol)": "MCP",
  "Speech-to-Text (Deepgram)": "STT (Deepgram)",
  "LLM Evaluation / Output Validation": "LLM Evaluation",
};

export function ProjectCard({
  project,
  category,
  variant = "standard",
  terminalLines,
  className = "",
  skipReveal = false,
}: {
  project: Project;
  category: string;
  variant?: ProjectVariant;
  terminalLines?: string[];
  className?: string;
  // The carousel (ProjectsSlider) already owns the enter/exit animation
  // for whichever slide is currently showing (AnimatePresence, scale +
  // opacity) — stacking this card's own Reveal fade-in on top of that
  // would be two competing animations firing on the same mount. Used to
  // also force a fixed 480px height back when this fed a horizontal
  // scroll-jacked track that needed every slide to match; that constraint
  // is gone now that only one card is ever in the DOM at a time, so this
  // is purely about which component owns the entrance animation.
  skipReveal?: boolean;
}) {
  const isFlagship = variant === "flagship";
  const linkHref = project.caseStudyRoute ?? project.githubUrl ?? "#";
  const isInternal = !!project.caseStudyRoute;
  const mutedText = isFlagship ? "text-background/70" : "text-muted";

  // Read-more for the description: line-clamp-4 always looked fine on a
  // roomy card, but the same clamp on FitNova's longer description — the
  // longest of the four — cut off mid-sentence with "..." and gave no way
  // to see the rest. Safe to expand in place at any size now: nothing
  // downstream requires every card to share one exact height any more
  // (see skipReveal above), so a card growing when expanded just pushes
  // whatever's below it, the same as any accordion.
  const descRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = descRef.current;
      if (!el) return;
      // Only meaningful while still clamped — once expanded the element's
      // own scrollHeight/clientHeight are equal by definition.
      if (!expanded) setIsTruncated(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [expanded, project.description]);

  // Every dimension below scales down by roughly the same ~0.67 factor
  // from its sm: (desktop) value — padding, title, image block, button
  // size all shrink together, so the mobile card reads as the same card
  // at a smaller size, not a differently-proportioned "compacted" layout
  // with laptop-sized buttons/text crammed into less padding.
  // rounded-xl (was rounded-md): matches the --radius token already
  // defined in globals.css (0.75rem) but never actually wired to a card
  // anywhere — the softer corner was the original intent, this just
  // catches the card up to it.
  const cardClassName = `scroll-mt-24 flex flex-col rounded-xl border p-4 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 active:-translate-y-1 ${CONTAINER[variant]} ${HOVER_BORDER[variant]} ${HOVER_SHADOW[variant]} sm:p-6 ${className}`;

  const content = (
    <>
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-2 sm:gap-3">
        <p className={`font-mono text-xs uppercase tracking-wide ${mutedText}`}>{category}</p>
        <div className="flex flex-wrap justify-end gap-1.5">
          {project.techTags.slice(0, 3).map((tag, i) => (
            <TagChip key={tag} label={CARD_TAG_LABEL[tag] ?? tag} filled={!isFlagship && i === 0} onLight={isFlagship} />
          ))}
        </div>
      </div>

      {/* text-2xl base (was text-3xl): Press Start 2P is a wide, fixed-
          width-feeling pixel face — at 3xl in a phone-width card, real
          multi-word titles ("Agentic RAG Customer Support Platform",
          "FitNova — AI Sales-Call Intelligence System") fit no more than
          1-2 words per line before the 2-line clamp cut them off entirely.
          Dropped one step for the base (<sm, real phones) only; sm:text-4xl
          is untouched so tablet/laptop/desktop render exactly as before. */}
      <h3
        className={`mt-2 line-clamp-2 shrink-0 text-2xl uppercase leading-tight sm:mt-3 sm:text-4xl ${isFlagship ? "text-background" : "text-foreground"}`}
      >
        {project.name}
      </h3>
      {/* Two different pieces of copy, not one clamped to two sizes — a
          line-clamped substring of `description` reads fine in full but
          turns into an unhelpful fragment cut mid-pipeline-step at 2 lines
          ("Pipeline: query → dense + BM25 retrieval →..." and nothing
          else). shortDescription is a purpose-written, plain-language
          "what is this" sentence instead, written to actually fit 1-2
          lines — a real one-liner, not a truncation. */}
      <p className={`mt-1.5 shrink-0 max-w-2xl text-pretty text-xs sm:hidden ${mutedText}`}>{project.shortDescription}</p>
      {/* sm+ (real width to spare) keeps the fuller, more technical
          description at its original size — shrink-0 + min-h reserves the
          clamp height so the flex column can't squeeze a line off; once
          expanded both the clamp and the reservation drop, and the
          paragraph just takes whatever height its full text needs. */}
      <p
        ref={descRef}
        className={`mt-1.5 hidden shrink-0 max-w-2xl text-pretty text-sm sm:mt-2 sm:block ${
          expanded ? "" : "sm:line-clamp-4 sm:min-h-[5rem]"
        } ${mutedText}`}
      >
        {project.description}
      </p>
      {/* Read more/less: sm+ only. On mobile the 2-line teaser is a
          deliberate design choice (full detail is one tap away via
          VIEW_CASE_STUDY/VIEW_REPO below), not an accidental truncation
          that needs its own workaround — so this stays hidden there even
          though isTruncated is almost always true for a 2-line clamp on a
          full paragraph. */}
      {(isTruncated || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`mt-1 hidden shrink-0 items-center gap-1 self-start font-mono text-xs font-medium underline-hover sm:inline-flex ${isFlagship ? "text-background" : "text-accent"}`}
        >
          {expanded ? "Read less" : "Read more"}
          <ChevronDown size={12} className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}

      <div className="mt-3 flex h-28 shrink-0 max-w-md items-center justify-center overflow-hidden sm:mt-4 sm:h-40">
        {project.screenshot ? (
          <div className="h-full w-full overflow-hidden rounded-lg border border-surface-border">
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
          <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">
            <div className={`rounded-lg border p-2 sm:p-3 ${isFlagship ? "border-background/30" : "border-surface-border"}`}>
              <p className={`font-mono text-base font-black sm:text-xl ${isFlagship ? "text-background" : "text-accent"}`}>
                {project.headlineStat.value}
              </p>
              <p className={`mt-0.5 font-mono text-[9px] uppercase sm:text-[10px] ${mutedText}`}>{project.headlineStat.label}</p>
            </div>
            <div className={`rounded-lg border p-2 sm:p-3 ${isFlagship ? "border-background/30" : "border-surface-border"}`}>
              <p className={`font-mono text-base font-black sm:text-xl ${isFlagship ? "text-background" : "text-foreground"}`}>
                {project.techTags.length}
              </p>
              <p className={`mt-0.5 font-mono text-[9px] uppercase sm:text-[10px] ${mutedText}`}>Technologies</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-3 sm:gap-x-5 sm:pt-5">
        {isInternal ? (
          <Link
            href={linkHref}
            className={`underline-hover inline-flex min-h-9 items-center gap-1.5 font-mono text-xs font-medium sm:min-h-11 sm:text-sm ${isFlagship ? "text-background" : "text-accent"}`}
          >
            VIEW_CASE_STUDY <ArrowUpRight size={12} className="sm:size-3.5" />
          </Link>
        ) : (
          <a
            href={linkHref}
            className={`underline-hover inline-flex min-h-9 items-center gap-1.5 font-mono text-xs font-medium sm:min-h-11 sm:text-sm ${isFlagship ? "text-background" : "text-accent"}`}
          >
            VIEW_REPO <ArrowUpRight size={12} className="sm:size-3.5" />
          </a>
        )}
        {project.liveUrl && (
          // A filled pill at rest, red/critical (per explicit prior
          // request); hover/tap inverts to an outlined pill — transparent
          // fill, critical border + text — the same "opposite colors on
          // hover" treatment as HIRE()/CONTACT() elsewhere on the site.
          // border-2 border-critical stays constant across both states so
          // the swap is a pure fill/text-color flip, not a shape change.
          // Scaled down to match Button.tsx's mobile size (min-h-9/text-xs)
          // rather than sitting at its laptop size in an otherwise-shrunk
          // card.
          <a
            href={project.liveUrl}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md border-2 border-critical bg-critical px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wide text-background transition-colors duration-150 hover:bg-transparent hover:text-critical active:bg-transparent active:text-critical sm:min-h-11 sm:px-3 sm:py-1.5 sm:text-sm"
          >
            LIVE_LINK <ExternalLink size={12} className="sm:size-3.5" />
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            aria-label={`${project.name} on GitHub`}
            className={`ml-auto flex h-9 w-9 items-center justify-center sm:h-11 sm:w-11 ${mutedText} transition-colors duration-150 hover:opacity-70`}
          >
            <GitHubIcon size={16} className="sm:size-[18px]" />
          </a>
        )}
      </div>
    </>
  );

  // See skipReveal's own comment above — the carousel already animates
  // whichever card is showing, so it renders a plain <article> here
  // instead of double-wrapping it in another scroll-triggered Reveal.
  if (skipReveal) {
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
