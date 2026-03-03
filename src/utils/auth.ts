import type { MiddlewareHandler } from "hono";
import { env } from "../config/env";
import { errorResponse } from "./errors";

export const requireAuth: MiddlewareHandler = async (c, next) => {
  if (!env.token) {
    await next();
    return;
  }

  const authorization = c.req.header("authorization") ?? "";
  const expected = `Bearer ${env.token}`;

  if (authorization !== expected) {
    return errorResponse(c, 401, "Unauthorized", "authentication_error", null, "invalid_api_key");
  }

  await next();
};
