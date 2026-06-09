---
title: "Q-ShielD: CV-QKD Framework for Secure Autonomous Vehicle Communications"
shortDescription: "Securing vehicle-to-everything (V2X) communications against quantum-level adversarial attacks."
venue: "IEEE VTC Spring 2025"
year: 2025
researchAreas: ["Quantum Security", "Cybersecurity"]
status: "published"
pdfUrl: "https://arxiv.org/abs/example2"
relatedProjects: ["bhoomi"]
order: 2
abstract: "Introduces a continuous-variable quantum key distribution framework for securing V2X communications in autonomous vehicle networks against eavesdropping and quantum-level adversarial attacks."
---

## Problem
Vehicle-to-Everything (V2X) communication is foundational for autonomous cooperative driving, allowing vehicles to share safety telemetry and coordinate paths. However, current cryptographic algorithms securing V2X protocols (such as ECDSA) are highly vulnerable to future quantum-computing attacks. If a malicious entity decrypts safety messages, they can inject spoofed collision warnings or hijack pathing. Designing a quantum-safe communication link for vehicles is difficult due to high vehicle mobility, packet latency budgets, and packet loss on dynamic roads.

## Key Contributions
1. **Q-ShielD**: A continuous-variable quantum key distribution (CV-QKD) architecture tailored for high-mobility V2X networks.
2. A lightweight key-agreement protocol capable of establishing keys under rapid channel state changes.
3. Simulation-based security evaluations against quantum-level eavesdropping and man-in-the-middle spoofing attacks.

## Methodology
The Q-ShielD framework implements a hybrid quantum-classical key distribution pipeline. Vehicles establish quantum channels using coherent laser pulses, encoding key bits in the quadratures of light (CV-QKD). Due to rapid vehicle motion, we design a fast multi-frame key reconciliation algorithm that aggregates low-signal-to-noise quantum states. These keys are then used to encrypt classical V2X messages (vehicle speed, coordinates, acceleration) using symmetric AES-256 ciphers. We evaluated the system performance using NS-3 network simulators paired with mobility traces.

## Results
Security analysis confirms that Q-ShielD achieves information-theoretic security against quantum-level intercept-resend attacks. The key agreement protocol successfully generates keys at a rate of 1.2 kbps under relative speeds of up to 80 km/h. V2X message encryption introduces a negligible latency overhead of 0.45 milliseconds, remaining well within the 10-millisecond critical safety threshold.

## Implications
Integrating CV-QKD primitives into vehicular edge nodes guarantees future-proof security for autonomous transportation networks. It proves that quantum-safe keys can be generated and distributed dynamically, even within rapidly changing topologies.
