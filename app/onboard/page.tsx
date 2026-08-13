import type { Metadata } from "next";
import OnboardForm from "@/components/mvp/OnboardForm";
import AppNav from "@/components/AppNav";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create your tipping page — Parbeam",
  description: "Connect your Stellar wallet and start taking tips live on stream.",
};

export default function OnboardPage() {
  return (
    <>
      <AppNav cta={false} />
      <main className="formpage">
        <OnboardForm />
      </main>
      <Footer />
    </>
  );
}
