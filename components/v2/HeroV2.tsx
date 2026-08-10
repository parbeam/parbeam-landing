import BeamCanvas from "../BeamCanvas";

export default function HeroV2() {
  return (
    <div className="hero">
      <div className="wrap">
        <div className="eyebrow">The Stellar tipping layer for creators</div>
        <h1>
          Stellar payments.
          <br />
          Live on stream.
        </h1>
        <p className="sub">
          Accept tips from your audience through Stellar and turn every verified payment into a real-time stream
          interaction.
        </p>
        <div className="ctas">
          <a className="btn lg" href="#access">
            Create your creator page
          </a>
          <a className="btn lg ghost" href="#how">
            See how it works
          </a>
        </div>
        <div className="meta">
          <span><i />XLM &amp; Stellar assets</span>
          <span><i />On-chain verified</span>
          <span><i />Works with OBS</span>
          <span><i />Twitch, Kick &amp; YouTube</span>
        </div>
      </div>
      <BeamCanvas />
    </div>
  );
}
