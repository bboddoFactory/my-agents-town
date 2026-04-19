# Agent Chat POC

This experiment checks the first orchestrator capability:

```text
[Web Chat UI]
        |
        v
[Next API route]
        |
        v
[Codex CLI one-shot worker]
        |
        v
[stdout / stderr / debug]
        |
        v
[Web Chat UI]
```

## Goal

Prove that the web surface can call one CLI worker and show the result.

This is not the final agent system. It is the first test that a main orchestrator surface can call a worker and collect output.

## Result

The POC worked.

Verified over Tailscale at:

```text
http://100.102.93.112:3000
```

The UI showed:

- agent stdout
- stderr/debug output
- `ok`
- `exitCode`
- `durationMs`
- `timedOut`
- `command`
- `args`
- `cwd`
- `timeoutMs`

Run JSON files were written under:

```text
experiments/agent-chat-poc/runs/
```

## Smoke Prompts

The following prompts were tested:

```text
Summarize the files in this sandbox.
```

```text
Add one todo item to todo.md saying this POC can edit files.
```

The second prompt changed:

```text
experiments/agent-chat-poc/sandbox/todo.md
```

## Fixes Found During Smoke Test

Two small runtime issues appeared.

First, the UI used `crypto.randomUUID()`. That failed over the tested Tailscale HTTP path, so the UI needs a fallback ID generator.

Second, Codex CLI waited for stdin when spawned from the API route. The runner needs to close stdin for one-shot prompt calls.

The local server also needed this command shape:

```bash
pnpm exec next dev --hostname 0.0.0.0
```

The requested command shape did not work with this Next version:

```bash
pnpm dev --host 0.0.0.0
```

## Remaining Issues

This POC does not prove real sandbox security.

The tested server needed:

```text
AGENT_CODEX_ARGS=exec --sandbox danger-full-access
```

because the default Codex sandbox hit a bubblewrap permission problem on that machine.

This is acceptable for the POC, but it should not be treated as the final security model.

## Next Experiment Direction

The next useful step is artifact handoff:

```text
[User message]
      |
      v
[Task artifact]
      |
      v
[Worker reads artifact]
      |
      v
[Worker writes result artifact]
      |
      v
[Main orchestrator summarizes]
```
