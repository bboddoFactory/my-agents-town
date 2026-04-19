# Agent Orchestration Direction

This repo is not trying to build a generic multi-agent orchestration product first.

The near-term goal is simpler:

```text
Build real products and tools for personal use.
Make those products easy for agents to use and operate.
Use a web surface as the main interactive entry point.
```

## Core Idea

The main system needs one interactive orchestrator that talks with the user.

That orchestrator should:

- understand the user's intent
- ask for missing details
- choose the next worker or tool
- track current task state
- show progress and debug output
- ask for approval when needed
- summarize what changed
- recover when a worker fails

The orchestrator does not need to do every task itself.

```text
[User]
   |
   v
[Main Interactive Orchestrator]
   |
   +--> [Codex / builder]
   +--> [OpenClaw / operator]
   +--> [OpenCode / headless reviewer or helper]
   +--> [Frontend specialist]
   +--> [Product backend APIs]
   +--> [GPU services]
```

## Product Meaning

"Product" means the actual app, service, or tool being built for use.

It does not mean this repo must first become a commercial orchestration platform.

Example:

```text
Codex builds a useful product.
The product exposes a backend API.
OpenClaw can use that API from Discord.
OpenCode can be called headlessly for review or advice.
The user can control the work from a web UI.
```

## Role Split

Codex is best treated as the main builder and integrator.

Codex should usually own:

- product code
- backend/API implementation
- file edits
- tests
- docs and generated artifacts
- final integration judgment

OpenClaw is best treated as an operator.

OpenClaw should usually own:

- Discord-based interaction
- product API usage
- status checks
- repeated operational tasks
- light data creation
- "always available" usage from outside the laptop

OpenCode is best treated as a headless worker layer.

OpenCode can help with:

- model-specific review
- alternate implementation ideas
- code critique
- small isolated tasks
- frontend or domain specialist runs

Frontend specialist agents may be added later.

They should help with:

- UI quality
- layout
- responsive behavior
- screenshot review
- accessibility
- visual polish

## Important Boundary

Do not start by making agents talk to each other freely.

Start with a clear user-facing loop:

```text
[User request]
      |
      v
[Main orchestrator decides]
      |
      v
[One worker/tool runs]
      |
      v
[Result shown to user]
      |
      v
[User or orchestrator decides next step]
```

Free agent-to-agent discussion can come later, only where it helps.

## Server Direction

The MacBook should not be the long-running center.

The 24-hour GPU server should become the persistent workspace for:

- agent runner processes
- product backend services
- GPU services such as embeddings and speech-to-text
- logs
- run state
- web UI access over Tailscale

Target shape:

```text
[Phone / Laptop / Browser]
       |
       v
[Web UI over Tailscale]
       |
       v
[24-hour GPU server]
       |
       +--> agent runners
       +--> product services
       +--> GPU services
       +--> logs and run state
```

## Near-Term Rule

Keep the first system small.

The current POC should only prove:

```text
Browser chat UI -> backend -> CLI agent -> debug result -> browser
```

Do not add multi-agent routing, Docker, auth, job queues, or long-running session management until the first loop is proven.

