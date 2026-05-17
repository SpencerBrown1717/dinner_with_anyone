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
| `/contact.html`      | Request-access form (Formspree-ready)                       |

## Project structure

```
.
├── index.html            # home
├── experts.html
├── how-it-works.html
├── enterprise.html
├── pricing.html
├── contact.html
├── assets/
│   ├── styles.css        # shared stylesheet for every page
│   ├── site.js           # mobile menu, sticky-nav shadow, smooth scroll,
│   │                     # Formspree ajax submit, pricing billing toggle
│   └── favicon.svg       # brand mark
└── README.md
```

## Wire up the contact form (Formspree)

The contact form is fully built — it just needs an endpoint.

1. Create a free form at https://formspree.io.
2. Copy the endpoint (it looks like `https://formspree.io/f/abcdwxyz`).
3. In `contact.html`, replace `YOUR_FORM_ID` in the form's `action` attribute:

   ```html
   <form action="https://formspree.io/f/abcdwxyz" method="POST" data-formspree ...>
   ```

That's the only change needed. The submit handler in `assets/site.js` already takes care of:

- POSTing as `multipart/form-data` with `Accept: application/json`
- A button "Sending…" loading state
- An inline success card on submit (no page reload)
- Inline error messages on failure
- A hidden honeypot (`_gotcha`) field for spam
- A custom email subject line via `_subject`

While `YOUR_FORM_ID` is still in the action, the form intentionally fails fast with an error message so it's obvious it isn't connected.

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

## Design system

- Palette: `--blue #0b4dff`, `--cyan #00b8ff`, `--navy #04142f`, `--ink #07152f`, `--muted #5b6b86`.
- Brand mark: rounded-square gradient (blue → cyan) with white "D".
- Font: Inter via Google Fonts (variable, with `preconnect`).
- Components live in `assets/styles.css` — `.card`, `.btn`, `.btn.primary`, `.eyebrow`, `.grid`, `.grid-4`, `.two`, `.comparison`, `.faq`, `.billing-toggle`, etc.
- Accessibility: skip link, ARIA labels on the nav and menu button, `:focus-visible` rings, scroll-margin so sticky-nav doesn't hide anchors, full `prefers-reduced-motion` support.

## License

© Dinner With Anyone. All rights reserved.
