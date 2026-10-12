# didz-landing — the didz.io public landing page

Static marketing site for **didz.io**, built with Vite + React + TypeScript.
Standalone package (own lockfile) — deliberately NOT part of the Yarn
workspace graph so Vercel can build it without resolving the Midnight SDK
dependency tree.

## Status

The site is honest-by-design: a sticky banner on every scroll position states
that DIDz is in active development and the DApp is not yet live.

## Commands

```bash
npm install     # first time
npm run dev     # local dev server (default :5173)
npm run build   # typecheck + static build → dist/
npm run preview # serve the production build locally
```

## Deploy

Vercel auto-detects Vite. Point the project root at `didz-landing/` —
no env vars, no serverless functions needed. `didz.io` DNS currently points
at the Hostinger Website Builder site; flip the A/CNAME records in Hostinger
DNS when this build is ready to take over.

## Media

All images are optimized WebP (≤1600px) derived from `../media/` originals
per the monolith media rules. Source originals stay in `../media/`.
