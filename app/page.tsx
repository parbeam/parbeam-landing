import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatBand from "@/components/StatBand";
import Donating from "@/components/Donating";
import ForStreamers from "@/components/ForStreamers";
import Faq from "@/components/Faq";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatBand />
        <Donating />
        <ForStreamers />
        <Faq />
        <Waitlist />
      </main>
      <Footer variants={[{ href: "/v2", label: "v2" }, { href: "/v3", label: "v3" }]} />
    </>
  );
}
