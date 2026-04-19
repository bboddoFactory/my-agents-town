import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AgentRunResult } from "./agents/types";

type SaveRunInput = {
  message: string;
  finalPrompt: string;
  result: AgentRunResult;
};

export async function saveRun(input: SaveRunInput) {
  const runsDir = path.join(process.cwd(), "runs");
  await mkdir(runsDir, { recursive: true });

  const createdAt = new Date().toISOString();
  const safeTimestamp = createdAt.replace(/[:.]/g, "-");
  const id = `run-${safeTimestamp}`;

  await writeFile(
    path.join(runsDir, `${id}.json`),
    JSON.stringify({ id, createdAt, ...input }, null, 2),
    "utf8",
  );
}

