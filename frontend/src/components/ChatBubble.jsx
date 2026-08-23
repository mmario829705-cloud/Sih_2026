import { useState, useEffect } from 'react';
import TriageBadge from './TriageBadge';
import { IconCopy, IconCheck, IconUser, IconSparkles, IconVolume2, IconStopCircle } from './Icons';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { speakText, stopSpeaking, isSpeechSynthesisSupported } from '../utils/voiceUtils';
import './ChatBubble.css';

export default function ChatBubble({ sender, text, triageLevel, timestamp }) {
  const isUser = sender === 'user';
  const { t, language } = useLanguage();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    return () => {
      if (isPlayingAudio) {
        stopSpeaking();
      }
    };
  }, [isPlayingAudio]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      success(t('chat_copied'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore clipboard failure */
    }
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(
        text,
        language,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(true)
      );
    }
  };

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`bubble-row ${isUser ? 'from-user' : 'from-assistant'}`}>
      {!isUser && (
        <div className="bubble-avatar assistant-avatar" aria-hidden="true">
          <IconSparkles size={16} />
        </div>
      )}

      <div className="bubble-wrapper">
        <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-assistant'} ${isPlayingAudio ? 'is-speaking' : ''}`}>
          {!isUser && triageLevel && (
            <div className="bubble-badge">
              <TriageBadge level={triageLevel} />
            </div>
          )}

          <div className="bubble-text">
            {text.split('\n').map((paragraph, index) => (
              <p key={index} className={paragraph.startsWith('•') || paragraph.startsWith('-') ? 'bubble-bullet' : ''}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="bubble-footer">
            {formattedTime && <span className="bubble-time">{formattedTime}</span>}
            
            <div className="bubble-actions-group">
              {!isUser && isSpeechSynthesisSupported() && (
                <button
                  type="button"
                  className={`bubble-action-btn ${isPlayingAudio ? 'active-speaking' : ''}`}
                  onClick={toggleAudio}
                  title={isPlayingAudio ? 'Stop reading' : 'Read advice aloud'}
                  aria-label={isPlayingAudio ? 'Stop reading' : 'Read advice aloud'}
                >
                  {isPlayingAudio ? <IconStopCircle size={15} /> : <IconVolume2 size={15} />}
                  {isPlayingAudio && <span className="speaking-wave" aria-hidden="true">🔊</span>}
                </button>
              )}

              <button
                type="button"
                className="bubble-action-btn bubble-copy-btn"
                onClick={handleCopy}
                title={t('chat_copy')}
                aria-label={t('chat_copy')}
              >
                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isUser && (
        <div className="bubble-avatar user-avatar" aria-hidden="true">
          <IconUser size={16} />
        </div>
      )}
    </div>
  );
}
