/**
 * TTS Speech Engine
 * Pure logic for Web Speech API integration, generation IDs, and queue management.
 * DOM-unaware.
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
      setVoice: () => {},
      getVoices: () => [],
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

  function loadVoices() {
    availableVoices = synth.getVoices();
    // Validate stored voice
    const state = Store.getState();
    if (state.voiceURI && availableVoices.length > 0) {
      const match = availableVoices.find(v => v.voiceURI === state.voiceURI);
      if (!match) {
        Store.updatePrefs({ voiceURI: null });
      }
    }
  }

  function handleVoicesChanged() {
    loadVoices();
    // Re-dispatch a lightweight event or rely on store if we want UI to know
    window.dispatchEvent(new CustomEvent('tts-voices-loaded', { detail: availableVoices }));
  }

  synth.addEventListener('voiceschanged', handleVoicesChanged);

  function incrementGeneration() {
    activeGenerationId++;
  }

  function speakCurrentIndex() {
    const state = Store.getState();
    if (state.sentenceIndex >= queue.length || state.sentenceIndex < 0) {
      Store.setEngineState(Store.STATES.COMPLETED);
      return;
    }

    const sentenceObj = queue[state.sentenceIndex];
    if (!sentenceObj || !sentenceObj.speechText) {
      // Skip empty or invalid
      Store.updateSession({ sentenceIndex: state.sentenceIndex + 1 });
      speakCurrentIndex();
      return;
    }

    intentionalCancel = true;
    synth.cancel();
    intentionalCancel = false;
    
    incrementGeneration();
    const generationId = activeGenerationId;

    const utterance = new SpeechSynthesisUtterance(sentenceObj.speechText);
    
    // Apply voice and rate
    if (state.voiceURI) {
      const voice = availableVoices.find(v => v.voiceURI === state.voiceURI);
      if (voice) utterance.voice = voice;
    }
    utterance.rate = state.rate || 1.0;

    utterance.onstart = () => {
      if (generationId !== activeGenerationId) return;
      Store.setEngineState(Store.STATES.PLAYING);
    };

    utterance.onend = () => {
      if (generationId !== activeGenerationId) return;
      // Normal completion of this sentence
      Store.updateSession({ sentenceIndex: state.sentenceIndex + 1 });
      speakCurrentIndex();
    };

    utterance.onerror = (e) => {
      if (generationId !== activeGenerationId) return;
      if (e.error === 'interrupted' || e.error === 'canceled' || intentionalCancel) {
        // Not a real error, just intentional cancellation
        return;
      }
      console.error("TTS Speech Error:", e);
      Store.setEngineState(Store.STATES.ERROR);
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

    setQueue(newQueue) {
      queue = newQueue || [];
      incrementGeneration();
    },

    play(startIndex) {
      if (startIndex !== undefined) {
        Store.updateSession({ sentenceIndex: startIndex });
      }
      incrementGeneration();
      Store.setEngineState(Store.STATES.READY);
      speakCurrentIndex();
    },

    pause() {
      // Does not invalidate generation
      if (synth.speaking) {
        synth.pause();
        Store.setEngineState(Store.STATES.PAUSED);
      }
    },

    resume() {
      // Does not invalidate generation
      if (synth.paused) {
        synth.resume();
        Store.setEngineState(Store.STATES.PLAYING);
      } else if (Store.getState().engineState !== Store.STATES.PLAYING) {
        // If not actually paused but state says we were paused (browser bug fallback)
        this.play(Store.getState().sentenceIndex);
      }
    },

    stop() {
      incrementGeneration();
      intentionalCancel = true;
      synth.cancel();
      intentionalCancel = false;
      currentUtterance = null;
      Store.setEngineState(Store.STATES.IDLE);
    },

    next() {
      const state = Store.getState();
      if (state.sentenceIndex < queue.length - 1) {
        this.play(state.sentenceIndex + 1);
      } else {
        this.stop();
      }
    },

    prev() {
      const state = Store.getState();
      if (state.sentenceIndex > 0) {
        this.play(state.sentenceIndex - 1);
      } else {
        this.play(0);
      }
    },
    
    seek(index) {
      if (index >= 0 && index < queue.length) {
        const wasPlaying = (Store.getState().engineState === Store.STATES.PLAYING);
        Store.updateSession({ sentenceIndex: index });
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
      Store.updatePrefs({ rate });
      if (Store.getState().engineState === Store.STATES.PLAYING) {
        // Changing rate requires utterance recreation for Web Speech API reliability
        this.play(Store.getState().sentenceIndex);
      }
    },

    setVoice(voiceURI) {
      Store.updatePrefs({ voiceURI });
      if (Store.getState().engineState === Store.STATES.PLAYING) {
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
