import BeamCanvas from "./BeamCanvas";

export default function Hero() {
  return (
    <div className="hero">
      <div className="wrap">
        <div className="eyebrow">Support your streamer, live</div>
        <h1>
          Donate from your wallet.
          <br />
          Seen on stream in seconds.
        </h1>
        <p className="sub">
          Send a donation from your crypto wallet. Your name and message pop up on the stream about five seconds later,
          in front of everyone. The streamer gets the money instantly and keeps it.
        </p>
        <div className="ctas">
          <a className="btn lg" href="#access">
            Get early access
          </a>
          <a className="btn lg ghost" href="#donate">
            How it works
          </a>
        </div>
        <div className="meta">
          <span><i />Your name on stream</span>
          <span><i />Money goes straight to the streamer</span>
          <span><i />Works with OBS</span>
          <span><i />Twitch &amp; Kick</span>
        </div>
      </div>
      <BeamCanvas />
    </div>
  );
}
