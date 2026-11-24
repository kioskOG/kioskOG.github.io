---
title: Why MCP?
layout: doc-page
parent: MCP
parent_url: /docs/ai/MCP/
nav_order: 1
permalink: /docs/ai/MCP/why-mcp/
description: The Paradigm Shift — Understanding why the Model Context Protocol (MCP) was created and how it solves AI fragmentation.
type: concept
tags:
- ai
- mcp
timestamp: '2026-05-11T12:04:19Z'
---

<p align="center">
  <img src="/docs/ai/MCP/images/why-mcp.png" alt="Why MCP" height="500" width="800">
</p>

# Why Model Context Protocol (MCP)?

To understand why the **Model Context Protocol (MCP)** was created, we need to understand the fundamental dilemma of modern AI: Large Language Models are brilliant reasoners, but they are completely blind to your private tools, databases, and enterprise data.

In this guide, we'll explore how AI connectivity evolved, why early approaches broke down, and how MCP introduces a universal open standard for AI integrations.

---

## 1. The Evolution of AI and the "Fragmentation" Problem

Following the release of ChatGPT in late 2022, AI adoption progressed through three distinct waves:

```mermaid
flowchart LR
    W1["Wave 1: Pure Wonder<br/>Novelty, testing prompts,<br/>curiosity and jokes"] --> W2["Wave 2: Professional Utility<br/>Writing code, drafting emails,<br/>summarizing contracts"] --> W3["Wave 3: The API Boom<br/>Embed AI inside Notion, Slack,<br/>VS Code, and custom apps"]

    style W1 fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style W2 fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc
    style W3 fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc
```

### The Problem: Walled Gardens & Tool Fragmentation
While AI was suddenly everywhere, it created a fragmented experience:
* The AI in Notion had zero idea what was being discussed in Slack.
* The AI in your IDE had no visibility into Jira tickets or GitHub PRs.
* Instead of a **unified AI assistant**, users ended up juggling 10 separate disconnected chatbots.

---

## 2. The "Context Assembly" Bottleneck: The Human API

To answer complex questions accurately, an AI needs **context**—the relevant code, schemas, documents, and business rules.

In real-world software engineering, context is scattered across multiple services:

```mermaid
flowchart TD
    Jira["Jira (Task Requirements)"]
    GitHub["GitHub (Repository Code)"]
    DB["MySQL (Database Schemas)"]
    Slack["Slack (Team Decisions)"]
    
    Dev["👨‍💻 Developer as 'Human API'<br>(Manual Copy & Paste)"]
    LLM["🤖 AI Model / Chatbot"]
    
    Jira -->|1. Copy| Dev
    GitHub -->|2. Copy| Dev
    DB -->|3. Copy| Dev
    Slack -->|4. Copy| Dev
    
    Dev -->|5. Paste massive combined prompt| LLM

    style Jira fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style GitHub fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style DB fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Slack fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc
    style Dev fill:#7f1d1d,stroke:#ef4444,stroke-width:3px,color:#f8fafc
    style LLM fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc
```

Because AI chatbots lacked direct access to these systems, developers were forced to act as **"Human APIs"**—manually copying hundreds of lines of code, database schemas, and chat logs into prompt boxes. This was tedious, error-prone, and didn't scale.

---

## 3. The First Fix: Function Calling and the $N \times M$ Trap

In 2023, model providers introduced **Function Calling (Tool Use)**. Models could now request external data: *“Run `get_github_file()`”* or *“Query `search_slack()`”*.

This was a major leap forward, but it led directly into an architectural trap: **The $N \times M$ Integration Nightmare**.

If an engineering team uses $N$ different AI clients (Claude Desktop, Cursor, ChatGPT, custom CLI agents) and connects to $M$ different data systems (GitHub, Slack, Jira, Postgres), developers have to write and maintain **$N \times M$ custom integrations**:

```mermaid
flowchart TB
    subgraph Problem["❌ The N × M Custom Integration Nightmare"]
        direction LR
        A1["Claude Desktop"] --- S1["GitHub"]
        A1 --- S2["Slack"]
        A1 --- S3["Postgres"]
        A2["Cursor IDE"] --- S1
        A2 --- S2
        A2 --- S3
        A3["CLI Agent"] --- S1
        A3 --- S2
        A3 --- S3
    end

    subgraph Solution["✅ The N + M Standard (Model Context Protocol)"]
        direction TB
        subgraph Clients["AI Clients (N)"]
            C1["Claude Desktop"]
            C2["Cursor IDE"]
            C3["CLI / Agent"]
        end
        
        MCP["🔌 Model Context Protocol (Universal Open Standard)"]
        
        subgraph Servers["MCP Servers (M)"]
            SV1["GitHub MCP"]
            SV2["Slack MCP"]
            SV3["Postgres MCP"]
        end
        
        Clients <==> MCP
        MCP <==> Servers
    end

    style Problem fill:#0f172a,stroke:#ef4444,stroke-width:2px,color:#f8fafc
    style Solution fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#f8fafc
    style MCP fill:#78350f,stroke:#fbbf24,stroke-width:3px,color:#f8fafc
    style Clients fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc
    style Servers fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc
    style A1 fill:#1e293b,stroke:#38bdf8,stroke-width:1px,color:#f8fafc
    style A2 fill:#1e293b,stroke:#38bdf8,stroke-width:1px,color:#f8fafc
    style A3 fill:#1e293b,stroke:#38bdf8,stroke-width:1px,color:#f8fafc
    style S1 fill:#1e293b,stroke:#ef4444,stroke-width:1px,color:#f8fafc
    style S2 fill:#1e293b,stroke:#ef4444,stroke-width:1px,color:#f8fafc
    style S3 fill:#1e293b,stroke:#ef4444,stroke-width:1px,color:#f8fafc
    style C1 fill:#1e293b,stroke:#38bdf8,stroke-width:1px,color:#f8fafc
    style C2 fill:#1e293b,stroke:#38bdf8,stroke-width:1px,color:#f8fafc
    style C3 fill:#1e293b,stroke:#38bdf8,stroke-width:1px,color:#f8fafc
    style SV1 fill:#064e3b,stroke:#34d399,stroke-width:1px,color:#f8fafc
    style SV2 fill:#064e3b,stroke:#34d399,stroke-width:1px,color:#f8fafc
    style SV3 fill:#064e3b,stroke:#34d399,stroke-width:1px,color:#f8fafc
```

### Why $N \times M$ Integrations Break Down:
* **Duplicated Engineering**: Every single AI client has to reinvent authentication, schema mapping, and error handling for the same APIs.
* **Fragile Maintenance**: Whenever Slack or GitHub updates an API endpoint, dozens of custom scripts break across different tools.
* **Security Nightmare**: API secrets and access tokens are scattered across multiple individual tools and local configurations.

---

## 4. The Solution: Model Context Protocol (MCP)

To solve the integration explosion, **Anthropic** open-sourced the **Model Context Protocol (MCP)** in late 2024.

MCP is to AI applications what **HTTP** was to the World Wide Web or what **LSP (Language Server Protocol)** was to code editors. It defines a clean, standardized **Client-Server architecture**:

```mermaid
flowchart LR
    Client["💻 MCP Client<br>(Cursor, Claude Desktop, Antigravity)<br>───────────────────<br>• User interface<br>• LLM orchestration<br>• Decides which tool to call"]
    
    Protocol["🔌 Transport Layer<br>(JSON-RPC 2.0)<br>stdio or HTTP/SSE"]
    
    Server["⚙️ MCP Server<br>(GitHub, Slack, SQLite, Filesystem)<br>───────────────────<br>• Exposes Tools, Resources, Prompts<br>• Manages authentication<br>• Executes operations locally or remotely"]

    Client <==> Protocol <==> Server

    style Client fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#f8fafc
    style Protocol fill:#78350f,stroke:#fbbf24,stroke-width:2px,color:#f8fafc
    style Server fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc
```

### The Architectural Shift
* **Build Once, Run Anywhere**: A developer or SaaS provider writes an MCP server **once**. It immediately works with Claude Desktop, Cursor, Continue, Antigravity, and any other MCP-compliant client.
* **Zero Client Maintenance**: The client doesn't need to know how GitHub's REST API works; it only needs to speak MCP.
* **Granular Security**: The MCP server controls what resources are exposed, requiring user confirmation for sensitive actions.

---

## 5. Summary & Key Takeaways

{: .note}
> **The One-Line Takeaway:**  
> MCP transforms AI connectivity from brittle, point-to-point integrations into a plug-and-play universal open standard.

| Aspect | Traditional Function Calling | Model Context Protocol (MCP) |
| :--- | :--- | :--- |
| **Architecture** | Point-to-point, bespoke per tool | Standardized Client-Server protocol |
| **Complexity** | $N \times M$ custom integrations | $N + M$ universal interfaces |
| **Transport** | Custom HTTP scripts | Standardized `stdio` or `HTTP with SSE` |
| **Maintenance** | Client developers maintain every API | Server authors maintain their own service |
| **Ecosystem** | Walled gardens | Open, interoperable community standard |

---

## Next Steps

Now that you understand the motivation behind MCP:
* Learn how clients and servers establish connections in [The MCP Lifecycle](/docs/ai/MCP/MCP-Lifecycle/).
* Build and test your own server in [Build a Local MCP Server with FastMCP](/docs/ai/MCP/Build-local-mcp-server/).
