import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { chatService } from '../services/chatService';
import ChatBubble from './ChatBubble';
import EmergencyBanner from './EmergencyBanner';
import { 
  IconMessageSquare, 
  IconClose, 
  IconSend, 
  IconExternalLink,
  IconSparkles,
  IconHeartPulse,
  IconMic,
  IconMicOff
} from './Icons';
import { VoiceRecognizer, isSpeechRecognitionSupported } from '../utils/voiceUtils';
import './FloatingWidget.css';

export default function FloatingWidget() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [emergency, setEmergency] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const recognizerRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, sending, open]);

  // Focus input when opened
  useEffect(() => {
    if (open && isAuthenticated) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, isAuthenticated]);

  // Initialize voice recognizer
  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      recognizerRef.current = new VoiceRecognizer({
        language,
        onStart: () => setIsListening(true),
        onResult: (transcript, isFinal) => {
          setInput(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }

    return () => {
      recognizerRef.current?.stop();
    };
  }, [language]);

  const toggleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) return;

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognizerRef.current?.start(language);
    }
  };

  // Close on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
    }
  }, [open]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const sendQuery = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || sending) return;

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    }

    const userMessage = { sender: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);
    setEmergency(null);

    try {
      const data = await chatService.sendMessage({ message: text, language, sessionId });
      setSessionId(data.sessionId);
      const assistantMessage = { 
        sender: 'assistant', 
        text: data.reply, 
        triageLevel: data.triageLevel,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      if (data.triageLevel === 'EMERGENCY') {
        setEmergency(data.reply);
      }
    } catch {
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: t('common_error'),
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendQuery();
  };

  const quickPrompts = [
    t('quick_fever'),
    t('quick_cough'),
    t('quick_stomach'),
    t('quick_chest'),
  ];

  return (
    <div className="widget-root">
      {open && (
        <div 
          className="widget-panel card" 
          role="dialog" 
          aria-label="Medi AI Health Assistant" 
          aria-modal="true"
        >
          {/* Header */}
          <div className="widget-header">
            <div className="widget-header-title">
              <div className="widget-mark" aria-hidden="true">
                <IconHeartPulse size={17} />
              </div>
              <div>
                <span className="widget-name">Medi AI</span>
                <span className="widget-sub">AI Health Assistant · ఆరోగ్య సహాయకుడు</span>
              </div>
            </div>
            <button 
              type="button" 
              className="widget-close" 
              onClick={() => setOpen(false)} 
              aria-label={t('common_close')}
            >
              <IconClose size={20} />
            </button>
          </div>

          {/* Body */}
          {isAuthenticated ? (
            <div className="widget-body">
              {emergency && (
                <div className="widget-emergency">
                  <EmergencyBanner message={emergency} />
                </div>
              )}

              <div className="widget-scroll" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="widget-empty-state">
                    <div className="widget-empty-icon">
                      <IconSparkles size={24} />
                    </div>
                    <p className="widget-empty-title">
                      {language === 'Telugu' ? 'హలో! నేను Medi AI ని. మీ లక్షణాలను చెప్పండి.' : 'Hello! I am Medi AI. Describe your symptoms.'}
                    </p>
                    <p className="widget-empty-sub">{t('chat_empty_sub')}</p>
                    
                    <div className="symptom-chips" style={{ justifyContent: 'center' }}>
                      {quickPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="chip-btn"
                          onClick={() => sendQuery(prompt)}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((m, i) => (
                      <ChatBubble 
                        key={i} 
                        sender={m.sender} 
                        text={m.text} 
                        triageLevel={m.triageLevel} 
                        timestamp={m.timestamp} 
                      />
                    ))}
                  </>
                )}

                {sending && (
                  <div className="bubble-row from-assistant">
                    <div className="bubble bubble-assistant bubble-thinking">
                      <div className="spinner spinner-sm" style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
                      <span>Medi AI {t('chat_thinking')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form with Voice Button */}
              <form className="widget-input-bar" onSubmit={handleFormSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={isListening ? (language === 'Telugu' ? 'వింటున్నాము...' : 'Listening...') : (language === 'Telugu' ? 'లక్షణాలు రాయండి లేదా మాట్లాడండి...' : 'Type or speak symptoms...')}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={sending}
                  aria-label="Ask Medi AI"
                />

                {isSpeechRecognitionSupported() && (
                  <button
                    type="button"
                    className={`widget-voice-btn ${isListening ? 'listening' : ''}`}
                    onClick={toggleVoiceInput}
                    title={isListening ? 'Stop' : 'Voice input'}
                    aria-label="Voice input"
                  >
                    {isListening ? <IconMicOff size={16} /> : <IconMic size={16} />}
                  </button>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm btn-icon" 
                  disabled={sending || !input.trim()}
                  aria-label={t('chat_send')}
                >
                  <IconSend size={16} />
                </button>
              </form>

              <Link 
                to="/chat" 
                className="widget-full-link" 
                onClick={() => setOpen(false)}
              >
                <span>Open Full Chat Screen</span>
                <IconExternalLink size={14} />
              </Link>
            </div>
          ) : (
            <div className="widget-teaser">
              <span className="eyebrow">Medi AI · Smart India Hackathon</span>
              <h3>Instant Bilingual Health Guidance</h3>
              <p className="widget-teaser-body">
                Medi AI helps you understand symptoms in Telugu or English, detects emergency red flags, and directs you to the right Primary Health Centre.
              </p>
              <div className="widget-teaser-actions">
                <Link 
                  to="/register" 
                  className="btn btn-primary btn-block" 
                  onClick={() => setOpen(false)}
                >
                  {t('hero_cta_primary')}
                </Link>
                <Link 
                  to="/login" 
                  className="btn btn-outline btn-block" 
                  onClick={() => setOpen(false)}
                >
                  {t('nav_login')}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Launcher with Medi AI pill */}
      <button
        type="button"
        className={`widget-launcher ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-label={open ? t('common_close') : 'Open Medi AI'}
        aria-expanded={open}
      >
        {open ? (
          <IconClose size={24} />
        ) : (
          <div className="launcher-content">
            <IconSparkles size={24} />
            <span className="launcher-label">Medi AI</span>
          </div>
        )}
        {!open && <span className="widget-launcher-badge" aria-hidden="true" />}
      </button>
    </div>
  );
}
