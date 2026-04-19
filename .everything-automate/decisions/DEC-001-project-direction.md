# DEC-001: My-agents-town project direction

## Status

Accepted

## Decision

My-agents-town is a personal agent workflow environment.

It is not a generic public AI agent platform first.

The core direction is:

- The user talks with one main orchestrator.
- Brainstorming is done by the main orchestrator with the user.
- Brainstorming turns fuzzy intent into a clear task artifact.
- Later stages use agents with different strengths.
- Agents should read and write task artifacts instead of receiving all context only through prompts.
- File-based state is the first coordination model.
- Codex, OpenCode, OpenClaw, frontend specialists, and local or GPU model services can become different agent workers.

## Why

Different models and agent services are good at different work.

The project should preserve those strengths instead of hiding every worker behind one generic sub-agent call.

As workflows move through brainstorming, planning, execute, and QA, each step naturally creates artifacts. Those artifacts should become the shared state that agents read and write.

## Consequences

- Documentation should explain artifact-first workflow clearly.
- POC documents should be framed as tests of orchestrator capabilities, not just CLI calls.
- Early implementation should stay small and file-based.
- Socket-based live agent collaboration is not required at the start.
- Next.js can remain the main UI and server host for now.
- A separate backend process should not be introduced until a concrete runtime need appears.
