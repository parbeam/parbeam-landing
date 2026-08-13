const nodes = [
  { k: "Step 1", label: "Payment Intent" },
  { k: "Step 2", label: "Stellar Transaction" },
  { k: "Step 3", label: "On-Chain Verification" },
  { k: "Step 4", label: "Real-Time Creator Event" },
];

export default function FlowV2() {
  return (
    <section id="flow">
      <div className="wrap">
        <div className="eyebrow">Under the hood</div>
        <h2>More than a payment page.</h2>
        <p className="sub" style={{ maxWidth: "56ch" }}>
          Every streamer tip follows a verifiable payment flow.
        </p>
        <div className="flow">
          {nodes.map((n, i) => (
            <div key={n.label} style={{ display: "contents" }}>
              <div className="node">
                <span className="kk">{n.k}</span>
                <b>{n.label}</b>
              </div>
              {i < nodes.length - 1 && (
                <div className="arrow" aria-hidden="true">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="flow-note">The payment itself becomes the source of truth for the stream interaction.</p>
      </div>
    </section>
  );
}
