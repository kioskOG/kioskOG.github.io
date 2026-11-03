---
title: AWS Certified AI Practitioner (AIF-C01) Exam Guide
layout: doc-page
parent: AI Certification Exams Prep
parent_url: /docs/ai/Exams-Prep/
nav_order: 3
permalink: /docs/ai/Exams-Prep/aws-aif-c01/
description: Complete study guide for AWS Certified AI Practitioner (AIF-C01 v1.1), covering AI/ML fundamentals, Generative AI, Bedrock, SageMaker, Prompt Engineering, and Responsible AI.
type: concept
tags:
- ai
- aws
- aif-c01
- generative-ai
- bedrock
- sagemaker
timestamp: '2026-10-31T12:00:00Z'
---

# AWS Certified AI Practitioner (AIF-C01) Exam Guide

The **AWS Certified AI Practitioner (AIF-C01, Exam Guide v1.1)** is a foundational AWS certification validating comprehensive knowledge of artificial intelligence, machine learning concepts, generative AI technologies, and associated AWS services.

{: .important}
> **Interactive Practice Available:** Drill the 200 curated exam questions (100 Core + 100 Scenario questions with Easy/Medium/Hard ratings) or take a full-length 90-minute mock exam with instant scoring in our [Exam Crack Buddy Console](/docs/ai/Exams-Prep/exam-crack-buddy/).

---

## 📋 Exam Blueprint & Facts

| Attribute | Specification |
|---|---|
| **Exam Code** | AIF-C01 (Exam Guide version 1.1) |
| **Questions** | 65 questions (50 scored + 15 unscored pretest items) |
| **Time Limit** | 90 minutes (approx. 80 seconds per question) |
| **Passing Score** | 700 on a 100–1,000 scaled score |
| **Question Types** | Multiple choice, multiple response, ordering, matching |
| **Scoring Model** | Compensatory: pass overall, no negative marking for incorrect guesses |

### Domain Weights

```
┌─────────────────┬─────────────────┬──────────────────────┬─────────────────┬─────────────────┐
│ Domain 1: AI/ML │ Domain 2: GenAI │ Domain 3: FM Apps    │ Domain 4: Resp. │ Domain 5: Sec.  │
│ 20%             │ 24%             │ 28%                  │ 14%             │ 14%             │
└─────────────────┴─────────────────┴──────────────────────┴─────────────────┴─────────────────┘
```

- **Domain 1: Fundamentals of AI and ML** — 20% (~13 questions)
- **Domain 2: Fundamentals of Generative AI** — 24% (~16 questions)
- **Domain 3: Applications of Foundation Models** — 28% (~18 questions)
- **Domain 4: Guidelines for Responsible AI** — 14% (~9 questions)
- **Domain 5: Security, Compliance, and Governance for AI Solutions** — 14% (~9 questions)

---

## 🗓️ 10-Day Sprint Plan

- **Day 1 — Domain 1 (Part A):** AI/ML/DL/GenAI/agentic hierarchy, supervised vs unsupervised vs reinforcement learning, inference types, model fit, evaluation metrics. Practice D1 Q1–10.
- **Day 2 — Domain 1 (Part B):** The machine learning lifecycle, SageMaker AI capabilities, AWS managed AI services map, traditional ML vs foundation models. Practice D1 Q11–20.
- **Day 3 — Domain 2 (Part A):** Tokenization, embeddings, vector spaces, transformers, diffusion models, hallucinations, token pricing models, context engineering. Practice D2 Q1–12.
- **Day 4 — Domain 2 (Part B):** Agentic workflows (Model Context Protocol, multi-agent systems, memory), Amazon Bedrock architectures, SageMaker JumpStart, Amazon Q business & developer tools. Practice D2 Q13–24.
- **Day 5 — Domain 3 (Part A):** Model inference parameters (temperature, top-p, top-k, stop sequences), RAG concepts, Amazon Bedrock Knowledge Bases, vector database options, customization cost ladder. Practice D3 Q1–14.
- **Day 6 — Domain 3 (Part B):** Advanced prompting strategies (Zero-shot, Few-shot, Chain-of-Thought), prompt security vulnerabilities, fine-tuning requirements, RLHF, FM evaluation metrics. Practice D3 Q15–28.
- **Day 7 — Domain 4:** The dimensions of responsible AI, bias mitigation, explainability, SageMaker Clarify, Model Cards, Guardrails for Amazon Bedrock, Amazon Augmented AI (A2I), AWS AI Service Cards. Practice all Domain 4 questions.
- **Day 8 — Domain 5:** The AWS Shared Responsibility Model for AI, IAM least-privilege policies, AWS KMS encryption, Amazon Macie, PrivateLink VPC endpoints, CloudTrail, AWS Config, AWS Artifact, AWS Audit Manager. Practice all Domain 5 questions.
- **Day 9 — Mock Exam 1:** Sit for a full 65-question timed mock test. Review all incorrect and flagged items against memory hooks.
- **Day 10 — Mock Exam 2 & Final Polish:** Target weak domains, retake missed questions, take Mock Exam 2. Schedule your exam when scoring 85%+ consistently.

---

## 🧩 Domain 1: Fundamentals of AI & ML (20%)

### 1. Fundamental Terminology
- **Machine Learning (ML):** Developing algorithms that generalize patterns from empirical training data rather than relying on explicit procedural code.
- **Deep Learning (DL):** Complex artificial neural networks with multiple stacked hidden layers capable of learning non-linear feature representations.
- **Agentic AI:** Autonomous multi-step systems leveraging foundation models with tool-use (function calling), scratchpad memory, and iterative reasoning loops to accomplish open-ended goals.

{: .note}
> **Memory Hook:**  
> - **Classification:** Answers *"Which bucket?"* (discrete classes).  
> - **Regression:** Answers *"How much / what number?"* (continuous numerical values).  
> - **Clustering:** Answers *"Who is similar?"* (unsupervised grouping without labels).

### 2. Amazon SageMaker AI Inference Types

| Inference Type | Latency | Traffic Pattern | Payload Size | Typical Use Case |
|---|---|---|---|---|
| **Real-time** | Milliseconds | Steady, consistent | Up to 6 MB | Interactive customer applications, live web fraud scoring |
| **Serverless** | Milliseconds (cold-start tolerant) | Intermittent, spiky, idle periods | Up to 4 MB | Internal apps with sporadic usage, cost minimization |
| **Asynchronous** | Minutes (queued) | Large payloads, long inference runs | Up to 1 GB (via S3) | Complex image rendering, batch document OCR, video analysis |
| **Batch Transform** | Hours | Scheduled bulk processing | Entire S3 datasets | Weekly customer churn scoring, overnight reporting |

{: .note}
> **Memory Hook:** *Now (Real-time), Sometimes (Serverless), Later (Asynchronous), All at once (Batch Transform).*

### 3. Model Fit & Classical ML Metrics
- **Overfitting (High Variance):** Model memorizes the training dataset noise and performs poorly on unseen validation data.
  - *Remedies:* Collect more/diverse training data, apply regularization ($L_1 / L_2$), apply dropout, implement early stopping, reduce model complexity.
- **Underfitting (High Bias):** Model is too simple to capture the underlying pattern in data.
  - *Remedies:* Add more features, engineer new domain features, increase model capacity/parameters.
- **Classification Metrics:**
  - **Precision:** $\frac{TP}{TP + FP}$ — Of all positive predictions, how many were actually positive? Critical when false alarms are costly (e.g., spam filtering).
  - **Recall (Sensitivity):** $\frac{TP}{TP + FN}$ — Of all actual positive cases, how many did we catch? Critical when missing a positive is catastrophic (e.g., cancer detection, fraud detection).
  - **F1 Score:** Harmonic mean of precision and recall ($2 \times \frac{P \times R}{P + R}$). Best metric for imbalanced classes.
  - **ROC-AUC:** Area under the Receiver Operating Characteristic curve. Measures trade-off between True Positive Rate and False Positive Rate across all classification thresholds.

---

## ⚡ Domain 2: Fundamentals of Generative AI (24%)

### 1. Mechanics of Generative Models
- **Tokens:** The fundamental discrete atomic chunks (words, characters, or subwords) processed by language models. In English, $1,000 \text{ tokens} \approx 750 \text{ words}$.
- **Embeddings:** High-dimensional vector representations that capture semantic meaning. Concepts with similar meanings map to proximal vectors in geometric embedding space (e.g., via cosine similarity).
- **Transformer Architecture:**
  - **Self-Attention:** Enables the model to calculate contextual relationships between all words in a sequence simultaneously, regardless of their distance.
  - **Feed-Forward Layers:** Project attention outputs into dense semantic feature representations.
- **Diffusion Models:** Image generation architectures that iteratively reverse Gaussian noise added to an image during training to synthesize photo-realistic visuals from text prompts (e.g., Amazon Titan Image Generator).

### 2. Hallucinations & Context Engineering
- **Hallucination:** An LLM generating factually incorrect, fabricated, or ungrounded assertions with high statistical confidence.
- **Mitigation Strategies:**
  - Use Retrieval Augmented Generation (RAG) to anchor responses in verified enterprise knowledge bases.
  - Set lower temperature parameters ($0.0 - 0.2$).
  - Prompt instructions requiring the model to state *"I don't know based on the provided context"* when information is missing.
  - Utilize **Guardrails for Amazon Bedrock** to verify factual consistency and grounding.

### 3. Managed Generative AI on AWS
- **Amazon Bedrock:** Fully managed service offering choice of high-performing Foundation Models (FMs) from leading AI companies (Anthropic Claude, Meta Llama, Mistral, AI21, Cohere, Amazon Titan) via a single unified serverless API, with built-in security, privacy, and responsible AI guardrails.
- **Amazon SageMaker JumpStart:** Machine learning hub offering pretrained open-source and proprietary foundation models with complete infrastructure customization, private VPC deployment, and full hyperparameter control.
- **Amazon Q Business:** Generative AI-powered conversational assistant connected to enterprise data stores (Wikis, Jira, Salesforce, S3) with role-based access control and source citations.
- **Amazon Q Developer:** Coding companion that provides real-time code recommendations, vulnerability scanning, and automated application upgrades (Java, .NET) in the IDE.

---

## 🚀 Domain 3: Applications of Foundation Models (28%)

### 1. Inference Parameters

| Parameter | Behavior | Low Value Effect | High Value Effect |
|---|---|---|---|
| **Temperature** | Controls randomness of token selection | Deterministic, focused, analytical (ideal for coding/math: $0.0 - 0.2$) | Creative, varied, surprising (ideal for marketing/creative writing: $0.7 - 1.0$) |
| **Top-P (Nucleus Sampling)** | Considers smallest set of tokens whose cumulative probability exceeds $P$ | Strictly high-probability words | Considers broader tail of vocabulary words |
| **Top-K** | Limits choice to only the $K$ most probable next tokens | Narrow, predictable choices | Broader selection pool |
| **Stop Sequences** | Specific character strings that halt generation | N/A | Ensures clean termination (e.g., `\n\nUser:`) |

{: .important}
> **Best Practice:** Adjust **either** Temperature or Top-P when tuning generation, not both simultaneously.

### 2. Retrieval-Augmented Generation (RAG) Architecture
```
User Query ──► Embedding Model ──► Vector Search (Knowledge Base)
                                         │
                                         ▼ Retrieved Relevant Chunks
User Query + Contextual Chunks ────────► Foundation Model ──► Grounded Response + Citations
```

- **Amazon Bedrock Knowledge Bases:** Managed RAG pipeline that handles document ingestion from S3, automated text chunking, embedding generation via Titan Multimodal, and storage in a vector store.
- **Supported Vector Stores:**
  - Amazon OpenSearch Serverless (Vector Engine)
  - Amazon Aurora PostgreSQL with `pgvector`
  - Amazon Neptune Analytics
  - Pinecone / MongoDB Atlas

### 3. The Customization Cost & Complexity Ladder
```
Low Cost / Fast ────────────────────────────────────────────────────────► High Cost / Complex
1. Prompt Engineering   2. RAG (Knowledge Bases)   3. Model Fine-Tuning   4. Pre-training from Scratch
```

1. **Prompt Engineering:** Optimize instructions, system prompts, and formatting. Zero infrastructure cost.
2. **RAG:** Dynamically supply external, real-time, private enterprise data into the prompt context window without retraining the model.
3. **Fine-Tuning:** Update internal model weights using a curated dataset of prompt-completion pairs to adapt tone, format, or specialized domain vocabulary. Requires labeled data and GPU compute hours.
4. **Pre-training from Scratch:** Train a new model from random initialization on billions of tokens. Multi-million dollar endeavor reserved for sovereign or highly proprietary domains.

### 4. Advanced Prompting Techniques
- **Zero-Shot:** Providing a prompt with no prior examples.
- **Few-Shot:** Providing 2–5 structured input-output exemplars in the prompt context to demonstrate the desired format or reasoning pattern.
- **Chain-of-Thought (CoT):** Guiding the model to output intermediate reasoning steps before providing the final answer (*"Think step by step"*). Dramatically improves math and multi-step logic.
- **Prompt Injection:** An attack where user input manipulates the model into ignoring its system safety instructions and executing unauthorized actions.

---

## 🛡️ Domain 4: Guidelines for Responsible AI (14%)

### 1. The Core Pillars of Responsible AI
- **Fairness:** Ensuring model predictions do not exhibit algorithmic bias or discriminate against protected groups.
- **Explainability & Interpretability:** Providing transparent insights into why a model reached a specific decision.
- **Robustness:** Ensuring model stability and predictable behavior when encountering out-of-distribution or noisy inputs.
- **Privacy & Security:** Preventing leakage of personally identifiable information (PII) or proprietary training data.
- **Transparency:** Disclosing when a user is interacting with an AI system and publishing clear system documentation.

### 2. AWS Responsible AI Toolset
- **Amazon SageMaker Clarify:**
  - Evaluates pre-training dataset bias and post-training model prediction bias across demographic groups.
  - Generates feature attribution reports using **SHAP (SHapley Additive exPlanations)** values to explain which features influenced predictions most.
- **SageMaker Model Cards:** Standardized digital fact sheets documenting model architecture, intended use cases, training datasets, performance benchmarks, and ethical considerations.
- **Guardrails for Amazon Bedrock:**
  - Enforces customized content filtering across inputs and model responses.
  - Redacts or masks Sensitive PII (Social Security numbers, credit cards, emails).
  - Filters harmful categories (Hate speech, violence, sexual content).
  - Detects and prevents prompt injection attacks and validates factual grounding to prevent hallucinations.
- **Amazon Augmented AI (A2I):** Coordinates human-in-the-loop (HITL) review workflows for low-confidence model predictions or sensitive business decisions.
- **AWS AI Service Cards:** Public documentation provided by AWS outlining the responsible use, limitations, and operational best practices for AWS pre-built AI services (Rekognition, Textract, Transcribe).

---

## 🔒 Domain 5: Security, Compliance, & Governance (14%)

### 1. Shared Responsibility Model for Generative AI
- **AWS Responsibility:** Physical data center security, host infrastructure, hardware virtualization, foundational model security (for AWS-provided models), and compliance certifications (SOC, HIPAA, ISO).
- **Customer Responsibility:** Prompt inputs, training data security, access control policies (IAM), encryption key management (KMS), output validation, data classification, and regulatory compliance.

{: .important}
> **Bedrock Privacy Guarantee:** AWS does **NOT** use customer prompts, responses, or fine-tuning data to train or improve any base AWS foundation models, nor is customer data shared with third-party model providers.

### 2. Security Services Architecture
- **AWS Identity and Access Management (IAM):** Enforces least-privilege access to Bedrock model invocation APIs (`bedrock:InvokeModel`).
- **AWS Key Management Service (KMS):** Encrypts model weights, fine-tuning training datasets in S3, Bedrock Knowledge Base vector embeddings, and transient caches using customer-managed KMS keys (CMKs).
- **AWS PrivateLink (VPC Endpoints):** Establishes private network connectivity between VPC subnets and Amazon Bedrock APIs without sending traffic over the public internet.
- **Amazon Macie:** Employs pattern matching and machine learning to automatically discover, classify, and protect sensitive PII in S3 buckets used for model training or RAG ingestion.
- **AWS CloudTrail:** Logs every API call made across all AI services (who invoked what model, from which IP, and when) for forensic auditing.
- **AWS Artifact:** Enterprise portal providing on-demand access to AWS compliance reports, certifications, and Business Associate Agreements (BAAs) for HIPAA compliance.
- **AWS Audit Manager:** Automates continuous evidence collection to demonstrate compliance with industry frameworks and regulations (GDPR, EU AI Act, NIST AI RMF).

---

## 🎯 Test Day Traps & Exam Tips

1. **Unscored Questions:** 15 of the 65 questions are pretest items that do not count toward your score. Never stress over an unusually difficult question; maintain pace and answer every item.
2. **No Negative Marking:** Unanswered questions receive zero marks. Never leave any question blank. If uncertain, eliminate obviously flawed options and select your best guess.
3. **Qualifiers:** Always look for qualifiers: *LEAST operational overhead* usually points to serverless managed solutions (Amazon Bedrock, pre-built AI services) rather than configuring EC2 or self-managed clusters.
4. **Clarify vs Guardrails:** SageMaker Clarify is for *bias analysis and feature explainability*. Guardrails for Bedrock is for *real-time content filtering, PII redaction, and prompt injection defense*.
5. **Human Review:** If a question asks how to involve human reviewers when model confidence drops below a threshold, the correct answer is **Amazon Augmented AI (A2I)**.

---

## 🚀 Take a Timed Practice Exam

Master the concepts above by practicing with the official question pool and testing under full exam timer conditions:

[Launch Exam Crack Buddy Simulator →](/docs/ai/Exams-Prep/exam-crack-buddy/){: .btn .btn-primary }

