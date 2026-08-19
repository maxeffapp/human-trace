# Negative Examples

Questions that must produce **no** Human Trace.

Restraint is the hard part of this project. Deciding when to stay silent is a harder problem than writing a good story, and it is the difference between a layer people value and a layer people learn to skip.

## File format

One question per file, named by slug. Short by design:

```markdown
# <slug>

## Question

<The question.>

## Expected

No Human Trace.

## Why

<One sentence. Why a Trace here would be wrong.>

## Failure mode if it fires

<What a model would most likely produce here if it ignored the rule, and what that costs.>
```

## Coverage

15 cases in Phase 1, expanded to 50 in Phase 3 from real questions rather than invented ones. Categories to cover:

* Purely practical requests — file conversion, formatting, how-to
* Personal advice and subjective preference
* Current events and anything post-dating the historical record
* Arithmetic and mechanical computation
* Code debugging
* Questions where a Trace exists but is irrelevant to what was asked

That last category is the interesting one. "Who invented the light bulb" invites a Trace. "My light bulb keeps flickering, what's wrong" does not — even though the same history sits behind it.
