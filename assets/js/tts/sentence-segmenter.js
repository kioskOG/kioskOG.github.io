/**
 * TTS Sentence Segmenter
 * Uses Intl.Segmenter to segment block text into sentences.
 * Provides a regex fallback for unsupported browsers.
 */
const TTSSentenceSegmenter = (function () {

  let segmenter = null;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      segmenter = new Intl.Segmenter(document.documentElement.lang || 'en', { granularity: 'sentence' });
    } catch (e) {
      console.warn("TTS: Intl.Segmenter initialization failed", e);
    }
  }

  /**
   * Fallback sentence splitting if Intl.Segmenter is not available.
   * Very basic regex splitting that tries not to break decimals or abbreviations.
   */
  function fallbackSegment(text) {
    // Basic regex: match sentence endings (.!?) not preceded by certain abbreviations
    // This is imperfect but works for basic fallback.
    const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)|.+/g) || [text];
    
    let currentIndex = 0;
    return sentences.map(s => {
      const start = text.indexOf(s, currentIndex);
      currentIndex = start + s.length;
      return {
        segment: s,
        index: start,
        isWordLike: true
      };
    });
  }

  return {
    /**
     * Segments a given text string into sentences.
     * @param {string} text 
     * @returns {Array<{segment: string, index: number}>}
     */
    segment(text) {
      if (!text || !text.trim()) return [];

      if (segmenter) {
        return Array.from(segmenter.segment(text));
      }
      return fallbackSegment(text);
    }
  };
})();

window.TTSSentenceSegmenter = TTSSentenceSegmenter;
