---
layout: home
title: My Bookmarks
permalink: /bookmarks/
nav_exclude: true
---

<style>
  .bookmarks-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .bookmark-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-sm);
  }
  .bookmark-article-title {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .bookmark-sentence {
    font-size: 1.1rem;
    color: var(--text-heading);
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 16px;
    border-left: 3px solid var(--accent-blue);
    padding-left: 12px;
  }
  .bookmark-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border);
    padding-top: 12px;
    font-size: 0.85rem;
  }
  .bookmark-date {
    color: var(--text-muted);
  }
  .bookmark-link {
    color: var(--accent-blue);
    text-decoration: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .bookmark-link:hover {
    text-decoration: underline;
  }
  .remove-bookmark-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s;
  }
  .remove-bookmark-btn:hover {
    color: #ef4444;
  }
  .empty-bookmarks {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
  }
  .empty-bookmarks i {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }
</style>

<section class="section bookmarks-container" aria-labelledby="bookmarks-heading">
  <h2 id="bookmarks-heading">My Bookmarks</h2>
  <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">
    Bookmarks are stored locally in this browser.
  </p>

  <div id="bookmarks-list">
    <!-- Bookmarks rendered by JS -->
  </div>
</section>

<!-- Ensure Bookmark Store is loaded -->
<script src="{{ '/assets/js/tts/bookmark-store.js' | relative_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const BookmarkStore = window.TTSBookmarkStore;
    const listEl = document.getElementById('bookmarks-list');

    function renderBookmarks() {
      if (!BookmarkStore) return;
      const bookmarks = BookmarkStore.getAllBookmarks();
      
      if (bookmarks.length === 0) {
        listEl.innerHTML = `
          <div class="empty-bookmarks">
            <i class="far fa-bookmark"></i>
            <h3>No Bookmarks Yet</h3>
            <p>Listen to an article and click the bookmark icon to save sentences here.</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = '';
      bookmarks.forEach(b => {
        const dateStr = new Date(b.createdAt).toLocaleDateString(undefined, { 
          year: 'numeric', month: 'short', day: 'numeric' 
        });

        const card = document.createElement('div');
        card.className = 'bookmark-card';
        card.innerHTML = `
          <div class="bookmark-article-title">
            <i class="far fa-file-alt"></i> ${escapeHTML(b.articleTitle)}
          </div>
          <div class="bookmark-sentence">
            "${escapeHTML(b.displayText)}"
          </div>
          <div class="bookmark-actions">
            <div class="bookmark-date">${dateStr}</div>
            <div style="display: flex; gap: 16px; align-items: center;">
              <button class="remove-bookmark-btn" data-id="${b.id}" aria-label="Remove Bookmark">
                <i class="far fa-trash-alt"></i> Remove
              </button>
              <a href="${b.articleUrl}" class="bookmark-link">
                Read Article <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        `;
        listEl.appendChild(card);
      });

      // Attach remove handlers
      listEl.querySelectorAll('.remove-bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          BookmarkStore.removeBookmarkById(id);
          renderBookmarks();
        });
      });
    }

    function escapeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Initial render
    renderBookmarks();

    // Re-render if updated elsewhere (though on this page they just remove)
    window.addEventListener('tts-bookmarks-updated', renderBookmarks);
  });
</script>
