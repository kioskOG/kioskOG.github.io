/**
 * TTS Speech Engine
 * Pure logic for Web Speech API integration, generation IDs, and queue management.
 * Provides multi-tier neural voice ranking, smart voice curation, and natural speech pacing.
 */
const TTSSpeechEngine = (function () {
  
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn("TTS: Web Speech API not supported.");
    return {
      init: () => {},
      play: () => {},
      pause: () => {},
      resume: () => {},
      stop: () => {},
      next: () => {},
      prev: () => {},
      setQueue: () => {},
      setRate: () => {},
      setPitch: () => {},
      setVoice: () => {},
      getVoices: () => [],
      getCuratedVoices: () => [],
      getBestVoice: () => null,
      destroy: () => {}
    };
  }

  const synth = window.speechSynthesis;
  let queue = [];
  let availableVoices = [];
  let activeGenerationId = 0;
  let currentUtterance = null;
  let intentionalCancel = false;

  const Store = window.TTSStore;

  /**
   * Strict allowlist of 4 curated voices.
   * Only these voices are offered to the user. Order = priority.
   */
  const ALLOWED_VOICES = [
    { match: 'Google UK English Female', label: 'Google UK English Female · Neural 🌟' },
    { match: 'Google UK English Male',   label: 'Google UK English Male · Neural 🌟' },
    { match: 'Google US English',        label: 'Google US English · Neural 🌟' },
    { match: 'Samantha',                 label: 'Samantha' }
  ];

  /**
   * Check if a voice exactly matches one of our allowed names.
   */
  function findAllowedEntry(voice) {
    if (!voice || !voice.name) return null;
    return ALLOWED_VOICES.find(a => voice.name === a.match);
  }

  /**
   * Returns only the allowed voices that exist on this browser/OS.
   */
  function getCuratedVoices() {
    const result = [];
    for (const allowed of ALLOWED_VOICES) {
      const voice = availableVoices.find(v => v.name === allowed.match);
      if (voice) {
        result.push({ voice, label: allowed.label, score: ALLOWED_VOICES.length - result.length });
      }
    }
    return result;
  }

  /**
   * Pick the best voice: first available from the allowlist.
   */
  function pickBestVoice(voices) {
    const curated = getCuratedVoices();
    if (curated.length > 0) return curated[0].voice;

    // Ultimate fallback: if none of the 4 are available, pick any English voice
    const all = voices || availableVoices;
    const english = all.filter(v => v.lang && v.lang.startsWith('en'));
    return english.find(v => v.lang === 'en-US') ||
           english.find(v => v.lang === 'en-GB') ||
           english[0] ||
           all[0] ||
           null;
  }

  function loadVoices() {
    availableVoices = synth.getVoices();
    if (availableVoices.length === 0) return;

    const state = Store ? Store.getState() : { voiceURI: null };

    if (state && state.voiceURI) {
      const match = availableVoices.find(v => v.voiceURI === state.voiceURI);
      if (!match) {
        const best = pickBestVoice(availableVoices);
        if (best && Store) Store.updatePrefs({ voiceURI: best.voiceURI });
      }
    } else {
      const best = pickBestVoice(availableVoices);
      if (best && Store) Store.updatePrefs({ voiceURI: best.voiceURI });
    }
  }

  function handleVoicesChanged() {
    loadVoices();
    window.dispatchEvent(new CustomEvent('tts-voices-loaded', { detail: availableVoices }));
  }

  synth.addEventListener('voiceschanged', handleVoicesChanged);
  // Initial synchronous attempt
  loadVoices();

  function incrementGeneration() {
    activeGenerationId++;
  }

  /**
   * Natural pause duration (ms) between thoughts based on semantic block type.
   */
  function getPauseAfter(sentenceObj) {
    if (!sentenceObj) return 0;
    const tag = (sentenceObj.blockType || '').toLowerCase();
    if (/^h[1-3]$/.test(tag)) return 450; // Heading: pause to let topic sink in
    if (/^h[4-6]$/.test(tag)) return 300;
    if (tag === 'li') return 180;         // List item pause
    if (tag === 'blockquote') return 250;
    return 120;                          // Standard paragraph sentence pause
  }

  function speakCurrentIndex() {
    const state = Store ? Store.getState() : {};
    if (!state.sentenceIndex && state.sentenceIndex !== 0) return;

    if (state.sentenceIndex >= queue.length || state.sentenceIndex < 0) {
      if (Store) Store.setEngineState(Store.STATES.COMPLETED);
      return;
    }

    const sentenceObj = queue[state.sentenceIndex];
    if (!sentenceObj || !sentenceObj.speechText) {
      if (Store) Store.updateSession({ sentenceIndex: state.sentenceIndex + 1 });
      speakCurrentIndex();
      return;
    }

    intentionalCancel = true;
    synth.cancel();
    intentionalCancel = false;

    incrementGeneration();
    const generationId = activeGenerationId;

    const utterance = new SpeechSynthesisUtterance(sentenceObj.speechText);

    // ── Apply Voice ────────────────────────────────────────────────────
    let chosenVoice = null;
    if (state.voiceURI) {
      chosenVoice = availableVoices.find(v => v.voiceURI === state.voiceURI);
    }
    if (!chosenVoice) {
      chosenVoice = pickBestVoice(availableVoices);
    }
    if (chosenVoice) utterance.voice = chosenVoice;

    // ── Human-Calibrated Prosody ───────────────────────────────────────
    // Rate: 0.94 is calm, natural, and avoids the robotic rush of default 1.0
    utterance.rate   = state.rate || 0.94;
    // Pitch: 1.0 neutral
    utterance.pitch  = state.pitch || 1.0;
    // Volume: full clarity
    utterance.volume = 1.0;

    utterance.onstart = () => {
      if (generationId !== activeGenerationId) return;
      if (Store) Store.setEngineState(Store.STATES.PLAYING);
    };

    utterance.onend = () => {
      if (generationId !== activeGenerationId) return;

      const pause = getPauseAfter(sentenceObj);
      if (pause > 0) {
        setTimeout(() => {
          if (generationId !== activeGenerationId) return;
          if (Store) Store.updateSession({ sentenceIndex: state.sentenceIndex + 1 });
          speakCurrentIndex();
        }, pause);
      } else {
        if (Store) Store.updateSession({ sentenceIndex: state.sentenceIndex + 1 });
        speakCurrentIndex();
      }
    };

    utterance.onerror = (e) => {
      if (generationId !== activeGenerationId) return;
      if (e.error === 'interrupted' || e.error === 'canceled' || intentionalCancel) {
        return;
      }
      console.error("TTS Speech Error:", e);
      if (Store) Store.setEngineState(Store.STATES.ERROR);
    };

    currentUtterance = utterance;
    synth.speak(utterance);
  }

  return {
    init() {
      loadVoices();
    },

    getVoices() {
      return availableVoices;
    },

    getCuratedVoices() {
      return getCuratedVoices();
    },

    getBestVoice() {
      return pickBestVoice(availableVoices);
    },

    setQueue(newQueue) {
      queue = newQueue || [];
      incrementGeneration();
    },

    play(startIndex) {
      if (startIndex !== undefined && Store) {
        Store.updateSession({ sentenceIndex: startIndex });
      }
      incrementGeneration();
      if (Store) Store.setEngineState(Store.STATES.READY);
      speakCurrentIndex();
    },

    pause() {
      if (synth.speaking) {
        synth.pause();
        if (Store) Store.setEngineState(Store.STATES.PAUSED);
      }
    },

    resume() {
      if (synth.paused) {
        synth.resume();
        if (Store) Store.setEngineState(Store.STATES.PLAYING);
      } else if (Store && Store.getState().engineState !== Store.STATES.PLAYING) {
        this.play(Store.getState().sentenceIndex);
      }
    },

    stop() {
      incrementGeneration();
      intentionalCancel = true;
      synth.cancel();
      intentionalCancel = false;
      currentUtterance = null;
      if (Store) Store.setEngineState(Store.STATES.IDLE);
    },

    next() {
      const state = Store ? Store.getState() : {};
      if (state.sentenceIndex < queue.length - 1) {
        this.play(state.sentenceIndex + 1);
      } else {
        this.stop();
      }
    },

    prev() {
      const state = Store ? Store.getState() : {};
      if (state.sentenceIndex > 0) {
        this.play(state.sentenceIndex - 1);
      } else {
        this.play(0);
      }
    },

    seek(index) {
      if (index >= 0 && index < queue.length) {
        const wasPlaying = Store && (Store.getState().engineState === Store.STATES.PLAYING);
        if (Store) Store.updateSession({ sentenceIndex: index });
        if (wasPlaying) {
          this.play(index);
        } else {
          incrementGeneration();
          intentionalCancel = true;
          synth.cancel();
          intentionalCancel = false;
        }
      }
    },

    setRate(rate) {
      if (Store) Store.updatePrefs({ rate });
      if (Store && Store.getState().engineState === Store.STATES.PLAYING) {
        this.play(Store.getState().sentenceIndex);
      }
    },

    setPitch(pitch) {
      if (Store) Store.updatePrefs({ pitch });
      if (Store && Store.getState().engineState === Store.STATES.PLAYING) {
        this.play(Store.getState().sentenceIndex);
      }
    },

    setVoice(voiceURI) {
      if (Store) Store.updatePrefs({ voiceURI });
      if (Store && Store.getState().engineState === Store.STATES.PLAYING) {
        this.play(Store.getState().sentenceIndex);
      }
    },

    destroy() {
      synth.removeEventListener('voiceschanged', handleVoicesChanged);
      incrementGeneration();
      intentionalCancel = true;
      synth.cancel();
    }
  };
})();

window.TTSSpeechEngine = TTSSpeechEngine;
