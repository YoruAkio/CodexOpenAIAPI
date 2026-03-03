import { Hono } from "hono";
import { chatCompletionsRoutes } from "./routes/chat-completions";
import { healthRoutes } from "./routes/health";
import { modelsRoutes } from "./routes/models";
import { requireAuth } from "./utils/auth";
import { errorResponse } from "./utils/errors";
import { requestLogger } from "./utils/request-logging";

export const app = new Hono();

app.use("/health", requestLogger);
app.use("/v1/*", requestLogger);

app.route("/", healthRoutes);
app.use("/v1/*", requireAuth);
app.route("/", modelsRoutes);
app.route("/", chatCompletionsRoutes);

app.get("/", (c) => {
  return c.json({
    name: "codex-openai-api",
    endpoints: ["GET /health", "GET /v1/models", "GET /v1/models/:model", "POST /v1/chat/completions"],
  });
});

app.notFound((c) => errorResponse(c, 404, "not found", "invalid_request_error", null, null));

app.onError((error, c) => {
  return errorResponse(c, 500, error.message, "api_error", null, null);
});
