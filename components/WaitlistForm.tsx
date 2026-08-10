"use client";

import { useState } from "react";

type Role = "streamer" | "viewer";

export default function WaitlistForm() {
  const [role, setRole] = useState<Role>("streamer");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: send { email, role } to a real waitlist endpoint before launch.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-amber/40 bg-amber-soft px-6 py-8 text-center"
      >
        <p className="text-lg font-semibold text-ink">You are on the list.</p>
        <p className="mt-2 text-muted">
          We will email you at{" "}
          <span className="font-medium text-ink">{email}</span> when early
          access opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset>
        <legend className="sr-only">I am joining as a</legend>
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-surface p-1.5">
          {(
            [
              { value: "streamer", label: "I stream" },
              { value: "viewer", label: "I watch" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                role === option.value
                  ? "bg-amber text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={role === option.value}
                onChange={() => setRole(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink placeholder:text-muted/70 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-amber px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-deep focus:outline-none focus:ring-2 focus:ring-amber/40 focus:ring-offset-2 focus:ring-offset-cream"
        >
          Join the waitlist
        </button>
      </div>
      <p className="text-sm text-muted">
        No spam. One email when your invite is ready.
      </p>
    </form>
  );
}
