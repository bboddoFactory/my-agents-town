# Artifact Handoff

## State

todo

## Problem

Prompt-only worker calls do not leave enough durable task state.

The system needs a first file-based handoff so workers can read task artifacts and write result artifacts.

## Desired Outcome

The main orchestrator can create a task artifact, a worker can read it, and the worker can write a result artifact.

## Acceptance Criteria

- [ ] A user message becomes a task artifact.
- [ ] The task artifact records outcome, scope, non-goals, and done check.
- [ ] A worker reads the task artifact.
- [ ] A worker writes a result artifact.
- [ ] The UI or debug output shows artifact paths.

## Notes

This is the next likely item.

Keep the first version small:

- no full artifact schema
- no multiple workers
- no persistent sessions
- no direct agent-to-agent communication

Roadmap link:

- [Artifact Handoff](../../milestones.md#1-artifact-handoff)
