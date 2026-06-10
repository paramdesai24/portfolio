---
role: "AI/ML Intern"
company: "DYU Labs"
period: "May – Jul 2026"
location: "Ahmedabad, India"
skills: ["LangGraph", "DynamoDB", "LightGBM", "Copernicus CDS", "Time-Series Forecasting", "AWS Fargate", "Drift Detection"]
order: 1
shortDescription: "Building production solar analytics pipelines, telemetry health metrics, and a LangGraph chatbot integrated with DynamoDB. Designed daily automated weather and generation forecasting pipelines on AWS Fargate. Engineered stateful multi-agent conversational systems for real-time querying."
---

## Overview
As an AI/ML Intern at DYU Labs in Ahmedabad, India, I am building production-grade renewable energy intelligence solutions and conversational agents.

## Core Work
* **Solar Forecasting & Telemetry Pipeline**: Built an end-to-end solar forecasting and sensor health diagnostics system. An orchestrator AWS Lambda daily triggers a Python ML pipeline inside AWS Fargate. It queries inverter telemetry from Amazon DynamoDB and weather forecasts from the Copernicus CDS API, preprocesses the data, trains personalized LightGBM Regressors, and writes predictions back to DynamoDB. The system computes a 100-point Device Health Score to detect telemetry outages, performance degradation, and data drift using Kolmogorov-Smirnov tests.
* **LangGraph Telemetry Chatbot**: Designed and built a conversational AI assistant using LangGraph connected directly to the DynamoDB telemetry tables. It translates natural language questions (e.g., about degraded devices or generation forecasts) into query operations to fetch telemetry records and return context-aware reports.
