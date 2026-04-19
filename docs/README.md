# My-agents-town Docs

This folder explains the direction of My-agents-town.

Start here when you need to understand why the project exists before changing code or adding another POC.

## Reading Path

1. [Vision](vision.md)
2. [Artifact-first workflow](artifact-first-workflow.md)
3. [Agent roles](agent-roles.md)
4. [Milestones](milestones.md)
5. [Backlog](backlog/README.md)
6. [Agent chat POC](experiments/agent-chat-poc.md)

## What This Project Is

My-agents-town is a personal agent workflow environment.

The user talks with one main orchestrator. The main orchestrator helps turn fuzzy intent into clear task artifacts, then uses different agents and model services for work that fits their strengths.

## What This Project Is Not

My-agents-town is not trying to become a public generic AI agent platform first.

The first useful system should stay small:

```text
[User]
   |
   v
[Main orchestrator]
   |
   v
[Task artifact]
   |
   v
[One worker or tool]
   |
   v
[Result artifact]
   |
   v
[Main orchestrator summarizes]
```

More open collaboration between agents can come later, after the artifact flow is useful.
