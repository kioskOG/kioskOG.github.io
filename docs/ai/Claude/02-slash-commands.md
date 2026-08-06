---
title: Slash Commands
layout: doc-page
parent: Claude Code
parent_url: /docs/ai/Claude/
nav_order: 2
permalink: /docs/ai/Claude/slash-commands/
description: A comprehensive guide to Claude Code Slash Commands — built-in shortcuts, session management, model switching, permissions, and more.
type: concept
tags:
- ai
- claude
- slash-commands
timestamp: '2026-08-06T01:20:20Z'
---

# Slash Commands

Slash Commands are one of Claude Code's most powerful features — and one of the biggest reasons it has become such a productive coding tool. This guide covers everything you need to know, from built-in commands to sessions to model management.

---

## 🤔 What are Slash Commands?

> **Slash Commands are shortcuts you type inside a Claude Code session, starting with `/`, that trigger a specific predefined action or workflow instantly — without writing a full prompt.**

When developers work on software, they repeat the same types of tasks constantly: reviewing sessions, switching models, checking usage, exporting conversations. Writing a full prompt each time is tedious.

Claude Code's developers asked a smart question:

> *What if we convert these reusable patterns into single-word commands?*

The result is Slash Commands — you type one word, and an entire workflow executes.

---

## 🗂️ Types of Slash Commands

There are two categories:

| Type | Who Creates It | When Available |
|---|---|---|
| **Built-in Commands** | Anthropic | Immediately after installing Claude Code |
| **Custom Commands** | You (the developer) | When you create a `.claude/commands/` file in your project |

Custom commands are perfect for project-specific repetitive workflows — for example, *"run tests → lint → commit"* as a single `/ship` command.

---

## 💡 You've Already Used One

Even if this is your first time hearing the term, you used a Slash Command in the previous video.

When closing the Claude session, we typed:

```
/exit
```

That's a Slash Command. Instead of prompting *"Please end this session"*, Claude Code gives you a one-word shortcut that does it reliably every time.

---

## 📋 Sessions — The Foundation

Before diving deeper into commands, you need to understand **sessions** — because most Slash Commands revolve around them.

### What is a Session?

A **session** is one complete conversation with Claude Code.

```
Start:   claude          ← session begins
  ...    (your work)
End:     /exit           ← session ends
```

Every session contains:

- A unique session ID
- Your complete prompt history
- Claude's replies
- All tool calls (file reads, Bash commands, web searches)
- Bash commands you executed in Bash mode

Sessions are **automatically saved** to disk and can be resumed at any time, even days later.

---

### ▶️ Resuming Old Sessions

```bash
claude -r
```

This opens a list of all your previous sessions. Select one to resume it exactly where you left off — Claude remembers everything.

### 🔀 Switching Mid-Session

If you're already inside a session and want to jump to a different one:

```
/resume
```

Claude shows your session list and lets you switch without exiting.

---

## ✅ Best Practices for Sessions

{: .important}
> **One session = One task.** This is the golden rule. Mixing multiple features in one session pollutes the context and degrades Claude's focus.

Here's how to structure sessions on a real project:

| Feature | Session |
|---|---|
| Login System | `login-feature` |
| Registration | `registration-feature` |
| Dashboard | `dashboard-feature` |
| Payment Integration | `payments-feature` |

Close each session when the feature is done. Start fresh for the next one.

---

### 🏷️ Rename Sessions Immediately

When Claude starts a new session, it auto-names it based on your first prompt — which is usually ugly and unhelpful.

Rename it right away:

```
/rename login-feature
```

Now when you run `claude -r`, you'll see a clean, meaningful list instead of auto-generated titles.

---

### 💾 Commit at Milestones

Every time you complete a meaningful step inside a session, create a Git commit. This gives you checkpoints to roll back to if something goes wrong.

{: .note}
> We'll commit after every feature throughout this playlist. Treat commits as save points in a video game.

---

## 📎 Command Reference

### 🔤 `/btw` — Ask a Side Question

This is one of the most underrated commands. Suppose Claude is building your Login feature and you suddenly wonder:

> *"What is Flask anyway?"*

That's not relevant to the login task — adding it to the conversation would pollute the context.

Instead:

```
/btw What is Flask in Python?
```

Claude answers the question **outside** the session context. After reading it, press **Space** — the answer disappears and the main conversation is untouched.

{: .note}
> Use `/btw` for conceptual questions, quick lookups, or anything that's not directly part of the current task. It keeps your context window clean.

---

### 📤 `/export` — Save a Conversation

Before making large refactoring changes, export your conversation as a backup:

```
/export session-backup.md
```

Claude creates a Markdown file inside your project directory with the complete conversation history. You can feed it back later as context:

```
Read session-backup.md to understand the login feature we built.
```

---

### 🔁 `/logout` and `/login`

```
/logout    ← Signs out of Claude Code
/login     ← Starts the login flow again
```

Useful when:
- You have a personal account and a work account
- You need to switch between API keys
- You're setting up Claude Code on a new machine

After `/logout`, restarting Claude walks you through theme selection → login method → browser authorization.

---

## 🤖 Claude Models — Choosing the Right One

Claude Code uses Anthropic's three models, each designed for different use cases:

### Model Comparison

| Model | Speed | Quality | Cost | Best For |
|---|---|---|---|---|
| **Opus** | Slow | ⭐⭐⭐⭐⭐ Highest | 💰💰💰 Most expensive | Planning, architecture, complex reasoning |
| **Sonnet** | Fast | ⭐⭐⭐⭐ Great | 💰💰 Balanced | Everyday coding — **default & recommended** |
| **Haiku** | ⚡ Fastest | ⭐⭐⭐ Good | 💰 Cheapest | Simple, repetitive tasks |

### Recommended Workflow

> Use **Opus** for thinking, **Sonnet** for building.

1. Start with Opus to **plan, architect, and write specs**
2. Switch to Sonnet to **implement and generate code**

This workflow gives you the best results at the lowest token cost. We'll follow this pattern throughout the playlist.

---

### 🔀 `/model` — Switch Models

```
/model
```

A selection menu appears. Choose:

- `claude-sonnet-4-6` (default, recommended)
- `claude-opus-4`
- `claude-haiku-4`

---

## 📊 Usage & Stats Commands

### `/usage` — Token Consumption

```
/usage
```

Shows your token usage in two dimensions:

| Metric | What it Tracks |
|---|---|
| Current session | Tokens used in this conversation |
| Weekly total | Cumulative tokens across all sessions this week |

**Example:**

```
Session:  16% of limit
Weekly:    5% of limit
```

{: .warning}
> If you use Opus heavily, you'll burn through tokens much faster. Switch to Sonnet for routine coding to extend your weekly budget.

---

### `/extra-usage` — Buy More Tokens

```
/extra-usage
```

Hit your weekly limit? Instead of waiting for the reset, top up your account ($5 or $10) for additional token capacity.

This probably won't be needed for our playlist, but large enterprise projects often require it.

---

### `/stats` — Your Coding Stats

```
/stats
```

Displays cumulative statistics:

- Total tokens consumed
- Models used and their breakdown
- Number of sessions started
- Active days
- Longest session
- Current streak

This dashboard becomes more interesting the longer you use Claude Code. It gamifies your productivity.

---

### `/insights` — AI-Generated Usage Report

```
/insights
```

Generates a detailed **HTML report** analyzing:

- How you've been using Claude Code
- Your prompting patterns
- Good habits you've built
- Areas for improvement
- Specific recommendations

{: .note}
> Run `/insights` after completing 10–15 sessions to get a meaningful report. Early on, there's not enough data to make it useful.

---

## ⚙️ Configuration Commands

### `/config` — Settings Panel

```
/config
```

Opens Claude Code's settings. Key options include:

| Setting | Description |
|---|---|
| Thinking mode | Show Claude's internal reasoning |
| Verbose mode | Display detailed tool call logs |
| Terminal progress bar | Visual indicator for long tasks |
| Language | Interface language preference |
| Auto-commit | Automatically commit at milestones |

---

### 🔐 `/permissions` — Tool Access Control

Claude Code is an AI agent backed by tools:

- File reading
- File writing
- Bash execution
- Web search
- MCP tools (if configured)

By default, Claude asks permission before using each tool. This gets annoying fast.

```
/permissions
```

For each tool, you can set:

| Permission Level | Behavior |
|---|---|
| **Allowed** | Claude uses it without asking |
| **Always ask** | Claude asks every time (default) |
| **Denied** | Claude never uses this tool |

**Example:** Allow Web Search permanently so Claude can look things up without prompting you each time.

Permissions are stored in your project:

```
.claude/settings.local.json
```

{: .warning}
> Be thoughtful about what you permanently allow — especially Bash commands. A careless `rm -rf` allowed without confirmation could be destructive.

You can scope permissions to:

- **Local Project** — applies only in this repository
- **Global** — applies across all projects for your account
- **User** — applies to your machine only

---

### 🎨 `/theme` — Appearance

```
/theme
```

Switch between:

- `dark` (recommended)
- `light`
- `system` (follows your OS preference)

---

### 🎙️ `/voice` — Voice Input Mode

```
/voice
```

Enables Voice Mode. Instead of typing, hold **Space** and speak your prompt:

> *"Explain the project structure to me."*

Claude converts your speech to text and processes it normally. Useful when typing feels slow or your hands are busy.

Run `/voice` again to disable it.

---

## 📋 Quick Reference — All Commands at a Glance

| Command | Category | What It Does |
|---|---|---|
| `/exit` | Session | End the current session |
| `/resume` | Session | Switch to a different session |
| `/rename <name>` | Session | Rename the current session |
| `/export <file>` | Session | Export conversation to Markdown |
| `/btw <question>` | Context | Ask a side question without polluting context |
| `/model` | Models | Switch between Opus / Sonnet / Haiku |
| `/usage` | Usage | Show token consumption |
| `/extra-usage` | Usage | Purchase additional token quota |
| `/stats` | Analytics | View coding statistics |
| `/insights` | Analytics | Generate an HTML usage report |
| `/config` | Settings | Open configuration panel |
| `/permissions` | Security | Manage tool access permissions |
| `/theme` | UI | Change terminal appearance |
| `/voice` | Input | Toggle voice input mode |
| `/login` | Auth | Start the login flow |
| `/logout` | Auth | Sign out of Claude Code |

{: .note}
> **Discover more:** Type `/` inside any Claude session and scroll through the full list using the arrow keys. Each command shows its description inline.

---

## 🔥 One-Line Summary

{: .note}
> Slash Commands turn repeated, manual workflows into single keystrokes — keeping your context clean, your sessions organized, and your coding momentum unbroken.
