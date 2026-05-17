# Dinner With Anyone

AI avatars for conversation and learning. Talk, text, and interact with AI avatars of famous historical figures, expert thinkers, and custom professor avatars built from real curriculum, lectures, and trusted source material.

This repository is the marketing site for **Dinner With Anyone**, built as a small set of static HTML pages with one shared stylesheet and one shared JS file. No build step, no framework.

Live: https://spencerbrown1717.github.io/dinner_with_anyone/

## Two product paths

1. **Historical & famous avatars** — Einstein, Caesar, Cleopatra, Confucius, Alexander the Great, da Vinci, and a growing library of historical figures with rich public records. All avatars are AI simulations built from publicly available material — not affiliated with any individual or estate.
2. **Custom professor avatars** — teachers upload curriculum, slides, readings, transcripts, or Zoom recordings and the system generates a professor avatar a whole cohort can talk to, text, or send voice and video check-ins to.

## Pages

| URL                  | What it is                                                                |
|----------------------|---------------------------------------------------------------------------|
| `/`                  | Home — hero, dinner table visual, two product paths, expert preview       |
| `/experts.html`      | Historical avatar library (Einstein, Caesar, Cleopatra, Confucius, etc.)  |
| `/education.html`    | AI Professor Avatars for Classrooms — upload → avatar → cohort interacts  |
| `/how-it-works.html` | 3-step explainer + sample session + two-product split                     |
| `/enterprise.html`   | Custom expert avatars, SSO/SAML, audit logs, internal SME twins           |
| `/pricing.html`      | Explorer / Student-Class / Institution / Enterprise + comparison + FAQ    |
| `/contact.html`      | Book-a-demo page (links to Google Calendar)                               |

## Project structure

```
.
├── index.html            # home
├── experts.html          # historical & famous avatars
├── education.html        # AI professor avatars for classrooms
├── how-it-works.html
├── enterprise.html
├── pricing.html
├── contact.html          # book-a-demo
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
