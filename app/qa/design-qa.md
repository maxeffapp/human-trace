# Design QA

## Source of truth

- Contributions target: `qa/source-contributions.png` — original 1487 × 1058, normalized to 1440 × 1024 for comparison.
- Lineage target: `qa/source-lineage.png` — original 1487 × 1058, normalized to 1440 × 1024 for comparison.
- Browser viewport: 1440 × 1024 CSS pixels, device pixel ratio 2; browser capture exported at 1440 × 1024.
- Shared state: the entropy preview is loaded, Rudolf Clausius is selected, and the matching answer passages are emphasized.

## Comparison evidence

- Contributions implementation: `qa/implementation-contributions.png`
- Contributions full comparison: `qa/comparison-contributions.png`
- Contributions right-rail comparison: `qa/comparison-contributions-right-rail.png`
- Lineage implementation: `qa/implementation-lineage.png`
- Lineage full comparison: `qa/comparison-lineage.png`
- Lineage right-rail comparison: `qa/comparison-lineage-right-rail.png`
- Mobile answer: `qa/implementation-mobile.png`
- Mobile lineage: `qa/implementation-mobile-trace.png`

## Iteration history

### Pass 1

- P2: the implementation right rail was too narrow, causing the title to wrap earlier than the target.
- P2: the answer started too low because the question bar and upper padding were oversized.
- P2: answer copy was less dense than the editorial target.

Fixes: widened the rail from 410 to 430 pixels, reduced the question bar from 118 to 94 pixels, tightened upper and paragraph spacing, reduced answer copy from 20 to 19 pixels, and tightened the rail heading.

### Pass 2

No actionable P0, P1 or P2 visual mismatches remain. The composition, hierarchy, typography pairing, ivory/navy/terracotta palette, mode switch, selected state, passage linkage and right-rail density all visibly match the chosen direction.

The implementation intentionally uses entity-type icons instead of portraits. Runtime contributors are dynamic, and displaying an unverified or merely decorative portrait would weaken the product's attribution rules. The target's visual hierarchy is preserved without inventing assets.

## Surface review

- Fonts: Newsreader supplies the editorial answer and heading voice; Manrope supplies navigation, controls and metadata.
- Spacing: answer and right rail share the target's broad desktop rhythm and remain readable at 390 × 844.
- Colors: warm ivory surfaces, navy typography and restrained terracotta selection states match the target.
- Images and icons: the generated Human Trace monogram is used as a real asset; Phosphor icons represent actions and entity types.
- Copy: the QA fixture is explicitly visual-only. Production copy is generated dynamically and filtered against live search sources.

## Interaction and responsive checks

- `Katkılar` and `İz Akışı` switch over the same contributor data.
- Rudolf Clausius remains selected when switching modes.
- Contributor expansion and answer-passage emphasis work.
- Story and source dialogs open, contain the selected contributor, and close successfully.
- At 390 × 844 there is no horizontal overflow; the answer remains first and the trace rail follows below it.
- Browser console warnings and errors: none.
- Schema tests, production build and static worker tests pass.

final result: passed
