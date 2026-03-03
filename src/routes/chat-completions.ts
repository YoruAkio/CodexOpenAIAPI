import { Hono } from "hono";
import { env } from "../config/env";
import { runCodex } from "../services/codex";
import { createChatCompletion, createChatCompletionStream, toSseData } from "../services/openai-response";
import { buildPrompt } from "../services/prompt";
import { validateChatBody } from "../utils/chat-validation";
import { errorResponse } from "../utils/errors";

export const chatCompletionsRoutes = new Hono();

chatCompletionsRoutes.post("/v1/chat/completions", async (c) => {
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return errorResponse(c, 400, "invalid json body", "invalid_request_error", "body", null);
  }

  const validation = validateChatBody(body);
  if (!validation.valid) {
    return errorResponse(c, 400, validation.message, "invalid_request_error", validation.param, null);
  }

  const model = validation.value.model ?? env.defaultModel;
  if (!env.models.includes(model)) {
    return errorResponse(c, 404, `The model '${model}' does not exist`, "invalid_request_error", "model", "model_not_found");
  }

  const prompt = buildPrompt(validation.value.messages, validation.value.systemPrompt ?? env.systemPrompt);

  let content: string;
  try {
    content = await runCodex(prompt, model);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(c, 500, message, "api_error", null, null);
  }

  if (!validation.value.stream) {
    return c.json(createChatCompletion(model, content));
  }

  const chunks = createChatCompletionStream(model, content);
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(toSseData(chunk)));
      }

      controller.enqueue(new TextEncoder().encode("data: [DONE]\\n\\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache",
      connection: "keep-alive",
    },
  });
});
