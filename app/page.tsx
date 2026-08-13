import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatBand from "@/components/StatBand";
import AudienceV2 from "@/components/v2/AudienceV2";
import StepsV2 from "@/components/v2/StepsV2";
import FlowV2 from "@/components/v2/FlowV2";
import ForStreamers from "@/components/ForStreamers";
import PlatformsV2 from "@/components/v2/PlatformsV2";
import StellarV2 from "@/components/v2/StellarV2";
import Faq from "@/components/Faq";
import StartCta from "@/components/StartCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header
        links={[
          { href: "#how", label: "How it works" },
          { href: "/streamers", label: "Streamers" },
          { href: "#stellar", label: "Built on Stellar" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaLabel="Create your page"
        ctaHref="/onboard"
      />
      <main>
        <Hero
          primary={{ label: "Create your page", href: "/onboard" }}
          secondary={{ label: "How it works", href: "#how" }}
        />
        <StatBand />
        <AudienceV2 />
        <StepsV2 />
        <FlowV2 />
        <ForStreamers />
        <PlatformsV2 />
        <StellarV2 />
        <Faq />
        <StartCta />
      </main>
      <Footer />
    </>
  );
}
