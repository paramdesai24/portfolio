---
title: "Explainable AI and Quantum Security for Smart Homes Network Attack Classification"
shortDescription: "Securing smart home network gateways and explaining attack classification signatures."
venue: "Springer CML 2025"
year: 2025
researchAreas: ["XAI", "Quantum Security", "Cybersecurity"]
status: "published"
pdfUrl: "https://link.springer.com/chapter/10.1007/978-981-95-2878-3_23"
relatedProjects: ["petbot"]
order: 1
abstract: "Combines explainable AI techniques with quantum cryptographic primitives for classifying and interpreting network attacks in smart home IoT environments."
---

## Problem
Smart home IoT setups connect a highly heterogeneous mix of devices (smart TVs, locks, thermostats), many of which have weak default security settings and are susceptible to botnet hijackings. Intrusion Detection Systems (IDS) can flag these attacks, but smart home hubs need explainable output so users or service providers understand *why* a device was flagged. Moreover, as network telemetry is sensitive, the communication links protecting these hubs must be secure against advanced eavesdropping.

## Key Contributions
1. A multi-class attack classifier optimized for IoT smart home traffic datasets.
2. Integration of SHAP attribution maps to provide explanations of flagged network anomalies.
3. Securing gateway communication links using quantum cryptographic key agreements.

## Methodology
The framework deploys a local IDS agent on the smart home gateway router. The IDS utilizes a Gradient Boosting decision tree classifier to analyze packet characteristics (packet lengths, inter-arrival times, protocol types) and identify attack vectors (such as DDoS, scanning, or brute force). When a packet is classified as anomalous, a SHAP interpreter generates local explanations, identifying which feature (e.g., abnormally high transmission rates) triggered the flag. Communication channels are encrypted using keys generated via CV-QKD algorithms.

## Results
Intrusion classification testing shows a 96.7% multi-class F1-score across smart home traffic benchmark databases. The SHAP interpreter isolates the anomalous feature set within 8.5 milliseconds, enabling real-time notifications on hub screens. The quantum cryptography layer operates with zero packet drops under standard network traffic loads.

## Implications
Combining explainable AI with quantum-secured links provides smart home networks with both high transparency and mathematical security. Users can audit false positives easily, and smart gateways are secured against future decrypt-now-decrypt-later attacks.
