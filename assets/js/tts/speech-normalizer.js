/**
 * TTS Speech Normalizer
 * Cleans and transforms raw markdown/code text before speech synthesis:
 *   1. Strips markdown & syntax artifacts so they are not read as literal characters
 *   2. Expands technical abbreviations, names, and acronyms into natural phonetics
 *   3. Inserts natural punctuation pauses for conversational cadence
 *
 * The original displayText is preserved for UI highlighting;
 * only speechText is processed by this normalizer.
 */
const TTSSpeechNormalizer = (function () {

  /**
   * Step 1 — Strip markdown & code artifacts
   */
  function stripMarkdownArtifacts(text) {
    let t = text;

    // Fenced code blocks (```lang ... ```)
    t = t.replace(/```[\w]*\n[\s\S]*?```/g, '');

    // Inline code (backticks) — extract the inner content cleanly
    t = t.replace(/`([^`]+)`/g, '$1');

    // Markdown headings (#, ##, ###...)
    t = t.replace(/^#{1,6}\s+/gm, '');

    // Markdown link syntax: [Link Text](http://...) -> Link Text
    t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Bold / italic markers (**text**, *text*, __text__, _text_)
    t = t.replace(/(\*{1,3}|_{1,3})([^*_]+)\1/g, '$2');

    // Table pipes & horizontal rules
    t = t.replace(/\|/g, ' ');
    t = t.replace(/[-:]{3,}/g, ' ');

    // Blockquote markers
    t = t.replace(/^>\s*/gm, '');

    // Markdown list bullets and numbered list markers
    t = t.replace(/^[\s]*[-*+]\s+/gm, '');
    t = t.replace(/^[\s]*\d+\.\s+/gm, '');

    // HTML entities
    t = t.replace(/&amp;/g, ' and ');
    t = t.replace(/&lt;/g, ' less than ');
    t = t.replace(/&gt;/g, ' greater than ');
    t = t.replace(/&nbsp;/g, ' ');
    t = t.replace(/&#\d+;/g, '');
    t = t.replace(/&[a-z]+;/gi, '');

    // Emoji and UI decorative symbols
    t = t.replace(/[\u{1F300}-\u{1FAFF}]/gu, '');
    t = t.replace(/[✅❌⚠️🔥💡🎯📌🗂️🔐⚙️🚀📦🔀🏷️💾📎📤🎙️📋🤔🤖🧩💳🆓🐙✨🎧🌟💎]/g, '');

    // Checkboxes from task lists
    t = t.replace(/\[[ xX]\]/g, '');

    // Common file paths / configs (e.g. .claude/settings.local.json -> settings dot local dot json)
    t = t.replace(/(?:\.\/|\.\.\/|~\/)?([\w.-]+)\/([\w.-]+)\.json/gi, '$2 dot json');
    t = t.replace(/(?:\.\/|\.\.\/|~\/)?([\w.-]+)\/([\w.-]+)\.ya?ml/gi, '$2 dot yaml');

    // Collapse whitespace
    t = t.replace(/\s{2,}/g, ' ').trim();

    return t;
  }

  /**
   * Step 2 — Conversational Pronunciation Dictionary
   */
  const PRONUNCIATION_DICTIONARY = [
    // ── AI Tools & Platforms ──────────────────────────────────────────
    { regex: /\bClaude\s+Code\b/gi,   replacement: 'Claude Code' },
    { regex: /\bOpenRouter\b/gi,     replacement: 'Open Router' },
    { regex: /\bAnthropic\b/gi,      replacement: 'Anthropic' },
    { regex: /\bspendly\b/gi,        replacement: 'spend-lee' },
    { regex: /\bDeepSeek\b/gi,       replacement: 'Deep Seek' },
    { regex: /\bMistral\b/gi,        replacement: 'Mistral' },
    { regex: /\bLlama\b/gi,          replacement: 'Llama' },
    { regex: /\bGroq\b/gi,           replacement: 'Grok' },
    { regex: /\bGemini\b/gi,         replacement: 'Gemini' },
    { regex: /\bChatGPT\b/gi,        replacement: 'Chat G P T' },
    { regex: /\bGPT-4o\b/gi,         replacement: 'G P T four O' },
    { regex: /\bGPT-4\b/gi,          replacement: 'G P T four' },
    { regex: /\bGPT\b/g,             replacement: 'G P T' },
    { regex: /\bLLM[s]?\b/gi,        replacement: 'L L M' },
    { regex: /\bRAG\b/g,             replacement: 'R A G' },
    { regex: /\bMCP\b/g,             replacement: 'M C P' },
    { regex: /\bOllama\b/gi,         replacement: 'Ollama' },
    { regex: /\bLangChain\b/gi,      replacement: 'Lang Chain' },

    // ── Developer Tools & Runtimes ────────────────────────────────────
    { regex: /\buv\b/g,              replacement: 'U V' },
    { regex: /\bpip\b/g,             replacement: 'pip' },
    { regex: /\bnpm\b/g,             replacement: 'N P M' },
    { regex: /\bnpx\b/g,             replacement: 'N P X' },
    { regex: /\bvenv\b/gi,           replacement: 'V env' },
    { regex: /\bVSCode\b/gi,         replacement: 'V S Code' },
    { regex: /\bVS Code\b/gi,        replacement: 'V S Code' },
    { regex: /\bIDE\b/g,             replacement: 'I D E' },
    { regex: /\bCLI\b/g,             replacement: 'C L I' },
    { regex: /\bAPI[s]?\b/g,         replacement: 'A P I' },
    { regex: /\bSDK[s]?\b/g,         replacement: 'S D K' },
    { regex: /\bUI\b/g,              replacement: 'U I' },
    { regex: /\bUX\b/g,              replacement: 'U X' },
    { regex: /\bPR[s]?\b/g,          replacement: 'pull request' },
    { regex: /\bGitHub\b/gi,         replacement: 'Git Hub' },
    { regex: /\bGitLab\b/gi,         replacement: 'Git Lab' },
    { regex: /\bGitOps\b/gi,         replacement: 'Git Ops' },
    { regex: /\bCI\/CD\b/gi,         replacement: 'C I C D' },
    { regex: /\bmacOS\b/gi,          replacement: 'Mac O S' },

    // ── Infrastructure & Cloud ────────────────────────────────────────
    { regex: /\bK8s\b/gi,            replacement: 'Kubernetes' },
    { regex: /\bK3s\b/gi,            replacement: 'K three S' },
    { regex: /\bkubectl\b/gi,        replacement: 'cube control' },
    { regex: /\bHelm\b/g,            replacement: 'Helm' },
    { regex: /\bAWS\b/g,             replacement: 'A W S' },
    { regex: /\bGCP\b/g,             replacement: 'G C P' },
    { regex: /\bAzure\b/gi,          replacement: 'Azure' },
    { regex: /\bEKS\b/g,             replacement: 'E K S' },
    { regex: /\bAKS\b/g,             replacement: 'A K S' },
    { regex: /\bGKE\b/g,             replacement: 'G K E' },
    { regex: /\bVPC\b/g,             replacement: 'V P C' },
    { regex: /\bEC2\b/gi,            replacement: 'E C two' },
    { regex: /\bS3\b/gi,             replacement: 'S three' },
    { regex: /\bRDS\b/g,             replacement: 'R D S' },
    { regex: /\bIAM\b/g,             replacement: 'I A M' },
    { regex: /\bCDN\b/g,             replacement: 'C D N' },
    { regex: /\bTerraform\b/gi,      replacement: 'Terraform' },
    { regex: /\bTerragrunt\b/gi,     replacement: 'Terra grunt' },
    { regex: /\bAnsible\b/gi,        replacement: 'Ansible' },
    { regex: /\bPulumi\b/gi,         replacement: 'Poo loo mee' },
    { regex: /\bDevOps\b/gi,         replacement: 'Dev Ops' },
    { regex: /\bMLOps\b/gi,          replacement: 'M L Ops' },

    // ── Networking & Security ─────────────────────────────────────────
    { regex: /\bDNS\b/g,             replacement: 'D N S' },
    { regex: /\bHTTPS?\b/gi,         replacement: (m) => m.toUpperCase().split('').join(' ') },
    { regex: /\bTCP\b/g,             replacement: 'T C P' },
    { regex: /\bUDP\b/g,             replacement: 'U D P' },
    { regex: /\bSSH\b/gi,            replacement: 'S S H' },
    { regex: /\bTLS\b/g,             replacement: 'T L S' },
    { regex: /\bSSL\b/g,             replacement: 'S S L' },
    { regex: /\bIP\b/g,              replacement: 'I P' },
    { regex: /\bJWT\b/g,             replacement: 'J W T' },
    { regex: /\bSAML\b/gi,           replacement: 'SAML' },
    { regex: /\bOIDC\b/g,            replacement: 'O I D C' },
    { regex: /\bOAuth\b/gi,          replacement: 'O Auth' },
    { regex: /\bMFA\b/g,             replacement: 'M F A' },
    { regex: /\b2FA\b/g,             replacement: 'two factor authentication' },

    // ── Databases & Formats ───────────────────────────────────────────
    { regex: /\bPostgreSQL\b/gi,     replacement: 'Postgres Q L' },
    { regex: /\bMySQL\b/gi,          replacement: 'My S Q L' },
    { regex: /\bRedis\b/gi,          replacement: 'Redis' },
    { regex: /\bMongoDB\b/gi,        replacement: 'Mongo D B' },
    { regex: /\bSQLite\b/gi,         replacement: 'S Q Lite' },
    { regex: /\bYAML\b/gi,           replacement: 'YAML' },
    { regex: /\bJSON\b/gi,           replacement: 'Jason' },
    { regex: /\.json\b/gi,           replacement: ' dot json' },
    { regex: /\.yaml\b/gi,           replacement: ' dot yaml' },
    { regex: /\.yml\b/gi,            replacement: ' dot yaml' },
    { regex: /\.md\b/gi,             replacement: ' dot M D' },
    { regex: /\.py\b/gi,             replacement: ' dot pie' },
    { regex: /\.js\b/gi,             replacement: ' dot J S' },
    { regex: /\.sh\b/gi,             replacement: ' dot shell' },

    // ── Hardware & Common Quantities ──────────────────────────────────
    { regex: /\bGPU[s]?\b/g,         replacement: 'G P U' },
    { regex: /\bCPU[s]?\b/g,         replacement: 'C P U' },
    { regex: /\bRAM\b/g,             replacement: 'RAM' },
    { regex: /₹(\d+)/g,              replacement: (_, n) => n + ' rupees' },
    { regex: /\$(\d+)/g,             replacement: (_, n) => n + ' dollars' },
    { regex: /(\d+)%/g,              replacement: (_, n) => n + ' percent' },
    { regex: /(\d+)GB/gi,            replacement: (_, n) => n + ' gigabytes' },
    { regex: /(\d+)TB/gi,            replacement: (_, n) => n + ' terabytes' },
    { regex: /(\d+)MB/gi,            replacement: (_, n) => n + ' megabytes' },
    { regex: /(\d+)KB/gi,            replacement: (_, n) => n + ' kilobytes' },
    { regex: /v(\d+)\.(\d+)/gi,      replacement: (_, a, b) => 'version ' + a + ' point ' + b },
    { regex: /\be\.g\.\b/gi,         replacement: 'for example,' },
    { regex: /\bi\.e\.\b/gi,         replacement: 'that is,' },
    { regex: /\betc\.\b/gi,          replacement: 'and so on' },
    { regex: /\bvs\.\b/gi,           replacement: 'versus' },
    { regex: /Step\s+(\d+)\s*[-—:]/gi, replacement: 'Step $1: ' }
  ];

  /**
   * Step 3 — Final cleanup and natural speech pacing
   */
  function finalCleanup(text) {
    let t = text;

    // Convert raw URLs to natural speech
    t = t.replace(/https?:\/\/[^\s]+/gi, 'the linked URL');

    // Replace em dashes and colons with natural comma pauses for breathing
    t = t.replace(/\s*[—–]\s*/g, ', ');
    t = t.replace(/\s*:\s*/g, ', ');

    // Normalize spacing around punctuation
    t = t.replace(/\s{2,}/g, ' ');
    t = t.replace(/\s([,;.!?])/g, '$1');

    // Clean stray leading/trailing non-alphanumerics
    t = t.replace(/^[,;:\-–—\s]+/g, '');
    t = t.replace(/[\-–—\s]+$/g, '');

    return t.trim();
  }

  return {
    /**
     * Normalizes a text string for speech synthesis.
     * @param {string} text The display text
     * @returns {string} The text modified for speech synthesis
     */
    normalize(text) {
      if (!text) return '';

      let speechText = text;

      // 1. Strip markdown & code artifacts
      speechText = stripMarkdownArtifacts(speechText);

      // 2. Apply pronunciation dictionary
      for (const rule of PRONUNCIATION_DICTIONARY) {
        speechText = speechText.replace(rule.regex, rule.replacement);
      }

      // 3. Final cleanup & breathing pauses
      speechText = finalCleanup(speechText);

      return speechText || '';
    }
  };
})();

window.TTSSpeechNormalizer = TTSSpeechNormalizer;
