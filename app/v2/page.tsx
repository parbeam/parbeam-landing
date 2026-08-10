import Header from "@/components/Header";
import HeroV2 from "@/components/v2/HeroV2";
import AudienceV2 from "@/components/v2/AudienceV2";
import StepsV2 from "@/components/v2/StepsV2";
import FlowV2 from "@/components/v2/FlowV2";
import PlatformsV2 from "@/components/v2/PlatformsV2";
import StellarV2 from "@/components/v2/StellarV2";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function V2() {
  return (
    <>
      <Header
        homeHref="/v2"
        links={[
          { href: "#how", label: "How it works" },
          { href: "#platforms", label: "Platforms" },
          { href: "#stellar", label: "Built on Stellar" },
        ]}
        ctaLabel="Join Early Access"
      />
      <main>
        <HeroV2 />
        <AudienceV2 />
        <StepsV2 />
        <FlowV2 />
        <PlatformsV2 />
        <StellarV2 />
        <Waitlist
          eyebrow="Early access"
          heading="Turn every Stellar payment into a live moment."
          buttonLabel="Join Early Access"
        />
      </main>
      <Footer variants={[{ href: "/", label: "home" }, { href: "/v1", label: "v1" }]} />
    </>
  );
}
