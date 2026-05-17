# Dinner With Anyone

AI-powered expert conversations with world-class advisors — available on demand for operators, founders, executives, and enterprise teams.

This repository is the marketing site for **Dinner With Anyone**, built as a small set of static HTML pages with one shared stylesheet and one shared JS file. No build step, no framework.

Live: https://spencerbrown1717.github.io/dinner_with_anyone/

## Pages

| URL                  | What it is                                                  |
|----------------------|-------------------------------------------------------------|
| `/`                  | Home — hero, dinner table visual, why, expert preview, CTA  |
| `/experts.html`      | Expert marketplace                                          |
| `/how-it-works.html` | 3-step explainer + sample session                           |
| `/enterprise.html`   | Enterprise pitch and use cases                              |
| `/pricing.html`      | Free / Pro / Team / Enterprise + add-ons + comparison + FAQ |
| `/contact.html`      | Book-a-demo page (links to Google Calendar)                 |

## Project structure

```
.
├── index.html            # home
├── experts.html
├── how-it-works.html
├── enterprise.html
├── pricing.html
├── contact.html
├── sitemap.xml           # all 6 URLs for search engine crawlers
├── robots.txt            # allow all, points to sitemap
├── assets/
│   ├── styles.css        # shared stylesheet for every page
│   ├── site.js           # mobile menu, sticky-nav shadow, smooth scroll,
│   │                     # pricing billing toggle
│   ├── favicon.svg       # brand mark
│   └── og-image.png      # 1200×630 social share preview
└── README.md
```

## Book-a-demo CTA

Every CTA across the site routes to `contact.html`, which is a dedicated
booking page with a single primary action: a button that opens the team's
Google Calendar appointment link in a new tab.

To change the booking link, edit **one** value in `contact.html`:

```html
<a class="btn primary book-btn"
   href="https://calendar.app.google/2uCb1WSip2JsjvPz9"
   target="_blank" rel="noopener noreferrer">Book your demo →</a>
```

That's the only place the calendar URL lives. Swap it whenever the
booking link changes (e.g. moving to Calendly, Cal.com, Savvycal, etc.).

## Run locally

```bash
# Python 3
python3 -m http.server 8000

# Node (no install)
npx serve .
```

Then visit http://localhost:8000.

## Deploy

- **GitHub Pages** (current setup) — Settings → Pages → Deploy from branch → `main` / root.
- **Netlify / Vercel / Cloudflare Pages** — point at the repo, no build command, publish directory `.`.

## Wire up a custom domain (e.g. `dinnerwithanyone.ai`)

When you buy the domain and connect it via GitHub Pages → Settings → Pages → Custom domain:

1. Add a `CNAME` file at the repo root containing just `dinnerwithanyone.ai`.
2. Find-and-replace `https://spencerbrown1717.github.io/dinner_with_anyone/` → `https://dinnerwithanyone.ai/` across the repo.
   This updates the `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, `sitemap.xml`, and `robots.txt` in one pass.
3. Resubmit `sitemap.xml` to Google Search Console under the new domain.

## SEO

- `sitemap.xml` lists all 6 URLs with priorities and `lastmod` dates.
- `robots.txt` allows all crawlers and points to the sitemap.
- Every page ships per-page `<title>`, description, canonical URL, Open Graph, and Twitter card meta.
- `assets/og-image.png` is a 1200×630 share preview used on every page.

## Design system

- Palette: `--blue #0b4dff`, `--cyan #00b8ff`, `--navy #04142f`, `--ink #07152f`, `--muted #5b6b86`.
- Brand mark: rounded-square gradient (blue → cyan) with white "D".
- Font: Inter via Google Fonts (variable, with `preconnect`).
- Components live in `assets/styles.css` — `.card`, `.btn`, `.btn.primary`, `.eyebrow`, `.grid`, `.grid-4`, `.two`, `.comparison`, `.faq`, `.billing-toggle`, etc.
- Accessibility: skip link, ARIA labels on the nav and menu button, `:focus-visible` rings, scroll-margin so sticky-nav doesn't hide anchors, full `prefers-reduced-motion` support.

## License

© Dinner With Anyone. All rights reserved.
