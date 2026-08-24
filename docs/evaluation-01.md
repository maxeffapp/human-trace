# Evaluation 01 — partial

Two live runs of the gold set against the engine, on two models. **Neither completed: 5 of 40 and 6 of 40.** Both stopped on the same wall — the Gemini free tier will not carry a batch evaluation.

Recorded so the partial numbers are not mistaken for final ones.

## The free tier cannot run this evaluation

Measured twice, on two models, within half an hour of each other.

| Run | Model | Completed | Stopped at |
|---|---|---|---|
| 1 | `gemini-3.6-flash` | 5 / 40 | `beethovens-ninth` |
| 2 | `gemini-3.5-flash` | 6 / 40 | `eniac-programmers` |

Quota is per-model: when `3.6-flash` began refusing, `3.5-flash` answered in the same second. Each model gives roughly five or six cases before it stops. Forty cases needs about sixty-five model calls.

Gemini measures three limits independently — requests per minute, input tokens per minute, and requests per day — and any one of them returns the same `429`. Which one binds here is not visible from the error, and Google does not publish free-tier numbers; they are shown in the AI Studio dashboard. That matters, because it decides whether trimming the injected search text would buy more cases per run or none.

Exa is not the constraint. Each traced case searches four queries and receives fourteen to twenty sources, so eleven traced cases spent roughly forty-four of twenty thousand monthly requests.

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

| Metric | Run 1 (`3.6-flash`) | Run 2 (`3.5-flash`) |
|---|---|---|
| Trigger rate | 3/3 | 6/6 |
| False-positive rate | 1/2 | no negatives reached |
| Contributor support rate | 7/7 | 12/13 |
| Median duration | 41s | 24s |

Entity types — run 1: `community` ×3, `person` ×3, `unnamed_group` ×1. Run 2: `person` ×7, `community` ×3, `unnamed_group` ×1, `team` ×1.

That distribution is worth noting. Collective entities outnumbered individuals, on a set that includes subjects where a famous name was readily available. The "do not create false heroes" rule is holding so far.

Contributor support at 7/7 means nothing was dropped — the model proposed only contributors it had sources for, rather than proposing many and having the verifier prune them. Encouraging, and too small a sample to trust.

## The verifier did its job

In run 2, `apollo-guidance` is the first recorded case where verification actually removed something: the model offered three contributors and one was dropped for having no URL among the fourteen sources that run had searched.

The two that survived were Margaret Hamilton and the Raytheon female factory workers, typed `unnamed_group`.

That second one is the harder half of the subject. The gold file for this case states the requirement plainly — Hamilton alone would be accurate, safe and incomplete, and the Trace has to reach the workforce as well. It did, unprompted, from its own search.

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

## Where this leaves the evaluation

Eleven case-results across two models is not a measurement, and the two runs are not comparable to each other. What they do establish is that this evaluation cannot be completed on the free tier in one sitting, and that spreading it across models would trade the quota problem for a comparability problem.

Three ways forward, in order of what they cost:

1. **Spread across days on one model.** Free, roughly a week, and the result is a single-model run that means something.
2. **Find out which limit binds** at [ai.dev/rate-limit](https://ai.dev/rate-limit). If it is tokens per minute, cutting the injected search text — currently up to twenty results at 1,200 characters each — could buy more cases per run at some cost to grounding quality. If it is requests per day, nothing about the payload helps.
3. **Pay for one run.** A complete forty-case pass is a few dollars and removes the constraint entirely.

## Resuming

```bash
cd app
pnpm evaluate -- --resume evaluations/2026-08-24T15-31-02-181Z
```

Already-recorded cases are skipped. On the first quota refusal the run stops and prints the resume command rather than spending the remaining cases on identical errors.
