"use client";

import { useState } from "react";

export default function Waitlist({
  eyebrow = "Early access",
  heading = "The first 50 streamers get Parbeam free, for life.",
  buttonLabel = "Join the pilot",
}: {
  eyebrow?: string;
  heading?: string;
  buttonLabel?: string;
}) {
  const [done, setDone] = useState<{ role: string; email: string } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // TODO: POST to Formspree/Tally endpoint before deploy — send role + email.
    setDone({
      role: String(data.get("role") || "streamer"),
      email: String(data.get("email") || ""),
    });
  }

  return (
    <section id="access" style={{ borderTop: "none", paddingTop: 0 }}>
      <div className="wrap">
        <div className="cta-band">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {eyebrow}
          </div>
          <h2>{heading}</h2>

          {done ? (
            <p className="ok">
              You&apos;re on the list as a <b>{done.role}</b>. We&apos;ll write to <b>{done.email}</b> when your invite
              is ready.
            </p>
          ) : (
            <>
              <form onSubmit={onSubmit}>
                <div className="role" role="radiogroup" aria-label="I am a">
                  <label>
                    <input type="radio" name="role" value="streamer" defaultChecked />
                    <span>I&apos;m a streamer</span>
                  </label>
                  <label>
                    <input type="radio" name="role" value="viewer" />
                    <span>I&apos;m a viewer</span>
                  </label>
                </div>
                <div className="frow">
                  <input type="email" name="email" placeholder="you@example.com" required aria-label="Email" />
                  <button className="btn lg" type="submit">
                    {buttonLabel}
                  </button>
                </div>
              </form>
              <p className="fine">
                Streamers and viewers welcome. One email when your invite is ready, nothing else.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
