# tailwind-palette-gen-playground

Minimal Vite + React app that exposes the palette generator as a live web UI.

This is a separate package from the main `tailwind-palette-gen` library so it
can pull in browser-only deps (Vite, React, Tailwind v4) without forcing them
on library consumers.

```bash
cd playground
npm install
npm run dev
```

## Deploy

The playground deploys as a static site to Vercel. The `vercel.json` in
this folder pins the framework preset and output directory; pointing a
Vercel project at the `playground/` subfolder is the only setup needed.
