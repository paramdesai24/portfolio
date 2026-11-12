---
title: "Xeroww"
shortDescription: "Deterministic decision support for Indian equities, with a Decision Workbench, candle-by-candle Replay Lab and point-in-time Portfolio Intelligence."
techStack: ["React", "TypeScript", "Vite", "FastAPI", "SQLAlchemy", "PostgreSQL", "Redis", "Docker"]
researchThemes: ["Financial Engineering", "Time Series", "Decision Support"]
status: "active"
githubUrl: "https://github.com/paramdesai24/Xeroww"
featured: true
order: 0
---

## Overview

Xeroww helps a user examine Indian market structure, practice decisions in historical replay, and review portfolio performance and risk. I built it around a question: what evidence was available at the moment a decision was made?

## Historical replay

The server owns the historical candle cursor. A user advances one candle at a time and records decisions at a mandatory decision gate. Indicators and market structure use only the data available at that point. The client plays back REST snapshots, and append-only replay events support post-session review.

## Decision Workbench

A decision ticket records the setup, invalidation, targets, confidence, and rationale alongside a frozen evidence snapshot. Append-only amendments keep the initial thesis available for review.

## Portfolio intelligence

Immutable valuation snapshots support comparison against the NIFTY 50, attribution, drawdowns, beta, concentration and risk contribution. Formula provenance makes it possible to inspect how the results were calculated.

## Current architecture

The React and TypeScript dashboard calls a layered FastAPI service. PostgreSQL stores portfolio and decision records, while Redis caches quotes and OHLC data. A market-data provider interface isolates the upstream vendor from the analytics engines. Distributed streaming is documented as a future extension.
