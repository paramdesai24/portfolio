---
title: "Q-PhishNet: Quantum-Secured Explainable Machine Unlearning for Phishing Detection in IoT Networks"
shortDescription: "A phishing-detection framework combining deep learning, LIME-based explainability, three machine-unlearning techniques, and BBM92 quantum key distribution for IoT networks."
venue: "2025 IEEE Globecom Workshops (GC Wkshps)"
year: 2025
researchAreas: ["Machine Unlearning", "Cybersecurity", "XAI"]
status: "Published"
pdfUrl: "https://ieeexplore.ieee.org/document/11590920"
doi: "10.1109/GCWkshps68340.2025.11590920"
location: "Taipei, Taiwan"
publisher: "IEEE"
dateAdded: "July 7, 2026"
relatedProjects: ["petbot"]
order: 1
abstract: "Q-PhishNet is a phishing-detection framework for IoT networks that combines deep learning, explainable AI, machine unlearning, and quantum cryptography. It uses deep learning for phishing URL classification and LIME for interpreting predictions. To support data revocation and counter poisoned data, it integrates three machine-unlearning techniques: KL Adversarial Unlearning, Fisher Regularization, and Reverse Distillation. The BBM92 quantum key distribution protocol secures data transmission during the unlearning process."
---

## Problem

In Internet of Things (IoT) ecosystems, data privacy regulations (such as GDPR's "right to be forgotten") require that user data be completely removable from trained models upon request. This process, known as *Machine Unlearning*, is highly challenging for resource-constrained IoT devices. Standard unlearning methods are computationally intensive, and verifying that target data has been successfully removed without destroying model classification accuracy is non-trivial. Furthermore, the unlearning protocol itself is vulnerable to adversarial data poisoning attacks, and the confidentiality of the unlearning communication must be protected against eavesdropping.

## Key Contributions

1. Deep-learning-based phishing URL classification suited to IoT network environments.
2. LIME (Local Interpretable Model-agnostic Explanations) integration for interpreting individual model predictions.
3. Three complementary machine-unlearning techniques to enable data influence removal without full model retraining:
   - **KL Adversarial Unlearning**: disrupts the model's output distribution on revoked samples.
   - **Fisher Regularization**: identifies and adjusts parameters sensitive to the revoked data.
   - **Reverse Distillation**: aligns the model's internal representations with those of a teacher trained without the revoked data.
4. **BBM92 Quantum Key Distribution** to secure data transmission during the unlearning process, providing information-theoretically strong communication security.

## Methodology

Q-PhishNet addresses phishing URL detection in IoT networks through a multi-stage pipeline. A deep learning model is first trained to classify phishing URLs. LIME is applied to produce local, human-interpretable explanations for individual model predictions, making the system auditable. When a data revocation request is received, the framework applies the three machine-unlearning strategies in combination, targeting the influence of the specified training samples without requiring a full model retraining. The unlearning communication is secured using the BBM92 quantum key distribution protocol, which provides security guarantees grounded in the laws of quantum mechanics rather than computational hardness assumptions.

## Implications

By combining explainability with verifiable machine unlearning and quantum-secured communication, Q-PhishNet enables IoT networks to comply with data privacy requirements dynamically. LIME-based interpretation supports auditability of the classification process, while BBM92 QKD ensures that unlearning requests and associated data transmissions cannot be intercepted or spoofed by adversarial actors.
