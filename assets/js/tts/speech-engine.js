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
   * Scores voices based on human-likeness and acoustic quality.
   * Higher score = better, more natural sounding voice.
   */
  function scoreVoice(voice) {
    if (!voice || !voice.lang) return -999;
    
    // Only English voices for blog articles
    if (!voice.lang.startsWith('en')) return -999;

    const name = voice.name || '';
    const nameLower = name.toLowerCase();

    // Filter out robotic novelty & low-quality voices
    const DISQUALIFIED = [
      'compact', 'espeak', 'klatt', 'whisper', 'zarvox', 'trinoids',
      'pipe organ', 'cellos', 'bad news', 'good news', 'bells', 'boing',
      'bahh', 'bubbles', 'deranged', 'hysterical', 'albert', 'fred',
      'junior', 'ralph', 'kathy', 'vicki', 'bruce', 'agnes'
    ];
    if (DISQUALIFIED.some(d => nameLower.includes(d))) return -500;

    let score = 100;

    // Tier 1: Microsoft Natural Online Neural (Edge / Windows 10+)
    if (nameLower.includes('natural') || nameLower.includes('online')) {
      score += 850;
      if (nameLower.includes('jenny') || nameLower.includes('ava') || nameLower.includes('guy') || 
          nameLower.includes('aria') || nameLower.includes('christopher') || nameLower.includes('emma') ||
          nameLower.includes('andrew') || nameLower.includes('brian')) {
        score += 150;
      }
    }

    // Tier 1b: Google WaveNet / Neural (Chrome)
    if (nameLower.includes('google')) {
      score += 750;
      if (nameLower.includes('us english') || nameLower.includes('uk english female') || nameLower.includes('uk english male')) {
        score += 120;
      }
    }

    // Tier 1c: Apple Premium & Enhanced Neural (macOS / iOS / Safari)
    if (nameLower.includes('premium')) {
      score += 700;
      if (nameLower.includes('ava') || nameLower.includes('samantha') || nameLower.includes('zoe') || nameLower.includes('tom')) {
        score += 100;
      }
    } else if (nameLower.includes('enhanced')) {
      score += 600;
      if (nameLower.includes('samantha') || nameLower.includes('evan') || nameLower.includes('nathan') || 
          nameLower.includes('serena') || nameLower.includes('allison') || nameLower.includes('tom') ||
          nameLower.includes('oliver') || nameLower.includes('kate')) {
        score += 80;
      }
    } else if (nameLower.includes('siri')) {
      score += 650;
    }

    // High quality standard voice names
    if (nameLower.includes('ava')) score += 60;
    if (nameLower.includes('samantha')) score += 40;
    if (nameLower.includes('serena')) score += 40;
    if (nameLower.includes('daniel')) score += 30;
    if (nameLower.includes('karen')) score += 30;
    if (nameLower.includes('moira')) score += 30;
    if (nameLower.includes('oliver')) score += 30;
    if (nameLower.includes('victoria')) score += 25;

    // Prefer en-US and en-GB accents
    if (voice.lang === 'en-US') score += 25;
    if (voice.lang === 'en-GB') score += 20;

    if (voice.default) score += 5;

    return score;
  }

  /**
   * Generates a clean, user-friendly label for voice dropdowns.
   */
  function formatVoiceLabel(voice) {
    const raw = voice.name || 'Voice';
    let clean = raw;

    // Clean up Microsoft Edge voice names
    clean = clean.replace(/Microsoft\s+/i, '');
    clean = clean.replace(/Online\s*\(Natural\)\s*-\s*English\s*\([^)]+\)/gi, '(Natural)');
    clean = clean.replace(/\s*-\s*English\s*\([^)]+\)/gi, '');

    // Highlight premium / enhanced / natural
    if (/natural/i.test(raw)) {
      clean = clean.replace(/\(Natural\)/gi, '').trim() + ' · Natural ✨';
    } else if (/premium/i.test(raw)) {
      clean = clean.replace(/\(Premium\)/gi, '').trim() + ' · Premium HD ✨';
    } else if (/enhanced/i.test(raw)) {
      clean = clean.replace(/\(Enhanced\)/gi, '').trim() + ' · Enhanced HD 🎧';
    } else if (/google/i.test(raw)) {
      clean = clean + ' · Neural 🌟';
    }

    return clean.trim();
  }

  /**
   * Returns curated English voices sorted by quality score.
   */
  function getCuratedVoices() {
    const valid = availableVoices
      .filter(v => v.lang && v.lang.startsWith('en'))
      .map(v => ({
        voice: v,
        score: scoreVoice(v),
        label: formatVoiceLabel(v)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return valid;
  }

  /**
   * Pick the single highest quality voice available.
   */
  function pickBestVoice(voices) {
    const curated = getCuratedVoices();
    if (curated.length > 0) {
      return curated[0].voice;
    }

    // Fallback: any en-US, en-GB, en-*, or first
    const english = (voices || availableVoices).filter(v => v.lang && v.lang.startsWith('en'));
    return english.find(v => v.lang === 'en-US') ||
           english.find(v => v.lang === 'en-GB') ||
           english[0] ||
           (voices || availableVoices)[0] ||
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
