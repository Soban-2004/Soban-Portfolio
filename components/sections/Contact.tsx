import { FileText } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { CropMarks } from "@/components/shared/CropMarks";
import { Accent } from "@/components/shared/Accent";
import { Button } from "@/components/shared/Button";
import { TerminalPanel } from "@/components/shared/TerminalPanel";
import { identity, projects, openSource } from "@/lib/content";

export function Contact() {
  const shippedCount = projects.filter((p) => p.featured).length;

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-12 sm:py-24">
      <p className="font-mono text-xs text-accent">// 08 — CONTACT</p>

      <div className="relative mt-3 overflow-hidden rounded-md border border-accent px-4 py-4 sm:mt-6 sm:px-10 sm:py-16">
        <CropMarks variant="glow" />
        <div
          aria-hidden="true"
          className="glow-pulse pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />

        <h2 className="font-display-3d text-balance text-center text-2xl uppercase leading-[1.3] text-foreground sm:text-3xl sm:leading-[1.5] md:text-4xl">
          Let&apos;s build <Accent>something</Accent> grounded.
        </h2>

        <div className="mx-auto mt-4 max-w-lg sm:mt-10">
          <TerminalPanel title="contact.sh — zsh">
            <p className="font-mono text-xs text-muted">$ contact --engineer soban-shankar</p>
            {/* Pure flourish, no verified fact in it — the one line here
                that's safe to drop on mobile only to save a row; every
                other line is a real, sourced fact and stays. */}
            <p className="mt-1.5 hidden font-mono text-xs text-muted/70 sm:mt-2 sm:block">Loading profile...</p>
            <p className="font-mono text-xs text-success">
              ✓ AI Engineer — {identity.location} ({identity.relocation})
            </p>
            <p className="font-mono text-xs text-success">✓ {shippedCount} production RAG/agentic systems shipped</p>
            <p className="font-mono text-xs text-success">
              ✓ 1 OSS PR merged — {openSource.repo}
              {openSource.prNumber}
            </p>
            <p className="mt-1.5 font-mono text-xs text-muted sm:mt-2">
              Contact:{" "}
              <a href={`mailto:${identity.email}`} className="underline-hover text-accent-soft">
                {identity.email}
              </a>
            </p>
            <p className="mt-1 font-mono text-xs text-muted">
              Phone:{" "}
              <a href={`tel:${identity.phone.replace(/\s+/g, "")}`} className="underline-hover text-accent-soft">
                {identity.phone}
              </a>
            </p>
            <p className="mt-1.5 font-mono text-xs text-muted/60 sm:mt-2">
              <span className="text-accent">_</span> Awaiting your message...
            </p>
          </TerminalPanel>
        </div>

        <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-2 sm:mt-8 sm:gap-3">
          <Button href={`mailto:${identity.email}`} variant="accent" external ariaLabel="Send an email">
            $ SEND_MESSAGE
          </Button>
          <Button href={identity.linkedin} variant="secondary" external ariaLabel="LinkedIn">
            <LinkedInIcon size={14} /> LINKEDIN
          </Button>
          <Button href={identity.github} variant="secondary" external ariaLabel="GitHub">
            <GitHubIcon size={14} /> GITHUB
          </Button>
          <Button href={identity.resumeUrl} variant="secondary" external ariaLabel="Resume PDF">
            <FileText size={14} /> RESUME
          </Button>
        </div>
      </div>
    </section>
  );
}
