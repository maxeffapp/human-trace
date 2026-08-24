# python-indentation-error

## Question

My Python script is throwing IndentationError: unexpected indent. What does that mean?

## Expected

No Human Trace.

## Why

Debugging is a state of attention that a digression breaks. The user is looking for the line number.

## Failure mode if it fires

A note on why Python uses significant whitespace, or on the ENIAC programmers inventing debugging. The second is a real Trace in this set and would be an intrusion here.

## Category

debugging

## Observed failure

**24 August 2026, `gemini-3.6-flash`. The layer fired.** Recorded here as a regression case.

It produced two contributors — Guido van Rossum and the ABC Language Team at CWI — sourced to python.org's design FAQ, van Rossum's own history writing, and a python.org essay.

Every part of that is good except the part that matters. The claims are accurate, the sources are primary, a collective is named alongside the individual, and the acknowledgement is restrained. The generation passed. The *decision* failed.

That distinction is the finding. The fix belongs in the stage that decides whether to speak, not in the stage that writes. A layer that writes well and chooses badly is worse than one that writes plainly and stays quiet, because good prose makes a misplaced trace harder to dismiss.
