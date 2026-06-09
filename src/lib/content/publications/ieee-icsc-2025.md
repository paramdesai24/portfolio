---
title: "Deep Learning and Explainable AI Framework for False Data Injection Attack Detection in Autonomous Vehicles"
shortDescription: "XAI-driven cybersecurity pipeline protecting sensor feeds in connected vehicle networks"
venue: "IEEE ICSC 2025"
year: 2025
status: "presented"
note: "Presented in person at Tampa, Florida, USA"
researchAreas: ["XAI", "Cybersecurity"]
pdfUrl: "https://ieeexplore.ieee.org/document/11139950/"
relatedProjects: ["bhoomi"]
order: 2
abstract: "Develops a deep learning pipeline with integrated SHAP-based explainability for detecting false data injection attacks in autonomous vehicle sensor networks, providing both accuracy and interpretable model decisions."
---

## Problem
Modern Autonomous Vehicles (AVs) rely heavily on a diverse array of sensor inputs (such as GPS, LiDAR, and IMUs) to make real-time navigational decisions. However, these sensor arrays are highly vulnerable to False Data Injection (FDI) attacks, where malicious actors transmit spoofed coordinates or falsified telemetry to hijack the vehicle's pathing. Devising an effective defense framework is challenging because traditional intrusion detection systems behave as 'black boxes'—they may flag an anomaly, but cannot tell the vehicle's central controller which sensor feed has been compromised. This lack of explanation hinders real-time safety mitigations and software audits.

## Key Contributions
1. A deep learning detection framework achieving 97.3% accuracy on benchmark datasets.
2. SHAP-based feature attribution providing interpretable, per-sample explanations.
3. Evaluation across three real-world AV sensor attack scenarios.

## Methodology
Our proposed detection architecture consists of a dual-stage framework. In the first stage, a multi-layer deep neural network (DNN) acts as a high-throughput classifier, processing continuous vehicle telemetry streams (vehicle speed, heading, yaw rate, and GPS signals) to identify anomaly frames. In the second stage, we integrate a localized SHAP (SHapley Additive exPlanations) interpreter. When the DNN flags an anomaly, the SHAP engine computes feature attribution values, isolating the specific sensor channel responsible for the anomaly flag. The evaluation was conducted using synthetic attack injection datasets on realistic AV simulation models.

## Results
Experimental evaluations demonstrate that our framework achieves a 97.3% detection accuracy and an F1-score of 96.8% under aggressive noise conditions. Critically, the SHAP interpreter was able to attribute attacks to spoofed GPS signals within 4.2 milliseconds of detection, showcasing that localized explainability can be run at edge latency budgets suitable for vehicle control software.

## Implications
Integrating real-time explainable frameworks inside autonomous vehicle safety modules allows controllers to perform selective sensor isolation. Rather than triggering emergency braking for any flagged anomaly, the vehicle can ignore spoofed inputs (such as a poisoned GPS signal) and rely on redundant systems (such as wheel encoders) to navigate safely.
