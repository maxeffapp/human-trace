# Roadmap

Execution plan for Human Trace. The [README](README.md) explains the product; this file defines the next verifiable outcomes.

**Current phase: Phase 1 — Dynamic MVP**

## Operating rule

Human Trace production content is never prepared by hand. A stable evaluation set may contain questions and grading criteria, but the answer, contribution candidates, stories, links and acknowledgements must be produced by the live engine and grounded in sources retrieved during that run.

Each phase ends with a committed artifact and measurable exit criteria.

## Phase 0 — Repository Foundation

- [x] Publish the concept and principles
- [x] Keep the system prompt as a standalone file
- [x] Add an open-source license
- [x] Define the reusable engine and host-surface direction

**Exit criteria:** a new contributor can understand the idea, product boundary and accuracy rules. ✅

## Phase 1 — Dynamic MVP

**Goal:** prove the complete runtime loop without turning the demo into a library of canned stories.

### Engine

- [x] Accept an arbitrary question through a server-side boundary
- [x] Generate a standalone answer and decide whether a trace adds value
- [x] Perform live web research when a trace is warranted
- [x] Return structured answer paragraphs, contributors, relationships and sources
- [x] Remove contributors whose URLs cannot be matched to sources from the same search run
- [x] Support people, teams, communities, traditions and unnamed groups
- [x] Return `no trace` when the attribution would be forced or weak
- [ ] Add claim-level support checks rather than contributor-level URL checks only

### Provider independence

Added after a provider swap exposed the engine's dependence on one vendor's citation format. Measurements in [`docs/providers.md`](docs/providers.md).

- [x] Run the web search independently of the model provider, so verification never depends on a vendor's citation shape
- [x] Add a second provider without forking the engine — Gemini plus Exa alongside the original OpenAI path, selected from the keys present
- [x] Stop before searching when no trace is warranted, so restraint costs less than speaking
- [x] Keep a provider's SDK out of the code path that does not use it
- [x] Verify end to end on a free tier: an arbitrary question produces a source-supported trace, and a practical question produces none

### Reference interface

- [x] Build the editorial answer surface
- [x] Build the `Katkılar` accordion
- [x] Build the `İz Akışı` lineage view over the same data
- [x] Preserve selection and answer highlighting between modes
- [x] Add story and source dialogs
- [x] Add loading, empty, configuration-error and `no trace` states
- [x] Verify desktop and mobile layouts against the selected visual target

### Reliability

- [x] Keep API credentials outside the browser bundle
- [x] Validate and normalize the model response at the provider boundary
- [x] Add schema normalization tests
- [ ] Add integration tests with recorded provider responses
- [ ] Add retry, timeout and rate-limit behavior — *retry with backoff is in place for 5xx and for rate limits; request timeouts are not*
- [ ] Add source-domain quality rules and disputed-claim handling

**Exit criteria:** an arbitrary question can produce a complete answer and, when justified, a source-supported trace in both interface modes. The application builds and its core interactions pass. The remaining claim-level verification work is explicit rather than hidden.

## Phase 2 — Live Evaluation

**Goal:** learn whether the dynamic system is accurate, restrained and worth using.

- [x] Create a fixed, category-balanced question set; do not write target stories
- [x] Include science, engineering, art, philosophy, cultural knowledge, collective work and exploitation cases
- [x] Create a negative set where Human Trace should remain silent
- [ ] Grade every live output for relevance, factual support, restraint, collective attribution and usefulness
- [x] Track trigger rate, false-positive rate and source-support rate — *`pnpm evaluate` produces all three from the gold set; first partial run in [`docs/evaluation-01.md`](docs/evaluation-01.md)*
- [x] Save failed generated outputs as regression cases — *first one recorded in `examples/negative/python-indentation-error.md`*
- [ ] Compare `Katkılar` and `İz Akışı` for comprehension and preference

**Existing evaluation assets.** The question set already exists: 25 subjects in `examples/` and 15 silent cases in `examples/negative/`, indexed in [`examples/README.md`](examples/README.md), covering all seven required categories including an exploitation case. Grading criteria are in [`docs/quality-rubric.md`](docs/quality-rubric.md), which names six failure modes and gives a nine-step reviewer checklist.

Six of the negative cases are deliberate near-neighbours of positive subjects — a flickering bulb against the light-bulb story, a dying sourdough starter against fermentation, a phone-compass calibration against Shen Kuo. Silence is hardest where a real story exists but is irrelevant to what was asked.

**Open conflict.** Those files also contain hand-written Traces, Stories and sources, written before this roadmap set the operating rule. Under the current rule they cannot serve as target output. Three options, needing a decision before grading starts:

1. Keep them as a *reference standard* for graders, clearly marked as not-to-be-reproduced.
2. Strip the files down to question, category and grading notes.
3. Keep them as a held-out human baseline: grade live engine output and the hand-written version blind, and see which readers prefer.

Option 3 costs nothing extra and answers a question the roadmap does not currently ask — whether the live engine reaches the standard a careful human reached with the same brief.

**Exit criteria:** evaluation results and failure modes are published with enough evidence to decide what must improve before distribution.

## Phase 3 — First Host Integration

**Goal:** place Human Trace where people already ask questions instead of requiring them to visit a dedicated destination.

Evaluate these surfaces against reach, implementation cost, answer access and citation UX:

| Surface | Role | Key test |
|---|---|---|
| Chat mode or assistant | Native answer experience | Can the right-rail interaction become a compact in-answer mode? |
| Browser extension | Overlay on existing AI/search answers | Can answer passages be linked reliably without breaking host pages? |
| Search companion | Google/search side panel | Does trace context help before or after a click? |
| API/SDK | Integration primitive for other products | Is the response contract stable enough for unknown hosts? |

- [ ] Select one primary surface after Phase 2 evidence
- [ ] Reuse the existing provider contract; do not fork the engine
- [ ] Define permissions, privacy and failure behavior for the selected host
- [ ] Build a small install/onboarding path
- [ ] Measure activation and repeat use

**Exit criteria:** people can turn on Human Trace inside an existing question-answering workflow.

## Phase 4 — Product Instrumentation

**Goal:** understand whether the layer helps without interrupting the answer.

- [ ] Measure trace impressions, contributor selections, story opens and source visits
- [ ] Measure mode switching between `Katkılar` and `İz Akışı`
- [ ] Run recall and trust studies with and without Human Trace
- [ ] Track trace fatigue and the rate at which users dismiss the layer
- [ ] Keep telemetry free of question content unless users explicitly opt in

**Exit criteria:** a defensible go/no-go decision on usefulness, trust and recall.

## Phase 5 — Memory and Personalization

**Only if Phase 4 supports continued investment.**

- [ ] Model Person, Team, Community, Tradition, Event, Concept, Work, Place, Period, Relationship and Source
- [ ] Treat the graph as a source-attached cache, never as the sole authority
- [ ] Add trace-density preferences: rare, default and more
- [ ] Learn from interaction without relaxing factual support requirements
- [ ] Audit famous-name, Western and individual-hero bias continuously

## Cross-cutting risks

| Risk | Required response |
|---|---|
| Fabricated attribution | Filter against retrieved sources and add claim-level verification |
| Famous-name bias | Measure entity diversity and explicitly test collective/non-Western cases |
| Cultural misrepresentation | Use careful source policy and qualified human review |
| Romanticized exploitation | Preserve harm and power context; do not force gratitude |
| Trace fatigue | Tune toward silence and keep the main answer complete |
| Host lock-in | Keep one provider-neutral response contract |

## Metrics

- **Trigger rate:** positive evaluation questions that produce a trace
- **False-positive rate:** negative questions that wrongly produce one
- **Contributor support rate:** returned contributors matched to retrieved sources
- **Claim support rate:** factual claims backed by retrieved material
- **Open rate:** shown traces that users expand
- **Source visit rate:** trace views that lead to a source
- **Recall lift:** retention with Human Trace versus without it
