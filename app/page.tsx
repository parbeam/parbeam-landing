import StreamMock from "@/components/StreamMock";
import WaitlistForm from "@/components/WaitlistForm";

const VIEWER_STEPS = [
  {
    title: "Open the tip link",
    body: "Every streamer on Parbeam has a simple link. Open it from any browser, no app to install.",
  },
  {
    title: "Send with your wallet",
    body: "Pick an amount in USDC or XLM, write your message, and confirm from your own wallet or with a passkey.",
  },
  {
    title: "See it on stream",
    body: "A few seconds later your name and message pop up on the broadcast for everyone to see.",
  },
];

const STREAMER_STEPS = [
  {
    title: "Connect your channel",
    body: "Sign in with Twitch or Kick and tell us which Stellar wallet your tips should land in.",
  },
  {
    title: "Add one link to OBS",
    body: "Drop your overlay link into OBS as a browser source. Press the test button and watch a sample alert fire.",
  },
  {
    title: "Share and go live",
    body: "Put your tip link in your bio and panels. Every tip shows up on stream and in your dashboard.",
  },
];

const FEATURES = [
  {
    title: "Straight to your wallet",
    body: "Tips land in your own Stellar wallet the moment they are sent. We never hold your money.",
  },
  {
    title: "On screen in seconds",
    body: "Alerts show up while the moment is still happening, usually within about five seconds.",
  },
  {
    title: "Works with your setup",
    body: "One browser source link works in OBS and any streaming software that accepts one.",
  },
  {
    title: "Test before you go live",
    body: "Fire a sample alert any time to check position, size, and timing on your overlay.",
  },
  {
    title: "USDC and XLM",
    body: "Viewers can send digital dollars or lumens, whichever they already hold.",
  },
  {
    title: "A dashboard that keeps up",
    body: "See every tip, who sent it, and what they said, all in one place.",
  },
];

const FAQS = [
  {
    q: "Where does the money go?",
    a: "Directly to the Stellar wallet address you set when you sign up. Parbeam never holds your tips, so there is nothing to withdraw and nothing to wait for.",
  },
  {
    q: "Which platforms are supported?",
    a: "Twitch and Kick at launch. Your overlay works anywhere OBS does, so the alert side is not tied to any one platform.",
  },
  {
    q: "What can viewers send?",
    a: "USDC and XLM on the Stellar network. Both arrive in seconds and cost almost nothing to send.",
  },
  {
    q: "Do my viewers need to know crypto?",
    a: "Parbeam is built for viewers who already have a Stellar wallet. For them, sending a tip takes a few taps. Viewers who are new to it can set up a wallet in a few minutes with a passkey.",
  },
  {
    q: "How fast do alerts appear?",
    a: "Usually around five seconds from the moment a viewer confirms to the alert showing on your stream.",
  },
  {
    q: "Does it work with my streaming software?",
    a: "Yes. If your software accepts a browser source, like OBS does, the overlay works. You paste one link and you are done.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-amber">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg text-muted">{lead}</p>}
    </div>
  );
}

function StepList({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <ol className="space-y-6">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-soft text-sm font-bold text-amber-deep">
            {i + 1}
          </span>
          <div>
            <h4 className="font-semibold text-ink">{step.title}</h4>
            <p className="mt-1 text-muted">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <a href="#" className="text-xl font-bold tracking-tight text-ink">
          par<span className="text-amber">beam</span>
        </a>
        <a
          href="#waitlist"
          className="rounded-xl bg-amber px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-deep"
        >
          Join the waitlist
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-2 lg:gap-16 lg:pt-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-amber" />
            Built on Stellar. Launching with Twitch and Kick.
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Crypto tips your viewers can actually{" "}
            <span className="text-amber">see</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Viewers send USDC or XLM from their own wallet. A few seconds
            later, their name and message light up your stream. The money goes
            straight to your wallet, not ours.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#waitlist"
              className="rounded-xl bg-amber px-6 py-3.5 font-semibold text-white transition-colors hover:bg-amber-deep"
            >
              Join the waitlist
            </a>
            <a
              href="#how-it-works"
              className="rounded-xl border border-line bg-surface px-6 py-3.5 font-semibold text-ink transition-colors hover:border-amber/50"
            >
              See how it works
            </a>
          </div>
        </div>
        <StreamMock />
      </section>

      {/* Problem */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            A wallet address in your bio is where tips go to die.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Plenty of streamers already accept crypto. They paste an address
            into their bio and hope. But nothing ever shows up on stream, chat
            never notices, and so almost nobody sends anything. Parbeam takes
            the tip you were already willing to receive and turns it into a
            moment the whole stream watches.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="How it works"
          title="Simple on both sides of the screen"
        />
        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-2xl border border-line bg-surface p-8">
            <h3 className="text-lg font-bold text-ink">If you watch streams</h3>
            <div className="mt-6">
              <StepList steps={VIEWER_STEPS} />
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-8">
            <h3 className="text-lg font-bold text-ink">If you stream</h3>
            <div className="mt-6">
              <StepList steps={STREAMER_STEPS} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="What you get"
            title="Everything a tip needs to become a moment"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-line bg-cream p-6"
              >
                <h3 className="font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-muted">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-6 py-20">
        <SectionHeading eyebrow="FAQ" title="Questions people ask us" />
        <div className="mt-12 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-line bg-surface px-6 py-4 open:pb-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="text-xl text-amber transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-xl px-6 py-20">
          <SectionHeading
            eyebrow="Early access"
            title="Get in before the crowd"
            lead="We are opening Parbeam to a small group first. Tell us who you are and we will save you a spot."
          />
          <div className="mt-10">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted sm:flex-row">
          <p>
            <span className="font-semibold text-ink">parbeam</span> · Built on
            Stellar
          </p>
          <p>© {new Date().getFullYear()} Parbeam</p>
        </div>
      </footer>
    </main>
  );
}
