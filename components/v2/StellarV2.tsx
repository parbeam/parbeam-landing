export default function StellarV2() {
  return (
    <section id="stellar">
      <div className="wrap">
        <div className="eyebrow">Built on Stellar</div>
        <h2>Fast settlement, low cost, made for tipping.</h2>
        <p className="sub" style={{ maxWidth: "60ch" }}>
          Fast settlement and low transaction costs make Stellar well suited for frequent digital payments and creator
          tipping. Creators receive XLM and supported Stellar assets directly through their own wallets.
        </p>
        <div className="band" style={{ marginTop: 44 }}>
          <div>
            <b className="u">Seconds</b>
            <span>to settle a payment on Stellar</span>
          </div>
          <div>
            <b>Low cost</b>
            <span>transaction fees that suit frequent tips</span>
          </div>
          <div>
            <b>Self-custody</b>
            <span>funds arrive in the creator&apos;s own wallet</span>
          </div>
        </div>
      </div>
    </section>
  );
}
