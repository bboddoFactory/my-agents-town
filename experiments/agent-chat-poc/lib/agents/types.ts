export type AgentRunRequest = {
  message: string;
  cwd: string;
  timeoutMs: number;
};

export type AgentRunResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
  command: string;
  args: string[];
  cwd: string;
  timeoutMs: number;
};

