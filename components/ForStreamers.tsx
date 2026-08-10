import { Check } from "./icons";

const benefits = [
  {
    title: "The money is instantly yours",
    body: "Every donation lands in your own wallet the second it's sent. There's no balance to withdraw, no payout day to wait for, and nobody who can freeze it.",
  },
  {
    title: "Your international viewers can finally donate",
    body: 'No more "payment not supported in your country". A wallet works from anywhere, so the fans you have abroad stop being spectators.',
  },
  {
    title: "You decide what airs",
    body: "Set a minimum amount for alerts, filter words you don't want on screen, block anyone. Small donations still reach your wallet, they just skip the screen.",
  },
  {
    title: "Five-minute setup, test included",
    body: "Log in with your Twitch or Kick account, paste one link into OBS, hit the test button, and watch a fake alert fire in your preview. Then you're live.",
  },
];

const feed = [
  { who: "efe", msg: '"came for the clip, stayed for this"', val: "$25" },
  { who: "nightowl", msg: '"first wallet dono, that was fast"', val: "$10" },
  { who: "zeynp", msg: '"alert sesi çok iyi"', val: "$5" },
  { who: "carla.mx", msg: '"saludos desde México"', val: "$50" },
];

export default function ForStreamers() {
  return (
    <section id="streamers">
      <div className="wrap">
        <div className="split">
          <div>
            <div className="eyebrow">For streamers</div>
            <h2>Set up once. Then just stream.</h2>
            <div className="checks">
              {benefits.map((b) => (
                <div className="row" key={b.title}>
                  <Check />
                  <div>
                    <b>{b.title}</b>
                    <p>{b.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dash">
            <div className="bar">
              <i />
              <i />
              <i />
              <span>parbeam.xyz/dashboard</span>
            </div>
            {feed.map((f) => (
              <div className="drow" key={f.who}>
                <div>
                  <div className="who">{f.who}</div>
                  <div className="msg">{f.msg}</div>
                </div>
                <div className="val">
                  <b>{f.val}</b>
                  <span>in your wallet</span>
                </div>
              </div>
            ))}
            <div className="foot">
              <span className="chip on">Send test alert</span>
              <span className="chip">Min: $5</span>
              <span className="chip">Word filter: on</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
