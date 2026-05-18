# Course Upload Workflow

This document defines the intended course upload experience for Dinner With Anyone.

## Goal

A professor should be able to upload course material and create a student-facing
professor avatar that answers from approved sources.

## Step 1, Create course

Professor enters:

- Course name
- Department
- Term
- Difficulty level (high school, college, graduate, MBA, custom)
- Student audience
- Allowed topics

## Step 2, Upload material

Supported content types:

- Syllabus
- Slides
- Readings
- Books
- Transcripts
- Recordings
- Assignments
- Rubrics
- Case packets
- Notes
- Approved outside sources

Each upload is tagged with source type so the avatar can label responses correctly.

## Step 3, Set boundaries

Professor chooses:

- Class-only mode
- Approved public sources
- General reasoning allowed or off
- Strict mode on / off
- Citation / source label requirements
- Feedback style (Socratic, direct, quiz, exam prep, roleplay)
- Public context on / off

## Step 4, Preview avatar

Before students see the avatar, the professor tests:

- Easy student question
- Confused student question
- Exam prep question
- Assignment boundary question
- Outside-source question
- Hallucination trap question

Preview-before-publish is the contract between upload and trust. See
[`PROFESSOR_UPLOAD_TRUST.md`](PROFESSOR_UPLOAD_TRUST.md).

## Step 5, Publish to students

Students can:

- Ask questions
- Review concepts
- Practice discussions
- Quiz themselves
- Prepare for assignments
- Get structured feedback
- Roleplay high-stakes conversations

## Step 6, Improve over time

Professor can:

- Add sources
- Flag wrong answers
- Adjust difficulty
- Change boundaries
- Improve prompts
- Update course material as the semester evolves

## Out of scope (for now)

- Auto-grading
- Auto-publishing to LMS without professor sign-off
- Cross-course data sharing without explicit professor opt-in

## Related documents

- [College Platform](COLLEGE_PLATFORM.md)
- [Grounding and Anti-Hallucination Policy](GROUNDING_POLICY.md)
- [Professor Upload Trust](PROFESSOR_UPLOAD_TRUST.md)
- [Deployment and Security](DEPLOYMENT_SECURITY.md)
- [Avatar Architecture](AVATAR_ARCHITECTURE.md)
- [Site Launch Agreement](SLA.md)
