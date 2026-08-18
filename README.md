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
MAIN AI ANSWER
        ↓
CONCEPT / IDEA / WORK DETECTION
        ↓
"IS THERE A HUMAN TRACE?" DECISION
        ↓
HISTORICAL AND CULTURAL RESEARCH
        ↓
SOURCE VERIFICATION
        ↓
STORY ENGINE
        ↓
SHORT HUMAN TRACE
        ↓
OPTIONAL DEEP STORY
```

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

## 7. MVP — First Prototype

The first version should be kept very small.

### Phase 1 — Proof of Concept

Pick 20–30 different subjects:

radioactivity · relativity · thermodynamics · electricity · penicillin · DNA · the computer · the internet · Mozart · Beethoven · perspective · the printing press · coffee · fermentation · the compass

Produce high-quality Human Trace outputs for each. The point is to test whether the **experience** works, not the algorithm.

### Phase 2 — Automatic Detection

The AI extracts candidates from the answer it just gave: people, discoveries, theories, works, techniques, cultural practices. For each candidate it makes a `Human Story Relevance` decision.

Output:

```
Human Trace: YES
Subject: Thermodynamics
Suggested story: Sadi Carnot
Reason: Foundational human story
```

### Phase 3 — Retrieval

Historical stories must not be left to the AI's memory. The system should gather the relevant material from reliable sources.

Priority:

1. Primary sources
2. Universities / museums / academic institutions
3. Academic publications
4. Reliable biographical sources
5. General sources

### Phase 4 — Story Engine

Turns the collected facts into a short, natural narrative. Output: `Short Trace`, `Story`, `Deep Story`.

### Phase 5 — User Testing

The questions to measure:

* Do people open the Human Trace?
* Do they finish the story?
* Does it interrupt the main answer?
* Do people want to read more?
* Do people remember what they learned better?
* Does it increase trust in the AI?
* Does it make the value of human knowledge more visible?

---

## 8. Initial Development Roadmap

**Phase 1 — Concept**
Write the Human Trace principles · produce 20 examples · define what makes a good vs. bad Human Trace · define story lengths

**Phase 2 — Prompt Prototype**
Use a single LLM. Flow: `Question → Answer → Human Trace Detection → Story`. Coding can be kept to a minimum at this stage.

**Phase 3 — Retrieval**
Add web/search/RAG. Verify the facts of the story.

**Phase 4 — Simple Interface**
Create an expandable section inside the main answer, e.g. `Human Trace ↗`.

**Phase 5 — Knowledge Graph**
If the prototype succeeds, build persistent memory structured as `Person · Event · Concept · Work · Culture · Place · Period · Relationship · Source`.

**Phase 6 — Personalization**
The system tunes Human Trace density to the user's interest. Some users want more human stories; others want them only in genuinely special cases.

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

The MVP should **not** start with a knowledge graph. It is better to test the `normal AI answer + Human Trace` experience on 20–30 hand-picked examples first. If people genuinely open the story and remember it, investing in retrieval, verification and graph infrastructure becomes meaningful.

Confidence level: **high** for the product concept; **medium** for the quality of automated historical attribution — which is exactly why a verification layer must be mandatory.

---

## License

Released under the [MIT License](LICENSE).
