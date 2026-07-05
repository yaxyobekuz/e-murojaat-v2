import SarnovulHero from "../components/SarnovulHero";
import SarnovulMapCard from "../components/SarnovulMapCard";
import SectionNav from "../components/SectionNav";
import Reveal from "../components/Reveal";
import ElektrSection from "../components/ElektrSection";
import GazSection from "../components/GazSection";
import InternetSection from "../components/InternetSection";
import ObodonSection from "../components/ObodonSection";
import MskSection from "../components/MskSection";
import TalimSection from "../components/TalimSection";
import YoshlarSection from "../components/YoshlarSection";

const SarnovulDashboardPage = () => (
  <div className="flex flex-col gap-6">
    {/* hero 4 ustundan 3 tasini, mahalla mini xaritasi 1 tasini egallaydi */}
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <SarnovulHero />
      </div>
      <SarnovulMapCard />
    </div>
    <SectionNav />

    <section id="infratuzilma" className="flex scroll-mt-32 flex-col gap-8">
      <Reveal>
        <ElektrSection />
      </Reveal>
      <Reveal>
        <GazSection />
      </Reveal>
      <Reveal>
        <InternetSection />
      </Reveal>
    </section>

    <section id="obodonlashtirish" className="scroll-mt-32">
      <Reveal>
        <ObodonSection />
      </Reveal>
    </section>

    <section id="msk" className="scroll-mt-32">
      <Reveal>
        <MskSection />
      </Reveal>
    </section>

    <section id="talim" className="scroll-mt-32">
      <Reveal>
        <TalimSection />
      </Reveal>
    </section>

    <section id="yoshlar" className="scroll-mt-32 pb-8">
      <Reveal>
        <YoshlarSection />
      </Reveal>
    </section>
  </div>
);

export default SarnovulDashboardPage;
