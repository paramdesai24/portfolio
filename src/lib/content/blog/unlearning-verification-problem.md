---
title: "The machine unlearning verification problem"
category: "Research"
description: "Approximate unlearning is behaviourally verifiable but not statistically provable. The gap between 'forget-set accuracy under 5%' and 'statistically indistinguishable from a model never trained on that data' is the central open problem in the field."
targetAudience: "ML security researchers, privacy engineers, CS grad students"
readingTime: "10 min"
themes:
  - "machine-unlearning"
relatedPapers:
  - "q-phishnet-globecom-2025"
  - "q-tbnet-medical-imaging-2026"
featured: false
publishedDate: 2026-01-15
status: "published"
---

Approximate machine unlearning is a practically useful and theoretically incomplete technique. This article is about the incompleteness.

## What approximate unlearning claims to do

The goal: given a trained model M and a set of training samples F (the "forget set"), produce a new model M' such that M' behaves as if it had never been trained on F.

Exact unlearning achieves this by retraining from scratch on the dataset minus F. This is provably correct but computationally prohibitive for large models.

Approximate unlearning achieves this by modifying M's parameters to reduce F's influence — without retraining. The Q-PhishNet and Q-TBNet papers use a three-strategy framework: KL-Adversarial training (disrupting the output distribution on F), Fisher Regularization (targeting parameters with high sensitivity to F), and Reverse Distillation (aligning the model's internal representations on F with a teacher trained without F).

The resulting model M' has low accuracy on F (below 5% in our experiments — near chance for binary classification). It retains most of its accuracy on the remainder of the training set (the "retain set").

This is the behavioral claim. The behavioral claim is verifiable. The theoretical claim is harder.

## What the behavioral test actually measures

The behavioral test runs the unlearned model on the forget set and reports the accuracy. If accuracy is at chance, the test passes.

Here is the problem: two mechanisms produce chance accuracy on the forget set, and they are not equivalent.

**Mechanism 1 — Influence erasure:** The model's parameters no longer encode the forget set's pattern. Evaluate the model on F, and it predicts randomly because it genuinely has no learned signal for those inputs.

**Mechanism 2 — Active suppression:** The model has learned to produce incorrect outputs for the forget set specifically. Evaluate the model on F, and it predicts randomly (or incorrectly) because the training process has overfit the unlearning objective on F — which is itself a form of memorization.

These produce identical behavioral test results. They have completely different implications for what the model has actually learned.

Under Mechanism 1, the model is genuinely ignorant of F. Its behavior on F is equivalent to the behavior of a model that never saw F.

Under Mechanism 2, the model has memorized F — but has additionally learned to suppress its correct outputs for F. It is not ignorant of F; it knows F and has been specifically trained to perform poorly on it. A model that performs poorly because it has memorized the wrong answer is not the same as a model that performs poorly because it has no learned signal.

Distinguishing these mechanisms from the outside, using only behavioral tests, is not straightforwardly possible. Both produce the same output distribution on F.

## The counterfactual comparison

The gold standard for verifying unlearning is counterfactual comparison: the unlearned model M' should be statistically indistinguishable from a model M_r trained from scratch on only the retain set (without F).

If M' and M_r have indistinguishable output distributions across the same inputs — not just on F, but across the full input space — then M' is genuinely equivalent to a model that never saw F. This is what "true unlearning" means.

Achieving this with approximate unlearning is hard for a structural reason: M was initialized with parameters already influenced by F, and M' is produced by gradient-based optimization starting from M. The optimization trajectory of M' is different from M_r's training trajectory, even if both end up with similar test-set accuracy. Small differences in internal representations can produce similar outputs on the evaluation set while differing on inputs the evaluation set doesn't cover.

In practice, this means: approximate unlearning may produce models that pass behavioral tests on F while retaining residual influence from F in regions of the input space not covered by the test set.

## Why GDPR Article 17 makes this matter

The right to erasure under GDPR Article 17 creates a legal obligation to delete personal data on request. For a neural network trained on that data, "deletion" is technically ambiguous: deleting the training sample from storage is straightforward; removing the sample's influence from trained parameters is not.

Regulators have not yet specified which definition of "deletion" applies to trained models. Two positions are possible:

**Position A:** Deletion means removing the training sample from storage and retraining. This is the exact-unlearning interpretation. It is prohibitively expensive for large models.

**Position B:** Deletion means ensuring the model's behavior on the subject's data is equivalent to a model never trained on it. This is the counterfactual interpretation. It requires the statistical indistinguishability guarantee that approximate unlearning does not yet reliably provide.

The Q-TBNet paper — which builds an unlearning module for a tuberculosis detection model on patient chest X-rays — is directly motivated by Position B. Patient consent can be revoked. When it is, the model's parameters should not retain any influence from that patient's images. The paper achieves behavioral compliance (near-chance accuracy on the revoked patient's images). It does not achieve statistical compliance (indistinguishability from the counterfactual).

This is the honest characterization of where the field is: behavioral compliance is achievable and practically useful; statistical compliance is the open problem.

## What closing the gap requires

Three approaches are active in the research literature:

**Membership inference as a proxy test.** If a membership inference attack — which tries to determine whether a specific sample was in a model's training set — cannot distinguish M' from M_r when applied to F, then M' passes a stronger-than-behavioral test. The limitation: membership inference attacks are imperfect even for genuinely retrained models, so a pass on this test doesn't guarantee statistical indistinguishability.

**Certified machine unlearning.** Exact unlearning for specific model families (e.g., linear models, SVMs with specific kernel choices) provides provable statistical guarantees but doesn't scale to deep neural networks. Research on certified approximate unlearning for neural networks is active but not yet practically deployed.

**Differential privacy during training.** DP-SGD limits the influence of any single training sample on the final parameters by design. A model trained with DP has inherent unlearning properties: because no sample had high influence to begin with, "forgetting" it has a bounded effect. The tradeoff is accuracy degradation from the DP noise, which is prohibitive for many applications.

None of these fully closes the verification gap for the models and use cases in the Q-PhishNet and Q-TBNet papers. The gap is open.

## What I take from this

The verification problem is the most interesting problem in machine unlearning right now, and it is not primarily a machine learning problem. It is a formal verification problem: specifying precisely what it means for a model to have "forgotten" data, and then proving that a given algorithm achieves that specification.

The behavioral tests we report in Q-PhishNet and Q-TBNet are necessary components of a verification story, not the complete story. The papers say this explicitly. The open question is not whether approximate unlearning is useful — it clearly is — but whether it can be made verifiably equivalent to exact unlearning in a way that satisfies both the technical and the regulatory standard.

That question is one I want to work on in graduate school. The tools required are a combination of theoretical ML (understanding what parameters encode about training data), formal methods (specifying and proving properties of learning algorithms), and systems thinking (making provable guarantees practical at scale). That combination is not currently available in any single research group's toolbox, which is why the problem is open. It is also why it is interesting.

---

*The GlobeCom'25 and AI2M4RI'26 papers are the empirical basis for this article.*
