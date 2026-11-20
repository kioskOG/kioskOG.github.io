/* Knowledge Brain — interactive graph of the site's notes.
 * Data: /assets/brain-graph.json (lean: links + excerpt), falls back to /assets/brain-raw.json.
 * Needs d3 v7 loaded first. */
(function () {
  'use strict';

  var root = document.getElementById('brain-app');
  if (!root) return;
  if (typeof d3 === 'undefined') {
    showError('The graph library could not be loaded. Check your connection and refresh the page.');
    return;
  }

  var DATA_URL = root.getAttribute('data-src');
  var FALLBACK_URL = root.getAttribute('data-fallback');
  var BASE = (root.getAttribute('data-base') || '/').replace(/\/?$/, '/');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUR = reduceMotion ? 0 : 650;
  var touch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  /* ---------- Topic groups (by folder) ---------- */
  var CATEGORIES = [
    { id: 'kubernetes', label: 'Kubernetes', color: '#3b82f6', re: /^docs\/devops\/kubernetes/i },
    { id: 'containers', label: 'Docker', color: '#06b6d4', re: /^docs\/devops\/docker/i },
    { id: 'cloud', label: 'Cloud', color: '#f59e0b', re: /^docs\/devops\/cloud/i },
    { id: 'linux', label: 'Linux & Security', color: '#ef4444', re: /^docs\/devops\/linux/i },
    { id: 'observability', label: 'Observability', color: '#ec4899', re: /^docs\/devops\/monitoring/i },
    { id: 'systems', label: 'Networking & Design', color: '#6366f1', re: /^docs\/devops\/(networking|system-design)/i },
    { id: 'automation', label: 'Python & Git', color: '#14b8a6', re: /^docs\/devops\/(python|github)/i },
    { id: 'ai', label: 'AI & Agents', color: '#a855f7', re: /^docs\/ai\//i },
    { id: 'ml', label: 'Machine Learning', color: '#10b981', re: /^docs\/ml\//i },
    { id: 'other', label: 'Hubs & Other', color: '#94a3b8', re: /./ }
  ];
  var catById = {};
  CATEGORIES.forEach(function (c) { catById[c.id] = c; });
  function categoryOf(path) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].re.test(path || '')) return CATEGORIES[i];
    return catById.other;
  }

  /* ---------- DOM ---------- */
  var $ = function (sel) { return root.querySelector(sel); };
  var canvasEl = $('.bl-canvas');
  var svgEl = $('.bl-svg');
  var panelEl = $('.bl-panel');
  var tooltipEl = $('.bl-tooltip');
  var searchInput = $('#bl-search');
  var resultsEl = $('.bl-results');
  var chipsEl = $('.bl-chips');
  var loadingEl = $('.bl-loading');
  var liveEl = $('.bl-live');

  /* ---------- Helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(u) { return (u || '').toLowerCase().replace(/[#?].*$/, '').replace(/\/+$/, ''); }
  function squash(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
  function permalinkOf(d) {
    var p = d.id;
    if (!p) p = '/' + String(d.path || '').replace(/\.md$/i, '/');
    if (p.charAt(0) !== '/') p = '/' + p;
    if (!/\/$/.test(p) && p.indexOf('.') === -1) p += '/';
    return p;
  }
  function noteUrl(id) { return BASE + String(id).replace(/^\//, ''); }
  function fmtDate(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    if (isNaN(d)) return '';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function showError(msg) {
    var l = document.querySelector('#brain-app .bl-loading');
    if (l) { l.classList.add('is-error'); l.innerHTML = '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i><p>' + msg + '</p>'; }
  }
  function announce(msg) { if (liveEl) liveEl.textContent = msg; }

  /* ---------- Load ---------- */
  function load(url) { return d3.json(url).then(function (d) { if (!Array.isArray(d) || !d.length) throw new Error('empty'); return d; }); }
  load(DATA_URL)
    .catch(function () { return FALLBACK_URL ? load(FALLBACK_URL) : Promise.reject(); })
    .then(init)
    .catch(function (e) { console.error('[brain]', e); showError('The knowledge graph could not be loaded right now.'); });

  /* ---------- Build graph ---------- */
  function extractLinks(d) {
    if (Array.isArray(d.links)) return d.links;
    var out = [], body = d.content || '', m;
    var md = /(!)?\[[^\]]*\]\(([^)\s]+)[^)]*\)/g;
    while ((m = md.exec(body))) if (!m[1]) out.push(m[2]);
    var html = /<a\s[^>]*href="([^"]+)"/gi;
    while ((m = html.exec(body))) out.push(m[1]);
    return out;
  }

  function buildGraph(raw) {
    var nodes = [], byId = new Map(), byPermalink = new Map(), byPath = new Map(), byFile = new Map(), bySlug = new Map(), byTitle = new Map();

    raw.forEach(function (d) {
      var id = permalinkOf(d);
      if (byId.has(id)) return;
      var path = String(d.path || '');
      var file = path.split('/').pop() || '';
      var n = {
        id: id,
        title: (d.title || file.replace(/\.md$/i, '').replace(/[-_]/g, ' ')).trim(),
        description: d.description || '',
        excerpt: d.excerpt || '',
        words: +d.words || 0,
        type: d.type || 'concept',
        tags: Array.isArray(d.tags) ? d.tags.filter(Boolean).map(String) : [],
        timestamp: d.timestamp || '',
        path: path,
        parentTitle: d.parent || '',
        parentUrl: d.parent_url || '',
        gpTitle: d.grand_parent || '',
        cat: categoryOf(path),
        rawLinks: extractLinks(d),
        deg: 0, children: [], parent: null, out: [], inc: []
      };
      nodes.push(n);
      byId.set(id, n);
      byPermalink.set(norm(id), n);
      byPath.set(path.toLowerCase(), n);
      byFile.set(file.toLowerCase(), n);
      byFile.set(file.toLowerCase().replace(/\.md$/, ''), n);
      var slug = norm(id).split('/').pop();
      if (slug && !bySlug.has(slug)) bySlug.set(slug, n);
      var t = squash(n.title);
      if (t && !byTitle.has(t)) byTitle.set(t, n);
    });

    var basePath = norm(BASE);
    function resolve(url, fromPath) {
      if (!url) return null;
      url = url.trim();
      if (/^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(url)) return null;
      url = url.replace(/[#?].*$/, '');
      if (!url || /\.(png|jpe?g|gif|svg|webp|ico|pdf|zip|gz|mp4|mp3|css|js|json|xml|txt)$/i.test(url)) return null;
      var n;
      if (url.charAt(0) === '/') {
        var u = norm(url);
        if (basePath && u.indexOf(basePath) === 0) u = u.slice(basePath.length) || '/';
        n = byPermalink.get(u) || byPermalink.get(norm(u + '/'));
        if (n) return n;
        n = byPath.get(u.replace(/^\//, '')) || byPath.get(u.replace(/^\//, '').replace(/\.html$/, '.md'));
        if (n) return n;
      } else {
        var parts = fromPath.split('/'); parts.pop();
        url.split('/').forEach(function (seg) {
          if (seg === '..') parts.pop(); else if (seg && seg !== '.') parts.push(seg);
        });
        var rel = parts.join('/').toLowerCase();
        n = byPath.get(rel) || byPath.get(rel + '.md') || byPath.get(rel.replace(/\.html$/, '.md'));
        if (n) return n;
      }
      var last = norm(url).split('/').pop();
      return byFile.get(last) || bySlug.get(last.replace(/\.(md|html)$/, '')) || null;
    }

    var links = [], seen = new Set();
    function addLink(s, t, type) {
      if (!s || !t || s === t) return;
      var key = s.id + '>' + t.id, rkey = t.id + '>' + s.id;
      if (seen.has(key)) return;
      if (type === 'ref' && seen.has(rkey + '#tree')) return;
      seen.add(key);
      if (type === 'tree') seen.add(key + '#tree');
      links.push({ source: s, target: t, type: type });
    }

    function findByTitle(title) {
      var t = squash(title);
      if (!t) return null;
      if (byTitle.has(t)) return byTitle.get(t);
      for (var i = 0; i < nodes.length; i++) {
        var c = squash(nodes[i].title);
        if (c && (c.indexOf(t) === 0 || t.indexOf(c) === 0)) return nodes[i];
      }
      return null;
    }

    nodes.forEach(function (n) {
      var p = (n.parentUrl && byPermalink.get(norm(n.parentUrl))) || findByTitle(n.parentTitle) || findByTitle(n.gpTitle);
      if (p && p !== n) { n.parent = p; p.children.push(n); addLink(p, n, 'tree'); }
    });
    nodes.forEach(function (n) {
      n.rawLinks.forEach(function (u) {
        var t = resolve(u, n.path);
        if (t && t !== n && t !== n.parent && n.children.indexOf(t) === -1) addLink(n, t, 'ref');
      });
      delete n.rawLinks;
    });

    links.forEach(function (l) {
      l.source.deg++; l.target.deg++;
      if (l.type === 'ref') { l.source.out.push(l.target); l.target.inc.push(l.source); }
    });
    return { nodes: nodes, links: links, byId: byId };
  }

  /* ---------- Main ---------- */
  function init(raw) {
    var G = buildGraph(raw);
    var nodes = G.nodes, links = G.links;
    var refCount = links.filter(function (l) { return l.type === 'ref'; }).length;

    var catsPresent = CATEGORIES.filter(function (c) { return nodes.some(function (n) { return n.cat === c; }); });
    catsPresent.forEach(function (c) { c.count = nodes.filter(function (n) { return n.cat === c; }).length; });

    // Hubs: top nodes by degree, always labelled.
    var ranked = nodes.slice().sort(function (a, b) { return b.deg - a.deg; });
    var hubCut = ranked[Math.min(13, ranked.length - 1)].deg;
    nodes.forEach(function (n) { n.hub = n.type === 'index' || (n.deg >= Math.max(3, hubCut)); });

    var rScale = d3.scaleSqrt().domain([0, d3.max(nodes, function (n) { return n.deg; }) || 1]).range([4.5, 17]);
    function radius(n) { return n.type === 'index' ? Math.max(13, rScale(n.deg)) : rScale(n.deg); }

    /* Layout: clusters by topic on a ring, hubs in the middle. Pre-computed so the graph appears settled. */
    var ringCats = catsPresent.filter(function (c) { return c.id !== 'other'; });
    var R = 120 + nodes.length * 1.6;
    var anchors = {};
    ringCats.forEach(function (c, i) {
      var a = (i / ringCats.length) * Math.PI * 2 - Math.PI / 2;
      anchors[c.id] = { x: Math.cos(a) * R, y: Math.sin(a) * R };
    });
    anchors.other = { x: 0, y: 0 };
    nodes.forEach(function (n) {
      var a = anchors[n.cat.id], h = hash(n.id);
      n.x = a.x + ((h & 255) - 128) * 0.6;
      n.y = a.y + (((h >> 8) & 255) - 128) * 0.6;
    });

    var sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(function (d) { return d.id; })
        .distance(function (l) { return l.type === 'tree' ? 38 : 90; })
        .strength(function (l) { return l.type === 'tree' ? 0.55 : 0.06; }))
      .force('charge', d3.forceManyBody().strength(function (n) { return n.hub ? -260 : -90; }).distanceMax(420))
      .force('x', d3.forceX(function (n) { return anchors[n.cat.id].x; }).strength(function (n) { return n.cat.id === 'other' ? 0.02 : 0.09; }))
      .force('y', d3.forceY(function (n) { return anchors[n.cat.id].y; }).strength(function (n) { return n.cat.id === 'other' ? 0.02 : 0.09; }))
      .force('collide', d3.forceCollide(function (n) { return radius(n) + 4; }).iterations(2))
      .stop();
    for (var i = 0; i < 320; i++) sim.tick();

    /* ---------- SVG ---------- */
    var svg = d3.select(svgEl);
    var defs = svg.append('defs');
    defs.append('marker').attr('id', 'bl-arrow').attr('viewBox', '0 -4 8 8').attr('refX', 8).attr('refY', 0)
      .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-3.5L8,0L0,3.5').attr('class', 'bl-arrowhead');
    var viewport = svg.append('g').attr('class', 'bl-viewport');
    var linkSel = viewport.append('g').attr('class', 'bl-links').selectAll('line').data(links).join('line')
      .attr('class', function (l) { return 'bl-link ' + l.type; })
      .attr('marker-end', function (l) { return l.type === 'ref' ? 'url(#bl-arrow)' : null; });
    var nodeSel = viewport.append('g').attr('class', 'bl-nodes').selectAll('g').data(nodes).join('g')
      .attr('class', function (n) { return 'bl-node' + (n.type === 'index' ? ' is-index' : ''); })
      .style('--c', function (n) { return n.cat.color; });
    nodeSel.append('circle').attr('class', 'bl-halo').attr('r', function (n) { return radius(n) + 6; });
    nodeSel.append('circle').attr('class', 'bl-dot').attr('r', radius);
    nodeSel.filter(function (n) { return n.type === 'index'; }).append('circle').attr('class', 'bl-core').attr('r', function (n) { return radius(n) * 0.42; });
    var labelSel = nodeSel.append('text').attr('class', 'bl-label').attr('dy', function (n) { return radius(n) + 13; })
      .text(function (n) { return n.title.length > 34 ? n.title.slice(0, 32) + '…' : n.title; });

    function draw() {
      linkSel.each(function (l) {
        var dx = l.target.x - l.source.x, dy = l.target.y - l.source.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var rt = radius(l.target) + (l.type === 'ref' ? 3 : 0), rs = radius(l.source);
        this.setAttribute('x1', l.source.x + dx / dist * rs);
        this.setAttribute('y1', l.source.y + dy / dist * rs);
        this.setAttribute('x2', l.target.x - dx / dist * rt);
        this.setAttribute('y2', l.target.y - dy / dist * rt);
      });
      nodeSel.attr('transform', function (n) { return 'translate(' + n.x + ',' + n.y + ')'; });
    }
    draw();
    sim.on('tick', draw);

    /* ---------- Zoom ---------- */
    var W = canvasEl.clientWidth, H = canvasEl.clientHeight, k = 1;
    svg.attr('viewBox', [0, 0, W, H]);
    var zoom = d3.zoom().scaleExtent([0.15, 6]).on('zoom', function (ev) {
      viewport.attr('transform', ev.transform);
      var nk = ev.transform.k;
      sizeLabels(nk);
      if ((nk >= 1.6) !== (k >= 1.6)) { k = nk; refresh(); } else k = nk;
    }).on('end', function () { refresh(); });
    svg.call(zoom).on('dblclick.zoom', null);

    // Keep labels a constant, readable size on screen whatever the zoom.
    var lastLabelK = 0;
    function sizeLabels(sk) {
      if (Math.abs(sk - lastLabelK) < 0.01) return;
      lastLabelK = sk;
      labelSel
        .attr('font-size', (11.5 / sk).toFixed(2))
        .attr('stroke-width', (3.5 / sk).toFixed(2))
        .attr('dy', function (n) { return radius(n) + 13 / sk; });
    }

    function fitTo(list, animate, maxScale) {
      list = (list && list.length) ? list : nodes.filter(visible);
      if (!list.length) return;
      var x0 = d3.min(list, function (n) { return n.x - radius(n); }), x1 = d3.max(list, function (n) { return n.x + radius(n); });
      var y0 = d3.min(list, function (n) { return n.y - radius(n); }), y1 = d3.max(list, function (n) { return n.y + radius(n) + 16; });
      var pad = W < 600 ? 30 : 48, bw = Math.max(x1 - x0, 1), bh = Math.max(y1 - y0, 1);
      var s = Math.min((W - pad * 2) / bw, (H - pad * 2) / bh, maxScale || 2.4);
      var t = d3.zoomIdentity.translate(W / 2 - s * (x0 + bw / 2), H / 2 - s * (y0 + bh / 2)).scale(s);
      (animate && DUR ? svg.transition().duration(DUR).ease(d3.easeCubicInOut) : svg).call(zoom.transform, t);
    }
    function centerOn(n) {
      var s = Math.max(k, 1.7);
      var t = d3.zoomIdentity.translate(W / 2 - n.x * s, H / 2 - n.y * s).scale(s);
      (DUR ? svg.transition().duration(DUR).ease(d3.easeCubicInOut) : svg).call(zoom.transform, t);
    }
    new ResizeObserver(function () {
      var nw = canvasEl.clientWidth, nh = canvasEl.clientHeight;
      if (!nw || !nh || (nw === W && nh === H)) return;
      W = nw; H = nh; svg.attr('viewBox', [0, 0, W, H]);
    }).observe(canvasEl);

    /* ---------- State + styling ---------- */
    var currentResults = [];
    var state = { selected: null, hovered: null, matches: null, hidden: new Set(), showTree: true, labels: 'auto' };
    function visible(n) { return !state.hidden.has(n.cat.id); }
    function neighbours(n) {
      var s = new Set([n]);
      links.forEach(function (l) {
        if (!state.showTree && l.type === 'tree') return;
        if (l.source === n) s.add(l.target);
        if (l.target === n) s.add(l.source);
      });
      return s;
    }

    function refresh() {
      var focus = state.hovered || state.selected;
      var focusSet = focus ? neighbours(focus) : null;
      var matchSet = state.matches;

      nodeSel
        .classed('is-hidden', function (n) { return !visible(n); })
        .classed('is-dim', function (n) {
          if (!visible(n)) return false;
          if (focusSet) return !focusSet.has(n);
          if (matchSet) return !matchSet.has(n);
          return false;
        })
        .classed('is-focus', function (n) { return n === focus; })
        .classed('is-selected', function (n) { return n === state.selected; })
        .classed('is-match', function (n) { return !focusSet && matchSet && matchSet.has(n); });

      linkSel
        .classed('is-hidden', function (l) { return !visible(l.source) || !visible(l.target) || (!state.showTree && l.type === 'tree'); })
        .classed('is-active', function (l) { return focus && (l.source === focus || l.target === focus); })
        .classed('is-dim', function (l) {
          if (focusSet) return !(l.source === focus || l.target === focus);
          if (matchSet) return !(matchSet.has(l.source) && matchSet.has(l.target));
          return false;
        })
        .style('--c', function (l) { return focus && (l.source === focus || l.target === focus) ? focus.cat.color : null; });

      nodes.forEach(function (n) {
        var want;
        if (!visible(n) || state.labels === 'off') want = false;
        else if (state.labels === 'all') want = true;
        else if (focusSet) want = focusSet.has(n);
        else if (matchSet) want = currentResults.indexOf(n) !== -1 || (matchSet.has(n) && n.hub);
        else want = n.hub || k >= 1.6;
        n.wantLabel = want;
        n.labelRank = (n === focus ? 1e6 : 0) + (n === state.selected ? 5e5 : 0) + (n.type === 'index' ? 1e3 : 0) + n.deg;
      });
      declutter();
      if (focus) nodeSel.filter(function (n) { return focusSet.has(n); }).raise();
    }

    // Hide labels that would overlap a more important one (screen space).
    function declutter() {
      var t = d3.zoomTransform(svgEl), placed = [];
      var list = nodes.filter(function (n) { return n.wantLabel; }).sort(function (a, b) { return b.labelRank - a.labelRank; });
      var shown = new Set();
      list.forEach(function (n) {
        var text = n.title.length > 34 ? 34 : n.title.length;
        var w = text * 6.6 + 12, h = 19;
        var cx = t.applyX(n.x), cy = t.applyY(n.y) + radius(n) * t.k + 9;
        var box = { x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2 };
        var clash = state.labels !== 'all' && placed.some(function (b) { return box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0; });
        if (!clash) { placed.push(box); shown.add(n); }
      });
      labelSel.classed('is-shown', function (n) { return shown.has(n); });
    }

    /* ---------- Tooltip ---------- */
    function showTip(ev, n) {
      var bits = [];
      function pl(c, one, many) { return c + ' ' + (c === 1 ? one : many); }
      if (n.children.length) bits.push(pl(n.children.length, 'note inside', 'notes inside'));
      if (n.out.length) bits.push(pl(n.out.length, 'link out', 'links out'));
      if (n.inc.length) bits.push(pl(n.inc.length, 'link in', 'links in'));
      tooltipEl.innerHTML =
        '<span class="bl-tip-cat"><i style="background:' + n.cat.color + '"></i>' + esc(n.cat.label) + '</span>' +
        '<strong>' + esc(n.title) + '</strong>' +
        (bits.length ? '<span class="bl-tip-meta">' + bits.join(' · ') + '</span>' : '');
      tooltipEl.hidden = false;
      moveTip(ev);
    }
    function moveTip(ev) {
      var r = canvasEl.getBoundingClientRect();
      var x = ev.clientX - r.left + 14, y = ev.clientY - r.top + 14;
      var tw = tooltipEl.offsetWidth, th = tooltipEl.offsetHeight;
      if (x + tw > r.width - 8) x = ev.clientX - r.left - tw - 14;
      if (y + th > r.height - 8) y = ev.clientY - r.top - th - 14;
      tooltipEl.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    }
    function hideTip() { tooltipEl.hidden = true; }

    /* ---------- Interactions ---------- */
    nodeSel
      .on('mouseenter', function (ev, n) { if (!visible(n)) return; state.hovered = n; refresh(); showTip(ev, n); })
      .on('mousemove', function (ev) { if (!tooltipEl.hidden) moveTip(ev); })
      .on('mouseleave', function () { state.hovered = null; refresh(); hideTip(); })
      .on('click', function (ev, n) { ev.stopPropagation(); if (visible(n)) select(n, { center: false }); })
      .call(d3.drag()
        .on('start', function (ev, n) { if (!ev.active) sim.alphaTarget(0.12).restart(); n.fx = n.x; n.fy = n.y; hideTip(); })
        .on('drag', function (ev, n) { n.fx = ev.x; n.fy = ev.y; })
        .on('end', function (ev, n) { if (!ev.active) sim.alphaTarget(0); n.fx = null; n.fy = null; setTimeout(refresh, 400); }));

    svg.on('click', function () { if (state.selected) select(null); });

    function setUrl(n) {
      try {
        var u = new URL(window.location.href);
        ['node', 'id', 'path', 'q', 'tag'].forEach(function (p) { u.searchParams.delete(p); });
        if (n) u.searchParams.set('node', n.id);
        history.replaceState(null, '', u.pathname + u.search + u.hash);
      } catch (e) { /* ignore */ }
    }

    function select(n, opts) {
      opts = opts || {};
      state.selected = n;
      if (n && state.hidden.has(n.cat.id)) { state.hidden.delete(n.cat.id); renderChips(); }
      refresh();
      setUrl(n);
      if (n) {
        renderDetails(n);
        if (opts.center !== false) fitTo(Array.from(neighbours(n)), true, 2.2);
        announce('Selected ' + n.title);
      } else {
        renderOverview();
      }
    }

    /* ---------- Panel ---------- */
    function nodeItem(n, note) {
      return '<li><button type="button" class="bl-item" data-id="' + esc(n.id) + '">' +
        '<i class="bl-dot-sm" style="background:' + n.cat.color + '"></i>' +
        '<span class="bl-item-title">' + esc(n.title) + '</span>' +
        (note != null ? '<span class="bl-item-note">' + esc(note) + '</span>' : '') +
        '</button></li>';
    }
    function section(title, list, icon) {
      if (!list.length) return '';
      return '<section class="bl-sec"><h3><i class="fas ' + icon + '" aria-hidden="true"></i>' + esc(title) +
        '<span class="bl-count">' + list.length + '</span></h3><ul class="bl-list">' +
        list.map(function (n) { return nodeItem(n); }).join('') + '</ul></section>';
    }
    function bindItems() {
      panelEl.querySelectorAll('[data-id]').forEach(function (b) {
        b.addEventListener('click', function () { var n = G.byId.get(this.getAttribute('data-id')); if (n) select(n); });
      });
      panelEl.querySelectorAll('[data-tag]').forEach(function (b) {
        b.addEventListener('click', function () { setQuery(this.getAttribute('data-tag')); searchInput.focus(); });
      });
    }

    function renderOverview() {
      var top = ranked.filter(function (n) { return n.deg > 0; }).slice(0, 6);
      var recent = nodes.filter(function (n) { return n.timestamp && !isNaN(new Date(n.timestamp)); })
        .sort(function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp); }).slice(0, 5);
      panelEl.innerHTML =
        '<div class="bl-overview">' +
        '<div class="bl-eyebrow"><i class="fas fa-brain" aria-hidden="true"></i> Overview</div>' +
        '<h2 class="bl-title">Explore how the notes connect</h2>' +
        '<p class="bl-lead">Each dot is a note, coloured by topic. ' + (touch ? 'Tap a note to see its links and details, pinch to zoom, or search above.' : 'Hover to trace its links, click to open its details, or search above.') + '</p>' +
        '<div class="bl-stats">' +
        '<div><strong>' + nodes.length + '</strong><span>notes</span></div>' +
        '<div><strong>' + refCount + '</strong><span>cross-links</span></div>' +
        '<div><strong>' + catsPresent.length + '</strong><span>topics</span></div>' +
        '</div>' +
        '<section class="bl-sec"><h3><i class="fas fa-diagram-project" aria-hidden="true"></i>Most connected</h3><ul class="bl-list">' +
        top.map(function (n) { return nodeItem(n, n.deg); }).join('') + '</ul></section>' +
        (recent.length ? '<section class="bl-sec"><h3><i class="fas fa-clock-rotate-left" aria-hidden="true"></i>Recently updated</h3><ul class="bl-list">' +
          recent.map(function (n) { return nodeItem(n, fmtDate(n.timestamp)); }).join('') + '</ul></section>' : '') +
        '<div class="bl-keys"><span><kbd>/</kbd> search</span><span><kbd>Esc</kbd> clear</span><span><kbd>F</kbd> fit view</span></div>' +
        '</div>';
      bindItems();
      panelEl.scrollTop = 0;
    }

    function renderDetails(n) {
      var crumbs = [];
      if (n.parent && n.parent.parent) crumbs.push(n.parent.parent);
      if (n.parent) crumbs.push(n.parent);
      var mins = n.words ? Math.max(1, Math.round(n.words / 220)) : 0;
      var date = fmtDate(n.timestamp);
      var desc = n.description || n.excerpt;
      var outs = n.out.filter(visible), ins = n.inc.filter(visible), kids = n.children.filter(visible);
      var any = outs.length || ins.length || kids.length || n.parent;

      panelEl.innerHTML =
        '<div class="bl-detail" style="--c:' + n.cat.color + '">' +
        '<div class="bl-detail-top">' +
        '<button type="button" class="bl-back" aria-label="Back to overview"><i class="fas fa-arrow-left" aria-hidden="true"></i> Overview</button>' +
        '</div>' +
        (crumbs.length ? '<nav class="bl-crumbs" aria-label="Location">' + crumbs.map(function (c) {
          return '<button type="button" data-id="' + esc(c.id) + '">' + esc(c.title) + '</button>';
        }).join('<i class="fas fa-chevron-right" aria-hidden="true"></i>') + '</nav>' : '') +
        '<h2 class="bl-title">' + esc(n.title) + '</h2>' +
        '<div class="bl-meta">' +
        '<span class="bl-pill"><i style="background:' + n.cat.color + '"></i>' + esc(n.cat.label) + '</span>' +
        (n.type === 'index' ? '<span class="bl-pill is-index">Index</span>' : '') +
        (date ? '<span><i class="far fa-calendar" aria-hidden="true"></i>' + esc(date) + '</span>' : '') +
        (mins ? '<span><i class="far fa-clock" aria-hidden="true"></i>' + mins + ' min read</span>' : '') +
        '</div>' +
        (desc ? '<p class="bl-desc">' + esc(desc) + '</p>' : '') +
        '<div class="bl-actions">' +
        '<a class="bl-cta" href="' + esc(noteUrl(n.id)) + '"><i class="fas fa-book-open" aria-hidden="true"></i> Read the note</a>' +
        '<button type="button" class="bl-ghost bl-copy" title="Copy a link to this node"><i class="fas fa-link" aria-hidden="true"></i><span>Copy link</span></button>' +
        '</div>' +
        (n.tags.length ? '<div class="bl-tags">' + n.tags.map(function (t) {
          return '<button type="button" data-tag="' + esc(t) + '">#' + esc(t) + '</button>';
        }).join('') + '</div>' : '') +
        (n.parent && visible(n.parent) ? section('Part of', [n.parent], 'fa-arrow-turn-up') : '') +
        section('Contains', kids, 'fa-folder-tree') +
        section('Links to', outs, 'fa-arrow-right') +
        section('Linked from', ins, 'fa-arrow-left') +
        (!any ? '<p class="bl-empty">No connections yet. This note stands on its own.</p>' : '') +
        '</div>';

      panelEl.querySelector('.bl-back').addEventListener('click', function () { select(null); });
      panelEl.querySelector('.bl-copy').addEventListener('click', function () {
        var btn = this, u = new URL(window.location.href);
        u.search = '?node=' + encodeURIComponent(n.id); u.hash = '';
        var done = function () { btn.classList.add('is-done'); btn.querySelector('span').textContent = 'Copied'; setTimeout(function () { btn.classList.remove('is-done'); btn.querySelector('span').textContent = 'Copy link'; }, 1600); };
        if (navigator.clipboard) navigator.clipboard.writeText(u.toString()).then(done, function () {}); else done();
      });
      bindItems();
      panelEl.scrollTop = 0;
    }

    /* ---------- Topic chips ---------- */
    function renderChips() {
      chipsEl.innerHTML = catsPresent.map(function (c) {
        var on = !state.hidden.has(c.id);
        return '<button type="button" class="bl-chip' + (on ? '' : ' is-off') + '" data-cat="' + c.id + '" aria-pressed="' + on + '" title="' + (on ? 'Hide ' : 'Show ') + esc(c.label) + ' (Alt-click to show only this topic)">' +
          '<i style="background:' + c.color + '"></i>' + esc(c.label) + '<span>' + c.count + '</span></button>';
      }).join('') + (state.hidden.size ? '<button type="button" class="bl-chip bl-chip-reset" data-cat="*"><i class="fas fa-rotate-left" aria-hidden="true"></i>Show all</button>' : '');
    }
    chipsEl.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-cat]');
      if (!b) return;
      var id = b.getAttribute('data-cat');
      if (id === '*') state.hidden.clear();
      else if (ev.altKey || ev.metaKey) {
        var only = state.hidden.size === catsPresent.length - 1 && !state.hidden.has(id);
        state.hidden.clear();
        if (!only) catsPresent.forEach(function (c) { if (c.id !== id) state.hidden.add(c.id); });
      } else if (state.hidden.has(id)) state.hidden.delete(id);
      else state.hidden.add(id);
      if (state.selected && !visible(state.selected)) { state.selected = null; setUrl(null); renderOverview(); }
      renderChips(); refresh();
    });

    /* ---------- Search ---------- */
    var activeIdx = -1;
    function score(n, q) {
      var t = n.title.toLowerCase();
      if (t === q) return 100;
      if (t.indexOf(q) === 0) return 80;
      if (t.indexOf(' ' + q) !== -1) return 65;
      if (t.indexOf(q) !== -1) return 55;
      if (n.tags.some(function (x) { return x.toLowerCase() === q; })) return 50;
      if (n.tags.some(function (x) { return x.toLowerCase().indexOf(q) !== -1; })) return 40;
      if (n.cat.label.toLowerCase().indexOf(q) !== -1) return 30;
      if ((n.description || '').toLowerCase().indexOf(q) !== -1) return 20;
      if (n.path.toLowerCase().indexOf(q) !== -1) return 10;
      return 0;
    }
    function setQuery(q) { searchInput.value = q; runSearch(); }
    function runSearch() {
      var q = searchInput.value.trim().toLowerCase();
      root.classList.toggle('has-query', !!q);
      if (!q) { state.matches = null; currentResults = []; closeResults(); refresh(); return; }
      var scored = nodes.map(function (n) { return { n: n, s: score(n, q) }; }).filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s || b.n.deg - a.n.deg; });
      state.matches = new Set(scored.map(function (x) { return x.n; }));
      currentResults = scored.slice(0, 8).map(function (x) { return x.n; });
      activeIdx = currentResults.length ? 0 : -1;
      renderResults(scored.length);
      refresh();
    }
    function renderResults(total) {
      if (!currentResults.length) {
        resultsEl.innerHTML = '<div class="bl-noresult">No notes match “' + esc(searchInput.value.trim()) + '”</div>';
      } else {
        resultsEl.innerHTML = currentResults.map(function (n, i) {
          return '<button type="button" role="option" id="bl-opt-' + i + '" class="bl-result' + (i === activeIdx ? ' is-active' : '') + '" data-idx="' + i + '" aria-selected="' + (i === activeIdx) + '">' +
            '<i class="bl-dot-sm" style="background:' + n.cat.color + '"></i><span class="bl-result-title">' + esc(n.title) + '</span>' +
            '<span class="bl-result-cat">' + esc(n.cat.label) + '</span></button>';
        }).join('') + (total > currentResults.length ? '<div class="bl-result-more">' + total + ' matches highlighted in the graph</div>' : '');
      }
      resultsEl.hidden = false;
      searchInput.setAttribute('aria-expanded', 'true');
      searchInput.setAttribute('aria-activedescendant', activeIdx >= 0 ? 'bl-opt-' + activeIdx : '');
    }
    function closeResults() { resultsEl.hidden = true; searchInput.setAttribute('aria-expanded', 'false'); }
    function pick(i) {
      var n = currentResults[i];
      if (!n) return;
      closeResults();
      select(n);
    }
    searchInput.addEventListener('input', runSearch);
    searchInput.addEventListener('focus', function () { if (searchInput.value.trim()) runSearch(); });
    searchInput.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
        if (!currentResults.length) return;
        ev.preventDefault();
        activeIdx = (activeIdx + (ev.key === 'ArrowDown' ? 1 : -1) + currentResults.length) % currentResults.length;
        renderResults(state.matches ? state.matches.size : 0);
      } else if (ev.key === 'Enter') {
        ev.preventDefault(); pick(activeIdx < 0 ? 0 : activeIdx);
      } else if (ev.key === 'Escape') {
        ev.stopPropagation();
        if (searchInput.value) setQuery(''); else searchInput.blur();
      }
    });
    resultsEl.addEventListener('mousedown', function (ev) {
      var b = ev.target.closest('[data-idx]');
      if (b) { ev.preventDefault(); pick(+b.getAttribute('data-idx')); }
    });
    searchInput.addEventListener('blur', function () { setTimeout(closeResults, 120); });
    $('.bl-search-clear').addEventListener('click', function () { setQuery(''); searchInput.focus(); });

    /* ---------- Canvas controls ---------- */
    function on(sel, fn) { var el = $(sel); if (el) el.addEventListener('click', fn); }
    on('[data-act="zoom-in"]', function () { svg.transition().duration(reduceMotion ? 0 : 220).call(zoom.scaleBy, 1.35); });
    on('[data-act="zoom-out"]', function () { svg.transition().duration(reduceMotion ? 0 : 220).call(zoom.scaleBy, 1 / 1.35); });
    on('[data-act="fit"]', function () { fitTo(null, true); });
    on('[data-act="labels"]', function () {
      state.labels = state.labels === 'auto' ? 'all' : state.labels === 'all' ? 'off' : 'auto';
      this.setAttribute('data-mode', state.labels);
      this.setAttribute('aria-label', 'Labels: ' + state.labels);
      this.querySelector('span').textContent = { auto: 'Labels: auto', all: 'Labels: all', off: 'Labels: off' }[state.labels];
      refresh();
    });
    on('[data-act="tree"]', function () {
      state.showTree = !state.showTree;
      this.setAttribute('aria-pressed', String(state.showTree));
      refresh();
    });
    on('[data-act="fullscreen"]', function () {
      var stage = $('.bl-stage');
      if (document.fullscreenElement) document.exitFullscreen();
      else if (stage.requestFullscreen) stage.requestFullscreen();
    });
    document.addEventListener('fullscreenchange', function () {
      root.classList.toggle('is-fullscreen', !!document.fullscreenElement);
      setTimeout(function () { fitTo(state.selected ? [state.selected].concat(Array.from(neighbours(state.selected))) : null, true); }, 120);
    });

    document.addEventListener('keydown', function (ev) {
      var tag = (ev.target && ev.target.tagName) || '';
      var typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (ev.target && ev.target.isContentEditable);
      if (ev.key === '/' && !typing && !ev.metaKey && !ev.ctrlKey) { ev.preventDefault(); searchInput.focus(); searchInput.select(); }
      else if (ev.key === 'Escape' && !typing) { if (state.selected) select(null); else if (state.matches) setQuery(''); }
      else if ((ev.key === 'f' || ev.key === 'F') && !typing && !ev.metaKey && !ev.ctrlKey) {
        var r = root.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) fitTo(null, true);
      }
    });

    /* ---------- Start ---------- */
    fitTo(nodes, false);
    renderChips();
    renderOverview();
    refresh();
    root.classList.add('is-ready');
    if (loadingEl) loadingEl.hidden = true;

    // Deep links: ?node= ?id= ?path= ?tag= ?q=
    var params = new URLSearchParams(window.location.search);
    var nodeP = params.get('node') || params.get('id'), pathP = params.get('path'), tagP = params.get('tag'), qP = params.get('q');
    var target = null;
    if (nodeP) {
      var c = norm(decodeURIComponent(nodeP));
      target = G.byId.get(nodeP) || nodes.find(function (n) { return norm(n.id) === c || norm(n.path) === c; }) ||
        nodes.find(function (n) { var nid = norm(n.id); return nid && c && (nid.slice(-c.length) === c || c.slice(-nid.length) === nid); });
    } else if (pathP) {
      var pp = decodeURIComponent(pathP).toLowerCase();
      target = nodes.find(function (n) { return n.path.toLowerCase().indexOf(pp) !== -1; });
    } else if (tagP) {
      searchInput.value = decodeURIComponent(tagP); runSearch(); closeResults();
      var ms = nodes.filter(function (n) { return state.matches && state.matches.has(n); });
      if (ms.length) setTimeout(function () { fitTo(ms, true, 1.8); }, 300);
    } else if (qP) {
      searchInput.value = decodeURIComponent(qP); runSearch(); closeResults();
    }
    if (target) setTimeout(function () { select(target); }, 350);
  }
})();
