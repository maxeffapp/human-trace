# Providers and Secrets

## Where the key lives

`OPENAI_API_KEY` is read server-side only, in `generateHumanTrace()`. It is never imported into `src/`, never passed to the browser, and never appears in the built bundle. The Vite plugin holds the boundary: the browser posts a question to `/api/human-trace` and receives a finished response.

| File | Committed | Contains |
|---|---|---|
| `app/.env.example` | yes | variable names only, no values |
| `app/.env` | **no** — matched by `.env*` in the root `.gitignore` | the real key |

A key that has been pasted into a chat, an issue, a screenshot or a terminal transcript is compromised and must be rotated. This is not theoretical: chat transcripts are written to disk.

## What the verifier depends on

The trace verifier is the reason a provider swap is not free. `normalizeTraceResult()` drops any contributor whose source URLs did not appear in that run's search results. `collectSearchSources()` gathers those URLs from two places in the response:

1. `output[].type === "web_search_call"` → `action.sources[]`
2. `output[].type === "message"` → `content[].annotations[]` where `annotation.type === "url_citation"`, read as `annotation.url`

If neither shape is present, the collector returns an empty map, every contributor is filtered out, and `traceStatus` becomes `none`.

**This failure is silent.** No exception, no error state — the app answers questions and simply never produces a trace. Anyone reading the UI would conclude the model is being appropriately restrained.

## OpenAI

The default. `new OpenAI({ apiKey })` with no `baseURL`. The hosted `web_search` tool and `include: ["web_search_call.action.sources"]` are OpenAI Responses API features, and the collector was written against them.

## OpenRouter

Set `OPENAI_BASE_URL=https://openrouter.ai/api/v1` and use an OpenRouter model slug in `OPENAI_MODEL`.

Two known differences, both unverified against a live key at the time of writing:

**Web search is requested differently.** OpenRouter exposes search through a `web` plugin, an `:online` model suffix, or an `openrouter:web_search` server tool — not through OpenAI's `tools: [{type: "web_search"}]`.

**Citations are shaped differently.** OpenRouter standardises search results as annotations with a nested object:

```json
{ "type": "url_citation", "url_citation": { "url": "…", "title": "…" } }
```

The collector reads `annotation.url`, not `annotation.url_citation.url`. If OpenRouter's Responses endpoint returns the nested form, source matching yields nothing and the app returns `no trace` for every question.

## Before trusting a provider

```bash
cd app
pnpm check:provider
```

One live request. It reports which output item types came back, whether `web_search_call.action.sources` or annotations were present, the exact shape of the first annotation, and how many sources the real collector managed to extract. It exits non-zero when nothing reached the verifier.

Run this before concluding that a provider works. A provider that answers well and cites nothing looks identical, from the interface, to a provider that is working correctly and being restrained.

## Sources

* [Create a response](https://openrouter.ai/docs/api/api-reference/responses/create-responses) — OpenRouter. The `/v1/responses` endpoint and its OpenAI compatibility.
* [Web search](https://openrouter.ai/docs/guides/features/web-search) — OpenRouter. The `web` plugin, the `:online` suffix, the `openrouter:web_search` server tool, and the standardised `url_citation` annotation schema.
* [Structured Outputs](https://openrouter.ai/docs/guides/features/structured-outputs) — OpenRouter. `response_format` with `json_schema`, and per-model support.
