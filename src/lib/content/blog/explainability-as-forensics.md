---
title: "Why I started treating explainability as a forensic tool, not a UI"
category: "Research"
description: "The shift between using LIME to explain a prediction to a user and using LIME to identify which training samples were adversarially poisoned is a genuine reframing of what explainability is for."
targetAudience: "XAI researchers, ML practitioners, CS grad students"
readingTime: "9 min"
themes:
  - "explainable-ai-security"
  - "machine-unlearning"
relatedPapers:
  - "explainable-quantum-security-2025"
  - "q-phishnet-globecom-2025"
  - "quantum-edge-health-2025"
featured: false
publishedDate: 2025-11-10
status: "published"
---

There is a standard framing for explainable AI in security applications: train a classifier, add a post-hoc explanation layer, display per-prediction feature importances to a human analyst who uses them to decide whether to act on an alert.

The user is the terminal point. The explanation is a UI element.

This framing is reasonable. It is also incomplete.

## What changed in the Q-PhishNet work

The CML'25 and ICSC'25 papers use LIME in the standard framing: model makes a prediction, LIME generates an explanation, analyst reads it. The explanation is for a human. The information flows: model → LIME → human.

In Q-PhishNet (GlobeCom'25), we were working on a different problem. An adversary had poisoned the training dataset by injecting malicious URL samples with adversarially crafted feature patterns. The goal was not to detect individual attacks after deployment. It was to identify which training samples had been injected — before deployment, during a model audit.

The natural first approach is to build a binary classifier on the training samples themselves (benign vs. adversarial). The problem is that this requires a labeled dataset of poisoned samples to train the classifier, which you don't have until after you've identified the poisoned samples — a circular dependency.

The second approach is anomaly detection on the training features. This works for obvious poisoning (injected samples with clearly out-of-distribution features) but fails for sophisticated poisoning where the adversary has specifically crafted samples to be in-distribution on raw features while being adversarially positioned relative to the decision boundary.

The third approach — which is what Q-PhishNet uses — is to run LIME across the training set and look for samples with anomalous feature importance profiles. The insight is: legitimate training samples should have feature importance distributions consistent with the model's learned representations. Adversarially poisoned samples — which have been specifically positioned to mislead the model — will exhibit unusual LIME signatures because the model's local behavior at those points is being actively distorted.

LIME is no longer a user interface. It is a diagnostic tool. The information flows: training data → model → LIME → anomaly detection → suspect sample set.

## Why this matters technically

The difference is not cosmetic. Standard LIME-as-explanation assumes the model is trustworthy and the explanation is informative. LIME-as-forensics inverts this: it treats the explanation as a signal about the trustworthiness of the input, not about the correctness of the model.

This produces different requirements:

**Stability requirements change.** For user-facing LIME, instability is a usability problem — an analyst who gets different feature importances for the same alert on two runs is confused. For forensic LIME, instability is a signal — a sample that produces highly variable LIME explanations across runs may itself be anomalous, because its neighborhood in feature space is irregular.

**Coverage requirements change.** For user-facing LIME, you run it on the predictions you care about explaining. For forensic LIME, you run it across the entire training set — which is computationally expensive and requires thinking carefully about sampling strategies.

**Interpretation changes.** A high-importance feature in user-facing LIME means "this feature drove this prediction." A high-importance feature in forensic LIME means "the model's local behavior around this training sample is unusually sensitive to this feature" — which is a different claim, and one that requires calibration against baseline importance distributions across clean training data.

## The unlearning connection

Once forensic LIME had identified the suspect training samples, we had a new problem: the model was already trained on the poisoned data. Standard correction would require retraining — removing the identified samples and rerunning the full training pipeline. For a neural network with weeks of training time, this is operationally prohibitive.

This is what pushed the Q-PhishNet and Q-TBNet work toward machine unlearning: we needed a way to remove the influence of specific training samples from an already-trained model, without full retraining.

The three-strategy unlearning framework in Q-PhishNet (KL-Adversarial, Fisher Regularization, Reverse Distillation) emerged as a direct response to the operational constraint. Forensic LIME generates the suspect set; the unlearning framework removes its influence.

The two tools are complementary. Neither is complete without the other: forensic LIME without unlearning gives you a list of problems with no efficient remedy; unlearning without forensic identification gives you a mechanism with no principled way to decide what to unlearn.

## What changed in how I think about XAI

Before this work, I thought of XAI in terms of its primary audience: the human expert who needs to understand a model decision.

After this work, I think of XAI in terms of what the explanation reveals about the model's relationship to its training data. A LIME output is not just "this feature mattered for this prediction." It is "this is how the model's learned representations behave in the neighborhood of this input." That framing opens up forensic uses that the user-facing framing forecloses.

The broader implication is that explanation methods designed for interpretability may have diagnostic utility that their designers didn't anticipate. LIME was designed to make models legible to humans. The forensic application came from treating LIME as a probe of the model's internal geometry rather than as a communication tool.

I suspect this pattern recurs. Explanation methods that were designed to make AI systems more transparent for users may also be useful for auditing those systems for adversarial corruption, identifying training data with unusual influence, or detecting concept drift between training and deployment distributions. These are not the intended use cases. They are available because the mechanism that makes explanations interpretable — the local linear approximation — also reveals local geometry that carries diagnostic information.

---

*The forensic LIME application is covered in detail in the GlobeCom'25 publication. The user-facing application across four papers is covered in the LIME explainer.*
