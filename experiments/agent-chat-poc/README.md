# Agent Chat POC

This POC checks the smallest useful loop:

```text
[Browser Chat UI]
        |
        v
[Next.js API route]
        |
        v
[task.md artifact]
        |
        v
[One-shot Codex CLI process]
        |
        v
[result.md artifact]
        |
        v
[stdout/stderr/debug result]
        |
        v
[Browser Chat UI]
```

## Goal

Prove that a web page can send one message to a CLI coding agent and show the result.

The first target is Codex CLI. The runner shape is kept generic enough to add OpenCode, Claude Code, or OpenClaw later.

For the broader direction and milestone context, read:

- [My-agents-town docs](../../docs/README.md)
- [Vision](../../docs/vision.md)
- [Agent chat POC experiment note](../../docs/experiments/agent-chat-poc.md)

## Non-Goals

- No persistent agent session yet.
- No multi-agent selector yet.
- No Docker sandbox yet.
- No production auth yet.
- No long-running jobs yet.
- No external deployment setup beyond Tailscale access.

## Current Scope

Milestone A:

- Web chat input.
- Backend writes `artifacts/tasks/task-*/task.md`.
- Backend calls Codex CLI once and points it at `task.md`.
- Codex CLI writes `result.md` in the same task folder.
- UI shows stdout as the agent answer.
- UI shows debug details:
  - `ok`
  - `stderr`
  - `exitCode`
  - `durationMs`
  - `timedOut`
  - `command`
  - `args`
  - `cwd`
  - `timeoutMs`
  - `taskPath`
  - `resultPath`
  - `resultWritten`
  - `handoffComplete`
- Each run is saved as `runs/*.json`.

Small D smoke test:

- `sandbox/todo.md` exists.
- The UI includes an example prompt that asks the agent to edit `todo.md`.

## Sandbox Model

Current POC sandboxing is only:

```text
cwd = ./sandbox
prompt instruction = "Only inspect or edit files in the sandbox workspace,
except you may read task.md and write result.md."
```

This is not a security boundary.

Future versions should use a temp copy, git worktree, or Docker container with only `/workspace` mounted.

## Local Run

```bash
cd experiments/agent-chat-poc
cp .env.example .env.local
pnpm install
pnpm dev
```

Open:

```text
http://localhost:3000
```

## GPU Server Handoff

On the 24-hour GPU server:

```bash
git clone <repo-url>
cd <repo>/experiments/agent-chat-poc
cp .env.example .env.local
codex --version
pnpm install
pnpm dev --host 0.0.0.0
```

Then open through Tailscale:

```text
http://<tailscale-hostname-or-ip>:3000
```

If the Codex CLI command shape is different on the server, edit `.env.local`:

```text
AGENT_CODEX_COMMAND=codex
AGENT_CODEX_ARGS=exec
AGENT_TIMEOUT_MS=120000
```

## Example Prompts

Summarize the sandbox:

```text
Summarize the files in this sandbox.
```

Small file edit smoke test:

```text
Add one todo item to todo.md saying this POC can edit files.
```

## Next Checks

```text
A. One-shot web -> CLI -> web response
   |
   v
B. Persistent session
   |
   v
D. Repo file read/edit with visible diff
   |
   v
C. Agent selector
   |
   v
E. Remote server workflow over Tailscale
```

## Open Questions

- Does the server Codex CLI support `codex exec <prompt>`?
- Does Codex return useful output on stdout, stderr, or both?
- Does one-shot mode preserve enough context for small tasks?
- What is the right persistent session method later: pty, tmux, or agent-native session?
- Should long jobs become a job queue before file edits get larger?
