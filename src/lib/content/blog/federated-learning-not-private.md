---
title: "Federated learning is not privacy-preserving by default"
category: "Research"
description: "Gradient inversion attacks can reconstruct training data from intercepted gradient updates. Federated learning solves the data-sharing problem. It does not solve the gradient privacy problem. FIDES addresses this gap."
targetAudience: "ML engineers, privacy researchers, security-aware ML practitioners"
readingTime: "10 min"
themes:
  - "quantum-cryptography"
  - "machine-unlearning"
relatedPapers:
  - "fides-federated-finance-2026"
featured: false
publishedDate: 2026-02-01
status: "published"
---

Federated learning is commonly described as a privacy-preserving machine learning technique. The description is accurate at a high level and misleading at the level of implementation.

This article explains the specific point at which federated learning's privacy guarantee breaks, and why addressing that point is the architectural core of FIDES.

## The federated learning architecture and its promise

Standard federated learning (the FedAvg algorithm) works as follows:

1. A central aggregator holds a global model with parameters θ.
2. The aggregator distributes θ to N client institutions.
3. Each client i trains a local model on its private dataset D_i for k rounds, producing updated parameters θ_i.
4. Each client sends only θ_i (or the gradient Δθ_i = θ_i − θ) to the aggregator. The raw training data D_i never leaves the client.
5. The aggregator averages the updates to produce a new global model θ' and repeats.

The privacy claim: because raw data is never transmitted, the central aggregator (and any observer of the communication channel) cannot access D_i.

This claim is correct for the data transmission step. It is not correct for the gradient transmission step.

## The gradient inversion attack

In 2019, Zhu et al. demonstrated that private training data could be reconstructed from gradient updates with high fidelity. The attack works as follows:

Given an intercepted gradient update Δθ_i, an attacker initializes dummy data x' and dummy labels y', computes the gradient that x' and y' would produce under the model, and optimizes x' and y' to minimize the distance between their gradient and the intercepted gradient Δθ_i. Under sufficiently many optimization steps, x' converges to a close approximation of the client's actual training data.

The attack is not theoretical. It reconstructs recognizable training images from intercepted gradients for image classification models. For tabular data (the domain relevant to FIDES's financial fraud detection application), the reconstruction is even more effective because the feature space is lower-dimensional.

The implication: an adversary who intercepts the gradient transmission between a client institution and the central aggregator can reconstruct samples from that institution's private training data, without ever seeing the raw data directly.

Federated learning, without additional protections on the gradient channel, is private against an honest aggregator but not against an attacker who has access to the communication channel.

## Why this matters specifically for financial fraud detection

The FIDES application is fraud detection across multiple financial institutions. The training data contains labeled transaction records — which are highly sensitive not just for privacy reasons (customer financial data) but for competitive reasons (fraud patterns are proprietary intelligence).

An institution's fraud patterns reveal which transaction types it is most exposed to, which customer segments are most targeted, and which fraud typologies it has identified. This information has direct competitive and operational value. A competitor who could reconstruct another institution's training data from intercepted gradients would have access to that institution's fraud intelligence without consent.

This is not a hypothetical threat. Financial data is a high-value target. Communication channels between client institutions and central aggregators are an attack surface that motivated adversaries would specifically target.

The standard federated learning architecture does not protect this attack surface. Gradient updates are transmitted in plaintext, or at best with standard transport-layer encryption (TLS), which provides confidentiality against passive eavesdropping but not against an attacker who has compromised the communication infrastructure.

## The three approaches to gradient privacy

Three mechanisms are in current use for protecting gradient privacy in federated learning. Each has limitations.

**Differential Privacy (DP-SGD):** Add calibrated Gaussian noise to gradient updates before transmission. The noise makes reconstruction harder because the observed gradient is the true gradient plus noise. The limitation: DP-SGD degrades model performance. The privacy-utility tradeoff is steep for the non-IID data distributions typical of real federated deployments (different institutions having different fraud rates and demographic compositions). For a fraud detection model, accuracy degradation translates directly to increased fraud losses.

**Secure Aggregation:** Use cryptographic protocols (homomorphic encryption, garbled circuits, or secret sharing) to ensure the aggregator computes the sum of gradients without seeing individual updates. The limitation: these protocols protect against an honest-but-curious aggregator. They do not protect against an attacker who intercepts the channel before the aggregator receives the gradient.

**Trusted Execution Environments (TEEs):** Execute gradient aggregation inside hardware-secured enclaves (Intel SGX, ARM TrustZone). The limitation: TEEs protect the aggregation computation, not the transmission channel. An intercepted gradient is still intercepted before it reaches the TEE.

## CV-QKD as gradient channel security

FIDES's approach is different: secure the transmission channel itself with quantum key distribution.

CV-QKD (Continuous Variable QKD) establishes encryption keys whose secrecy is guaranteed by quantum mechanics rather than computational hardness assumptions. Any eavesdropping attempt disturbs the quantum state used to generate the key, making eavesdropping detectable. The resulting key is then used to encrypt gradient updates before transmission.

The security guarantee changes from "this key is hard to break computationally" to "any attempt to break this key is physically detectable." This is a qualitatively different and stronger guarantee.

The choice of CV-QKD over BB84 (single-photon QKD) in FIDES is specific to the deployment context: gradient updates are large (potentially millions of parameters) and are transmitted in batches rather than continuously. CV-QKD achieves higher key generation rates over standard telecom fiber infrastructure, which is important for the throughput required to encrypt full gradient batches in a reasonable time window. The non-real-time nature of federated learning rounds (which typically run over hours or days, not milliseconds) means CV-QKD's higher per-batch latency is acceptable in a way it is not for the V2X application in ICSC'25.

## What FIDES is and isn't

FIDES combines QKD-secured gradient transmission with FedDyn (an improved federated aggregation algorithm for non-IID data) and the three-strategy unlearning framework from Q-PhishNet.

The privacy claim for FIDES is more precise than the standard FL claim: gradient updates are encrypted under keys that are information-theoretically secure, meaning an adversary with unlimited computational power cannot reconstruct training data from intercepted transmissions. This is a stronger guarantee than computational security and doesn't degrade with future cryptanalytic advances.

What FIDES does not claim: perfect privacy for all components of the system. The model's internal representations may still be susceptible to model inversion attacks after deployment. The aggregator's gradient computation may still be auditable through membership inference attacks. The unlearning module addresses the model memory problem but the verification gap applies here too.

The architecture is a meaningful advance over standard FL. It closes the gradient channel attack surface. It does not solve every privacy problem in federated learning.

## The broader lesson

Federated learning's privacy claim was never that it solves privacy. It was that it avoids data centralization — which is a necessary condition for some forms of privacy but not a sufficient condition for privacy as a guarantee.

Treating "no raw data sharing" as equivalent to "private" caused a generation of FL papers to evaluate their systems without modeling the gradient inversion attack. The attack was known by 2019. It did not enter standard FL evaluation practice for several years.

This is a recurring pattern in applied security: the threat model in use is often narrower than the actual attack surface. Building systems that are private against one class of attack while being vulnerable to another class is not an unusual finding — it is the normal state of a security system in a threat environment that is actively researched.

The response is not "federated learning is broken." It is "federated learning needs additional components to close the attack surface the original architecture left open." FIDES is one specific answer to that problem. It will not be the last.

---

*The technical details of FIDES are in the CITS'26 publication. The FedDyn vs. FedAvg question is covered in a companion explainer.*
