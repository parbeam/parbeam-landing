"use client";

import { useEffect, useRef } from "react";

type Coin = { x: number; v: number; r: number; col: string[]; a: number; fired?: boolean };

const donos: [string, string, string][] = [
  ["efe", "$25", '"came for the clip, stayed for this"'],
  ["nightowl", "$10", '"first wallet dono, that was fast"'],
  ["carla.mx", "$50", '"saludos desde México"'],
  ["zeynp", "$5", '"alert sesi çok iyi"'],
];

const coinCols = [
  ["#fcd34d", "#f59e0b", "#b45309"],
  ["#fdba74", "#f97316", "#c2410c"],
  ["#fda4af", "#ec4899", "#be185d"],
];

const ribbons = [
  { hue: "245,158,11", a1: 52, k1: 0.0042, s1: 0.0003, a2: 26, k2: 0.0091, s2: 0.00047, off: -0.05, w: 78, al: 0.42 },
  { hue: "249,115,22", a1: 44, k1: 0.0036, s1: 0.00022, a2: 30, k2: 0.0078, s2: 0.00036, off: 0.04, w: 56, al: 0.34 },
  { hue: "236,72,101", a1: 58, k1: 0.003, s1: 0.00026, a2: 20, k2: 0.0104, s2: 0.00052, off: 0.13, w: 40, al: 0.22 },
  { hue: "217,119,6", a1: 34, k1: 0.005, s1: 0.00034, a2: 16, k2: 0.012, s2: 0.0004, off: -0.13, w: 26, al: 0.3 },
];

export default function BeamCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mockRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLElement>(null);
  const amtRef = useRef<HTMLElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvasRef.current!;
    const cx = cv.getContext("2d")!;
    const mockEl = mockRef.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, meltX = 0, raf = 0, visible = true, di = 0;
    let coins: Coin[] = [];

    function fireToast() {
      di = (di + 1) % donos.length;
      const t = toastRef.current!;
      t.style.animation = "none";
      void t.offsetWidth;
      t.style.animation = "";
      nameRef.current!.textContent = donos[di][0];
      amtRef.current!.textContent = donos[di][1];
      msgRef.current!.textContent = donos[di][2];
    }

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.offsetWidth;
      H = cv.offsetHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      meltX = Math.max(mockEl.offsetLeft + 30, W * 0.34);
    }

    const r0 = ribbons[0];
    const railY = (x: number, t: number) =>
      H * 0.3 + H * r0.off + r0.a1 * Math.sin(x * r0.k1 + t * r0.s1) + r0.a2 * Math.sin(x * r0.k2 - t * r0.s2 + 1.7);

    function spawnCoin(x0?: number) {
      coins.push({
        x: x0 !== undefined ? x0 : -40 - Math.random() * 160,
        v: 1.55 + Math.random() * 0.5,
        r: 15 + Math.random() * 6,
        col: coinCols[(Math.random() * coinCols.length) | 0],
        a: 1,
      });
    }

    function drawCoin(c: Coin, t: number) {
      const y = railY(c.x, t) - c.r + 4;
      cx.save();
      cx.globalAlpha = c.a;
      cx.beginPath();
      cx.ellipse(c.x, railY(c.x, t) + 7, c.r * 0.75, 4, 0, 0, Math.PI * 2);
      cx.fillStyle = "rgba(25,23,19,.14)";
      cx.fill();
      const g = cx.createRadialGradient(c.x - c.r * 0.4, y - c.r * 0.45, c.r * 0.15, c.x, y, c.r * 1.15);
      g.addColorStop(0, c.col[0]);
      g.addColorStop(0.55, c.col[1]);
      g.addColorStop(1, c.col[2]);
      cx.beginPath();
      cx.arc(c.x, y, c.r, 0, Math.PI * 2);
      cx.fillStyle = g;
      cx.fill();
      cx.lineWidth = 1.4;
      cx.strokeStyle = "rgba(25,23,19,.28)";
      cx.stroke();
      const rot = c.x / (c.r * 1.6);
      cx.translate(c.x, y);
      cx.rotate(rot);
      cx.fillStyle = "rgba(255,255,255,.92)";
      cx.font = `700 ${Math.round(c.r * 1.05)}px ui-monospace, monospace`;
      cx.textAlign = "center";
      cx.textBaseline = "middle";
      cx.fillText("$", 0, 1);
      cx.rotate(-rot);
      cx.beginPath();
      cx.arc(-c.r * 0.38, -c.r * 0.42, c.r * 0.16, 0, Math.PI * 2);
      cx.fillStyle = "rgba(255,255,255,.5)";
      cx.fill();
      cx.restore();
    }

    function draw(t: number) {
      cx.clearRect(0, 0, W, H);
      cx.filter = "blur(14px)";
      for (const r of ribbons) {
        cx.beginPath();
        const yy = (x: number) =>
          H * 0.3 + H * r.off + r.a1 * Math.sin(x * r.k1 + t * r.s1) + r.a2 * Math.sin(x * r.k2 - t * r.s2 + 1.7);
        cx.moveTo(-40, yy(-40) - r.w / 2);
        for (let x = -40; x <= W + 40; x += 14) cx.lineTo(x, yy(x) - r.w / 2);
        for (let x = W + 40; x >= -40; x -= 14) cx.lineTo(x, yy(x) + r.w / 2);
        cx.closePath();
        const g = cx.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, `rgba(${r.hue},0)`);
        g.addColorStop(0.25, `rgba(${r.hue},${r.al})`);
        g.addColorStop(0.6, `rgba(${r.hue},${r.al * 0.85})`);
        g.addColorStop(1, `rgba(${r.hue},0)`);
        cx.fillStyle = g;
        cx.fill();
      }
      cx.filter = "none";
      cx.beginPath();
      for (let x = 0; x <= W; x += 10) {
        const y = railY(x, t);
        x === 0 ? cx.moveTo(x, y) : cx.lineTo(x, y);
      }
      const lg = cx.createLinearGradient(0, 0, W, 0);
      lg.addColorStop(0, "rgba(245,158,11,0)");
      lg.addColorStop(0.5, "rgba(245,158,11,.55)");
      lg.addColorStop(1, "rgba(245,158,11,0)");
      cx.strokeStyle = lg;
      cx.lineWidth = 1.6;
      cx.stroke();

      for (const c of coins) {
        c.x += c.v;
        if (c.x > meltX) {
          c.a -= 0.045;
          if (c.a <= 0.5 && !c.fired) {
            c.fired = true;
            fireToast();
          }
        }
        if (c.a > 0) drawCoin(c, t);
      }
      coins = coins.filter((c) => c.a > 0);
      if (coins.length < 4 && Math.random() < 0.03) spawnCoin();
    }

    size();
    window.addEventListener("resize", size);
    for (let k = 0; k < 4; k++) spawnCoin(-60 - k * 220);

    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
      });
      io.observe(cv);
    }

    if (reduced) {
      draw(9000);
    } else {
      const loop = (t: number) => {
        if (visible) draw(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", size);
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, []);

  return (
    <div className="stage" aria-hidden="true">
      <canvas id="beam" ref={canvasRef} />
      <div className="mockwrap" ref={mockRef}>
        <div className="screen">
          <div className="scene" />
          <div className="tag-live">LIVE</div>
          <div className="tag-view">14,382 watching</div>
          <div className="toast" ref={toastRef}>
            <div className="t1">
              <b ref={nameRef}>efe</b>
              <span className="amt" ref={amtRef}>$25</span>
            </div>
            <div className="t2" ref={msgRef}>&quot;came for the clip, stayed for this&quot;</div>
          </div>
          <div className="chatbar">
            <div><b>kaan_54:</b> LETSGO</div>
            <div><b>mirac:</b> alert hızına bak 😂</div>
            <div><b>zeynp:</b> ok that was instant</div>
          </div>
        </div>
      </div>
    </div>
  );
}
