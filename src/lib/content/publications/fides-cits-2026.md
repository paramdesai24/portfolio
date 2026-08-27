---
title: "FIDES: A Federated Intelligence and Detection with Quantum Security for Financial Institutions"
shortDescription: "Quantum-secured federated deep learning framework for multi-institution financial fraud detection with CV-QKD gradient encryption and FedDyn aggregation"
venue: "IEEE CITS 2026"
year: 2026
status: "Published"
pdfUrl: "https://ieeexplore.ieee.org/document/11637348"
doi: "10.1109/CITS70307.2026.11637348"
location: "Piraeus-Athens, Greece"
publisher: "IEEE"
dateAdded: "August 13, 2026"
researchAreas: ["Federated Learning", "Quantum Security", "Financial AI"]
order: 7
abstract: "With the increasing sophistication of financial frauds, there is now a need for more advanced, secure, and scalable detection mechanisms. A fraud detection framework has been proposed that uses Federated Deep Learning (FDL) and Quantum Key Distribution (QKD) for non-IID financial data while carrying out secure communication. Using FL algorithms-FedAvg, FedAdagrad, FedAMP, and FedDyn-on partitioned client data, we demonstrate that FedDyn outperforms the other algorithms with an accuracy of 97.74%. Furthermore, we use Continuous-Variable QKD to encrypt the model updates to secure client-server communication, achieving a secure key ratio of above 98% and key rates of more than 250,000 bits/sec. Lastly, we implemented an elaborate suite of evaluations consisting of client-wise metrics, ROC curves, and t-SNE plots to validate the efficacy of our model implementation in terms of both performance and privacy preservation. Through our results, we address the brought-up importance of distributed intelligence powered by quantum encryption against advanced financial frauds."
---

## Problem

Frauds in industrial financial systems are no longer confined to simple forged checks, accounting errors, and malicious transactions — they are a booming and vicious threat, resulting in over $16.6 billion in losses in 2024 alone (a 33% increase year-over-year). While Machine Learning (ML) and Deep Learning (DL) have emerged as powerful detection tools, conventional centralized models require aggregating sensitive client transaction histories onto a central server, exposing proprietary financial data to massive breach risks. Conversely, while Federated Learning (FL) keeps raw data localized across financial institutions, transmitting model gradients and weight updates over classical channels leaves the communication link vulnerable to interception, manipulation, and gradient inversion attacks by motivated adversaries.

## Key Contributions

1. **FIDES Framework**: A novel three-layer architecture ($\psi_1, \psi_2, \psi_3$) integrating Federated Deep Learning (FDL) with Quantum Key Distribution (QKD) to enable secure, scalable, and privacy-preserving fraud detection across non-IID financial data.
2. **Algorithm Comparison on Non-IID Data**: Comprehensive evaluation of four federated learning algorithms (**FedAvg, FedAdagrad, FedAMP, and FedDyn**) under realistic temporal partitioning across heterogeneous clients, proving FedDyn's superior performance (97.74% accuracy).
3. **Continuous-Variable QKD (CV-QKD) Security**: Implementation and evaluation of a CV-QKD encryption protocol for model weight updates and gradient exchange, achieving >98% secure key extraction efficiency and throughput above 250,000 bits/sec.
4. **Comprehensive Multi-Metric Evaluation**: Validation using client-wise metrics, ROC curves (AUC 99.86%), confusion matrices, and t-SNE class cluster visualizations to verify both fraud classification accuracy and strict privacy preservation.

## Methodology

FIDES structures fraud detection across three interconnected functional layers:
- **Data Acquisition & Preprocessing ($\psi_1$)**: Processes 50,000 transaction samples across 21 feature dimensions. Features undergo z-score standardization, IQR-based outlier capping, dimensionality reduction with Principal Component Analysis (PCA), and feature selection via Mutual Information (MI) to isolate critical indicators such as risk scores, transaction amounts, failed transaction counts, and transaction distance. The dataset is temporally partitioned across 4 client nodes (quarterly distribution) to model realistic non-IID data heterogeneity.
- **Federated AI with Dynamic Regularization ($\psi_2$)**: Employs a 3-layer Multilayer Perceptron (MLP) binary classifier (64 and 32 hidden neurons with ReLU and 30% dropout regularization). Dynamic regularization via FedDyn augments the local loss with memory-based client control vectors $h_i^t$ and a regularization parameter ($\alpha = 0.01$), mitigating client drift across heterogeneous financial institutions during communication rounds.
- **Quantum Cryptographic Security Sublayer**: Integrates Continuous-Variable Quantum Key Distribution (CV-QKD) where Gaussian quadrature pairs $(q_i, p_i) \sim \mathcal{N}(0, \sigma^2)$ are sampled into coherent optical pulses and measured via homodyne detection. Classical post-processing (sifting, excess noise estimation, error correction, and privacy-amplification hashing) distills secret keys used as one-time pads to symmetrically encrypt model updates. Any eavesdropping introduces detectable excess noise, aborting the protocol to ensure end-to-end confidentiality.

## Results

Experimental results confirm the effectiveness of the FIDES architecture:
- **Model Performance**: FedDyn achieved the highest overall detection accuracy of **97.74%**, outperforming FedAvg, FedAdagrad, and FedAMP on non-IID client partitions.
- **Classification Trade-offs & Generalization**: The ROC analysis yielded an outstanding **AUC of 99.86%**, showing optimal true positive vs. false positive rate trade-offs. The confusion matrix verified ~98% accuracy in separating legitimate and fraudulent transactions.
- **Client-Wise Equity**: Evaluation across all 4 clients demonstrated balanced performance, with Client 1 and Client 4 attaining highest accuracies and Client 3 leading precision, confirming that dynamic regularization prevents individual client degradation.
- **Quantum Cryptographic Advantage**: CV-QKD demonstrated a **~98% secure bit extraction ratio** (compared to ~48% for BB84) and converged rapidly to a throughput averaging **~258,000 bits/sec** (compared to BB84's 88,983 bits/sec).
- **Class Separation & Privacy**: t-SNE dimensionality reduction confirmed distinct clustering between fraudulent and legitimate transaction representations without leaking raw transaction attributes.

## Implications

FIDES demonstrates that combining Federated Deep Learning with Continuous-Variable Quantum Key Distribution establishes a scalable, mathematically secure foundation for multi-institution financial fraud detection. The high key generation rates of CV-QKD over standard telecom optical fiber accommodate batch model update encryption without degrading federated training cycles. Moving from computational hardness assumptions to physical-law quantum guarantees ensures that sensitive inter-bank intelligence and client transaction distributions remain invulnerable to both classical eavesdropping and future quantum-assisted attacks.
