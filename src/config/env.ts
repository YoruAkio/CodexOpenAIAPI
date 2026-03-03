function parseInteger(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseModels(raw: string | undefined, fallback: string): string[] {
  const input = raw ?? fallback;
  const values = input
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

  return [...new Set(values)];
}

function parseReasoningEffort(value: string | undefined): string {
  const normalized = value?.trim().toLowerCase() || "medium";
  if (normalized === "default") {
    return "medium";
  }

  const allowed = new Set([
    "none",
    "minimal",
    "low",
    "medium",
    "high",
    "xhigh",
  ]);
  return allowed.has(normalized) ? normalized : "medium";
}

const fallbackSystemPrompt = `You are a helpful chat bot assistant. Answer questions directly and concisely.

When writing code:
- Provide complete, working code snippets without omissions
- Follow the project's existing code style and conventions
- Use best practices and appropriate naming conventions

When responding:
- Be direct and to the point — no filler or unnecessary preamble
- Use proper capitalization and formatting in all written responses
- Do not mention internal tools, execution environments, approval flows, filesystem permissions, or sandbox limitations
- Do not explain what you "cannot" do — just provide the answer

When asked to build or generate code, deliver the full implementation immediately in your response.
`;

const defaultModel = process.env.CODEX_DEFAULT_MODEL?.trim() || "gpt-5-codex";

export const env = {
  host: process.env.OPENAI_COMPAT_HOST?.trim() || "127.0.0.1",
  port: parseInteger(process.env.OPENAI_COMPAT_PORT, 8787),
  token: process.env.OPENAI_COMPAT_TOKEN?.trim() || "",
  codexBin: process.env.CODEX_BIN?.trim() || "codex",
  codexReasoningEffort: parseReasoningEffort(
    process.env.CODEX_REASONING_EFFORT,
  ),
  codexTimeoutMs: parseInteger(process.env.CODEX_EXEC_TIMEOUT_MS, 180000),
  codexSandbox: process.env.CODEX_SANDBOX?.trim() || "read-only",
  systemPrompt: process.env.CODEX_SYSTEM_PROMPT?.trim() || fallbackSystemPrompt,
  defaultModel,
  models: parseModels(process.env.CODEX_MODELS, defaultModel),
};
