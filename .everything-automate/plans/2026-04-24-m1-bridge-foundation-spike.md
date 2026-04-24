# Plan: M1 bridge foundation spike

## Task Summary

Run a small spike to choose the best foundation for the M1 phone-to-local Codex live bridge.

The spike compares `codex app-server`, `codex exec-server`, `codex exec --json`, and `codex exec resume --json` before any full live bridge implementation is planned.

## Desired Outcome

After this work:

- A short comparison artifact exists.
- Each of the four Codex bridge candidates has been tested or clearly ruled out with evidence.
- The artifact records connection shape, event shape, session behavior, follow-up reply path, reconnect/replay implications, timeout/cancel/disconnect behavior, Next.js proxy fit, and private-network security fit.
- The artifact recommends one bridge foundation for the next M1 design or implementation step.
- The existing `agent-chat-poc` remains intact unless tiny spike-only helper files or notes are needed.

## In Scope

- Inspect and run `codex app-server`.
- Inspect and run `codex exec-server`.
- Inspect and run `codex exec --json`.
- Inspect and run `codex exec resume --json`.
- Use the current repo and local Codex CLI as the test environment.
- Record commands, observations, event samples, limits, and recommendation.
- Keep the phone/browser side conceptual: the acceptance boundary is whether the existing Next.js app could proxy the candidate with a thin adapter.
- Write the comparison artifact under `docs/experiments/` or another clearly named docs path.

## Non-Goals

- Do not implement the full live bridge.
- Do not add skill list UI.
- Do not invoke registered Codex skills from the phone.
- Do not build final routing, full idea console, production auth, full sandbox security, or multi-agent orchestration.
- Do not expose anything on the public internet.
- Do not make PTY/tmux a peer candidate unless all four main candidates fail.
- Do not refactor unrelated POC code.

## Design Direction

Use a spike-first flow:

```text
[Read accepted design note]
   |
   v
[Run app-server spike]
   |
   v
[Run exec-server spike]
   |
   v
[Run exec --json spike]
   |
   v
[Run exec resume --json spike]
   |
   v
[Compare against hard checks]
   |
   v
[Recommend bridge foundation]
```

Keep browser transport and Codex transport separate:

```text
[Phone browser]
   |
   v
[Next.js bridge / proxy]
   |
   v
[Chosen Codex transport]
```

The spike should judge whether the existing Next.js POC can proxy each candidate with a thin adapter. The phone does not need to connect directly to Codex service protocols.

## Test Strategy

backend verification

The checks are command and artifact based. Prefer local command probes and small captured samples over UI work.

Do not require automated tests for the experimental Codex server protocols. The verification target is the comparison artifact and the evidence it records.

## Task

Create the M1 bridge foundation spike result.

### AC1: The spike artifact exists and uses the accepted criteria

The spike has one comparison artifact that future planning can read.

#### TC1

Confirm the artifact exists at a clear path, such as `docs/experiments/m1-bridge-foundation-spike.md`.

#### TC2

Confirm the artifact lists the four candidates:

- `codex app-server`
- `codex exec-server`
- `codex exec --json`
- `codex exec resume --json`

#### TC3

Confirm the artifact includes the shared criteria:

- stable run/session id
- second message targeting the same run/session
- partial events before process exit
- reconnect state recovery or event replay
- observable timeout/cancel/disconnect state
- thin Next.js proxy fit
- Tailscale/private-network security fit

### AC2: `codex app-server` is probed

The spike records whether `app-server` is suitable for M1.

#### TC1

Run `codex app-server --help` and record the relevant listen/auth options.

#### TC2

Attempt a minimal local run with a loopback websocket listener and record whether it starts, what address it exposes, and how auth/token setup behaves.

#### TC3

Record whether a thin Next.js proxy looks practical or whether protocol discovery is too large for M1.

### AC3: `codex exec-server` is probed

The spike records whether `exec-server` is suitable for M1.

#### TC1

Run `codex exec-server --help` and record the relevant listen options.

#### TC2

Attempt a minimal local run with a loopback websocket listener and record whether it starts and what protocol clues or logs are visible.

#### TC3

Record whether `exec-server` appears better suited than `app-server` for service-style live local runs.

### AC4: `codex exec --json` is probed

The spike records what plain JSONL exec can and cannot do.

#### TC1

Run a tiny prompt with `codex exec --json` in a safe local cwd and capture a small event sample.

#### TC2

Confirm whether partial events arrive before process exit.

#### TC3

Record whether plain exec exposes enough session/run identity for a follow-up reply path.

### AC5: `codex exec resume --json` is probed

The spike records whether resume can support M1 follow-up turns.

#### TC1

Run an initial non-interactive JSON exec prompt and identify how to find or capture its session id.

#### TC2

Run a follow-up with `codex exec resume --json` against the same session, or record clearly why that is not possible.

#### TC3

Record whether the resumed turn streams events and preserves enough context for M1.

### AC6: The spike recommends a bridge foundation

The artifact gives a clear recommendation for the next M1 step.

#### TC1

Confirm the artifact ranks the four candidates or clearly marks them as pass/fail.

#### TC2

Confirm the recommendation follows the accepted decision rule:

- prefer `app-server` if it provides a usable remote/session protocol with streaming and replies
- otherwise prefer `exec-server` if it is better suited for service-style live local runs
- otherwise prefer `exec resume --json` if it supports stable follow-up turns with JSONL events
- otherwise use plain `exec --json` only for a thin first live bridge
- keep PTY/tmux fallback-only

#### TC3

Confirm the artifact states what the next planning/design step should read and what it must not assume.

## Execution Order

1. Read the accepted brainstorming note and DEC-003.
2. Create the spike artifact skeleton.
3. Probe `codex app-server`.
4. Probe `codex exec-server`.
5. Probe `codex exec --json`.
6. Probe `codex exec resume --json`.
7. Fill the comparison table and event/session observations.
8. Write the recommendation and next-step handoff.
9. Run local checks that the artifact exists and contains all candidates and criteria.

## Open Risks

- `app-server` and `exec-server` are experimental and may need protocol discovery that is too large for M1.
- `exec resume --json` may not expose session ids in a convenient way.
- Some commands may keep running if not bounded by timeout or loopback-only listeners.
- The spike could drift into full bridge implementation if the scope is not kept tight.

## Execute Handoff

- task_id: `m1-bridge-foundation-spike`
- plan_path: `.everything-automate/plans/2026-04-24-m1-bridge-foundation-spike.md`
- approval_state: `approved`
- execution_unit: `AC`
- test_strategy: `backend verification`
- source_brainstorming: `.everything-automate/state/brainstorming/archive/20260424-211800-m1-bridge-foundation-spike.md`
- source_decision: `.everything-automate/decisions/DEC-003-m1-bridge-foundation-spike.md`
- open_risks:
  - keep this as a spike, not full bridge implementation
  - bound experimental server probes to loopback/private use
  - do not assume `codex exec` wins by default
  - keep skills, routing, auth, sandboxing, and multi-agent work out of scope
