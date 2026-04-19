# Agent Roles

My-agents-town should use different agents for work that fits their strengths.

This document describes roles, not a final runtime protocol.

## Main Orchestrator

The main orchestrator is the user's main conversation partner.

It should:

- brainstorm with the user
- turn intent into task artifacts
- decide the next stage
- choose which worker should run
- read worker results
- explain progress
- ask for approval when needed

The main orchestrator is not just a router. It owns the shape of the task and the next decision.

## Codex-style Builder Agents

Codex-style agents are best for coding work.

They should usually handle:

- code edits
- tests
- integration work
- repo inspection
- implementation notes
- final code-level judgment before QA

## OpenCode-style Reviewer Or Helper Agents

OpenCode-style agents are useful as a second model view.

They can help with:

- code review
- alternate implementation ideas
- critique of a plan
- small isolated helper work
- model-specific comparison

## OpenClaw-style Operator Agents

OpenClaw-style agents are best treated as operators.

They can help with:

- Discord-based interaction
- product API usage
- repeated checks
- status reporting
- lightweight data creation
- always-available usage from outside the main machine

## Frontend Specialist Agents

Frontend specialist agents can help when UI quality matters.

They can focus on:

- layout
- responsive behavior
- screenshot review
- accessibility
- visual polish

## Local Or GPU Model Services

Local or GPU model services can support the workflow without becoming full coding agents.

They may handle:

- embeddings
- search
- speech-to-text
- text-to-speech
- cheap classification
- repeated summarization

## First Boundary

The first version should not require free agent-to-agent sockets.

Start with this pattern:

```text
[Main orchestrator]
       |
       v
[Task artifact for one worker]
       |
       v
[Worker writes result artifact]
       |
       v
[Main orchestrator reads and decides]
```

Agents can read each other's result artifacts later when that helps.
