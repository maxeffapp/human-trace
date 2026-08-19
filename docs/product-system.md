# Human Trace as a Product System

## Product boundary

Human Trace is not primarily a destination website. It is an answer-enrichment engine that can be enabled inside products where people already ask questions. The web MVP is the reference implementation used to define and test the behavior.

The stable product boundary is:

```text
host sends a question
        ↓
Human Trace researches, answers and verifies
        ↓
host receives one structured response
        ↓
host renders the answer, contributions, lineage and sources
```

The engine owns trace selection, research, attribution, source matching and the `no trace` decision. A host owns navigation, account state and how much of the trace experience is visible at once.

## MVP response contract

A response contains:

- a standalone main answer split into addressable paragraphs;
- `available` or `none` trace status and a reason;
- source-supported contributors, including people and collective entities;
- links between contributors and answer paragraphs;
- contribution roles and a relationship chain;
- short stories and visible source metadata;
- an acknowledgement only when the evidence supports it.

`Katkılar` and `İz Akışı` are two renderings of this contract, not two separate generation modes.

## Candidate host surfaces

### Chat mode

Human Trace is enabled for a conversation or answer. This gives the most coherent experience but depends on access to the host's answer-generation flow.

### Browser extension

The extension can add a compact trace panel to supported AI and search pages. It offers broad reach, but passage linking and page changes need careful handling.

### Search companion

A Google or general search integration can show the people and communities behind a concept beside search results. It is naturally source-oriented but has less room for the full story.

### API or SDK

Other products send a question and render the response contract themselves. This is the most reusable distribution primitive and the least opinionated user experience.

## Recommended order

1. Use the web MVP to validate generation quality and the two interaction modes.
2. Harden claim-level verification and collect live evaluation results.
3. Choose one host integration using evidence about reach, answer access and interaction fit.
4. Keep the API/SDK contract stable while adapting only the presentation to each host.

The first integration choice should follow evaluation rather than become an architectural fork. Every host must call the same engine and preserve the rule that production stories are researched at runtime, never selected from a hand-written catalogue.
