import type { Metadata } from "next";
import { listStreamers } from "@/lib/registry";
import AppNav from "@/components/AppNav";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Streamers on Parbeam",
  description: "Streamers taking tips on Stellar with Parbeam. Find your streamer and tip them live.",
};

export default async function StreamersPage() {
  let streamers: Awaited<ReturnType<typeof listStreamers>> = [];
  try {
    streamers = await listStreamers(120);
  } catch {
    streamers = [];
  }

  return (
    <>
      <AppNav />
      <main className="pagewrap">
        <div className="pagehead">
          <div className="eyebrow">Directory</div>
          <h1>Streamers on Parbeam</h1>
          <p className="sub">Pick a streamer and tip them live on stream. Or create your own page.</p>
        </div>

        {streamers.length === 0 ? (
          <div className="emptybox">
            <p>No streamers yet. Be the first.</p>
            <a className="btn lg" href="/onboard">Create your page</a>
          </div>
        ) : (
          <div className="streamergrid">
            {streamers.map((s) => (
              <a className="streamercard" key={s.slug} href={`/to/${s.slug}`}>
                <div className="streameravatar">{s.displayName.slice(0, 1).toUpperCase()}</div>
                <div className="streamermeta">
                  <b>{s.displayName}</b>
                  <span>/to/{s.slug}</span>
                </div>
                <span className="streamertip">Tip →</span>
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
