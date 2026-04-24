# Plan: My-agents-town docs foundation

## Task Summary

Set up the first stable documentation structure for My-agents-town.

The docs should explain the project direction before more POCs or runtime work are added.

## Desired Outcome

After this work:

- A reader can understand why My-agents-town exists.
- A reader can understand that this is a personal main-orchestrator system, not a public generic agent platform.
- A reader can understand the artifact-first workflow.
- Existing POC docs link into the broader direction instead of standing alone.
- The current POC remains documented as the first test of an orchestrator calling one worker.

## In Scope

- Create a clear docs entry point.
- Add a project vision document.
- Add an artifact-first workflow document.
- Add an agent roles document.
- Add or update a milestones document.
- Add a POC result or experiment note for `experiments/agent-chat-poc`.
- Update existing docs links so the reading path is clear.
- Keep wording simple and project-specific.
- Preserve useful content from existing docs.

## Non-Goals

- Do not implement new runtime behavior.
- Do not refactor the POC code.
- Do not create a broad public platform spec.
- Do not design a full socket protocol.
- Do not introduce Docker, auth, job queues, or multi-tenant concepts.
- Do not make a large formal architecture document.
- Do not clean unrelated local POC verification changes unless explicitly asked.

## Design Direction

Use a small `docs/` structure:

```text
docs/
  README.md
  vision.md
  artifact-first-workflow.md
  agent-roles.md
  milestones.md
  experiments/
    agent-chat-poc.md
```

Keep experiment-specific run instructions in each experiment folder:

```text
experiments/agent-chat-poc/README.md
```

Use `docs/README.md` as the reading map.

Use `docs/vision.md` to lock the project identity:

```text
My-agents-town is a personal main-orchestrator environment.
The user talks with the main orchestrator.
Different agents and models keep their strengths.
Artifacts are the shared state between stages and agents.
```

Use `docs/artifact-first-workflow.md` to explain the core flow:

```text
[User]
   |
   v
[Main Orchestrator brainstorms]
   |
   v
[Task artifact]
   |
   v
[Planning / Execute / QA agents read and write artifacts]
   |
   v
[Main Orchestrator summarizes and decides next]
```

Use `docs/agent-roles.md` to keep roles concrete:

- Main orchestrator
- Codex-style builder agents
- OpenCode-style reviewer/helper agents
- OpenClaw-style operator agents
- Frontend specialist agents
- Local or GPU model services

Use `docs/milestones.md` to replace broad POC-only milestone framing with project-level milestones.

Use `docs/experiments/agent-chat-poc.md` to record what the POC proved, what needed small fixes, and what remains open.

## Test Strategy

docs-only

Checks should confirm:

- New docs exist at the intended paths.
- Links between docs resolve locally.
- Existing POC README links to the broader docs.
- The docs use the corrected project name: `My-agents-town`.
- The docs do not describe the project as `Everything Automate` or `Everything Cloud Code`.
- The docs do not claim the project is a public AI agent platform.
- The docs do not imply socket-based or Docker-based orchestration is already required.

## Task

Create the My-agents-town docs foundation.

### AC1: The project identity is clear

The docs explain that My-agents-town is a personal main-orchestrator environment.

#### TC1

Read `docs/vision.md` and confirm it says the project is personal and main-orchestrator centered.

#### TC2

Search docs for old or wrong project names and confirm no main direction doc uses them as the project name.

#### TC3

Search docs for wording that frames the project as a public generic AI agent platform and revise if needed.

### AC2: The artifact-first workflow is documented

The docs explain that brainstorming creates task artifacts and later agents read and write files as shared state.

#### TC1

Read `docs/artifact-first-workflow.md` and confirm it covers:

- brainstorming as task extraction
- task artifacts
- planning, execute, and QA artifacts
- file-based state as the first coordination model

#### TC2

Confirm the workflow includes a real ASCII flow chart.

### AC3: Agent roles are documented without overbuilding

The docs explain the expected role of each agent type without designing a full runtime.

#### TC1

Read `docs/agent-roles.md` and confirm it includes:

- main orchestrator
- Codex-style builder
- OpenCode-style reviewer/helper
- OpenClaw-style operator
- frontend specialist
- local or GPU model services

#### TC2

Confirm the role doc does not require direct agent-to-agent sockets for the first version.

### AC4: POC docs connect to the broader direction

The existing agent chat POC is documented as the first orchestrator capability test.

#### TC1

Read `docs/experiments/agent-chat-poc.md` and confirm it records:

- goal
- result
- commands or verification shape
- fixes found during smoke test
- remaining issues

#### TC2

Read `experiments/agent-chat-poc/README.md` and confirm it links to the broader docs.

### AC5: The docs have a usable reading path

The docs entry point tells a future reader where to start and what each document means.

#### TC1

Read `docs/README.md` and confirm it links to all top-level docs.

#### TC2

Run a simple link/path check by listing all linked local markdown targets and confirming the files exist.

## Execution Order

1. Create `docs/README.md`.
2. Create `docs/vision.md`.
3. Create `docs/artifact-first-workflow.md`.
4. Create `docs/agent-roles.md`.
5. Create or update `docs/milestones.md`.
6. Create `docs/experiments/agent-chat-poc.md`.
7. Update `experiments/agent-chat-poc/README.md` links if needed.
8. Decide whether to keep, merge, or supersede the existing two docs:
   - `docs/agent-orchestration-direction.md`
   - `docs/agent-chat-poc-milestones.md`
9. Run docs-only checks.

## Open Risks

- Existing docs may duplicate new docs unless they are clearly merged or marked as superseded.
- Local POC verification changes are still present and should not be mixed into this docs task unless the user asks.
- The final file names may change if the user prefers a different doc taxonomy.
- The project direction is clear enough for docs, but the runtime design is still intentionally open.

## Execute Handoff

- task_id: `docs-foundation`
- plan_path: `.everything-automate/plans/2026-04-19-docs-foundation.md`
- approval_state: `approved`
- execution_unit: `AC`
- test_strategy: `docs-only`
- open_risks:
  - avoid mixing POC code cleanup with docs foundation work
  - avoid over-specifying runtime details before the next POC
  - handle existing docs by merge or supersede, not by silent duplication
