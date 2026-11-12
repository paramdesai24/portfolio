---
role: "Applied AI Engineering Intern"
company: "DYU Labs"
period: "May – Jul 2026"
location: "Ahmedabad, India"
skills: ["Python", "LightGBM", "Pandas", "NumPy", "XArray", "LangGraph", "LangChain", "OpenAI GPT Models", "OpenAI Whisper", "pgvector", "LangSmith", "AWS Lambda", "AWS Fargate", "AWS EventBridge", "AWS ECR", "DynamoDB", "PostgreSQL", "Supabase", "RAG", "Time-Series Forecasting", "Copernicus ERA5"]
order: 1
shortDescription: "Built a solar generation forecasting pipeline and developed aALoK, a LangGraph-based assistant that lets plant operators ask questions about telemetry in natural language."
---

## Overview

As an Applied AI Engineering Intern at DYU Labs in Ahmedabad, I worked on solar generation forecasting and a conversational assistant for plant operators.

## Solar Forecasting & MLOps

Built an end-to-end forecasting pipeline for 75 production inverter devices across 15 solar plants, generating 15-minute interval day-ahead forecasts.

Key responsibilities:

* **Telemetry ingestion** from AWS DynamoDB, combined with weather forecasts from ECMWF and Copernicus ERA5 climate datasets
* **Preprocessing** for inverter telemetry normalization, outage-aware cleaning, and temporal/meteorological feature engineering
* **Per-device LightGBM models** with automated retraining, lifecycle management, and fleet-wide monitoring (MAE, MAPE, drift detection via Kolmogorov-Smirnov tests)
* **Cloud deployment** via AWS Lambda, EventBridge, ECR, and Fargate for fully automated pipeline execution

## LangGraph-Powered Conversational AI Assistant

Developed a LangGraph-powered assistant that lets solar plant operators query telemetry using natural language and voice.

Key responsibilities:

* **Multi-agent LangGraph workflows** for query understanding, tool selection, validation, and response synthesis
* **RAG pipelines** using OpenAI embeddings, pgvector, and Supabase vector search
* **NL-to-Database Query (NL2DBQ)** for operational analytics and Modbus/register-based telemetry decoding
* **Observability** via LangSmith; secure tool execution with authorization guardrails
