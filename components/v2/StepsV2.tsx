const steps = [
  {
    k: "01",
    title: "Create your creator page",
    body: "Connect your Stellar wallet and choose the assets and minimum tip amounts you want to accept.",
  },
  {
    k: "02",
    title: "Add your stream alert",
    body: "Add your personal browser-source URL to OBS or compatible streaming software.",
  },
  {
    k: "03",
    title: "Receive a tip",
    body: "Your viewer opens your tipping page, connects a supported Stellar wallet, adds an amount and message, and confirms the payment.",
  },
  {
    k: "04",
    title: "Go live",
    body: "Once the Stellar payment is verified, the corresponding alert appears directly on your stream.",
  },
];

export default function StepsV2() {
  return (
    <section id="how">
      <div className="wrap">
        <div className="eyebrow">How it works</div>
        <h2>From wallet to stream in seconds.</h2>
        <div className="steps four">
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
