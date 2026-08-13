import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStreamer } from "@/lib/registry";
import TipForm from "@/components/mvp/TipForm";
import AppNav from "@/components/AppNav";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = await getStreamer(params.slug);
  if (!s) return { title: "Not found — Parbeam" };
  return {
    title: `Tip ${s.displayName} — Parbeam`,
    description: `Tip ${s.displayName} on Stellar and see it live on their stream.`,
  };
}

export default async function TipPage({ params }: { params: { slug: string } }) {
  const streamer = await getStreamer(params.slug);
  if (!streamer) notFound();

  return (
    <>
      <AppNav />
      <main className="formpage">
        <TipForm streamer={streamer} />
      </main>
      <Footer />
    </>
  );
}
