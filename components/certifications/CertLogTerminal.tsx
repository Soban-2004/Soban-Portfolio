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
//
// Collapsing plays the exact same sequence back in reverse instead of
// just snapping to the 5-row view: the extra rows disappear one at a
// time (fastest first, since a real backspace held down accelerates),
// then the "Fetching..." line erases character by character from the
// end, then the "$ cert_log --all" echo itself erases the same way —
// genuinely deleting, not fading — before the collapsed view (and the
// --all button) reappears. That's the literal ask this reversed the
// original design for: "animate like the cursor is pressed backspace
// continually."

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
const BACKSPACE_SPEED_MS = 10; // ms/char — a held-down backspace auto-repeats faster than anyone actually types
const ROW_STAGGER_MS = 130;
const ROW_ERASE_STAGGER_MS = 90; // quicker than the reveal's stagger — clearing rows away reads best a little brisker than streaming them in

// Both the "run this" and "undo this" commands share one visual treatment
// — a real bordered/filled control, not plain inline text with a hover
// nudge — so either one reads immediately as something you can click, not
// just more terminal output to skim past.
const CMD_BUTTON =
  "group mt-2 inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/5 px-2.5 py-1.5 text-foreground transition-colors duration-150 hover:border-accent hover:bg-accent/10 hover:text-accent active:border-accent active:bg-accent/10 active:text-accent";

type Phase =
  | "collapsed"
  | "typingCommand"
  | "typingFetch"
  | "streaming"
  | "done"
  // The reverse chain collapse() plays — same three steps as above, run
  // backward: rows erase one at a time, then the fetch line backspaces
  // to nothing, then the command echo backspaces to nothing, landing
  // back on "collapsed".
  | "streamingOut"
  | "typingFetchOut"
  | "typingCommandOut";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Typewriter in either direction: "forward" reveals `text` one character
// at a time from empty (the original behavior); "backward" starts at the
// full string and erases it from the end, one character at a time — the
// actual "held-down backspace" effect. `done` flips true exactly once
// the animation reaches its end state (full text forward, empty text
// backward), which the phase state machine below watches to advance.
// Resets to a fresh starting point whenever deactivated so the next
// activation — in either direction — always begins from the right place
// rather than picking up mid-string.
function useTypewriter(text: string, active: boolean, speed: number, direction: "forward" | "backward" = "forward") {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setOut("");
      setDone(false);
      return;
    }
    let i = direction === "forward" ? 0 : text.length;
    setOut(text.slice(0, i)); // the true starting frame, shown immediately rather than waiting for the first tick
    const id = window.setInterval(() => {
      i += direction === "forward" ? 1 : -1;
      setOut(text.slice(0, i));
      const finished = direction === "forward" ? i >= text.length : i <= 0;
      if (finished) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, active, speed, direction]);

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

  const cmdActive = phase === "typingCommand" || phase === "typingCommandOut";
  const cmdDirection = phase === "typingCommandOut" ? "backward" : "forward";
  const cmdTyper = useTypewriter(
    COMMAND_TEXT,
    cmdActive,
    cmdDirection === "backward" ? BACKSPACE_SPEED_MS : TYPE_SPEED_COMMAND,
    cmdDirection,
  );

  const fetchActive = phase === "typingFetch" || phase === "typingFetchOut";
  const fetchDirection = phase === "typingFetchOut" ? "backward" : "forward";
  const fetchTyper = useTypewriter(
    FETCH_TEXT,
    fetchActive,
    fetchDirection === "backward" ? BACKSPACE_SPEED_MS : TYPE_SPEED_FETCH,
    fetchDirection,
  );

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

  // The reverse of expand() — same three-step sequence, played backward
  // (see the phase chain effects below): erase the streamed rows, then
  // backspace the fetch line, then backspace the command echo, landing
  // back on "collapsed". streamedCount is already sitting at `remaining`
  // from being in "done", so streamingOut's own effect can start
  // decrementing it immediately without this needing to touch it first.
  const collapse = () => {
    if (phase !== "done") return;
    if (prefersReducedMotion) {
      setStreamedCount(0);
      setPhase("collapsed");
      return;
    }
    setPhase("streamingOut");
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

  // Reverse chain, mirroring the three effects above: erase rows one at
  // a time -> backspace the fetch line -> backspace the command echo ->
  // back to "collapsed".
  useEffect(() => {
    if (phase !== "streamingOut") return;
    if (streamedCount <= 0) {
      const t = window.setTimeout(() => setPhase("typingFetchOut"), 150);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStreamedCount((c) => c - 1), ROW_ERASE_STAGGER_MS);
    return () => window.clearTimeout(t);
  }, [phase, streamedCount]);

  useEffect(() => {
    if (phase !== "typingFetchOut" || !fetchTyper.done) return;
    const t = window.setTimeout(() => setPhase("typingCommandOut"), 150);
    return () => window.clearTimeout(t);
  }, [phase, fetchTyper.done]);

  useEffect(() => {
    if (phase !== "typingCommandOut" || !cmdTyper.done) return;
    const t = window.setTimeout(() => setPhase("collapsed"), 100);
    return () => window.clearTimeout(t);
  }, [phase, cmdTyper.done]);

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
      {/* No max-height/scroll at all while collapsed — the 5-row view is
          meant to just sit there fully visible, not hint at a scrollbar
          that has nothing to actually scroll. The whole point of streaming
          certs into a terminal is that the terminal handles overflow the
          way a real one does — scrolling in place — rather than the page
          growing taller with every credential added in the future, but
          that only becomes true once there's real overflow to handle: the
          moment expand() fires, this switches on the cap + scroll (9+ rows,
          growing over time). terminal-scroll: a blocky green "pixel"
          scrollbar defined in globals.css, standing in for each browser's
          default chrome one — only actually renders once overflow-y-auto
          is present below, so it's harmless to keep on the className
          unconditionally. overflow-x-hidden is deliberate, not redundant:
          per the CSS overflow spec, setting only overflow-y to a non-
          "visible" value silently computes overflow-x as "auto" too (an
          axis can't stay "visible" once the other one isn't) — so without
          this, a single-pixel sub-pixel rounding overflow was enough to
          pop a horizontal scrollbar under the vertical one. */}
      <div
        ref={scrollRef}
        className={`terminal-scroll font-mono text-xs ${
          phase === "collapsed" ? "" : "max-h-[400px] overflow-x-hidden overflow-y-auto sm:max-h-[460px]"
        }`}
      >
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
              {cmdActive ? cmdTyper.out : COMMAND_TEXT}
              {cmdActive && <span className="cert-log-cursor text-accent">▌</span>}
            </p>

            {(phase === "typingFetch" ||
              phase === "streaming" ||
              phase === "done" ||
              phase === "streamingOut" ||
              phase === "typingFetchOut") && (
              <p className="mt-2 text-muted">
                {fetchActive ? fetchTyper.out : FETCH_TEXT}
                {fetchActive && <span className="cert-log-cursor text-accent">▌</span>}
              </p>
            )}

            {(phase === "streaming" || phase === "streamingOut" || phase === "done") && (
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
