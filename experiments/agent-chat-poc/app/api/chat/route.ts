import { NextResponse } from "next/server";
import path from "node:path";

import { runCodex } from "../../../lib/agents/codex";
import {
  createTaskArtifact,
  readResultArtifactStatus,
} from "../../../lib/artifacts";
import { saveRun } from "../../../lib/runs";

export const runtime = "nodejs";

const sandboxCwd = path.join(process.cwd(), "sandbox");

function buildWorkerPrompt(input: {
  taskPath: string;
  resultPath: string;
  sandboxCwd: string;
}) {
  return `You are a headless Codex CLI worker for an artifact handoff POC.

Read the task artifact at:
${input.taskPath}

Write the result artifact at:
${input.resultPath}

Sandbox workspace:
${input.sandboxCwd}

Rules:
- Read task.md before doing the work.
- Only inspect or edit files in the sandbox workspace, except you may read task.md and write result.md at the paths above.
- Write result.md in Markdown.
- Include a short result summary and a done-check statement in result.md.
- Keep stdout concise and say whether you wrote result.md.`;
}

type ChatRequest = {
  message?: unknown;
};

export async function POST(request: Request) {
  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (typeof body.message !== "string" || body.message.trim().length === 0) {
    return NextResponse.json(
      { error: "`message` must be a non-empty string." },
      { status: 400 },
    );
  }

  const userMessage = body.message.trim();
  const taskArtifact = await createTaskArtifact({
    message: userMessage,
    sandboxCwd,
  });
  const finalPrompt = buildWorkerPrompt({
    taskPath: taskArtifact.taskPath,
    resultPath: taskArtifact.resultPath,
    sandboxCwd,
  });

  const result = await runCodex({
    message: finalPrompt,
    cwd: sandboxCwd,
    timeoutMs: Number(process.env.AGENT_TIMEOUT_MS ?? 120000),
  });
  const resultArtifact = await readResultArtifactStatus(taskArtifact.resultPath);
  const artifacts = {
    task: taskArtifact,
    result: resultArtifact,
    handoffComplete: result.ok && resultArtifact.written,
  };

  await saveRun({
    message: userMessage,
    finalPrompt,
    result,
    artifacts,
  });

  return NextResponse.json({
    message: userMessage,
    finalPrompt,
    result,
    artifacts,
  });
}
