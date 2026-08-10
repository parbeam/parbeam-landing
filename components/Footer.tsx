import { Logo } from "./icons";

type Link = { href: string; label: string };

export default function Footer({ variants }: { variants?: Link[] }) {
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
          {variants?.map((v) => (
            <a href={v.href} key={v.href}>
              {v.label}
            </a>
          ))}
          <a href="mailto:hello@parbeam.xyz">hello@parbeam.xyz</a>
        </div>
      </div>
    </footer>
  );
}
