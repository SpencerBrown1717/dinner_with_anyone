# Service Level Agreement (SLA)

**Product:** Dinner With Anyone
**Repository:** `dinner_with_anyone`
**Effective Date:** [Insert Date]
**Version:** 0.1 Draft

---

## 1. Purpose

This Service Level Agreement ("SLA") defines the expected availability, support commitments, incident response process, privacy-first operating standards, and maintenance expectations for Dinner With Anyone.

Dinner With Anyone is an AI learning room platform that enables users to interact with educational AI simulations of historical figures, famous thinkers, expert avatars, and custom professor avatars built from teacher-provided or public-source material.

The current public repository is a static GitHub Pages marketing and prototype site. Future product versions may include hosted services, private-server deployments, AI voice systems, slide generation, avatar rendering, curriculum upload workflows, student feedback tools, and teacher insight dashboards.

---

## 2. Scope

This SLA applies to:

- Public marketing website
- Static GitHub Pages deployment
- Demo pages and prototype UI
- Avatar demo experience
- Pilot pages
- Outreach pages
- Future hosted product services
- Future private-server education or enterprise deployments
- Future teacher/student workflows
- Future integrations using OpenAI, Gemini, HeyGen, or similar AI service providers

This SLA does **not** currently guarantee production-grade uptime for prototype-only features unless separately agreed in a signed customer agreement.

---

## 3. Service Description

Dinner With Anyone provides or plans to provide:

1. **Famous / Historical AI Avatar Experiences**
   Educational AI simulations inspired by public-source material, biographies, writings, speeches, and reference context.

2. **Professor Avatar Experiences**
   Custom AI avatars created from teacher-provided class materials such as syllabi, slides, readings, Zoom transcripts, lecture notes, and assignments.

3. **Voice Interaction**
   Planned voice input, speech-to-text, conversational response, and text-to-speech workflows powered by OpenAI or similar providers.

4. **Slide Generation and Curriculum Structuring**
   Planned slide generation, lesson summarization, and course-material structuring powered by Gemini or similar providers.

5. **Avatar Rendering**
   Planned lifelike avatar generation or rendering through HeyGen, Gemini-style avatar tooling, or other avatar infrastructure.

6. **Privacy-First Hosting Options**
   Hosted demo environments and future private-server deployments for sensitive classroom, institutional, and enterprise workflows.

---

## 4. Current Prototype Status

The current GitHub Pages site is a **front-end prototype and marketing website**.

Current prototype features may include:

- Static avatar demo UI
- Simulated voice states
- Simulated avatar responses
- Simulated slide generation
- Simulated teacher dashboard insights
- Static pilot funnel
- Static outreach tracker using browser localStorage
- Static marketing, education, pricing, and enterprise pages

Unless otherwise stated, the current prototype does **not** yet provide:

- Real user authentication
- Real file upload processing
- Real student accounts
- Real teacher dashboards
- Real OpenAI, Gemini, or HeyGen API calls
- Real private-server customer deployments
- Real compliance certifications
- Real enterprise security controls

---

## 5. Availability Targets

### 5.1 Public Marketing Site

For the GitHub Pages-hosted public site, Dinner With Anyone targets reasonable public availability based on GitHub Pages infrastructure.

Target availability:

| Service Area | Target Availability |
|---|---:|
| Public marketing site | Best effort |
| Static demo pages | Best effort |
| Static pilot / outreach pages | Best effort |
| Static localStorage tracker | Browser-local only, no server guarantee |

Because the public site is hosted through GitHub Pages, availability may depend on GitHub's infrastructure, DNS providers, browsers, networks, and third-party systems.

### 5.2 Future Hosted Product

For a future hosted production product, target availability may be:

| Service Tier | Target Monthly Availability |
|---|---:|
| Beta / Pilot | 95.0% |
| Standard Hosted Product | 99.0% |
| Enterprise Hosted Product | 99.5% |
| Private Server Deployment | Defined per customer agreement |

These targets are placeholders until a production service is launched and customer-specific agreements are signed.

---

## 6. Exclusions From Availability

Availability calculations exclude:

- Scheduled maintenance
- Customer-side internet or device issues
- DNS propagation delays
- GitHub Pages outages
- Third-party API outages
- OpenAI, Gemini, HeyGen, or other provider outages
- Browser incompatibilities outside supported browsers
- Misconfiguration by customer or user
- Force majeure events
- Security incidents caused by customer credentials or customer systems
- Prototype-only features clearly labeled as simulated or non-production

---

## 7. Support Levels

### 7.1 Prototype / Free Access

Support is best effort.

Typical response time:

| Issue Type | Target Response |
|---|---:|
| General question | 3–5 business days |
| Broken public page | 2–3 business days |
| Demo issue | Best effort |
| Feature request | Reviewed periodically |

### 7.2 Pilot Customers

For approved education or enterprise pilots:

| Severity | Description | Target Response |
|---|---|---:|
| Sev 1 | Pilot demo completely inaccessible during scheduled demo | 4 business hours |
| Sev 2 | Major pilot feature broken or misleading | 1 business day |
| Sev 3 | Minor content, styling, or copy issue | 2–3 business days |
| Sev 4 | Feature request or improvement | Reviewed during pilot check-in |

### 7.3 Future Enterprise Customers

Enterprise support terms should be defined in a separate signed agreement.

Example enterprise targets:

| Severity | Description | Target Response | Target Update Frequency |
|---|---|---:|---:|
| Sev 1 | Production service unavailable for most users | 1 hour | Every 2 hours |
| Sev 2 | Major feature degraded for many users | 4 hours | Daily |
| Sev 3 | Limited issue or workaround available | 1 business day | As needed |
| Sev 4 | General request or enhancement | 3 business days | As needed |

---

## 8. Incident Severity Definitions

### Severity 1 — Critical

A complete outage or major security issue affecting production customers.

Examples:

- Hosted platform unavailable
- Private deployment inaccessible
- Data exposure suspected
- Authentication system failure
- Major customer demo failure during scheduled pilot

### Severity 2 — High

Major feature failure with substantial user impact.

Examples:

- Avatar sessions unavailable
- Voice interaction broken
- Upload workflow broken
- Teacher dashboard unavailable
- Slide generation unavailable

### Severity 3 — Medium

Partial degradation or non-critical issue.

Examples:

- Styling issue
- Broken non-primary page
- Slow response from a third-party provider
- Minor dashboard issue
- Incorrect non-sensitive display text

### Severity 4 — Low

Minor issues, questions, or improvements.

Examples:

- Copy changes
- Feature suggestions
- Documentation updates
- Visual polish
- Non-urgent requests

---

## 9. Incident Response Process

When an incident is reported or detected, Dinner With Anyone will use the following process:

1. **Acknowledge**
   Confirm receipt and assign severity.

2. **Triage**
   Determine scope, affected users, likely cause, and available workaround.

3. **Mitigate**
   Restore service or reduce customer impact.

4. **Communicate**
   Provide updates based on severity and customer tier.

5. **Resolve**
   Deploy fix, rollback, configuration change, or workaround.

6. **Review**
   For major incidents, document cause, impact, fix, and prevention steps.

---

## 10. Maintenance

Dinner With Anyone may perform maintenance to improve reliability, security, performance, or product quality.

Maintenance may include:

- Static site updates
- DNS updates
- Content updates
- Dependency updates
- Security patches
- Provider integration changes
- Private server maintenance
- AI model or API configuration updates

Where practical, scheduled maintenance for production customers should be communicated in advance.

Prototype website changes may be deployed without prior notice.

---

## 11. Data Privacy and Protection

Dinner With Anyone is designed around privacy-first education and enterprise workflows.

Future production systems should treat the following as sensitive:

- Student names
- Student voice memos
- Student video check-ins
- Student reflections
- Teacher notes
- Uploaded syllabi
- Uploaded slides
- Zoom transcripts
- Lecture notes
- Assignments
- Private institutional material
- Enterprise expert knowledge bases

Dinner With Anyone should avoid publicly exposing class material, transcripts, student submissions, or customer-provided materials.

Private-server deployment may be offered for sensitive classroom, enterprise, and institutional workflows.

---

## 12. Compliance Position

Dinner With Anyone should not claim compliance certifications until they are actually implemented, audited, and approved.

Do **not** claim:

- SOC 2 compliance
- HIPAA compliance
- FERPA compliance
- GDPR compliance
- ISO 27001 compliance

unless formally achieved.

Approved wording:

- "Privacy-first"
- "Designed for privacy-first deployments"
- "Private-server hosting available"
- "Institution-controlled deployment path"
- "Built to support stronger compliance work as the platform matures"
- "Sensitive classroom workflows can be hosted in private environments"

---

## 13. Third-Party Providers

Dinner With Anyone may use third-party providers for AI and infrastructure services.

Potential providers include:

- OpenAI for voice input, conversational reasoning, and spoken responses
- Gemini for slide generation, curriculum summarization, and class-material structuring
- HeyGen or Gemini-style tools for avatar generation and rendering
- GitHub Pages for static website hosting
- DNS and domain providers
- Calendar or booking tools
- Analytics or monitoring tools, if added later

Third-party outages, policy changes, API limits, latency, pricing changes, or degraded performance may affect Dinner With Anyone.

Dinner With Anyone is not responsible for third-party downtime outside its direct control, but will use reasonable efforts to mitigate impact.

---

## 14. Backups and Data Retention

### Current Static Prototype

The current public site is stored in Git and can be restored from repository history.

The current outreach tracker stores data in the user's browser localStorage only. That means:

- Data is not backed up by Dinner With Anyone
- Clearing browser data may delete tracker records
- Users should export CSV backups manually
- Data is not synced across devices

### Future Hosted Product

Future hosted product versions should define:

- Backup frequency
- Retention period
- Deletion process
- Customer export rights
- Data isolation model
- Private deployment backup procedure

These terms should be added before production customer launch.

---

## 15. Security Expectations

Dinner With Anyone should follow reasonable security practices, including:

- Least-privilege access
- Secure handling of API keys
- No secrets committed to the repo
- Private environment variables for API credentials
- Secure file handling for uploaded materials
- Separation between public historical avatars and private classroom avatars
- Clear deletion policies for uploaded customer material
- Monitoring for suspicious activity in production systems
- Careful review before adding third-party scripts

Current static prototype should not contain production secrets, API keys, private customer data, or real student data.

---

## 16. Customer Responsibilities

Customers and pilot participants are responsible for:

- Providing accurate materials
- Ensuring they have rights to upload class content
- Avoiding upload of unnecessary sensitive data
- Reviewing avatar outputs before relying on them
- Using the product for educational and lawful purposes
- Managing student permissions and institutional approvals where needed
- Exporting local tracker data if using the static localStorage tracker
- Not treating prototype outputs as authoritative facts without review

---

## 17. AI Output Limitations

Dinner With Anyone uses or plans to use AI-generated outputs.

AI outputs may be:

- Incomplete
- Incorrect
- Outdated
- Misleading
- Overconfident
- Not representative of a real person's exact views
- Not suitable as final academic, legal, financial, medical, or professional advice without human review

Historical and famous-person avatars are educational simulations. They are not the real person and may not represent exact views, words, or private thoughts.

Teacher and professor avatars should be reviewed and configured by the appropriate instructor or institution.

---

## 18. Acceptable Use

Users may not use Dinner With Anyone to:

- Impersonate real living people without authorization
- Misrepresent AI simulations as real people
- Generate harmful, abusive, or deceptive content
- Upload unlawful or unauthorized material
- Violate student privacy
- Circumvent institutional policies
- Collect sensitive data without proper consent
- Use the platform for harassment, fraud, or manipulation

Dinner With Anyone may suspend access for misuse.

---

## 19. Change Management

Changes to the static site or product may include:

- New pages
- Updated copy
- Pricing changes
- Demo changes
- New pilot flows
- AI provider changes
- Security updates
- Design improvements
- Feature additions or removals

Prototype features may change quickly.

Production customer-impacting changes should be communicated with reasonable notice where practical.

---

## 20. Service Credits

No service credits apply to the current free, prototype, or pilot-stage product unless separately agreed in writing.

For future paid enterprise agreements, service credits may be negotiated separately.

Example structure:

| Monthly Availability | Possible Credit |
|---:|---:|
| 99.0% to 99.5% | 5% |
| 95.0% to 99.0% | 10% |
| Below 95.0% | 20% |

Service credits should be the customer's sole and exclusive remedy for availability failures unless otherwise required by law or agreed in writing.

---

## 21. Termination

Dinner With Anyone may terminate or suspend service access if:

- A user violates acceptable use rules
- A customer fails to pay agreed fees
- A pilot ends
- A security risk is identified
- A third-party provider dependency becomes unavailable
- Continued service would create legal, privacy, or operational risk

Customers may stop using the service at any time unless governed by a separate paid agreement.

---

## 22. SLA Review Cycle

This SLA should be reviewed:

- Before first paid pilot
- Before first real student upload
- Before adding production authentication
- Before adding real OpenAI/Gemini/HeyGen API calls
- Before storing student data
- Before private-server deployment
- Before signing enterprise customers
- At least once per quarter after production launch

---

## 23. Contact

For support, pilot inquiries, or service questions:

**Dinner With Anyone**
Email: hello@dinnerwithanyone.ai
Website: [https://dinnerwithanyone.ai](https://dinnerwithanyone.ai)

Until the custom domain is live, use:

[https://spencerbrown1717.github.io/dinner_with_anyone/](https://spencerbrown1717.github.io/dinner_with_anyone/)

---

## 24. Disclaimer

This SLA is a draft operational document and is not legal advice. Before using it with paying customers, schools, universities, enterprises, or institutional partners, it should be reviewed by qualified legal counsel.
