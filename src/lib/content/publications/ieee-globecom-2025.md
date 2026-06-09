---
title: "Quantum-Secured Explainable Machine Unlearning for Phishing Detection in IoT"
shortDescription: "Securing IoT data unlearning pipelines using quantum cryptographic hashes and explainability audits."
venue: "IEEE GLOBECOM 2025"
year: 2025
researchAreas: ["Machine Unlearning", "Cybersecurity", "XAI"]
status: "accepted"
relatedProjects: ["petbot"]
order: 5
abstract: "Proposes a quantum-secured machine unlearning framework that enables IoT devices to selectively forget phishing-related training data while maintaining detection accuracy, using explainability techniques to audit the unlearning process."
---

## Problem
In Internet of Things (IoT) ecosystems, data privacy regulations (such as GDPR's \"right to be forgotten\") require that user data be completely removable from trained models upon request. This process, known as *Machine Unlearning*, is highly challenging for resource-constrained IoT devices. Standard unlearning methods are computationally heavy, and verifying that the target data has been successfully \"forgotten\" without destroying model classification accuracy is an unsolved audit challenge. Furthermore, the unlearning protocol itself is vulnerable to adversarial poisoning attacks in transit.

## Key Contributions
1. A lightweight, approximate machine unlearning framework suitable for edge-device constraints.
2. Integration of quantum-secured cryptographic hashing (using CV-QKD primitives) to protect unlearning updates.
3. An explainability-driven audit protocol utilizing SHAP values to verify the unlearning process.

## Methodology
The proposed framework coordinates a decentralized training schema. When an edge node requests unlearning, the central model computes parameter updates using a localized Fisher Information adjustment, bypassing the need to retrain the network from scratch. To secure this exchange against quantum-level eavesdroppers, updates are encrypted via continuous-variable quantum key distribution (CV-QKD) hashes. Finally, we compare SHAP (SHapley Additive exPlanations) attribution vectors before and after the unlearning operation, verifying that features associated with the unlearned dataset no longer impact classification decisions.

## Results
Evaluation on standard phishing detection datasets demonstrates that our unlearning protocol can purge target records within 120 milliseconds—representing a 92% reduction in latency compared to full retraining. Post-unlearning classification accuracy remains within 0.8% of the original model, while unlearning verification yields a 99.1% audit confidence score.

## Implications
By establishing verifiable unlearning protocols, IoT networks can comply with strict privacy laws dynamically. Incorporating quantum-secured signatures guarantees that malicious actors cannot spoof unlearning requests to degrade network models.
