<h1 align="center">Codex OpenAI API</h1>
<p align="center">OpenAI-compatible local API gateway powered by Codex CLI and built with Hono.</p>

## Prerequisites

- `bun` (runtime and package manager)
- `codex` CLI installed and available in your `PATH`, or configured via `CODEX_BIN`

## Quick Start

1. Install dependencies.

```bash
bun install
```

2. Create your environment file.

```bash
cp .env.example .env
```

3. Start the API server.

```bash
bun run start
```

Default server address: `http://127.0.0.1:8787`

## Endpoints

- `GET /health`
- `GET /v1/models`
- `GET /v1/models/:model`
- `POST /v1/chat/completions`

## Environment Variables

- `OPENAI_COMPAT_HOST`: Server bind host (default: `127.0.0.1`).
- `OPENAI_COMPAT_PORT`: Server bind port (default: `8787`).
- `OPENAI_COMPAT_TOKEN`: Optional bearer token for `/v1/*` routes.
- `CODEX_BIN`: Codex CLI binary name or absolute path (default: `codex`).
- `CODEX_DEFAULT_MODEL`: Fallback model when the request does not include `model` (default: `gpt-5-codex`).
- `CODEX_MODELS`: Comma-separated list of models exposed by `/v1/models`.
- `CODEX_REASONING_EFFORT`: Reasoning effort for Codex (default: `medium`; options: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`).
- `CODEX_SYSTEM_PROMPT`: Default system prompt prepended to each request. You can override it per request with `system_prompt`.
- `CODEX_EXEC_TIMEOUT_MS`: Codex execution timeout in milliseconds (default: `180000`).
- `CODEX_SANDBOX`: Codex sandbox mode (default: `read-only`).

## Basic cURL Examples

```bash
curl -s http://127.0.0.1:8787/health
```

```bash
curl -s http://127.0.0.1:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-codex",
    "system_prompt": "you are a chatbot. answer directly with code, no tool or filesystem notes.",
    "messages": [
      {"role":"user","content":"write hello world in go"}
    ]
  }'
```

## Inspiration / Sources

- Repository: [dorangao/article-scripts/local-routers](https://github.com/dorangao/article-scripts/tree/main/local-routers)
- Article: [Solo Devs: Build a Local AI Router (OpenAI Compatible) that Uses OpenClaw and Codex OAuth Instead](https://medium.com/@dorangao/solo-devs-build-a-local-ai-router-openai-compatible-that-uses-openclaw-and-codex-oauth-instead-4eca81d3807e)

## Contributing

Issues and pull requests are welcome. Please keep changes focused, follow the existing project style, and include clear reproduction steps for bug fixes.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
