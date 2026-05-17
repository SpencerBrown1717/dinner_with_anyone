# Deployment and Security

Dinner With Anyone should support deployment models for schools and enterprises that need
stronger data boundaries.

## Deployment models

1. **Hosted pilot** — Fastest way to evaluate the product with a small class or training
   group. Runs on Dinner With Anyone managed infrastructure.
2. **Private cloud** — Dedicated environment for one school, department, or enterprise
   team. Customer-isolated tenant.
3. **On-prem deployment** — Runs inside the customer's own infrastructure for sensitive
   academic, enterprise, or government use cases.

## Data categories

- Uploaded professor materials
- Student conversations
- Practice attempts
- Feedback scores
- Rubrics
- Source indexes
- Avatar configuration

## Product principle

Sensitive learning data should stay inside the environment chosen by the institution.

## Language rule

Do not make compliance claims unless they are verified.

Use careful language such as "designed for", "can support", and "security review
available".

| Use this language                              | Do not use this language        |
|------------------------------------------------|---------------------------------|
| Designed for private deployment                | HIPAA compliant                 |
| Can support institution-controlled environments | FERPA compliant                |
| Built for data boundary controls               | SOC 2 certified                 |
| Security review available for pilots           | End-to-end encrypted            |
| Private-server hosting available               | Guaranteed secure               |

## Controls each deployment model supports

- Tenant isolation
- Private file storage
- Per-tenant retention rules
- Admin-controlled access
- Audit logs
- No-training mode (student conversations and uploaded materials are not used for
  general model training)
- Source-scoped retrieval (the avatar can only retrieve from the tenant's own indexes)

## Pilot path

1. Hosted pilot with one cohort of 20–30 students.
2. Security review (data flow, retention, access controls, vendor list).
3. Decision on private cloud vs. on-prem for production rollout.
4. Migration plan for uploaded materials and avatar configuration.

## Related

- [Avatar Architecture](AVATAR_ARCHITECTURE.md)
- [Grounding and Anti-Hallucination Policy](GROUNDING_POLICY.md)
- [Professor Upload Trust](PROFESSOR_UPLOAD_TRUST.md)
- [College Platform](COLLEGE_PLATFORM.md)
- [Course Upload Workflow](COURSE_UPLOAD_WORKFLOW.md)
