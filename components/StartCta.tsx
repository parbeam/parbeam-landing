export default function StartCta() {
  return (
    <section id="access" style={{ borderTop: "none", paddingTop: 0 }}>
      <div className="wrap">
        <div className="cta-band">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Live on testnet
          </div>
          <h2>Create your tipping page in two minutes.</h2>
          <p className="ctasub">
            Connect your Stellar wallet, share your link, and take tips live on stream. No account, no fees to set up.
          </p>
          <div className="ctarow">
            <a className="btn lg" href="/onboard">
              Create your page
            </a>
            <a className="btn lg ghost light" href="/streamers">
              See streamers
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
