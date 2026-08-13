import { Logo } from "./icons";

// Sticky top bar for the app + content pages (onboard, dashboard, tip, streamers).
export default function AppNav({ cta = true }: { cta?: boolean }) {
  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="/">
          <Logo />
          Parbeam
        </a>
        <nav className="links">
          <a href="/streamers">Streamers</a>
          <a href="/#how">How it works</a>
        </nav>
        {cta && (
          <a className="btn" href="/onboard">
            Create your page
          </a>
        )}
      </div>
    </header>
  );
}
