import { NextResponse } from "next/server";
import path from "node:path";

import { runCodex } from "../../../lib/agents/codex";
import { saveRun } from "../../../lib/runs";

export const runtime = "nodejs";

const sandboxCwd = path.join(process.cwd(), "sandbox");

const promptPrefix = `You are running inside a sandbox directory.
Only read or edit files in this directory.
Keep the response concise unless the user asks for detail.`;

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
  const finalPrompt = `${promptPrefix}\n\nUser request:\n${userMessage}`;

  const result = await runCodex({
    message: finalPrompt,
    cwd: sandboxCwd,
    timeoutMs: Number(process.env.AGENT_TIMEOUT_MS ?? 120000),
  });

  await saveRun({
    message: userMessage,
    finalPrompt,
    result,
  });

  return NextResponse.json({
    message: userMessage,
    finalPrompt,
    result,
  });
}

