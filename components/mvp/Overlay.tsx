"use client";

import { useEffect, useRef, useState } from "react";
import type { Tip } from "@/lib/stellar";

type AlertItem = { key: string; who: string; amount: string; message: string };

const short = (a: string) => `${a.slice(0, 4)}…${a.slice(-4)}`;

export default function Overlay({ slug, test = false }: { slug: string; test?: boolean }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const cursorRef = useRef<string | null>(null);
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    // OBS browser source wants a transparent page.
    document.body.style.background = "transparent";
    let stop = false;

    if (test) {
      const demo: AlertItem = {
        key: "test-alert",
        who: "Parbeam",
        amount: "25",
        message: "test alert 🎉",
      };
      setAlerts([demo]);
      setTimeout(() => setAlerts((a) => a.filter((x) => x.key !== demo.key)), 7000);
    }

    async function tick() {
      try {
        const url = cursorRef.current
          ? `/api/events?slug=${encodeURIComponent(slug)}&cursor=${encodeURIComponent(cursorRef.current)}`
          : `/api/events?slug=${encodeURIComponent(slug)}`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        if (data.cursor) cursorRef.current = data.cursor;
        const tips: Tip[] = data.tips || [];
        for (const t of tips) {
          if (seen.current.has(t.txHash)) continue;
          seen.current.add(t.txHash);
          const item: AlertItem = {
            key: t.txHash,
            who: t.name || short(t.from),
            amount: t.amount,
            message: t.message ?? t.memo ?? "",
          };
          setAlerts((a) => [...a, item]);
          setTimeout(() => {
            setAlerts((a) => a.filter((x) => x.key !== item.key));
          }, 7000);
        }
      } catch {
        // network hiccup — try again next tick
      }
      if (!stop) setTimeout(tick, 3000);
    }
    tick();
    return () => {
      stop = true;
    };
  }, [slug, test]);

  return (
    <div className="ov-root">
      {alerts.map((a) => (
        <div className="ov-alert" key={a.key}>
          <div className="ov-coin">$</div>
          <div className="ov-body">
            <div className="ov-line">
              <b>{a.who}</b> tipped{" "}
              <span className="ov-amt">{Number(a.amount).toLocaleString()} XLM</span>
            </div>
            {a.message && <div className="ov-msg">&ldquo;{a.message}&rdquo;</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
