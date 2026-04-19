# Agent Chat POC Milestones

This document explains the path behind `experiments/agent-chat-poc`.

The first POC should stay narrow. It is a test bench for whether a web UI can become the main entry point for CLI agents running on a server.

## Milestone Map

```text
[A. One-shot CLI call]
        |
        v
[B. Persistent session]
        |
        v
[D. File read/edit workflow]
        |
        v
[C. Agent selector]
        |
        v
[E. Remote server workflow]
```

`C` comes after `A`, `B`, and the small part of `D` because agent choice is less important than proving that one agent can be controlled well.

## A. One-Shot CLI Call

Goal:

```text
Web chat input -> API route -> one CLI process -> stdout/stderr/debug -> web UI
```

Definition of done:

- The Next.js app starts.
- The user can type a message in the browser.
- The backend starts one configured Codex CLI process.
- The UI shows the agent stdout.
- The debug panel shows:
  - `ok`
  - `stderr`
  - `exitCode`
  - `durationMs`
  - `timedOut`
  - `command`
  - `args`
  - `cwd`
  - `timeoutMs`
- A run JSON file is saved under `runs/`.

Non-goals:

- No persistent session.
- No long-running job queue.
- No multi-agent selection.
- No Docker sandbox.
- No production auth.

Why this comes first:

If the web server cannot call a CLI agent and return the result cleanly, later orchestration work has no stable base.

## B. Persistent Session

Goal:

Keep a CLI agent session alive across multiple user messages.

Questions to answer:

- Should the session use pty, tmux, or an agent-native session mode?
- How do we know where one answer ends?
- How do we stream logs to the browser?
- How does the user cancel a stuck session?
- What idle timeout should sessions have?

Definition of done:

- The user can start a session.
- The user can send at least two messages to the same session.
- The second message can use context from the first.
- The UI can show live or near-live output.
- The user can stop the session.

## D. File Read/Edit Workflow

Goal:

Let the agent safely read and edit files in a controlled workspace.

Small smoke test:

```text
Ask the agent to add one line to sandbox/todo.md.
Confirm the file changed.
```

Later definition of done:

- The agent can inspect files in a sandbox.
- The agent can make a small edit.
- The UI can show changed files.
- The UI can show a diff.
- The user can accept or reject the result.

Sandbox levels:

```text
Level 1: prompt instruction only
Level 2: cwd points to sandbox
Level 3: temp copy or git worktree
Level 4: Docker container with limited mount
```

Current POC uses Level 2:

```text
cwd = experiments/agent-chat-poc/sandbox
prompt prefix = "Only read or edit files in this directory."
```

This is not a real security boundary.

## C. Agent Selector

Goal:

Add more CLI agents after one agent path works.

Possible workers:

- Codex
- OpenCode
- Claude Code
- OpenClaw
- frontend specialist agent

Definition of done:

- The UI can choose a configured agent.
- Each agent has a small runner implementation.
- Results use the same response shape.
- The user can compare outputs.

This should not happen before `A` works.

## E. Remote Server Workflow

Goal:

Run the app on the 24-hour GPU server and access it through Tailscale.

Definition of done:

- The repo is cloned on the GPU server.
- `experiments/agent-chat-poc` starts with `pnpm dev --host 0.0.0.0`.
- The app is reachable through:

```text
http://<tailscale-hostname-or-ip>:3000
```

- At least one one-shot agent call works on the server.
- Run logs are written on the server.

Future server work:

- run as a service
- persist sessions
- isolate workers
- connect GPU services
- add auth if exposed beyond Tailscale

## Current Priority

Finish and learn from `A`.

Then choose between:

```text
B first: if chat continuity matters most.
D first: if repo edit workflow matters most.
E first: if remote access is still unstable.
```

Do not widen into a full orchestration platform before the next concrete failure is known.

