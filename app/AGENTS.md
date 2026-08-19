# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Human Trace MVP decisions

- The selected visual target is the two-state hybrid generated on 19 August 2026: a broad editorial answer surface with a persistent right rail.
- The right rail has two views over the same data: `Katkılar` is a compact accordion linked to answer passages; `İz Akışı` is a vertical lineage view.
- Selection, expanded contributor, and answer highlighting persist when switching views.
- Production content is never prewritten. The runtime calls the server-side Human Trace engine, which uses live web search and structured output. The entropy content is a local visual-QA fixture only.
- People, teams, communities, traditions, and unnamed collective work have equal entity status.
- The main answer must stand alone. Human Trace can acknowledge or thank contributors only when the generated contribution is source-supported.
- Keep the engine provider boundary separate from the React UI so future ChatGPT-like modes, extensions, search integrations, and SDKs can reuse it.
