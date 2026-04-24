# Plan: Artifact Handoff

## Task Summary

Move the agent-chat POC from prompt-only worker calls to the first file-based
artifact handoff.

The app should turn a user message into a task artifact, call Codex CLI
headlessly as the first worker, and receive a result artifact written by that
worker.

## Desired Outcome

After this work:

- A user message creates a task artifact on disk.
- The task artifact records outcome, scope, non-goals, and done check.
- The Codex CLI worker reads the task artifact.
- The Codex CLI worker writes a result artifact.
- The API response and UI/debug output show the task and result artifact paths.
- The prior one-shot web-to-Codex POC still works.

## In Scope

- Update `experiments/agent-chat-poc` only, plus small related docs if needed.
- Add a small artifact folder under the POC, likely `artifacts/tasks/`.
- Create one task folder per chat request.
- Write a simple `task.md` before calling Codex.
- Update the Codex prompt so the worker reads `task.md` and writes `result.md`.
- Include artifact path metadata in saved run JSON and API response.
- Show artifact paths in the debug UI.
- Keep the existing `runs/*.json` debug log.
- Add focused checks for artifact creation and worker result behavior.

## Non-Goals

- Do not build a full artifact schema.
- Do not add multiple worker choices.
- Do not add persistent worker sessions.
- Do not add direct agent-to-agent communication.
- Do not build a polished artifact viewer.
- Do not add a database, job queue, Docker sandbox, auth, or server deployment
  flow.
- Do not solve final sandbox security.

## Design Direction

Keep the current Next.js POC shape:

```text
[Browser Chat UI]
        |
        v
[Next.js API route]
        |
        v
[Write task.md]
        |
        v
[Spawn Codex CLI headlessly]
        |
        v
[Codex reads task.md]
        |
        v
[Codex writes result.md]
        |
        v
[API reads result/debug and returns paths]
        |
        v
[Browser shows stdout and artifact paths]
```

Use a simple folder shape:

```text
experiments/agent-chat-poc/artifacts/tasks/
  task-<timestamp>/
    task.md
    result.md
```

Use `task.md` as the contract for the worker. It should include:

- original user request
- desired outcome
- scope
- non-goals
- done check

For the first version, the main orchestrator may derive these fields from a
small fixed template around the user message. It does not need a full
brainstorming parser yet.

The Codex CLI prompt should point to the task file and result file by path. It
should tell the worker to:

- read `task.md`
- work only inside the configured sandbox/artifact boundary used by the POC
- write `result.md`
- keep stdout concise and mention whether it wrote the result file

The API route should not fake `result.md` on success. If the worker exits
successfully but no result artifact exists, that should be visible as a failed or
incomplete handoff in the returned debug data.

## Test Strategy

mixed

Use code-level checks for task artifact creation and result path handling, plus
a runtime smoke check for the full handoff.

The cheapest useful loop is:

- `pnpm typecheck`
- focused unit or script-level checks for artifact helpers if helpers are added
- one local API or UI smoke run using a short prompt that should create
  `task.md` and `result.md`

Mock the actual Codex process in automated tests if a test is added. Do not make
normal automated tests depend on a real Codex CLI call.

## Task

Implement the first artifact handoff in the agent-chat POC.

### AC1: A user message creates a task artifact

The API route writes a task artifact before the worker is called.

#### TC1

Run the artifact creation path with a sample message and confirm a new task
folder is created under `experiments/agent-chat-poc/artifacts/tasks/`.

#### TC2

Open the generated `task.md` and confirm it includes:

- original user request
- desired outcome
- scope
- non-goals
- done check

#### TC3

Confirm the task artifact path is included in the saved run JSON and API
response.

### AC2: Headless Codex CLI reads the task artifact

The worker prompt uses the task artifact as input instead of embedding only the
raw user request.

#### TC1

Inspect the generated final prompt or saved run JSON and confirm it includes the
`task.md` path.

#### TC2

Confirm the Codex runner still uses the configured headless command shape:
`AGENT_CODEX_COMMAND` plus `AGENT_CODEX_ARGS`, defaulting to `codex exec`.

#### TC3

Run a smoke request and confirm the debug output shows the worker command, args,
cwd, timeout, stdout, stderr, and artifact paths.

### AC3: The worker writes a result artifact

The Codex worker is instructed to write `result.md`, and the app reports whether
that file exists after the run.

#### TC1

Run a smoke request and confirm `result.md` exists in the same task folder as
`task.md`.

#### TC2

Open `result.md` and confirm it contains a short result summary and a done-check
statement.

#### TC3

Confirm the API response and saved run JSON include the result artifact path and
a boolean or clear status that says whether the result artifact was written.

#### TC4

Confirm a successful Codex exit with a missing `result.md` is reported as an
incomplete handoff, not silently treated as fully done.

### AC4: The UI/debug output shows artifact paths

The user can see where the task and result artifacts were written without using
the filesystem first.

#### TC1

Run the app locally and send one short request.

#### TC2

Confirm the debug panel shows the task artifact path.

#### TC3

Confirm the debug panel shows the result artifact path and result artifact
status.

#### TC4

Confirm this remains a simple debug display, not a full artifact viewer.

### AC5: Existing POC behavior still works

The current web-to-Codex POC remains usable after adding artifacts.

#### TC1

Run `pnpm typecheck` in `experiments/agent-chat-poc`.

#### TC2

Run a local smoke request through the API route or browser UI and confirm the UI
still shows the agent stdout or clear error output.

#### TC3

Confirm run JSON files are still written under `experiments/agent-chat-poc/runs/`.

#### TC4

Confirm existing sandbox behavior is not broadened beyond the current POC model.

## Execution Order

1. Add artifact helper code for task folder creation, `task.md` writing, and
   result path/status reading.
2. Update the API route to create the task artifact before calling Codex.
3. Update the worker prompt to point Codex at `task.md` and require `result.md`.
4. Extend run saving and API response types with artifact metadata.
5. Update the debug UI to show task/result paths and result status.
6. Add focused automated checks if the helper boundaries make that practical.
7. Run typecheck and a local handoff smoke check.
8. Update the POC README or experiment note only if needed to describe the new
   artifact flow.

## Open Risks

- A real Codex CLI smoke run may depend on local CLI auth and sandbox behavior.
- If Codex exits successfully but ignores the instruction to write `result.md`,
  the app must show that as incomplete.
- The current sandbox model is not a security boundary.
- Artifact path display can overlap with the later Artifact Viewer milestone if
  it grows beyond simple debug output.
- The worktree already has unrelated or prior uncommitted POC changes; execution
  should not revert them.
- Planning reviewers were not run in this session because no sub-agent
  delegation was requested.

## Execute Handoff

- task_id: `artifact-handoff`
- plan_path: `.everything-automate/plans/2026-04-20-artifact-handoff.md`
- approval_state: `approved`
- execution_unit: `AC`
- test_strategy: `mixed`
- open_risks:
  - real Codex CLI smoke depends on local auth and sandbox behavior
  - missing `result.md` after a successful exit must be visible as incomplete
  - keep artifact path display as debug output, not a full viewer
  - do not revert unrelated or prior uncommitted POC changes
