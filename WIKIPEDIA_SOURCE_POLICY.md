# Wikipedia Source Policy

Dinner With Anyone should allow users to search for public figures and historical
figures when trusted public-source material is available.

## Core rule

A person must have sufficient public-source context before an avatar can be created.

## Minimum source requirement

The product should verify at least one trusted source, such as:

- Wikipedia page
- Public biography
- Published writings
- Speeches
- Interviews
- Academic references
- Public archives

## Avatar behavior

The avatar must:

- Clearly identify itself as an educational avatar
- Never claim to be the real person
- Use public-source context when answering
- Say when the source material does not support an answer
- Avoid invented citations
- Show source confidence
- Avoid private or speculative claims

## User flow

1. User searches a person
2. System checks source availability
3. System previews known sources
4. User creates avatar
5. Avatar starts in source-grounded mode

## Refusal behavior

If source material is too thin, the product should say:

"We do not have enough trusted source material to create a reliable educational
avatar for this person yet."

## Public site disclaimer

Anywhere the public site offers Wikipedia-driven discovery, it must also say:

"Educational avatar inspired by public-source material. Not the real person."

## Related documents

- [Avatar Discovery](AVATAR_DISCOVERY.md)
- [Grounding and Anti-Hallucination Policy](GROUNDING_POLICY.md)
- [Professor Upload Trust](PROFESSOR_UPLOAD_TRUST.md)
- [Avatar Realism](AVATAR_REALISM.md)
- [Avatar Architecture](AVATAR_ARCHITECTURE.md)
- [College Platform](COLLEGE_PLATFORM.md)
- [Course Upload Workflow](COURSE_UPLOAD_WORKFLOW.md)
- [Site Launch Agreement](SLA.md)
