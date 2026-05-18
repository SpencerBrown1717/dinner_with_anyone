# Avatar Discovery

Avatar Discovery is the flow where a user searches for a person and creates a
source-grounded educational avatar.

## Goal

Let students learn from the greats of all time while preserving trust and source
boundaries.

## Primary use cases

- Student searches a historical figure
- Professor assigns an expert avatar to a course
- Student creates a mentor for a project
- User builds a dinner table of multiple avatars
- Department creates approved avatars for a course

## Flow

1. Search person
2. Confirm public-source availability
3. Preview source set
4. Generate avatar profile
5. Choose conversation mode
6. Start talking
7. Show grounding and uncertainty during conversation

## Avatar profile

Each generated avatar should include:

- Name
- Domain
- Era
- Region
- Known for
- Source set
- Conversation style
- Allowed topics
- Refusal behavior
- Disclaimer

## Source set verification

Source set verification is governed by
[`WIKIPEDIA_SOURCE_POLICY.md`](WIKIPEDIA_SOURCE_POLICY.md). The minimum bar is a
Wikipedia page plus at least one corroborating source (biography, published
writings, speeches, interviews, academic references, or public archives).

## Avatar behavior contract

The discovery avatar follows the same anti-hallucination rules as professor
avatars (see [`GROUNDING_POLICY.md`](GROUNDING_POLICY.md)):

- Use public-source context first
- Say when the answer is outside the source
- Never invent citations
- Never claim to be the real person

## UI surface

The discovery flow on the public site shows:

- Search input
- Result card with name, domain, source status
- Source preview (Wikipedia, public writings, speeches, academic references)
- Generate avatar button
- Disclaimer: "Educational avatar inspired by public-source material."

## Product principle

The magic is access.
The trust is source grounding.
Both must be visible.

## Related documents

- [Wikipedia Source Policy](WIKIPEDIA_SOURCE_POLICY.md)
- [Grounding and Anti-Hallucination Policy](GROUNDING_POLICY.md)
- [Professor Upload Trust](PROFESSOR_UPLOAD_TRUST.md)
- [Avatar Realism](AVATAR_REALISM.md)
- [Avatar Architecture](AVATAR_ARCHITECTURE.md)
- [College Platform](COLLEGE_PLATFORM.md)
- [Course Upload Workflow](COURSE_UPLOAD_WORKFLOW.md)
- [Site Launch Agreement](SLA.md)
