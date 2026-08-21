import { ProjectsSlider, type ProjectSlide } from "@/components/projects/ProjectsSlider";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accent } from "@/components/shared/Accent";
import { projects } from "@/lib/content";

const fitnova = projects.find((p) => p.id === "fitnova")!;
const resumeMatcher = projects.find((p) => p.id === "resume-matcher")!;
const flipkart = projects.find((p) => p.id === "flipkart-faq")!;
const cricket = projects.find((p) => p.id === "cricket-analysis")!;

const slides: ProjectSlide[] = [
  {
    project: fitnova,
    category: "Flagship — AI Call Intelligence",
    variant: "flagship",
    terminalLines: ["$ pytest -q backend/tests", "35 passed in 12.4s — real DB, no mocks"],
  },
  { project: resumeMatcher, category: "Full-Stack RAG Platform", variant: "standard" },
  {
    project: flipkart,
    category: "Agentic RAG Support",
    variant: "alert",
    terminalLines: ["$ ragas eval --scenarios 25", "25/25 scenarios validated", "latency: 4.5s -> 1.0s (7 guardrail scanners)"],
  },
  { project: cricket, category: "Earlier Work — Data Analysis", variant: "standard" },
];

export function Projects() {
  return (
    // No mx-auto/max-w-6xl/px-6 here (unlike every other section) — the
    // pinned horizontal slide needs to span the true viewport width so its
    // vw-based slide math lines up with what's actually on screen. Width
    // constraints are applied inside ProjectsSlider instead, per branch:
    // full-bleed for the pinned scene, centered for the stacked fallback.
    <section id="work" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="04"
          label="PROJECTS"
          title={
            <>
              SHIPPED<wbr />
              <Accent>_CODE</Accent>
            </>
          }
          note="Four real systems, designed and built end to end — not tutorials, not forks."
        />
      </div>

      <div className="mt-10">
        <ProjectsSlider slides={slides} />
      </div>
    </section>
  );
}
