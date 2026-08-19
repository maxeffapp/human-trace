# The Apollo Guidance Computer

## Question

How did the Apollo computer land on the Moon with less computing power than a pocket calculator?

## Answer

By being asked to do a narrow job extremely reliably, rather than a general job well.

The Apollo Guidance Computer ran at roughly 2 MHz with about 2,000 words of erasable memory and 36,000 words of fixed program storage. By any modern measure this is nothing. But it was not running an operating system, a user interface, a network stack or anything else general-purpose. It solved navigation and control equations for a vehicle whose physics were known in advance, and everything it did was specified before launch.

Three design decisions carried most of the weight.

It was priority-driven. Every task had a priority, and an executive program decided continuously what to run. If the processor was asked to do more than it could, it did not slow down or seize — it dropped the least important work and kept the critical work running.

It could restart without losing its place. Program state was checkpointed such that the computer could reboot mid-flight and resume the guidance task within a fraction of a second.

And it was one component in a system that included two trained pilots and a room full of engineers on the ground. The computer was never the only thing keeping the vehicle alive.

## Trace

The program that landed the module was not loaded into the computer; it was physically woven into it. Copper wire was threaded through or around tiny magnetic rings, one wire per bit, by textile workers in Massachusetts — many of them from the region's garment and shoe factories — whom the engineers referred to in documentation as "Little Old Ladies." When the computer began throwing overload alarms during the final descent, what saved the landing was the priority scheduler Margaret Hamilton's group had built so the machine would shed low-priority work instead of stopping. The software held because it had been designed on the assumption that something would go wrong.

## Story

Margaret Hamilton led the team at MIT's Instrumentation Laboratory that wrote the onboard flight software for Apollo, and later headed the laboratory's Software Engineering Division. The discipline barely existed; the phrase had to be argued for.

The software had to be committed to hardware months before flight, because of how the memory worked. Core rope memory stores a program physically: a wire threaded through a magnetic core reads as a one, a wire routed around it reads as a zero. There is no way to write to it electronically. A program becomes a woven object.

The weaving was done by women employed at Raytheon, many with backgrounds in New England's textile and shoe industries, work that demanded exact and sustained manual precision — threading fine copper wire through cores smaller than a grain of rice, tens of thousands of times, with no tolerance for a single error. In laboratory documentation they were sometimes called LOLs, for Little Old Ladies. The people supervising the process were called rope mothers. Hamilton was one.

On 20 July 1969, during the final minutes of the lunar descent, the computer began signalling 1201 and 1202 alarms. It was being asked to do more than it could: a radar left in the wrong configuration was stealing processor cycles it had not been budgeted.

An earlier generation of software design would have hung or crashed. This one shed the low-priority tasks, restarted, and kept the guidance and landing computations running. In Mission Control a young engineer, Jack Garman, had written out what each alarm code meant and knew this one was survivable. The landing continued.

The story is usually told as a piece of luck or of individual brilliance. It was neither. The behaviour that saved the landing was a deliberate architectural decision, made years earlier, that the machine should degrade rather than fail — and the program that executed it existed because a room of women had threaded it into wire, correctly, by hand.

## Deep Story

**The naming.** "Little Old Ladies" was in the engineers' documentation, not a later joke about it. It is a precise record of how the most error-intolerant manufacturing task in the programme was regarded by the people who depended on it.

**Not only Raytheon.** The Apollo effort's electronics also drew on assembly work at Fairchild's plant in Shiprock, New Mexico, staffed largely by Navajo women. That labour is even less visible in the standard account than the rope weavers'.

**What Hamilton actually argued for.** The priority-driven executive and restart protection were not universally welcomed; error handling of that kind was regarded in places as excess engineering for a mission that would be flown by people who did not make mistakes. The alarm sequence during the descent is the strongest single argument in the history of the field for building the failure case first.

**Why "less power than a calculator" is a poor comparison.** The AGC's constraint was memory and cycles, not capability. Given a bounded problem, exactly specified, with fixed physics and trained operators, the machine was adequate. Modern computers are not more capable in the sense that matters here; they are asked to do vastly more open-ended things.

## Sources

* [The "Rope Mother": Margaret Hamilton](https://airandspace.si.edu/stories/editorial/rope-mother-margaret-hamilton) — Smithsonian National Air and Space Museum. Hamilton leading the Apollo flight software effort and heading the Software Engineering Division; core rope memory woven by hand; "rope mothers"; the engineers' use of "LOLs" for the women who wove the memory.
* [Core memory weavers and Navajo women made the Apollo missions possible](https://www.sciencenews.org/article/core-memory-weavers-navajo-apollo-raytheon-computer-nasa) — Science News. The Raytheon weavers and their textile-industry backgrounds; the Fairchild plant at Shiprock.
* [Software woven into wire: Core rope and the Apollo Guidance Computer](http://www.righto.com/2019/07/software-woven-into-wire-core-rope-and.html) — Ken Shirriff. How core rope memory encodes bits physically; AGC memory sizes. Technical blog by a specialist rather than an institutional source — flagged accordingly.

## Notes

**Category:** collective work

**What this tests:** whether the layer can hold two subjects at once without dropping either. Margaret Hamilton is now well known, and a Trace naming only her would be accurate, safe and incomplete. The women who wove the memory are the larger group and the less visible one, and the Trace has to reach both in four sentences.

It also tests the "unnamed contributions" category from the project's own principles — the point at which the honest thing is to describe a workforce rather than find a person.

**Disputed claims:** the quantity of fuel remaining at touchdown is reported inconsistently across sources and is omitted rather than picked. The cause of the alarms is given in general terms — a radar consuming unbudgeted processor cycles — rather than as a specific switch position, which varies between accounts.
