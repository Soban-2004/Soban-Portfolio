import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accent } from "@/components/shared/Accent";
import { Reveal } from "@/components/shared/Reveal";
import { CertLogTerminal } from "@/components/certifications/CertLogTerminal";

// Real credentials sitting in lib/content.ts (`certifications`, transcribed
// from profile.md §8) that had no section actually rendering them anywhere
// on the site. Education used to have its own card in this grid; moved
// into the About section instead (right after the bio paragraph), per
// feedback — it reads better as part of introducing who Soban is than
// grouped in with certifications.
//
// Rendered as an actual terminal panel now (CertLogTerminal, on the same
// TerminalPanel chrome Hero/Contact/project cards already use for "real
// system output") rather than a card grid or a plain list — matches what
// this section has been named in the nav/heading (CERT_LOG) since it was
// first added. Collapsed to the 5 most recent by default with a
// `$ cert_log --all` command to stream in the rest; the terminal scrolls
// internally past a fixed height rather than the page growing taller
// every time a new credential is added.
export function Certifications() {
  return (
    <section id="credentials" className="mx-auto max-w-6xl px-6 py-12 sm:py-24">
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

      {/* No extra max-w of its own — spec asks for "the full terminal
          width available" on desktop with generous horizontal spacing,
          so this fills the section's existing max-w-6xl container rather
          than sitting in a narrower reading column the way Contact's
          terminal panel deliberately does. */}
      <Reveal y={16} className="mt-8">
        <CertLogTerminal />
      </Reveal>
    </section>
  );
}
