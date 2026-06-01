/**
 * kioskOG — Client-side Search
 * Uses Lunr.js for full-text indexing of all site pages.
 * Modal opens on Cmd+K / Ctrl+K or nav search button click.
 */
(function () {
  'use strict';

  var INDEX_URL = '/assets/search-index.json';
  var lunrIndex = null;
  var pagesData = [];
  var indexLoaded = false;
  var loading = false;

  /* ─── DOM refs ───────────────────────────────────────────────── */
  var modal, overlay, searchInput, resultsList, statusEl, closeBtn;

  /* ─── Bootstrap ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    injectModal();
    bindTriggers();
  });

  /* ─── Build modal HTML ───────────────────────────────────────── */
  function injectModal() {
    var el = document.createElement('div');
    el.innerHTML = [
      '<div id="ks-search-overlay" class="ks-search-overlay" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Site search">',
      '  <div class="ks-search-box" role="search">',
      '    <div class="ks-search-header">',
      '      <div class="ks-search-icon"><i class="fas fa-search" aria-hidden="true"></i></div>',
      '      <input id="ks-search-input" class="ks-search-input" type="search"',
      '        placeholder="Consult The Citadel..." autocomplete="off" spellcheck="false"',
      '        aria-label="Search the site" />',
      '      <button id="ks-search-close" class="ks-search-close" aria-label="Close search">',
      '        <span class="ks-kbd">ESC</span>',
      '      </button>',
      '    </div>',
      '    <div id="ks-search-status" class="ks-search-status"></div>',
      '    <ul id="ks-search-results" class="ks-search-results" role="listbox" aria-label="Search results"></ul>',
      '    <div class="ks-search-footer">',
      '      <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>',
      '      <span><kbd>↵</kbd> open</span>',
      '      <span><kbd>ESC</kbd> close</span>',
      '      <span class="ks-search-footer-brand">Powered by Lunr.js</span>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
    document.body.appendChild(el.firstElementChild);

    overlay    = document.getElementById('ks-search-overlay');
    modal      = overlay.querySelector('.ks-search-box');
    searchInput = document.getElementById('ks-search-input');
    resultsList = document.getElementById('ks-search-results');
    statusEl   = document.getElementById('ks-search-status');
    closeBtn   = document.getElementById('ks-search-close');

    /* Close on overlay backdrop click */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });
    closeBtn.addEventListener('click', closeSearch);

    /* Typing */
    searchInput.addEventListener('input', debounce(handleInput, 180));

    /* Keyboard: arrow keys + enter + esc */
    searchInput.addEventListener('keydown', handleKeydown);
  }

  /* ─── Keyboard triggers ──────────────────────────────────────── */
  function bindTriggers() {
    /* Cmd+K / Ctrl+K */
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
        closeSearch();
      }
    });

    /* All elements with [data-search-trigger] */
    document.querySelectorAll('[data-search-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openSearch();
      });
    });
  }

  /* ─── Open / Close ───────────────────────────────────────────── */
  function openSearch() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { searchInput.focus(); }, 60);
    if (!indexLoaded) loadIndex();
    
    // Play magical search chime
    if (window.CitadelAudio && typeof window.CitadelAudio.playSearchOpen === 'function') {
      window.CitadelAudio.playSearchOpen();
    }
  }

  function closeSearch() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    searchInput.value = '';
    resultsList.innerHTML = '';
    statusEl.textContent = '';
    
    // Play closing click
    if (window.CitadelAudio && typeof window.CitadelAudio.playClick === 'function') {
      window.CitadelAudio.playClick();
    }
  }

  /* ─── Index loading ──────────────────────────────────────────── */
  function loadIndex() {
    if (loading) return;
    loading = true;
    statusEl.textContent = 'Loading search index…';

    fetch(INDEX_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        pagesData = data;
        lunrIndex = lunr(function () {
          this.ref('id');
          this.field('title', { boost: 10 });
          this.field('section', { boost: 5 });
          this.field('tags', { boost: 4 });
          this.field('content');
          var self = this;
          data.forEach(function (p) { self.add(p); });
        });
        indexLoaded = true;
        loading = false;
        statusEl.textContent = '';
        /* Run query if user already typed */
        if (searchInput.value.trim()) handleInput();
      })
      .catch(function (err) {
        loading = false;
        statusEl.textContent = 'Could not load search index.';
        console.error('[Search]', err);
      });
  }

  /* ─── Search handler ─────────────────────────────────────────── */
  function handleInput() {
    var q = searchInput.value.trim();
    if (!indexLoaded) { loadIndex(); return; }
    if (!q) { resultsList.innerHTML = ''; statusEl.textContent = ''; return; }

    var results;
    try {
      /* Try exact and wildcard */
      results = lunrIndex.search(q + ' ' + q + '*');
    } catch (e) {
      results = lunrIndex.search(lunr.tokenizer(q).map(function(t){ return t.toString() + '*'; }).join(' '));
    }

    renderResults(results, q);
  }

  function renderResults(results, query) {
    resultsList.innerHTML = '';
    if (!results.length) {
      statusEl.textContent = 'No results for "' + escHtml(query) + '"';
      return;
    }
    statusEl.textContent = results.length + ' result' + (results.length > 1 ? 's' : '');

    var top = results.slice(0, 12);
    top.forEach(function (r, idx) {
      var page = pagesData.find(function (p) { return String(p.id) === String(r.ref); });
      if (!page) return;

      var li = document.createElement('li');
      li.className = 'ks-result-item' + (idx === 0 ? ' ks-result-active' : '');
      li.setAttribute('role', 'option');
      li.setAttribute('data-href', page.url);

      var excerpt = buildExcerpt(page.content || '', query, 120);
      var section = page.section || page.parent || 'Docs';

      li.innerHTML = [
        '<a class="ks-result-link" href="' + escHtml(page.url) + '" tabindex="-1">',
        '  <div class="ks-result-icon"><i class="fas fa-file-alt" aria-hidden="true"></i></div>',
        '  <div class="ks-result-body">',
        '    <div class="ks-result-title">' + highlight(escHtml(page.title || ''), query) + '</div>',
        '    <div class="ks-result-meta">',
        '      <span class="ks-result-section"><i class="fas fa-folder-open" aria-hidden="true"></i> ' + escHtml(section) + '</span>',
        excerpt ? '      <span class="ks-result-excerpt">' + excerpt + '</span>' : '',
        '    </div>',
        '  </div>',
        '  <div class="ks-result-arrow"><i class="fas fa-chevron-right" aria-hidden="true"></i></div>',
        '</a>'
      ].join('');

      li.querySelector('a').addEventListener('click', function () { closeSearch(); });
      resultsList.appendChild(li);
    });
  }

  /* ─── Keyboard nav within results ───────────────────────────── */
  var currentIdx = -1;
  function handleKeydown(e) {
    var items = resultsList.querySelectorAll('.ks-result-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentIdx = Math.min(currentIdx + 1, items.length - 1);
      activateItem(items, currentIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentIdx = Math.max(currentIdx - 1, 0);
      activateItem(items, currentIdx);
    } else if (e.key === 'Enter') {
      if (currentIdx >= 0 && items[currentIdx]) {
        var link = items[currentIdx].querySelector('a');
        if (link) { closeSearch(); window.location.href = link.href; }
      }
    }
  }
  function activateItem(items, idx) {
    items.forEach(function (it, i) {
      it.classList.toggle('ks-result-active', i === idx);
      if (i === idx) it.scrollIntoView({ block: 'nearest' });
    });
    currentIdx = idx;
  }
  searchInput && searchInput.addEventListener('input', function () { currentIdx = -1; });

  /* ─── Helpers ────────────────────────────────────────────────── */
  function buildExcerpt(content, query, maxLen) {
    if (!content) return '';
    var q = query.toLowerCase();
    var lo = content.toLowerCase();
    var idx = lo.indexOf(q.split(' ')[0]);
    var start = Math.max(0, idx - 40);
    var snippet = content.substring(start, start + maxLen);
    if (start > 0) snippet = '…' + snippet;
    if (start + maxLen < content.length) snippet += '…';
    return highlight(escHtml(snippet), query);
  }

  function highlight(text, query) {
    if (!query) return text;
    var words = query.split(/\s+/).filter(Boolean);
    words.forEach(function (w) {
      var re = new RegExp('(' + escRegex(w) + ')', 'gi');
      text = text.replace(re, '<mark class="ks-highlight">$1</mark>');
    });
    return text;
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function escRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }
})();
