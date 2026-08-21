import { Award } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accent } from "@/components/shared/Accent";
import { Reveal } from "@/components/shared/Reveal";
import { certifications } from "@/lib/content";

// Real credentials sitting in lib/content.ts (`certifications`, transcribed
// from profile.md §8) that had no section actually rendering them anywhere
// on the site. Kept deliberately plain/compact — this is supporting
// evidence, not a section that needs to compete for attention with
// Projects or Research. Education used to have its own card in this grid;
// moved into the About section instead (right after the bio paragraph),
// per feedback — it reads better as part of introducing who Soban is than
// grouped in with certifications.
export function Certifications() {
  return (
    <section id="credentials" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        index="07"
        label="CREDENTIALS"
        title={
          <>
            CERT<wbr />
            <Accent>_LOG</Accent>
          </>
        }
        note="Certifications actually completed — no in-progress or planned ones listed."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {certifications.map((cert, i) => (
          <Reveal
            key={cert.name}
            y={20}
            delay={i * 60}
            className="rounded-lg border border-surface-border bg-surface/50 p-5 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_10px_28px_-12px_rgba(62,207,142,0.35)] active:-translate-y-1 active:border-accent/60 active:shadow-[0_10px_28px_-12px_rgba(62,207,142,0.35)]"
          >
            <div className="flex items-start gap-3">
              <Award size={18} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="font-medium text-foreground">{cert.name}</p>
                <p className="mt-1 font-mono text-xs text-muted">{cert.issuer}</p>
                {cert.detail && <p className="mt-1 font-mono text-xs text-accent-soft">{cert.detail}</p>}
                {/* Multi-course specializations (currently just Machine
                    Learning Specialization) list their individual courses —
                    every other cert is a single credential and has no
                    `items`, so this only ever renders where it's needed. */}
                {cert.items && (
                  <ul className="mt-2 space-y-1">
                    {cert.items.map((item) => (
                      <li key={item} className="flex gap-2 font-mono text-xs text-muted">
                        <span className="text-accent/70">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
