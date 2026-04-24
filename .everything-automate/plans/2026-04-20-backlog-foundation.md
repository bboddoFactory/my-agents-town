# Plan: Roadmap backlog foundation

## Task Summary

Create a small file-based backlog from the current My-agents-town roadmap.

The backlog should make each roadmap milestone easy to pick for later `$brainstorming` or `$planning`.

## Desired Outcome

After this work:

- `docs/backlog/` exists.
- The roadmap milestones are captured as backlog items.
- `Direction Locked` is marked done.
- `Artifact Handoff` is the first todo item.
- Later roadmap steps are captured as thin todo items.
- A reader can understand the difference between roadmap, backlog, plans, and execution state.

## In Scope

- Create `docs/backlog/README.md`.
- Create `docs/backlog/done/000-direction-locked.md`.
- Create `docs/backlog/todo/001-artifact-handoff.md`.
- Create `docs/backlog/todo/002-artifact-viewer.md`.
- Create `docs/backlog/todo/003-file-edit-review.md`.
- Create `docs/backlog/todo/004-worker-session.md`.
- Create `docs/backlog/todo/005-worker-roles.md`.
- Create `docs/backlog/todo/006-orchestrated-flow.md`.
- Create `docs/backlog/todo/007-server-operation.md`.
- Update docs navigation if needed so the backlog is discoverable.
- Keep items thin and aligned with `docs/milestones.md`.

## Non-Goals

- Do not create detailed execution plans for each backlog item.
- Do not implement any runtime behavior.
- Do not change the roadmap sequence unless a direct inconsistency is found.
- Do not create issue tracker integration.
- Do not add priority scoring, labels, estimates, or release buckets.
- Do not clean unrelated POC verification changes.

## Design Direction

Use this file layout:

```text
docs/backlog/
  README.md
  done/
    000-direction-locked.md
  todo/
    001-artifact-handoff.md
    002-artifact-viewer.md
    003-file-edit-review.md
    004-worker-session.md
    005-worker-roles.md
    006-orchestrated-flow.md
    007-server-operation.md
```

Use a small backlog item shape:

```markdown
# Title

## State

todo | done

## Problem

What is missing or unclear.

## Desired Outcome

What should be true when this is done.

## Acceptance Criteria

- [ ] Observable result

## Notes

Constraints and roadmap links.
```

Use `done` only for Direction Locked because the direction docs and decision note already exist.

Do not mark POC code work as done in this backlog unless it directly matches the roadmap item. The current agent-chat POC is evidence for the first worker call, but the next backlog should focus on the roadmap from here.

## Test Strategy

docs-only

Checks should confirm:

- The backlog folder structure exists.
- Every expected backlog item exists.
- Each backlog item contains `State`, `Problem`, `Desired Outcome`, `Acceptance Criteria`, and `Notes`.
- `000-direction-locked.md` is in `done`.
- `001-artifact-handoff.md` is in `todo` and is clearly the next item.
- `docs/backlog/README.md` explains roadmap vs backlog vs plan vs execution state.
- Local markdown links still resolve.

## Task

Create the roadmap backlog foundation.

### AC1: Backlog structure exists

The repo has a simple backlog folder that matches the current docs style.

#### TC1

Confirm `docs/backlog/README.md` exists.

#### TC2

Confirm `docs/backlog/done/000-direction-locked.md` exists.

#### TC3

Confirm all seven todo files exist under `docs/backlog/todo/`.

### AC2: Backlog items are usable

Each item can be picked later without reopening the whole roadmap discussion.

#### TC1

Confirm each backlog item contains `State`.

#### TC2

Confirm each backlog item contains `Problem`.

#### TC3

Confirm each backlog item contains `Desired Outcome`.

#### TC4

Confirm each backlog item contains `Acceptance Criteria`.

#### TC5

Confirm each backlog item contains `Notes`.

### AC3: Backlog state matches the roadmap

The backlog states reflect the current project stage.

#### TC1

Confirm `Direction Locked` is in `done`.

#### TC2

Confirm `Artifact Handoff` is in `todo` and marked as the next item.

#### TC3

Confirm later roadmap items remain thin todo items and do not include detailed implementation plans.

### AC4: Backlog is discoverable and linked

The docs make the backlog easy to find.

#### TC1

Confirm `docs/backlog/README.md` explains roadmap vs backlog vs plan vs execution state.

#### TC2

Confirm top-level docs navigation links to the backlog.

#### TC3

Run local markdown link check.

## Execution Order

1. Create backlog folders.
2. Create `docs/backlog/README.md`.
3. Create done item for Direction Locked.
4. Create todo items for roadmap milestones 1-7.
5. Update docs navigation if needed.
6. Run docs-only checks.

## Open Risks

- Backlog items could become too detailed and duplicate planning.
- Backlog states could imply implementation is done when only direction docs are done.
- Existing unrelated POC verification changes remain in the worktree and should not be touched.

## Execute Handoff

- task_id: `backlog-foundation`
- plan_path: `.everything-automate/plans/2026-04-20-backlog-foundation.md`
- approval_state: `approved`
- execution_unit: `AC`
- test_strategy: `docs-only`
- open_risks:
  - keep backlog items thin
  - do not turn backlog items into execution plans
  - avoid unrelated POC cleanup
