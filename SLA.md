# Site Launch Agreement

This document defines the minimum quality bar for the Dinner With Anyone public website.
It is an internal product agreement, not a legal service-level promise.

## 1. First impression

The homepage must make the product obvious within five seconds:

- Turn every college course into a living professor avatar
- Built first for colleges, universities, professors, students, and executive education
- Professors upload lectures, books, slides, transcripts, assignments, and rubrics
- Students get a source-grounded mentor in their pocket
- Have dinner with anyone alive or dead (60 expert avatars)
- Practice high-stakes conversations
- Try the avatar demo

The dedicated `college.html` page is the canonical surface for the college-first
product story; the homepage previews it.

## 2. Language quality

The website should avoid awkward robotic phrasing.

Do not use visible phrases such as:

- AI-powered
- AI-driven
- AI-avatar
- AI-tutor
- "AI -" (hyphen-spaced)
- "AI –" (en-dash-spaced)
- "AI —" (em-dash-spaced)

Preferred language:

- source-grounded avatar
- professor avatar
- expert avatar
- educational simulation
- avatar simulation
- guided roleplay
- structured feedback
- private deployment

The forbidden list is enforced in `scripts/qa-site.mjs` via `testForbiddenLanguage`.
QA fails if any of the awkward phrases reappear on a public HTML page.

## 3. Avatar demo quality

The avatar demo (`avatar-demo.html`) must be easy to understand without explanation.

A visitor should immediately understand:

- who they can talk to
- what mode they can choose
- what the avatar will say
- how feedback works
- how grounding works
- why realism matters

The demo flow on every visit:

1. Pick a person.
2. Pick a mode.
3. Start talking.
4. Get better.

## 4. Trust requirements

The site must clearly explain:

- avatars are not the real people
- professor avatars answer from approved material
- source boundaries matter
- the system should say when it does not know
- no fake citations
- private deployment is available

Long-form trust docs:

- [College Platform](COLLEGE_PLATFORM.md)
- [Course Upload Workflow](COURSE_UPLOAD_WORKFLOW.md)
- [Grounding and Anti-Hallucination Policy](GROUNDING_POLICY.md)
- [Avatar Realism](AVATAR_REALISM.md)
- [Professor Upload Trust](PROFESSOR_UPLOAD_TRUST.md)
- [Deployment and Security](DEPLOYMENT_SECURITY.md)

## 5. Mobile quality

Every page must work on mobile.

Minimum checks:

- no horizontal overflow
- tap targets are at least 36×36 px
- nav works
- cards collapse cleanly
- text remains readable
- demo cockpit is usable on small screens

Mobile QA runs at `mobile-small` (360 × 740) and `mobile-large` (430 × 932) viewports.

## 6. QA requirements

Before every commit:

```bash
npm run qa
```

QA must check:

- all pages return 200
- all internal nav links resolve to real files
- experts page has at least 60 cards
- expert filter switcher works (science filter hides Cleopatra, keeps Einstein)
- avatar demo roleplay modes update prompt, response, feedback on click
- contact paths highlight the correct card and update the note
- trust content is present on `index`, `education`, `how-it-works`, `enterprise`,
  `pricing`, `avatar-demo`
- forbidden awkward AI-hyphen phrases are absent on every public HTML page
- avatar demo contains the new clarity markers (`Step into the conversation`,
  `Choose who you want at the table`, `Choose the mode`, `Get better`,
  `Live conversation`, `Grounding`, `Feedback`, `The mouth matters`,
  `The source matters`, `The practice loop matters`)
- no horizontal overflow across 5 viewports (`mobile-small`, `mobile-large`,
  `tablet`, `desktop`, `wide`)
- premium UX elements (`.scroll-progress`, mobile sticky CTA) are wired

## 7. Disclaimers

Every page footer ships the same disclaimer block:

> Educational simulations. Dinner With Anyone creates educational simulations inspired
> by public-source or teacher-provided material. Avatars are not the real person and may
> not represent exact views, words, or private thoughts. Private-server deployment is
> available for sensitive classroom, enterprise, and institutional workflows.

## 8. Out of scope

This document is a quality bar, not:

- a contract
- a legal service-level agreement
- an uptime guarantee
- a compliance claim (HIPAA / FERPA / SOC 2 / etc. — see
  [`DEPLOYMENT_SECURITY.md`](DEPLOYMENT_SECURITY.md) for the language rule)

## 9. Review cycle

This document should be reviewed whenever:

- a new public page is added
- the homepage hero changes meaningfully
- the avatar demo changes meaningfully
- the QA harness adds or removes a class of check
- new visible vocabulary lands across the site
