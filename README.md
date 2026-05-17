# Dinner With Anyone

AI-powered expert conversations with world-class advisors — available on demand for operators, founders, executives, and enterprise teams.

This repository contains the marketing landing page for **Dinner With Anyone**, built as a single, dependency-free `index.html` file.

## Features

- Single-file static site — no build step, no frameworks.
- Modern, responsive design with a sticky glass nav and animated hero.
- Inter variable font loaded from Google Fonts with `preconnect` for fast rendering.
- Full SEO and social metadata: Open Graph, Twitter cards, canonical URL, JSON-LD structured data.
- Inline SVG favicon and Apple touch icon — no asset files needed.
- Accessible by default: skip link, ARIA labels, `:focus-visible` styles, `prefers-reduced-motion` support.
- Working mobile hamburger menu with keyboard (Escape) and outside-click handling.

## Run locally

This is a static site. Open the file directly, or serve it with any static server:

```bash
# Python 3
python3 -m http.server 8000

# Node (no install)
npx serve .
```

Then visit http://localhost:8000.

## Deploy

Drop `index.html` on any static host:

- **GitHub Pages** — enable Pages on this repo (Settings → Pages → Deploy from branch → `main` / root).
- **Netlify / Vercel / Cloudflare Pages** — point at the repo, no build command, publish directory `.`.

## Project structure

```
.
├── index.html            # home (uses its own inline styles — original hero design)
├── experts.html          # expert marketplace
├── how-it-works.html     # 3-step explainer
├── enterprise.html       # enterprise pitch
├── pricing.html          # plans
├── contact.html          # request access form
├── assets/
│   ├── styles.css        # shared stylesheet for subpages
│   ├── site.js           # mobile menu, sticky-nav shadow, smooth scroll, year
│   └── favicon.svg       # brand mark, inline-loadable SVG
└── README.md
```

> Note: the home page (`index.html`) uses a slightly different visual treatment
> than the subpages. Pick the direction you want and unify by either porting the
> home hero into `assets/styles.css` or rebuilding the subpages on top of the
> home's palette.

## License

© Dinner With Anyone. All rights reserved.
