# Roadmap

Execution plan for Human Trace. The [README](README.md) describes *what* the project is; this file describes *what to do next, in what order*.

**Current phase: Phase 1 — Concept and Gold Examples**

## How this roadmap works

* One phase at a time. Do not start the next phase before the current one meets its exit criteria.
* Every phase ends in a concrete artifact committed to this repository, not a conclusion in someone's head.
* The order is deliberate: the cheapest way to kill a bad idea comes first. Phase 1 needs no code at all.
* If a phase's exit criteria cannot be met, that is a finding, not a failure. Record it and decide whether to continue.

---

## Phase 0 — Repository Foundation

**Goal:** a public home for the project with clear terms.

* [x] Create the public repository
* [x] Write the concept document (`README.md`)
* [x] Extract the system prompt into its own file (`prompts/human-trace-system-prompt.md`)
* [x] Add the MIT license
* [x] Write the repository description
* [x] Add repository topics
* [x] Create the `examples/` directory structure

**Exit criteria:** anyone landing on the repository understands the idea and knows what they may do with it. ✅

---

## Phase 1 — Concept and Gold Examples

**Goal:** answer the project's own first success criterion before writing any code — *when we add a 3–5 sentence human story to an AI answer in the right place, does the answer become more meaningful and more memorable?*

Everything in this phase is written by hand. No model is asked to generate a Human Trace yet. These examples become the standard every later phase is measured against.

### 1.1 Define the quality bar

* [x] Write `docs/quality-rubric.md`
* [x] Define what makes a **good** Human Trace: grounded, specific, restrained, connected to the question
* [x] Define what makes a **bad** Human Trace: encyclopedic, dramatized, hero-centric, generic, tacked on
* [x] Write 3 side-by-side bad/good rewrites showing the difference
* [x] Fix the length limits: Trace 2–5 sentences, Story 250–500 words, Deep Story unbounded
* [x] Define the tone rules concretely enough that two different writers produce comparable output

### 1.2 Select the subjects

The set must stress-test the principles, not just showcase them. Aim for **25 subjects** with enforced category coverage.

* [x] Science — 5: radioactivity, thermodynamics, relativity, the structure of DNA, penicillin
* [x] Engineering — 4: the printing press, the magnetic compass, the transistor, the internet
* [x] Art — 4: Beethoven's Ninth Symphony, linear perspective, Van Gogh, Mozart's Requiem
* [x] Philosophy — 3: Descartes' method, Ibn Sina's medicine, Kant's ethics
* [x] Cultural and traditional knowledge — 5: coffee, fermentation, Andean potato cultivation, Polynesian wayfinding, wootz steel
* [x] Collective work — 2: the Apollo guidance software, the web at CERN
* [x] Forgotten and unnamed contributors — 2: the ENIAC programmers, Henrietta Lacks and the HeLa line

Three of these are deliberately hard cases and must not be skipped:

* **Henrietta Lacks** — the human story is exploitation, not achievement. Tests whether the layer can be honest rather than inspirational.
* **Polynesian wayfinding** — no named inventor, no written record. Tests attribution to a culture rather than a person.
* **The transistor** — contested credit between Shockley, Bardeen and Brattain. Tests the "do not create false heroes" rule.

### 1.3 Write the examples

* [x] Agree the file format: question, plain answer, Trace, Story, sources
* [ ] Write all 25 as `examples/<slug>.md`
* [x] For each, write the **plain answer first** and only then the Trace, so the Trace is genuinely additive
* [ ] Reread each one asking: would removing the Trace make the answer worse? If not, the Trace is wrong

**Progress: 3 of 25.** `radioactivity` (baseline), `polynesian-wayfinding` (no named originator), `transistor` (contested credit) — one straightforward case and the two hardest, written first on purpose.

### 1.4 Build the negative set

Restraint is the hard part. A layer that fires on everything is worse than no layer.

* [ ] Write `examples/negative/` with **15 questions that must produce no Trace**
* [ ] Cover: purely practical questions, personal advice, current events, arithmetic, code debugging, subjective preference
* [ ] For each, record one sentence on *why* a Trace would be wrong here

### 1.5 Fact-check

* [ ] Check every factual claim in all 25 traces against a source
* [ ] Record sources inline in each example file
* [ ] Mark every disputed claim explicitly as disputed
* [ ] Delete any sentence that cannot be sourced — do not soften it, delete it

**Exit criteria:** 25 fact-checked examples and 15 negative cases are committed, and a reader who knows nothing about the project can tell a good Trace from a bad one using only the rubric.

---

## Phase 2 — Prompt Prototype

**Goal:** find out whether a single model, given the system prompt, can approach the hand-written standard.

### 2.1 Minimal harness

* [ ] Decide the implementation language and model (see Open Decisions)
* [ ] Build the smallest possible runner: question in → answer plus optional Trace out
* [ ] Keep the system prompt in `prompts/`, loaded from file, never pasted into code
* [ ] Log every run so outputs can be compared over time

### 2.2 Evaluate against the gold set

* [ ] Run all 25 positive subjects and all 15 negative cases
* [ ] Score each output against the rubric from 1.1
* [ ] Record two numbers: **trigger rate** on the positive set and **false-positive rate** on the negative set
* [ ] Collect the failure modes into `docs/failure-modes.md`

### 2.3 Iterate the prompt

* [ ] Fix the worst failure mode, rerun the full set, compare
* [ ] Repeat until the scores stop improving
* [ ] Keep every prompt version — a change that fixes one case usually breaks another

**Exit criteria:** the prototype produces a Trace judged acceptable on most positive subjects and stays silent on the negative set. Both numbers are written down.

---

## Phase 3 — Detection Quality

**Goal:** separate *deciding whether to speak* from *deciding what to say*. In Phase 2 one prompt does both, which makes failures impossible to diagnose.

* [ ] Split into two stages: candidate extraction, then a relevance decision
* [ ] Make the decision stage emit a structured verdict (subject, yes/no, reason)
* [ ] Expand the negative set to 50 cases, drawn from real questions rather than invented ones
* [ ] Measure the decision stage on its own, independent of story quality
* [ ] Tune toward silence — a missed opportunity costs far less than an intrusive or wrong Trace

**Exit criteria:** the decision stage can be evaluated and improved without touching the story stage.

---

## Phase 4 — Retrieval and Verification

**Goal:** stop relying on model memory for history. This is the phase that decides whether the project is trustworthy.

### 4.1 Retrieval

* [ ] Add search over the source priority defined in the README
* [ ] Prefer primary sources, universities, museums and academic publications over general web results
* [ ] Store what was retrieved alongside what was generated

### 4.2 Verification

* [ ] Require every factual claim in a Trace to be supported by retrieved material
* [ ] Drop unsupported claims automatically rather than rewording them
* [ ] Detect disputed history and force the hedge into the output
* [ ] Build a regression set from real errors found in earlier phases

### 4.3 Bias checks

* [ ] Measure how often the system reaches for a famous Western name when the history is collective or non-Western
* [ ] Verify the culture and community categories actually fire in practice
* [ ] Review the exploitation cases with fresh eyes — the failure mode there is unearned uplift

**Exit criteria:** every generated Trace carries its sources, and the known error set no longer reproduces.

---

## Phase 5 — Interface Prototype

**Goal:** make the three-layer experience real enough to test on people.

* [ ] Build a minimal demo: a question box, an answer, and a collapsed `Human Trace ↗`
* [ ] Implement the layer progression: Trace → Story → Deep Story, each opened by choice
* [ ] Ensure the main answer stands alone with the Trace fully collapsed
* [ ] Instrument opens, dwell time and expansion depth
* [ ] Deliberately test the layer being ignored — it must never obstruct the answer

**Exit criteria:** a stranger can use the demo without explanation.

---

## Phase 6 — User Testing

**Goal:** answer the seven questions from the README with evidence rather than intuition.

* [ ] Recruit 20–30 testers across a range of prior interest in history
* [ ] Measure: open rate, completion rate, expansion to Story, expansion to Deep Story
* [ ] Run a recall test — ask about the content days later, with and without the Trace
* [ ] Ask directly whether the Trace interrupted the answer
* [ ] Measure the effect on trust in the AI's answer
* [ ] Write the findings into `docs/user-testing.md`, including the results that argue against the idea

**Exit criteria:** a defensible yes or no on the first success criterion. This is the go/no-go point for everything below.

---

## Phase 7 — Knowledge Graph

**Only if Phase 6 says yes.**

* [ ] Model the entities: Person, Event, Concept, Work, Culture, Place, Period, Relationship, Source
* [ ] Seed from the Phase 1 examples, which are already fact-checked
* [ ] Use the graph to find non-obvious connections retrieval alone misses
* [ ] Keep the graph a cache, never the sole authority — sources stay attached

---

## Phase 8 — Personalization

* [ ] Add a density setting: more traces, default, or rare
* [ ] Learn from behaviour rather than asking
* [ ] Never let personalization override the accuracy rules — a user who wants more stories does not get looser facts

---

## Cross-Cutting Concerns

Carried through every phase, not scheduled into one.

| Risk | Why it matters | Mitigation |
|---|---|---|
| Fabricated attribution | Destroys the project's entire premise | Phase 4 verification, mandatory sources |
| Famous-name bias | Reproduces exactly the erasure the project opposes | Category coverage in the example set, Phase 4 bias checks |
| Cultural misrepresentation | Real harm to living communities | Selection engine question E, human review on cultural subjects |
| Trace fatigue | A layer that always fires stops being noticed | Negative set, tuning toward silence |
| Romanticizing exploitation | Turns harm into an uplifting anecdote | Hard cases in the Phase 1 set, explicit review |

## Metrics

Tracked from Phase 2 onward.

* **Trigger rate** — share of positive subjects that produce a Trace
* **False-positive rate** — share of negative cases that wrongly produce one
* **Claim support rate** — share of factual claims backed by a source (Phase 4)
* **Open rate** — share of shown Traces users expand (Phase 5)
* **Recall lift** — retention with a Trace versus without (Phase 6)

## Open Decisions

Deliberately unresolved. Each needs an owner's call before the phase that depends on it.

* **Implementation language and runtime** — needed for Phase 2
* **Model choice** — needed for Phase 2
* **Retrieval approach: live search or a curated corpus** — needed for Phase 4
* **Demo surface: web, browser extension, or API** — needed for Phase 5
* **Where the layer ultimately lives: a product, a library, or a published prompt standard** — needed before Phase 7
