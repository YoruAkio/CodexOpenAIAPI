import type { OpenAIModel } from "../types/openai";

function unixTime(): number {
  return Math.floor(Date.now() / 1000);
}

function randomId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function toModelData(modelId: string): OpenAIModel {
  return {
    id: modelId,
    object: "model",
    created: 1710000000,
    owned_by: "codex-openai-api",
  };
}

export function createChatCompletion(model: string, content: string) {
  const created = unixTime();

  return {
    id: randomId("chatcmpl"),
    object: "chat.completion" as const,
    created,
    model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant" as const,
          content,
        },
        finish_reason: "stop" as const,
      },
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  };
}

export function createChatCompletionStream(model: string, content: string) {
  const created = unixTime();
  const id = randomId("chatcmpl");

  const chunks = [
    {
      id,
      object: "chat.completion.chunk",
      created,
      model,
      choices: [
        {
          index: 0,
          delta: {
            role: "assistant",
            content,
          },
          finish_reason: null,
        },
      ],
    },
    {
      id,
      object: "chat.completion.chunk",
      created,
      model,
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: "stop",
        },
      ],
    },
  ];

  return chunks;
}

export function toSseData(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}
