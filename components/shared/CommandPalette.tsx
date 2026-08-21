"use client";

// ⌘K / Ctrl+K command palette — an optional power-user layer, not a
// replacement for the conventional nav (IMPLEMENTATION.md §7 stays as the
// primary path). Jump to any section or trigger a quick action. Fully
// keyboard-operable: arrow keys move selection, Enter runs it, Escape closes
// and returns focus to whatever triggered it.

import { useEffect, useRef, useState } from "react";
import { Copy, Mail, FileText, ArrowRight } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { identity } from "@/lib/content";

interface Command {
  id: string;
  label: string;
  group: "Navigate" | "Actions";
  icon: React.ReactNode;
  run: () => void;
}

const goTo = (hash: string) => {
  window.location.assign(`/${hash}`);
};

const COMMANDS: Command[] = [
  { id: "top", label: "Top", group: "Navigate", icon: <ArrowRight size={14} />, run: () => goTo("#top") },
  { id: "work", label: "Work", group: "Navigate", icon: <ArrowRight size={14} />, run: () => goTo("#work") },
  { id: "experience", label: "Experience", group: "Navigate", icon: <ArrowRight size={14} />, run: () => goTo("#experience") },
  { id: "open-source", label: "Open Source", group: "Navigate", icon: <ArrowRight size={14} />, run: () => goTo("#open-source") },
  { id: "research", label: "Research", group: "Navigate", icon: <ArrowRight size={14} />, run: () => goTo("#research") },
  { id: "credentials", label: "Credentials", group: "Navigate", icon: <ArrowRight size={14} />, run: () => goTo("#credentials") },
  { id: "skills", label: "Skills", group: "Navigate", icon: <ArrowRight size={14} />, run: () => goTo("#skills") },
  { id: "about", label: "About", group: "Navigate", icon: <ArrowRight size={14} />, run: () => goTo("#about") },
  { id: "contact", label: "Contact", group: "Navigate", icon: <ArrowRight size={14} />, run: () => goTo("#contact") },
  { id: "fitnova", label: "FitNova case study", group: "Navigate", icon: <ArrowRight size={14} />, run: () => window.location.assign("/work/fitnova") },
  {
    id: "copy-email",
    label: `Copy email (${identity.email})`,
    group: "Actions",
    icon: <Copy size={14} />,
    run: () => navigator.clipboard?.writeText(identity.email),
  },
  {
    id: "mail",
    label: "Email Soban",
    group: "Actions",
    icon: <Mail size={14} />,
    run: () => window.location.assign(`mailto:${identity.email}`),
  },
  { id: "resume", label: "Open resume", group: "Actions", icon: <FileText size={14} />, run: () => window.open(identity.resumeUrl, "_blank") },
  { id: "github", label: "Open GitHub", group: "Actions", icon: <GitHubIcon size={14} />, run: () => window.open(identity.github, "_blank") },
  { id: "linkedin", label: "Open LinkedIn", group: "Actions", icon: <LinkedInIcon size={14} />, run: () => window.open(identity.linkedin, "_blank") },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  const close = () => {
    setOpen(false);
    setQuery("");
    setSelected(0);
    triggerRef.current?.focus();
  };

  const runCommand = (cmd: Command) => {
    cmd.run();
    close();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        triggerRef.current = document.activeElement as HTMLElement;
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) close();
    };
    // Lets the Nav's visible "⌘K" chip open the palette too, not just the
    // shortcut — a mouse-only visitor should be able to discover this.
    const onOpenRequest = () => {
      triggerRef.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpenRequest);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpenRequest);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => setSelected(0), [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-background/80 pt-[15vh] backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-surface-border bg-surface shadow-2xl"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelected((s) => Math.min(s + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelected((s) => Math.max(s - 1, 0));
            } else if (e.key === "Enter" && filtered[selected]) {
              runCommand(filtered[selected]);
            }
          }}
          placeholder="Jump to a section, or run an action…"
          aria-label="Search commands"
          className="w-full border-b border-surface-border bg-transparent px-4 py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted/60"
        />
        <ul role="listbox" className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No matches.</li>}
          {filtered.map((cmd, i) => (
            <li key={cmd.id}>
              <button
                type="button"
                role="option"
                aria-selected={i === selected}
                onMouseEnter={() => setSelected(i)}
                onClick={() => runCommand(cmd)}
                className={`flex min-h-11 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors duration-100 ${
                  i === selected ? "bg-accent/15 text-accent-soft" : "text-foreground"
                }`}
              >
                {cmd.icon}
                {cmd.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
