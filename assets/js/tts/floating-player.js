/**
 * TTS Floating Player UI
 * Global floating player for non-active articles or minimized state.
 */
const TTSFloatingPlayer = (function () {
  
  const Store = window.TTSStore;
  const Engine = window.TTSSpeechEngine;

  let rootElement = null;
  let unsubscribe = null;
  let isCurrentArticle = false;

  function renderHTML() {
    return `
      <div class="tts-floating-player" role="region" aria-label="Floating Listen Player">
        <div class="tts-floating-header">
          <div class="tts-floating-title" id="tts-floating-title">No Article</div>
          <button class="tts-btn" style="padding:4px; font-size: 0.8rem;" id="tts-floating-close" aria-label="Close and Stop">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        
        <div class="tts-progress-container" style="margin-top: 4px; margin-bottom: 8px;">
          <div class="tts-progress-bar" id="tts-floating-progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
            <div class="tts-progress-fill" id="tts-floating-progress-fill"></div>
          </div>
        </div>

        <div class="tts-floating-controls">
          <button class="tts-btn" id="tts-floating-prev" aria-label="Previous Sentence" disabled>
            <i class="fas fa-step-backward" aria-hidden="true"></i>
          </button>
          
          <button class="tts-btn primary" id="tts-floating-play" aria-label="Play or Pause" disabled>
            <i class="fas fa-play" aria-hidden="true"></i>
          </button>
          
          <button class="tts-btn" id="tts-floating-next" aria-label="Next Sentence" disabled>
            <i class="fas fa-step-forward" aria-hidden="true"></i>
          </button>

          <a href="#" class="tts-btn tts-resume-btn" id="tts-floating-expand" style="margin-left:auto;">
            <i class="fas fa-external-link-alt" aria-hidden="true"></i> Return
          </a>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const playBtn = document.getElementById('tts-floating-play');
    const prevBtn = document.getElementById('tts-floating-prev');
    const nextBtn = document.getElementById('tts-floating-next');
    const closeBtn = document.getElementById('tts-floating-close');
    const expandBtn = document.getElementById('tts-floating-expand');

    playBtn.addEventListener('click', () => {
      if (!isCurrentArticle) return; // Disabled on non-article pages natively, but safeguard
      const state = Store.getState();
      if (state.engineState === Store.STATES.PLAYING) Engine.pause();
      else if (state.engineState === Store.STATES.PAUSED) Engine.resume();
      else Engine.play(state.sentenceIndex);
    });

    prevBtn.addEventListener('click', () => {
      if (isCurrentArticle) Engine.prev();
    });

    nextBtn.addEventListener('click', () => {
      if (isCurrentArticle) Engine.next();
    });

    closeBtn.addEventListener('click', () => {
      Engine.stop();
      Store.clearSession();
    });

    expandBtn.addEventListener('click', (e) => {
      if (isCurrentArticle) {
        e.preventDefault();
        Store.updateSession({ playerMinimized: false });
      } else {
        // Let it act as a link (href is updated in syncUI)
      }
    });
  }

  function syncUI(state) {
    if (!rootElement) return;

    const container = rootElement.querySelector('.tts-floating-player');
    if (!container) return;

    isCurrentArticle = state.articleId === window.location.pathname;

    // Visibility logic
    const hasActiveSession = state.articleId !== null && state.totalSentences > 0;
    
    // Show if we have a session AND (we are on a different page OR the player is minimized)
    if (hasActiveSession && (!isCurrentArticle || state.playerMinimized)) {
      container.classList.add('visible');
    } else {
      container.classList.remove('visible');
      return; // No need to update UI if hidden
    }

    document.getElementById('tts-floating-title').textContent = state.articleTitle || "Article";

    const playBtn = document.getElementById('tts-floating-play');
    const playIcon = playBtn.querySelector('i');
    const prevBtn = document.getElementById('tts-floating-prev');
    const nextBtn = document.getElementById('tts-floating-next');
    const expandBtn = document.getElementById('tts-floating-expand');
    const progressFill = document.getElementById('tts-floating-progress-fill');
    const progressBar = document.getElementById('tts-floating-progress-bar');

    // Controls enabled only if on the active article page
    playBtn.disabled = !isCurrentArticle;
    prevBtn.disabled = !isCurrentArticle;
    nextBtn.disabled = !isCurrentArticle;

    if (state.engineState === Store.STATES.PLAYING) {
      playIcon.className = 'fas fa-pause';
    } else {
      playIcon.className = 'fas fa-play';
    }

    if (isCurrentArticle) {
      expandBtn.innerHTML = '<i class="fas fa-expand-arrows-alt" aria-hidden="true"></i> Expand';
      expandBtn.href = "#";
    } else {
      expandBtn.innerHTML = '<i class="fas fa-external-link-alt" aria-hidden="true"></i> Return';
      expandBtn.href = state.articleUrl || "#";
    }

    let progressPct = 0;
    if (state.totalSentences > 0) {
      progressPct = (state.sentenceIndex / state.totalSentences) * 100;
      progressBar.setAttribute('aria-valuenow', Math.round(progressPct));
    }
    progressFill.style.width = `${progressPct}%`;
  }

  return {
    mount(elementId) {
      rootElement = document.getElementById(elementId);
      if (!rootElement) return;

      rootElement.innerHTML = renderHTML();
      attachEvents();
      
      unsubscribe = Store.subscribe(syncUI);
    },
    
    unmount() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      if (rootElement) {
        rootElement.innerHTML = '';
        rootElement = null;
      }
    }
  };
})();

window.TTSFloatingPlayer = TTSFloatingPlayer;
