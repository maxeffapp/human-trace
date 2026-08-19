# Evaluation Harness

Phase 2. Runs the Human Trace system prompt over the gold example set and reports two numbers: **trigger rate** on the 25 subjects that should produce a Trace, and **false-positive rate** on the 15 questions that should not.

## Setup

Requires Node 20+ and an Anthropic API key.

```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...
```

## Run

```bash
npm run eval                      # all 40 cases at effort high
npm run eval -- --effort medium   # low | medium | high | xhigh | max
npm run eval -- --only compass    # filter cases by slug substring
npm run eval -- --model <id>      # override the model under test
npm run eval -- --prompt <path>   # run a prompt variant without committing it
```

Each run writes to `runs/<timestamp>-<effort>/`: one JSON file per case, a `summary.json`, a blank `worksheet.md`, and copies of the exact `prompt.md` and `rubric.md` it was produced from. A result stays interpretable after the prompt has moved on, which is what makes prompt iteration measurable rather than anecdotal — git holds the history, and each run holds the version it used.

## Tests

```bash
npm test
```

Covers the markdown parsing on both sides — the example-file reader and the worksheet reader — and asserts the gold set still loads as 25 positive and 15 negative cases with no empty questions and no duplicate slugs. A malformed example file fails the test rather than silently dropping a case.

The section reader has a regression test for a specific bug: an earlier regex version terminated on the blank line after a heading and returned an empty string, which the loader read as "heading missing." Typechecking did not catch it.

## How it works

Two stages, deliberately separated.

**Generate.** The system prompt is loaded from [`prompts/human-trace-system-prompt.md`](../prompts/human-trace-system-prompt.md) — never pasted into code, so the file stays the single artifact under test. Each case's question comes from the `## Question` section of its example file, so the harness and the gold set cannot drift apart.

**Judge.** A second call decides whether a Trace is present and scores it against [`docs/quality-rubric.md`](../docs/quality-rubric.md), which is loaded verbatim into the judge's own prompt. It uses structured outputs, so the verdict is a validated object rather than prose to be parsed. **The judge is not told what the gold set expects** — otherwise its trace-present call would just echo the answer key.

Detecting a Trace needs judgment: the system prompt produces natural prose with no machine-readable marker, and adding one would change the artifact being tested.

## Scoring it yourself

The judge is an instrument, and an uncalibrated instrument measures nothing. Score the same run by hand and compare:

```bash
# fill in the trace/rating fields in runs/<dir>/worksheet.md, then:
npm run compare -- runs/<dir>
```

The worksheet omits the judge's verdicts on purpose. It reports your two rates, your agreement with the judge on trace-present and on rating, and every case where you disagree. Where you disagree, you are the standard.

## Cost

Two calls per case. The system prompt and the rubric are the only large constants, so both carry a cache breakpoint, and the harness runs the first case alone before fanning out — a cache entry is readable only once the first response has started, so firing all 40 at once would have every one of them pay full price.

A full 40-case sweep at `high` is roughly two dollars at Claude Opus 5 rates, most of it output tokens. The summary prints actual token counts; use those rather than this estimate. For repeated sweeps, the Batch API halves it.
