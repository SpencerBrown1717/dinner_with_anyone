# Dinner With Anyone

Voice-first AI avatars for conversation and learning. Talk by voice, text, or video with AI avatars of famous historical figures, expert thinkers, and custom professor avatars built from real curriculum, slides, transcripts, and lecture recordings.

This repository is the marketing site for **Dinner With Anyone**, built as a small set of static HTML pages with one shared stylesheet and one shared JS file. No build step, no framework.

Live: https://spencerbrown1717.github.io/dinner_with_anyone/

> ⚠️ **The current site is a static front-end prototype.** It does not yet call OpenAI, Gemini, HeyGen, or any backend service. The avatar demo page simulates Ready → Listening → Thinking → Speaking states locally in JavaScript so the product experience can be shown, sold, and pressure-tested before backend work begins.

## Two product paths

1. **Historical & famous avatars** — Einstein, Caesar, Cleopatra, Confucius, Alexander the Great, da Vinci, and a growing library of historical figures with rich public records. All avatars are educational AI simulations built from public-source material — not affiliated with any individual or estate.
2. **Custom professor avatars** — teachers upload curriculum, slides, readings, transcripts, or Zoom recordings and the system generates a professor avatar a whole cohort can talk to, text, or send voice and video check-ins to.

## Planned AI stack

Dinner With Anyone is being designed around a clear, vendor-explicit architecture:

| Layer                          | Vendor / approach                                  |
|--------------------------------|----------------------------------------------------|
| Voice (STT, reasoning, TTS)    | **OpenAI**                                         |
| Slide generation & understanding | **Gemini**                                       |
| Curriculum summarization & structure | **Gemini**                                   |
| 3D / lifelike avatar rendering | **HeyGen** or Gemini-style avatar tooling          |
| Hosting for sensitive workloads | **Private servers** (Institution / Enterprise)    |
| Marketing site (this repo)     | Static GitHub Pages site — no backend, no API keys |

The positioning is deliberate: privacy-first, education-grade, and built so institutions can take the whole stack onto their own infrastructure when they're ready.

## Pages

| URL                    | What it is                                                                       |
|------------------------|----------------------------------------------------------------------------------|
| `/`                    | Home — hero, trust chips, "more than a chatbot" 3-card, dinner table visual      |
| `/experts.html`        | Historical avatar library (Einstein, Cleopatra, Confucius, da Vinci, Caesar, …)  |
| `/education.html`      | Professor avatars for classrooms — upload → avatar → cohort interacts            |
| `/demo.html`           | 4-step static product walkthrough (Choose → Ask → Ground → Export)               |
| `/avatar-demo.html`    | **Flagship prototype** — voice + slides + transcript + simulated state machine   |
| `/pilot.html`          | One-class pilot funnel — brief, timeline, needs, privacy ask                     |
| `/outreach.html`       | Professor / MBA outreach page with copy-paste invite + walkthrough script        |
| `/how-it-works.html`   | User-facing 3-step + 5-step architecture flow + privacy block + 8-phase roadmap  |
| `/enterprise.html`     | Custom expert avatars + private AI avatar infrastructure for institutions        |
| `/pricing.html`        | Explorer / Classroom / Institution / Enterprise + add-ons + comparison + FAQ     |
| `/contact.html`        | Book-a-demo page with buyer paths + Google Calendar booking link                 |

## Project structure

```
.
├── index.html            # home
├── experts.html          # historical & famous avatars
├── education.html        # AI professor avatars for classrooms
├── demo.html             # 4-step static product walkthrough
├── avatar-demo.html      # voice/slides/transcript flagship demo (interactive)
├── pilot.html            # one-class pilot funnel for teachers / MBA programs
├── outreach.html         # professor outreach page + copy-paste invite
├── how-it-works.html     # 3-step + 5-step architecture + privacy + 8-phase roadmap
├── enterprise.html       # custom expert avatars + private AI infrastructure
├── pricing.html          # 4 tiers + add-ons + comparison + FAQ
├── contact.html          # book-a-demo
├── sitemap.xml           # all URLs for search engine crawlers
├── robots.txt            # allow all, points to sitemap
├── assets/
│   ├── styles.css        # shared stylesheet for every page
│   ├── site.js           # mobile menu, sticky-nav shadow, smooth scroll,
│   │                     # pricing billing toggle, avatar-demo state machine
│   ├── favicon.svg       # brand mark
│   └── og-image.png      # 1200×630 social share preview
└── README.md
```

## Implementation roadmap (from prototype to product)

The website is **Phase 1**. The eight-phase plan looks like this:

1. **Static demo** — show avatar, slides, voice states, and classroom upload flow (this repo).
2. **Real uploads** — teachers upload syllabi, slides, PDFs, transcripts, and lecture notes.
3. **Source-grounded professor avatar** — generate a private course knowledge base; avatar answers from uploaded material with citations.
4. **Voice interaction** — OpenAI speech-to-text, conversation, and text-to-speech.
5. **Slide generation** — Gemini turns transcripts and readings into lesson slides, summaries, and study guides.
6. **Avatar rendering** — HeyGen or Gemini-style avatar tooling brings the professor / historical figure / SME to life.
7. **Student feedback loop** — voice memos, text reflections, and 30-second video check-ins feed a teacher dashboard (confusion clusters, recurring questions, sentiment, suggested next topics).
8. **Private-server deployment** — Institution and Enterprise customers run the stack on their own infrastructure with admin-controlled access and clear retention.

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

## Custom domain checklist

> **Do not create a `CNAME` file yet.** The domain is not purchased. When `dinnerwithanyone.ai` is live, follow this checklist exactly.

When `dinnerwithanyone.ai` is purchased:

1. Add a `CNAME` file at the repo root containing:

   ```txt
   dinnerwithanyone.ai
   ```

2. In GitHub:

   Settings → Pages → Custom domain → `dinnerwithanyone.ai`

3. Add DNS records at the registrar:

   ```txt
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   spencerbrown1717.github.io
   ```

4. Wait for GitHub Pages certificate provisioning.

5. Turn on **Enforce HTTPS**.

6. Update:

   - canonical URLs
   - og:url
   - twitter:url
   - sitemap.xml
   - robots.txt
   - README links

Current GitHub Pages URL:

```txt
https://spencerbrown1717.github.io/dinner_with_anyone/
```

Future production URL:

```txt
https://dinnerwithanyone.ai/
```

## Demo video checklist

Record a 30–45 second walkthrough of `avatar-demo.html`.

Export as:

```txt
assets/demo-walkthrough.mp4
```

Once the file exists, every `.demo-video-card` (homepage, outreach page, future pages) will automatically render the real video instead of the fallback placeholder.

Recommended script:

```txt
This is Dinner With Anyone.

A student can choose a historical figure like Einstein, or a custom professor avatar built from class material.

They start a voice conversation.

The avatar listens, thinks, and speaks back.

Slides update beside the conversation using Gemini-powered lesson generation.

For teachers, students can submit voice memos, text reflections, or video check-ins.

Then the teacher sees what the class understood, where students are confused, and what to teach next.

This is not just chat. It is an AI learning room.
```

## Launch operations

### Demo video

Record `avatar-demo.html` and export the file as:

```txt
assets/demo-walkthrough.mp4
```

The homepage and outreach page automatically show the fallback card until that file exists. Once the file exists, the shared JS loader detects it via a `HEAD` request and displays the video — no HTML changes required.

Recommended script:

```txt
This is Dinner With Anyone.

A student can choose a historical figure like Einstein, or a custom professor avatar built from class material.

They start a voice conversation.

The avatar listens, thinks, and speaks back.

Slides update beside the conversation using Gemini-powered lesson generation.

For teachers, students can submit voice memos, text reflections, or video check-ins.

Then the teacher sees what the class understood, where students are confused, and what to teach next.

This is not just chat. It is an AI learning room.
```

### Outreach tracker

Open:

```txt
outreach-tracker.html
```

This page stores outreach contacts in browser `localStorage` only. It does not send data to a server. The page ships with `<meta name="robots" content="noindex, nofollow">` and is intentionally **not** in `sitemap.xml` — it's discoverable only by direct link.

Track:

- Name
- School
- Email
- Sent date
- Status
- Notes
- Follow-up date

Export CSV before clearing browser data.

### Custom domain

Do not add `CNAME` until `dinnerwithanyone.ai` is purchased and DNS is ready.

When purchased, create a repo-root file named:

```txt
CNAME
```

Contents:

```txt
dinnerwithanyone.ai
```

Then set GitHub Pages custom domain and DNS records (see the Custom domain checklist above).

## SEO

- `sitemap.xml` lists every page with priorities and `lastmod` dates (`avatar-demo.html` is priority `1.0`).
- `robots.txt` allows all crawlers and points to the sitemap.
- Every page ships per-page `<title>`, description, canonical URL, Open Graph, and Twitter card meta.
- `assets/og-image.png` is a 1200×630 share preview used on every page.

## Disclaimers & wording rules

The footer disclaimer that ships on every page:

> **Educational AI simulations.** Dinner With Anyone creates educational AI simulations inspired by public-source or teacher-provided material. Avatars are not the real person and may not represent exact views, words, or private thoughts. Private-server deployment is available for sensitive classroom, enterprise, and institutional workflows.

When writing copy for this site, avoid overclaiming compliance. **Do not say "SOC 2 / HIPAA / FERPA / GDPR compliant"** unless those certifications have actually been implemented. Use:

- "designed for privacy-first deployments"
- "private-server hosting available"
- "institution-controlled deployment path"
- "built to support stronger compliance work as the platform matures"

## Design system

- Palette: `--blue #0b4dff`, `--cyan #00b8ff`, `--navy #04142f`, `--ink #07152f`, `--muted #5b6b86`.
- Brand mark: rounded-square gradient (blue → cyan) with white "D".
- Font: Inter via Google Fonts (variable, with `preconnect`).
- Components live in `assets/styles.css` — `.card`, `.btn`, `.btn.primary`, `.eyebrow`, `.grid`, `.grid-4`, `.two`, `.comparison`, `.faq`, `.billing-toggle`, etc.
- Accessibility: skip link, ARIA labels on the nav and menu button, `:focus-visible` rings, scroll-margin so sticky-nav doesn't hide anchors, full `prefers-reduced-motion` support.

## License

© Dinner With Anyone. All rights reserved.
