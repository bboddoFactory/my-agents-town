# Roadmap

This roadmap keeps the whole direction visible without pretending the full runtime is already designed.

The rule is:

```text
[Keep the whole roadmap thin]
              |
              v
[Plan only the next POC in detail]
              |
              v
[Run the POC]
              |
              v
[Update the roadmap with what was learned]
```

Do not build a full agent city before the artifact loop is useful.

## Roadmap Map

```text
[0. Direction Locked]
          |
          v
[1. Artifact Handoff]
          |
          v
[2. Artifact Viewer]
          |
          v
[3. File Edit Review]
          |
          v
[4. Worker Session]
          |
          v
[5. Worker Roles]
          |
          v
[6. Orchestrated Flow]
          |
          v
[7. Server Operation]
```

## 0. Direction Locked

Question:

```text
Do we know what My-agents-town is trying to become?
```

Purpose:

Set the project direction before adding more POCs.

Done Check:

- The docs explain that My-agents-town is personal.
- The docs explain that the user talks with one main orchestrator.
- The docs explain artifact-first workflow.
- The docs explain that this is not a public generic agent platform first.

Non-goals:

- Do not design a full runtime.
- Do not add agent-to-agent socket protocols.
- Do not add Docker, auth, job queues, or multi-tenant design.

Likely POC:

- No new POC. This milestone is a docs and decision checkpoint.

Unlocks:

- Future POCs can be judged against a clear direction.

## 1. Artifact Handoff

Question:

```text
Can the orchestrator create and use task artifacts?
```

Purpose:

Move from prompt-only worker calls to file-based task handoff.

Done Check:

- A user message can become a task artifact.
- The task artifact records outcome, scope, non-goals, and done check.
- A worker can read the task artifact.
- The worker can write a result artifact.
- The UI or debug output shows the artifact paths.

Non-goals:

- Do not build a full artifact schema.
- Do not add multiple workers.
- Do not add persistent sessions.
- Do not add direct agent-to-agent communication.

Likely POC:

```text
user message -> task artifact -> Codex reads artifact -> result artifact
```

Unlocks:

- Planning, execute, and QA can later pass work through shared files instead of large prompts.

## 2. Artifact Viewer

Question:

```text
Can the user inspect task state from the web UI?
```

Purpose:

Make artifacts visible enough that the user can understand what happened.

Done Check:

- The UI can list recent task artifacts.
- The UI can show a task artifact.
- The UI can show a result artifact.
- The UI can show run/debug details linked to the artifact.

Non-goals:

- Do not make a polished dashboard yet.
- Do not add complex filtering.
- Do not build a full task database.

Likely POC:

```text
task artifact exists -> UI lists it -> user opens task/result/debug
```

Unlocks:

- The main orchestrator can become easier to trust because state is visible.

## 3. File Edit Review

Question:

```text
Can file edits be reviewed safely before the user accepts them?
```

Purpose:

Let a worker make a small edit and make the result inspectable.

Done Check:

- A worker can edit a controlled workspace.
- The system records changed files.
- The UI can show a diff.
- The user can accept or reject the result.

Non-goals:

- Do not solve final sandbox security.
- Do not support large multi-file refactors first.
- Do not add multi-agent review yet.

Likely POC:

```text
task artifact -> worker edits todo.md -> diff shown -> accept or reject
```

Unlocks:

- Agent work becomes reviewable instead of only visible as stdout.

## 4. Worker Session

Question:

```text
Can a worker keep useful context across more than one step?
```

Purpose:

Test whether a worker should stay alive or be resumed across multiple user messages.

Done Check:

- A worker can continue from a prior task or session.
- The user can send at least two related messages.
- The second message can use context from the first.
- The user can stop a stuck worker.

Non-goals:

- Do not require every worker to be persistent.
- Do not make a complete process supervisor yet.
- Do not add free agent-to-agent collaboration.

Likely POC:

```text
start worker session -> send message -> send follow-up -> stop session
```

Unlocks:

- Longer work can use context without rebuilding everything from files and prompts each time.

## 5. Worker Roles

Question:

```text
Can different agents share one artifact contract while keeping their strengths?
```

Purpose:

Add more worker types after one worker and artifact handoff are useful.

Done Check:

- At least two worker roles can read an input artifact.
- Each worker role can write a result artifact.
- The orchestrator can explain why a worker was chosen.
- The user can compare role outputs.

Non-goals:

- Do not build a broad agent marketplace.
- Do not make every worker support every task.
- Do not add open-ended agent debates.

Likely POC:

```text
same task artifact -> Codex result + OpenCode review result
```

Unlocks:

- The system can use different model and agent strengths without losing a common workflow.

## 6. Orchestrated Flow

Question:

```text
Can the main orchestrator coordinate more than one worker result?
```

Purpose:

Let the main orchestrator read multiple artifacts and decide the next step.

Done Check:

- The orchestrator can send work to one worker.
- The orchestrator can read that worker's result.
- The orchestrator can send a follow-up to another worker.
- The orchestrator can summarize the combined result for the user.

Non-goals:

- Do not start with free agent-to-agent sockets.
- Do not let workers change the task direction without the orchestrator.
- Do not hide intermediate artifacts from the user.

Likely POC:

```text
task artifact -> builder result -> reviewer result -> orchestrator summary
```

Unlocks:

- Multi-agent work becomes a controlled workflow instead of a loose chat between agents.

## 7. Server Operation

Question:

```text
Can the system run as a useful always-available workspace?
```

Purpose:

Move from local POCs toward a 24-hour server workflow over Tailscale.

Done Check:

- The app runs on the server.
- The browser can reach it over Tailscale.
- Worker calls run on the server.
- Logs and artifacts are written on the server.
- The user can inspect current state after a restart or reconnect.

Non-goals:

- Do not add public internet exposure first.
- Do not add production auth before it is needed.
- Do not treat server operation as a public SaaS deployment.

Likely POC:

```text
server app -> Tailscale browser -> worker call -> artifact persists
```

Unlocks:

- My-agents-town can become an always-available personal workspace instead of a laptop-only experiment.

## Cross-cutting Server Checks

Server operation is a later full milestone, but server smoke checks can happen earlier.

If a POC depends on Tailscale or server-specific behavior, test that narrow path during the POC. Do not turn every early POC into full service operations work.

## Current Priority

The next likely POC is:

```text
Artifact Handoff
```

That means moving from:

```text
user message -> worker prompt -> stdout
```

to:

```text
user message -> task artifact -> worker reads artifact -> result artifact
```
