import { NodeMark } from "@/components/shared/NodeMark";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { identity } from "@/lib/content";

const FOOTER_LINKS = [
  { href: "#stats", label: "Stats" },
  { href: "#work", label: "Projects" },
  { href: "#open-source", label: "OSS" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-accent/40 px-6 py-2.5 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start sm:gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-accent">
              <NodeMark className="h-4 w-4" />
              // <span className="text-foreground">SOBAN</span>
            </div>
            <p className="mt-1 font-mono text-xs uppercase tracking-wide text-muted sm:mt-2">
              Grounded AI engineering. Systems that verify before they act.
            </p>
          </div>

          <ul className="flex flex-wrap gap-4">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-wide text-muted transition-colors duration-150 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 flex flex-col items-center justify-between gap-2 border-t border-surface-border pt-3 sm:mt-8 sm:flex-row sm:gap-3 sm:pt-6">
          <p className="font-mono text-xs text-muted/60">&copy; {new Date().getFullYear()} {identity.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href={identity.github} aria-label="GitHub" className="text-muted transition-colors duration-150 hover:text-foreground">
              <GitHubIcon size={16} />
            </a>
            <a href={identity.linkedin} aria-label="LinkedIn" className="text-muted transition-colors duration-150 hover:text-foreground">
              <LinkedInIcon size={16} />
            </a>
            <span className="font-mono text-xs text-muted/40">exit 0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
