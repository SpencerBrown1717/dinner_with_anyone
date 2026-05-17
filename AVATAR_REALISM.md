# Avatar Realism

The most important realism risk in Dinner With Anyone is the mouth.

If the avatar speaks but the mouth movement feels wrong, the student loses trust. The
avatar does not need to look photorealistic on day one, but speech timing, mouth
movement, facial expression, and response pacing must feel intentional.

## Realism stack

1. Text response
2. Voice generation
3. Audio timing
4. Phoneme or viseme mapping
5. Mouth movement
6. Facial expression
7. Eye contact
8. Head movement
9. Student interruption handling

## Product rule

Bad lip sync is worse than simple animation.

If high-quality lip sync is not available, use a simpler visual style that avoids uncanny
realism.

## Implementation notes

- **Phoneme / viseme mapping** is the unit of speech-to-mouth-shape translation. The
  pipeline should output viseme keyframes aligned to the TTS audio timeline before the
  audio plays, not after.
- **Micro-pauses and hesitation** should be modeled as deliberate beats in the speech
  plan, not as accidental TTS artifacts. A professor avatar that pauses before a hard
  question feels intentional; one that buffers feels broken.
- **Eye contact and head motion** must hold for full speech turns, not flicker per word.
  Treat eye contact as a separate state from talking.
- **Student interruption handling** is part of realism. If a student starts speaking, the
  avatar should stop, not finish its sentence over them.
- **Latency budget** for the full loop (speech in → reasoning → TTS → first viseme out)
  should target under 1.2 seconds for the feel of live conversation. Anything over 2.5s
  reads as a delayed video call.

## Failure modes to avoid

- Mouth that moves while no audio is playing.
- Audio that plays while the mouth is still.
- Generic "talking head" loop that does not match phonemes.
- Eye contact that drifts every word.
- Smile or expression timing that lands on the wrong beat.
- Uncanny-realistic face paired with low-quality lip sync.

## Related

- [Avatar Architecture](AVATAR_ARCHITECTURE.md)
- [Grounding and Anti-Hallucination Policy](GROUNDING_POLICY.md)
