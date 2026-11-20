---
layout: full-bleed-glass
title: "Knowledge Brain"
hero_tag: "Open Knowledge Graph"
hero_title: "Explore the DevOps & AI Brain"
hero_intro: "Every note on this site as one connected map. Each dot is a note, coloured by topic, and each line is a link between notes. Search, filter by topic, and click any note to see what it connects to."
permalink: /brain/
---

<link rel="stylesheet" href="{{ '/assets/brain.css' | relative_url }}">
<div id="brain-app" class="bl-app" data-src="{{ '/assets/brain-graph.json' | relative_url }}" data-fallback="{{ '/assets/brain-raw.json' | relative_url }}" data-base="{{ '/' | relative_url }}">
  <div class="bl-toolbar">
    <div class="bl-search">
      <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
      <input id="bl-search" type="search" placeholder="Search notes, tags or topics…" autocomplete="off" spellcheck="false" role="combobox" aria-label="Search the knowledge graph" aria-controls="bl-results" aria-expanded="false" aria-autocomplete="list">
      <kbd class="bl-search-hint" aria-hidden="true">/</kbd>
      <button type="button" class="bl-search-clear" aria-label="Clear search"><i class="fas fa-xmark" aria-hidden="true"></i></button>
      <div id="bl-results" class="bl-results" role="listbox" aria-label="Matching notes" hidden></div>
    </div>
    <div class="bl-chips" role="group" aria-label="Filter by topic"></div>
  </div>
  <div class="bl-stage">
    <div class="bl-canvas">
      <svg class="bl-svg" role="img" aria-label="Graph of notes and the links between them. Use the search box or the panel to navigate by keyboard."></svg>
      <div class="bl-tools" role="toolbar" aria-label="Graph controls">
        <button type="button" class="bl-tool" data-act="zoom-in" aria-label="Zoom in"><i class="fas fa-plus" aria-hidden="true"></i><span>Zoom in</span></button>
        <button type="button" class="bl-tool" data-act="zoom-out" aria-label="Zoom out"><i class="fas fa-minus" aria-hidden="true"></i><span>Zoom out</span></button>
        <button type="button" class="bl-tool" data-act="fit" aria-label="Fit to view"><i class="fas fa-expand" aria-hidden="true"></i><span>Fit to view (F)</span></button>
        <hr>
        <button type="button" class="bl-tool" data-act="labels" data-mode="auto" aria-label="Labels: auto"><i class="fas fa-font" aria-hidden="true"></i><span>Labels: auto</span></button>
        <button type="button" class="bl-tool" data-act="tree" aria-pressed="true" aria-label="Show section links"><i class="fas fa-sitemap" aria-hidden="true"></i><span>Section links</span></button>
        <button type="button" class="bl-tool" data-act="fullscreen" aria-label="Full screen"><i class="fas fa-up-right-and-down-left-from-center" aria-hidden="true"></i><span>Full screen</span></button>
      </div>
      <div class="bl-hint" aria-hidden="true">
        <span><i class="fas fa-computer-mouse"></i>Scroll to zoom</span>
        <span><i class="fas fa-hand"></i>Drag to pan</span>
        <span><i class="fas fa-hand-pointer"></i>Click a note</span>
      </div>
      <div class="bl-legend" aria-hidden="true">
        <span><svg width="22" height="6"><line x1="0" y1="3" x2="22" y2="3" stroke-dasharray="2 3"/></svg>Section</span>
        <span><svg width="22" height="6"><line x1="0" y1="3" x2="22" y2="3"/></svg>Cross-link</span>
      </div>
      <div class="bl-tooltip" hidden></div>
      <div class="bl-loading"><div class="bl-spinner"></div><p>Mapping the notes…</p></div>
    </div>
    <aside class="bl-panel" aria-label="Note details"></aside>
  </div>
  <div class="bl-live bl-sr" aria-live="polite"></div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js" crossorigin="anonymous"></script>
<script src="{{ '/assets/brain.js' | relative_url }}" defer></script>
