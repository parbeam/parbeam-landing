"use client";

import { useEffect, useState } from "react";

const DONATIONS = [
  { name: "aysel", amount: "5 USDC", message: "that clutch was insane 🔥" },
  { name: "novafox", amount: "25 XLM", message: "keep the run going!" },
  { name: "kerem", amount: "10 USDC", message: "gg from the night shift" },
];

const CHAT_LINES = [
  { user: "moonpanda", text: "LETS GOOO" },
  { user: "salih", text: "did everyone see that??" },
  { user: "grit_", text: "clip it clip it" },
  { user: "vera", text: "W streamer" },
  { user: "moonpanda", text: "alert popped instantly wow" },
];

const CYCLE_MS = 6000;
const COIN_MS = 1600;

export default function StreamMock() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"coin" | "alert">("alert");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    setPhase("coin");
    const toAlert = setTimeout(() => setPhase("alert"), COIN_MS);
    const next = setTimeout(() => {
      setIndex((i) => (i + 1) % DONATIONS.length);
    }, CYCLE_MS);
    return () => {
      clearTimeout(toAlert);
      clearTimeout(next);
    };
  }, [index, reducedMotion]);

  const donation = DONATIONS[index];
  const showAlert = reducedMotion || phase === "alert";

  return (
    <div aria-hidden="true" className="relative select-none">
      {/* Beam the coin travels along, from the viewer's side into the stream */}
      {!reducedMotion && (
        <div className="absolute -left-10 top-1/2 hidden h-px w-[240px] -translate-y-1/2 bg-gradient-to-r from-transparent via-amber to-transparent animate-beam-glow lg:block" />
      )}
      {!reducedMotion && phase === "coin" && (
        <div
          key={`coin-${index}`}
          className="absolute -left-10 top-1/2 hidden -translate-y-1/2 animate-coin-travel lg:flex"
          style={{ "--coin-distance": "230px" } as React.CSSProperties}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-deep bg-amber text-sm font-bold text-white shadow-md">
            $
          </span>
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-line bg-[#17130c] shadow-2xl shadow-amber/10">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/90 px-2 py-0.5 font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              LIVE
            </span>
            <span>4,213 watching</span>
          </div>
        </div>

        {/* Video area */}
        <div className="relative aspect-video bg-gradient-to-br from-[#2b2416] via-[#1d1810] to-[#0f0c07]">
          {/* Fake gameplay shapes */}
          <div className="absolute left-6 top-8 h-16 w-16 rounded-lg bg-white/5" />
          <div className="absolute right-10 top-14 h-10 w-24 rounded-md bg-white/5" />
          <div className="absolute bottom-16 left-1/3 h-8 w-8 rounded-full bg-amber/20" />

          {/* Donation alert */}
          {showAlert && (
            <div
              key={`alert-${index}`}
              className="absolute left-1/2 top-6 w-[78%] max-w-sm -translate-x-1/2 animate-alert-pop"
            >
              <div className="rounded-xl border border-amber/40 bg-black/80 px-4 py-3 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber text-sm font-bold text-white">
                    $
                  </span>
                  <p className="text-sm font-semibold text-white">
                    <span className="text-amber">{donation.name}</span> sent{" "}
                    {donation.amount}
                  </p>
                </div>
                <p className="mt-1.5 pl-[42px] text-sm text-white/80">
                  {donation.message}
                </p>
              </div>
            </div>
          )}

          {/* Streamer cam placeholder */}
          <div className="absolute bottom-4 right-4 flex h-20 w-28 items-center justify-center rounded-lg border border-white/10 bg-[#241d12]">
            <div className="flex flex-col items-center gap-1">
              <span className="h-8 w-8 rounded-full bg-white/15" />
              <span className="h-1.5 w-12 rounded bg-white/10" />
            </div>
          </div>
        </div>

        {/* Chat strip */}
        <div className="space-y-1.5 border-t border-white/10 px-4 py-3">
          {CHAT_LINES.slice(0, 3).map((line, i) => (
            <p key={i} className="truncate text-xs text-white/50">
              <span className="font-semibold text-white/70">{line.user}:</span>{" "}
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
