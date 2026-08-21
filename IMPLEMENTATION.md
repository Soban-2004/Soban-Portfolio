# IMPLEMENTATION.md
## Portfolio for Soban Shankar — AI Engineer

> This is a build specification for an AI coding agent (Claude Code). All personal/professional content below is sourced from a verified `profile.md` — every claim has been checked against a primary source (resume PDFs, GitHub, IEEE proceedings, certificate PDFs). Do not invent facts, metrics, or projects beyond what's in this document.

---

## 1. PROJECT VISION

Build a personal portfolio that reads as **"a living technical workspace for an AI engineer,"** not a resume with animations bolted on and not a 3D game. The target reaction from a recruiter or hiring manager:

> "This is an AI engineer who builds real systems, and the portfolio itself is unusually well engineered."

The site's own construction — clean architecture, deliberate motion, real performance discipline — is itself evidence of engineering judgment, the same way FitNova's README demonstrates it through prose.

**Split:** 70% professional / 20% interactive / 10% experimental-personality. Motion is never decorative; every animation must reveal, respond, or explain something. Interactions should be *discovered* while scrolling and exploring, never required to understand the content.

---

## 2. DESIGN PRINCIPLES

1. **Motion reveals, responds, explains — never performs.** Every animation answers: why does this exist, what does it communicate, does it slow down reading, does it work on mobile, does it work with `prefers-reduced-motion`, is the performance cost justified? If the answer to any of the first three is weak, cut it.
2. **Interaction budget.** At any given moment, only 1–2 things should be moving on screen. No competing animations.
3. **Content-first, then motion.** The site must be fully readable and functional with zero JavaScript animation running (progressive enhancement, not animation-dependent comprehension).
4. **Restraint over spectacle.** No Bruno-Simon-style 3D world, no particle fields, no giant custom cursor, no neon/cyberpunk palette, no heavy glassmorphism. A single 3D moment (if any) lives in one contained spot, not the whole page.
5. **Depth of individual sections over breadth of shallow ones.** 2026 portfolio research consistently shows 4–6 deep sections beat 8+ shallow ones — prioritize the FitNova case study and the architecture storytelling over adding more surface area.
6. **Every interactive element must degrade gracefully** — no JS, slow connection, reduced motion, mobile, keyboard-only, screen reader.

---

## 3. REFERENCE ANALYSIS (inspiration only — do not copy layout/branding/wording)

**Josh W. Comeau** (joshwcomeau.com) — principle extracted: *take a piece of information that is normally static/boring and turn it into a small, tasteful interactive moment that also communicates something true about the person.* We will invent original equivalents (Section 5) rather than reproduce his avatar, height-stickman, or distance-from-you concepts.

**Sawad | Thoughts** (sawad.framer.website) — principle extracted: editorial typography, restrained motion, strong content hierarchy, technical writing presented elegantly rather than performatively. Informs the Research and "Engineering Storytelling" sections, and general type-scale discipline.

**Akash Parmar** (akash-codes.in) — principle extracted: portfolio as engineered product; project case studies with real technical depth; the site itself as a frontend-skill demonstration. Do not copy the desktop/OS metaphor — instead, this informs how the FitNova case study is structured (architecture, tradeoffs, what's real vs. simplified) and how projects link tech stack ↔ implementation.

**Current market research (2026):**
- Dark-mode-default is now the majority pattern for developer portfolios; associated with technical credibility.
- Glassmorphism has matured into a legitimate, restrained design language — a translucent-card treatment used sparingly (not the *aesthetic* of the whole site) reads as current without looking dated.
- The dominant modern stack for developer portfolios is **Next.js (App Router) + TypeScript + Tailwind + Framer Motion (Motion)**, optionally layered with **GSAP** for scroll sequences and **Lenis** for smooth scroll — this is the combination this spec adopts.
- **91.7%** of mobile pages animate with CSS transitions; only **18.4%** load a JS animation library at all — meaning: default to CSS/Tailwind transitions for simple hover/focus states, reserve Framer Motion/GSAP for animations that need orchestration, sequencing, or scroll-linking.
- INP (Interaction to Next Paint) is the Core Web Vital most threatened by animation in 2026 — keep animated properties to `transform`/`opacity` (compositor-only), never animate `width`/`top`/`left`/box-shadow directly.

---

## 4. ORIGINAL INTERACTION IDEAS (invented for Soban — not copied)

These are Comeau-style "make the static interesting" moments, built around Soban's actual identity as an AI/RAG engineer — not his location, height, or generic personal facts.

### 4.1 The Retrieval Trace (hero interaction)
Soban's actual engineering philosophy across every project is: retrieve → reason → verify → act (grounded RAG, guardrails, deterministic scoring). Represent this as a small interactive diagram in the hero: four connected nodes. On hover/tap, each node briefly "activates" (a signal pulse travels along the connecting line) and a one-line explanation appears — grounded in a real example from his projects, e.g.:
- **Retrieve** → "Hybrid dense + BM25 search across 2,000+ FAQ entries" (Flipkart project)
- **Reason** → "3-pass LLM analysis, each pass narrow and schema-validated" (FitNova)
- **Verify** → "3-layer tag validation — schema, fuzzy match, semantic embeddings" (FitNova)
- **Act** → "Deterministic scoring — the LLM never does arithmetic" (FitNova)

This is both the visual identity motif (see Section 6) *and* a genuine functional explainer of how he thinks about AI systems — not decoration.

### 4.2 Tech stack as a live graph, not a list
Instead of a static skill list, render tech stack items as nodes. Hovering (desktop) or tapping (mobile) a technology highlights which real projects used it, with a short connecting line animating to the relevant project card, and the project card itself gets a brief highlight state. E.g. hover "Qdrant" → highlights both the Resume Matcher and Flipkart FAQ projects. This is Idea #3 from the brief, executed with real data already in `profile.md` (Section 9's skill groupings map directly to Section 5's project tech tags).

### 4.3 "What's real vs. simplified" toggle (FitNova case study only)
FitNova's actual README has an honest, unusually well-written section distinguishing what's genuinely production-grade vs. what's simplified for a personal project (e.g., advisor identity is asserted metadata not a voiceprint; SSE broadcaster is single-process). Surface this directly as a small interactive toggle/accordion on the FitNova case study page: "Show what's simplified." This is honest engineering communication, not spin — and it's genuinely distinctive; almost no portfolio does this. High value, low animation cost (just a disclosure component).

### 4.4 Architecture diagrams that animate on scroll-into-view
FitNova's README already contains real Mermaid flowcharts (ingestion → worker → Deepgram → 3 LLM passes → scoring → SSE broadcast; and the call state machine). Rebuild these as SVG diagrams where, on scrolling into view, the data-flow path animates once (a traveling dot/pulse along the path, ~1.2s, `prefers-reduced-motion`-safe fallback = static diagram with the path already drawn). This directly satisfies "scrolling into an architecture diagram animates the data flow" from the brief, and it's based on real architecture, not invented.

### 4.5 Metric count-up on scroll (project impact stats)
The five headline stats in `profile.md` §10 (95% fewer rubric reviews, 4.5s→1s latency, 2,000+ schema objects, 60–70% effort reduction, 1 merged OSS PR) count up from 0 when they scroll into view, once, using `IntersectionObserver` + a lightweight tween (Framer Motion's `useInView` + `animate`). No re-triggering on scroll-back — a stat that re-animates every time you scroll past it is the "BAD" example in the brief (a performing animation, not an explaining one).

### 4.6 "Grounded, not guessed" — the research/publications interaction
Because both listed papers had a real verification story (initial hallucination caught, corrected against primary sources), and because Soban's whole professional identity is about *grounding* AI outputs in verifiable sources rather than trusting them blindly — make the Research section visually echo that principle. Each paper card shows: title, one-liner, and a small "Verified against: [IEEE proceedings / DOI link]" citation strip, styled consistently with how project cards cite live demo/GitHub links. This isn't an "easter egg," it's consistent information design that quietly reinforces his actual engineering values (nothing stated without a source) — subtle personality, not gimmick.

### 4.7 Open-source contribution as a diff view
For the LangChain PR (#39238), instead of a plain text description, show a small stylized "diff card" — before/after behavior in two columns (Before: silently discarded non-dict input → data loss. After: raises a clear error + 9 regression tests, 149 passing). This reads immediately to any technical visitor and is truthful to what actually happened (verified from the PR description in `profile.md` §6). No fake code diff needed — a simple two-column comparison card suffices; avoid fabricating actual code snippets you haven't verified against the real PR diff.

### 4.8 Cursor-following subtle parallax (background only)
A very light multi-layer parallax on the hero background (the retrieval-trace nodes, Section 4.1) that shifts ~4–8px opposite to cursor movement, using `transform: translate3d()` only, disabled entirely on touch devices and under `prefers-reduced-motion`. This is the *only* cursor-reactive element on the site — matches the brief's "cursor movement creates subtle parallax" example without escalating into a custom cursor or heavier effects.

### 4.9 Personal easter egg (tasteful, optional)
A single easter egg tied to his actual identity as someone who builds LLM guardrail/validation systems: if a visitor opens the browser console, log a short ASCII-art node graph (matching the signal/graph motif) with a one-line message like `// this console.log passed schema validation. unlike some LLM outputs.` — a small, self-aware joke about his own work (LLM Guard, 3-layer validation). Entirely optional, never surfaced in the UI, doesn't block or distract from the primary experience.

**Explicitly excluded from Section 4 (per brief):** distance-from-visitor calculations requiring geolocation permission, height/physical-stat stickman equivalents, and anything requiring precise location data. If a location element is wanted at all, it should be static text ("Building from Chennai, India — open to relocation") with no live geolocation lookup, coarse or otherwise, since it adds a permission prompt and privacy surface for near-zero communicative value here (unlike Comeau's usage, Soban's audience is recruiters, not blog readers — the "distance from you" gimmick doesn't serve a hiring context as well as it serves a personal blog).

---

## 5. VISUAL SYSTEM

### 5.1 Motif: Signal / Node / Graph
A single recurring visual language: small circular nodes connected by thin lines, occasionally with a traveling pulse/dot to represent data or signal flow (retrieve → reason → verify → act). This motif appears in:
- Favicon (a minimal 4-node graph, abstracted — see Section 8)
- Hero (Section 4.1's interactive retrieval trace)
- Architecture diagrams (Section 4.4)
- Section dividers (a thin single-line graph element, never a full illustration, used sparingly — no more than once per 2–3 sections)
- Footer (small static version of the node motif, no animation)

**Discipline:** this motif must not appear more than 4–5 times total on the page. Overuse turns a meaningful metaphor into wallpaper.

### 5.2 Color System
Dark-mode-default (majority pattern for 2026 dev portfolios, reads as technical). Recommend:
- **Background:** near-black, not pure black — e.g. `#0A0B0D` to `#0F1115` range — softer on the eyes, standard for modern dark UIs
- **Surface/card:** a step up, e.g. `#15171C`, with an optional very restrained glass treatment (backdrop-blur + low-opacity border) used only on 1–2 elements (e.g. the nav bar on scroll, or FitNova's "what's simplified" disclosure) — not the whole site
- **Primary accent:** a single accent color used consistently for the node/signal motif and interactive states — a cool, technical blue or cyan-leaning tone (avoid neon/cyberpunk saturation — keep it desaturated enough to feel professional, e.g. in the `#5B8DEF`–`#6EA8FE` range)
- **Text:** high-contrast off-white for body copy (`#E4E6EB` range), muted gray for secondary text
- **Semantic colors used sparingly:** a success green for "verified"/"live demo" tags, a muted amber for "earlier work"/"simplified" tags — never more than these two semantic accents beyond the primary

Light mode is optional (nice-to-have, not required for v1) — if implemented, invert the same tokens rather than designing a second system from scratch.

### 5.3 Typography
- **Headings:** a modern geometric or grotesk sans with real character — e.g. Inter, General Sans, or Geist (Vercel's own, pairs naturally with a Next.js/Vercel deployment) — avoid default system fonts, avoid anything overly decorative
- **Body:** same family or a highly-compatible pairing, optimized for long-form technical reading (the FitNova case study will have real prose)
- **Monospace (for stats, code snippets, tech tags):** a technical mono font — e.g. JetBrains Mono or Geist Mono — used for the interaction budget's "technical" signal (metric counters, tech stack labels, terminal-style flourishes)
- **Scale:** editorial-influenced hierarchy per the Sawad reference — generous heading sizes, real whitespace, not cramped. Avoid more than 4 distinct heading levels visually.

### 5.4 Motion tokens
- **Easing:** a single consistent custom easing curve for all "reveal" transitions (e.g. `cubic-bezier(0.16, 1, 0.3, 1)` — a natural decelerate), used everywhere rather than ad hoc easings per component
- **Durations:** micro-interactions (hover, tag highlight) 150–200ms; section reveals 400–600ms; architecture diagram path draws 1000–1400ms once
- **Reduced motion:** every animation must have a `prefers-reduced-motion: reduce` fallback that shows the end state immediately (no animation, not just a shorter one)

---

## 6. PAGE STRUCTURE

Single-page scroll (not multi-page routing for the main narrative) with anchor-based navigation, except:
- FitNova gets its **own dedicated case-study route** (`/work/fitnova`) given its depth — this matches the "fewer sections, more depth" 2026 pattern and lets it be linked to independently (e.g. from a resume or LinkedIn)
- Other projects can live as expandable cards within the single-page Projects section, with "read more" linking to a lighter dedicated project page if desired later (v2, not required for v1)

**Section order (single-page):**
1. Hero
2. About
3. Experience (Drivestream)
4. Projects (Resume Matcher, Flipkart FAQ, FitNova summary card → links to full case study, Cricket analysis as "earlier work")
5. Open Source (LangChain PR)
6. Research (2 papers)
7. Skills (interactive tech graph, Section 4.2)
8. Contact
9. Footer

---

## 7. NAVIGATION

Conventional, sticky/floating nav bar, per the brief: **Soban · Work · Experience · Open Source · Research · About · Contact**. No gamified navigation, no desktop-OS metaphor. On scroll, the nav bar can adopt the restrained glass treatment (backdrop-blur, subtle border) — this is the one sanctioned glassmorphism moment beyond the FitNova disclosure component. Active-section highlighting via `IntersectionObserver`, not scroll-position math.

Mobile: collapses to a simple hamburger/sheet menu — no custom animated icon transformations beyond a standard, fast (150ms) icon morph.

---

## 8. FAVICON / LOGO DIRECTION

A minimal abstracted 4-node graph (echoing the retrieve→reason→verify→act motif from Section 4.1), reduced to its simplest geometric form: 4 small circles connected by thin lines in a compact arrangement that reads clearly at 16×16px. Single accent color on transparent/dark background. This should be designed as an actual SVG (not a placeholder) — simple enough to be legible as a favicon, distinctive enough to double as a personal mark in the nav bar (small, next to or replacing "Soban" wordmark on scroll).

Do not attempt a literal portrait/illustrated avatar — the node-graph mark is both more implementable without image assets and more thematically appropriate to an AI/systems engineer's identity than a cartoon likeness.

---

## 9. HERO SECTION

**Content:**
- Name: Soban Shankar
- Headline (pick one, from `profile.md` §2): *"AI Engineer building production-grade agentic RAG systems, multi-agent orchestration, and retrieval pipelines."*
- Sub-line: *"I build systems that retrieve grounded evidence, reason over it, and take real action — not just prompts wrapped in a chatbot."*
- Location line (static, no geolocation): *"Chennai, India — open to relocation (Bengaluru)"*
- CTA buttons: "View Work" (scrolls to Projects), "Resume" (opens/downloads the 2026 Voice AI Engineer resume PDF — confirmed version per `profile.md`), GitHub + LinkedIn icon links

**Interactive element:** Section 4.1's Retrieval Trace diagram, with Section 4.8's subtle cursor parallax on its background layer only.

**What happens on mobile:** the retrieval trace becomes tap-to-activate instead of hover-to-activate; parallax is disabled entirely; diagram may simplify to a vertical stack of the 4 nodes rather than a wide horizontal layout.

**Reduced motion:** trace nodes render in their "activated" resting state with no pulse animation; parallax disabled.

---

## 10. ABOUT

Short (3–5 sentence) prose section, drawn from `profile.md` §3's professional summary, rewritten in first person and a slightly more personal register than the resume-style original — but every factual claim must trace back to verified profile data (internship, project count, tech proficiency). No invented personal anecdotes.

---

## 11. EXPERIENCE

Drivestream internship (`profile.md` §4), presented as a single detailed card/timeline entry (not a dense multi-job timeline — there's only one professional role, so don't force a timeline UI that implies more history than exists). Lead with the 3 impact numbers (60–70% effort reduction, 20+ modules, 2,000+ schema objects) as the count-up stats from Section 4.5.

---

## 12. PROJECTS

Card grid, 3 featured (Resume Matcher, Flipkart FAQ, FitNova) + 1 "earlier work" tag (Cricket Analysis). Each featured card:
- Project name, one-line description, tech tags (feed Section 4.2's graph interaction), live demo + GitHub links
- Headline stat prominently displayed (per `profile.md`'s "Headline stat" field for each project)
- FitNova's card is visually distinct (larger, or marked "Featured Case Study") and links out to `/work/fitnova` rather than expanding inline

**What happens on hover (desktop):** card lifts slightly (`transform: translateY(-4px)`, shadow deepens) — standard, restrained, no video preview needed since none of these projects have demo videos recorded yet (flag as a v2 possibility if Soban records screen-capture demos later — do not fabricate placeholder video content).

**What happens on click:** navigates to live demo (external) or expands for more detail (Resume Matcher, Flipkart FAQ) or routes to the dedicated case study (FitNova).

---

## 13. FITNOVA CASE STUDY (`/work/fitnova`)

This is the flagship page — treat it as a genuine engineering write-up, not a marketing card. Structure closely follows the real README (`profile.md` §5, project 3):

1. **Overview** — what it is, why built (production-level personal project, real tests/error-handling, not a demo)
2. **Architecture** — the pipeline diagram (Section 4.4's animated version): ingestion → worker → Deepgram → 3 LLM passes → deterministic scoring → SSE broadcast
3. **Key engineering decisions** (this section satisfies the brief's "Engineering Storytelling" requirement — use ONLY the real justifications already documented in the README, do not invent new ones):
   - *Why 3-pass LLM analysis, not one call?* — narrow, schema-validated passes at `temperature=0`, each validated before the next touches the output
   - *Why deterministic scoring?* — the LLM never does arithmetic; dimension ratings feed a weighted score, tags apply severity deductions, deduplicated by type
   - *Why a fallback model chain (Groq → Gemini → Ollama)?* — one provider's outage doesn't fail a call outright
   - *Why SSE, not polling or WebSockets?* — data only flows server→client here (a call finished, please refresh); a one-directional stream fits better than full-duplex, and pushing on real state change beats polling on a timer
   - *Why a DB-column state machine, not a message broker?* — single-process worker at this scale; a distributed queue adds infrastructure without demonstrable benefit yet, and swapping the executor later doesn't change the schema
   - *How is LLM output validated?* — Section 4.4's / README's 3-layer validation: Pydantic schema → RapidFuzz fuzzy match → Gemini semantic embeddings, escalating only when a cheaper check fails
4. **Real deployment gotchas** — the 3 documented ones (Render's Python 3.14 wheel-build failure on rapidfuzz, monorepo root-directory misconfiguration, self-running Alembic migrations on boot) — presented as a short "lessons learned" list, verbatim-grounded in the README
5. **What's real vs. simplified** — Section 4.3's interactive disclosure, using the actual README content (advisor identity is asserted metadata not a voiceprint; audio storage local+B2 backup; single-process SSE/progress; no real telephony adapter yet; score history before deployment week is clearly-flagged synthetic seed data)
6. **What's next** — the real roadmap items from the README (Deepgram transcribe-by-URL, Neon pooled connections, voiceprint verification, Redis-backed SSE, granular retry/backoff)
7. **Tech stack + links** — GitHub, live frontend, backend health check

**Do not fabricate an architecture diagram element, metric, or design decision not present in the verified README content above.**

---

## 14. INTERACTIVE ARCHITECTURE (component, reused across FitNova + optionally other projects)

A reusable `<ArchitectureDiagram>` component: SVG nodes + connecting paths, driven by a simple JSON/TS data structure (node id, label, position, connections). On scroll-into-view (`IntersectionObserver`, threshold ~0.4), animate a stroke-dashoffset path draw + a traveling dot along the primary flow path, once. Nodes are hoverable/tappable for a tooltip with 1–2 sentence explanation (grounded in real project detail — see Section 4.4).

---

## 15. PROJECT VIDEOS

Not included in v1 — no demo videos currently exist for any project, and fabricating placeholder video UI with no real content would be misleading. If Soban records real screen-capture walkthroughs later, the `<ProjectCard>` component should be built with an optional `demoVideoUrl` prop so this can be added later without restructuring (hover-to-preview behavior can be implemented then).

---

## 16. OPEN SOURCE

Single entry: LangChain PR #39238 (`profile.md` §6). Present via Section 4.7's before/after comparison card:
- **Before:** `RecursiveJsonSplitter.split_json()` silently discards non-dict top-level input — a data-loss bug with no error raised
- **After:** raises a clear error; 9 regression tests added covering lists, primitives, `None`, existing dict behavior; validated against 149 passing tests; merged
- Link to the real PR and the issue it traces to (#39192)

Do not present this as more significant than it is (a scoped, well-tested bug fix) — the brief explicitly says not to exaggerate it. Its value is in demonstrating real open-source process discipline (issue → root cause → fix → tests → merge), which is worth foregrounding as *process*, not scale.

---

## 17. RESEARCH

Two cards (`profile.md` §11), each with: title, conference name + year, one-liner (use the exact "portfolio-safe" descriptions already drafted in `profile.md`), and Section 4.6's "Verified against" citation strip linking to the primary source (IEEE proceedings TOC / J-GLOBAL for paper 1, ResearchGate + DOI for paper 2). Clearly labeled "Co-author," not "Author," per the accuracy notes already established. Do not add fabricated abstract detail beyond what's already verified in `profile.md`.

---

## 18. SKILLS

Section 4.2's interactive tech graph. Group technologies per `profile.md` §9's existing categories (Programming & Backend, LLM & Agentic AI, Speech & Voice AI, Vector DB & Retrieval, LLMOps & Evaluation, Machine Learning, Cloud & DevOps) as a filterable/visual cluster rather than a flat badge wall. Hover/tap connects to real projects that used that technology (cross-reference against Section 12's project tech tags — this mapping must be internally consistent, i.e., don't claim a project used a technology not listed in its `profile.md` tech line).

---

## 19. CONTACT

Simple, direct: email (ssoban2004@gmail.com), LinkedIn, GitHub, resume download. No contact form required for v1 unless Soban wants one (adds backend/email-service complexity — Resend is the standard modern choice if added later, per current stack research). Avoid gimmicks here — recruiters want the fastest path to reaching you, not another interaction.

---

## 20. PERSONAL MICRO-INTERACTIONS SUMMARY TABLE

| Interaction | User sees | Hover | Click | Mobile | Reduced motion | Why it exists |
|---|---|---|---|---|---|---|
| Retrieval Trace (hero) | 4 connected nodes | Node pulses, label appears | Same as hover (tap) | Tap-based, vertical stack | Static resting state | Explains Soban's actual engineering philosophy with real examples |
| Tech-project graph | Tech nodes + project cards | Connecting line + project highlight | Same (tap) | Tap-based | Static highlight, no line animation | Shows real tool-to-project mapping, not just a badge list |
| Architecture diagram draw | Static diagram | — | — | Same, once in view | Path pre-drawn, static | Makes a real system understandable visually |
| Metric count-up | Numbers at 0 | — | — | Same | Numbers appear at final value instantly | Draws attention to real, verified impact numbers |
| FitNova "what's simplified" toggle | Collapsed disclosure | — | Expands/collapses | Same | Same (no animation dependency, just show/hide) | Honest engineering communication, distinctive and true |
| Cursor parallax (hero bg) | Nodes shift slightly | Continuous, subtle | — | Disabled | Disabled | Adds a felt sense of depth without distraction |
| Console easter egg | Nothing in UI | — | — | Same (console still works) | N/A | Small personality moment for technical visitors who look |

---

## 21. ANIMATION RULES (governing all of the above)

- Compositor-only properties for anything running during scroll or hover: `transform`, `opacity`. Never animate `width`, `height`, `top`, `left`, or `box-shadow` directly — use `transform: scale()`/`translate()` and pre-rendered shadow states instead.
- Every scroll-triggered animation fires **once** per element (`viewport once: true` in Framer Motion terms) — nothing re-triggers on scroll-back, matching the brief's explicit "BAD" example.
- Global interaction budget: no more than 1–2 concurrently animating elements at any scroll position.
- All animations must have a tested `prefers-reduced-motion` path that shows the final/resting state immediately.
- No animation may block or delay text becoming readable — text content should never depend on a JS animation completing to be legible (avoid "fade up from invisible" patterns that leave text blank before hydration; prefer CSS-visible-by-default with a subtle enhancement layered on top, or ensure SSR renders final state and JS only adds the *transition into* that state on first paint).

---

## 22. CURSOR BEHAVIOR

No custom cursor replacement. Default OS cursor throughout, with standard `cursor: pointer` on interactive elements. The only cursor-reactive behavior is Section 4.8's background parallax, which does not touch or replace the cursor itself.

---

## 23. MOBILE BEHAVIOR

- All hover-only interactions convert to tap-to-reveal (Sections 4.1, 4.2)
- Parallax (4.8) fully disabled
- Architecture diagrams may simplify layout (vertical stacking) but keep the same scroll-triggered path-draw animation, since it works fine on touch scroll
- Nav collapses to a sheet/hamburger menu
- Touch targets minimum 44×44px throughout (interactive nodes, buttons, nav items)

---

## 24. ACCESSIBILITY

- WCAG 2.2 AA baseline: color contrast checked against the dark palette (Section 5.2) for both body text and interactive states
- All interactive diagram nodes are real focusable elements (`<button>` or `tabindex="0"` with proper `role`), not `<div onClick>` — keyboard users must be able to Tab through and activate the retrieval trace, tech graph, and architecture diagram tooltips
- `aria-label`s on icon-only links (GitHub, LinkedIn icons)
- Skip-to-content link for keyboard/screen-reader users
- Respect `prefers-reduced-motion` at the OS/browser level automatically (not just an in-site toggle) — implemented via CSS media query, not a JS-only check
- Alt text on any real images (Cricket dashboard screenshots) describing actual content, not decorative filler

---

## 25. PERFORMANCE

- **Framework:** Next.js App Router — Server Components by default for static content (About, Experience, Research, Open Source sections), Client Components scoped tightly to only the interactive pieces (retrieval trace, tech graph, count-up stats, architecture diagram, FitNova disclosure)
- **Images:** `next/image` throughout for automatic optimization/lazy-loading (relevant for Cricket dashboard screenshots)
- **Animation library loading:** Framer Motion (`motion` package) as the primary library — declarative, React-native, well-supported. Reserve GSAP only if the architecture-diagram path-draw sequencing genuinely needs GSAP's `ScrollTrigger` precision; otherwise Framer Motion's `useInView` + `animate` covers every interaction in this spec, keeping the JS bundle smaller (don't ship two animation libraries unless one alone can't do the job)
- **No Lenis/smooth-scroll library** unless testing shows native scroll feels insufficient — an extra scroll library is unjustified bundle weight for a portfolio this size, and the risk noted in current research (misconfigured lerp harming INP) isn't worth taking on for marginal feel improvement here
- **Fonts:** `next/font` for self-hosted, zero-layout-shift font loading (Section 5.3's chosen families)
- **Target Core Web Vitals:** LCP < 2.5s, INP < 200ms, CLS < 0.1 — validated via Lighthouse in CI before each deploy (Section 34)
- **Bundle discipline:** code-split the architecture diagram and tech-graph components (`next/dynamic`) since they're below-the-fold and not needed for first paint

---

## 26. SEO

- Proper `<title>`/meta description per page (home + `/work/fitnova`)
- Open Graph + Twitter Card images (a simple static card using the node-motif + name/headline — generate once, don't dynamically render)
- Semantic HTML throughout (proper heading hierarchy, `<section>`/`<article>` landmarks)
- `sitemap.xml` + `robots.txt` via Next.js conventions
- Structured data (`Person` schema.org JSON-LD) with verified fields only (name, jobTitle, url, sameAs: [GitHub, LinkedIn])

---

## 27. RECOMMENDED TECH STACK

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15+ (App Router) | Server Components for static content, SEO, current 2026 default for developer portfolios |
| Language | TypeScript | Type-safe content model (Section 30) |
| Styling | Tailwind CSS 4 | Utility-first, pairs cleanly with component-scoped animation classes |
| Animation | Framer Motion (`motion`) | React-native declarative API, covers every interaction in this spec; add GSAP only if a specific scroll sequence genuinely requires it |
| Diagrams | Custom SVG components (not a heavy diagramming library) | Full control over the node/signal motif's exact look; a library like React Flow is overkill for 1–2 diagrams |
| Deployment | Vercel | Native Next.js support, edge network, zero-config image optimization |
| Fonts | `next/font` (Geist / Geist Mono, or Inter + JetBrains Mono) | Self-hosted, no layout shift |
| Icons | `lucide-react` | Consistent, tree-shakeable icon set already common in this stack |
| Forms (if added later) | React Hook Form + Resend | Standard current pairing, not required for v1 |

**Explicitly not used:** Three.js/React Three Fiber (no 3D scene justified by this spec's content), Lenis (unjustified for this scope), any headless CMS (content is static/personal, doesn't need to be editable by non-developers), GSAP as a hard requirement (optional, only if a specific sequence needs it).

---

## 28. PROJECT ARCHITECTURE (of the portfolio itself)

```
/app
  /page.tsx                    — single-page home (Hero, About, Experience, Projects, OSS, Research, Skills, Contact)
  /work/fitnova/page.tsx       — dedicated case study route
  /layout.tsx                  — root layout, fonts, metadata
  /sitemap.ts
  /robots.ts
/components
  /hero/RetrievalTrace.tsx
  /skills/TechGraph.tsx
  /shared/ArchitectureDiagram.tsx
  /shared/CountUpStat.tsx
  /projects/ProjectCard.tsx
  /work/fitnova/WhatsSimplifiedToggle.tsx
  /work/fitnova/GotchasList.tsx
  /opensource/DiffCard.tsx
  /research/PaperCard.tsx
  /nav/Nav.tsx
  /nav/MobileMenu.tsx
/lib
  /content.ts                  — typed content model, all copy pulled from here (Section 30)
  /motion-tokens.ts             — shared easing/duration constants (Section 5.4)
/public
  /resume-soban-shankar-2026.pdf
  /favicon.svg
  /og-image.png
  /cricket-dashboard-*.png      — real screenshots from the Cricket repo
```

---

## 29. DATA MODELS

```ts
// lib/content.ts

interface ImpactStat {
  label: string;
  value: string;       // e.g. "95%", "4.5s → 1s" — keep as string to preserve exact formatting
  numericValue?: number; // for count-up animation, when applicable (e.g. 95, 2000)
}

interface Project {
  id: string;
  name: string;
  period: string;
  description: string;
  highlights: string[];
  techTags: string[];      // must match TechGraph node ids
  githubUrl?: string;
  liveUrl?: string;
  headlineStat?: ImpactStat;
  featured: boolean;
  caseStudyRoute?: string; // e.g. "/work/fitnova"
}

interface ResearchPaper {
  id: string;
  title: string;
  authorsNote: string;     // e.g. "Co-authored — 2nd of 5 authors"
  conference: string;
  year: string;
  oneLiner: string;
  sourceUrl: string;       // primary source, not a secondary aggregator
  doi?: string;
}

interface OpenSourceContribution {
  repo: string;
  prUrl: string;
  before: string;
  after: string;
  testsAdded: number;
  totalPassing: number;
}

interface TechNode {
  id: string;
  label: string;
  category: 'backend' | 'llm-agentic' | 'voice' | 'vector-db' | 'llmops' | 'ml' | 'cloud-devops';
  relatedProjectIds: string[];
}
```

All actual content values are transcribed from `profile.md` — the data model above is structural, the values are not invented here.

---

## 30. COMPONENT ARCHITECTURE

- Server Components: `About`, `Experience`, `OpenSource`, `Research`, `Footer`, most of `Contact`
- Client Components (need interactivity/state/effects): `RetrievalTrace`, `TechGraph`, `ArchitectureDiagram`, `CountUpStat`, `WhatsSimplifiedToggle`, `Nav` (scroll listener for glass state), `MobileMenu`
- Shared motion tokens imported from `lib/motion-tokens.ts` — no component defines its own one-off easing curve
- `ProjectCard` accepts a `demoVideoUrl?: string` prop now (unused in v1) so video previews can be added later without a structural rewrite (Section 15)

---

## 31. ASSET STRUCTURE

- Favicon: custom SVG node-graph mark (Section 8) — export as `.svg` + fallback `.ico`/`.png` set via `next/favicon` conventions
- OG image: single static 1200×630 image, node-motif + name + headline, generated once (not per-page dynamic OG for v1)
- Cricket dashboard screenshots: pull the real images already in the `ICC-Mens-T20-Cricket-World-Cup-2024-Data-Analysis` repo's `/screenshots` folder (Overall.png, Openers.png, Middle_order.png, Finisher.png, all_rounder.png, bowlers.png, final_11.png) — use 1–2 of these, optimized, not all 7
- Resume PDF: the confirmed 2026 Voice AI Engineer version (`profile.md` §14) — hosted in `/public`, linked from Hero and Contact

---

## 32. DEVELOPMENT PHASES

**Phase 1 — Foundation**
Next.js + TypeScript + Tailwind scaffold, content model (`lib/content.ts`) populated from `profile.md`, base layout, typography/color tokens, static (non-animated) versions of every section rendering correctly.

**Phase 2 — Core interactivity**
`RetrievalTrace`, `TechGraph`, `CountUpStat`, Nav scroll behavior, mobile menu. Verify keyboard navigation and `prefers-reduced-motion` from the start, not bolted on later.

**Phase 3 — FitNova case study**
Dedicated route, `ArchitectureDiagram` component (reused here first), `WhatsSimplifiedToggle`, gotchas list, full engineering-decision write-up.

**Phase 4 — Remaining content sections**
Open Source diff card, Research paper cards, Cricket "earlier work" card with real screenshots.

**Phase 5 — Polish & performance pass**
Lighthouse audit, bundle analysis, image optimization pass, font-loading verification, cross-browser + cross-device testing, accessibility audit (axe or similar).

**Phase 6 — SEO & deploy**
Metadata, OG image, sitemap/robots, structured data, deploy to Vercel, verify Core Web Vitals in production (field data, not just lab).

---

## 33. TESTING CHECKLIST

- [ ] All content matches `profile.md` exactly — no invented metrics, projects, or claims
- [ ] Every interactive element works via keyboard alone (Tab, Enter/Space)
- [ ] Every animation has a verified `prefers-reduced-motion` fallback (test via OS setting, not just DevTools emulation)
- [ ] Mobile: all hover interactions have working tap equivalents
- [ ] Lighthouse: Performance, Accessibility, Best Practices, SEO all ≥ 90 (target ≥ 95 on Performance)
- [ ] LCP < 2.5s, INP < 200ms, CLS < 0.1 on both mobile and desktop throttled tests
- [ ] No animation runs on a non-composited property (audit via Chrome DevTools' "Layers"/performance panel)
- [ ] All external links (GitHub, live demos, LinkedIn, PR, DOI links) verified working and correct
- [ ] Resume PDF downloads correctly and is the confirmed 2026 version
- [ ] Screen reader pass (VoiceOver or NVDA) on at least the Hero, Nav, and one project card
- [ ] Color contrast checked against WCAG AA for all text/background combinations in the dark palette
- [ ] No console errors in production build

---

## 34. DEPLOYMENT

Vercel, connected to the project's GitHub repo, auto-deploy from `main`. Preview deployments on PRs/branches for review before merge. Environment: no secrets/API keys required for v1 (fully static/client-side site, no backend calls) — if a contact form with Resend is added later, that key lives in Vercel's environment variables, never committed.

---

## 35. ACCEPTANCE CRITERIA

The build is complete when:

1. Every fact, metric, and project detail on the site traces back to a specific line in `profile.md` — zero fabricated content.
2. The site is fully navigable and comprehensible with JavaScript disabled (progressive enhancement verified).
3. All items in Section 33's testing checklist pass.
4. The FitNova case study reads as genuine technical writing, not marketing copy — a technical reviewer should be able to verify every architectural claim against the real README content already captured in this spec.
5. No single animated element runs constantly/indefinitely (everything is triggered once, by a real event: scroll-into-view, hover, tap, focus).
6. The node/signal motif appears consistently but is not overused (self-audit against Section 5.1's "no more than 4–5 times" guideline).
7. The site works correctly on: latest Chrome/Safari/Firefox desktop, iOS Safari, Android Chrome, at minimum 360px width up to large desktop.
8. Lighthouse Performance score ≥ 90 on mobile (throttled), ideally ≥ 95.

---

## APPENDIX: SOURCE DATA

All content values referenced throughout this spec are defined in the companion `profile.md` file (identity, experience, projects, open source, research, certifications, skills, impact stats). Treat `profile.md` as the single source of truth for facts; this document (`IMPLEMENTATION.md`) governs structure, design, interaction, and technical build decisions only. If any conflict arises between the two, `profile.md` wins on facts and this document wins on implementation approach.
