/**
 * TTS Speech Normalizer
 * Responsible for applying a pronunciation dictionary to text before speech synthesis.
 * The original text is preserved for UI and highlights.
 */
const TTSSpeechNormalizer = (function () {

  const PRONUNCIATION_DICTIONARY = [
    { regex: /\bK8s\b/gi, replacement: 'Kubernetes' },
    { regex: /\bK3s\b/gi, replacement: 'K three S' },
    { regex: /\bCLI\b/g, replacement: 'C L I' },
    { regex: /\bAPI\b/g, replacement: 'A P I' },
    { regex: /\bAWS\b/g, replacement: 'A W S' },
    { regex: /\bGCP\b/g, replacement: 'G C P' },
    { regex: /\bIAM\b/g, replacement: 'I A M' },
    { regex: /\bEKS\b/g, replacement: 'E K S' },
    { regex: /\bAKS\b/g, replacement: 'A K S' },
    { regex: /\bGKE\b/g, replacement: 'G K E' },
    { regex: /\bVPC\b/g, replacement: 'V P C' },
    { regex: /\bEC2\b/gi, replacement: 'E C two' },
    { regex: /\bS3\b/gi, replacement: 'S three' },
    { regex: /\bRDS\b/g, replacement: 'R D S' },
    { regex: /\bDNS\b/g, replacement: 'D N S' },
    { regex: /\bHTTP\b/gi, replacement: 'H T T P' },
    { regex: /\bHTTPS\b/gi, replacement: 'H T T P S' },
    { regex: /\bTCP\b/g, replacement: 'T C P' },
    { regex: /\bUDP\b/g, replacement: 'U D P' },
    { regex: /\bSSH\b/gi, replacement: 'S S H' },
    { regex: /\bTLS\b/g, replacement: 'T L S' },
    { regex: /\bSSL\b/g, replacement: 'S S L' },
    { regex: /\bJWT\b/g, replacement: 'J W T' },
    { regex: /\bSAML\b/gi, replacement: 'SAML' },
    { regex: /\bOIDC\b/g, replacement: 'O I D C' },
    { regex: /\bCI\/CD\b/gi, replacement: 'C I C D' },
    { regex: /\bGitHub\b/gi, replacement: 'Git Hub' },
    { regex: /\bGitLab\b/gi, replacement: 'Git Lab' },
    { regex: /\bkubectl\b/gi, replacement: 'cube control' },
    { regex: /\bTerraform\b/gi, replacement: 'Terraform' },
    { regex: /\bTerragrunt\b/gi, replacement: 'Terra grunt' },
    { regex: /\bPostgreSQL\b/gi, replacement: 'Postgres Q L' },
    { regex: /\bMySQL\b/gi, replacement: 'My S Q L' },
    { regex: /\bDevOps\b/gi, replacement: 'Dev Ops' },
    { regex: /\bMLOps\b/gi, replacement: 'M L Ops' },
    { regex: /\bLLM\b/g, replacement: 'L L M' },
    { regex: /\bRAG\b/g, replacement: 'R A G' },
    { regex: /\bGPU\b/g, replacement: 'G P U' },
    { regex: /\bCPU\b/g, replacement: 'C P U' },
    { regex: /\bRAM\b/g, replacement: 'RAM' },
    { regex: /\bYAML\b/gi, replacement: 'YAML' },
    { regex: /\bJSON\b/gi, replacement: 'Jason' }
  ];

  return {
    /**
     * Normalizes a text string using the pronunciation dictionary.
     * @param {string} text The display text
     * @returns {string} The text modified for speech synthesis
     */
    normalize(text) {
      if (!text) return "";
      let speechText = text;

      // Extremely basic URL cleanup (don't read massive URLs out loud letter by letter)
      // Replaces typical URLs with just "Link" or similar, or simplifies them.
      speechText = speechText.replace(/https?:\/\/[^\s]+/gi, 'URL');

      // Apply dictionary
      for (const rule of PRONUNCIATION_DICTIONARY) {
        speechText = speechText.replace(rule.regex, rule.replacement);
      }

      return speechText;
    }
  };
})();

window.TTSSpeechNormalizer = TTSSpeechNormalizer;
