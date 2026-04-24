# DEC-003: Spike before choosing the M1 Codex bridge foundation

## Status

Accepted

## Decision

For M1, do not choose the phone-to-local Codex bridge foundation upfront.

First run a small bridge foundation spike that compares:

- `codex app-server`
- `codex exec-server`
- `codex exec --json`
- `codex exec resume --json`

The spike should produce a short comparison artifact and a recommendation before any full M1 live bridge implementation is planned.

## Why

The current POC uses headless `codex exec`, but M1 needs live phone-to-local interaction: message send, streamed context, and follow-up replies.

Local Codex also exposes experimental service or remote surfaces. Choosing `codex exec` only because the current POC already uses it could miss a better supported path.

`codex exec resume --json` must be included because it may be the smallest path that supports follow-up turns without requiring a persistent websocket service.

## Consequences

- The next execution plan should be a spike plan, not the full live bridge implementation.
- Planning and execution must not assume `codex exec` is the final answer.
- The spike should compare candidates using hard checks: session id, second turn behavior, partial events, reconnect/replay, timeout/cancel/disconnect state, thin Next.js proxy fit, and Tailscale/private-network security fit.
- PTY/tmux remains fallback-only unless the four main candidates fail.
- Skill list UI, skill invocation, final routing, production auth, full sandboxing, and multi-agent orchestration stay out of M1 spike scope.
