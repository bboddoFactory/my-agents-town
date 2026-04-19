import { spawn } from "node:child_process";

import type { AgentRunRequest, AgentRunResult } from "./types";

export async function runCodex(
  request: AgentRunRequest,
): Promise<AgentRunResult> {
  const command = process.env.AGENT_CODEX_COMMAND ?? "codex";
  const argsPrefix = parseArgs(process.env.AGENT_CODEX_ARGS ?? "exec");
  const args = [...argsPrefix, request.message];
  const startedAt = Date.now();

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let settled = false;
    let timedOut = false;

    const child = spawn(command, args, {
      cwd: request.cwd,
      env: process.env,
      shell: false,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");

      setTimeout(() => {
        if (!settled) child.kill("SIGKILL");
      }, 2000).unref();
    }, request.timeoutMs);

    child.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });

    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        ok: false,
        stdout,
        stderr: `${stderr}${stderr ? "\n" : ""}${error.message}`,
        exitCode: null,
        timedOut,
        durationMs: Date.now() - startedAt,
        command,
        args,
        cwd: request.cwd,
        timeoutMs: request.timeoutMs,
      });
    });

    child.on("close", (exitCode) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        ok: exitCode === 0 && !timedOut,
        stdout,
        stderr,
        exitCode,
        timedOut,
        durationMs: Date.now() - startedAt,
        command,
        args,
        cwd: request.cwd,
        timeoutMs: request.timeoutMs,
      });
    });
  });
}

function parseArgs(value: string): string[] {
  const args: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;

  for (const char of value.trim()) {
    if ((char === '"' || char === "'") && quote === null) {
      quote = char;
      continue;
    }

    if (char === quote) {
      quote = null;
      continue;
    }

    if (/\s/.test(char) && quote === null) {
      if (current) {
        args.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current) args.push(current);
  return args;
}

