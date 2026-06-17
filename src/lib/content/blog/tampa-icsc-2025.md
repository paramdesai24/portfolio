---
title: "What happened when I presented at IEEE ICSC in Tampa"
category: "Narrative"
description: "I went to Tampa expecting to defend my paper. The questions I received weren't about the paper. They were about deployment — and that gap changed how I evaluate my own work."
targetAudience: "Graduate admissions committees, professors, aspiring researchers"
readingTime: "10 min"
themes:
  - "explainable-ai-security"
  - "quantum-cryptography"
relatedPapers:
  - "quantum-assisted-fdi-detection-2025"
  - "q-shield-vtc-2025"
featured: true
publishedDate: 2025-06-20
status: "published"
---

I flew to Tampa, Florida in June 2025 to present at IEEE ICSC — the International Conference on Smart Computing. The paper was about detecting False Data Injection attacks in autonomous vehicle networks using a 1D-CNN with LIME explanations, secured over a CV-QKD channel.

The results were solid: 99.4% detection accuracy, 87,000 bits/sec QKD throughput, QBER of 0.031. The paper had passed peer review. I had rehearsed the presentation.

The Q&A after the presentation was not about any of those numbers.

## What I expected

I expected questions about the model architecture. About why 1D-CNN over XGBoost. About the dataset. About whether the accuracy numbers would hold on a different dataset. These are the kinds of questions you prepare for because they are the kinds of questions reviewers ask.

The session room was large. There were engineers in the audience from industry — system integrators, practitioners who build communication hardware for real vehicle networks. That was the part I had not fully prepared for.

## The first question

"What is the round-trip time for QKD key exchange in a V2X scenario — not in simulation, but on hardware?"

I had a simulation answer. Not a hardware answer.

The question came from an engineer who had actually deployed communication hardware in vehicle networks. He knew the numbers. He was asking me mine.

The honest answer I gave was: "Our results are from simulation, validated against established protocol parameters. We don't have hardware characterization." That answer was true. It was also clearly insufficient for the room.

What I understood afterward was that the gap between "simulation round-trip time" and "hardware round-trip time" is not small and not theoretical. Hardware has photon source jitter. Fiber connections have reflections. Detection hardware has latency that simulators do not model by default. The 20–25ms overhead we reported for CV-QKD is a simulation floor, not a hardware ceiling.

## The second question

"Which hardware platform were the QKD simulations validated against?"

We had validated against published protocol parameters from the QKD literature — which is standard practice for simulation papers and is described as such in the methodology section. We had not validated against a specific commercial hardware platform like the ID Quantique or Toshiba QKD systems.

The question was fair. Simulation validated against hardware parameters is more credible than pure theoretical simulation, but it is still simulation. A deployment engineer who needs to know whether QKD will fit into their vehicle network budget needs hardware numbers, not simulation floors.

I said what I could honestly say. The follow-up question from the same person — "Have you been in contact with any hardware vendors about validation?" — was one I could not answer.

## The third question

"What is your graceful degradation strategy when QBER exceeds threshold?"

QBER — Quantum Bit Error Rate — is the fraction of transmitted bits that are received incorrectly. When QBER exceeds approximately 11%, the channel is assumed to be under eavesdropping and the key exchange is aborted.

In a vehicle network, channel conditions change constantly. Weather, interference, and distance changes between vehicles can all degrade QBER. A vehicle network that simply aborts key exchange when QBER degrades is not deployable — because QBER will degrade, and the vehicle cannot stop operating when it does.

We had not designed a graceful degradation strategy. The paper treated QBER as a security metric — which it is — but not as a failure mode to be managed with a recovery protocol. The question exposed a design gap in the system architecture that peer review had not surfaced because peer reviewers are typically researchers, not deployment engineers.

## What I said and what I should have said

I said: "Graceful degradation to a classical encryption backup during QKD unavailability is an important operational consideration that we've identified as a direction for future work."

That was the right answer strategically — honest, forward-looking, not defensive. But what I wished I had been able to say was something with actual design content: "We've considered two approaches: pre-generated key caching with a classical backup channel activated when QBER exceeds threshold, or an adaptive QKD schedule that reduces key generation frequency during high-QBER conditions and falls back to cached keys." I had thought about this afterward, not before the talk.

## What Tampa changed

The change is not "I learned that simulation papers have limitations." I knew that before Tampa.

The change is more specific: I now evaluate my own work by asking a question I call "the deployment engineer's question" — what would a person who has to actually build this system need to know that this paper doesn't tell them?

For the FDI detection paper: the hardware QBER numbers, the graceful degradation strategy, the failure mode behavior when QKD is unavailable.

For the HealthCom'25 paper: how the WBAN edge inference latency was measured (simulation or hardware), what the power consumption profile looks like, what happens when the edge node's battery is low.

For the FIDES paper: what the gradient update batch size is, how the CV-QKD key generation rate scales with the number of federated nodes, what the system does when one node's QKD channel fails during a training round.

These are not criticisms of simulation papers. Simulation papers are how you prove a concept before you invest in hardware. But they require a specific kind of intellectual honesty about what they prove and what they leave open — and that honesty is more effective when it is explicit in the paper rather than discoverable only in a Q&A.

The FIDES paper, written after Tampa, has an explicit section identifying its deployment assumptions and the validation work required before the system is production-ready. That section came directly from what I learned in that room.

## Why I'm writing this down

Graduate school applications ask about research experience. The expected answer is a paper list and a metric summary.

Tampa is a different kind of evidence. Presenting at a conference in person, receiving expert critique in real time, updating your thinking in response — that is the research process. The paper is the artifact. The Q&A is the research.

I went to Tampa as a co-author who had built a solid simulation system. I came back as a researcher who understood the difference between a result that is correct and a result that is deployable. That distinction matters more than any specific accuracy number.

---

*The ICSC'25 publication covers the technical content of the paper itself. This article is the story around the presentation.*
