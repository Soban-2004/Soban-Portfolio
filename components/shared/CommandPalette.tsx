"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Copy, Mail, FileText, ArrowRight, X } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { identity } from "@/lib/content";

type Command = {
  id: string;
  label: string;
  group: "Navigate" | "Actions";
  icon: ReactNode;
  kind: "route" | "copy" | "external" | "mail";
  value: string;
};

const COMMANDS: Command[] = [
  { id: "top", label: "Top", group: "Navigate", icon: <ArrowRight size={14} />, kind: "route", value: "/#top" },
  { id: "work", label: "Work", group: "Navigate", icon: <ArrowRight size={14} />, kind: "route", value: "/#work" },
  { id: "experience", label: "Experience", group: "Navigate", icon: <ArrowRight size={14} />, kind: "route", value: "/#experience" },
  { id: "open-source", label: "Open Source", group: "Navigate", icon: <ArrowRight size={14} />, kind: "route", value: "/#open-source" },
  { id: "research", label: "Research", group: "Navigate", icon: <ArrowRight size={14} />, kind: "route", value: "/#research" },
  { id: "credentials", label: "Credentials", group: "Navigate", icon: <ArrowRight size={14} />, kind: "route", value: "/#credentials" },
  { id: "skills", label: "Skills", group: "Navigate", icon: <ArrowRight size={14} />, kind: "route", value: "/#skills" },
  { id: "about", label: "About", group: "Navigate", icon: <ArrowRight size={14} />, kind: "route", value: "/#about" },
  { id: "contact", label: "Contact", group: "Navigate", icon: <ArrowRight size={14} />, kind: "route", value: "/#contact" },
  { id: "fitnova", label: "FitNova case study", group: "Navigate", icon: <ArrowRight size={14} />, kind: "route", value: "/work/fitnova" },
  { id: "copy-email", label: `Copy email (${identity.email})`, group: "Actions", icon: <Copy size={14} />, kind: "copy", value: identity.email },
  { id: "mail", label: "Email Soban", group: "Actions", icon: <Mail size={14} />, kind: "mail", value: identity.email },
  { id: "resume", label: "Open resume", group: "Actions", icon: <FileText size={14} />, kind: "external", value: identity.resumeUrl },
  { id: "github", label: "Open GitHub", group: "Actions", icon: <GitHubIcon size={14} />, kind: "external", value: identity.github },
  { id: "linkedin", label: "Open LinkedIn", group: "Actions", icon: <LinkedInIcon size={14} />, kind: "external", value: identity.linkedin },
];

const FOCUSABLE = 'input, button, a[href], [tabindex]:not([tabindex="-1"])';

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const filtered = COMMANDS.filter((command) => command.label.toLowerCase().includes(query.toLowerCase()));

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const runCommand = async (command: Command) => {
    close();
    if (command.kind === "route") router.push(command.value);
    if (command.kind === "copy") await navigator.clipboard?.writeText(command.value);
    if (command.kind === "mail") window.location.href = `mailto:${command.value}`;
    if (command.kind === "external") window.open(command.value, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) {
          close();
        } else {
          triggerRef.current = document.activeElement as HTMLElement;
          setOpen(true);
        }
      } else if (event.key === "Escape" && open) {
        close();
      }
    };
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
  }, [close, open]);

  useEffect(() => {
    if (!open) return;

    const background = Array.from(document.querySelectorAll<HTMLElement>("body > header, body > main, body > footer"));
    const previousOverflow = document.body.style.overflow;
    background.forEach((element) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => !element.hasAttribute("disabled"),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => {
      background.forEach((element) => { element.inert = false; });
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", trapFocus);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto overscroll-contain bg-background/80 px-4 pt-[15vh] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-md rounded-lg border border-surface-border bg-surface shadow-2xl"
      >
        <div className="flex items-center border-b border-surface-border">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelected((current) => Math.min(current + 1, Math.max(filtered.length - 1, 0)));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelected((current) => Math.max(current - 1, 0));
              } else if (event.key === "Enter" && filtered[selected]) {
                void runCommand(filtered[selected]);
              }
            }}
            placeholder="Jump to a section, or run an action…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-results"
            aria-activedescendant={filtered[selected] ? `command-${filtered[selected].id}` : undefined}
            className="min-h-12 flex-1 bg-transparent px-4 py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close command palette"
            className="mr-1 flex h-[44px] w-[44px] items-center justify-center rounded-md text-muted transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X size={18} />
          </button>
        </div>
        <ul id="command-results" role="listbox" className="max-h-80 overflow-y-auto overscroll-contain p-1.5">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No matches.</li>}
          {filtered.map((command, index) => (
            <li key={command.id}>
              <button
                type="button"
                id={`command-${command.id}`}
                role="option"
                aria-selected={index === selected}
                onMouseEnter={() => setSelected(index)}
                onClick={() => void runCommand(command)}
                className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                  index === selected ? "bg-accent/15 text-accent-soft" : "text-foreground"
                }`}
              >
                {command.icon}
                {command.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
