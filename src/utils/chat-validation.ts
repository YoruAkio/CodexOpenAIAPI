import type { ChatCompletionsRequest, ChatMessage, ChatMessageContent, ChatRole, TextContentPart } from "../types/openai";

const roleSet: Set<ChatRole> = new Set(["system", "user", "assistant", "developer", "tool"]);

type ValidationSuccess = {
  valid: true;
  value: {
    model?: string;
    messages: ChatMessage[];
    stream: boolean;
  };
};

type ValidationFailure = {
  valid: false;
  message: string;
  param: string;
};

export type ValidationResult = ValidationSuccess | ValidationFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTextPart(value: unknown): value is TextContentPart {
  return (
    isRecord(value) &&
    value.type === "text" &&
    typeof value.text === "string" &&
    value.text.trim().length > 0
  );
}

function normalizeContent(content: unknown): ChatMessageContent | null {
  if (typeof content === "string") {
    const text = content.trim();
    return text.length > 0 ? text : null;
  }

  if (Array.isArray(content)) {
    const parts = content.filter(isTextPart);
    return parts.length > 0 ? parts : null;
  }

  return null;
}

function normalizeMessage(value: unknown): ChatMessage | null {
  if (!isRecord(value)) {
    return null;
  }

  const role = value.role;
  const content = normalizeContent(value.content);

  if (typeof role !== "string" || !roleSet.has(role as ChatRole) || content === null) {
    return null;
  }

  return {
    role: role as ChatRole,
    content,
  };
}

export function validateChatBody(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return {
      valid: false,
      message: "Request body must be a JSON object",
      param: "body",
    };
  }

  const reqBody = body as ChatCompletionsRequest;
  const stream = reqBody.stream === true;

  if (!Array.isArray(reqBody.messages) || reqBody.messages.length === 0) {
    return {
      valid: false,
      message: "messages is required and must be a non-empty array",
      param: "messages",
    };
  }

  const messages: ChatMessage[] = [];
  for (const item of reqBody.messages) {
    const message = normalizeMessage(item);
    if (!message) {
      return {
        valid: false,
        message: "each message must include a valid role and non-empty content",
        param: "messages",
      };
    }
    messages.push(message);
  }

  const model = typeof reqBody.model === "string" && reqBody.model.trim().length > 0 ? reqBody.model.trim() : undefined;

  return {
    valid: true,
    value: {
      model,
      messages,
      stream,
    },
  };
}
