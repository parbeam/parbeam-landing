import { Logo } from "./icons";

export default function Footer({ switchTo }: { switchTo?: { href: string; label: string } }) {
  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="l" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={20} />
          <span>
            Parbeam, built on{" "}
            <a href="https://stellar.org" rel="noopener" style={{ color: "var(--dim)" }}>
              Stellar
            </a>
          </span>
        </div>
        <div className="r">
          {switchTo && <a href={switchTo.href}>{switchTo.label}</a>}
          <a href="mailto:hello@parbeam.xyz">hello@parbeam.xyz</a>
          <a href="#faq">FAQ</a>
        </div>
      </div>
    </footer>
  );
}
