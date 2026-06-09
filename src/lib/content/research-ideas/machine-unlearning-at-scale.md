---
title: "Machine Unlearning at Scale"
status: "Active Interest"
problem: "Existing machine unlearning algorithms work well on small models and controlled datasets. How do we achieve efficient, verifiable unlearning in large language models and multi-modal systems deployed in production?"
whyItMatters: "Regulatory frameworks like GDPR's right-to-be-forgotten require practical unlearning. Without scalable methods, AI compliance is theoretical."
directions: [
  "Approximate unlearning using influence functions on transformer architectures",
  "Unlearning verification protocols using membership inference attacks",
  "Dataset distillation as a pre-emptive privacy strategy"
]
---

## Overview
Machine unlearning has matured for shallow networks and small datasets, but scaling these methods to Large Language Models (LLMs) and multi-modal neural networks remains an unsolved challenge. Retraining models with billions of parameters is computationally prohibitive, making parameter scrubbing or weight update heuristics necessary. We need unlearning protocols that operate under tight latencies while guaranteeing that targeted data has been successfully purged.

### Key Focus Points
- **Parameter Sensitivity**: Finding which layers in transformer blocks (attention heads, MLP blocks) retain training memories and targeting them for scrubbing.
- **Verification Integrity**: Testing unlearned LLMs against membership inference attacks to guarantee that the unlearned facts cannot be extracted through adversarial prompts.
