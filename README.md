<div style="text-align:center; 
    background: linear-gradient(270deg, #00c6ff, #9c27b0, #ff0080);
    background-size: 600% 600%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientMove 8s ease infinite;">

  <h1>🌟 Infrastructure Repo – Centralized Helm CD 🌟</h1>

  <a href="https://github.com/kioskOG/kioskOG.github.io">
    <img src="https://readme-typing-svg.demolab.com?font=italic&weight=700&size=18&duration=4000&pause=1000&color=FFD700&width=600&lines=+--+Personal+DevOps+Knowledge+Base+Documentation+--" alt="Typing SVG" />
  </a>
</div>



<div align="center">

# [kioskOG.github.io](https://blog.jatinog.com/) 🚀

**Personal DevOps Knowledge Base & Portfolio Documentation Site**

[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-222222?logo=github)](https://kioskOG.github.io)
[![Jekyll](https://img.shields.io/badge/Built%20with-Jekyll-CC0000?logo=jekyll)](https://jekyllrb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🌐 Docs Site](https://kioskOG.github.io) · [💼 Portfolio](https://portfolio.jatinog.com) · [📬 Contact](https://kioskOG.github.io/docs/about/contact/)

</div>

---

## 📖 About

This is **Jatin Sharma's** personal documentation and knowledge-base site — a living reference for real-world DevOps, platform engineering, and cloud infrastructure projects.

Built with a **custom terminal-inspired design system** layered on top of Jekyll, this site documents hands-on guides across Kubernetes, Docker, Linux, Cloud (AWS/GCP/OCI), monitoring, SIEM, and more.

> 💼 Looking for my interactive portfolio? Visit **[portfolio.jatinog.com](https://portfolio.jatinog.com)**

---

## 🗂️ Site Structure

```
kioskOG.github.io/
├── _layouts/
│   ├── full-bleed.html          # Homepage layout (terminal-inspired hero)
│   ├── full-bleed-glass.html    # Category/index pages (glassmorphism cards)
│   └── doc-page.html            # Article layout (sticky ToC + prose styles)
├── assets/
│   ├── portfolio.css            # Shared design system (tokens, components)
│   ├── search.js                # Client-side Lunr.js search engine
│   └── search-index.json        # Auto-generated search index (Jekyll liquid)
├── docs/
│   ├── about/                   # About & Contact pages
│   └── devops/
│       ├── kubernetes/          # K8s, EKS, Helm, Cilium, Karpenter, Knative…
│       ├── docker/              # Docker, Traefik, Wazuh, Keycloak, MinIO…
│       ├── Linux/               # Wazuh SIEM, iptables, HA clusters, eBPF…
│       ├── Cloud/               # AWS, GCP, Oracle, cross-cloud networking…
│       ├── monitoring/          # Grafana Tempo, Loki, LGTM, HertzBeat…
│       ├── python/              # DevOps automation scripts & tools
│       ├── Networking/          # NAT, VPN, DNS, networking concepts
│       └── System-Design/       # Architecture roadmaps & scalability
└── _config.yml
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎨 **Design System** | Light-mode glassmorphism with blue-to-green gradients, Inter + JetBrains Mono fonts |
| 🔍 **Site Search** | Client-side full-text search powered by [Lunr.js](https://lunrjs.com/) — open with `⌘K` / `Ctrl+K` |
| 📚 **100+ Docs** | Structured guides across 8 DevOps categories |
| 📖 **Reading Layout** | Sticky sidebar Table of Contents, breadcrumbs, prev/next navigation |
| 📱 **Responsive** | Fully mobile-optimised navigation and layout |
| 🚀 **Fast Builds** | Jekyll static site, ~1.5s build time, deployed via GitHub Actions |
| ♿ **Accessible** | Semantic HTML, ARIA labels, keyboard-navigable search modal |

---

## 🛠️ Tech Stack

- **Static Site Generator** — [Jekyll](https://jekyllrb.com) with the `just-the-docs` gem
- **Theme** — Custom layout system overriding the base theme entirely
- **CSS** — Vanilla CSS with design tokens (no Tailwind/Bootstrap)
- **JavaScript** — Vanilla JS + [Lunr.js](https://lunrjs.com/) for search, IntersectionObserver for scroll animations
- **Icons** — [Font Awesome 6](https://fontawesome.com/)
- **Fonts** — [Inter](https://rsms.me/inter/) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) from Google Fonts
- **Hosting** — [GitHub Pages](https://pages.github.com/) via GitHub Actions

---

## 🚀 Local Development

### Prerequisites

- Ruby ≥ 3.x (managed via [rbenv](https://github.com/rbenv/rbenv))
- Bundler

### Setup & Run

```bash
# Clone the repo
git clone https://github.com/kioskOG/kioskOG.github.io.git
cd kioskOG.github.io

# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve --port 4000

# Or build only
bundle exec jekyll build
```

The site will be available at **`http://localhost:4000`**.

---

## 📝 Adding New Docs

1. Create a `.md` file under the relevant `docs/devops/<category>/` directory.
2. Set the front matter:

```yaml
---
layout: doc-page          # ← use this for all article pages
title: "Your Page Title"
parent: "Parent Category" # e.g. "Kubernetes Projects"
nav_order: 5
permalink: /docs/devops/category/your-page/
---
```

3. For new **category index pages**, use `layout: full-bleed-glass` with a `hero_tag` and `hero_title`.

---

## 🔍 Search

Search is powered by **Lunr.js** with a pre-built index at `/assets/search-index.json` (auto-generated by Jekyll at build time from all page content).

- Press **`⌘K` / `Ctrl+K`** anywhere on the site to open the command-palette search
- Use **`↑` `↓`** to navigate results, **`Enter`** to open, **`Esc`** to close
- The index includes page title, section, tags, and content excerpts

---

## 🌐 Links

| | |
|---|---|
| 📖 **Docs Site** | [kioskOG.github.io](https://kioskOG.github.io) |
| 💼 **Portfolio** | [portfolio.jatinog.com](https://portfolio.jatinog.com) |
| 🐙 **GitHub** | [github.com/kioskOG](https://github.com/kioskOG) |
| 💼 **LinkedIn** | [linkedin.com/in/jatin-devops](https://www.linkedin.com/in/jatin-devops/) |
| 📬 **Contact** | [kioskOG.github.io/docs/about/contact](https://kioskOG.github.io/docs/about/contact/) |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
Built with ❤️ by <a href="https://portfolio.jatinog.com">Jatin Sharma</a> — DevOps & Platform Engineer
</div>
