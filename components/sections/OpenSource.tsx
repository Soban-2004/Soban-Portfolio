import { DiffCard } from "@/components/opensource/DiffCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Accent } from "@/components/shared/Accent";
import { openSource } from "@/lib/content";

export function OpenSource() {
  return (
    <section id="open-source" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        index="05"
        label="OSS"
        title={
          <>
            OPEN<wbr />
            <Accent>_SOURCE</Accent>
          </>
        }
        note="A scoped, well-tested bug fix — worth featuring for the process, not the scale."
      />
      <div className="mt-8">
        <DiffCard contribution={openSource} />
      </div>
    </section>
  );
}
