---
title: "Agentic Systems and Tool Use"
status: "Exploring"
problem: "LLM-based agents can use tools, execute code, and chain reasoning steps. But they fail unpredictably, hallucinate tool parameters, and don't know when to stop. How do we make agentic systems reliable enough for real deployment?"
whyItMatters: "Enterprise AI workflows increasingly depend on autonomous agents. Reliability and failure predictability are unsolved."
directions: [
  "Failure taxonomy for agentic LLM systems",
  "Critic-agent architectures for self-correction",
  "Formal verification of agent action sequences"
]
---

## Overview
As LLMs shift from conversational chatbots to autonomous agents using external tool APIs (e.g., executing code, querying databases), ensuring operational reliability is critical. Minor hallucinations in tool parameters can result in runtime crashes or database command errors. This research explores constructing self-correcting agent chains and formal verification filters to audit and validate agent actions before execution.

### Key Focus Points
- **Critic Models**: Implementing lightweight critic agents that review the reasoning trace and tool outputs of the primary actor, forcing self-correction on anomalous parameters.
- **Formal Grammar Constraints**: Forcing LLM query generators to output strictly structured JSON patterns to prevent syntactic parse failures during API execution.
