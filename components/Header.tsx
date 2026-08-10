import { Logo } from "./icons";

type NavLink = { href: string; label: string };

const defaultLinks: NavLink[] = [
  { href: "#donate", label: "Donating" },
  { href: "#streamers", label: "For streamers" },
  { href: "#faq", label: "FAQ" },
];

export default function Header({
  links = defaultLinks,
  ctaHref = "#access",
  ctaLabel = "Get early access",
  homeHref = "/",
}: {
  links?: NavLink[];
  ctaHref?: string;
  ctaLabel?: string;
  homeHref?: string;
}) {
  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href={homeHref}>
          <Logo />
          Parbeam
        </a>
        <nav className="links">
          {links.map((l) => (
            <a href={l.href} key={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn" href={ctaHref}>
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
