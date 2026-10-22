import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Stats } from "@/components/sections/Stats";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { OpenSource } from "@/components/sections/OpenSource";
import { Research } from "@/components/sections/Research";
import { Certifications } from "@/components/sections/Certifications";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { ConsoleEasterEgg } from "@/components/shared/ConsoleEasterEgg";
import { PageTransition } from "@/components/shared/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <ConsoleEasterEgg />
      <Hero />
      <About />
      <Stats />
      <Experience />
      <Projects />
      <OpenSource />
      <Research />
      <Certifications />
      <Skills />
      <Contact />
    </PageTransition>
  );
}
