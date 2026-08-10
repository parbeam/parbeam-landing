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

// v3 = v1 as the base, with v2's unique sections merged in.
export default function V3() {
  return (
    <>
      <Header
        homeHref="/v3"
        links={[
          { href: "#how", label: "How it works" },
          { href: "#streamers", label: "For streamers" },
          { href: "#stellar", label: "Built on Stellar" },
          { href: "#faq", label: "FAQ" },
        ]}
      />
      <main>
        {/* base: v1 hook */}
        <Hero />
        <StatBand />
        {/* v2: positioning */}
        <AudienceV2 />
        {/* v2: the operational flow (setup + tip + go live) */}
        <StepsV2 />
        {/* v2: verifiable payment flow */}
        <FlowV2 />
        {/* base: value props + dashboard proof */}
        <ForStreamers />
        {/* v2: fits existing platforms */}
        <PlatformsV2 />
        {/* v2: why Stellar */}
        <StellarV2 />
        {/* base: objection handling */}
        <Faq />
        {/* merged CTA */}
        <Waitlist
          eyebrow="Early access"
          heading="Turn every Stellar payment into a live moment."
          buttonLabel="Get early access"
        />
      </main>
      <Footer variants={[{ href: "/", label: "v1" }, { href: "/v2", label: "v2" }]} />
    </>
  );
}
