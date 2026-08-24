# Evaluation 01 — partial

Live runs of the gold set against the engine. The first two stopped early on a rate limit that was initially misdiagnosed; see below. Partial numbers are recorded so they are not mistaken for final ones.

## What actually stopped the runs

Both runs stopped on a `429`, and the first reading of that was wrong. It was recorded here as "the free tier cannot run this evaluation." It can — not at speed.

| Run | Model | Completed | Stopped at |
|---|---|---|---|
| 1 | `gemini-3.6-flash` | 5 / 40 | `beethovens-ninth` |
| 2 | `gemini-3.5-flash` | 6 / 40 | `eniac-programmers` |

Gemini measures three limits independently — requests per minute, input tokens per minute, and requests per day — and any one of them returns the same `429` with no indication of which. Daily quotas reset at midnight Pacific.

Twenty minutes after both models had been refusing, both answered again. The clock read 09:22 Pacific, so the daily quota had not reset — whatever bound the run recovers on its own.

A second correction followed. Reading that as a per-minute limit, the engine was given backoffs of twenty, forty-five and ninety seconds. It carried two more cases and then failed through all three. So the recovery window is longer than two and a half minutes and shorter than twenty, and the error does not say which of the three published limits is responsible.

The waits were then sized to the observed recovery rather than to a theory: one minute, five, then fifteen. That carried exactly one more case — `henrietta-lacks`, which took 1,283 seconds, meaning it spent the entire twenty-one minute ladder before succeeding. The next case failed through all three again.

Three explanations have now been offered here and three have needed revision. The mechanism is not worth another guess. The operational fact is the one that matters:

**Sustained throughput on this account is roughly one case per twenty minutes.** Thirty-one remaining cases is about eleven hours of wall clock. That number, not a theory about which limit binds, is what should drive the decision about how to finish.

Quota is per-model: while `3.6-flash` was refusing, `3.5-flash` answered in the same second. That is a way to go faster at the cost of comparing results across models.

Exa was never the constraint. Each traced case searches four queries and receives fourteen to twenty sources, so eleven traced cases spent roughly forty-four of twenty thousand monthly requests.

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
| Completed | 5 / 40 | 9 / 40 |
| Trigger rate | 3/3 | 9/9 |
| False-positive rate | 1/2 | no negatives reached yet |
| Contributor support rate | 7/7 | 21/22 |
| Median duration | 41s | 24s |

Entity types in run 2: `person` ×11, `community` ×6, `team` ×2, `unnamed_group` ×1, `tradition` ×1.

All five entity types have now appeared in generated output. Collective forms — community, team, unnamed group, tradition — account for ten of twenty-one contributors, on subjects where a famous individual was usually available. Cases are ordered alphabetically and the negative set sorts last, so the false-positive rate is still unmeasured on this run.

That distribution is worth noting. Collective entities outnumbered individuals, on a set that includes subjects where a famous name was readily available. The "do not create false heroes" rule is holding so far.

Contributor support at 7/7 means nothing was dropped — the model proposed only contributors it had sources for, rather than proposing many and having the verifier prune them. Encouraging, and too small a sample to trust.

## The verifier did its job

In run 2, `apollo-guidance` is the first recorded case where verification actually removed something: the model offered three contributors and one was dropped for having no URL among the fourteen sources that run had searched.

The two that survived were Margaret Hamilton and the Raytheon female factory workers, typed `unnamed_group`.

That second one is the harder half of the subject. The gold file for this case states the requirement plainly — Hamilton alone would be accurate, safe and incomplete, and the Trace has to reach the workforce as well. It did, unprompted, from its own search.

## The hardest case passed

`henrietta-lacks` is the set's test for *uplifted harm* — the failure of turning a violation into an inspiring fact about medical progress. Its gold file states the requirement: the Trace must not reach for what the cells achieved, and must end without consolation.

The engine's acknowledgement names the violation directly: the line originated from a biopsy taken in 1951 "without her knowledge or consent." No uplift, no gratitude the sources cannot support.

Two of its three contributors are collective — Gey's laboratory team rather than Gey alone, and the Lacks Family typed as `community`, credited for advocacy on genomic privacy and bioethics. Treating the family's later advocacy as a contribution in its own right is a reading the gold file does not require and does not contradict. Among the sources is the 2013 NIH–Lacks Family Agreement, which is the least obvious and most substantive document in the subject.

One gap. Two of the six sources are Johns Hopkins' own pages. The gold file flags Hopkins as an interested party whose statements belong attributed rather than presented as independent findings, and the engine has no rule distinguishing a source from a party to the events. This is concrete evidence for the open roadmap item on source-domain quality rules.

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

The constraint turned out to be pace rather than allowance, so the run is being completed on the free tier at one request at a time. If a genuine daily limit is reached, the run resumes the next day into the same directory.

## Resuming

```bash
cd app
pnpm evaluate -- --resume evaluations/2026-08-24T15-31-02-181Z
```

Already-recorded cases are skipped. On the first quota refusal the run stops and prints the resume command rather than spending the remaining cases on identical errors.
