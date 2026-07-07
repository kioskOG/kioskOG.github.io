/**
 * TTS Listening Time Utility
 * Estimates remaining playback time based on speechText word count and playback rate.
 */
const TTSListeningTime = (function () {

  // Baseline words per minute at 1.0x speed
  const BASE_WPM = 150;

  function countWords(str) {
    if (!str) return 0;
    // Basic word count split by whitespace
    const words = str.trim().split(/\s+/);
    return words.length;
  }

  return {
    /**
     * Calculates the estimated remaining minutes.
     * @param {Array} queue - The full sentence queue
     * @param {number} currentIndex - The current sentence index being spoken
     * @param {number} rate - The playback rate (e.g., 1.0, 1.5)
     * @returns {number} The estimated remaining minutes (rounded to nearest integer)
     */
    getEstimatedMinutes(queue, currentIndex, rate) {
      if (!queue || queue.length === 0 || currentIndex >= queue.length) return 0;

      let remainingWords = 0;
      // Calculate remaining words from current index forward
      for (let i = currentIndex; i < queue.length; i++) {
        // Use speechText as it represents what the engine actually says
        const text = queue[i].speechText || queue[i].displayText || "";
        remainingWords += countWords(text);
      }

      if (remainingWords === 0) return 0;

      const effectiveWPM = BASE_WPM * (rate || 1.0);
      const remainingMinutes = remainingWords / effectiveWPM;

      return Math.max(0, remainingMinutes);
    },

    /**
     * Formats the estimated minutes into a readable string.
     */
    formatEstimate(minutes) {
      if (minutes < 1) {
        return "Less than 1 min remaining";
      }
      return `About ${Math.round(minutes)} min remaining`;
    }
  };
})();

window.TTSListeningTime = TTSListeningTime;
