import { notFound } from "next/navigation";
import { getStreamer } from "@/lib/registry";
import Overlay from "@/components/mvp/Overlay";

// OBS browser source URL: /overlay/<slug>   (add ?test=1 to preview an alert)
export default async function OverlayPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { test?: string };
}) {
  const streamer = await getStreamer(params.slug);
  if (!streamer) notFound();
  return <Overlay slug={streamer.slug} test={searchParams.test === "1"} />;
}
