import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { chatService } from '../services/chatService';
import ChatBubble from '../components/ChatBubble';
import EmergencyBanner from '../components/EmergencyBanner';
import { 
  IconSend, 
  IconTrash, 
  IconSparkles, 
  IconHospital, 
  IconMenu, 
  IconClose, 
  IconClock,
  IconAlertTriangle,
  IconMic,
  IconMicOff
} from '../components/Icons';
import { VoiceRecognizer, isSpeechRecognitionSupported } from '../utils/voiceUtils';
import './Chat.css';

export default function Chat() {
  const { t, language } = useLanguage();
  const { success, error: toastError, info: toastInfo } = useToast();

  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [emergency, setEmergency] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [latestTriageLevel, setLatestTriageLevel] = useState(null);
  
  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const loadSessions = useCallback(async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data.sessions || []);
    } catch {
      /* non-fatal */
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => { 
    loadSessions(); 
  }, [loadSessions]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

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
        onError: (err) => {
          setIsListening(false);
          if (err === 'not-allowed') {
            toastError(language === 'Telugu' ? 'మైక్రోఫోన్ అనుమతి అవసరం.' : 'Microphone permission denied.');
          } else if (err !== 'no-speech') {
            toastInfo(language === 'Telugu' ? 'వాయిస్ సరిగ్గా వినబడలేదు. మళ్లీ చెప్పండి.' : 'Voice not recognized. Please try again.');
          }
        },
        onEnd: () => setIsListening(false),
      });
    }

    return () => {
      recognizerRef.current?.stop();
    };
  }, [language]);

  const toggleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      toastError(language === 'Telugu' ? 'మీ బ్రౌజర్ వాయిస్ ఇన్‌పుట్‌ను మద్దతు ఇవ్వడం లేదు.' : 'Voice recognition is not supported on this browser.');
      return;
    }

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      const started = recognizerRef.current?.start(language);
      if (started) {
        toastInfo(language === 'Telugu' ? '🎙️ మాట్లాడండి (తెలుగులో వింటున్నాము)...' : '🎙️ Listening (Speak your symptoms)...');
      }
    }
  };

  const openSession = async (id) => {
    setEmergency(null);
    setLatestTriageLevel(null);
    setSidebarOpen(false);
    try {
      const data = await chatService.getSession(id);
      setSessionId(id);
      setMessages(data.session.messages.map(m => ({ 
        sender: m.sender, 
        text: m.text,
        timestamp: m.timestamp 
      })));
    } catch {
      toastError(t('common_error'));
    }
  };

  const startNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setEmergency(null);
    setLatestTriageLevel(null);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSendMessage = async (textToSend) => {
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
      setLatestTriageLevel(data.triageLevel);

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
      loadSessions();
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
    handleSendMessage();
  };

  const handleDeleteSession = async (id, e) => {
    e.stopPropagation();
    if (window.confirm(t('chat_delete_confirm'))) {
      try {
        await chatService.deleteSession(id);
        if (sessionId === id) startNewChat();
        success(t('chat_sessions') + ' updated');
        loadSessions();
      } catch {
        toastError(t('common_error'));
      }
    }
  };

  const quickPrompts = [
    t('quick_fever'),
    t('quick_cough'),
    t('quick_stomach'),
    t('quick_headache'),
    t('quick_chest'),
  ];

  return (
    <div className="chat-page">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="chat-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`chat-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="chat-sidebar-header">
          <button 
            type="button" 
            className="btn btn-primary btn-block" 
            onClick={startNewChat}
          >
            <IconSparkles size={18} />
            <span>{t('chat_new')}</span>
          </button>
          <button 
            type="button" 
            className="chat-sidebar-close" 
            onClick={() => setSidebarOpen(false)}
            aria-label={t('common_close')}
          >
            <IconClose size={20} />
          </button>
        </div>

        <div className="chat-sessions-label">
          <IconClock size={14} />
          <span>{t('chat_sessions')}</span>
        </div>

        <div className="chat-sessions-list">
          {loadingSessions ? (
            <div className="empty-state" style={{ padding: 20 }}>
              <div className="spinner spinner-sm" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="chat-empty-sessions">{t('chat_no_sessions')}</p>
          ) : (
            sessions.map(s => (
              <button
                key={s.id}
                type="button"
                className={`chat-session-item ${sessionId === s.id ? 'active' : ''}`}
                onClick={() => openSession(s.id)}
              >
                <span className="chat-session-title">{s.title || t('chat_new')}</span>
                <span 
                  className="chat-session-delete" 
                  onClick={(e) => handleDeleteSession(s.id, e)} 
                  title={t('chat_delete')}
                  aria-label={t('chat_delete')}
                >
                  <IconTrash size={14} />
                </span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat View */}
      <section className="chat-main">
        {/* Chat Header Bar */}
        <div className="chat-topbar">
          <button
            type="button"
            className="chat-toggle-sidebar"
            onClick={() => setSidebarOpen(prev => !prev)}
            aria-label={t('chat_sessions')}
          >
            <IconMenu size={20} />
            <span>{t('chat_sessions')}</span>
          </button>
          
          <div className="chat-topbar-info">
            <span className="chat-status-dot" aria-hidden="true" />
            <span className="chat-topbar-title">Medi AI · {language === 'Telugu' ? 'తెలుగు క్లినికల్ చాట్' : 'Bilingual Health Chat'}</span>
          </div>

          <div className="chat-topbar-actions">
            <Link to="/phcs" className="chat-phc-link" title={t('chat_find_phc')}>
              <IconHospital size={16} />
              <span className="chat-phc-text">{t('nav_phcs')}</span>
            </Link>
          </div>
        </div>

        {/* Emergency Alert Banner */}
        {emergency && (
          <div className="chat-emergency-wrap">
            <EmergencyBanner message={emergency} />
          </div>
        )}

        {/* Conversation Stream */}
        <div className="chat-scroll" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <div className="chat-empty-icon" aria-hidden="true">
                <IconSparkles size={32} />
              </div>
              <h2>{language === 'Telugu' ? 'Medi AI ఆరోగ్య సహాయకుడు' : 'Medi AI Symptom Checker'}</h2>
              <p>{t('chat_empty_sub')}</p>

              {/* Voice Prompt Teaser */}
              <div className="voice-teaser-pill" onClick={toggleVoiceInput}>
                <span className="voice-pulse-ring">
                  <IconMic size={18} />
                </span>
                <span>{language === 'Telugu' ? 'మైక్ నొక్కి మీ సమస్యను తెలుగులో చెప్పండి' : 'Tap mic and describe symptoms in voice'}</span>
              </div>

              <div className="symptom-chips" style={{ justifyContent: 'center', maxWidth: 640 }}>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="chip-btn"
                    onClick={() => handleSendMessage(prompt)}
                  >
                    <IconSparkles size={14} style={{ color: 'var(--teal)' }} />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>

              <div className="chat-safety-notice card">
                <IconAlertTriangle size={18} style={{ color: 'var(--amber-700)', flexShrink: 0 }} />
                <span>{t('hero_disclaimer')} · Call 108 in severe emergencies.</span>
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

              {latestTriageLevel && latestTriageLevel !== 'LOW' && (
                <div className="chat-action-callout card">
                  <div className="callout-content">
                    <IconHospital size={22} style={{ color: 'var(--teal)' }} />
                    <div>
                      <strong>Need to visit a healthcare center?</strong>
                      <p>View government Primary Health Centres with contact details across Andhra Pradesh.</p>
                    </div>
                  </div>
                  <Link to="/phcs" className="btn btn-outline btn-sm">
                    {t('chat_find_phc')} →
                  </Link>
                </div>
              )}
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

        {/* Input Bar with Voice Recognition */}
        <div className="chat-input-container">
          {isListening && (
            <div className="voice-listening-bar">
              <span className="voice-active-indicator" />
              <span>{language === 'Telugu' ? 'తెలుగులో వింటున్నాము... మాట్లాడండి' : 'Listening... Speak your symptoms'}</span>
              <button type="button" className="voice-stop-btn" onClick={toggleVoiceInput}>
                Stop
              </button>
            </div>
          )}

          <form className="chat-input-bar" onSubmit={handleFormSubmit}>
            <input
              ref={inputRef}
              type="text"
              placeholder={isListening ? (language === 'Telugu' ? 'వింటున్నాము...' : 'Listening...') : t('chat_placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              aria-label={t('chat_placeholder')}
            />

            {/* Voice Input Button */}
            <button
              type="button"
              className={`btn btn-voice ${isListening ? 'listening-active' : ''}`}
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop recording' : (language === 'Telugu' ? 'మైక్రోఫోన్ (వాయిస్)' : 'Voice input')}
              aria-label={isListening ? 'Stop recording' : 'Voice input'}
            >
              {isListening ? <IconMicOff size={19} /> : <IconMic size={19} />}
            </button>

            {/* Send Button */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={sending || !input.trim()}
              aria-label={t('chat_send')}
            >
              <IconSend size={18} />
              <span className="send-btn-label">{t('chat_send')}</span>
            </button>
          </form>
          <p className="chat-disclaimer">
            {language === 'Telugu' ? 'వాయిస్ లేదా టెక్స్ట్ ద్వారా మాట్లాడండి · అత్యవసర సమయాల్లో 108 కి కాల్ చేయండి' : t('chat_disclaimer')}
          </p>
        </div>
      </section>
    </div>
  );
}
