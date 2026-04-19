# Artifact-first Workflow

Artifact-first workflow means the important state of a task lives in files.

The main orchestrator still talks with the user, but it should turn important decisions into artifacts that later agents can read.

## Why Artifacts Matter

Prompt-only handoff gets weak as work grows.

It becomes hard to know:

- what the task really is
- which result is current
- what an agent already checked
- why a decision was made
- how to resume after failure

File artifacts make the task easier to inspect and continue.

## Main Flow

```text
[User has fuzzy intent]
          |
          v
[Main orchestrator brainstorms with user]
          |
          v
[Task artifact is written]
          |
          v
[Planning agents read task artifact]
          |
          v
[Plan, ACs, and TCs are written]
          |
          v
[Execute agents read plan artifacts]
          |
          v
[Code changes, logs, and test results are written]
          |
          v
[QA agents read diff and result artifacts]
          |
          v
[QA judgment is written]
          |
          v
[Main orchestrator summarizes and asks what is next]
```

## Brainstorming

Brainstorming is done by the main orchestrator with the user.

The goal is not to produce a large plan immediately. The goal is to extract a clear task from a rough request.

A useful brainstorming artifact should make these clear:

- wanted outcome
- current stage
- allowed scope
- important non-goals
- check for done
- open questions

## Later Stages

Planning, execute, and QA can use other agents.

Those agents should read the current task files and write their own results.

Example shape:

```text
.agents-state/tasks/001/
  request.md
  brainstorm.md
  plan.md
  execute-progress.json
  worker-report.json
  qa-review.md
  artifacts/
```

The exact folder name can change later. The important point is the pattern:

```text
agent reads task artifacts
agent does focused work
agent writes result artifacts
main orchestrator reads result artifacts
```

## First Coordination Model

The first coordination model should be file-based.

Direct sockets between agents are not required for the first version. They may be useful later for live streams or long-running collaboration, but the early system should prove the file artifact loop first.
