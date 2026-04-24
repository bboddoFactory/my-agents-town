---
mode: north-star
status: locked
stage: locked
version: 10
updated_at: 2026-04-24T18:58:00+09:00
owner: user
read_test_required: true
read_test_agents: 3
read_test_temperature: 0.7-0.8
read_test_style: independent-interpretation
read_test_default_model: gpt-5.4-mini
read_test_default_reasoning: medium
---

# North Star State

## Raw Intent
The user wants to sharpen the real near-term target before moving into later product design, planning, or implementation.

The working source is `docs/problem-and-direction.md`, which describes an idea-to-action gap in an AI-heavy personal workflow.

The user clarified that the main pain is not just that ideas pile up. The main pain is that after capture, the user must manually decide where each idea goes and manually gather it into the right next place. That follow-up step does not reliably happen, even for a diligent person.

The user further clarified that the agent should not merely guess or classify the task type. The first valuable step is for a local agent to concretize the raw idea through a structured clarification workflow.

The user then clarified a closer V0 target: the most immediate pain is that Codex work currently requires sitting at the computer, turning on the monitor, and chatting from the desktop. The user wants to talk and work with Codex from a phone, anywhere.

The user corrected the target order: V1 should be the North Star target, and the phone-to-local-Codex bridge should be treated as an early milestone inside that target, not as the whole North Star.

The user clarified the first V1 final goal: from the phone, the user can see the skills registered in local Codex, choose a skill, send an idea or request into it, have that skill run locally, see the running context streamed back in real time, and continue a back-and-forth conversation like the current terminal Codex session.

## North Star Draft
The user needs a mobile-accessible Codex work console that shows locally registered Codex skills, lets the user choose one from the phone, sends an idea or work request into that skill, runs it in the local Codex environment, streams the live context back, and supports ongoing back-and-forth conversation.

## User Mental Picture
The user wants a phone-accessible entry point for Codex-centered work, not only desktop chat.

The current desktop-only interaction creates a hard break: ideas and work needs often happen away from the computer, but Codex is only practically available when the user is sitting at the machine.

The V1 product direction is the idea and work intake system: one mobile-friendly window where raw ideas can be sent into the local Codex working environment and use the same kind of skill or command surface that exists in Codex.

The phone-to-local-Codex bridge is an early milestone because V1 cannot work unless the phone can reach the local working environment.

In the V1 mental picture, the phone is not only an inbox. It is an interactive remote surface for local Codex skill work. The user sees what is happening, replies while it runs, and continues the same kind of conversation they currently have in the terminal.

## Success Picture
Success means the user can use a phone as the front door for Codex-centered work: view local Codex skills, select one, send a raw idea or work request, run the skill locally, watch the context stream back in real time, and keep talking with Codex from the phone.

The user no longer has to be physically at the desktop just to capture, clarify, or start moving work forward with Codex.

The system may use `ea-north-star` as one possible clarification path, but V1 should not be defined as only "run this one skill and produce this one artifact."

## Failure Picture
A plausible but wrong result would be a phone bridge that can chat with Codex but has no path toward the skill-enabled idea/work intake workflow.

Another wrong result would be a phone UI that only stores messages but does not actually connect to the local Codex working environment.

Another wrong result would be designing the full idea operating system before proving the phone-to-local-Codex bridge.

Another wrong result would be one-way job submission where the user cannot see live context or reply while the local skill run is happening.

## Scope
- Define the V1 target clearly.
- Include phone access to the local Codex working environment as an enabling part of the target.
- Preserve that the agent and useful resources are local, not primarily cloud-hosted.
- Connect the mobile entry point to Codex's skill-enabled workflow.
- Show locally registered Codex skills on the phone.
- Let the user choose a skill and send an idea or request into it.
- Run the selected skill locally.
- Stream live context and responses back to the phone.
- Support ongoing two-way conversation during or after the run.
- Support raw idea or work request intake before the task type is known.
- Keep the first bridge milestone separate from the full V1 result.

## Non-Goals
- Do not design the full idea work console yet.
- Do not split milestones yet.
- Do not plan implementation yet.
- Do not choose a final tech stack yet.
- Do not reduce the North Star to only phone chat.
- Do not require V1 to solve final routing or execution.
- Do not treat a disconnected mobile note inbox as enough.
- Do not define V1 as only an `ea-north-star` runner.
- Do not make V1 a one-way fire-and-forget job launcher.

## Decision Filter
- Does this help the phone become the front door for Codex-centered work?
- Does this connect to the local Codex working environment, not just a separate mobile inbox?
- Does this allow raw ideas or work requests before the task type is known?
- Does this connect or prepare to connect with Codex skills and commands?
- Does this let the user see and select local Codex skills from the phone?
- Does this stream the local run context back to the phone in real time?
- Does this support back-and-forth conversation like a terminal Codex session?
- Does this keep the phone bridge as a milestone, not the whole goal?
- Does this avoid deciding final routing and execution too early?

## Spec Seeds
- A mobile-friendly capture and review surface.
- One lightweight independent session or task container per raw idea.
- An agent clarification loop inside each idea container.
- Routing destinations such as backlog item, repo task, experiment, writing draft, documentation, or parked insight.
- A future Codex-centered multi-agent work console that may sit behind the idea clarification layer.
- Inputs may come from community operation, Everything Automate harness work, product ideas, research questions, analysis prompts, and project thoughts.
- A local server could call local resources instead of relying on a cloud-hosted service.
- The service may start a local Codex agent, call a headless Codex flow, or use an existing skill such as `ea-north-star` to clarify the idea.
- V1 may expose or connect to Codex's registered skill surface from the phone-accessible service.
- V1 may use `ea-north-star` as one possible clarification workflow, but the exact connection shape is undecided.
- The connection could mean the mobile-side service sends commands into Codex, or Codex receives and runs skill requests from that service.
- V0 phone-to-local-Codex communication is likely the first milestone under the V1 target.
- V1 should include a skill list surface from local Codex.
- V1 should include live streaming of the local Codex run context to the phone.

## Parking Lot
- Exact UI design.
- Exact database or storage model.
- Full multi-agent orchestration design.
- Integration details for Obsidian, Codex, OpenClaw, or GitHub.
- Whether the name should be Idea Work Console, Idea OS, or Mobile-first Agent Work Console.
- Full routing after clarification.

## Open Ambiguities
- What exact phone surface should count for V0: web page, chat app bridge, local tunnel, or something else?
- Does V0 need full interactive Codex chat, or is sending a prompt and receiving updates enough?
- Does V0 need to attach to an existing Codex session, or can it start a new local Codex run?
- What security boundary is acceptable for phone-to-local-machine access?
- For V1, the open point is how the phone-facing service connects to Codex skills or commands: whether it forwards commands, asks Codex to run them, or exposes a higher-level action.
- What security boundary is acceptable for exposing local Codex skills to the phone?
- How should the phone attach to a local Codex session: one session per skill run, resumable sessions, or both?
- What exact run events need to stream to the phone for the user to feel "I am talking with Codex live"?

## Read-Test Notes
Read-test completed with three independent readers.

Result: pass.

All three readers identified the same core target: a phone-accessible front door into local Codex work where the user can see local Codex skills, select one, send a raw idea or request, run it locally, stream live context back, and continue a two-way conversation.

All three readers agreed that a disconnected mobile inbox, one-way job launcher, full idea console design, final routing, and an `ea-north-star`-only runner are out of scope.

Two readers marked ready to lock. One reader marked not ready to lock because implementation boundaries remain open: phone surface, session model, security boundary, and exact skill connection. This is judged as not blocking the North Star because those are design or milestone questions, not target ambiguity.

## Next Stage Hint
After the North Star is locked, the next likely stage is milestone splitting. The first milestone will likely be phone-to-local-Codex communication, followed by connecting that bridge to skill-enabled idea/work intake.

## Anchor Message
North Star mode is active. Keep the discussion focused on turning the user's fuzzy intent into one concrete shared target. Classify new ideas as Goal Material, Spec Seed, or Parking Lot before following them.
