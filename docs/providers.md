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

**Measured on 21 August 2026 against `openai/gpt-5.5` via `https://openrouter.ai/api/v1`. Not usable for this project as the engine stands.**

What works:

| | |
|---|---|
| Authentication | accepted |
| `POST /v1/responses` | exists |
| `reasoning: { effort }` | accepted |
| `tools: [{ type: "web_search" }]` | accepted — a `web_search_call` item comes back, so the search really runs |
| `text.format` with `json_schema` | accepted |

What does not:

| | |
|---|---|
| `include: ["web_search_call.action.sources"]` | rejected, `400 invalid_prompt` |
| `web_search_call.action` contents | only `type` and `query`; no `sources` |
| `url_citation` annotations | zero returned, with the plain tool and with the `:online` model suffix |
| `collectSearchSources()` | **0 sources** |

The search executes and the answer is produced, but no source URL reaches the verifier. Every contributor would be filtered out and `traceStatus` would be `none` for every question — with no error anywhere. This is the exact silent failure described above, observed rather than predicted.

OpenRouter's documented citation path is its `web` plugin on the **Chat Completions** endpoint, which returns nested `url_citation` annotations. Reaching it would mean moving the engine off `responses.parse()` and off the structured-output helper. That is a large change to avoid, given the engine already targets a provider that returns what the verifier needs.

**Recommendation: use OpenAI directly.** Leave `OPENAI_BASE_URL` unset.

Note also that credits are consumed per request, and the hosted search is billed on top of tokens. An account with a near-zero balance fails with `402` and a message naming the affordable token count, which is easy to mistake for a request-shape problem.

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
