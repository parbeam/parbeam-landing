import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getStreamer } from "@/lib/registry";
import { recentTips, EXPLORER_TX, EXPLORER_ACCT, type Tip } from "@/lib/stellar";
import { enrichTips } from "@/lib/intents";
import { Logo } from "@/components/icons";
import CopyField from "@/components/mvp/CopyField";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Dashboard({ params }: { params: { slug: string } }) {
  const streamer = await getStreamer(params.slug);
  if (!streamer) notFound();

  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "parbeam.xyz";
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;

  let tips: (Tip & { name?: string; message: string })[] = [];
  let tipError = "";
  try {
    tips = await enrichTips(await recentTips(streamer.address, 15));
  } catch {
    tipError = "Could not load tips from Stellar right now.";
  }

  const total = tips.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="dashwrap">
      <header className="dashhead">
        <a className="brand" href="/">
          <Logo />
          Parbeam
        </a>
        <a className="btn" href={`/to/${streamer.slug}`} target="_blank" rel="noopener">
          Open tip page
        </a>
      </header>

      <div className="dashgrid">
        <section className="dashcol">
          <div className="eyebrow">Dashboard</div>
          <h1 className="dashname">{streamer.displayName}</h1>
          <p className="tipsub">
            Wallet{" "}
            <a href={EXPLORER_ACCT(streamer.address)} target="_blank" rel="noopener">
              <code>{streamer.address.slice(0, 6)}…{streamer.address.slice(-6)}</code>
            </a>{" "}
            · min {streamer.minXlm} XLM
          </p>

          <div className="dashlinks">
            <CopyField label="Tip page (share with viewers)" value={`${base}/to/${streamer.slug}`} />
            <CopyField label="OBS browser source URL" value={`${base}/overlay/${streamer.slug}`} />
          </div>

          <div className="dashactions">
            <a className="btn ghost" href={`/overlay/${streamer.slug}?test=1`} target="_blank" rel="noopener">
              Send test alert
            </a>
            <span className="tipnote">Opens the overlay and fires a sample alert.</span>
          </div>

          <div className="setuphelp">
            <b>Add to OBS in 20 seconds</b>
            <ol>
              <li>OBS → Sources → add <b>Browser</b>.</li>
              <li>Paste your OBS browser source URL above.</li>
              <li>Set width 1920, height 1080. Done.</li>
            </ol>
          </div>
        </section>

        <section className="dashcol">
          <div className="statsrow">
            <div className="statbox">
              <b>{tips.length}</b>
              <span>recent tips</span>
            </div>
            <div className="statbox">
              <b>{total.toLocaleString()}</b>
              <span>XLM (recent)</span>
            </div>
          </div>

          <h2 className="feedh">Recent tips</h2>
          {tipError && <p className="warn">{tipError}</p>}
          {!tipError && tips.length === 0 && (
            <p className="tipsub">No tips yet. Share your tip page to get the first one.</p>
          )}
          <div className="feed">
            {tips.map((t) => (
              <a
                key={t.txHash}
                className="feedrow"
                href={EXPLORER_TX(t.txHash)}
                target="_blank"
                rel="noopener"
              >
                <div className="feedcoin">$</div>
                <div className="feedmain">
                  <div className="feedtop">
                    <b>{t.name || `${t.from.slice(0, 4)}…${t.from.slice(-4)}`}</b>
                    <span className="feedamt">{Number(t.amount).toLocaleString()} XLM</span>
                  </div>
                  {t.message && <div className="feedmsg">&ldquo;{t.message}&rdquo;</div>}
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
