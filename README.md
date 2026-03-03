<h1 align="center">Codex OpenAI API</h1>
<p align="center">OpenAI-compatible local API gateway powered by Codex CLI and built with Hono.</p>

## Requirements

- `bun` (runtime + package manager)
- `codex` CLI installed and available in PATH, or set `CODEX_BIN` to the binary path

## Quick Start

1. install dependencies

```bash
bun install
```

2. create your env file

```bash
cp .env.example .env
```

3. run the API

```bash
bun run start
```

default server: `http://127.0.0.1:8787`

## Endpoints

- `GET /health`
- `GET /v1/models`
- `GET /v1/models/:model`
- `POST /v1/chat/completions`

## Environment Variables

- `OPENAI_COMPAT_HOST`: bind host (default: `127.0.0.1`)
- `OPENAI_COMPAT_PORT`: bind port (default: `8787`)
- `OPENAI_COMPAT_TOKEN`: optional bearer token for `/v1/*` routes
- `CODEX_BIN`: codex cli binary name/path (default: `codex`)
- `CODEX_DEFAULT_MODEL`: fallback model when request has no `model` (default: `gpt-5-codex`)
- `CODEX_MODELS`: models exposed by `/v1/models` (comma-separated)
- `CODEX_REASONING_EFFORT`: codex reasoning effort (default: `medium`; options: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`)
- `CODEX_EXEC_TIMEOUT_MS`: codex execution timeout in milliseconds (default: `180000`)
- `CODEX_SANDBOX`: codex sandbox mode (default: `read-only`)

## Basic cURL

```bash
curl -s http://127.0.0.1:8787/health
```

```bash
curl -s http://127.0.0.1:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-codex",
    "messages": [
      {"role":"user","content":"write hello world in go"}
    ]
  }'
```

## Inspiration / Sources

- repo: [dorangao/article-scripts/local-routers](https://github.com/dorangao/article-scripts/tree/main/local-routers)
- article: [Solo Devs: Build a Local AI Router (OpenAI Compatible) that Uses OpenClaw and Codex OAuth Instead](https://medium.com/@dorangao/solo-devs-build-a-local-ai-router-openai-compatible-that-uses-openclaw-and-codex-oauth-instead-4eca81d3807e)

## Contributing

Issues and pull requests are welcome. Please keep changes focused, follow the existing project style, and include clear reproduction steps for bug fixes.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
