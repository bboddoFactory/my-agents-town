# Plan: My-agents-town roadmap doc

## Task Summary

Turn `docs/milestones.md` into a clearer roadmap document.

The roadmap should keep the whole direction visible without pretending the full runtime is already designed.

## Desired Outcome

After this work:

- A reader can see the thin whole-roadmap.
- A reader can see why the roadmap does not jump straight into a full multi-agent system.
- Each milestone has a clear purpose, done check, non-goals, likely POC, and what it unlocks.
- The next POC direction is clear enough for a later planning pass.
- The roadmap stays aligned with `DEC-001`.

## In Scope

- Update `docs/milestones.md`.
- Keep the roadmap small and easy to read.
- Add the agreed milestone sequence:
  - Direction Locked
  - Artifact Handoff
  - Artifact Viewer
  - File Edit Review
  - Worker Session
  - Worker Roles
  - Orchestrated Flow
  - Server Operation
- For each milestone, include:
  - purpose
  - done check
  - non-goals
  - likely POC
  - what it unlocks
- Explain the execution rule:
  - keep a thin whole roadmap
  - plan only the next POC in detail
  - update the roadmap after each POC
- Clarify that server operation is partly cross-cutting but becomes a full milestone later.
- Keep links from `docs/README.md` valid.

## Non-Goals

- Do not implement any runtime behavior.
- Do not create the next POC plan yet.
- Do not design a full artifact schema.
- Do not design socket protocols, Docker sandboxing, auth, job queues, or multi-tenant systems.
- Do not rework unrelated POC code or verification leftovers.
- Do not rewrite all docs unless a link or short wording change is needed.

## Design Direction

Use `docs/milestones.md` as the roadmap.

The document should lead with this idea:

```text
Roadmap first, but thin.
Next POC detailed, but only after the roadmap is clear.
```

The roadmap flow should be a real ASCII flow chart:

```text
[0. Direction Locked]
          |
          v
[1. Artifact Handoff]
          |
          v
[2. Artifact Viewer]
          |
          v
[3. File Edit Review]
          |
          v
[4. Worker Session]
          |
          v
[5. Worker Roles]
          |
          v
[6. Orchestrated Flow]
          |
          v
[7. Server Operation]
```

Each milestone should answer a verification question, for example:

```text
Can the orchestrator create and use task artifacts?
```

The next likely POC should be `Artifact Handoff`.

## Test Strategy

docs-only

Checks should confirm:

- `docs/milestones.md` contains the agreed milestone sequence.
- Each milestone has purpose, done check, non-goals, likely POC, and what it unlocks.
- The roadmap includes a real ASCII flow chart.
- The roadmap says to keep the whole roadmap thin and detail only the next POC.
- The roadmap does not claim sockets, Docker, auth, job queues, or multi-tenant design are required now.
- Local markdown links still resolve.

## Task

Update the My-agents-town roadmap document.

### AC1: The roadmap sequence is clear

The document shows the agreed milestone order and makes the next likely POC visible.

#### TC1

Read `docs/milestones.md` and confirm it includes:

- Direction Locked
- Artifact Handoff
- Artifact Viewer
- File Edit Review
- Worker Session
- Worker Roles
- Orchestrated Flow
- Server Operation

#### TC2

Confirm the document includes a real ASCII flow chart.

#### TC3

Confirm the next likely POC is `Artifact Handoff`.

### AC2: Each milestone has usable guidance

Each milestone tells a future planner why it exists and how to know it passed.

#### TC1

Confirm each milestone includes `Purpose`.

#### TC2

Confirm each milestone includes `Done Check`.

#### TC3

Confirm each milestone includes `Non-goals`.

#### TC4

Confirm each milestone includes `Likely POC`.

#### TC5

Confirm each milestone includes `Unlocks`.

### AC3: The roadmap stays thin and avoids overdesign

The document sets a planning rule that keeps the roadmap useful without freezing unknown runtime details.

#### TC1

Confirm the document says to keep the whole roadmap thin and plan only the next POC in detail.

#### TC2

Search `docs/milestones.md` for socket, Docker, auth, job queue, and multi-tenant wording. Confirm they only appear as non-goals or future concerns.

#### TC3

Confirm server operation is described as partly cross-cutting and a later full milestone.

### AC4: Docs remain connected

The roadmap still fits the docs set.

#### TC1

Confirm `docs/README.md` still links to `docs/milestones.md`.

#### TC2

Run the local markdown link check.

## Execution Order

1. Update `docs/milestones.md`.
2. Read the updated file for clarity and missing sections.
3. Run text checks for milestone names and required section labels.
4. Run local markdown link check.
5. Update execute progress and build QA handoff.

## Open Risks

- The roadmap could become too detailed and drift into runtime design.
- The roadmap could make `Server Operation` look too late even though Tailscale smoke checks may still happen during earlier POCs.
- Existing unrelated POC verification changes remain in the worktree and should stay out of this task.

## Execute Handoff

- task_id: `roadmap-doc`
- plan_path: `.everything-automate/plans/2026-04-20-roadmap-doc.md`
- approval_state: `approved`
- execution_unit: `AC`
- test_strategy: `docs-only`
- open_risks:
  - avoid turning the roadmap into full runtime architecture
  - explain server operation as cross-cutting plus later milestone
  - avoid touching unrelated POC verification changes
