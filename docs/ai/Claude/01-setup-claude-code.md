---
title: Setup Claude Code
layout: doc-page
parent: Claude Code
parent_url: /docs/ai/Claude/
nav_order: 1
permalink: /docs/ai/Claude/setup-claude-code/
description: Step-by-step guide to installing Claude Code, setting up a Flask project, pushing to GitHub, and exploring free Ollama alternatives for students.
type: concept
tags:
- ai
- claude
- setup-claude-code
timestamp: '2026-08-06T01:20:20Z'
---

# Setup Claude Code

This guide walks you through installing Claude Code, setting up the project we'll build throughout this series, and running it locally. **Follow every step carefully** — by the end, your environment will be fully ready.

{: .important}
> This is the **foundation episode** of the series. Everything we build later depends on the setup done here. Don't skip any step.

---

## 🧩 What is Claude Code?

Claude Code is a terminal-based AI coding agent built by Anthropic. Unlike Copilot or Cursor, Claude Code doesn't just complete lines — it **reads your entire project**, understands the codebase, and executes multi-step tasks autonomously using tools like file editing, Bash execution, and web search.

{: .note}
> Claude Code runs directly in your terminal and integrates with any editor — VS Code, Neovim, or even just the terminal itself.

---

## 💳 Pricing — What You Need to Know

Claude Code is **paid software**. It uses Anthropic's proprietary models (Sonnet, Opus, Haiku) under the hood.

| Plan | Cost (approx.) | Best For |
|---|---|---|
| Claude Pro | ₹2,000 / month | Full Claude Code access |
| Ollama Cloud Models | Free tier available | Students & hobbyists |
| Ollama Local Models | Free (your hardware) | Offline, privacy-first use |

{: .note}
> **Students:** Don't want to spend ₹2,000? There's a free workaround using **Ollama** — covered at the end of this guidec or they can use `openrouter` free model with claudw code.

---

## 🚀 Step 1 — Create a Claude Account & Subscribe

Before installing Claude Code, you need an active Anthropic account with an upgraded plan.

1. Go to **[claude.ai](https://claude.ai)**
2. Create an account (or log in)
3. Navigate to **Upgrade Plan**
4. Choose and confirm the subscription

Once subscribed, you're authorized to use Claude Code.

---

## 📦 Step 2 — Install Claude Code

Installation is a single command. Open your Terminal (macOS/Linux) or Command Prompt (Windows):

[Installation](https://code.claude.com/docs/en/quickstart)

On my machine i'll use below cammand which is for mac os.

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

After installation, verify it worked:

```bash
claude --version
```

{: .note}
> Claude Code requires **Node.js 18+**. If you get an error, install or update Node.js first.

---

## ▶️ Step 3 — Run Claude Code

Navigate to any directory and run:

```bash
claude
```

The **first time**, Claude will ask:

> *Do you trust the files in this folder?*

Since it's your own machine, select **Yes**.

If prompted to log in, you'll be redirected to your browser to **Authorize** your Anthropic account. Click Authorize and return to the terminal.

{: .note}
> Authorization only happens once. Subsequent runs start immediately.

---

## 🗂️ Step 4 — Set Up the Project

We'll work on a pre-built Flask project called **Spendly** — a personal expense tracker. This simulates a real-world scenario where you join a project with an existing codebase.

### Download the Project

Download the project ZIP from [here](/docs/ai/Claude/assets/expense-tracker.zip). Extract it and open the folder in VS Code.

### Open the Terminal Inside VS Code

Open the integrated terminal in VS Code and navigate to the project folder. Then launch Claude from inside the project:

### Setup Commands

Run these in order inside Bash mode:

```bash
# 1. Create a virtual environment
uv .venv

# 2. Activate it
source .venv/bin/activate       # macOS / Linux
# venv\Scripts\activate        # Windows

# 3. Install dependencies
uv pip install -r requirements.txt

# 4. Run the Flask app
uv run app.py
```

To run these above commands in Claude Code, open Claude terminal in the project folder and run these commands in Bash mode. For Bash mode use `Shift + 1`.

{: .important}
> **Why Bash mode matters:** Commands run inside Claude's Bash mode are recorded in the session history. That means you can later ask *"What libraries were installed?"* and Claude already knows — because it saw the commands.


Open your browser and visit:

```
http://localhost:5001
```

You should see the **Spendly home page** with a landing page, registration UI, and login UI. The backend logic isn't implemented yet — that's what we'll build together throughout the playlist.

---

## 🤖 Step 6 — Explore Claude's Project Understanding

One of Claude Code's most powerful features is its ability to understand an entire codebase instantly. Ask Claude these three questions whenever you start a new project:

### Question 1 — What does this project do?

```
What does this project do?
```

> Claude reads every file, builds context, and gives you an accurate summary.

### Question 2 — What is the tech stack?

```
What tech stack does this project use?
```

Claude will break it down by layer:

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.11, Flask, SQLite |
| **Frontend** | Jinja2 templates, Vanilla CSS, Google Fonts |
| **Testing** | pytest, pytest-flask |

### Question 3 — Explain the project structure

```
Explain the project structure to me.
```

Claude returns a detailed file hierarchy — folders, their purpose, key files, and how they connect.

{: .note}
> Make these three questions a habit at the start of **every new project** you work on with Claude Code.

---

## 🐙 Step 7 — Push to GitHub

Every feature we build will be committed and pushed to GitHub. This also prepares us for deployment later.

### Create a Repository

1. Go to **[github.com](https://github.com)**
2. Click **New Repository**
3. Name it `spendly`
4. Add a description: *An expense tracking application built using Claude Code*
5. Click **Create Repository**

### Initialize Git

Run these commands inside Bash mode in Claude:

```bash
# Initialize git
git init

# Stage all files
git add .

# Commit
git commit -m "Initial commit"

# Add the remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/spendly.git

# Push
git push origin main
```

Refresh GitHub — your project files should now be visible. ✅

---

## 🆓 Step 8 — Free Alternative: Using Ollama (For Students)

If you don't want to pay for Claude Pro, you can use **Ollama** to run open-source LLMs with Claude Code — either via cloud models (free quota) or entirely locally.

### Install Ollama

Visit **[ollama.com](https://ollama.com)** and follow the installation instructions for your OS. Then:

```bash
ollama launch claude
```

### Option A — Ollama Cloud Models (Free Quota)

When prompted, choose a cloud model such as:

- **Qwen 3.5** (recommended for coding)
- **GLM 5**
- **K2.5**

Claude Code will now use that model instead of Anthropic's servers. You'll get a free usage quota each month.

{: .warning}
> Cloud quotas are limited. Once you hit your limit, you'll need to wait for the monthly reset or switch to a local model.

### Option B — Local Models (Fully Free, No Quota)

Download a local coding model:

```bash
# Pull a model locally (choose based on your RAM)
ollama pull qwen2.5-coder:14b    # 16 GB RAM or more
ollama pull qwen2.5-coder:7b     # 8 GB RAM
```

| RAM Available | Recommended Model |
|---|---|
| 16 GB+ | `qwen2.5-coder:14b` |
| 8 GB | `qwen2.5-coder:7b` |
| Less than 8 GB | `qwen2.5-coder:3b` |

After download, exit the current session and relaunch:

```bash
/exit

ollama launch claude
# Select the local model from the list
```

{: .note}
> Local models are slower than cloud models, especially without a dedicated GPU. Performance improves significantly with more RAM and a CUDA/Metal GPU.

### Other Free Alternatives

| Tool | Description |
|---|---|
| **OpenRouter** | Route Claude Code to multiple AI APIs with free tiers |
| **OpenCode** | Open-source Claude Code alternative |

Search YouTube for setup guides for each of these.

---

## ✅ Summary — Your Setup is Complete

Here's what you've accomplished:

- [x] Installed Claude Code
- [x] Authorized your Anthropic account
- [x] Set up the Spendly project and ran it locally
- [x] Learned how Bash mode works inside Claude
- [x] Pushed the project to GitHub
- [x] Explored Claude's project understanding capabilities
- [x] Learned about free Ollama alternatives

### Quick Start Reference

```bash
# Paid version (Anthropic)
claude

# Free version (Ollama)
ollama launch claude
```

{: .important}
> **Recommendation:** If you can afford ₹2,000/month and want to follow this playlist to its full potential, go with the official Claude subscription. The experience is significantly better. If you're a student, start with Ollama Cloud — it's genuinely usable.
