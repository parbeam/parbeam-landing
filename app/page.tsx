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
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

// Homepage: the merged landing (v1 base + v2 sections). Earlier variants live at /v1 and /v2.
export default function Home() {
  return (
    <>
      <Header
        links={[
          { href: "#how", label: "How it works" },
          { href: "#streamers", label: "For streamers" },
          { href: "#stellar", label: "Built on Stellar" },
          { href: "#faq", label: "FAQ" },
        ]}
      />
      <main>
        <Hero />
        <StatBand />
        <AudienceV2 />
        <StepsV2 />
        <FlowV2 />
        <ForStreamers />
        <PlatformsV2 />
        <StellarV2 />
        <Faq />
        <Waitlist
          eyebrow="Early access"
          heading="Turn every Stellar payment into a live moment."
          buttonLabel="Get early access"
        />
      </main>
      <Footer variants={[{ href: "/v1", label: "v1" }, { href: "/v2", label: "v2" }]} />
    </>
  );
}
