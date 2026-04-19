# Worker Session

## State

todo

## Problem

One-shot worker calls lose useful context for longer work.

The project needs to learn when a persistent or resumable worker session is worth the complexity.

## Desired Outcome

A worker can continue from a prior task or session for at least one follow-up message.

## Acceptance Criteria

- [ ] A worker can continue from a prior task or session.
- [ ] The user can send at least two related messages.
- [ ] The second message can use context from the first.
- [ ] The user can stop a stuck worker.

## Notes

Do not require every worker to be persistent.

Roadmap link:

- [Worker Session](../../milestones.md#4-worker-session)
