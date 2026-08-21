import { TechGraph } from "@/components/skills/TechGraph";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accent } from "@/components/shared/Accent";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        index="08"
        label="TOOLKIT"
        title={
          <>
            SKILL<wbr />
            <Accent>_GRAPH</Accent>
          </>
        }
        note="Grouped by area, connected to the projects that actually used them."
      />
      <div className="mt-10">
        <TechGraph />
      </div>
    </section>
  );
}
