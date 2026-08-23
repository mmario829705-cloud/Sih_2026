// Web Speech API Utilities for Bilingual Telugu & English Voice Support

export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export class VoiceRecognizer {
  constructor({ language = 'Telugu', onResult, onError, onEnd, onStart }) {
    this.language = language;
    this.onResult = onResult;
    this.onError = onError;
    this.onEnd = onEnd;
    this.onStart = onStart;
    this.recognition = null;
    this.isListening = false;

    if (isSpeechRecognitionSupported()) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStart?.();
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        const isFinal = event.results[event.results.length - 1].isFinal;
        this.onResult?.(transcript, isFinal);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        this.onError?.(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onEnd?.();
      };
    }
  }

  start(language) {
    if (!this.recognition) return false;
    const langCode = (language || this.language) === 'Telugu' ? 'te-IN' : 'en-IN';
    this.recognition.lang = langCode;

    try {
      this.recognition.start();
      return true;
    } catch {
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        /* ignore */
      }
    }
    this.isListening = false;
  }
}

let activeUtterance = null;

export const speakText = (text, language = 'Telugu', onEnd, onStart) => {
  if (!isSpeechSynthesisSupported() || !text) return false;

  try {
    window.speechSynthesis.cancel();

    // Clean text of markdown asterisks/bullets for clean audio narration
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'Telugu' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.95; // slightly slower for clear healthcare comprehension
    utterance.pitch = 1.0;

    // Attempt to select an Indian English or Telugu voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => 
      v.lang.startsWith(language === 'Telugu' ? 'te' : 'en-IN') ||
      (language === 'English' && (v.lang.includes('IN') || v.name.includes('India')))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = () => {
      activeUtterance = null;
      onEnd?.();
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    } catch {
      /* ignore */
    }
  }
};

