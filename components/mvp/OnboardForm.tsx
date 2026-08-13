"use client";

import { useEffect, useState } from "react";
import { connectWallet } from "@/lib/kit";

export default function OnboardForm() {
  const [address, setAddress] = useState("");
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [minXlm, setMinXlm] = useState("1");
  const [slugState, setSlugState] = useState<{ ok: boolean; msg: string } | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function connect() {
    setError("");
    setConnecting(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);
    } catch (e: any) {
      if (e?.message) setError(e.message);
    } finally {
      setConnecting(false);
    }
  }

  // Live slug availability check (debounced).
  useEffect(() => {
    const s = slug.trim().toLowerCase();
    if (!s) {
      setSlugState(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/streamers?slug=${encodeURIComponent(s)}`);
        const data = await res.json();
        setSlugState({ ok: !!data.available, msg: data.error || (data.available ? "Available" : "Taken") });
      } catch {
        setSlugState(null);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [slug]);

  async function submit() {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/streamers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, displayName, address, minXlm: Number(minXlm) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create your page.");
        setSubmitting(false);
        return;
      }
      window.location.href = `/dashboard/${data.slug}`;
    } catch (e: any) {
      setError(e?.message || "Network error");
      setSubmitting(false);
    }
  }

  const canSubmit =
    address && displayName.trim() && slug.trim() && slugState?.ok && !submitting;

  return (
    <div className="tipcard">
      <div className="eyebrow">For streamers · testnet</div>
      <h2>Create your tipping page</h2>
      <p className="tipsub">Connect your Stellar wallet, pick a link, and start taking tips on stream.</p>

      {!address ? (
        <button className="btn lg full" onClick={connect} disabled={connecting}>
          {connecting ? "Opening wallet…" : "Connect wallet"}
        </button>
      ) : (
        <>
          <p className="connected">
            Tips go to <code>{address.slice(0, 4)}…{address.slice(-4)}</code>
          </p>

          <label className="fld">
            <span>Your link</span>
            <div className="slugrow">
              <span className="slugpre">parbeam.xyz/to/</span>
              <input
                type="text"
                placeholder="yourname"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
              />
            </div>
          </label>
          {slug && slugState && (
            <p className={slugState.ok ? "okmsg" : "warn"}>{slugState.msg}</p>
          )}

          <label className="fld">
            <span>Display name</span>
            <input
              type="text"
              maxLength={40}
              placeholder="Caner"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>

          <label className="fld">
            <span>Minimum tip to show on stream (XLM)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={minXlm}
              onChange={(e) => setMinXlm(e.target.value)}
            />
          </label>

          <button className="btn lg full" disabled={!canSubmit} onClick={submit}>
            {submitting ? "Creating…" : "Create my page"}
          </button>
        </>
      )}

      {error && <p className="warn">{error}</p>}
      <p className="tipnote">Testnet only. Your wallet is both your login and where tips land.</p>
    </div>
  );
}
