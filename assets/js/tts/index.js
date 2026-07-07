/**
 * TTS Orchestrator (Index)
 * Wires up the store, engine, extractor, players, highlighting, and scrolling.
 */
document.addEventListener('DOMContentLoaded', () => {

  const Store = window.TTSStore;
  const Engine = window.TTSSpeechEngine;
  const Extractor = window.TTSArticleExtractor;
  const MainPlayer = window.TTSArticlePlayer;
  const FloatingPlayer = window.TTSFloatingPlayer;
  const MediaSessionController = window.TTSMediaSessionController;

  let currentRuntimeModel = [];
  let isArticlePage = false;
  let articleId = null;
  let articleTitle = null;
  
  // Highlight objects
  let activeHighlightNode = null;
  const HIGHLIGHT_NAME = 'tts-active';
  const hasCustomHighlight = 'highlights' in CSS;

  // Auto-scroll suspension
  let isAutoScrollSuspended = false;
  let manualScrollTimeout = null;

  function init() {
    // 1. Determine if we are on an article
    const prose = document.querySelector('.doc-prose');
    if (prose) {
      isArticlePage = true;
      articleId = window.location.pathname; // using path as stable ID
      const titleEl = document.querySelector('.doc-title');
      articleTitle = titleEl ? titleEl.textContent.trim() : document.title;
      
      // Mount Main Player
      // We will inject the root if it doesn't exist. Usually we'd expect the layout to have it.
      let mainRoot = document.getElementById('tts-player-root');
      if (!mainRoot) {
        mainRoot = document.createElement('div');
        mainRoot.id = 'tts-player-root';
        // Insert right above the prose
        prose.parentNode.insertBefore(mainRoot, prose);
      }
      MainPlayer.mount('tts-player-root');
    }

    // Mount Floating Player
    let floatRoot = document.getElementById('tts-floating-player-root');
    if (!floatRoot) {
      floatRoot = document.createElement('div');
      floatRoot.id = 'tts-floating-player-root';
      document.body.appendChild(floatRoot);
    }
    FloatingPlayer.mount('tts-floating-player-root');

    Engine.init();
    if (MediaSessionController) {
      MediaSessionController.init();
    }

    // Check for Resume
    checkResumeState();

    // Listeners
    window.addEventListener('tts-request-start-article', startCurrentArticle);
    window.addEventListener('tts-request-bookmark', handleRequestBookmark);
    window.addEventListener('tts-sync-extended-ui', handleSyncExtendedUI);
    Store.subscribe(handleStateChange);
    
    // Scroll detection
    window.addEventListener('wheel', handleManualScroll, { passive: true });
    window.addEventListener('touchmove', handleManualScroll, { passive: true });
  }

  function startCurrentArticle() {
    if (!isArticlePage) return;
    
    const prose = document.querySelector('.doc-prose');
    const extraction = Extractor.extract(prose);
    currentRuntimeModel = extraction.sentences;
    
    Store.updateSession({
      articleId: articleId,
      articleUrl: window.location.href,
      articleTitle: articleTitle,
      sentenceIndex: 0,
      totalSentences: currentRuntimeModel.length,
      queueFingerprint: extraction.fingerprint,
      playerMinimized: false
    });

    Engine.setQueue(currentRuntimeModel);
    Engine.play(0);
    
    if (MediaSessionController) {
      MediaSessionController.setMetadata(articleTitle);
    }
  }

  function checkResumeState() {
    const state = Store.getState();
    if (!state.articleId) return;

    if (isArticlePage && state.articleId === articleId) {
      // Same article. Re-extract and verify fingerprint.
      const prose = document.querySelector('.doc-prose');
      const extraction = Extractor.extract(prose);
      currentRuntimeModel = extraction.sentences;
      Engine.setQueue(currentRuntimeModel);
      
      if (extraction.fingerprint !== state.queueFingerprint) {
        // Content changed, reset position
        Store.updateSession({
          sentenceIndex: 0,
          totalSentences: currentRuntimeModel.length,
          queueFingerprint: extraction.fingerprint
        });
      }
      
      if (MediaSessionController) {
        MediaSessionController.setMetadata(articleTitle);
      }
      // We do NOT autoplay. The MainPlayer will show "Resume" based on sentenceIndex > 0
    }
  }

  function handleRequestBookmark() {
    const BookmarkStore = window.TTSBookmarkStore;
    if (!BookmarkStore || !isArticlePage) return;
    
    const state = Store.getState();
    if (state.engineState === Store.STATES.IDLE || currentRuntimeModel.length === 0) return;
    
    const sentenceObj = currentRuntimeModel[state.sentenceIndex];
    if (!sentenceObj) return;

    BookmarkStore.toggleBookmark(
      articleId,
      window.location.href,
      articleTitle,
      state.sentenceIndex,
      sentenceObj.displayText
    );
    
    handleSyncExtendedUI();
  }

  function handleSyncExtendedUI() {
    const BookmarkStore = window.TTSBookmarkStore;
    const ListeningTime = window.TTSListeningTime;
    const state = Store.getState();
    
    // Update Bookmark Button UI
    if (BookmarkStore && isArticlePage) {
      const bookmarkBtn = document.getElementById('tts-main-bookmark');
      if (bookmarkBtn) {
        const icon = bookmarkBtn.querySelector('i');
        if (BookmarkStore.isBookmarked(articleId, state.sentenceIndex)) {
          icon.className = 'fas fa-bookmark';
          icon.style.color = 'var(--accent-blue)';
        } else {
          icon.className = 'far fa-bookmark';
          icon.style.color = '';
        }
      }
    }
    
    // Update Listening Time UI
    if (ListeningTime && isArticlePage) {
      const timeLabel = document.getElementById('tts-main-time');
      if (timeLabel && currentRuntimeModel.length > 0) {
        const estMinutes = ListeningTime.getEstimatedMinutes(currentRuntimeModel, state.sentenceIndex, state.rate);
        if (state.engineState === Store.STATES.COMPLETED) {
          timeLabel.textContent = '';
        } else {
          timeLabel.textContent = '· ' + ListeningTime.formatEstimate(estMinutes);
        }
      }
    }
  }

  // State sync for Highlighting and Scrolling
  let previousSentenceIndex = -1;
  let previousEngineState = null;

  function handleStateChange(state) {
    if (state.engineState === Store.STATES.IDLE || state.engineState === Store.STATES.COMPLETED) {
      clearHighlight();
      previousSentenceIndex = -1;
      return;
    }

    if (isArticlePage && state.articleId === articleId && currentRuntimeModel.length > 0) {
      // Only highlight if playing or paused
      if (state.engineState === Store.STATES.PLAYING || state.engineState === Store.STATES.PAUSED) {
        if (state.sentenceIndex !== previousSentenceIndex) {
          const sentenceObj = currentRuntimeModel[state.sentenceIndex];
          if (sentenceObj) {
            applyHighlight(sentenceObj);
            
            // Only auto-scroll if it's playing (not when user just seeks while paused)
            if (state.engineState === Store.STATES.PLAYING && state.autoScroll && !isAutoScrollSuspended) {
              scrollToSentence(sentenceObj);
            }
          }
          previousSentenceIndex = state.sentenceIndex;
          handleSyncExtendedUI();
        }
      }
    }
    
    // Resume auto-scroll when user manually enables it via prefs
    if (state.autoScroll && isAutoScrollSuspended) {
       isAutoScrollSuspended = false;
    }
  }

  // --- Highlighting Logic ---
  
  function clearHighlight() {
    if (hasCustomHighlight) {
      CSS.highlights.delete(HIGHLIGHT_NAME);
    } else if (activeHighlightNode) {
      activeHighlightNode.classList.remove('tts-block-highlight');
      activeHighlightNode = null;
    }
  }

  function applyHighlight(sentenceObj) {
    clearHighlight();

    if (hasCustomHighlight) {
      try {
        const range = new Range();
        range.setStart(sentenceObj.startNode, sentenceObj.startOffset);
        range.setEnd(sentenceObj.endNode, sentenceObj.endOffset);
        
        const highlight = new Highlight(range);
        CSS.highlights.set(HIGHLIGHT_NAME, highlight);
      } catch (e) {
        console.warn("TTS: Custom Highlight API failed, falling back to block highlight", e);
        applyFallbackHighlight(sentenceObj);
      }
    } else {
      applyFallbackHighlight(sentenceObj);
    }
  }
  
  function applyFallbackHighlight(sentenceObj) {
    activeHighlightNode = sentenceObj.blockElement;
    if (activeHighlightNode) {
      activeHighlightNode.classList.add('tts-block-highlight');
    }
  }

  // --- Scrolling Logic ---
  
  function scrollToSentence(sentenceObj) {
    if (!sentenceObj.blockElement) return;
    
    const rect = sentenceObj.blockElement.getBoundingClientRect();
    const navH = 80; // approximate nav height
    
    // If element is outside viewport boundaries
    if (rect.top < navH || rect.bottom > window.innerHeight - 100) {
      // Temporarily ignore scroll events so we don't suspend autoscroll due to programmatic scroll
      isProgrammaticScroll = true;
      const targetY = window.scrollY + rect.top - navH - 20;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      
      setTimeout(() => { isProgrammaticScroll = false; }, 800);
    }
  }
  
  let isProgrammaticScroll = false;
  
  function handleManualScroll() {
    if (isProgrammaticScroll) return;
    
    const state = Store.getState();
    if (state.engineState !== Store.STATES.PLAYING) return;
    if (!state.autoScroll || isAutoScrollSuspended) return;

    if (manualScrollTimeout) clearTimeout(manualScrollTimeout);
    
    // Simple logic: if user scrolls while playing, we suspend.
    // A robust app might check scroll distance delta.
    isAutoScrollSuspended = true;
    
    // We update prefs to toggle the checkbox off in the UI, 
    // so the user knows they can click it again to resume follow.
    Store.updatePrefs({ autoScroll: false });
  }

  // Run
  init();

});
