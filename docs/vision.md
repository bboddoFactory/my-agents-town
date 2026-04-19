# Vision

My-agents-town is a personal main-orchestrator environment.

The goal is to help one user build, operate, and improve real products and tools with help from different agents and models.

## Core Idea

The user should mostly talk with one main orchestrator.

The main orchestrator should:

- understand the user's intent
- ask for missing details
- turn fuzzy requests into clear task artifacts
- decide which stage should happen next
- call the right agent or tool for the current job
- read the result artifacts
- explain progress and failures
- ask for approval when needed

The main orchestrator does not need to do every task itself.

```text
[User]
   |
   v
[Main orchestrator]
   |
   +--> [Codex-style builder agents]
   +--> [OpenCode-style reviewer or helper agents]
   +--> [OpenClaw-style operator agents]
   +--> [Frontend specialist agents]
   +--> [Local or GPU model services]
   +--> [Product backend APIs]
```

## Why This Exists

Different models and agent tools are good at different work.

Some are stronger at coding. Some are stronger at review. Some are better for operations, Discord usage, repeated checks, or local model tasks.

My-agents-town should preserve those strengths instead of hiding every worker behind one generic sub-agent call.

## Main Direction

Use files as the first shared state model.

The main orchestrator should not pass every detail through one large prompt every time. Instead, important context should become task artifacts that agents can read and update.

This keeps work visible, restartable, and easier to review.

## Current Boundary

Next.js can stay as the main UI and server host for now.

A separate backend process is not needed until a concrete runtime problem appears, such as long-lived worker processes, shared sessions across surfaces, or work that must survive web server restarts.
