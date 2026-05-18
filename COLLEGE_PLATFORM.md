# College Platform

Dinner With Anyone is built first for colleges and universities.

The core product is a source-grounded professor avatar created from trusted course
material. Professors upload the course. Students get a patient, source-grounded mentor
in their pocket.

## Primary users

- Professors
- Students
- Departments
- Colleges and schools
- Executive education and MBA programs

## Professor upload types

- Syllabus
- Books and assigned readings
- Lecture slides
- Lecture recordings
- Transcripts
- Assignments
- Rubrics
- Case packets
- Exam review material
- Professor notes
- Approved outside sources

See [`COURSE_UPLOAD_WORKFLOW.md`](COURSE_UPLOAD_WORKFLOW.md) for the intended end-to-end
course creation flow.

## Student use cases

- Ask questions from readings
- Review lectures and concepts
- Prepare for exams
- Practice class discussions
- Prepare for office hours
- Get unstuck on assignments without being handed the final answer
- Roleplay interviews, sales calls, and negotiations
- Build confidence through repeated practice

## Professor controls

- Source boundaries (class-only / approved public / general reasoning)
- Difficulty level (high school, college, graduate, MBA, custom)
- Allowed topics
- Strict mode (refuse when outside the source)
- Feedback style (Socratic, direct, quiz, exam prep, roleplay)
- Preview mode (test before publishing to students)
- Correction loop (flag weak answers, add sources, improve over time)

Trust controls live in [`PROFESSOR_UPLOAD_TRUST.md`](PROFESSOR_UPLOAD_TRUST.md).
Grounding behavior lives in [`GROUNDING_POLICY.md`](GROUNDING_POLICY.md).

## Why colleges care

- More help outside office hours, on the student's schedule
- Better-prepared classes, students arrive ready to discuss, not just listen
- Less repetitive explanation of common questions
- More equitable support for quiet, embarrassed, or overloaded students
- Stronger practice loops through repetition and feedback
- Professor-controlled rigor, challenge students instead of giving away answers

## Product principle

Do not lower the academic bar.
Give students better support so they can reach it.

## Deployment

Hosted pilot, private cloud, or on-prem are all supported deployment paths so a college
can choose what fits its data boundary requirements. See
[`DEPLOYMENT_SECURITY.md`](DEPLOYMENT_SECURITY.md).

## Related documents

- [Course Upload Workflow](COURSE_UPLOAD_WORKFLOW.md)
- [Grounding and Anti-Hallucination Policy](GROUNDING_POLICY.md)
- [Professor Upload Trust](PROFESSOR_UPLOAD_TRUST.md)
- [Deployment and Security](DEPLOYMENT_SECURITY.md)
- [Avatar Realism](AVATAR_REALISM.md)
- [Avatar Architecture](AVATAR_ARCHITECTURE.md)
- [Site Launch Agreement](SLA.md)
