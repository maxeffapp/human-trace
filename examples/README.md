# Examples

Hand-written gold-standard examples. These are written by people, not generated, and they are the standard every later phase is measured against.

Two sets live here:

* **`examples/*.md`** — subjects that *should* produce a Human Trace
* **`examples/negative/*.md`** — questions that should produce *no* Human Trace

The negative set matters as much as the positive one. A layer that fires on everything stops being noticed, and a wrong Trace costs more than a missing one.

## File format

Every positive example uses [`TEMPLATE.md`](TEMPLATE.md). One subject per file, named by slug: `radioactivity.md`, `wootz-steel.md`.

The sections, in order:

| Section | Purpose |
|---|---|
| `## Question` | A realistic user question. Not a prompt engineered to invite a story. |
| `## Answer` | The plain answer, written as if Human Trace did not exist. |
| `## Trace` | 2–5 sentences. The only layer shown by default. |
| `## Story` | 250–500 words. Shown when the user opens the Trace. |
| `## Deep Story` | Context, other contributors, disputes, sources. Unbounded. |
| `## Sources` | Every factual claim above traces to something here. |
| `## Notes` | Why this subject is in the set, and what it is meant to test. |

## Writing order

Write the **Answer first**, then the Trace. An answer written to set up a story is not an answer.

Then reread with the Trace removed. If the answer is not meaningfully poorer without it, the Trace is wrong — cut it or pick a different angle.

## Rules

Quality is defined in [`docs/quality-rubric.md`](../docs/quality-rubric.md). Two hard rules while writing:

1. Any sentence that cannot be sourced gets deleted, not softened.
2. Any disputed claim is marked as disputed in the text itself, not only in the sources.

## Coverage

The set is balanced by category on purpose, so the principles get stress-tested rather than showcased. Target counts and subjects are in [`ROADMAP.md`](../ROADMAP.md) section 1.2.
