---
title: LangChain Components
layout: doc-page
parent: LangChain
parent_url: /docs/ai/LangChain/
nav_order: 2
permalink: /docs/ai/LangChain/Langchain-Components/
description: LangChain Components
type: concept
tags:
- ai
- langchain
timestamp: '2026-05-11T12:04:19Z'
---


<p align="center">
  <img src="/docs/ai/LangChain/images/Langchain-Components.png" alt="Langchain-Components" height=600 width="900">
</p>


### The Big Picture: Why LangChain?
LangChain is an open-source framework designed to help you build applications powered by Large Language Models (LLMs). Building an LLM application from scratch requires writing complex code to manage the interactions between different system components. LangChain acts as an **orchestration layer** that automates this heavy lifting, allowing you to build sophisticated pipelines with minimal code. 

Crucially, LangChain is a **model-agnostic framework**. This means if you build an app using OpenAI's models, but later decide that Google's Gemini or Anthropic's Claude is cheaper or better, you can swap out the AI provider by changing just one or two lines of code. 

To master LangChain, you must master its **Six Core Components**. 

1. Models
2. Prompts
3. Chains
4. Memory
5. Indexes
6. Agents

---

### Pillar 1: Models (The Core Interface)
The Models component is the fundamental interface that standardizes how your application communicates with AI. Historically, interacting with different LLM APIs (like OpenAI vs. Anthropic) required completely different code structures, making it difficult to switch providers. LangChain wraps these different APIs into one unified standard.

There are two primary types of models you will interact with:

*   **Language Models:** These follow a "text-in, text-out" philosophy. You give them a text prompt, and they generate a text response (perfect for chatbots and agents).

*   **Embedding Models:** These follow a "text-in, vector-out" philosophy. They convert text into mathematical vectors, which is essential for performing semantic search over data.

### Pillar 2: Prompts (The Steering Wheel)

An LLM's output is incredibly sensitive to the exact phrasing of your input (the prompt); even changing a single word like asking for an "academic" tone versus a "fun" tone will drastically alter the result. LangChain provides powerful tools to engineer and manage these inputs:

*   **Dynamic and Reusable Prompts:** You can create prompt templates with variables (e.g., `Summarize {topic} in a {tone} tone`), allowing you to inject different topics and emotions on the fly without rewriting the whole prompt.

*   **Role-Based Prompts:** You can define a system-level persona (e.g., "You are an experienced doctor") to strictly guide the model's behavior before passing it the user's specific query.

*   **Few-Shot Prompting:** For complex tasks (like classifying customer support tickets into 'billing' or 'technical' issues), you can pass the model several examples of correct inputs and outputs *before* passing the real user query, significantly improving accuracy.

### Pillar 3: Chains (The Pipeline Builders)

Chains are the pipelines of LangChain. If you design an app that translates English text to Hindi, and then summarizes that Hindi text, doing this manually requires catching the output of the first model and actively feeding it into the second. Chains automate this entire data flow so that the output of one component automatically becomes the input for the next.

*   **Sequential Chains:** Executing tasks one after the other (like the translate-then-summarize example).

*   **Parallel Chains:** Sending an input to multiple models simultaneously and then combining their outputs into a single cohesive report.

*   **Conditional Chains:** Adding "if/then" logic to your pipeline (e.g., if user feedback is positive, trigger a 'thank you' action; if negative, trigger an email to customer support).

### Pillar 4: Indexes (The Knowledge Bridge)

Standard LLMs like ChatGPT cannot answer questions about your company's private leave policies or proprietary codebases because they were never trained on that private data. Indexes solve this by connecting your application to external knowledge sources. This relies on four sub-components:

1.  **Document Loaders:** Tools to fetch your raw data from sources like PDFs, websites, or databases.

2.  **Text Splitters:** Because you cannot feed a 1,000-page document to an LLM at once, text splitters break the document down into smaller, searchable chunks (e.g., by paragraph or page).

3.  **Vector Stores:** Databases specifically designed to store the mathematical embeddings of your chunked text.

4.  **Retrievers:** When a user asks a question, the retriever converts the query into a vector, performs a semantic search against the Vector 
Store, and fetches only the most relevant chunks to send to the LLM.

### Pillar 5: Memory (The Context Keeper)

By default, LLM API calls are completely "stateless". This means every time you ask a question, the model treats it as an independent event with zero memory of the prior conversation. The Memory component injects conversation history back into your API calls so your bot can maintain context. 

*   **Conversation Buffer Memory:** Stores and sends the entire chat history with every new query (though this can get expensive due to high token usage).

*   **Conversation Buffer Window Memory:** Only remembers the last *N* interactions (e.g., the last 10 messages) to save costs while maintaining recent context.

*   **Summarizer-based Memory:** Uses an LLM to constantly maintain a condensed summary of the entire chat history, which is passed along with each new prompt.

### Pillar 6: Agents (LLMs with Superpowers)

The ultimate evolution of an LLM application is an AI Agent. While a standard chatbot can simply *talk* to you (e.g., suggesting a travel destination), an Agent can actually *do work for you* (e.g., finding the cheapest flight and actively booking it).

Agents have two distinct superpowers: **Reasoning** and **Access to Tools**. 
If you ask an agent to "multiply today's temperature in Delhi by 3", it uses a reasoning framework (like "Chain of Thought") to break the problem down into steps. It realizes it first needs a **Weather API Tool** to fetch the temperature in Delhi (e.g., 25 degrees). Then, it realizes it needs a **Calculator Tool** to multiply 25 by 3 to give you the final answer of 75. 

