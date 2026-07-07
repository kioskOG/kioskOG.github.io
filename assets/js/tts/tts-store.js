/**
 * TTS Store - Manages state, pub/sub events, and versioned localStorage
 */
const TTSStore = (function () {
  const SESSION_KEY = 'tts-player-session:v1';
  const PREFS_KEY = 'tts-player-preferences:v1';

  // State Machine States
  const ENGINE_STATES = {
    IDLE: 'idle',
    READY: 'ready',
    PLAYING: 'playing',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    ERROR: 'error'
  };

  // Internal state
  let state = {
    // Engine state
    engineState: ENGINE_STATES.IDLE,
    
    // Session state
    articleId: null,
    articleUrl: null,
    articleTitle: null,
    sentenceIndex: 0,
    totalSentences: 0,
    queueFingerprint: null,
    playerMinimized: false,
    
    // Preferences
    voiceURI: null,
    rate: 1.0,
    autoScroll: true
  };

  const listeners = new Set();

  function loadPersistedState() {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        state.articleId = parsedSession.articleId || null;
        state.articleUrl = parsedSession.articleUrl || null;
        state.articleTitle = parsedSession.articleTitle || null;
        state.sentenceIndex = typeof parsedSession.sentenceIndex === 'number' ? parsedSession.sentenceIndex : 0;
        state.totalSentences = typeof parsedSession.totalSentences === 'number' ? parsedSession.totalSentences : 0;
        state.queueFingerprint = parsedSession.queueFingerprint || null;
        state.playerMinimized = !!parsedSession.playerMinimized;
      }

      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) {
        const parsedPrefs = JSON.parse(savedPrefs);
        state.voiceURI = parsedPrefs.voiceURI || null;
        state.rate = typeof parsedPrefs.rate === 'number' ? parsedPrefs.rate : 1.0;
        state.autoScroll = parsedPrefs.autoScroll !== undefined ? !!parsedPrefs.autoScroll : true;
      }
    } catch (e) {
      console.warn("TTSStore: Failed to load persisted state", e);
    }
  }

  function persistSession() {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        articleId: state.articleId,
        articleUrl: state.articleUrl,
        articleTitle: state.articleTitle,
        sentenceIndex: state.sentenceIndex,
        totalSentences: state.totalSentences,
        queueFingerprint: state.queueFingerprint,
        playerMinimized: state.playerMinimized
      }));
    } catch (e) {
      console.warn("TTSStore: Failed to persist session", e);
    }
  }

  function persistPrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({
        voiceURI: state.voiceURI,
        rate: state.rate,
        autoScroll: state.autoScroll
      }));
    } catch (e) {
      console.warn("TTSStore: Failed to persist preferences", e);
    }
  }

  function notify() {
    listeners.forEach(fn => fn(state));
  }

  // Initialization
  loadPersistedState();

  return {
    STATES: ENGINE_STATES,

    getState() {
      return { ...state };
    },

    subscribe(callback) {
      listeners.add(callback);
      callback(state); // immediate sync
      return () => listeners.delete(callback);
    },

    setEngineState(newState) {
      if (Object.values(ENGINE_STATES).includes(newState)) {
        state.engineState = newState;
        notify();
      }
    },

    updateSession(updates) {
      let changed = false;
      for (const [key, value] of Object.entries(updates)) {
        if (state[key] !== value) {
          state[key] = value;
          changed = true;
        }
      }
      if (changed) {
        persistSession();
        notify();
      }
    },
    
    updatePrefs(updates) {
      let changed = false;
      for (const [key, value] of Object.entries(updates)) {
        if (state[key] !== value) {
          state[key] = value;
          changed = true;
        }
      }
      if (changed) {
        persistPrefs();
        notify();
      }
    },

    clearSession() {
      state.articleId = null;
      state.articleUrl = null;
      state.articleTitle = null;
      state.sentenceIndex = 0;
      state.totalSentences = 0;
      state.queueFingerprint = null;
      state.engineState = ENGINE_STATES.IDLE;
      localStorage.removeItem(SESSION_KEY);
      notify();
    }
  };
})();

// Export globally for our modular vanilla approach
window.TTSStore = TTSStore;
