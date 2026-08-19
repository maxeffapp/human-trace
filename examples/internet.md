# The Internet

## Question

Who invented the internet?

## Answer

Nobody, in the sense the question expects. The internet is a stack of separate inventions made by different people over about twenty-five years, and no single one of them is the thing.

The foundational idea is packet switching. Instead of opening a dedicated line between two parties for the duration of a conversation, a message is chopped into small units, each of which is addressed and released into the network to find its own route, with reassembly at the destination. This makes the network robust — there is no single path to sever — and efficient, because links carry traffic from many conversations at once.

ARPANET, funded by the US Defense Department's research agency, put this into practice from 1969 and demonstrated that it worked at scale.

The internet proper is a later and different idea: not one network but a way of connecting incompatible networks to each other. That required a common protocol, and the design published by Vint Cerf and Robert Kahn in 1974, which became TCP/IP, is what supplies it. The word *internet* refers to that interconnection.

The web — sites, links, browsers — is later still, and is one application running on top of all of it.

## Trace

The founding idea was worked out twice, independently, on two continents. Paul Baran arrived at it at the RAND Corporation in the early 1960s while thinking about a military communications system that could survive having pieces of it destroyed; Donald Davies arrived at it a few years later at Britain's National Physical Laboratory while thinking about businesses that needed to exchange data cheaply. Davies supplied the word *packet*, and the ARPANET design took elements from both men. Neither is the name people offer when asked who invented the internet.

## Story

Paul Baran's problem, at RAND in the early 1960s, was survivability. The American communications network was centralised, and a centralised network has points whose destruction disconnects everything downstream. Baran's answer was to abandon the centre: build a mesh of nodes with many paths between any two points, break messages into standard units he called message blocks, and let each unit route itself through whatever path was intact. The network would degrade rather than fail.

The proposal was published as a RAND report and went nowhere for years. AT&T, whose engineers were asked to evaluate it, did not think it would work.

Donald Davies, at the National Physical Laboratory outside London, came at the same structure from a completely different direction a few years later. His concern was not attack but waste: interactive computing produces short bursts of traffic separated by long silences, and dedicating a circuit to that pattern squanders the line. Chop the traffic into small units, interleave them, and one link can serve many users. He called the units *packets*, and the term stuck.

Davies built a working network at NPL. Baran's report reached the people designing ARPANET. The eventual design drew on both, and neither man had built what the other had — Baran had the redundancy argument and the fault tolerance, Davies had the performance argument and the practical demonstration.

The first ARPANET message was sent between UCLA and the Stanford Research Institute on 29 October 1969.

What is worth noticing is how the credit settled afterwards. The names attached to the internet in public are usually Cerf and Kahn, for TCP/IP, and sometimes Berners-Lee, for something else entirely. Baran and Davies had the idea the whole structure rests on, independently, and are rarely named at all.

## Deep Story

**Simultaneous invention is normal.** Two people reaching the same design within a few years of each other, from unrelated motivations, in different countries, without contact, is not a coincidence requiring explanation. It is what happens when a set of enabling conditions arrives — here, cheap digital logic and the economics of interactive computing — and it is one of the strongest arguments against organising technological history around individuals.

**What ARPANET was and was not.** ARPANET was funded by a defence research agency, which has produced a durable myth that it was built to survive nuclear war. Baran's *motivation* was survivability; ARPANET's purpose was resource sharing among research institutions. The two get collapsed constantly.

**The layer that matters most is the least visible.** TCP/IP's achievement is that it makes the network indifferent to what runs on it. That design decision — a stupid network and intelligent endpoints — is why the web, video, telephony and everything since could be added without permission from anyone.

## Sources

* [From ARPANET to the Internet](https://www.sciencemuseum.org.uk/objects-and-stories/arpanet-internet) — Science Museum, London. Baran at RAND working on a survivable military network with message blocks; Davies at NPL proposing a network for business data exchange and coining *packet switching*; the ARPANET design revised to incorporate elements from both.
* [Paul Baran](https://www.britannica.com/biography/Paul-Baran) — Britannica. Baran's distributed-network proposal and its reception.
* [Packet Switching](https://ethw.org/Packet_Switching) — Engineering and Technology History Wiki, IEEE. Independent development by Baran and Davies.
* [ARPANET](https://ethw.org/ARPANET) — Engineering and Technology History Wiki, IEEE. The first message between UCLA and SRI, 29 October 1969.

## Notes

**Category:** collective work / engineering

**What this tests:** a subject where the honest answer to the user's question is that the question is wrong, and the Trace has to make that interesting rather than pedantic. There is no inventor to name, so the story is about the shape of the invention itself — two people, two continents, two unrelated motivations, one design.

It also tests restraint about the famous names. Cerf, Kahn and Berners-Lee all belong in the answer; none of them belongs in this Trace.

**Disputed claims:** none marked. The frequently repeated claim that ARPANET was built to survive nuclear war is addressed in the Deep Story as a conflation rather than repeated. The widely told story of the first message failing partway through the word "LOGIN" is omitted, because it could not be confirmed against a primary or institutional source during fact-checking.
