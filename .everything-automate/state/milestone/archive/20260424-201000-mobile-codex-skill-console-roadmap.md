---
mode: milestone
status: locked
stage: locked
version: 2
updated_at: 2026-04-24T20:10:00+09:00
owner: user
source_north_star: .everything-automate/state/north-star/archive/20260424-185800-mobile-codex-skill-console.md
source_north_star_title: mobile-codex-skill-console
source_north_star_mode: north-star
source_north_star_stage: locked
---

# Milestone State

## Parent Goal
The user can use a phone as the front door for local Codex skill work: view local skills, choose one, send an idea or request, run the skill locally, stream live context back, and keep a two-way conversation going.

## Why Milestones Are Needed
The locked goal has several dependent outputs. A phone UI is not useful unless it can reach the local Codex environment. Skill selection is not useful until the bridge exists. Skill execution is not useful on mobile unless run context streams back. The full V1 should therefore be split into ordered outputs instead of being blueprinted as one large system.

## Milestone List

### M1
- Name: Phone-to-local Codex live bridge accepted
- Why now: The phone must first reach a local Codex-backed process and support live two-way conversation. Without this, skill listing and skill execution have nowhere useful to attach.
- Required input: Locked North Star; local Codex environment; one chosen phone access surface for the first test.
- Output artifact: A blueprint-ready definition of the smallest phone-to-local-Codex bridge that can send user messages, stream Codex output or run context back, and accept follow-up replies.
- Unlocks next: Local skill discovery can be shown through the working bridge.
- Not this milestone: Skill list UI polish, full registered skill execution, final routing, full idea console, storage model, multi-agent orchestration.

### M2
- Name: Local skill catalog visible from phone accepted
- Why now: After the live bridge exists, the phone needs to show what local Codex skills are available so the user can pick a workflow intentionally.
- Required input: M1 bridge output; local skill discovery source; minimal skill metadata shape.
- Output artifact: A blueprint-ready definition of a phone-visible local skill catalog with skill names, short descriptions, and selection behavior.
- Unlocks next: A selected skill can receive an idea or work request.
- Not this milestone: Running every skill end to end, advanced filtering, marketplace behavior, full plugin management.

### M3
- Name: Phone-selected local skill run accepted
- Why now: Once the user can choose a skill, the selected skill must run in the local Codex environment from a phone-submitted idea or request.
- Required input: M1 bridge output; M2 skill catalog output; command or invocation path for local Codex skill runs.
- Output artifact: A blueprint-ready definition of how a selected skill receives input from the phone and starts a local Codex skill workflow.
- Unlocks next: Run context can be streamed and interacted with as the skill works.
- Not this milestone: Full execution routing after clarification, all possible skill types, background job platform, production-grade orchestration.

### M4
- Name: Live skill run conversation accepted
- Why now: The V1 experience requires more than starting a skill. The user must see live context, reply from the phone, and continue a back-and-forth conversation like a terminal Codex session.
- Required input: M1 bridge output; M3 skill run output; agreed minimum event stream for "live enough."
- Output artifact: A blueprint-ready definition of streaming run context, user replies, and session continuation for a phone-started local skill run.
- Unlocks next: The V1 console can be packaged as one coherent mobile work flow.
- Not this milestone: Long-term session archive, complex collaboration, final task routing, full multi-agent dashboard.

### M5
- Name: Mobile Codex skill console V1 accepted
- Why now: After the bridge, skill catalog, skill run, and live conversation are defined, the complete V1 flow can be tied together.
- Required input: M1-M4 accepted outputs.
- Output artifact: A blueprint-ready V1 console flow showing the full path from phone skill selection to local run to live back-and-forth conversation.
- Unlocks next: Product-level blueprinting or implementation planning for the complete V1.
- Not this milestone: Broader idea OS, Obsidian integration, final routing destinations, full multi-agent orchestration.

## Current Milestone Recommendation
Start with M1: Phone-to-local Codex live bridge accepted.

This is the smallest milestone that unlocks everything else. If phone-to-local live conversation fails, skill catalog and skill execution design are premature.

## Ordering Logic
The order follows the dependency chain:

```text
[Phone reaches local Codex]
   |
   v
[Phone sees local skills]
   |
   v
[Phone starts selected local skill]
   |
   v
[Phone watches and replies live]
   |
   v
[V1 console flow is tied together]
```

## Risks And Dependencies
- Phone access surface is not chosen yet: web page, chat bridge, tunnel, or another approach.
- Security boundary is unresolved for phone access to the local machine and local skills.
- Session model is unresolved: attach to existing Codex session, start one session per run, support resumable sessions, or combine them.
- Exact streaming events are unresolved: the user needs enough live context to feel like the terminal Codex session.
- Exact Codex skill invocation path is unresolved: forward commands, ask Codex to run skills, or expose higher-level actions.

## Open Questions
- Is M1 the right current milestone to blueprint next?
- Should "security boundary accepted" be its own milestone before M1, or part of M1?
- Should "session model accepted" be part of M1, or split into a separate milestone before skill execution?
- Is M5 needed as a separate integration milestone, or should V1 be considered complete after M4?

## Handoff Rule
Blueprint should read the locked North Star archive and this milestone file.

For the next blueprint, use only M1 unless the user explicitly chooses another milestone. Do not design the full skill catalog, skill execution workflow, final routing, or full idea console during M1.

## Anchor Message
Milestone mode is active. Keep the discussion focused on turning the locked North Star into ordered output milestones. Classify new ideas as Milestone Material, Ordering Question, Dependency Note, or Parking Lot before following them.
