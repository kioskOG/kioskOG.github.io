---
title: Retrievers in RAG
layout: doc-page
parent: RAG
parent_url: /docs/ai/RAG/
nav_order: 6
permalink: /docs/ai/RAG/Retrievers/
description: A practical, beginner-friendly guide to Retrievers, search strategies, MMR, reranking, and hybrid search in LangChain.
type: concept
tags:
- ai
- rag
timestamp: '2026-07-04T10:37:00Z'
---

# Retrievers in RAG: Fetching the Right Context

In previous guides, we learned how to [load documents](/docs/ai/RAG/Document-loaders/), [split them into chunks](/docs/ai/RAG/Text-Splitters/), [generate embeddings](/docs/ai/RAG/Embeddings/), and [store vectors in a vector database](/docs/ai/RAG/Vector-Stores/).

Now comes the critical bridge between storage and answer generation: **Retrievers**.

A **Retriever** is responsible for taking a user's question, searching through thousands (or millions) of stored chunks, and returning the most accurate, relevant snippets to inject into the LLM's prompt.

---

## The Big Picture: Where Retrievers Fit

Notice how Retrievers sit at the extraction boundary—pulling relevant chunks out of the vector database to feed prompt augmentation:

```mermaid
flowchart TD
    Docs["Documents"] --> Chunk["Chunking"]
    Chunk --> Embed["Embeddings"]
    Query["User Query"] --> QEmbed["Query Embedding"]
    Embed --> VDB["Vector Database"]
    QEmbed --> VDB
    VDB --> Chunks["Relevant Chunks<br/><b>(Our Focus: Retrieval & Reranking)</b>"]
    Chunks --> Prompt["Prompt Augmentation"]
    Prompt --> Response["LLM Response"]

    style Docs fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Chunk fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc
    style Embed fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Query fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style QEmbed fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style VDB fill:#78350f,stroke:#fbbf24,stroke-width:2px,color:#f8fafc
    style Chunks fill:#064e3b,stroke:#34d399,stroke-width:3px,color:#f8fafc
    style Prompt fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Response fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc
```

---

## Vector Store vs. Retriever: What's the Difference?

A common point of confusion for beginners is distinguishing between a **Vector Store** and a **Retriever**:

```mermaid
flowchart TD
    subgraph VS["Vector Store (Chroma, Pinecone, FAISS)"]
        V1["• Physical storage engine on disk/cloud"]
        V2["• Stores vectors, text, and metadata"]
        V3["• Handles CRUD operations (insert, delete, update)"]
    end
    
    subgraph RT["Retriever (LangChain Runnable Interface)"]
        R1["• A lightweight query interface"]
        R2["• Input: String (User Query)"]
        R3["• Output: List of relevant Document objects"]
        R4["• Plugs directly into LangChain LCEL chains via .invoke()"]
    end
    
    VS -->|"vector_store.as_retriever()"| RT

    style VS fill:#0f172a,stroke:#fbbf24,stroke-width:2px,color:#f8fafc
    style V1 fill:#1e293b,stroke:#fbbf24,stroke-width:1px,color:#f8fafc
    style V2 fill:#1e293b,stroke:#fbbf24,stroke-width:1px,color:#f8fafc
    style V3 fill:#1e293b,stroke:#fbbf24,stroke-width:1px,color:#f8fafc

    style RT fill:#0f172a,stroke:#34d399,stroke-width:2px,color:#f8fafc
    style R1 fill:#064e3b,stroke:#34d399,stroke-width:1px,color:#f8fafc
    style R2 fill:#064e3b,stroke:#34d399,stroke-width:1px,color:#f8fafc
    style R3 fill:#064e3b,stroke:#34d399,stroke-width:1px,color:#f8fafc
    style R4 fill:#064e3b,stroke:#34d399,stroke-width:1px,color:#f8fafc
```

{: .tip}
> **Simple Rule:** A **Vector Store** holds the data and provides basic mathematical distance calculations. A **Retriever** is an abstraction layer that knows *how to search*, filter, and re-order chunks smartly before passing them to the model.

---

## Core Retrieval Strategies

### 1. Standard Similarity Search
The default approach: convert the user query into a vector and return the top-$K$ chunks with the smallest distance.

* **Pros:** Fast and simple.
* **The Problem:** It often returns redundant, nearly duplicate passages (e.g., three chunks that say almost the exact same thing from different pages).

---

### 2. Maximal Marginal Relevance (MMR)
When answering complex questions, you want context that is both **relevant** to the prompt and **diverse** in content.

**Maximal Marginal Relevance (MMR)** balances two forces:
1. Finding chunks highly similar to the query.
2. Penalizing chunks that look too similar to already selected chunks.

```mermaid
flowchart TD
    Q["User Query: 'How to install and troubleshoot Python on Mac?'"] --> Search["Fetch Top 20 Candidates"]
    Search --> MMR{"MMR Selection Algorithm"}
    MMR --> C1["Chunk 1: macOS Installation steps (High Relevance)"]
    MMR --> C2["Chunk 2: Troubleshooting common PATH errors (High Diversity)"]
    MMR -. Rejects .-> Dup["Chunk 3: Another copy of installation steps (Redundant!)"]

    style Q fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Search fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style MMR fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc
    style C1 fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc
    style C2 fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc
    style Dup fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#f8fafc
```

{: .note}
> **When to use MMR:** Whenever your documents contain repeated boilerplate text or when questions require multi-faceted answers.

---

### 3. Similarity Score Threshold
Instead of returning a fixed number of chunks (e.g., always returning 4 chunks, even if 3 of them are irrelevant), this strategy only keeps chunks whose similarity score meets a minimum confidence bar.

```python
retriever = vector_store.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"score_threshold": 0.75, "k": 5}
)
```

---

## Advanced Retrieval Techniques

In real-world production systems, basic semantic search alone can sometimes fail. Here are three powerful techniques to improve search quality:

### A. Contextual Compression & Reranking
Embedding models are "bi-encoders"—they compress an entire chunk into a single vector, which can occasionally miss fine nuances.

A **Reranker** (using a Cross-Encoder) evaluates the query and document together at the token level, calculating an extremely precise relevance score:

```mermaid
flowchart LR
    Q["User Query"] --> FastSearch["1. Vector DB Fast Retrieval<br>(Fetch top 25 candidate chunks)"]
    FastSearch --> Reranker["2. Cross-Encoder Reranker<br>(e.g. Cohere, BGE, FlashRank)"]
    Reranker --> TopK["3. Top 3 Ultra-Relevant Chunks<br>passed to LLM"]

    style Q fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style FastSearch fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Reranker fill:#78350f,stroke:#fbbf24,stroke-width:2px,color:#f8fafc
    style TopK fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc
```

* **Best of both worlds:** Vector search quickly narrows down 1,000,000 chunks to 25; the reranker then precisely picks the top 3.

---

### B. Hybrid Search: Keywords (BM25) + Semantic Vectors
Semantic search is great at understanding concepts, but poor at exact keyword matching (like part numbers, error codes `ERR-4048`, product SKUs, or specialized drug names).

**Hybrid Search** runs two parallel searches:
1. **BM25 Search**: Matches exact keywords and codes.
2. **Dense Vector Search**: Matches meaning and synonyms.

Both lists of results are merged using **Reciprocal Rank Fusion (RRF)**:

```mermaid
flowchart TD
    Query["User Query: 'Replace sensor SN-9821 error code'"] --> BM25["Keyword Search (BM25)<br>Finds exact string 'SN-9821'"]
    Query --> Vector["Vector Search<br>Finds conceptual meaning of sensor replacement"]
    
    BM25 --> RRF["Reciprocal Rank Fusion (RRF)"]
    Vector --> RRF
    
    RRF --> Combined["Unified Best Chunks"]

    style Query fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style BM25 fill:#78350f,stroke:#fbbf24,stroke-width:2px,color:#f8fafc
    style Vector fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc
    style RRF fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Combined fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc
```

---

### C. Multi-Query Retrieval
Users rarely write optimal search queries on their first try. A **Multi-Query Retriever** uses an LLM to generate 3 to 4 variations of the user's question, searches for all variations, and pools the unique results:

```mermaid
flowchart TD
    UserQuery["User Query: 'How to save money on taxes?'"] --> LLM["LLM Prompt Expansion"]
    LLM --> V1["Variation 1: 'Legal tax deduction strategies'"]
    LLM --> V2["Variation 2: 'Retirement accounts tax benefits'"]
    LLM --> V3["Variation 3: 'Self-employed write-offs'"]
    
    V1 --> Ret["Vector Store Search"]
    V2 --> Ret
    V3 --> Ret
    
    Ret --> Dedupe["Deduplicate & Merge Context"]

    style UserQuery fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style LLM fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc
    style V1 fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style V2 fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style V3 fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Ret fill:#78350f,stroke:#fbbf24,stroke-width:2px,color:#f8fafc
    style Dedupe fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc
```

---

## Hands-on Code: Using Retrievers in LangChain

Let's see how simple it is to turn a Chroma vector store into different types of retrievers:

```python
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

# 1. Sample documents
docs = [
    Document(page_content="The Python return keyword exits a function and optionally passes back a value."),
    Document(page_content="Functions in Python can return multiple values as a tuple."),
    Document(page_content="To define a function in Python, use the def keyword followed by function name."),
    Document(page_content="List comprehensions provide a concise way to create lists in Python.")
]

# 2. Build Chroma vector store
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vector_store = Chroma.from_documents(docs, embeddings)

# ----------------------------------------------------
# Strategy 1: Standard Top-K Similarity Retriever
# ----------------------------------------------------
print("--- 1. Standard Similarity Retriever ---")
basic_retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 2}
)

results = basic_retriever.invoke("How do functions return data?")
for doc in results:
    print("->", doc.page_content)

# ----------------------------------------------------
# Strategy 2: Maximal Marginal Relevance (MMR)
# ----------------------------------------------------
print("\n--- 2. MMR Retriever (Diverse Results) ---")
mmr_retriever = vector_store.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 2, "fetch_k": 4, "lambda_mult": 0.5}
)

mmr_results = mmr_retriever.invoke("How do functions return data?")
for doc in mmr_results:
    print("->", doc.page_content)
```

{: .tip}
> **Notice `.invoke()`:** Every LangChain retriever implements the Runnable interface. You simply pass a string query to `.invoke(query)`, and it returns a `List[Document]`.

---

## Summary & Next Step

| Retriever Strategy | When to Choose |
| :--- | :--- |
| **Similarity Search** | Fast, standard queries with non-redundant source documents |
| **MMR (Maximal Marginal Relevance)** | Complex queries where you want diverse perspectives without duplicate text |
| **Reranking / Cross-Encoder** | Mission-critical enterprise search where precision must be maximized |
| **Hybrid Search (BM25 + Dense)** | When documents contain exact IDs, SKUs, error codes, and technical jargon |

Now that we know how to fetch high-quality context, let's connect all the pieces together into a complete [End-to-End RAG Pipeline](/docs/ai/RAG/End-to-End-RAG/)!
