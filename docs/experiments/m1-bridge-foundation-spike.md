# M1 Bridge Foundation Spike

Date: 2026-04-24
Scope: compare `codex app-server`, `codex exec-server`, `codex exec --json`, and `codex exec resume --json` as the foundation for the phone-to-local Codex live bridge.

This is a spike note, not the full bridge design.

## Shared Criteria

The four candidates were checked against the same M1 questions:

- stable run/session id
- second message targeting the same run/session
- partial events before process exit
- reconnect state recovery or replay
- observable timeout/cancel/disconnect state
- thin Next.js proxy fit
- Tailscale/private-network security fit

## Commands Tried

### `codex app-server`

- `codex app-server --help`
- `codex app-server --listen ws://127.0.0.1:0`

### `codex exec-server`

- `codex exec-server --help`
- `codex exec-server --listen ws://127.0.0.1:0`

### `codex exec --json`

- `codex exec --json --full-auto --skip-git-repo-check --ignore-rules -C <temp-cwd> "Write three short bullet points about loopback-only security and stop."`
- The run was watched while still active so the log could be sampled before exit.

### `codex exec resume --json`

- First try, which failed:
  - `codex exec resume --json --full-auto --skip-git-repo-check --ignore-rules -C <temp-cwd> <thread-id> "Add one more bullet about authenticated loopback access and stop."`
- Retry, which worked:
  - `codex exec resume --json --full-auto --all --skip-git-repo-check --ignore-rules <thread-id> "Add one more bullet about authenticated loopback access and stop."`

## Observations

### 1) `codex app-server`

Help output shows:

- transport options: `--listen stdio://`, `--listen ws://IP:PORT`, or `off`
- websocket auth options: `--ws-auth capability-token|signed-bearer-token`
- token / secret / issuer / audience flags for non-loopback listeners
- protocol helper commands: `generate-ts` and `generate-json-schema`

Loopback probe result:

```text
2026-04-24T13:17:21.849549Z ERROR codex_app_server: Codex's Linux sandbox uses bubblewrap and needs access to create user namespaces.
codex app-server (WebSockets)
  listening on: ws://127.0.0.1:<port>
  readyz: http://127.0.0.1:<port>/readyz
  healthz: http://127.0.0.1:<port>/healthz
  note: binds localhost only (use SSH port-forwarding for remote access)
```

The listener was also visible in `ss` on `127.0.0.1:<port>`.

Interpretation:

- This is the strongest remote/session-shaped surface in the set.
- The loopback note makes the private-network boundary clear.
- The auth flags mean the protocol can be tightened when it is not loopback-only.
- The helper commands suggest a real protocol surface, which is good for a thin Next.js adapter.

### 2) `codex exec-server`

Help output shows:

- one listen option: `--listen ws://IP:PORT`
- default listen value: `ws://127.0.0.1:0`

Loopback probe result:

```text
ws://127.0.0.1:<port>
```

The listener was also visible in `ss` on `127.0.0.1:<port>`.

Interpretation:

- This is simpler than `app-server`.
- It did start cleanly on loopback.
- It gives a usable WebSocket service shape, but the help text exposes less protocol and security detail than `app-server`.
- It looks service-style, but not as complete as the app server for M1.

### 3) `codex exec --json`

Probe result:

- The run streamed JSONL while still active.
- A stable thread id was present in the first event.
- The process later completed normally.

Live sample while the process was still running:

```json
{"type":"thread.started","thread_id":"<thread-id>"}
{"type":"turn.started"}
```

Final sample:

```json
{"type":"item.completed","item":{"id":"item_0","type":"agent_message","text":"- Bind local tools to `127.0.0.1` or `::1` so they accept traffic only from the same machine.\n- Do not treat loopback as full security; any local process or compromised user session may still reach it.\n- Add authentication or random tokens for sensitive local endpoints, even when they are loopback-only."}}
{"type":"turn.completed","usage":{"input_tokens":17881,"cached_input_tokens":5504,"output_tokens":74}}
```

Interpretation:

- This clearly supports partial events before exit.
- It exposes a usable `thread_id` for later turn linkage.
- It does not by itself give a live service shape; the next turn still needs a resume path or a state layer outside the CLI process.
- For M1, it is good for a thin first bridge, but not the best bridge foundation if a service surface is available.

### 4) `codex exec resume --json`

First attempt failed because `resume` does not accept `-C`:

```text
error: unexpected argument '-C' found
```

Retry without `-C` worked and reused the same thread id:

```json
{"type":"thread.started","thread_id":"<thread-id>"}
{"type":"turn.started"}
{"type":"item.completed","item":{"id":"item_0","type":"agent_message","text":"- Use per-session credentials or random bearer tokens for loopback endpoints so local access still proves intent."}}
{"type":"turn.completed","usage":{"input_tokens":36040,"cached_input_tokens":11008,"output_tokens":98}}
```

Interpretation:

- This is the clearest follow-up-turn story in the headless CLI set.
- It supports the same session id across turns.
- It streams JSONL on the resumed turn.
- It still behaves like a separate CLI turn, not a live transport server.

## Comparison

| Candidate | Result | Why |
| --- | --- | --- |
| `codex app-server` | Best fit | Live WebSocket listener, clear loopback note, auth knobs, and protocol helper surface |
| `codex exec-server` | Secondary fit | Live WebSocket listener, but less protocol/security detail |
| `codex exec resume --json` | Backup fit | Good follow-up-turn behavior with the same thread id, but still CLI-driven |
| `codex exec --json` | Thin fallback | Good JSONL streaming, but weaker for follow-up turns without resume |

## Pass/Fail Notes Against the Shared Criteria

- Stable run/session id: `exec --json` and `exec resume --json` pass; `app-server` and `exec-server` were not session-run probes, so this remains protocol-level rather than turn-level evidence.
- Second message targeting the same run/session: `exec resume --json` passes; `exec --json` only passes when paired with resume; the server probes were not exercised far enough to prove reply handling.
- Partial events before process exit: `exec --json` and `exec resume --json` pass.
- Reconnect state recovery or replay: `exec resume --json` is the only one here that directly showed a practical recovery path.
- Observable timeout/cancel/disconnect state: not fully exercised in this spike; keep this for the next design or implementation pass.
- Thin Next.js proxy fit: `app-server` is the cleanest fit, `exec-server` is also plausible, `exec`/`resume` require a wrapper around a one-shot CLI turn.
- Tailscale/private-network security fit: `app-server` is the strongest because it explicitly binds localhost only and exposes auth options for non-loopback listeners; `exec-server` is acceptable but less explicit; `exec` and `resume` need more app-side control around access and turn ownership.

## Recommendation

Use `codex app-server` as the M1 bridge foundation.

Reason:

- It matches the decision rule in DEC-003.
- It is the only probe that clearly looks like a remote/session protocol, not just a CLI job.
- It already shows a localhost-only posture that fits the first private-network boundary.
- It exposes auth controls, which gives the Next.js adapter a real path for later hardening.
- It should fit a thin Next.js proxy better than building M1 around ad hoc JSONL resume state.

Keep PTY/tmux fallback-only.

## Next Planning / Design Handoff

The next design step should read this spike note and then plan the M1 bridge around:

- a thin Next.js WebSocket proxy to `codex app-server`
- localhost or Tailscale-only access for the first phone path
- explicit run/session id handling in the app layer
- stored event history for reconnect and debug
- cancel / disconnect state that the UI can show

The next design step must not assume:

- a public internet deployment
- a full bridge implementation already exists
- skill-list UI
- PTY/tmux as the primary transport
- that `codex exec --json` is enough on its own without a replay or resume story

## Limits and Uncertainties

- `codex app-server` printed a bubblewrap sandbox warning before the listener came up. The server still started, but this should be remembered if the target environment changes.
- `codex exec resume --json` does not accept `-C`. The resume probe had to run without that flag, using `--all` to avoid cwd filtering.
- The exec probes showed streaming and session ids, but timeout / cancel / disconnect state was not exercised here.
- The server probes were start-up probes, not full protocol conversations. They show the transport shape, not the full reply flow.
