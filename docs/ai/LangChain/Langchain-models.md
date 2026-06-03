---
title: LangChain Models
layout: doc-page
parent: LangChain
parent_url: /docs/ai/LangChain/
nav_order: 3
permalink: /docs/ai/LangChain/Langchain-models/
description: LangChain Models
---

<p align="center">
  <img src="/docs/ai/LangChain/images/Langchain-models.png" alt="Langchain-models" height=600 width="900">
</p>

### Introduction to the LangChain Model Component

The biggest friction point in AI engineering is that every AI company (OpenAI, Google, Anthropic) builds their APIs differently. The **Models Component** in LangChain solves this by acting as a universal, common interface. Once you learn LangChain's syntax, you can swap out an OpenAI model for a Google model by changing just a single line of code, while keeping the rest of your application logic identical. 

LangChain divides all AI models into two distinct categories: **Language Models** and **Embedding Models**.

* **Language Models:** Interfaces designed to process text-based inputs and generate text-based outputs, facilitating natural language reasoning.

* **Embedding Models:** Specialized models that transform discrete text into Contextual Vectors (numerical arrays), capturing semantic meaning for search and retrieval.

---

### Pillar 1: Language Models (Text-in, Text-out)
Language models process text and return text, making them ideal for chatbots, summarization, and coding assistants. However, you must understand a critical architectural shift happening right now: the distinction between **LLMs** and **Chat Models**.

**1. Traditional LLMs (Legacy)**

*   **Mechanics:** These are general-purpose models that take a simple string of text as input and return a string of text as output. 

*   **The Problem:** They are "stateless," meaning they have no memory of past conversations, and they cannot be assigned specific system roles.

*   **Status:** LangChain is actively deprecating support for standard LLMs. For new projects, it is highly recommended to avoid them. 

**2. Chat Models (The Modern Standard)**
*   **Mechanics:** These are specialized for multi-turn conversations. Instead of a single string, they take a **sequence of messages** as input. 

*   **Superpowers:** Chat models support conversation history and **Role Awareness**. You can assign them system-level personas (e.g., "You are a knowledgeable doctor"), which fundamentally alters how they process the user's input. 

**Key Configuration Parameters:**

When configuring your Language Models, you have two primary levers to control their behavior:
*   **Temperature (0.0 to 1.5+):** This controls the model's randomness and creativity. Use a low value (0.0 - 0.3) for deterministic tasks like coding or math, and a higher value (0.9+) for creative tasks like story writing.

Temperature Controls the randomness of the token selection process.

{: .note}
>
| Range | Classification | Use Case |
| ---- | ---------- | --- |
| 0.0 - 0.3 | Deterministic | Factual Q&A, Code Generation, Mathematical Logic |
| 0.5 - 0.7 | Balanced | General technical explanations and natural dialogue |
| 0.9 - 1.2 | Creative | Storytelling, Marketing copy, Joke generation |
| 1.5+ | Experimental | High-variance brainstorming and ideation |


*   **Max Tokens:** This restricts the maximum length of the output, which is crucial for managing your API costs. It is a vital cost-control mechanism, especially for high-volume production systems using OpenAI or Anthropic where charges are per 1M tokens.

---

### Pillar 2: Embedding Models (Text-in, Vector-out)

Embedding models do not answer questions. Instead, you give them text, and they return an array of numbers (a vector). This is the foundational technology behind **Semantic Search** and Retrieval-Augmented Generation (RAG).

*   **How it Works:** By converting a document into a dense mathematical vector (e.g., 300 or 384 dimensions), the model captures the deeply contextual meaning of the text. *Dimensions are depends on the model you are using.*

*   **Document Similarity:** To find the answer to a user's question within a private database, you convert the user's query into a vector, and use **Cosine Similarity** (via libraries like `scikit-learn`) to calculate the angle between the query vector and your document vectors. The document with the highest similarity score contains your answer.

---

### Pillar 3: Deployment Architecture (Closed vs. Open Source)

As an engineer, you must choose where your models run.

{: .note }
>
**1. Closed-Source (Proprietary)**

*   **Examples:** OpenAI (GPT-4), Anthropic (Claude 3.5), Google (Gemini 2.5 Pro).

*   **Pros/Cons:** You access these via paid APIs (paying per token). They are highly refined, but you have zero control over the infrastructure, and you must send your data to external servers.

{: .note }
>
**2. Open-Source**

Open-source models provide an alternative to the "black box" nature of proprietary APIs, though they come with distinct trade-offs.


*   **Examples:** LLaMA, Falcon, TinyLlama. The central hub for these models is **Hugging Face**.

{: .note }
>
Strategic Advantages of Open Source
>
>   1. Cost Sovereignty: Eliminates per-token billing in favor of infrastructure costs.
>  
>   2. Full Control: Access to model weights allows for deep fine-tuning and hosting flexibility.
>   
>   3. Data Privacy: Compliance-heavy industries can process data within local VPCs.
>   
>   4. Customization: Fine-tuning on proprietary data exceeds the capabilities of standard prompting.
>   
>   5. Refinement Gap: Note that OS models often lack the extensive RLHF (Reinforcement Learning from Human Feedback) found in GPT-4, potentially leading to less "polished" responses.


### Integration Methods

1. Hugging Face Inference API (`HuggingFaceEndpoint`): Remote execution on Hugging Face infrastructure. Best for quick prototyping.

2. Local Execution (`HuggingFacePipeline`): Downloads the model to local hardware.
  * Hardware Realities: Running a model like TinyLlama (1.1B parameters) on consumer-grade hardware is taxing. In testing, inference can take upwards of 10 minutes on standard CPU/RAM setups without dedicated GPU acceleration.


### Embedding Models and Vector Representation

Embeddings convert text into high-dimensional vectors, enabling mathematical comparison of "meaning."

Core Generation Methods

* embed_query: Optimized for single-sentence processing (e.g., a search query).
* embed_documents: Optimized for batch processing of multiple text blocks.

Vector Dimensions and Contextual Capture

The choice of model dictates the "Vector Dimension" size, which represents the resolution of the semantic space:

* 384 Dimensions: Standard for all-MiniLM-L6-v2. High speed, lower resolution.
* 3072 Dimensions: The default for text-embedding-3-large. Captures deep nuance but increases storage and search latency.


### Engineering Best Practices
Before you write your code, always set up a secure environment:

1.  **Virtual Environments:** Always create an isolated Python environment (`python -m venv venv`) to avoid dependency conflicts.

2.  **Secret Management:** Never hardcode your API keys. Use a `.env` file and the `dotenv` library to securely load keys at runtime.

3.  **The `invoke` Method:** Whether you are using a Chat Model or an Embedding Model, LangChain relies heavily on the universal `.invoke()` method to trigger the model's processing. 

Review the formal Mastery Document artifact once it finishes generating, and let me know if you would like to test your knowledge with a custom quiz or flashcards!

