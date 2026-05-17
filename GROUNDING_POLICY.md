# Grounding and Anti-Hallucination Policy

Dinner With Anyone should prioritize grounded, source-aware educational answers over
confident unsupported answers.

## Core rule

If the avatar does not have enough source material, it should say so.

## Source priority

1. Uploaded teacher materials
2. Uploaded slides
3. Uploaded transcript
4. Uploaded readings
5. Teacher-approved public references
6. General model knowledge only when allowed

## Required answer behavior

Every answer should be able to label itself as:

- Grounded in uploaded material
- Grounded in public-source context
- General reasoning
- Outside available material

## Never do

- Never invent citations
- Never pretend to be the real person
- Never claim a professor said something unless it is in the uploaded material
- Never hide uncertainty
- Never use private student data as general training material
- Never answer outside teacher-defined boundaries when strict mode is enabled

## Difficulty levels

**High School**
More scaffolding, simpler language, more examples.

**College**
Balanced challenge and support.

**Graduate / MBA**
Sharper questioning, stronger pushback, fewer hints.

## Roleplay modes

**Interview**
Score clarity, structure, relevance, evidence.

**Sales**
Score discovery, pain identification, objection handling, next step.

**Negotiation**
Score framing, leverage, tradeoffs, concessions.

**Class discussion**
Score concept mastery, application, evidence, participation.

**Professor help**
Score understanding and guide the student without simply giving away the answer.

## Implementation notes (UI surface)

- Every answer ships with a source-confidence pill: `Grounded: uploaded slides + transcript`,
  `Grounded: public-source context`, `General reasoning`, or `Outside available material`.
- The grounding panel on `avatar-demo.html` shows the answer policy on every session.
- Teacher controls (strict mode, allowed topics, difficulty) live on the teacher dashboard
  and are persisted to the avatar's runtime configuration.
- Citations rendered in the UI must come from real retrieval results. If retrieval returns
  nothing, the UI must show no citations rather than fabricated ones.

## Out-of-scope behavior

Dinner With Anyone is an educational simulation product. It is **not**:

- A replacement for a licensed teacher, advisor, doctor, lawyer, or financial professional.
- A claim that an avatar represents the real person's exact views, words, or private thoughts.
- A general-purpose knowledge oracle. Boundaries are set per class, per teacher, per
  product surface.

## Related

- [Professor Upload Trust](PROFESSOR_UPLOAD_TRUST.md) — how professors upload, preview, and
  correct what the avatar can say.
- [Avatar Realism](AVATAR_REALISM.md) — speech-synced mouth movement, viseme mapping, and
  expression timing.
- [Deployment and Security](DEPLOYMENT_SECURITY.md) — hosted, private cloud, and on-prem
  deployment paths.
- [Avatar Architecture](AVATAR_ARCHITECTURE.md) — full system design.
