# Professor Upload Trust

Professors must be able to trust what their avatar says.

## Core promise

The avatar should answer from professor-approved material first.

## Upload types

- Syllabus
- Slides
- Readings
- Transcripts
- Assignments
- Rubrics
- Case packets
- Exam review guides

## Controls

- Source boundaries
- Difficulty level
- Allowed topics
- Strict mode
- Public context on/off
- Feedback style
- Student privacy settings

## Critical rule

Never claim the professor said something unless it appears in uploaded or approved source
material.

## Trust contract (UI surface)

Every professor-avatar session ships with the following visible affordances:

1. **Source confidence pill**, `Grounded: uploaded slides + transcript`,
   `Grounded: public-source context`, `General reasoning`, or `Outside available material`.
2. **Mode indicator**, strict mode vs. mixed mode is shown on the session header.
3. **Allowed topics**, visible to the student so they know what is in scope.
4. **Preview pass**, the professor can run hard test questions before the cohort joins.
5. **Correction loop**, the professor can flag wrong answers and the source notes feed
   back into the retrieval index.

## Preview-before-publish

Before a professor avatar is opened to students, the professor should be able to:

- Ask the 10 hardest questions they expect students to ask.
- See the source confidence label on every answer.
- Add or remove source material based on weak answers.
- Adjust difficulty, feedback style, and strict mode based on test results.

## Never do

- Never invent quotes from the professor.
- Never display citations the system did not actually retrieve.
- Never override the professor's strict-mode setting.
- Never include private student data in the avatar's general behavior.

## Related

- [Grounding and Anti-Hallucination Policy](GROUNDING_POLICY.md)
- [Avatar Architecture](AVATAR_ARCHITECTURE.md)
- [Deployment and Security](DEPLOYMENT_SECURITY.md)
- [College Platform](COLLEGE_PLATFORM.md)
- [Course Upload Workflow](COURSE_UPLOAD_WORKFLOW.md), preview-before-publish lives here.
