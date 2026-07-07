/**
 * TTS Bookmark Store
 * Manages sentence-level bookmarks saved to localStorage.
 * Completely decoupled from session state and preferences.
 */
const TTSBookmarkStore = (function () {

  const STORAGE_KEY = 'tts-bookmarks:v1';
  let bookmarks = [];

  function loadBookmarks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        bookmarks = JSON.parse(stored);
        if (!Array.isArray(bookmarks)) bookmarks = [];
      }
    } catch (e) {
      console.warn("TTS: Failed to load bookmarks", e);
      bookmarks = [];
    }
  }

  function saveBookmarks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      window.dispatchEvent(new CustomEvent('tts-bookmarks-updated'));
    } catch (e) {
      console.warn("TTS: Failed to save bookmarks", e);
    }
  }

  // Generate a composite ID for internal checks
  function getBookmarkId(articleId, sentenceIndex) {
    return `${articleId}::${sentenceIndex}`;
  }

  loadBookmarks();

  return {
    /**
     * Add a bookmark if it doesn't already exist.
     */
    addBookmark(articleId, articleUrl, articleTitle, sentenceIndex, displayText) {
      if (!articleId || sentenceIndex === undefined || !displayText) return false;

      const id = getBookmarkId(articleId, sentenceIndex);
      
      // Prevent duplicates
      if (this.isBookmarked(articleId, sentenceIndex)) {
        return false;
      }

      const newBookmark = {
        id,
        articleId,
        articleUrl,
        articleTitle,
        sentenceIndex,
        displayText,
        createdAt: new Date().toISOString()
      };

      bookmarks.push(newBookmark);
      saveBookmarks();
      return true;
    },

    /**
     * Remove a bookmark.
     */
    removeBookmark(articleId, sentenceIndex) {
      const id = getBookmarkId(articleId, sentenceIndex);
      const initialLength = bookmarks.length;
      bookmarks = bookmarks.filter(b => b.id !== id);
      
      if (bookmarks.length !== initialLength) {
        saveBookmarks();
        return true;
      }
      return false;
    },

    /**
     * Remove a bookmark by its exact generated ID (useful for the My Bookmarks page).
     */
    removeBookmarkById(id) {
      const initialLength = bookmarks.length;
      bookmarks = bookmarks.filter(b => b.id !== id);
      
      if (bookmarks.length !== initialLength) {
        saveBookmarks();
        return true;
      }
      return false;
    },

    /**
     * Toggle bookmark state. Returns true if added, false if removed.
     */
    toggleBookmark(articleId, articleUrl, articleTitle, sentenceIndex, displayText) {
      if (this.isBookmarked(articleId, sentenceIndex)) {
        this.removeBookmark(articleId, sentenceIndex);
        return false;
      } else {
        this.addBookmark(articleId, articleUrl, articleTitle, sentenceIndex, displayText);
        return true;
      }
    },

    /**
     * Check if a specific sentence is bookmarked.
     */
    isBookmarked(articleId, sentenceIndex) {
      const id = getBookmarkId(articleId, sentenceIndex);
      return bookmarks.some(b => b.id === id);
    },

    /**
     * Get all bookmarks, sorted newest first.
     */
    getAllBookmarks() {
      // Return a copy, sorted descending by date
      return [...bookmarks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    
    /**
     * Clear all bookmarks.
     */
    clearAll() {
      bookmarks = [];
      saveBookmarks();
    }
  };
})();

window.TTSBookmarkStore = TTSBookmarkStore;
