# DEC-002: Headless Codex CLI as the first worker

## Status

Accepted

## Decision

For the first Artifact Handoff POC, use headless Codex CLI as the worker.

The main orchestrator surface should write a task artifact, call Codex CLI in
headless mode, and ask that worker to read the task artifact and write a result
artifact.

## Why

The project needs to prove a real handoff, not only a fake in-process worker.

Codex CLI is already the current `v0` implementation path. The existing
agent-chat POC already calls Codex CLI once from a Next.js API route, so the next
step can build on that working shape while moving task state into files.

## Consequences

- The first worker boundary is a spawned Codex CLI process.
- The first task artifact should be simple and file-based.
- The first result artifact should be written by the worker, not generated only
  by the main API route.
- This does not add multiple workers, persistent worker sessions, direct
  agent-to-agent communication, or a full artifact schema.
- Later backlog items can add artifact viewing, file edit review, worker
  sessions, worker roles, and orchestrated multi-worker flow.
