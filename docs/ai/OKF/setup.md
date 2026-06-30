---
title: Google Open Knowledge Format (OKF) Setup Guide
layout: doc-page
parent: AI | Jatin Sharma
nav_order: 3
permalink: /docs/ai/OKF/setup/
description: A comprehensive guide on setting up and managing a personal or organizational knowledge base using the Google Open Knowledge Format (OKF) for AI agent consumption.
type: concept
tags:
- ai
- okf
- documentation
timestamp: '2026-06-30T12:56:16Z'
---

# 🧠 Setting Up a Google Open Knowledge Format (OKF) Knowledge Base

The **Open Knowledge Format (OKF)** is a vendor-neutral, open-source specification introduced by Google Cloud in June 2026. It standardizes how organizational documentation is structured so that it is easily discoverable, traversable, and readable by both humans and AI agents.

This guide walks you through setting up an OKF-compliant knowledge base from scratch or migrating an existing Markdown wiki.

---

## 💡 The Core Philosophy

OKF relies on the **"LLM-Wiki"** design pattern. It operates under three core constraints:
1. **"Just Markdown"**: Content is written in plain Markdown. It can be read in any editor (Obsidian, VS Code, Vim) and renders natively on GitHub/Jekyll.
2. **"Just Files"**: Documentation is stored directly in a file folder structure. It requires no databases, proprietary APIs, or active runtimes to read.
3. **"Just YAML Frontmatter"**: Metadata is attached as a small header block at the top of each file, allowing agents to query files using structured metadata without parsing the entire body.

---

## 📁 1. Directory Structure

A typical OKF repository represents a **knowledge bundle**. Here is how to organize it:

```
my-knowledge-base/
├── index.md                 # Root index describing the bundle
├── log.md                   # Chronological changelog (optional)
├── devops/                  # Category directories
│   ├── kubernetes/
│   │   ├── index.md         # Directory index page
│   │   ├── eks-logging.md   # Concept note
│   │   └── ingress.md       # Concept note
└── ai/
    ├── RAG/
    │   ├── RAG.md           # RAG overview node
    │   └── vector-stores.md # Concept note
```

---

## 📝 2. YAML Frontmatter Specification

Every non-reserved `.md` file in an OKF bundle must contain a parseable YAML frontmatter block at the very top, enclosed by triple dashes (`---`).

### Conformance (OKF v0.1)

| Field | Type | Description | Mandatory | Example |
| :--- | :--- | :--- | :--- | :--- |
| `type` | String | The type of document. Recommended: `concept` (default node) or `index` (folders/landing pages). | **Yes** | `type: concept` |
| `title` | String | The human-readable title of the document. | Recommended | `title: "Kubernetes Ingress"` |
| `description` | String | A short summary of the page content. | Recommended | `description: "Guide to Ingress"` |
| `tags` | Array | Category tags for metadata filtering. | Recommended | `- devops`<br>`- kubernetes` |
| `timestamp` | String | ISO 8601 creation/modification timestamp. | Recommended | `timestamp: '2026-06-30T12:00:00Z'` |
| `parent` | String | The title of the parent page. | Optional | `parent: "Kubernetes Projects"` |
| `parent_url` | String | The permalink of the parent page. | Optional | `parent_url: /docs/devops/k8s/` |

### Code Example

```yaml
---
title: AWS Network Firewall Egress Filtering
layout: doc-page
permalink: /docs/devops/aws-firewall/
parent: AWS Cloud Platform
type: concept
tags:
- devops
- cloud
- aws
timestamp: '2026-06-30T12:00:00Z'
---
```

---

## 🔗 3. Creating the Knowledge Graph (Linking)

Nodes are connected into a network (the "Brain") using standard Markdown links. 

* **Explicit Connections**: Use relative or absolute path-based markdown links inside your document body:
  ```markdown
  In the last guide, we covered [document loaders](/docs/ai/RAG/Document-loaders/).
  ```
* **Hierarchical Connections**: Use `parent` and `parent_url` frontmatter variables to draw structural lines. This links child guides to their index maps automatically, preventing orphaned or "scattered" nodes.

---

## 🤖 4. Integrating with AI Agents

Once your knowledge base conforms to the OKF format, you can connect it directly to LLMs and AI agents.

### A. Model Context Protocol (MCP)
Expose the repository folder to your AI agent using the standard **Filesystem MCP Server** (supported natively by Claude Desktop, LobeChat, Cursor, and Gemini IDEs). 

The agent can then use tool calls to navigate the folder, read the frontmatter `tags` and `parent` fields, and follow the links to gather complete contextual answers:
```json
{
  "name": "view_file",
  "arguments": {
    "path": "/my-knowledge-base/ai/RAG/vector-stores.md"
  }
}
```

### B. Vector Database Retrieval (RAG)
When loading the markdown files into a vector index (e.g. Pinecone, Qdrant) via LangChain or LlamaIndex:
1. Parse the YAML header.
2. Store the frontmatter fields as **Metadata Attributes**.
3. Perform targeted vector search with filters:
   ```python
   # Example: Retrieve only concepts related to RAG
   retriever.get_relevant_documents(
       "How do vector stores work?",
       filter={"tags": "rag", "type": "concept"}
   )
   ```

---

## 🛠️ 5. Migrating an Existing Folder (Bulk Update)

If you have a folder full of plain markdown files, you can use this Python script to automatically scan the files and append compliant OKF frontmatter variables:

```python
import os
import re
import yaml
from datetime import datetime

DOCS_DIR = "./docs" # Replace with your folder path

def get_tags_from_path(filepath):
    rel_path = os.path.relpath(filepath, DOCS_DIR)
    parts = rel_path.split(os.sep)[:-1]
    tags = [p.lower().replace("-", " ").strip() for p in parts if p]
    return tags if tags else ["wiki"]

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        frontmatter_data = {}
        body = content
    else:
        frontmatter_str = match.group(1)
        body = content[match.end():]
        try:
            frontmatter_data = yaml.safe_load(frontmatter_str) or {}
        except Exception:
            return
            
    # Set OKF variables
    filename = os.path.basename(filepath).lower()
    is_index = filename in ["index.md", "readme.md"]
    
    if "type" not in frontmatter_data:
        frontmatter_data["type"] = "index" if is_index else "concept"
    if "tags" not in frontmatter_data:
        frontmatter_data["tags"] = get_tags_from_path(filepath)
    if "timestamp" not in frontmatter_data:
        mtime = os.path.getmtime(filepath)
        dt = datetime.fromtimestamp(mtime)
        frontmatter_data["timestamp"] = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
        
    try:
        new_fm = yaml.dump(frontmatter_data, default_flow_style=False, sort_keys=False, allow_unicode=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"---\n{new_fm}---{body}")
        print(f"Migrated: {filepath}")
    except Exception as e:
        print(f"Error: {e}")

# Walk directories and update
for root, _, files in os.walk(DOCS_DIR):
    for file in files:
        if file.endswith(".md"):
            migrate_file(os.path.join(root, file))
```
