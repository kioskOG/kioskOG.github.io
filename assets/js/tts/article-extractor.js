/**
 * TTS Article Extractor
 * Uses TreeWalker to traverse eligible text nodes, skipping ignored elements.
 * Generates a runtime semantic model for the speech engine and highlighting.
 */
const TTSArticleExtractor = (function () {

  const IGNORED_TAGS = new Set([
    'PRE', 'CODE', 'TABLE', 'SCRIPT', 'STYLE', 'SVG', 'NOSCRIPT', 'IFRAME', 'BUTTON', 'NAV', 'AUDIO', 'VIDEO'
  ]);

  /**
   * Determine if a node should be ignored based on its tag, classes, or attributes.
   */
  function isNodeIgnored(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (IGNORED_TAGS.has(node.tagName)) return true;
      if (node.hasAttribute('aria-hidden') && node.getAttribute('aria-hidden') === 'true') return true;
      if (node.hasAttribute('data-tts-ignore')) return true;
      if (node.classList && (node.classList.contains('mermaid') || node.classList.contains('language-mermaid'))) return true;
      if (node.classList && node.classList.contains('copy-code-btn')) return true;
      
      // Jekyll specific or just-the-docs specific skips
      if (node.tagName === 'A' && node.classList.contains('anchor-heading')) return true; 
    }
    return false;
  }

  /**
   * Generates a structural fingerprint of the extracted text to detect article changes.
   */
  function generateFingerprint(sentences) {
    let hash = 0;
    const sample = sentences.length + "|" + (sentences.length > 0 ? sentences[0].displayText : "") + "|" + (sentences.length > 0 ? sentences[sentences.length - 1].displayText : "");
    for (let i = 0; i < sample.length; i++) {
      const char = sample.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Processes a block element (like P, H1, LI) into sentences and maps text nodes.
   */
  function processBlock(blockElement, globalIndexObj) {
    const textNodes = [];
    
    // Use TreeWalker to gather valid text nodes
    const walker = document.createTreeWalker(
      blockElement,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (isNodeIgnored(node)) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_SKIP;
          }
          if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim() === '') {
              return NodeFilter.FILTER_SKIP;
            }
            // Ensure parent is not ignored (safety check)
            let parent = node.parentElement;
            while(parent && parent !== blockElement) {
               if(isNodeIgnored(parent)) return NodeFilter.FILTER_REJECT;
               parent = parent.parentElement;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let currentNode;
    while (currentNode = walker.nextNode()) {
      textNodes.push(currentNode);
    }

    if (textNodes.length === 0) return [];

    // Combine text
    const fullText = textNodes.map(n => n.textContent).join('');
    if (!fullText.trim()) return [];

    // Map string index to (node, nodeOffset)
    let lengthMapping = [];
    let currentLength = 0;
    for (const node of textNodes) {
      const len = node.textContent.length;
      lengthMapping.push({ node, start: currentLength, end: currentLength + len });
      currentLength += len;
    }

    // Resolve an offset in the combined text to a specific node and offset
    function resolveOffset(offset) {
      for (const map of lengthMapping) {
        if (offset >= map.start && offset < map.end) {
          return { node: map.node, offset: offset - map.start };
        }
      }
      // If exactly at the end
      if (offset === currentLength && lengthMapping.length > 0) {
        const last = lengthMapping[lengthMapping.length - 1];
        return { node: last.node, offset: last.end - last.start };
      }
      return null;
    }

    // Segment into sentences
    const segments = window.TTSSentenceSegmenter.segment(fullText);
    const sentences = [];

    for (const seg of segments) {
      const text = seg.segment.trim();
      if (!text) continue;

      const startIndex = seg.index + seg.segment.indexOf(text);
      const endIndex = startIndex + text.length;

      const startResolution = resolveOffset(startIndex);
      const endResolution = resolveOffset(endIndex);

      if (startResolution && endResolution) {
        sentences.push({
          sentenceIndex: globalIndexObj.index++,
          displayText: text,
          speechText: window.TTSSpeechNormalizer ? window.TTSSpeechNormalizer.normalize(text) : text,
          blockType: blockElement.tagName.toLowerCase(),
          blockElement: blockElement,
          startNode: startResolution.node,
          startOffset: startResolution.offset,
          endNode: endResolution.node,
          endOffset: endResolution.offset
        });
      }
    }

    return sentences;
  }

  return {
    /**
     * Extracts sentences from a container
     * @param {HTMLElement} container 
     * @returns {{ sentences: Array, fingerprint: string }}
     */
    extract(container) {
      if (!container) return { sentences: [], fingerprint: '' };

      const sentences = [];
      const globalIndexObj = { index: 0 };

      // We only process top-level block elements or specific children of blockquotes/lists
      // For Jekyll, .doc-prose has immediate children like h1, p, ul, blockquote, pre
      
      const blocks = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote > p, figcaption');
      
      blocks.forEach(block => {
        // Skip blocks that are inside other processed blocks (e.g., li > p) if needed, 
        // but querySelectorAll order and structure usually means we just process them.
        // Let's refine to ensure we don't double process. If a block is inside an ignored element, skip.
        let parent = block.parentElement;
        let skip = false;
        while (parent && parent !== container) {
          if (isNodeIgnored(parent)) {
            skip = true;
            break;
          }
          parent = parent.parentElement;
        }
        
        if (skip || isNodeIgnored(block)) return;

        // Skip p that are just wrappers for images and nothing else
        if (block.tagName === 'P' && block.textContent.trim() === '' && block.querySelector('img')) return;

        const blockSentences = processBlock(block, globalIndexObj);
        sentences.push(...blockSentences);
      });

      return {
        sentences,
        fingerprint: generateFingerprint(sentences)
      };
    }
  };
})();

window.TTSArticleExtractor = TTSArticleExtractor;
