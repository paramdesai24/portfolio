---
title: "FIDES: Federated Intelligence and Detection with Quantum Security for Financial Institutions"
shortDescription: "Quantum-secured federated deep learning framework for multi-institution financial fraud detection with CV-QKD gradient encryption and FedDyn aggregation"
venue: "CITS 2026"
year: 2026
status: "accepted"
researchAreas: ["Federated Learning", "Quantum Security", "Financial AI"]
order: 7
abstract: "FIDES addresses increasingly sophisticated financial fraud using Federated Deep Learning with CV-QKD-secured gradient transmission across non-IID client data. FedDyn aggregation achieves 97.74% accuracy with >250,000 bits/sec key rate and >98% secure key ratio, providing information-theoretically strong privacy guarantees for inter-institution model training."
---

## Problem

Federated learning is widely marketed as privacy-preserving because raw transaction data never leaves client institutions. However, this framing contains a critical blind spot: gradient inversion attacks can reconstruct private training inputs with high fidelity from intercepted gradient updates, without ever accessing raw data. For financial institutions sharing fraud detection models, intercepted gradients can expose proprietary fraud patterns, transaction typologies, and customer data — intelligence with direct competitive and operational value. Standard federated architectures transmit gradients in plaintext or with TLS, which provides confidentiality against passive eavesdropping but not against a motivated adversary who has compromised the communication infrastructure.

## Key Contributions

1. A federated fraud detection framework (FIDES) securing gradient transmission with CV-QKD, replacing computational security assumptions with physical-law guarantees.
2. Systematic comparison of FL aggregation algorithms (FedAvg, FedAdagrad, FedAMP, FedDyn) under realistic non-IID financial data distributions.
3. A consent-driven machine unlearning module (KL-Adversarial, Fisher Regularization, Reverse Distillation) allowing institutions to remove revoked data without full retraining.
4. Evaluation against gradient inversion attacks, confirming that QKD-encrypted updates cannot be reconstructed even under unlimited computational adversaries.

## Methodology

FIDES is a three-layer federated architecture. At the client layer, each financial institution trains on its local transaction dataset and computes gradient updates. Before transmission, gradient batches are encrypted using CV-QKD key material — keys whose secrecy is guaranteed by quantum mechanics rather than computational hardness. At the aggregation layer, FedDyn (Federated Dynamic Regularization) addresses the non-IID challenge inherent in real federated deployments: different institutions have different fraud rates, customer demographics, and transaction typologies. FedDyn adds a client-specific regularization term that prevents local models from drifting too far from the global model during local training — a problem FedAvg handles poorly under non-IID distributions. The unlearning module uses the three-strategy framework from Q-PhishNet: KL-Adversarial disrupts the output distribution on revoked samples, Fisher Regularization targets parameters with high sensitivity to those samples, and Reverse Distillation aligns the model's internal representations with a teacher trained without the revoked data.

## Results

FedDyn significantly outperforms the baseline algorithms under non-IID data: **97.74% detection accuracy**, compared to FedAvg's lower performance under distribution shift. The CV-QKD channel achieves a **secure key ratio exceeding 98%** and **key rates above 250,000 bits/second** — sufficient to encrypt full gradient batches within federated round timelines. t-SNE visualization confirms strong class separation, and ROC analysis validates robust generalization across client distributions. The unlearning module achieves near-chance accuracy on revoked training samples while retaining model performance on retained data.

## Implications

FIDES demonstrates that quantum key distribution is practically applicable to federated learning at the gradient batch scale. The non-real-time nature of federated rounds (typically hours to days) makes CV-QKD's per-batch latency acceptable in a way it would not be for real-time V2X applications. The security guarantee shifts from "this encryption is computationally hard to break today" to "any eavesdropping attempt on this channel is physically detectable" — a qualitative strengthening of the federated learning privacy claim. The deployment assumptions and validation requirements identified post-Tampa are explicitly documented: hardware QKD latency characterization, graceful degradation when a client's QKD channel fails mid-round, and scalability under large federated node counts remain open validation work.
