import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { OpenAIError } from "../types/openai";

export function errorResponse(
  c: Context,
  status: ContentfulStatusCode,
  message: string,
  type = "invalid_request_error",
  param: string | null = null,
  code: string | null = null
) {
  const payload: OpenAIError = {
    error: {
      message,
      type,
      param,
      code,
    },
  };

  return c.json(payload, status);
}
