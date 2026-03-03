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
    .map((item) => item.trim())
    .filter(Boolean);

  return [...new Set(values)];
}

function parseReasoningEffort(value: string | undefined): string {
  const normalized = value?.trim().toLowerCase() || "medium";
  if (normalized === "default") {
    return "medium";
  }

  const allowed = new Set(["none", "minimal", "low", "medium", "high", "xhigh"]);
  return allowed.has(normalized) ? normalized : "medium";
}

const defaultModel = process.env.CODEX_DEFAULT_MODEL?.trim() || "gpt-5-codex";

export const env = {
  host: process.env.OPENAI_COMPAT_HOST?.trim() || "127.0.0.1",
  port: parseInteger(process.env.OPENAI_COMPAT_PORT, 8787),
  token: process.env.OPENAI_COMPAT_TOKEN?.trim() || "",
  codexBin: process.env.CODEX_BIN?.trim() || "codex",
  codexReasoningEffort: parseReasoningEffort(process.env.CODEX_REASONING_EFFORT),
  codexTimeoutMs: parseInteger(process.env.CODEX_EXEC_TIMEOUT_MS, 180000),
  codexSandbox: process.env.CODEX_SANDBOX?.trim() || "read-only",
  defaultModel,
  models: parseModels(process.env.CODEX_MODELS, defaultModel),
};
