# Parbeam — Web

Landing page for Parbeam, the donation layer for live streaming on Stellar. Built with Next.js (App Router) and TypeScript.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

## Structure

- `app/` — App Router entry (`layout.tsx`, `page.tsx`) and global styles.
- `components/` — one component per section: `Header`, `Hero` (+ `BeamCanvas`), `StatBand`, `Donating`, `ForStreamers`, `Faq`, `Waitlist`, `Footer`.
- `BeamCanvas` and `Waitlist` are client components; everything else renders on the server.

## Before deploy

Wire the waitlist form in `components/Waitlist.tsx` to a real endpoint (Formspree/Tally) and send the selected role along with the email. See the `TODO` in that file.
