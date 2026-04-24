"use client";

import { FormEvent, useMemo, useState } from "react";

type AgentRunResult = {
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

type TaskArtifact = {
  id: string;
  taskDir: string;
  taskPath: string;
  resultPath: string;
};

type ResultArtifactStatus = {
  path: string;
  written: boolean;
  sizeBytes: number | null;
  content: string | null;
};

type RunArtifacts = {
  task: TaskArtifact;
  result: ResultArtifactStatus;
  handoffComplete: boolean;
};

type ChatResponse = {
  message: string;
  finalPrompt: string;
  result: AgentRunResult;
  artifacts: RunArtifacts;
};

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
};

const examples = [
  "Summarize the files in this sandbox.",
  "Add one todo item to todo.md saying this POC can edit files.",
];

function createMessageId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [latest, setLatest] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isRunning,
    [input, isRunning],
  );

  async function sendMessage(message: string) {
    const trimmed = message.trim();
    if (!trimmed || isRunning) return;

    setIsRunning(true);
    setError(null);
    setMessages((current) => [
      ...current,
      { id: createMessageId(), role: "user", content: trimmed },
    ]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = (await response.json()) as ChatResponse | { error: string };

      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Request failed.");
      }

      setLatest(data);
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "agent",
          content: data.result.stdout || "(no stdout)",
        },
      ]);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unknown request error.";
      setError(message);
      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: "agent", content: `Error: ${message}` },
      ]);
    } finally {
      setIsRunning(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <main className="page">
      <div className="shell">
        <section className="panel">
          <header className="panelHeader">
            <h1>Agent Chat POC</h1>
            <p>Send one short message to the configured Codex CLI runner.</p>
          </header>

          <div className="chatBody" aria-live="polite">
            {messages.length === 0 ? (
              <p className="empty">No messages yet.</p>
            ) : (
              messages.map((message) => (
                <article
                  className={`message ${
                    message.role === "user" ? "messageUser" : "messageAgent"
                  }`}
                  key={message.id}
                >
                  <span className="messageLabel">
                    {message.role === "user" ? "You" : "Agent stdout"}
                  </span>
                  {message.content}
                </article>
              ))
            )}
          </div>

          <form className="composer" onSubmit={onSubmit}>
            <div className="examples">
              {examples.map((example) => (
                <button
                  className="exampleButton"
                  disabled={isRunning}
                  key={example}
                  onClick={() => setInput(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}
            </div>
            <div className="inputRow">
              <textarea
                disabled={isRunning}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask the agent to inspect or lightly edit the sandbox."
                value={input}
              />
              <button className="sendButton" disabled={!canSend} type="submit">
                {isRunning ? "Running" : "Send"}
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <header className="panelHeader">
            <h2>Debug</h2>
            <p>Read-only execution details from the last run.</p>
          </header>

          <div className="debugBody">
            {error ? <p className="statusBad">Request error: {error}</p> : null}
            {latest ? (
              <DebugPanel response={latest} />
            ) : (
              <p className="empty">Run details will appear here.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function DebugPanel({ response }: { response: ChatResponse }) {
  const { result } = response;

  return (
    <>
      <div className="debugGrid">
        <div className="debugKey">ok</div>
        <div className={result.ok ? "statusOk" : "statusBad"}>
          {String(result.ok)}
        </div>

        <div className="debugKey">exitCode</div>
        <div className="debugValue">{String(result.exitCode)}</div>

        <div className="debugKey">timedOut</div>
        <div className="debugValue">{String(result.timedOut)}</div>

        <div className="debugKey">durationMs</div>
        <div className="debugValue">{result.durationMs}</div>

        <div className="debugKey">timeoutMs</div>
        <div className="debugValue">{result.timeoutMs}</div>

        <div className="debugKey">command</div>
        <div className="debugValue">{result.command}</div>

        <div className="debugKey">args</div>
        <div className="debugValue">{result.args.join(" ")}</div>

        <div className="debugKey">cwd</div>
        <div className="debugValue">{result.cwd}</div>
      </div>

      <h3>artifacts</h3>
      <div className="debugGrid debugGridWide">
        <div className="debugKey">taskPath</div>
        <div className="debugValue">{response.artifacts.task.taskPath}</div>

        <div className="debugKey">resultPath</div>
        <div className="debugValue">{response.artifacts.result.path}</div>

        <div className="debugKey">resultWritten</div>
        <div
          className={
            response.artifacts.result.written ? "statusOk" : "statusBad"
          }
        >
          {String(response.artifacts.result.written)}
        </div>

        <div className="debugKey">resultBytes</div>
        <div className="debugValue">
          {String(response.artifacts.result.sizeBytes)}
        </div>

        <div className="debugKey">handoffComplete</div>
        <div
          className={
            response.artifacts.handoffComplete ? "statusOk" : "statusBad"
          }
        >
          {String(response.artifacts.handoffComplete)}
        </div>
      </div>

      <h3>stderr</h3>
      <pre>{result.stderr || "(empty)"}</pre>

      <h3>stdout</h3>
      <pre>{result.stdout || "(empty)"}</pre>

      <h3>finalPrompt</h3>
      <pre>{response.finalPrompt}</pre>

      <h3>result.md</h3>
      <pre>{response.artifacts.result.content || "(missing)"}</pre>
    </>
  );
}
