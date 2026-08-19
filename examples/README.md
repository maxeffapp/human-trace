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

## Index

### Positive set — 25 subjects

| File | Subject | Category | What it tests |
|---|---|---|---|
| [`andean-potato.md`](andean-potato.md) | The Andean Potato | traditional knowledge | knowledge that is collectively held, still in active use, and belongs to living people rather than to history |
| [`apollo-guidance.md`](apollo-guidance.md) | The Apollo Guidance Computer | collective work | whether the layer can hold two subjects at once without dropping either |
| [`beethovens-ninth.md`](beethovens-ninth.md) | Beethoven's Ninth Symphony | art | an anecdote so good that repeating it uncritically is the default |
| [`coffee.md`](coffee.md) | Coffee | cultural / traditional knowledge | an anonymous, gradual, communal development with a ready-made false origin story attached |
| [`descartes.md`](descartes.md) | Descartes | philosophy | whether the layer will find the person who is present in the primary sources but absent from the summary |
| [`dna-structure.md`](dna-structure.md) | The Structure of DNA | science / forgotten contributor | the case where the popular human story is itself the thing under revision |
| [`eniac-programmers.md`](eniac-programmers.md) | The ENIAC Programmers | forgotten contributors | an omission with no villain in it |
| [`fermentation.md`](fermentation.md) | Fermentation | traditional knowledge | a subject with no individuals in it at all for the first thirteen millennia, and one very famous individual at the end |
| [`henrietta-lacks.md`](henrietta-lacks.md) | HeLa Cells | forgotten contributor / ethics | the failure mode this project names as *uplifted harm*, in its purest available form |
| [`ibn-sina.md`](ibn-sina.md) | Ibn Sina | philosophy / science | an erasure produced by periodisation rather than by malice |
| [`internet.md`](internet.md) | The Internet | collective work / engineering | a subject where the honest answer to the user's question is that the question is wrong, and the Trace has to make that interesting rather than pedantic |
| [`kant.md`](kant.md) | Kant's Categorical Imperative | philosophy | restraint on a subject that offers an easy moral |
| [`linear-perspective.md`](linear-perspective.md) | Linear Perspective | art | a two-person story where the famous name did the memorable thing and the less famous name did the consequential one |
| [`magnetic-compass.md`](magnetic-compass.md) | The Magnetic Compass | traditional knowledge / engineering | the distinction between inventing something and being the first person to write it down |
| [`mozart-requiem.md`](mozart-requiem.md) | Mozart's Requiem | art | a subject where a fictional version is more widely believed than the documented one, and where the documented one is not less dramatic — only less shapely |
| [`penicillin.md`](penicillin.md) | Penicillin | science | the dramatised failure mode, against the single most retold accident in the history of medicine |
| [`polynesian-wayfinding.md`](polynesian-wayfinding.md) | Polynesian Wayfinding | cultural / traditional knowledge | attribution to a community rather than a person, in the hardest form — there is no inventor, no document, and no date of origin |
| [`printing-press.md`](printing-press.md) | The Printing Press | engineering | a Eurocentric attribution so standard that it is embedded in the phrase "the Gutenberg era |
| [`radioactivity.md`](radioactivity.md) | Radioactivity | science | the baseline case |
| [`relativity.md`](relativity.md) | General Relativity | science | whether the layer can find the human story in a subject completely dominated by one name |
| [`thermodynamics.md`](thermodynamics.md) | Thermodynamics | science | transmission rather than discovery |
| [`transistor.md`](transistor.md) | The Transistor | collective work / engineering | the "do not create false heroes" rule against the version most readers already carry |
| [`van-gogh.md`](van-gogh.md) | Van Gogh | forgotten contributor / art | whether the layer can identify that the human story is about someone other than the artist |
| [`web-at-cern.md`](web-at-cern.md) | The Web | collective work | whether the layer can identify that the pivotal human decision was not the invention |
| [`wootz-steel.md`](wootz-steel.md) | Wootz Steel | traditional knowledge / engineering | an anonymous craft tradition with a sensational modern finding attached to it |

### Negative set — 15 questions

Questions that must produce **no** Trace. Six of them are deliberate near-neighbours of subjects in the positive set — a flickering bulb, a dying sourdough starter, a phone compass, an amoxicillin prescription, a git command, an IndentationError. The history behind each is real and is written up elsewhere in this directory. None of it belongs in the answer to these questions. See [`negative/`](negative/).
