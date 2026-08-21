import { PaperCard } from "@/components/research/PaperCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accent } from "@/components/shared/Accent";
import { research } from "@/lib/content";

export function Research() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        index="06"
        label="PAPERS"
        title={
          <>
            RE<wbr />
            <Accent>_SEARCH</Accent>
          </>
        }
        note="Co-authored, peer-reviewed work — not the main focus, but real."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {research.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    </section>
  );
}
