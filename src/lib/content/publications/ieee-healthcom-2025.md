---
title: "Quantum-Based Edge Intelligence Framework for IoT Healthcare Systems"
shortDescription: "Securing edge-computed health telemetry streams using quantum keys and anomaly detection."
venue: "IEEE HealthCom 2025"
year: 2025
researchAreas: ["Quantum Security", "Intelligent Systems", "IoT"]
status: "published"
pdfUrl: "https://ieeexplore.ieee.org/document/11342726/"
relatedProjects: ["petbot"]
order: 4
abstract: "Presents a quantum-assisted edge computing framework for real-time anomaly detection and secure data processing in IoT-enabled healthcare environments."
---

## Problem
Wearable IoT medical devices transmit sensitive patient vitals (such as ECG, heart rate, and oxygen levels) continuously. Transmitting this raw telemetry to central cloud servers creates severe privacy risks and network congestion. While processing this data at edge gateways solves congestion, edge gateways are vulnerable to physical tampering and wireless injection attacks. Protecting patient health data requires securing edge-to-cloud streams using quantum-safe cryptography while maintaining real-time anomaly detection.

## Key Contributions
1. A decentralized edge computing architecture with integrated lightweight anomaly classifiers.
2. Deployment of a CV-QKD secure key distribution scheme for edge node telemetry encryption.
3. Demonstration of low-power execution on simulated edge processor constraints.

## Methodology
Our proposed architecture employs a dual-tier security and intelligence pipeline. At the edge layer (wearable sensors connected to a local gateway), a lightweight machine learning classifier (an isolation forest model) monitors vital data streams to detect immediate anomalies (e.g., cardiac arrythmias) locally. Concurrently, a quantum channel establishes secure keys between the gateway and the main hospital server using CV-QKD. Telemetry packages containing vitals and anomaly scores are encrypted and transmitted securely. We evaluated the power consumption and latency of this architecture on ARM-Cortex edge platforms.

## Results
Experimental outcomes demonstrate a 94.2% accuracy in detecting heart rate anomalies locally on the gateway. The quantum key generation rate sustains 2.4 kbps, which is sufficient for continuous health telemetry encryption. Gateway power consumption increases by only 4.8%, confirming feasibility for battery-powered medical edge hubs.

## Implications
Decentralizing anomaly detection while wrapping data streams in quantum-safe encryption ensures patient data remains private and protected against eavesdroppers. This framework showcases that quantum keys can protect healthcare networks without requiring desktop-level computation budgets.
