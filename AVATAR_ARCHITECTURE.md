# Avatar Architecture

**Product:** Dinner With Anyone
**Status:** Draft implementation architecture
**Purpose:** Explain how lifelike avatars, voice, slides, and professor/classroom workflows should work after the static prototype.

**Related:** [College Platform](COLLEGE_PLATFORM.md) · [Course Upload Workflow](COURSE_UPLOAD_WORKFLOW.md) · [Grounding Policy](GROUNDING_POLICY.md) · [Avatar Realism](AVATAR_REALISM.md) · [Professor Upload Trust](PROFESSOR_UPLOAD_TRUST.md) · [Deployment and Security](DEPLOYMENT_SECURITY.md)

---

## 1. Product goal

Dinner With Anyone should feel like an AI learning room, not a generic chatbot.

The user should be able to:

1. Choose a famous historical figure, expert avatar, or custom professor avatar.
2. Speak naturally by voice.
3. Hear the avatar respond out loud.
4. See the avatar's face and mouth move with the spoken words.
5. Watch slides/source material update as the avatar teaches.
6. Ask follow-up questions by text, voice memo, or video check-in.
7. Let teachers see student confusion points, recurring questions, sentiment, and next-class suggestions.

---

## 2. High-level system

```text
User voice / text / video
        ↓
Realtime conversation layer
        ↓
Source-grounded retrieval
        ↓
Reasoning + lesson planning
        ↓
Spoken response generation
        ↓
Avatar rendering / lip sync
        ↓
Slide synchronization
        ↓
Transcript + teacher insights
```

---

## 3. Core providers

### OpenAI, voice and realtime conversation

Use OpenAI for:

- Speech-to-text
- Low-latency voice conversation
- Conversational reasoning
- Text-to-speech
- Interruption handling
- Realtime session state
- Tool calls into retrieval, slide selection, and dashboard events

Recommended path:

```text
Browser client
→ WebRTC session
→ backend ephemeral token endpoint
→ OpenAI Realtime session
→ audio stream back to browser
```

Do **not** expose OpenAI API keys in the browser.

---

### Gemini, slides and course-material intelligence

Use Gemini for:

- Summarizing syllabi
- Extracting structure from PDFs, transcripts, readings, and slide decks
- Generating slide outlines
- Creating recap decks
- Creating discussion questions
- Mapping questions to course concepts
- Suggesting next-class review topics

Recommended path:

```text
Uploaded course material
→ parsing / text extraction
→ Gemini summary + structure pass
→ slide outline
→ generated visual teaching cards
→ saved lesson context
```

---

### HeyGen or Gemini-style avatar layer, lifelike visual avatar

Use an avatar vendor for:

- Lifelike professor avatar
- Famous-person-inspired educational avatar
- Mouth movement / lip sync
- Emotional expression
- Video-call style avatar session
- Talking-head rendering

Recommended options:

1. **Streaming avatar** for realtime interactive conversations.
2. **Generated video segments** for slower, high-quality prepared lessons.
3. **Hybrid mode**: realtime avatar during Q&A, generated polished recap videos after class.

---

## 4. Real-time avatar loop

The final realtime loop should work like this:

```text
1. User speaks.
2. Browser captures microphone.
3. Audio goes to OpenAI Realtime through WebRTC.
4. OpenAI detects user turn and transcribes speech.
5. Backend retrieves relevant source material:
   - public biography / writings for historical avatars
   - uploaded syllabus / slides / transcript for professor avatars
6. Model generates a grounded response.
7. Response is streamed as audio.
8. Avatar layer receives either:
   - audio stream
   - text response
   - phoneme / viseme timing if available
9. Avatar mouth animates in sync with the spoken response.
10. Slide controller selects the current slide or generates a visual card.
11. Transcript and teacher-insight events are saved.
```

---

## 5. Slide synchronization

The avatar should not talk randomly while static slides sit beside it. The slide panel should be controlled by the teaching plan.

### Slide controller inputs

- Current user question
- Current avatar response
- Retrieved source chunks
- Course topic
- Lesson stage
- Student type
- Teacher constraints
- Current slide state

### Slide controller outputs

```json
{
  "activeSlide": 2,
  "slideTitle": "Switching Costs in AI Startups",
  "visualPrompt": "Show a 2x2 diagram comparing low vs high switching costs",
  "studentPrompt": "Name one workflow where switching costs become defensibility.",
  "sourceRefs": ["week_03_slides.pptx#slide-12", "zoom_transcript_week_3.vtt#00:18:42"]
}
```

### Teaching states

Use a small state machine:

```text
Explain concept
→ Show example
→ Ask reflection
→ Check understanding
→ Summarize
→ Suggest next step
```

---

## 6. Professor avatar source grounding

Professor avatars should answer from course material first.

Priority order:

1. Teacher-provided slides
2. Teacher-provided syllabus
3. Teacher-provided lecture transcript
4. Teacher-provided readings
5. Teacher-provided rubric / assignments
6. Approved public references
7. General model knowledge only if allowed

Every professor-avatar answer should be able to explain:

```text
What source was used?
Which class topic does this belong to?
Is the answer inside or outside the uploaded material?
Should the teacher review this?
```

---

## 7. Historical / famous avatars

Historical avatars should be framed as educational simulations.

They should be grounded in:

- Public biographies
- Public writings
- Speeches
- Academic references
- Wikipedia/public-source context
- Teacher-approved supplemental material

They should not claim to be the real person.

Use language like:

```text
Einstein-inspired educational simulation
Cleopatra-inspired historical avatar
Confucius-inspired learning companion
```

Avoid:

```text
I am literally Albert Einstein.
This is exactly what Cleopatra thought.
This represents the private beliefs of the real person.
```

---

## 8. Mobile design requirements

The avatar experience must work well on cellular.

### Mobile layout

```text
Top: avatar stage
Below: primary controls
Below: slides / source panel
Below: transcript
Below: teacher dashboard / upload flow
```

### Mobile rules

- No horizontal scroll except intentional avatar picker carousel.
- Primary buttons must be at least 44px tall.
- Avatar head must remain visually centered.
- Slides should become stacked cards.
- Transcript should be readable without zooming.
- Audio controls should be thumb-friendly.
- The video/avatar stream should never exceed viewport width.
- If network is poor, fallback to audio + transcript + static avatar.

---

## 9. Performance requirements

For mobile:

- Keep initial page light.
- Lazy-load real avatar SDKs only when user opens avatar mode.
- Do not load HeyGen/avatar scripts on every marketing page.
- Prefer static SVG/CSS preview until the user starts a session.
- Use compressed video.
- Use poster image before video/avatar stream starts.
- Keep transcripts text-based.
- Avoid huge background videos.
- Respect `prefers-reduced-motion`.

---

## 10. Privacy-first deployment

For education and enterprise:

- Do not expose OpenAI/Gemini/HeyGen API keys in the client.
- Store uploaded class material privately.
- Separate public historical avatars from private professor avatars.
- Use tenant-specific storage for schools/enterprise customers.
- Allow deletion of class material.
- Treat voice memos, video check-ins, and student reflections as sensitive.
- Consider private-server deployments for sensitive workflows.
- Avoid compliance claims until actually implemented.

Approved wording:

```text
privacy-first
private-server option
institution-controlled deployment path
built to support stronger compliance work as the platform matures
```

Avoid claiming:

```text
SOC 2 compliant
FERPA compliant
HIPAA compliant
GDPR compliant
```

unless formally achieved.

---

## 11. MVP build sequence

### Phase 1, Static proof

Already underway.

- Static avatar demo
- Simulated voice states
- Simulated slides
- Simulated teacher dashboard
- Mobile QA

### Phase 2, Real upload pipeline

Build:

- File upload
- PDF parsing
- PPTX text extraction
- Zoom transcript ingestion
- Course material storage
- Basic document search

### Phase 3, Source-grounded answers

Build:

- Chunking
- Embeddings
- Retrieval
- Source citations
- Teacher-controlled source rules

### Phase 4, Real voice

Build:

- Browser microphone capture
- Backend ephemeral session token
- OpenAI Realtime/WebRTC session
- Live transcript
- Audio playback
- Interruptions

### Phase 5, Slide intelligence

Build:

- Gemini slide summaries
- Generated lesson cards
- Active-slide selector
- Teacher recap deck
- Student reflection prompts

### Phase 6, Lifelike avatar

Build:

- HeyGen or equivalent streaming avatar session
- Avatar creation flow
- Audio/text handoff
- Lip sync
- Speaking/listening states
- Mobile fallback mode

### Phase 7, Teacher dashboard

Build:

- Student check-in collection
- Sentiment/confidence summary
- Top confusion points
- Recurring questions
- Suggested next class
- CSV export

### Phase 8, Private deployments

Build:

- Tenant isolation
- Private file storage
- Admin controls
- Data retention controls
- Audit logs
- Institution onboarding

---

## 12. Roleplay practice + anti-hallucination layer

Dinner With Anyone is also a roleplay practice platform. The architecture should
support five practice modes on top of the conversation loop:

- **Teach me**, patient explanation grounded in uploaded course material.
- **Interview me**, generates interview-style follow-ups and scores answers.
- **Sell to me**, runs a buyer persona, asks for discovery, scores objection handling.
- **Negotiate with me**, runs a counterparty (recruiter, vendor, investor), scores leverage.
- **Quiz me**, concept-check loop scored on mastery and application.

Difficulty levels (`high_school`, `college`, `graduate`) modulate prompt strength,
follow-up sharpness, and how much scaffolding the avatar provides.

The anti-hallucination contract (full detail in [`GROUNDING_POLICY.md`](GROUNDING_POLICY.md))
is enforced at three layers:

1. **Retrieval layer**, uploaded teacher material is searched first; public sources second.
2. **Reasoning layer**, every response carries a `source_confidence` tag
   (`uploaded`, `public`, `general`, `outside`) used by the UI source-confidence pill.
3. **UI layer**, citations rendered in the interface must come from real retrieval
   results. If retrieval returns nothing, no citations are shown.

Teacher controls (strict mode, allowed topics, feedback style) live on the teacher
dashboard and are persisted to the avatar's runtime configuration.

---

## 13. Realism contract

Realism breaks at the mouth. For the avatar to feel real, the system must align the
following layers in order, with the timing budget driven by the audio:

1. Text response
2. Voice generation
3. Audio timing
4. Phoneme / viseme mapping
5. Mouth movement
6. Facial expression
7. Eye contact + head motion
8. Student interruption handling

Full detail in [`AVATAR_REALISM.md`](AVATAR_REALISM.md). The product rule: **bad lip sync
is worse than simple animation**. If high-quality lip sync is not available for a given
deployment, fall back to a simpler visual style that avoids uncanny mouth movement.

## 14. Deployment surface

Three deployment models are supported (see
[`DEPLOYMENT_SECURITY.md`](DEPLOYMENT_SECURITY.md)):

1. Hosted pilot (managed environment).
2. Private cloud (customer-isolated tenant).
3. On-prem deployment (customer infrastructure).

All three enforce no-training mode, tenant isolation for uploaded professor materials,
and source-scoped retrieval so the avatar can only answer from material the institution
provided.

## 15. Near-term rule

Do not build the full avatar backend until one real pilot prospect validates:

- They want students to talk to the professor avatar.
- They have class material they can upload.
- They care about teacher insight reports.
- They are willing to run a 20 to 30 student pilot.
