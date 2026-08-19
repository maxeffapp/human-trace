# Quality Rubric

The standard for every Human Trace, hand-written or generated. This file exists so that two different writers produce comparable output, and so that "this one feels better" can be replaced with a reason.

Scope: this rubric judges a Trace that has already been deemed appropriate. Deciding *whether* to show one at all is the selection engine's job, defined in [README](../README.md) section 5.

---

## 1. What good looks like

Four properties. A Trace that fails any one of them is not ready.

### Grounded

Every sentence traces to something documented. Where the record is contested, the Trace says so in its own text rather than picking a side quietly.

> **Test:** can you point at the source for each clause?

### Specific

The detail is particular to this subject and could not be pasted onto another one. Specificity is what makes a Trace memorable; generality is what makes it skippable.

> **Test:** swap in a different discovery. Does the sentence still work? If yes, it is too generic.

### Restrained

It states what happened and stops. The reader supplies the feeling. A Trace that tells the reader how to feel has stopped trusting the material.

> **Test:** remove every adjective. Is the story still affecting? If not, the adjectives were doing work the facts should have done.

### Connected

It answers something the question actually raised. A Trace about the person who happens to be nearby in the answer is trivia wearing a costume.

> **Test:** does the Trace change how the reader understands the answer they just read?

---

## 2. Failure modes

Named so they can be pointed at in review.

### Encyclopedic

Dates, birthplaces, prizes. Facts arranged in chronological order with nothing connecting them.

**Symptom:** the Trace opens with a birth or a year.
**Cost:** the reader learns the layer contains reference material and stops opening it.

### False hero

A collective or contested development attributed to the one name the reader already knows.

**Symptom:** a single famous person, no team, no predecessors.
**Cost:** fatal. The project exists to counter exactly this erasure; reproducing it inverts the entire premise.

### Dramatized

Invented interior states, invented scenes, myth told as fact, a moment of realization that no source records.

**Symptom:** the words *suddenly*, *realized*, *little did they know*, *in that instant*.
**Cost:** once a reader catches one invented detail, every other Trace becomes suspect.

### Generic

True of any discovery. "Years of painstaking work." "A dedicated team." "Against all odds."

**Symptom:** the subject's name could be replaced and nothing else would change.
**Cost:** occupies the slot a real story could have used.

### Tacked on

Historically fine, unrelated to what was asked.

**Symptom:** the Trace would sit equally well under three other answers.
**Cost:** trains the reader that the layer is decoration.

### Uplifted harm

An exploitative or coercive history rewritten into an inspiring anecdote about progress.

**Symptom:** the phrase *her cells went on to help millions* with no mention of consent.
**Cost:** the layer becomes the thing it was built to prevent — a machine for making people disappear politely.

---

## 3. Three rewrites

Each pair shows one failure mode and its repair. The subjects are chosen because the bad version is the version most people have already heard.

### 3.1 Encyclopedic → grounded and specific

**Subject:** the printing press

> ❌ **Bad**
> Johannes Gutenberg was born in Mainz around 1400. He invented the printing press in 1440. His most famous work is the Gutenberg Bible, printed in 1455. The printing press revolutionized the spread of knowledge in Europe.

Four facts, no story, and the last sentence is a claim so broad it carries no information. It also happens to be wrong about what Gutenberg invented.

> ✅ **Good**
> The technique Gutenberg is remembered for — casting individual letters in metal and setting them into a page — was not the first movable type; printers in China and Korea had been working with it for centuries before Mainz. What was new was the combination: an alloy that cast cleanly, a hand mould that turned out identical letters quickly, and an ink that would hold to metal. Gutenberg borrowed heavily to build it, and lost the workshop to his financier in a lawsuit shortly after the Bible was finished.

The correction is made by stating what actually happened, not by scolding the reader.

### 3.2 False hero → collective and contested

**Subject:** the transistor

> ❌ **Bad**
> The transistor was invented by William Shockley at Bell Labs in 1947. His brilliant insight into semiconductor physics launched the digital age and earned him the Nobel Prize.

Shockley did not build it and was not present when it worked. The word *brilliant* is doing what the facts were supposed to do.

> ✅ **Good**
> The first working transistor was built in December 1947 by John Bardeen and Walter Brattain, pressing gold contacts into a slab of germanium. Their supervisor, William Shockley, had pushed the research but was not in the room, and responded to being left off the patent by working out a better design of his own within weeks. The three shared a Nobel Prize in 1956, by which point they were barely on speaking terms.

Same length. The credit is placed accurately, and the friction is reported rather than smoothed over.

### 3.3 Dramatized → honest about the record

**Subject:** penicillin

> ❌ **Bad**
> One morning in 1928, Alexander Fleming returned from holiday to find that a mould had blown in through his open window and killed the bacteria in his petri dish. In that instant he realized he had discovered a cure that would save millions of lives.

The open window is disputed. The instant of realization is invented. And the sentence quietly deletes the decade of work and the people who did it.

> ✅ **Good**
> Fleming did notice mould killing bacteria on a forgotten plate in 1928, though the open window of the popular version is disputed — the spores most likely drifted up from a mycology lab on the floor below. What he could not do was turn it into medicine; penicillin was unstable, and he set the work aside. It took a team at Oxford more than a decade later — Howard Florey, Ernst Chain, and Norman Heatley, whose extraction method made any production possible — to treat a patient with it, and the first one they treated died when the supply ran out.

The dispute is named. The famous man keeps the observation he made and loses the credit he did not earn.

---

## 4. Length

| Layer | Limit | Enforcement |
|---|---|---|
| Trace | 2–5 sentences | Hard. A six-sentence Trace is a Story that escaped. |
| Story | 250–500 words | Hard at the top end. |
| Deep Story | No limit | Structure it; do not pad it. |

The Trace is the only layer shown by default, and it is the only one most readers will ever see. Everything that matters most goes there.

---

## 5. Tone rules

Concrete enough to check mechanically.

**Never:**

* Open with a birth, a birthplace, or a year
* Use *suddenly*, *realized*, *little did they know*, *changed the world forever*
* Open with *Imagine* or a rhetorical question
* End on a moral, a lesson, or a call to reflect
* Use exclamation marks
* Use *genius*, *brilliant*, *tragic*, *heroic* — if the facts do not carry it, the adjective will not either
* Use a list inside a Trace
* Include a date unless the date is the point

**Always:**

* Present tense for what we do today, past tense for the history
* Name the community when there is no individual to name
* Mark disputes in the sentence that makes the claim, not in a footnote
* Prefer the concrete noun — *germanium*, *petri dish*, *hand mould* — over the abstract one
* Let the last sentence be the strongest one, and let it stop

**On the opening:** the strongest Traces start from the present — the thing the reader takes for granted — and then go back. The README's Curie example does this, and so do all three rewrites above. It is not a rule, but it is the default worth departing from deliberately.

---

## 6. Reviewer's checklist

Run in order. Stop at the first failure and fix it.

1. Is every claim sourced?
2. Is every disputed claim marked as disputed **in the text**?
3. Would removing the Trace make the answer poorer? If not, cut it.
4. Swap the subject for another one. Does any sentence survive unchanged? Cut that sentence.
5. Delete every adjective. Does it still land?
6. Is credit placed accurately — the team named, the tradition named, the uncertainty stated?
7. If the history involves harm, is the harm still visible?
8. Sentence count: 2–5.
9. Read it aloud. Does it sound like a person mentioning something, or like a page being recited?
