# Evaluation 01 — partial

First live run of the gold set against the engine. **Incomplete: 5 of 40 cases.** The Gemini free tier's daily request quota ran out partway through, and the remaining 35 are queued rather than lost — the runner is resumable.

Recorded so the partial numbers are not mistaken for final ones.

## Setup

| | |
|---|---|
| Date | 24 August 2026 |
| Model | `gemini-3.6-flash` |
| Search | Exa, run by the engine rather than the provider |
| Cases | 25 subjects that should produce a trace, 15 questions that should not |
| Completed | 5 |
| Command | `pnpm evaluate` |

Questions come from `examples/` directly, so the evaluation set cannot drift from the gold set. No target stories are used — only the question and whether a trace is expected.

## Rates

Five cases is not a measurement. These are recorded as a baseline to compare the full run against.

| Metric | Partial | Meaning |
|---|---|---|
| Trigger rate | 3/3 | subjects that should produce a trace, and did |
| False-positive rate | 1/2 | questions that should have stayed silent, and did not |
| Contributor support rate | 7/7 | contributors that survived source verification |
| Median duration | 41s | |

Entity types across the traces: `community` ×3, `person` ×3, `unnamed_group` ×1.

That distribution is worth noting. Collective entities outnumbered individuals, on a set that includes subjects where a famous name was readily available. The "do not create false heroes" rule is holding so far.

Contributor support at 7/7 means nothing was dropped — the model proposed only contributors it had sources for, rather than proposing many and having the verifier prune them. Encouraging, and too small a sample to trust.

## The failure

`python-indentation-error` produced a trace. It should have stayed silent.

The trace named Guido van Rossum and the ABC Language Team at CWI, sourced to python.org's design FAQ and van Rossum's own history writing. Accurate, primary-sourced, collective attribution included, restrained acknowledgement.

**The generation was good and the decision was wrong.** The user has a broken script and wants a line number; the history of significant whitespace is a digression at the moment it costs most.

This separates two things Phase 2's grading criteria currently treat together. Scored against the rubric: factual support ✅, collective attribution ✅, restraint ✅, relevance ❌, usefulness ❌.

It also confirms the negative set's design. Six of the fifteen negatives were chosen as near-neighbours — questions where a real story exists but is irrelevant to what was asked. That category is the one that fired.

Full record in `examples/negative/python-indentation-error.md`.

## What this suggests

Improving story quality will not fix this. The decision to speak is a separate function from the writing, and right now it is the weaker one. The engine currently makes both in a single call.

Splitting them — a decision stage that can be evaluated and tuned on its own, independent of story quality — is the change this points to. Worth confirming against the full 40 before acting on a sample of five.

## Resuming

```bash
cd app
pnpm evaluate -- --resume evaluations/2026-08-24T15-31-02-181Z
```

Already-recorded cases are skipped. On the first quota refusal the run stops and prints the resume command rather than spending the remaining cases on identical errors.
