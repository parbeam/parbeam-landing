# Parbeam Landing

Landing page for Parbeam: crypto tips for streamers, built on Stellar. Viewers send USDC or XLM from their own wallet and the streamer's OBS overlay shows their name and message a few seconds later. The money goes straight to the streamer's wallet.

Built with Next.js (App Router) and Tailwind CSS.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

The page is fully static, so it deploys as-is on Vercel or Netlify.

## Notes

- The waitlist form currently only shows an inline success state. Before launch, wire it to a real endpoint that receives `{ email, role }` (see the TODO in `components/WaitlistForm.tsx`).
- Copy rules for this site: no currency amounts in Turkish lira, no fee or commission talk, no sound or clip feature promises, plain donor and streamer language.
