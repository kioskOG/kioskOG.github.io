/**
 * TTS Article Player UI
 * Controls the main player embedded in the article page.
 */
const TTSArticlePlayer = (function () {
  
  const Store = window.TTSStore;
  const Engine = window.TTSSpeechEngine;

  let rootElement = null;
  let unsubscribe = null;
  let isCurrentArticle = false;

  function renderHTML() {
    return `
      <div class="tts-main-player" role="region" aria-label="Listen to Article Player">
        <div class="tts-main-header">
          <div class="tts-main-title">
            <i class="fas fa-headphones" aria-hidden="true"></i> Listen to Article
            <span id="tts-main-time" style="font-size: 0.75rem; font-weight: 400; color: var(--text-muted); margin-left: 8px;"></span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="tts-btn" id="tts-main-bookmark" aria-label="Bookmark Current Sentence" disabled>
              <i class="far fa-bookmark" aria-hidden="true"></i>
            </button>
            <button class="tts-btn" id="tts-main-minimize" aria-label="Minimize Player">
              <i class="fas fa-compress-alt" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        
        <div class="tts-controls-row">
          <button class="tts-btn primary" id="tts-main-play" aria-label="Play or Pause">
            <i class="fas fa-play" aria-hidden="true"></i> <span>Play</span>
          </button>
          
          <button class="tts-btn" id="tts-main-prev" aria-label="Previous Sentence" disabled>
            <i class="fas fa-step-backward" aria-hidden="true"></i>
          </button>
          
          <button class="tts-btn" id="tts-main-next" aria-label="Next Sentence" disabled>
            <i class="fas fa-step-forward" aria-hidden="true"></i>
          </button>
          
          <button class="tts-btn" id="tts-main-stop" aria-label="Stop" disabled>
            <i class="fas fa-stop" aria-hidden="true"></i>
          </button>
          
          <button class="tts-btn" id="tts-main-restart" aria-label="Restart" disabled>
            <i class="fas fa-undo-alt" aria-hidden="true"></i>
          </button>
        </div>

        <div class="tts-progress-container">
          <div class="tts-progress-bar" id="tts-main-progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" tabindex="0" aria-label="Playback Progress">
            <div class="tts-progress-fill" id="tts-main-progress-fill"></div>
          </div>
          <div class="tts-progress-text" id="tts-main-progress-text">0 / 0</div>
        </div>

        <div class="tts-settings-row">
          <select class="tts-select" id="tts-main-voice" aria-label="Select Voice">
            <option value="">Default System Voice</option>
          </select>
          
          <select class="tts-select" id="tts-main-rate" aria-label="Playback Speed">
            <option value="0.75">0.75x</option>
            <option value="1.0" selected>1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2.0">2x</option>
          </select>

          <label style="display:flex; align-items:center; gap: 6px; font-size: 0.8rem; color: var(--text-muted); cursor: pointer;">
            <input type="checkbox" id="tts-main-autoscroll" checked aria-label="Toggle Follow Narration">
            Follow Narration
          </label>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const playBtn = document.getElementById('tts-main-play');
    const prevBtn = document.getElementById('tts-main-prev');
    const nextBtn = document.getElementById('tts-main-next');
    const stopBtn = document.getElementById('tts-main-stop');
    const restartBtn = document.getElementById('tts-main-restart');
    const minBtn = document.getElementById('tts-main-minimize');
    const bookmarkBtn = document.getElementById('tts-main-bookmark');
    
    const voiceSelect = document.getElementById('tts-main-voice');
    const rateSelect = document.getElementById('tts-main-rate');
    const autoscrollCheck = document.getElementById('tts-main-autoscroll');
    const progressBar = document.getElementById('tts-main-progress-bar');

    playBtn.addEventListener('click', () => {
      const state = Store.getState();
      if (!isCurrentArticle && state.articleId !== window.location.pathname) {
        // Start new article
        window.dispatchEvent(new CustomEvent('tts-request-start-article'));
      } else {
        if (state.engineState === Store.STATES.PLAYING) Engine.pause();
        else if (state.engineState === Store.STATES.PAUSED) Engine.resume();
        else Engine.play(state.sentenceIndex);
      }
    });

    prevBtn.addEventListener('click', () => Engine.prev());
    nextBtn.addEventListener('click', () => Engine.next());
    stopBtn.addEventListener('click', () => Engine.stop());
    restartBtn.addEventListener('click', () => {
      Store.updateSession({ sentenceIndex: 0 });
      Engine.play(0);
    });

    minBtn.addEventListener('click', () => {
      Store.updateSession({ playerMinimized: true });
    });

    bookmarkBtn.addEventListener('click', () => {
      const state = Store.getState();
      if (!isCurrentArticle || state.engineState === Store.STATES.IDLE) return;
      
      const BookmarkStore = window.TTSBookmarkStore;
      if (BookmarkStore && window.TTSSpeechEngine) {
        // Find the current sentence in the queue (Engine manages queue, but let's assume index is valid)
        // Since we don't have direct access to currentRuntimeModel here easily without Engine exporting it,
        // wait, we can dispatch an event or the store can hold the sentence text.
        // Actually, we can dispatch an event to index.js to handle bookmarking, OR
        // we can export `getQueue()` from `speech-engine.js`. Let's assume we can dispatch an event.
        window.dispatchEvent(new CustomEvent('tts-request-bookmark'));
      }
    });

    voiceSelect.addEventListener('change', (e) => {
      Engine.setVoice(e.target.value);
    });

    rateSelect.addEventListener('change', (e) => {
      Engine.setRate(parseFloat(e.target.value));
    });

    autoscrollCheck.addEventListener('change', (e) => {
      Store.updatePrefs({ autoScroll: e.target.checked });
    });

    // Progress bar seeking
    progressBar.addEventListener('click', (e) => {
      const state = Store.getState();
      if (!isCurrentArticle || state.totalSentences === 0) return;
      
      const rect = progressBar.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const targetIndex = Math.floor(percentage * state.totalSentences);
      
      Engine.seek(targetIndex);
    });

    // Keyboard support for progress bar
    progressBar.addEventListener('keydown', (e) => {
      const state = Store.getState();
      if (!isCurrentArticle || state.totalSentences === 0) return;
      if (e.key === 'ArrowRight') Engine.seek(Math.min(state.sentenceIndex + 1, state.totalSentences - 1));
      if (e.key === 'ArrowLeft') Engine.seek(Math.max(state.sentenceIndex - 1, 0));
    });

    window.addEventListener('tts-voices-loaded', (e) => {
      updateVoiceOptions(e.detail);
    });
  }

  function updateVoiceOptions(voices) {
    const voiceSelect = document.getElementById('tts-main-voice');
    if (!voiceSelect) return;
    
    const state = Store.getState();
    voiceSelect.innerHTML = '<option value="">Default System Voice</option>';
    
    voices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI;
      opt.textContent = v.name + (v.lang ? ` (${v.lang})` : '');
      if (v.voiceURI === state.voiceURI) opt.selected = true;
      voiceSelect.appendChild(opt);
    });
  }

  function syncUI(state) {
    if (!rootElement) return;

    // Is this player representing the current article?
    isCurrentArticle = state.articleId === window.location.pathname;

    const container = rootElement.querySelector('.tts-main-player');
    if (!container) return;

    // Visibility
    if (state.playerMinimized) {
      container.style.display = 'none';
      return;
    } else {
      container.style.display = 'flex';
    }

    const playBtn = document.getElementById('tts-main-play');
    const playIcon = playBtn.querySelector('i');
    const playText = playBtn.querySelector('span');
    const prevBtn = document.getElementById('tts-main-prev');
    const nextBtn = document.getElementById('tts-main-next');
    const stopBtn = document.getElementById('tts-main-stop');
    const restartBtn = document.getElementById('tts-main-restart');
    const progressFill = document.getElementById('tts-main-progress-fill');
    const progressText = document.getElementById('tts-main-progress-text');
    const progressBar = document.getElementById('tts-main-progress-bar');
    const timeLabel = document.getElementById('tts-main-time');
    const bookmarkBtn = document.getElementById('tts-main-bookmark');
    
    document.getElementById('tts-main-rate').value = state.rate.toString();
    document.getElementById('tts-main-autoscroll').checked = state.autoScroll;

    // Engine state
    if (state.engineState === Store.STATES.PLAYING) {
      playIcon.className = 'fas fa-pause';
      playText.textContent = 'Pause';
    } else {
      playIcon.className = 'fas fa-play';
      playText.textContent = isCurrentArticle && state.sentenceIndex > 0 && state.engineState !== Store.STATES.COMPLETED ? 'Resume' : 'Play';
    }

    // Enable/disable based on active session
    const isActiveSession = isCurrentArticle && state.engineState !== Store.STATES.IDLE;
    prevBtn.disabled = !isActiveSession;
    nextBtn.disabled = !isActiveSession;
    stopBtn.disabled = !isActiveSession;
    restartBtn.disabled = !isActiveSession;
    bookmarkBtn.disabled = !isActiveSession;

    // Bookmarks and Time require index.js to update them because they need access to the queue
    // We will emit an event so index.js can update the UI
    if (isActiveSession) {
      window.dispatchEvent(new CustomEvent('tts-sync-extended-ui'));
    }

    // Progress
    let progressPct = 0;
    if (isCurrentArticle && state.totalSentences > 0) {
      progressPct = (state.sentenceIndex / state.totalSentences) * 100;
      progressText.textContent = `${state.sentenceIndex} / ${state.totalSentences}`;
      progressBar.setAttribute('aria-valuenow', Math.round(progressPct));
    } else {
      progressText.textContent = `0 / 0`;
      progressBar.setAttribute('aria-valuenow', 0);
    }
    progressFill.style.width = `${progressPct}%`;
  }

  return {
    mount(elementId) {
      rootElement = document.getElementById(elementId);
      if (!rootElement) return;

      rootElement.innerHTML = renderHTML();
      attachEvents();
      
      updateVoiceOptions(Engine.getVoices());
      
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

window.TTSArticlePlayer = TTSArticlePlayer;
