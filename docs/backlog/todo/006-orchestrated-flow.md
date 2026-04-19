# Orchestrated Flow

## State

todo

## Problem

Multiple worker results need a main orchestrator to read them and decide the next step.

Without that control point, multi-agent work can become loose agent chat.

## Desired Outcome

The main orchestrator can coordinate at least two worker results and summarize the combined result for the user.

## Acceptance Criteria

- [ ] The orchestrator can send work to one worker.
- [ ] The orchestrator can read that worker's result.
- [ ] The orchestrator can send a follow-up to another worker.
- [ ] The orchestrator can summarize the combined result for the user.

## Notes

Do not start with free agent-to-agent sockets.

Roadmap link:

- [Orchestrated Flow](../../milestones.md#6-orchestrated-flow)
