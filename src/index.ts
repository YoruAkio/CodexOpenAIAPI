import { app } from "./app";
import { env } from "./config/env";

Bun.serve({
  hostname: env.host,
  port: env.port,
  fetch: app.fetch,
  error(error) {
    return new Response(JSON.stringify({ error: { message: error.message, type: "api_error" } }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  },
});

console.log(`codex-openai-api listening on http://${env.host}:${env.port}`);
