import { Logo } from "./icons";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="l" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={20} />
          <span>Parbeam</span>
        </div>
        <nav className="r footlinks">
          <a href="/onboard">Create your page</a>
          <a href="/streamers">Streamers</a>
          <a href="/#how">How it works</a>
          <a href="/#faq">FAQ</a>
          <a href="mailto:hello@parbeam.xyz">Contact</a>
        </nav>
      </div>
      <div className="wrap footnote">
        Built on{" "}
        <a href="https://stellar.org" rel="noopener" style={{ color: "var(--dim)" }}>
          Stellar
        </a>{" "}
        · Testnet preview
      </div>
    </footer>
  );
}
