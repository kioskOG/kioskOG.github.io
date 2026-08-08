---
title: How to Use Open Router Free Models With Claude Code
layout: doc-page
parent: Claude Code
parent_url: /docs/ai/Claude/
nav_order: 3
permalink: /docs/ai/Claude/open-router-free-models-claude-code/
description: Use free models from OpenRouter with Claude Code to cut AI costs.
type: concept
tags:
- ai
- claude
- open-router-free-models-claude-code
timestamp: '2026-08-06T01:20:20Z'
---

> Configure Claude Code to route through Open Router's free model tier instead of Anthropic's paid API. A step-by-step guide with the exact settings.json setup.

## Prerequisites

1. Claude Code installed You need Claude Code (the Anthropic CLI coding assistant) already working on your machine. It should be runnable via the claude command in your terminal.

2. An OpenRouter account and API key Sign up at openrouter.ai — it’s free. Once logged in, go to Keys in your dashboard and create a new API key. Copy it and keep it somewhere accessible.

3. Know where your Claude config lives Claude Code stores its settings in ~/.claude/settings.json on Mac/Linux, or C:\Users\<YourName>\.claude\settings.json on Windows. The directory might not exist yet if you haven’t customized anything — you’ll create it.

## Step-by-Step Configuration

### Step 1 — Create the Configuration Directory (If Missing)
For this setup we will setup project based configuration. This will help us to setup claude code in different projects. We will use `spendly` project for this setup. If you don't have the project, you can download it from [here](/docs/ai/Claude/assets/expense-tracker.zip).

Open your terminal and run:

```bash
unzip expense-tracker.zip
cd expense-tracker
mkdir .claude
touch .claude/settings.local.json
```

## Step 2 - Edit `.claude/settings.local.json` and add this content:
```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
    "ANTHROPIC_AUTH_TOKEN": "sk-or-v1-YOUR_OPENROUTER_KEY_HERE",
    "ANTHROPIC_API_KEY": "",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "nvidia/nemotron-3-ultra-550b-a55b:free", # This will be used as default Sonnet model
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "nvidia/nemotron-3-ultra-550b-a55b:free" # This will be used as default Opus model
  },
  "model": "nvidia/nemotron-3-ultra-550b-a55b:free" # This will be used as default model
}
```

{: .tip}
> remove the comments from above json. and replace with your own openrouter api key and model.

By default, Claude Code will try to use its configured Claude model. But since you’re now pointing at OpenRouter, you need to specify an OpenRouter-compatible model ID.


## Step 3: Test the Connection

```bash
claude --settings .claude/settings.local.json
# Then ask your question

# or

claude "Write a one-line Python function that returns the factorial of a number"
```
