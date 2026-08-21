import { GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accent } from "@/components/shared/Accent";
import { about, education } from "@/lib/content";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        index="01"
        label="INTRO"
        title={
          <>
            WHO<wbr />
            <Accent>_I_AM</Accent>
          </>
        }
      />
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <p className="font-mono text-xs text-muted/60">bio.txt</p>
        {/* min-w-0: a grid item's default min-width is `auto`, sized to its
            widest descendant's intrinsic content — kept as a defensive
            default for this column even though the specific content that
            first triggered it (the GitHub contribution graph) has moved on. */}
        <div className="min-w-0">
          {/* accent-soft (mint green) instead of the near-white --foreground
              used everywhere else — per feedback that the plain white body
              copy here read as flat. This is the one paragraph on the site
              that gets the terminal's own phosphor-green tone as its actual
              body color, not just an accent on a heading/number, since it's
              the intro paragraph readers land on first. */}
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-accent-soft sm:text-xl">
            {about.paragraph}
          </p>

          {/* Education, right after the bio — replaces the GitHub
              contribution graph that used to sit here (moved out per
              feedback; that data lives in GitHubSignal.tsx if it's ever
              wanted back). Redesigned as a genuine standalone card rather
              than a plain icon+text row under a divider — per feedback
              that it needed to actually draw the eye. edu-glow-border (see
              globals.css) is a continuously-rotating conic-gradient ring
              masked down to a thin border — one point of light circling
              the card's edge and coming back around, never sitting still.
              hover/active add a hard, non-blurred offset shadow + lift —
              the same "coming out of the screen" 3D block-shadow language
              PaperCard already uses elsewhere on the site, not a new
              pattern invented just for this card. */}
          {/* bg-surface, not bg-surface/70: the "border" here is really the
              rotating gradient on the wrapper's pseudo-element showing
              through a couple of px of padding — this inner card has to be
              fully opaque or the gradient would also show through the
              middle of the card, not just at the edge. */}
          <div className="edu-glow-border mt-10 max-w-md rounded-lg">
            <div className="flex items-start gap-3 rounded-md bg-surface p-5 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--accent)] active:-translate-x-1 active:-translate-y-1 active:shadow-[4px_4px_0_0_var(--accent)]">
              <GraduationCap size={20} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="font-medium text-foreground">{education.degree}</p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {education.school} · {education.period}
                </p>
                <p className="mt-1 font-mono text-xs text-accent-soft">CGPA: {education.cgpa}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
