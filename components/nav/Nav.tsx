"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#stats", label: "Stats" },
  { href: "#experience", label: "History" },
  { href: "#work", label: "Projects" },
  { href: "#open-source", label: "OSS" },
  { href: "#research", label: "Research" },
  { href: "#credentials", label: "Certs" },
  { href: "#skills", label: "Skills" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Two real gaps the mobile menu had: tapping anywhere outside it (the
  // normal way any app dropdown/sheet is expected to close) did nothing —
  // only the X button or one of the menu's own links closed it — and the
  // page underneath stayed scrollable while it was open, so a drag on what
  // looked like the menu's own background could scroll the page behind it.
  // Both fixed here: a pointerdown listener outside the panel/toggle closes
  // it, and body scroll is locked for as long as it's open. Only attached
  // while mobileOpen is true, and only after this render commits — so the
  // same tap that opens the menu can't also be seen as the "outside" tap
  // that immediately closes it again.
  useEffect(() => {
    if (!mobileOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return;
      setMobileOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    // "top" (Hero) and "about" aren't in LINKS — there's no nav link for
    // either — but they still need to be observed, not just the sections
    // that *do* have a link. Without them, scrolling back up into Hero
    // left whatever section was active last (typically "#stats", the
    // first real link) stuck highlighted: the observer's callback only
    // ever fires setActive when something in `ids` is actually
    // intersecting, so once you scrolled back above every observed
    // section, the callback stopped firing at all and `active` just held
    // its last value instead of clearing. Observing "top"/"about" too, and
    // explicitly clearing `active` when one of them is what's intersecting,
    // fixes that — the nav now correctly shows nothing highlighted while
    // you're at the very top of the page.
    const linkIds = LINKS.map((l) => l.href.slice(1));
    const ids = ["top", "about", ...linkIds, "contact"];
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const id = visible[0].target.id;
        setActive(linkIds.includes(id) || id === "contact" ? "#" + id : "");
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-[background-color,border-color] duration-200 ${
        scrolled
          ? "border-b border-accent/40 bg-background/85 backdrop-blur-md"
          : "border-b border-accent/40 bg-background"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Hamburger sits to the left of the wordmark, not the right — the
            layout most mobile apps/sites use (toggle first, brand next to
            it). Grouped in one flex child together with the logo rather
            than positioned via order utilities: the button is display:none
            at md+ (zero width, doesn't affect layout there), and with only
            this one group + HIRE() visible below md, `justify-between` on
            the parent nav naturally pins the group to the left and HIRE()
            (where visible, sm+) to the right — no extra positioning rules
            needed, and the md+ desktop layout (logo, links, HIRE — the
            hamburger contributes nothing there) is unchanged. */}
        <div className="flex items-center gap-3">
          <button
            ref={menuButtonRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center text-foreground md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Color-swap hover — same "opposite colors" treatment as
              HIRE()/CONTACT()/LIVE_LINK elsewhere on the site, just applied
              to the two halves of the wordmark instead of a filled button:
              the "//" and "SOBAN" trade colors on hover/tap rather than one
              plain color shift, so the logo itself feels alive/clickable
              instead of just sitting there as a static label. */}
          <a href="#top" className="group font-mono text-sm font-bold">
            <span className="text-accent transition-colors duration-150 group-hover:text-foreground group-active:text-foreground">
              //
            </span>{" "}
            <span className="text-foreground transition-colors duration-150 group-hover:text-accent group-active:text-accent">
              SOBAN
            </span>
          </a>
        </div>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`font-mono text-xs font-bold uppercase tracking-wide transition-colors duration-150 hover:text-foreground ${
                  active === link.href ? "text-foreground" : "text-muted"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Filled at rest, inverts to outlined (transparent fill, accent
            border + text) on hover/tap — same treatment as CONTACT() in
            SYS_STATS and LIVE_LINK on project cards. Now shown on mobile
            too (was hidden below sm, entirely unreachable without a
            keyboard/desktop viewport) — the hamburger moved to the left
            in an earlier round specifically so this had somewhere to sit
            on the right, the way most mobile app bars pair a menu toggle
            with a primary action. */}
        <a
          href="#contact"
          className="flex min-h-9 items-center rounded-md border-2 border-accent bg-accent px-3 py-1.5 font-mono text-xs font-bold text-background transition-colors duration-150 hover:bg-transparent hover:text-accent active:bg-transparent active:text-accent sm:px-4"
        >
          HIRE()
        </a>
      </nav>

      {mobileOpen && (
        <div
          ref={menuRef}
          // max-h + its own scroll, since body scroll is now locked while
          // this is open (see the effect above) — without it, on a short
          // phone screen the lower links (Certs/Skills/Contact) would be
          // stuck unreachable: the page itself can no longer scroll to
          // reveal them, so the panel has to be able to scroll internally
          // instead.
          className="max-h-[calc(100vh-4.5rem)] overflow-y-auto overscroll-contain border-t border-surface-border bg-background/95 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col px-6 py-4">
            {[...LINKS, { href: "#about", label: "About" }, { href: "#contact", label: "Contact" }].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block min-h-11 py-3 font-mono text-sm font-bold uppercase text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
