# Human Trace MVP

This app is the reference surface for Human Trace: a reusable engine that answers a question, researches the human contributions behind the answer, verifies contributor source URLs against the search run, and returns one structured response for any host UI.

## What is implemented

- A server-side Human Trace engine using the OpenAI Responses API, hosted web search, and Structured Outputs.
- A provider boundary that keeps the engine independent from the React interface.
- Two views over the same contribution data: `Katkılar` and `İz Akışı`.
- Answer-paragraph linking, contributor stories, visible sources, acknowledgements, `no trace` behavior, loading, empty, and configuration-error states.
- A local visual-QA fixture enabled only by `HUMAN_TRACE_PREVIEW=1`; production answers are never prewritten.

## Run locally

1. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
2. Install dependencies.
3. Run the development server.

The API key stays in the Vite development server process and is never shipped to the browser bundle. The current Sites worker remains the protected static prototype runtime, so a production deployment needs to mount `generateHumanTrace()` behind a server or edge endpoint.

## Integration contract

The UI sends `{ question }` to `POST /api/human-trace`. The response includes:

- standalone answer paragraphs;
- `available` or `none` trace status;
- source-supported contributors of several entity types;
- contributor-to-paragraph links;
- a relationship chain;
- source metadata;
- a restrained acknowledgement when appropriate.

The same response can later power a browser extension, search companion, chat mode, SDK, or native model integration.
