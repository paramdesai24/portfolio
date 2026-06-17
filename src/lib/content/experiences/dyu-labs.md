---
role: "AI/ML Intern"
company: "DYU Labs"
period: "May – Jul 2026"
location: "Ahmedabad, India"
skills: ["Python", "LightGBM", "Pandas", "NumPy", "XArray", "LangGraph", "LangChain", "OpenAI GPT Models", "OpenAI Whisper", "pgvector", "LangSmith", "AWS Lambda", "AWS Fargate", "AWS EventBridge", "AWS ECR", "DynamoDB", "PostgreSQL", "Supabase", "RAG", "Time-Series Forecasting", "Copernicus ERA5"]
order: 1
shortDescription: "Technical lead for a summer intern team at DYU Labs (clients: ISRO, NTPC, Aditya Birla Group), building production solar forecasting pipelines and a LangGraph-powered conversational analytics assistant across 75 inverter devices and 15 solar plants."
---

## Overview

As an AI/ML Intern at DYU Labs (Ahmedabad, India), I served as technical lead for a summer intern team developing production-grade renewable energy intelligence systems. Our work was deployed for enterprise and government clients including ISRO, NTPC, and Aditya Birla Group.

## Solar Forecasting & MLOps

Built an end-to-end forecasting pipeline for 75 production inverter devices across 15 solar plants, generating 15-minute interval day-ahead forecasts.

Key responsibilities:

* **Telemetry ingestion** from AWS DynamoDB, combined with weather forecasts from ECMWF and Copernicus ERA5 climate datasets
* **Preprocessing** for inverter telemetry normalization, outage-aware cleaning, and temporal/meteorological feature engineering
* **Per-device LightGBM models** with automated retraining, lifecycle management, and fleet-wide monitoring (MAE, MAPE, drift detection via Kolmogorov-Smirnov tests)
* **Cloud deployment** via AWS Lambda, EventBridge, ECR, and Fargate for fully automated pipeline execution

## LangGraph-Powered Conversational AI Assistant

Led development of a LangGraph-powered assistant enabling solar plant operators to interact with telemetry systems using natural language and voice.

Key responsibilities:

* **Multi-agent LangGraph workflows** for query understanding, tool selection, validation, and response synthesis
* **RAG pipelines** using OpenAI embeddings, pgvector, and Supabase vector search
* **NL-to-Database Query (NL2DBQ)** for operational analytics and Modbus/register-based telemetry decoding
* **Observability** via LangSmith; secure tool execution with authorization guardrails
