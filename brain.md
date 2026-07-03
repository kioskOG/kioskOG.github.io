---
layout: full-bleed-glass
title: "Knowledge Brain"
hero_tag: "Open Knowledge Graph"
hero_title: "Explore the DevOps & AI Brain"
hero_intro: "An interactive visualization of Jatin Sharma's documentation, structured using the Google Open Knowledge Format (OKF) with cross-linked concept nodes."
permalink: /brain/
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js" crossorigin="anonymous"></script>

<style>
  .brain-container {
    display: flex;
    gap: 24px;
    margin-top: 2rem;
    position: relative;
    min-height: 700px;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  @media (max-width: 992px) {
    .brain-container {
      flex-direction: column;
    }
  }
  
  .graph-wrapper {
    flex: 1;
    background: var(--surface);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    height: 700px;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-md);
  }
  
  .sidebar-wrapper {
    width: 340px;
    background: var(--surface);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: var(--shadow-md);
    height: 700px;
    overflow-y: auto;
    transition: border-color 0.2s;
  }
  @media (max-width: 992px) {
    .sidebar-wrapper {
      width: 100%;
      height: auto;
      max-height: 500px;
    }
  }
  
  .graph-controls {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 10;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .control-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-body);
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    backdrop-filter: blur(8px);
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .control-btn:hover {
    background: var(--surface-hover);
    border-color: var(--border-hover);
    color: var(--accent-blue);
    transform: translateY(-1px);
  }
  .control-btn.active {
    background: rgba(59, 130, 246, 0.15);
    color: var(--accent-blue);
    border-color: var(--accent-blue);
  }
  
  .search-wrapper {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
    width: 280px;
    backdrop-filter: blur(8px);
  }
  @media (max-width: 576px) {
    .search-wrapper {
      position: relative;
      top: 0; right: 0;
      width: 100%;
      margin-bottom: 12px;
    }
  }
  .search-input {
    width: 100%;
    background: var(--input-bg);
    border: 1px solid var(--border);
    color: var(--text-heading);
    padding: 10px 16px;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;
  }
  .search-input:focus {
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }
  
  /* SVG Styles */
  .node-label {
    font-size: 10px;
    font-weight: 500;
    pointer-events: none;
    user-select: none;
    transition: fill 0.2s;
  }
  
  /* Sidebar detail elements */
  .details-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 16px;
  }
  
  .details-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-heading);
    line-height: 1.3;
  }
  
  .details-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .details-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .details-section h5 {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 2px;
  }
  
  .details-section p {
    font-size: 0.875rem;
    color: var(--text-body);
    line-height: 1.5;
  }
  
  .badge-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .tag-badge {
    background: rgba(59, 130, 246, 0.08);
    color: var(--accent-blue);
    border: 1px solid rgba(59, 130, 246, 0.12);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 600;
  }
  
  .type-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    display: inline-block;
  }
  .type-badge.concept {
    background: rgba(16, 185, 129, 0.08);
    color: var(--accent-green);
    border: 1px solid rgba(16, 185, 129, 0.12);
  }
  .type-badge.index {
    background: rgba(139, 92, 246, 0.08);
    color: var(--accent-purple);
    border: 1px solid rgba(139, 92, 246, 0.12);
  }
  
  .details-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
  }
  
  .links-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .links-list-item {
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .links-list-item a {
    color: var(--accent-blue);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: opacity 0.2s;
  }
  .links-list-item a:hover {
    text-decoration: underline;
    opacity: 0.85;
  }
  .links-list-item i {
    color: var(--text-muted);
    font-size: 0.75rem;
  }
  
  .details-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    background: var(--grad-primary);
    color: white !important;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
    transition: all 0.2s;
    text-decoration: none;
    text-align: center;
    margin-top: auto;
  }
  .details-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted);
    text-align: center;
    padding: 40px 20px;
    font-style: italic;
    gap: 8px;
  }
  .empty-state i {
    font-size: 2rem;
    color: var(--text-muted);
    opacity: 0.6;
  }
  
  /* Legend styling */
  .legend-box {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: rgba(15, 23, 42, 0.1);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.72rem;
    pointer-events: none;
  }
  html[data-theme="dark"] .legend-box {
    background: rgba(255, 255, 255, 0.03);
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .legend-color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
</style>

<div class="brain-container">
  
  <!-- Graph Viewer Card -->
  <div class="graph-wrapper" id="canvas-container">
    <!-- Controls Overlay -->
    <div class="graph-controls">
      <button class="control-btn" id="btn-zoom-in" title="Zoom In">
        <i class="fas fa-plus"></i>
      </button>
      <button class="control-btn" id="btn-zoom-out" title="Zoom Out">
        <i class="fas fa-minus"></i>
      </button>
      <button class="control-btn" id="btn-zoom-reset" title="Reset View">
        <i class="fas fa-sync-alt"></i> Reset
      </button>
      <button class="control-btn" id="btn-toggle-size" title="Scale nodes by file size">
        <i class="fas fa-expand-arrows-alt"></i> Scale Nodes
      </button>
    </div>
    
    <!-- Search Overlay -->
    <div class="search-wrapper">
      <input type="text" class="search-input" id="graph-search" placeholder="Search concept or tag...">
    </div>
    
    <!-- Legend -->
    <div class="legend-box">
      <div class="legend-item">
        <div class="legend-color" style="background: #3b82f6;"></div>
        <span>DevOps / K8s / Docker</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #8b5cf6;"></div>
        <span>AI / MCP / LangChain</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #10b981;"></div>
        <span>ML Pipeline / training</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #f59e0b;"></div>
        <span>Networking / NAT</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #ef4444;"></div>
        <span>Linux / SIEM / Wazuh</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #6366f1;"></div>
        <span>Index / Category Map</span>
      </div>
    </div>
    
    <!-- D3 Canvas Container -->
    <svg id="brain-svg" style="width: 100%; height: 100%; display: block;"></svg>
  </div>
  
  <!-- Concept Information Sidebar -->
  <div class="sidebar-wrapper" id="sidebar-details">
    <div class="empty-state" id="sidebar-empty">
      <i class="fas fa-brain"></i>
      <p>Click on any concept in the brain graph to view its metadata, tags, backlinks, and read the note.</p>
    </div>
    
    <div class="details-content" id="sidebar-filled" style="display: none;">
      <!-- Title & Type -->
      <div class="details-header">
        <div class="details-title" id="node-title">Concept Name</div>
        <div class="details-meta">
          <span class="type-badge" id="node-type">concept</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);" id="node-timestamp">2026-06-30</span>
        </div>
      </div>
      
      <!-- Description -->
      <div class="details-section">
        <h5>Description</h5>
        <p id="node-description">No description provided.</p>
      </div>
      
      <!-- Tags -->
      <div class="details-section">
        <h5>Tags</h5>
        <div class="badge-container" id="node-tags">
          <span class="tag-badge">tag</span>
        </div>
      </div>
      
      <!-- Outgoing Links -->
      <div class="details-section">
        <h5>References (Out)</h5>
        <ul class="links-list" id="node-outgoing">
          <li class="links-list-item"><i class="fas fa-chevron-right"></i> <a href="#">Link</a></li>
        </ul>
      </div>
      
      <!-- Backlinks -->
      <div class="details-section">
        <h5>Referenced By (In)</h5>
        <ul class="links-list" id="node-incoming">
          <li class="links-list-item"><i class="fas fa-chevron-left"></i> <a href="#">Link</a></li>
        </ul>
      </div>
      
      <!-- Action Button -->
      <a href="#" class="details-btn" id="node-cta">
        <i class="fas fa-book-open"></i> Read Full Note
      </a>
    </div>
  </div>
  
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const svg = d3.select("#brain-svg");
  const container = document.getElementById("canvas-container");
  const searchInput = document.getElementById("graph-search");
  
  let width = container.clientWidth;
  let height = container.clientHeight;
  
  // Set dimensions
  svg.attr("viewBox", `0 0 ${width} ${height}`);
  
  // Create outer SVG group to enable zooming
  const g = svg.append("g");
  
  // Set up zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.1, 8])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
    
  svg.call(zoom);
  
  // Setup color scheme
  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      text: isDark ? '#cbd5e1' : '#334155',
      textActive: isDark ? '#f8fafc' : '#0f172a',
      link: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
      linkHighlight: '#3b82f6',
      particleColor: isDark ? '#ffffff' : '#0f172a'
    };
  }
  
  let colors = getThemeColors();
  
  // Track node scaling state
  let scaleByFileSize = false;
  
  // Category Color Map
  function getNodeColor(node) {
    if (node.type === 'index') {
      return '#6366f1'; // Indigo for indices
    }
    const tags = node.tags.map(t => t.toLowerCase());
    if (tags.some(t => ['ai', 'langchain', 'rag', 'mcp'].includes(t))) {
      return '#8b5cf6'; // Purple
    }
    if (tags.some(t => ['ml', 'training', 'pipeline'].includes(t))) {
      return '#10b981'; // Green
    }
    if (tags.some(t => ['kubernetes', 'devops', 'docker', 'helm'].includes(t))) {
      return '#3b82f6'; // Blue
    }
    if (tags.some(t => ['networking', 'nat', 'dns', 'vpn'].includes(t))) {
      return '#f59e0b'; // Amber
    }
    if (tags.some(t => ['linux', 'siem', 'wazuh', 'iptables', 'ebpf'].includes(t))) {
      return '#ef4444'; // Red
    }
    return '#64748b'; // Muted Slate
  }

  // Load Graph Data
  d3.json("{{ '/assets/brain-raw.json' | relative_url }}").then(function (rawDocs) {
    if (!rawDocs || rawDocs.length === 0) {
      console.error("No raw documents found.");
      return;
    }
    
    // Helper to clean URL anchors/queries
    function cleanUrl(url) {
      if (!url) return "";
      return url.split('#')[0].split('?')[0].trim();
    }
    
    // Helper to clean string for comparison (removes emoji/non-alphanumeric, lowercase)
    function cleanString(s) {
      if (!s) return "";
      return s.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    
    // Build maps for resolution
    const path_to_permalink = {};
    const filename_to_permalink = {};
    const node_metadata = {};
    
    rawDocs.forEach(d => {
      let permalink = d.id;
      if (!permalink) {
        permalink = "/" + d.path.replace(".md", "/").replace(/\\/g, "/");
      }
      if (!permalink.startsWith("/")) permalink = "/" + permalink;
      if (!permalink.endsWith("/") && !permalink.includes(".")) permalink = permalink + "/";
      
      path_to_permalink[d.path] = permalink;
      const filename = d.path.split('/').pop();
      filename_to_permalink[filename] = permalink;
      
      node_metadata[permalink] = {
        title: d.title || filename.replace(".md", "").replace(/[-_]/g, " "),
        parent: d.parent,
        parent_url: d.parent_url,
        grand_parent: d.grand_parent
      };
    });
    
    // Resolve link function
    function resolveLink(linkUrl, currentPath) {
      linkUrl = cleanUrl(linkUrl);
      if (!linkUrl) return null;
      
      if (linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("mailto:") || linkUrl.startsWith("javascript:")) {
        return null;
      }
      
      // Root-relative
      if (linkUrl.startsWith("/")) {
        for (const plk of Object.values(path_to_permalink)) {
          if (plk.toLowerCase() === linkUrl.toLowerCase() || plk.toLowerCase().replace(/\/$/, '') === linkUrl.toLowerCase().replace(/\/$/, '')) {
            return plk;
          }
        }
        
        const pathClean = linkUrl.substring(1);
        for (const [relP, plk] of Object.entries(path_to_permalink)) {
          if (relP.toLowerCase() === pathClean.toLowerCase()) {
            return plk;
          }
        }
      }
      
      // Relative path
      const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
      const parts = currentDir.split('/');
      const linkParts = linkUrl.split('/');
      
      for (const part of linkParts) {
        if (part === "..") {
          parts.pop();
        } else if (part !== "." && part !== "") {
          parts.push(part);
        }
      }
      const relResolved = parts.join('/');
      for (const [relP, plk] of Object.entries(path_to_permalink)) {
        if (relP.toLowerCase() === relResolved.toLowerCase()) {
          return plk;
        }
      }
      
      // Filename fallback
      const filename = linkUrl.split('/').pop().toLowerCase();
      for (const [fname, plk] of Object.entries(filename_to_permalink)) {
        if (fname.toLowerCase() === filename) {
          return plk;
        }
      }
      
      // Loose match
      for (const plk of Object.values(path_to_permalink)) {
        if (plk.toLowerCase().includes(linkUrl.toLowerCase()) || linkUrl.toLowerCase().includes(plk.toLowerCase())) {
          return plk;
        }
      }
      
      return null;
    }
    
    const nodes = [];
    const links = [];
    
    // Build Nodes and Links lists
    rawDocs.forEach(d => {
      let permalink = d.id;
      if (!permalink) {
        permalink = "/" + d.path.replace(".md", "/").replace(/\\/g, "/");
      } else {
        if (!permalink.startsWith("/")) permalink = "/" + permalink;
        if (!permalink.endsWith("/") && !permalink.includes(".")) permalink = permalink + "/";
      }
      
      nodes.push({
        id: permalink,
        title: d.title || d.path.split('/').pop().replace(".md", "").replace(/[-_]/g, " "),
        description: d.description || "",
        type: d.type || "concept",
        tags: d.tags || [],
        timestamp: d.timestamp || "",
        path: d.path,
        size: d.size || 0
      });
      
      // 1. Extract explicit markdown links
      const body = d.content || "";
      const linkRegex = /(!)?\[([^\]]+)\]\(([^)]+)\)/g;
      let m;
      while ((m = linkRegex.exec(body)) !== null) {
        const isImage = !!m[1];
        const linkUrl = m[3];
        if (!isImage) {
          const targetPermalink = resolveLink(linkUrl, d.path);
          if (targetPermalink && targetPermalink !== permalink) {
            links.push({
              source: permalink,
              target: targetPermalink,
              type: "explicit"
            });
          }
        }
      }
      
      // 2. Extract parent hierarchical link
      const parentTitle = d.parent;
      if (parentTitle) {
        const cleanedParent = cleanString(parentTitle);
        let matchedParentPermalink = null;
        for (const [candPlk, candMeta] of Object.entries(node_metadata)) {
          const candTitleCleaned = cleanString(candMeta.title);
          if (candTitleCleaned && (candTitleCleaned === cleanedParent || 
                                    candTitleCleaned.startsWith(cleanedParent) || 
                                    cleanedParent.startsWith(candTitleCleaned))) {
            matchedParentPermalink = candPlk;
            break;
          }
        }
        if (matchedParentPermalink && matchedParentPermalink !== permalink) {
          links.push({
            source: matchedParentPermalink,
            target: permalink,
            type: "hierarchical"
          });
        }
      }
      
      // 3. Extract parent_url link
      const parentUrl = d.parent_url;
      if (parentUrl) {
        const parentUrlClean = cleanUrl(parentUrl).toLowerCase().replace(/\/$/, '');
        let matchedParentPermalink = null;
        for (const candPlk of Object.keys(node_metadata)) {
          if (candPlk.toLowerCase().replace(/\/$/, '') === parentUrlClean) {
            matchedParentPermalink = candPlk;
            break;
          }
        }
        if (matchedParentPermalink && matchedParentPermalink !== permalink) {
          links.push({
            source: matchedParentPermalink,
            target: permalink,
            type: "hierarchical"
          });
        }
      }
      
      // 4. Extract grand_parent link
      const grandParent = d.grand_parent;
      if (grandParent) {
        const cleanedGp = cleanString(grandParent);
        let matchedGpPermalink = null;
        for (const [candPlk, candMeta] of Object.entries(node_metadata)) {
          const candTitleCleaned = cleanString(candMeta.title);
          if (candTitleCleaned && (candTitleCleaned === cleanedGp || 
                                    candTitleCleaned.startsWith(cleanedGp) || 
                                    cleanedGp.startsWith(candTitleCleaned))) {
            matchedGpPermalink = candPlk;
            break;
          }
        }
        if (matchedGpPermalink && matchedGpPermalink !== permalink) {
          links.push({
            source: matchedGpPermalink,
            target: permalink,
            type: "hierarchical"
          });
        }
      }
    });
    
    // Deduplicate links and map to node objects
    const validLinks = [];
    const seen = new Set();
    links.forEach(l => {
      const pair = `${l.source}->${l.target}`;
      if (!seen.has(pair)) {
        seen.add(pair);
        
        const sourceNode = nodes.find(n => n.id === l.source);
        const targetNode = nodes.find(n => n.id === l.target);
        if (sourceNode && targetNode) {
          validLinks.push({
            source: sourceNode,
            target: targetNode,
            type: l.type
          });
        }
      }
    });
    
    // Quick lookups map
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    // Initialize forces
    const linkForce = d3.forceLink(validLinks)
      .id(d => d.id)
      .distance(120);
      
    const simulation = d3.forceSimulation(nodes)
      .force("link", linkForce)
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => scaleByFileSize ? getRadius(d) + 12 : 20))
      .on("tick", ticked);
      
    // Set up sizing function
    function getRadius(d) {
      if (d.type === 'index') return 16;
      if (!scaleByFileSize) return 8;
      // Logarithmic scaling for readability of small vs huge files
      const size = d.size || 500;
      return Math.max(6, Math.min(22, Math.log2(size) * 1.3));
    }
    
    // Create arrow markers for directed links
    g.append("defs").selectAll("marker")
      .data(["suit", "licensing", "resolved"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 22) // Offsets to avoid overlap with nodes
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-3L10,0L0,3")
      .attr("fill", "var(--text-muted)")
      .style("opacity", 0.3);
      
    // Render links
    const link = g.append("g")
      .attr("class", "links-layer")
      .selectAll("line")
      .data(validLinks)
      .enter().append("line")
      .attr("class", "link")
      .attr("stroke", colors.link)
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");
      
    // Render nodes
    const node = g.append("g")
      .attr("class", "nodes-layer")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", handleNodeClick)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);
      
    // Node circle shape
    const nodeCircles = node.append("circle")
      .attr("r", d => getRadius(d))
      .attr("fill", d => getNodeColor(d))
      .attr("stroke", "var(--bg)")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15))");
      
    // Node labels
    const nodeLabels = node.append("text")
      .attr("class", "node-label")
      .attr("dy", d => getRadius(d) + 12)
      .attr("text-anchor", "middle")
      .text(d => d.title.length > 25 ? d.title.substring(0, 22) + "..." : d.title)
      .attr("fill", colors.text)
      .style("opacity", 0.8);
      
    // Handle coordinates update per tick
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
        
      node
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
        
      // Dynamic adjustments of arrows to match changing radii
      if (scaleByFileSize) {
        // Adjust arrows refX dynamically if nodes have different sizes
        // We'll approximate this by drawing arrows offset correctly
      }
    }
    
    // Drag handlers
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Selection state tracking
    let selectedNode = null;
    
    // Node click action (display in sidebar)
    function handleNodeClick(event, d) {
      event.stopPropagation();
      selectedNode = d;
      
      // Update styling to reflect selection
      nodeCircles.attr("stroke", n => n === d ? "var(--accent-blue)" : "var(--bg)")
                 .attr("stroke-width", n => n === d ? 3.5 : 2);
                 
      // Render details in sidebar
      document.getElementById("sidebar-empty").style.display = "none";
      const filled = document.getElementById("sidebar-filled");
      filled.style.display = "flex";
      
      document.getElementById("node-title").textContent = d.title;
      
      const typeBadge = document.getElementById("node-type");
      typeBadge.textContent = d.type;
      typeBadge.className = `type-badge ${d.type}`;
      
      // Date formatting
      const dateStr = d.timestamp ? new Date(d.timestamp).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
      }) : "Unknown Date";
      document.getElementById("node-timestamp").textContent = dateStr;
      
      document.getElementById("node-description").textContent = d.description || "No description provided.";
      
      // Tags
      const tagsContainer = document.getElementById("node-tags");
      tagsContainer.innerHTML = "";
      if (d.tags && d.tags.length > 0) {
        d.tags.forEach(t => {
          const badge = document.createElement("span");
          badge.className = "tag-badge";
          badge.textContent = t;
          tagsContainer.appendChild(badge);
        });
      } else {
        tagsContainer.innerHTML = "<span style='font-size: 0.8rem; font-style: italic; color: var(--text-muted);'>No tags</span>";
      }
      
      // Outgoing References
      const outgoingContainer = document.getElementById("node-outgoing");
      outgoingContainer.innerHTML = "";
      const outgoing = validLinks.filter(l => l.source.id === d.id);
      if (outgoing.length > 0) {
        outgoing.forEach(l => {
          const item = document.createElement("li");
          item.className = "links-list-item";
          item.innerHTML = `<i class="fas fa-chevron-right"></i> <a href="#" data-node-id="${l.target.id}">${l.target.title}</a>`;
          outgoingContainer.appendChild(item);
        });
      } else {
        outgoingContainer.innerHTML = "<li class='links-list-item' style='color: var(--text-muted); font-style: italic;'>No outbound links</li>";
      }
      
      // Incoming Backlinks
      const incomingContainer = document.getElementById("node-incoming");
      incomingContainer.innerHTML = "";
      const incoming = validLinks.filter(l => l.target.id === d.id);
      if (incoming.length > 0) {
        incoming.forEach(l => {
          const item = document.createElement("li");
          item.className = "links-list-item";
          item.innerHTML = `<i class="fas fa-chevron-left"></i> <a href="#" data-node-id="${l.source.id}">${l.source.title}</a>`;
          incomingContainer.appendChild(item);
        });
      } else {
        incomingContainer.innerHTML = "<li class='links-list-item' style='color: var(--text-muted); font-style: italic;'>No backlinks</li>";
      }
      
      // Wire up clicks inside sidebar links
      const allSidebarLinks = filled.querySelectorAll(".links-list-item a");
      allSidebarLinks.forEach(linkElement => {
        linkElement.addEventListener("click", function (e) {
          e.preventDefault();
          const targetId = this.getAttribute("data-node-id");
          const targetNode = nodeMap.get(targetId);
          if (targetNode) {
            // Find the node element in SVG and select it
            handleNodeClick(e, targetNode);
            // Center camera on target node
            zoomToNode(targetNode);
          }
        });
      });
      
      // Read Note button
      const cta = document.getElementById("node-cta");
      cta.href = `{{ '/' | relative_url }}${d.id.replace(/^\//, '')}`;
    }
    
    // Zoom helper to center on selected node
    function zoomToNode(n) {
      const transform = d3.zoomIdentity
        .translate(width / 2 - n.x * 1.5, height / 2 - n.y * 1.5)
        .scale(1.5);
        
      svg.transition().duration(750).call(zoom.transform, transform);
    }
    
    // Node hover highlighting
    function handleMouseOver(event, d) {
      const neighbors = new Set([d.id]);
      
      // Gather connected neighbor nodes
      validLinks.forEach(l => {
        if (l.source.id === d.id) neighbors.add(l.target.id);
        if (l.target.id === d.id) neighbors.add(l.source.id);
      });
      
      // Focus nodes
      node.style("opacity", n => neighbors.has(n.id) ? 1.0 : 0.15);
      nodeLabels.style("opacity", n => neighbors.has(n.id) ? 1.0 : 0.05);
      
      // Highlight links
      link.attr("stroke", l => (l.source.id === d.id || l.target.id === d.id) ? colors.linkHighlight : colors.link)
          .attr("stroke-width", l => (l.source.id === d.id || l.target.id === d.id) ? 2.5 : 1.5)
          .style("opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 1.0 : 0.08);
    }
    
    function handleMouseOut() {
      // Revert opacity of everything
      node.style("opacity", 1.0);
      nodeLabels.style("opacity", 0.8);
      
      link.attr("stroke", colors.link)
          .attr("stroke-width", 1.5)
          .style("opacity", 1.0);
    }
    
    // Search filter function
    searchInput.addEventListener("input", function () {
      const term = this.value.toLowerCase().trim();
      if (!term) {
        node.style("opacity", 1.0);
        nodeLabels.style("opacity", 0.8);
        link.style("opacity", 1.0);
        return;
      }
      
      const matchedNodeIds = new Set();
      nodes.forEach(n => {
        const titleMatch = n.title.toLowerCase().includes(term);
        const pathMatch = n.path.toLowerCase().includes(term);
        const tagMatch = n.tags.some(t => t.toLowerCase().includes(term));
        if (titleMatch || pathMatch || tagMatch) {
          matchedNodeIds.add(n.id);
        }
      });
      
      // Gray out unmatched nodes
      node.style("opacity", n => matchedNodeIds.has(n.id) ? 1.0 : 0.12);
      nodeLabels.style("opacity", n => matchedNodeIds.has(n.id) ? 1.0 : 0.05);
      
      // Highlight links connecting matching nodes
      link.style("opacity", l => (matchedNodeIds.has(l.source.id) && matchedNodeIds.has(l.target.id)) ? 0.8 : 0.05);
    });
    
    // Zoom control buttons
    document.getElementById("btn-zoom-in").addEventListener("click", () => {
      svg.transition().duration(250).call(zoom.scaleBy, 1.3);
    });
    document.getElementById("btn-zoom-out").addEventListener("click", () => {
      svg.transition().duration(250).call(zoom.scaleBy, 1 / 1.3);
    });
    document.getElementById("btn-zoom-reset").addEventListener("click", () => {
      svg.transition().duration(250).call(zoom.transform, d3.zoomIdentity);
    });
    
    // Toggle node size button
    const sizeBtn = document.getElementById("btn-toggle-size");
    sizeBtn.addEventListener("click", function () {
      scaleByFileSize = !scaleByFileSize;
      this.classList.toggle("active", scaleByFileSize);
      
      // Update nodes radius
      nodeCircles.transition().duration(500).attr("r", d => getRadius(d));
      // Adjust label positions
      nodeLabels.transition().duration(500).attr("dy", d => getRadius(d) + 12);
      
      // Restart layout collision force to accommodate changes
      simulation.force("collide", d3.forceCollide().radius(d => scaleByFileSize ? getRadius(d) + 12 : 20));
      simulation.alpha(0.3).restart();
    });
    
    // Watch Theme switching to refresh colors
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "data-theme") {
          colors = getThemeColors();
          link.attr("stroke", colors.link);
          nodeLabels.attr("fill", colors.text);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    
    // Make responsive to window resizing
    window.addEventListener("resize", function () {
      width = container.clientWidth;
      height = container.clientHeight;
      svg.attr("viewBox", `0 0 ${width} ${height}`);
      simulation.force("center", d3.forceCenter(width / 2, height / 2));
      simulation.alpha(0.1).restart();
    });
    
  });
});
</script>
