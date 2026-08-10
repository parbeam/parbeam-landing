const steps = [
  {
    k: "01",
    title: "Open their page",
    body: "Every streamer has a Parbeam link. Tap it, connect your wallet, done. No account, no sign-up, no email.",
  },
  {
    k: "02",
    title: "Send what you want",
    body: "Pick an amount, write your message, hit send. If you don't have a wallet yet, you can create one on the spot with your face or fingerprint.",
  },
  {
    k: "03",
    title: "Get your moment",
    body: "Your name and message hit the stream, the chat reacts, the streamer reads it out. That's the whole reason we built this.",
  },
];

export default function Donating() {
  return (
    <section id="donate">
      <div className="wrap">
        <div className="eyebrow">Donating</div>
        <h2>Your moment on stream, three steps away.</h2>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.k}>
              <div className="k">{s.k}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
