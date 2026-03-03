import type { ChatMessage } from "../types/openai";

function contentToString(content: ChatMessage["content"]): string {
  if (typeof content === "string") {
    return content;
  }

  return content.map((part) => part.text).join("\n");
}

export function buildPrompt(messages: ChatMessage[], systemPrompt?: string): string {
  const lines: string[] = [];

  if (systemPrompt && systemPrompt.trim().length > 0) {
    lines.push("[SYSTEM]");
    lines.push(systemPrompt);
    lines.push("");
  }

  for (const message of messages) {
    lines.push(`[${message.role.toUpperCase()}]`);
    lines.push(contentToString(message.content));
    lines.push("");
  }

  lines.push("[ASSISTANT]");
  return lines.join("\n");
}
