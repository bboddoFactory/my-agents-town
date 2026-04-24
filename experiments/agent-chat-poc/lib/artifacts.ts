import { randomUUID } from "node:crypto";
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export type TaskArtifact = {
  id: string;
  taskDir: string;
  taskPath: string;
  resultPath: string;
};

export type ResultArtifactStatus = {
  path: string;
  written: boolean;
  sizeBytes: number | null;
  content: string | null;
};

export type RunArtifacts = {
  task: TaskArtifact;
  result: ResultArtifactStatus;
  handoffComplete: boolean;
};

export async function createTaskArtifact(input: {
  message: string;
  sandboxCwd: string;
}): Promise<TaskArtifact> {
  const artifactsRoot = path.join(process.cwd(), "artifacts", "tasks");
  const createdAt = new Date().toISOString();
  const safeTimestamp = createdAt.replace(/[:.]/g, "-");
  const id = `task-${safeTimestamp}-${randomUUID().slice(0, 8)}`;
  const taskDir = path.join(artifactsRoot, id);
  const taskPath = path.join(taskDir, "task.md");
  const resultPath = path.join(taskDir, "result.md");

  await mkdir(taskDir, { recursive: true });
  await writeFile(
    taskPath,
    renderTaskMarkdown({
      createdAt,
      message: input.message,
      resultPath,
      sandboxCwd: input.sandboxCwd,
    }),
    "utf8",
  );

  return { id, taskDir, taskPath, resultPath };
}

export async function readResultArtifactStatus(
  resultPath: string,
): Promise<ResultArtifactStatus> {
  try {
    await access(resultPath);
    const [resultStat, content] = await Promise.all([
      stat(resultPath),
      readFile(resultPath, "utf8"),
    ]);

    return {
      path: resultPath,
      written: true,
      sizeBytes: resultStat.size,
      content,
    };
  } catch {
    return {
      path: resultPath,
      written: false,
      sizeBytes: null,
      content: null,
    };
  }
}

function renderTaskMarkdown(input: {
  createdAt: string;
  message: string;
  resultPath: string;
  sandboxCwd: string;
}) {
  return `# Task Artifact

## Created At

${input.createdAt}

## Original User Request

${input.message}

## Desired Outcome

Handle the user's request with the configured headless Codex CLI worker and write a clear result artifact.

## Scope

- Read this task artifact before doing the work.
- Use the sandbox workspace when the request needs file inspection or edits.
- Write the worker result to the result artifact path.

## Non-goals

- Do not create a full artifact schema.
- Do not start another worker.
- Do not create a persistent session.
- Do not edit outside the sandbox except for the result artifact.

## Done Check

- The worker read this task artifact.
- The worker completed the request or explained why it could not.
- The worker wrote a short result summary and done-check statement to the result artifact.

## Sandbox Path

${input.sandboxCwd}

## Result Artifact Path

${input.resultPath}
`;
}
