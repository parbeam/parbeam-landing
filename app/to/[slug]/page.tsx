import { notFound } from "next/navigation";
import { getStreamer } from "@/lib/registry";
import TipForm from "@/components/mvp/TipForm";
import { Logo } from "@/components/icons";

export default function TipPage({ params }: { params: { slug: string } }) {
  const streamer = getStreamer(params.slug);
  if (!streamer) notFound();

  return (
    <div className="tipwrap">
      <a className="brand tipbrand" href="/">
        <Logo />
        Parbeam
      </a>
      <TipForm streamer={streamer} />
    </div>
  );
}
