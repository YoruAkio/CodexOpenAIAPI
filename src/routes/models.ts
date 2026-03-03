import { Hono } from "hono";
import { env } from "../config/env";
import { toModelData } from "../services/openai-response";
import { errorResponse } from "../utils/errors";

export const modelsRoutes = new Hono();

modelsRoutes.get("/v1/models", (c) => {
  return c.json({
    object: "list",
    data: env.models.map(toModelData),
  });
});

modelsRoutes.get("/v1/models/:model", (c) => {
  const model = c.req.param("model");

  if (!env.models.includes(model)) {
    return errorResponse(c, 404, `The model '${model}' does not exist`, "invalid_request_error", "model", "model_not_found");
  }

  return c.json(toModelData(model));
});
