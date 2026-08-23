import { useLanguage } from '../context/LanguageContext';
import './LanguageToggle.css';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-toggle" role="group" aria-label="Choose language / భాషను ఎంచుకోండి">
      <button
        type="button"
        className={`lang-toggle-btn ${language === 'Telugu' ? 'active' : ''}`}
        onClick={() => setLanguage('Telugu')}
        aria-pressed={language === 'Telugu'}
        title="తెలుగులో చూడండి"
      >
        తెలుగు
      </button>
      <button
        type="button"
        className={`lang-toggle-btn ${language === 'English' ? 'active' : ''}`}
        onClick={() => setLanguage('English')}
        aria-pressed={language === 'English'}
        title="View in English"
      >
        English
      </button>
    </div>
  );
}
