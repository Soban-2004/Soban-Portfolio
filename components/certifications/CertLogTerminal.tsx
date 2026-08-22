"use client";

// The CERT_LOG section's actual content — a real command/output panel
// built on the site's existing TerminalPanel chrome (not a new frame),
// styled and colored with the site's real accent token throughout, not an
// invented one. Collapsed state shows the first 5 credentials as if
// `cat credentials.log` had just run; clicking the `$ cert_log --all`
// line plays out like a real command executing — echoed, "fetching",
// then the remaining rows streaming in one at a time — never an instant
// swap and never a full character-by-character typewriter of the
// credential data itself (slow and gimmicky for real content; the
// typewriter treatment is reserved for the two short synthetic lines,
// the command and the "fetching" status).

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { TerminalPanel } from "@/components/shared/TerminalPanel";
import { certifications, type Certification } from "@/lib/content";

const COLLAPSED_COUNT = 5;
const COMMAND_TEXT = "$ cert_log --all";
const COLLAPSE_TEXT = "$ cert_log --collapse";
const FETCH_TEXT = "Fetching remaining credentials...";
const TYPE_SPEED_COMMAND = 26; // ms/char — short line, reads as deliberate keystrokes
const TYPE_SPEED_FETCH = 14; // ms/char — longer line, faster or the pause drags
const ROW_STAGGER_MS = 130;

// Both the "run this" and "undo this" commands share one visual treatment
// — a real bordered/filled control, not plain inline text with a hover
// nudge — so either one reads immediately as something you can click, not
// just more terminal output to skim past.
const CMD_BUTTON =
  "group mt-2 inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/5 px-2.5 py-1.5 text-foreground transition-colors duration-150 hover:border-accent hover:bg-accent/10 hover:text-accent active:border-accent active:bg-accent/10 active:text-accent";

type Phase = "collapsed" | "typingCommand" | "typingFetch" | "streaming" | "done";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Minimal typewriter: reveals `text` one character at a time while
// `active`, resets to empty when deactivated. `done` flips true exactly
// once the full string is showing, which the phase state machine below
// watches to advance to the next step.
function useTypewriter(text: string, active: boolean, speed: number) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setOut("");
      setDone(false);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, active, speed]);

  return { out, done };
}

function CertRow({ cert, index }: { cert: Certification; index: number }) {
  const titleEl = (
    <span className="inline-flex items-center gap-1.5 text-foreground group-hover:text-foreground">
      {cert.name}
      {cert.verifyUrl && (
        <ExternalLink size={11} className="shrink-0 text-muted/60 group-hover:text-accent" aria-hidden="true" />
      )}
    </span>
  );

  return (
    <div
      className="group -ml-2 flex gap-3 border-l-2 border-transparent py-2 pl-2 font-mono text-xs transition-[border-color,background-color,transform] duration-200 ease-out hover:border-accent hover:bg-foreground/[0.03] hover:translate-x-0.5 active:border-accent active:bg-foreground/[0.03] active:translate-x-0.5"
    >
      <span className="shrink-0 text-muted/50" aria-hidden="true">
        {pad(index + 1)}
      </span>
      <span className="shrink-0 text-accent" aria-hidden="true">
        ✓
      </span>
      <div className="min-w-0">
        {cert.verifyUrl ? (
          <a href={cert.verifyUrl} target="_blank" rel="noreferrer noopener" className="underline-hover">
            {titleEl}
          </a>
        ) : (
          titleEl
        )}
        <p className="mt-0.5 text-[11px] text-muted">
          {cert.issuer}
          {cert.detail && <> · {cert.detail}</>}
        </p>
        {cert.items && (
          <ul className="mt-1.5 space-y-1">
            {cert.items.map((item) => (
              <li key={item} className="flex gap-2 text-[11px] text-muted/80">
                <span className="text-accent/60">·</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function CertLogTerminal() {
  const prefersReducedMotion = useReducedMotion();
  const total = certifications.length;
  const remaining = total - COLLAPSED_COUNT;
  const visible = certifications.slice(0, COLLAPSED_COUNT);
  const rest = certifications.slice(COLLAPSED_COUNT);

  const [phase, setPhase] = useState<Phase>("collapsed");
  const [streamedCount, setStreamedCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cmdTyper = useTypewriter(COMMAND_TEXT, phase === "typingCommand", TYPE_SPEED_COMMAND);
  const fetchTyper = useTypewriter(FETCH_TEXT, phase === "typingFetch", TYPE_SPEED_FETCH);

  const expand = () => {
    if (phase !== "collapsed") return;
    if (prefersReducedMotion) {
      // Functional reveal without the decorative sequencing — every
      // effect below is purely cosmetic (typewriter pacing, stagger),
      // so under reduced motion this jumps straight to the end state
      // with everything already visible.
      setStreamedCount(remaining);
      setPhase("done");
      return;
    }
    setPhase("typingCommand");
  };

  // The reverse of expand(): back to the 5-row view, no re-play of the
  // reveal sequence on the way down — that sequence is there to sell
  // "fetching more," which doesn't apply to going back to fewer.
  const collapse = () => {
    if (phase !== "done") return;
    setStreamedCount(0);
    setPhase("collapsed");
  };

  // Phase chain: command types out -> brief pause -> "fetching" types
  // out -> brief pause -> rows stream in one at a time -> done. Each step
  // only advances once the previous one's typewriter/stagger genuinely
  // finished, not on a fixed total timer, so it stays correct even if
  // `remaining` changes as more certs get added later.
  useEffect(() => {
    if (phase !== "typingCommand" || !cmdTyper.done) return;
    const t = window.setTimeout(() => setPhase("typingFetch"), 200);
    return () => window.clearTimeout(t);
  }, [phase, cmdTyper.done]);

  useEffect(() => {
    if (phase !== "typingFetch" || !fetchTyper.done) return;
    const t = window.setTimeout(() => setPhase("streaming"), 250);
    return () => window.clearTimeout(t);
  }, [phase, fetchTyper.done]);

  useEffect(() => {
    if (phase !== "streaming") return;
    if (streamedCount >= remaining) {
      const t = window.setTimeout(() => setPhase("done"), 200);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStreamedCount((c) => c + 1), ROW_STAGGER_MS);
    return () => window.clearTimeout(t);
  }, [phase, streamedCount, remaining]);

  // Auto-scroll to the latest output while the sequence is actively
  // producing new lines — a real terminal keeps new output in view. Does
  // NOT exclude the transition into "done": that final render is what
  // adds the "N credentials loaded" footer below the last streamed row,
  // and skipping it left that footer (and the reduced-motion path, which
  // jumps straight from "collapsed" to "done" with no intermediate
  // streaming step to have scrolled during) permanently out of view
  // unless the visitor happened to scroll down manually. This still only
  // fires on the specific renders where phase/typed-text/streamedCount
  // actually change, not continuously — so it doesn't fight a visitor
  // scrolling manually once those stop changing (i.e. once genuinely done).
  useEffect(() => {
    if (phase === "collapsed") return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [phase, cmdTyper.out, fetchTyper.out, streamedCount]);

  return (
    <TerminalPanel title="cert_log --list">
      {/* max-h + its own scroll: the whole point of streaming certs into
          a terminal is that the terminal handles overflow the way a real
          one does — scrolling in place — rather than the page growing
          taller with every credential added in the future. Comfortably
          fits the 5-row collapsed state with room to spare; only the
          expanded state (9+ rows, growing over time) actually needs the
          scroll. terminal-scroll: a thin, low-contrast scrollbar defined
          in globals.css instead of each browser's default chrome one. */}
      <div ref={scrollRef} className="terminal-scroll max-h-[400px] overflow-y-auto font-mono text-xs sm:max-h-[460px]">
        <p className="text-foreground">$ cat credentials.log</p>

        <div className="my-3 border-t border-surface-border" aria-hidden="true" />

        <div>
          {visible.map((cert, i) => (
            <CertRow key={cert.name} cert={cert} index={i} />
          ))}
        </div>

        {phase === "collapsed" && remaining > 0 && (
          <button type="button" onClick={expand} className={CMD_BUTTON}>
            {COMMAND_TEXT}
            <span className="cert-log-cursor text-accent" aria-hidden="true">
              ▌
            </span>
            <span className="sr-only"> — show all {total} credentials</span>
          </button>
        )}

        {phase !== "collapsed" && (
          <div>
            <p className="text-foreground">
              {phase === "typingCommand" ? cmdTyper.out : COMMAND_TEXT}
              {phase === "typingCommand" && <span className="cert-log-cursor text-accent">▌</span>}
            </p>

            {(phase === "typingFetch" || phase === "streaming" || phase === "done") && (
              <p className="mt-2 text-muted">
                {phase === "typingFetch" ? fetchTyper.out : FETCH_TEXT}
                {phase === "typingFetch" && <span className="cert-log-cursor text-accent">▌</span>}
              </p>
            )}

            {(phase === "streaming" || phase === "done") && (
              <div className="mt-2">
                {rest.slice(0, phase === "done" ? rest.length : streamedCount).map((cert, i) => (
                  <div key={cert.name} className="cert-row-stream-in">
                    <CertRow cert={cert} index={COLLAPSED_COUNT + i} />
                  </div>
                ))}
              </div>
            )}

            {phase === "done" && (
              <>
                <div className="my-3 border-t border-surface-border" aria-hidden="true" />
                <p className="text-foreground">✓ {pad(total)} credentials loaded</p>
                <p className="mt-1 text-accent-soft">
                  STATUS: <span className="text-foreground">VERIFIED</span>
                </p>
                <button type="button" onClick={collapse} className={CMD_BUTTON}>
                  {COLLAPSE_TEXT}
                  <span className="cert-log-cursor text-accent" aria-hidden="true">
                    ▌
                  </span>
                  <span className="sr-only"> — show fewer credentials</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </TerminalPanel>
  );
}
