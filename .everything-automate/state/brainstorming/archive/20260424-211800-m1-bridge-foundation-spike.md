---
mode: brainstorming
status: accepted
stage: archived
version: 10
updated_at: 2026-04-24T21:18:00+09:00
owner: user
source_milestone: .everything-automate/state/milestone/archive/20260424-201000-mobile-codex-skill-console-roadmap.md
source_milestone_name: M1 - Phone-to-local Codex live bridge accepted
source_north_star: .everything-automate/state/north-star/archive/20260424-185800-mobile-codex-skill-console.md
source_north_star_title: mobile-codex-skill-console
read_test_required: true
read_test_agents: 3
read_test_style: independent-interpretation
read_test_default_model: gpt-5.4-mini
read_test_default_reasoning: medium
---

# Brainstorming State

## Source Milestone
M1: Phone-to-local Codex live bridge accepted.

The milestone output should be a blueprint-ready definition of the smallest phone-to-local-Codex bridge that can send user messages, stream Codex output or run context back, and accept follow-up replies.

## Boundary
Inside this milestone:
- Choose the smallest code design direction for phone-to-local Codex live conversation.
- Define the first bridge behavior: send message, stream output/context, accept follow-up reply.
- Use the existing `experiments/agent-chat-poc` where useful.
- Decide the first session model enough for M1.
- Decide the first phone access surface enough for M1.
- Record security limits clearly.

Outside this milestone:
- Skill list UI.
- Registered skill execution.
- Final routing after clarification.
- Full idea console.
- Production auth.
- Full sandbox security.
- Multi-agent orchestration.
- Long-term task database.

## Codebase Context
Relevant current code:
- `experiments/agent-chat-poc` is a Next.js 14 app.
- `app/page.tsx` has a browser chat UI that posts one message to `/api/chat`, waits for the full JSON response, then appends stdout as the agent message.
- `app/api/chat/route.ts` validates `{ message }`, writes a task artifact, builds a worker prompt, calls `runCodex`, reads `result.md`, saves a run JSON file, and returns one JSON response.
- `lib/agents/codex.ts` spawns `codex exec <prompt>` as a child process with stdout and stderr pipes, but buffers output until the process closes.
- `lib/artifacts.ts` creates task artifacts and reads result artifacts.
- `lib/runs.ts` stores completed run records under `runs/*.json`.
- The README says current POC proves web -> one-shot Codex CLI -> web response. It explicitly has no persistent agent session, no long-running jobs, no production auth, and no external deployment beyond Tailscale access.
- The experiment note says the POC worked over Tailscale and already hit a practical server command issue: Next should run with `--hostname 0.0.0.0`.
- Local Codex CLI version checked during brainstorming: `codex-cli 0.124.0`.
- Local Codex surfaces include:
  - `codex exec`: non-interactive/headless run. Supports `--json` JSONL events and `exec resume`.
  - `codex` interactive TUI: can run with no subcommand and can use `--remote ws://...` to connect to a remote app server websocket endpoint.
  - `codex app-server`: experimental app server. Supports `--listen stdio://` or `ws://IP:PORT` and websocket auth modes.
  - `codex exec-server`: experimental standalone websocket service.
  - `codex mcp-server`: stdio MCP server.
  - `codex resume`: can resume prior sessions, including non-interactive sessions with `--include-non-interactive`.

Important existing pattern:
- The project already favors artifact-first workflow. Even if M1 adds live streaming, durable task/result files should stay useful for debugging and recovery.

## Senior Engineer Scan
Most important lenses for M1:

1. Data flow
   The current flow is request/response. M1 needs a live event flow. The likely shape is:
   phone browser -> API starts or attaches to run -> server streams run events -> phone sends follow-up messages.

2. Session model
   The current runner is one-shot and closes after each request. True "back-and-forth like terminal Codex" needs either a persistent process/session or a practical first version that treats each follow-up as a new turn in one stored run context.

3. Streaming boundary
   `runCodex` already receives stdout/stderr chunks, but only stores them in strings. M1 can expose these chunks as events before solving full persistent Codex sessions.

4. Security and access
   Phone access likely means LAN/Tailscale first. M1 should not pretend to solve public internet auth. The design should name the acceptable private-network boundary.

5. Operations
   Long-running local Codex work needs cancellation, timeout, and reconnect behavior. M1 can be thin, but it needs a clear minimum.

6. Testing
   The easiest check is an end-to-end smoke: phone/browser sends a prompt, sees partial output before completion, sees final status, then sends one follow-up tied to the same visible conversation.

Key tradeoff:
- A true persistent PTY/tmux-style Codex session feels closest to terminal Codex, but is heavier and riskier.
- A streamed one-shot run is much smaller and builds on current code, but follow-up replies may not share real agent process context.
- A hybrid can start with streamed one-shot runs plus stored conversation/artifacts, then later replace the runner with a persistent session when the bridge is proven.
- `codex app-server` plus TUI `--remote` may be closer to a supported remote-session architecture than wrapping `codex exec`, but it is experimental and needs protocol exploration.
- PTY/tmux wrapping the interactive TUI is likely closest visually, but it couples the app to terminal control behavior and may be harder to make clean on mobile.

Senior review findings:
- The spike must include `codex exec resume --json`, not only plain `codex exec --json`. This may be the smallest path that supports follow-up turns without betting on an experimental websocket protocol.
- The note must separate browser transport from Codex transport. The phone does not need to connect directly to each Codex candidate. The chosen Next.js bridge may proxy the selected Codex transport.
- The spike pass/fail criteria need hard checks, not subjective phrases like "useful events" or "live enough."
- M1 needs explicit attention to live event storage/replay, reconnect ownership, timeout/cancel state, and process cleanup.

Focused user question:
- For M1, should we explore Codex's app-server/remote protocol before accepting `codex exec` as the bridge foundation?

## Current Design Direction
Working direction: M1 should start with a required bridge-foundation spike, then use the spike result to choose the actual live bridge implementation direction.

This brainstorming note is not trying to lock the final M1 bridge foundation. It is trying to lock the design handoff for the spike that will choose that foundation.

After the spike, a later design note or plan can lock whether M1 uses `app-server`, `exec-server`, `exec --json`, `exec resume --json`, or a fallback.

The likely implementation surface after the spike is still an extension of the existing `agent-chat-poc`, not a new system.

The likely first design is:
- Keep Next.js as the phone-accessible web surface.
- Use Tailscale/private network access for the first phone path.
- Add a run/session id.
- Stream child-process stdout/stderr chunks as live events.
- Store messages, artifacts, and run status so reconnect/debug remains possible.
- Accept follow-up replies through the same run/session record.

The unresolved choice is whether follow-up replies must use a persistent Codex process in M1.

Alternative bridge candidates now on the table:
- `codex exec --json`: easiest extension of the current POC; good for streamed events; weaker for true interactive session feel.
- `codex exec resume --json`: possible small path for follow-up turns across separate exec calls; should be compared as a first-class candidate.
- `codex app-server --listen ws://...` plus a remote client: potentially more native for a remote UI; experimental; requires protocol discovery.
- PTY/tmux wrapper around interactive `codex`: close to terminal behavior; likely brittle and harder to model cleanly.
- `codex exec-server`: may be relevant for a service-style bridge; experimental; protocol needs inspection.
- `codex mcp-server`: probably not the main M1 bridge because MCP exposes tools/server behavior, not a user-facing live Codex chat session.

## Decisions
- The chosen milestone is M1 from the locked roadmap.
- M1 is about the phone-to-local live bridge only.
- The existing `agent-chat-poc` is relevant starting code context.
- Before choosing `codex exec` as the bridge foundation, M1 must investigate Codex's native-looking remote/service surfaces: `codex app-server` and `codex exec-server`.
- The investigation is a required design input, not a later nice-to-have.
- The required investigation should be a small spike, not only reading help text or docs.
- The accepted spike scope is:
  - Spike A: run and inspect `codex app-server`.
  - Spike B: run and inspect `codex exec-server`.
  - Spike C: run and inspect `codex exec --json`.
  - Spike D: run and inspect `codex exec resume --json`.
  - Compare the four candidates against M1 needs before choosing the bridge foundation.
- Senior review confirmed the spike-first direction, but found the comparison set incomplete without `codex exec resume --json`.

## Learning Notes
- "Streaming" can mean simply sending stdout/stderr chunks to the browser as they arrive. That is smaller than solving a full terminal session.
- "Persistent conversation" can mean process persistence or state persistence. Process persistence keeps one live worker open. State persistence stores prior turns/artifacts and starts new worker calls with that context.
- For M1, the design should avoid solving skill listing or skill execution. Those belong to later milestones.
- Headless `codex exec` is not automatically the best bridge. It is the easiest because the current POC already uses it.
- The local CLI has a more native-looking remote path: `codex app-server` and `codex --remote`. This may be the right thing to study before choosing a bridge.
- A small protocol investigation can prevent building M1 on a workaround when Codex already provides a better remote session path.
- The spike should answer behavior questions directly: connection shape, event shape, session behavior, streaming, reply path, and security/auth options.
- Hard spike checks should include: stable run/session id, second message targeting the same session, partial events before process exit, reconnect state recovery or replay, known timeout/cancel/disconnect state, small Next.js proxy adapter shape, and Tailscale/private-network security fit.

## Open Questions
- Should M1 require a persistent Codex process, or can it use streamed one-shot runs with stored context?
- Should M1 use `codex exec --json`, `codex app-server`, `codex exec-server`, or a PTY/tmux interactive session bridge?
- What does the experimental `app-server` protocol provide, and can a phone web UI act as a practical client or proxy?
- What does `exec-server` provide compared with `app-server`, and is either suitable for live phone-to-local Codex interaction?
- Should the first phone surface be the existing Next web app over Tailscale?
- What minimum reconnect behavior is needed: show latest stored status only, or resume a live stream after reconnect?
- What minimum security boundary is acceptable for M1?
- What is the smallest spike that can compare `app-server`, `exec-server`, and `exec --json` without drifting into implementation?
- Spike scope is accepted. Remaining design work should define the exact pass/fail criteria and then hand this to planning.
- Should `codex exec resume --json` be accepted as a first-class spike candidate?
- Is M1 allowed to use stateful resume across separate exec calls as its session model, or must it prove one continuously live Codex process?
- Is the acceptance boundary "a phone browser connects somehow," or "the existing Next.js app can proxy the Codex transport with a thin adapter"?

## Parking Lot
- Skill list UI.
- Actual skill invocation.
- Final mobile design polish.
- Public internet auth.
- Full sandbox model.
- Multi-agent orchestration.
- Final routing after idea clarification.

## Integrated Design Note
### Source
This note covers M1 from the locked milestone roadmap: Phone-to-local Codex live bridge accepted.

M1 should define the smallest bridge that can send user messages from a phone-facing surface to local Codex, stream Codex output or run context back, and accept follow-up replies.

This integrated note deliberately locks a spike-first design handoff, not the final M1 bridge choice. The bridge choice must be earned from the spike results.

### Codebase Context
The existing `experiments/agent-chat-poc` is the best local starting point. It already proves a web page can call a local Codex CLI process through a Next.js API route and show the final result. It also writes task/result artifacts and run JSON files, which matches the repo's artifact-first direction.

The current POC is not yet M1. It uses one request/response call, buffers output until Codex exits, and has no persistent session, live stream, reconnect behavior, or true follow-up reply path.

Local Codex CLI version checked during brainstorming is `codex-cli 0.124.0`. The available bridge candidates are broader than only `codex exec`:
- `codex exec --json`
- `codex exec resume --json`
- `codex app-server --listen ws://...`
- `codex exec-server --listen ws://...`
- interactive `codex` through PTY/tmux
- `codex mcp-server`

### Chosen Design Direction
Do not commit M1 to any Codex transport yet.

Before M1 bridge design is finalized, Planning should create and run a small required spike comparing:
- Spike A: `codex app-server`
- Spike B: `codex exec-server`
- Spike C: `codex exec --json`
- Spike D: `codex exec resume --json`

The spike should decide which bridge foundation best supports phone-to-local Codex live interaction. PTY/tmux is a fallback only if the supported service/headless paths are not suitable. `codex mcp-server` is parked for M1 because it looks like a tool/server surface, not the main live user conversation bridge.

### Spike Pass/Fail Criteria
Each candidate should be checked against the same questions:
- Can a phone-facing web UI or local proxy connect to it?
- Can it create or attach to a local Codex run or session?
- Can it stream useful events while Codex is working?
- Can the user send a follow-up reply after the first message?
- Does it support enough state to feel like a live conversation, or only a one-shot job?
- Can it run safely enough inside a Tailscale/private-network boundary for M1?
- Can it fit the existing Next.js POC without turning M1 into a full rebuild?
- Can the first turn expose a stable run/session id?
- Can the second turn target that same run/session?
- Do partial events arrive before the process exits?
- Can reconnect recover status and latest output, or replay stored events?
- Does timeout, cancel, or disconnect leave an observable terminal state?
- Can the existing Next.js app proxy the Codex transport with a thin adapter?

### Decision Rule After Spike
Choose `codex app-server` if it provides a usable remote/session protocol with streaming and reply behavior.

Choose `codex exec-server` if it is better suited than app-server for service-style live local runs.

Choose `codex exec resume --json` if it supports stable enough follow-up turns with JSONL events and is simpler than the websocket service paths.

Choose plain `codex exec --json` only if resume is not useful but JSONL events can still support a thin first live bridge.

Use PTY/tmux only if the four spike candidates cannot support M1's live bridge needs.

### Key Tradeoffs Accepted
The team accepts that M1 should spend time on a small spike before implementation. This avoids building on `codex exec` only because the current POC already uses it.

The team also accepts that M1 should not solve skill listing, skill execution, final routing, production auth, full sandbox security, or multi-agent orchestration.

### Planning-Relevant Open Questions
Planning should turn the spike into concrete tasks and checks. It should not guess the final bridge foundation before spike results exist.

Planning should also decide the minimum artifact produced by the spike, such as a short comparison note that records command used, connection result, event shape, session behavior, reply path, and recommendation.

Open bridge questions are not blockers for this brainstorming handoff. They are the reason the spike exists. They become blockers only if Planning tries to skip the spike and implement the final bridge directly.

### Parking Lot
Skill list UI, actual skill invocation, final mobile design polish, public internet auth, full sandbox model, multi-agent orchestration, and final routing after idea clarification are outside M1.

## Planning Handoff
`$ea-planning` should plan the required M1 bridge foundation spike first.

Planning must not assume `codex exec` is the final bridge. It should create a small plan to test `codex app-server`, `codex exec-server`, `codex exec --json`, and `codex exec resume --json` against the agreed criteria, then use the result to choose the M1 bridge foundation.

Planning should treat the next plan as a spike plan. It should not plan the full live bridge implementation until the spike comparison artifact exists.

## Read-Test Notes
Read-test rerun after senior-review refinement.

Result: accepted with known limit.

All three readers understood the same planning handoff: Planning should create a spike plan that compares `codex app-server`, `codex exec-server`, `codex exec --json`, and `codex exec resume --json`, then use the comparison result to choose the M1 bridge foundation.

Readers correctly noted that the final bridge foundation is not locked. This is intentional. The accepted brainstorming artifact locks the spike-first handoff, not the final M1 transport choice.

## Anchor Message
Brainstorming mode is active. Keep the discussion inside the chosen code milestone. Classify new ideas as Code Design Material, Learning Question, Decision, Open Question, or Parking Lot before following them. Do not implement or write an execution plan in this mode.
