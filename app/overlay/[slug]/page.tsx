import { notFound } from "next/navigation";
import { getStreamer } from "@/lib/registry";
import Overlay from "@/components/mvp/Overlay";

// OBS browser source URL: /overlay/<slug>
export default function OverlayPage({ params }: { params: { slug: string } }) {
  const streamer = getStreamer(params.slug);
  if (!streamer) notFound();
  return <Overlay slug={streamer.slug} />;
}
