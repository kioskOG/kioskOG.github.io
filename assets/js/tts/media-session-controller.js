/**
 * TTS Media Session Controller
 * Integrates Web Speech API playback state with the navigator.mediaSession API
 * to support lock-screen and hardware media controls.
 */
const TTSMediaSessionController = (function () {

  const Store = window.TTSStore;
  const Engine = window.TTSSpeechEngine;
  let unsubscribe = null;

  function handleStateChange(state) {
    if (!('mediaSession' in navigator)) return;

    // Sync playback state
    if (state.engineState === Store.STATES.PLAYING) {
      navigator.mediaSession.playbackState = 'playing';
    } else if (state.engineState === Store.STATES.PAUSED) {
      navigator.mediaSession.playbackState = 'paused';
    } else {
      navigator.mediaSession.playbackState = 'none';
    }
  }

  function setupActionHandlers() {
    if (!('mediaSession' in navigator)) return;

    const actions = [
      { action: 'play', handler: () => {
          const state = Store.getState();
          if (state.engineState === Store.STATES.PAUSED) {
            Engine.resume();
          } else {
            Engine.play(state.sentenceIndex);
          }
        }
      },
      { action: 'pause', handler: () => Engine.pause() },
      { action: 'stop', handler: () => Engine.stop() },
      { action: 'previoustrack', handler: () => Engine.prev() },
      { action: 'nexttrack', handler: () => Engine.next() }
    ];

    for (const { action, handler } of actions) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.warn(`TTS: MediaSession action '${action}' is not supported.`);
      }
    }
  }

  return {
    init() {
      if (!('mediaSession' in navigator)) return;
      setupActionHandlers();
      unsubscribe = Store.subscribe(handleStateChange);
    },

    setMetadata(title, siteName) {
      if (!('mediaSession' in navigator)) return;

      // Extract a potential OG image from the page if available
      let artworkUrl = '';
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && ogImage.content) {
        artworkUrl = ogImage.content;
      }

      const metadataConfig = {
        title: title || 'Article',
        artist: siteName || window.location.hostname,
        album: 'Listen to Article'
      };

      if (artworkUrl) {
        metadataConfig.artwork = [
          { src: artworkUrl, sizes: '512x512', type: 'image/png' } // Fallback generic size
        ];
      }

      navigator.mediaSession.metadata = new MediaMetadata(metadataConfig);
    },
    
    destroy() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
        navigator.mediaSession.metadata = null;
      }
    }
  };
})();

window.TTSMediaSessionController = TTSMediaSessionController;
