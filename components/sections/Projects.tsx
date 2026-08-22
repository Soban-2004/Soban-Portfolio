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
  { project: resumeMatcher, category: "Full-Stack RAG Platform", variant: "info" },
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
    // Standard section wrapper now (mx-auto max-w-6xl px-6, matching every
    // other section) — used to be deliberately full-bleed here because the
    // old scroll-jacked horizontal slide needed to span the true viewport
    // width for its vw-based slide math. The carousel that replaced it
    // (ProjectsSlider) doesn't drive anything off viewport units, so
    // there's no reason left for Projects to be the one section laid out
    // differently from the rest.
    <section id="work" className="mx-auto max-w-6xl px-6 py-12 sm:py-24">
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

      <div className="mt-4 sm:mt-10">
        <ProjectsSlider slides={slides} />
      </div>
    </section>
  );
}
