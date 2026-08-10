import { Logo } from "./icons";

export default function Header() {
  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="#">
          <Logo />
          Parbeam
        </a>
        <nav className="links">
          <a href="#donate">Donating</a>
          <a href="#streamers">For streamers</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="btn" href="#access">
          Get early access
        </a>
      </div>
    </header>
  );
}
