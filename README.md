# Human Trace

**A Layer of Human Memory and Story in AI Answers**

> **Human Trace is a narrative layer that makes the people, communities and lived experience behind the human knowledge an AI uses visible again — accurately, naturally and through story.**

---

## 1. The Core Idea

AI today produces answers by drawing on the scientific, cultural, artistic and intellectual work humanity has accumulated over centuries. Yet the answer that comes out usually renders the people, communities, periods and lived experience behind that knowledge invisible.

**Human Trace** is a narrative layer that naturally surfaces the meaningful human stories behind an AI answer.

The goal is not to build a conventional bibliography, chronology or encyclopedia.

The goal is:

> When a piece of knowledge has a person, a society, a struggle, a curiosity or an era behind it, bring that back into the story where it belongs.

---

## 2. Core Design Principles

### 2.1. Answer first, human trace second

The AI answers the actual question naturally and correctly first. The human story never smothers the answer. But when a meaningful connection exists, the system may add a short Human Trace.

Example:

> Behind the few sentences we use to describe radioactivity today lie decades of experimental work. Marie and Pierre Curie's laboratory conditions were far from today's standards, and the health effects of ionizing radiation were not yet properly understood.

### 2.2. A story is not a data table

Things like:

* 37% contribution,
* 82% confidence,
* 14 sources,
* attribution score

are not shown in the main experience. If they are needed at all, they stay in the system's backend.

What the user sees should be:

> person → era → problem → the process lived through → the result we use today

### 2.3. Do not manufacture single heroes

The system must not default to well-known names like Einstein, Newton, Mozart or Curie.

Knowledge may have been developed by:

* a person,
* a team,
* a laboratory,
* a craft tradition,
* a society,
* a culture,
* anonymous workers,
* independent researchers working separately.

Where appropriate, the system should say plainly:

> "It would not be accurate to attribute this development to a single person."

### 2.4. Never distort the truth for the sake of the story

Dramatic narration is allowed, but:

* legends are not told as fact,
* disputed events are not presented as settled,
* a person's motivation is not invented,
* causality is not asserted where none is established,
* nothing is romanticized.

The story carries reality; it does not substitute for it.

---

## 3. User Experience

Human Trace works in three layers.

### Layer 1 — Trace

Roughly 2–5 sentences. The goal is to catch the user's attention.

Example:

> **Human Trace — Beethoven**
> By the time Beethoven composed the Ninth Symphony, his hearing loss was severe. A significant part of the work we now associate with a full orchestra was therefore built through the music in his own mind. That makes the piece notable not only in music history but in how a human being creates.

### Layer 2 — Story

Roughly a 1–3 minute read. It covers:

* the person,
* the era,
* the conditions,
* the problem,
* the failures,
* the relationships,
* the turning points.

### Layer 3 — Go Deeper

For users who want more:

* timeline,
* other contributors,
* historical disputes,
* original work,
* letters,
* documents,
* scientific publications,
* cultural context.

---

## 4. System Architecture

```
USER QUESTION
        ↓
ANSWER + CONTRIBUTION CANDIDATES
        ↓
LIVE HISTORICAL / CULTURAL RESEARCH
        ↓
SOURCE MATCHING AND VERIFICATION
        ↓
STRUCTURED HUMAN TRACE RESPONSE
        ↓
HOST SURFACE: CHAT · EXTENSION · SEARCH · WEB · API
```

Human Trace is the reusable engine and response contract in this diagram. The web application in this repository is its reference surface, not the final destination of the product.

---

## 5. The Human Trace Selection Engine

A story should not be generated for every concept. The system asks:

* **A.** Is there a meaningful human story behind it?
* **B.** Is that story genuinely related to the user's current question?
* **C.** Does the story add value to the overall answer?
* **D.** Is the attribution historically verifiable enough?
* **E.** Does telling the story risk misrepresenting a person or a community?

If it is not meaningful, no Human Trace is shown.

---

## 6. Types of Human Trace

The system must recognize more than scientists.

| Type | Examples |
|---|---|
| Science | Curie, Faraday, Darwin, Tesla, Rosalind Franklin |
| Engineering | Inventors, engineering teams, industrial workers, designers |
| Art | Mozart, Beethoven, Van Gogh, architects, artisans |
| Philosophy | Descartes, Kant, Ibn Sina, Al-Farabi |
| Cultural knowledge | Methods a society developed over long periods |
| Traditional knowledge | Agriculture, fermentation, metallurgy, use of plants |
| Collective work | NASA teams, CERN, the Manhattan Project |

**Unnamed contributions** — collective memory can be preserved where appropriate:

> "Thousands of unnamed technicians and workers contributed to the development of this technology."

---

## 7. MVP — Dynamic Reference Implementation

The MVP is already structured as a small but real system:

1. A user asks any question.
2. The server generates the main answer and decides whether a Human Trace is useful.
3. When it is useful, the engine performs live web research and returns only contributors whose source URLs appeared in that search run.
4. One structured response links contributors to answer paragraphs, stories and visible sources.
5. The same data can be viewed as a compact `Contributions` list or a connected `Lineage` flow.
6. When a trace would be forced or weak, the answer remains complete and the engine returns `no trace`.

Production content is never hand-authored or selected from canned stories. A fixed set of questions may be used to evaluate the system, but their answers and traces must be generated and verified at runtime.

The working reference app lives in [`app/`](app/README.md).

### Source priority

1. Primary sources
2. Universities, museums and academic institutions
3. Academic publications
4. Reliable biographical sources
5. General sources

### MVP learning questions

The questions to measure:

* Do people open the Human Trace?
* Do they finish the story?
* Does it interrupt the main answer?
* Do people want to read more?
* Do people remember what they learned better?
* Does it increase trust in the AI?
* Does it make the value of human knowledge more visible?

---

## 8. Product and Distribution Path

**Phase 1 — Dynamic MVP**

Harden the engine contract, source policy and two-mode reference interface.

**Phase 2 — Evaluation**

Run a fixed question set through the live system; people grade the results but do not write the production stories.

**Phase 3 — First host integration**

Package Human Trace as one of: a chat mode, a browser extension, a search companion or an API/SDK. The host should call the same provider boundary used by the reference app.

**Phase 4 — Product instrumentation**

Measure opens, source visits, story depth, trace fatigue, trust and recall.

**Phase 5 — Memory and personalization**

Only after real usage supports it, add a source-attached knowledge graph and tune trace density without weakening accuracy.

For the detailed, task-level execution plan see [`ROADMAP.md`](ROADMAP.md).
For the reusable engine boundary and host-surface strategy see [`docs/product-system.md`](docs/product-system.md).

---

## 9. The AI System Prompt

The system prompt, usable directly in the first prototype, lives in its own file:

→ [`prompts/human-trace-system-prompt.md`](prompts/human-trace-system-prompt.md)

---

## 10. First Success Criterion

The first goal is not a technically flawless historical knowledge graph. The first question is much simpler:

> **When we add a 3–5 sentence human story to an AI answer in the right place, does the answer become more meaningful and more memorable?**

If the answer is yes, the technical system behind it can be deepened later.

---

## 11. A Note on the MVP Approach

The MVP should **not** start with a knowledge graph or a library of hand-written stories. It tests `normal AI answer + dynamically researched Human Trace` through one reusable engine and a reference interface. If people genuinely open the story, inspect its sources and remember it, deeper retrieval and graph infrastructure become meaningful.

The product hypothesis is that Human Trace becomes useful when it travels with answers people already use. That is why the repository keeps the engine independent from the interface and treats chat, extension, search and API integrations as host surfaces rather than separate products.

---

## License

Released under the [MIT License](LICENSE).
