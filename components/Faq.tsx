const items = [
  {
    q: "Do I need an account to donate?",
    a: "No. Open the streamer's page, connect your wallet, send. Your name and message travel with the donation. We never ask for your email.",
  },
  {
    q: "I don't have a crypto wallet. Can I still donate?",
    a: "Yes. You can create a wallet right on the donation page with your face or fingerprint, in a few seconds. You'll need to put some money in it first, and the page shows you how.",
  },
  {
    q: "Will my message really show up on stream?",
    a: "If it's above the streamer's minimum and passes their filters, yes: your name and your message, on stream, about five seconds after you hit send.",
  },
  {
    q: "How do streamers get the money?",
    a: "It lands directly in the streamer's own wallet the moment a viewer sends it. Parbeam never holds the money in between, so there is nothing to wait for and nothing that can be frozen.",
  },
  {
    q: "How do I set it up as a streamer?",
    a: "Log in with your Twitch or Kick account, connect your wallet, and paste one link into OBS. Hit the test button to see a fake alert fire in your preview. The whole thing takes about five minutes.",
  },
  {
    q: "How do I turn donations into cash?",
    a: "Send the money from your wallet to a crypto exchange, sell it, and withdraw to your bank. The dashboard walks you through it step by step. Or just leave it in your wallet; it's dollars, and it's yours.",
  },
  {
    q: "Which platforms does it work on?",
    a: "The alert overlay works anywhere OBS works: Twitch, Kick, YouTube. Streamer sign-in supports Twitch and Kick at launch.",
  },
  {
    q: "Can a donation be taken back?",
    a: "No. Once sent, it's final. That cuts both ways: donors should double-check before sending, and streamers never lose money to chargeback scams.",
  },
];

export default function Faq() {
  return (
    <section id="faq">
      <div className="wrap">
        <div className="faq-grid">
          <div>
            <div className="eyebrow">FAQ</div>
            <h2>Quick answers.</h2>
            <p className="sub" style={{ fontSize: 16 }}>
              Something else on your mind? Write to us. We&apos;re two developers, not a ticket queue.
            </p>
          </div>
          <div>
            {items.map((it, i) => (
              <details key={it.q} open={i === 0}>
                <summary>{it.q}</summary>
                <p>{it.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
