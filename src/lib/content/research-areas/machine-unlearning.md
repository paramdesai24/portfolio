---
title: "Machine Unlearning"
description: "Investigating algorithms that enable deep learning networks to selectively forget training samples on demand, complying with right-to-be-forgotten privacy mandates without full model retraining."
tags: ["Right-to-be-Forgotten", "Fisher Information", "Model Scrubbing", "Privacy"]
publicationCount: 2
projectCount: 1
---

The "right to be forgotten" under modern data privacy regulations (such as GDPR) introduces a challenging requirement for machine learning: the ability to completely scrub specific training samples from a trained model. Our research explores efficient algorithms for *Machine Unlearning*, avoiding the massive computational overhead of retraining neural networks from scratch.

### Active Investigations
- **Approximate Scrubbing**: Computing parameter adjustments using Hessian and Fisher Information matrices to erase specific image/text weights dynamically.
- **Verification Protocols**: Developing metrics (such as membership inference attack simulations and latent similarity comparisons) to prove target data has been successfully scrubbed.
- **Decentralized Erasure**: Devising unlearning protocols for federated learning frameworks operating on edge IoT clusters.
