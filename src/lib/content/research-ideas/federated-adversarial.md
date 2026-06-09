---
title: "Federated Learning in Adversarial Environments"
status: "On Radar"
problem: "Federated learning assumes benign participants. In adversarial settings (compromised edge devices, Byzantine nodes), model poisoning and inference attacks become viable. What defensive architectures survive real-world adversarial federated training?"
whyItMatters: "Real IoT deployments involve untrusted, resource-constrained nodes. Security cannot be bolted on after training."
directions: [
  "Byzantine-robust aggregation with explainability",
  "Differential privacy with adaptive noise calibration",
  "Anomaly detection within the federated protocol itself"
]
---

## Overview
Federated learning (FL) allows multiple edge clients to train a model cooperatively without sharing raw data. However, if some edge nodes are compromised (Byzantine nodes), they can inject poisoned gradients to degrade the global model or force backdoor behaviors. This research explores robust gradient aggregation methods that detect and isolate malicious updates without violating the privacy guarantees of FL.

### Key Focus Points
- **Robust Aggregation (FedMedian/Krum)**: Developing statistical aggregators that filter out gradient outliers while preserving normal update variations.
- **Differential Privacy Calibrations**: Injecting calculated noise to client updates to prevent inference attacks that seek to reconstruct training sets from gradients.
